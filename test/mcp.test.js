import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MCP_PATH = path.resolve(__dirname, '../mcp/index.js');

/**
 * 与 stdio MCP server 交互：收齐全部期望响应即返回（按响应计数驱动），
 * 超时兜底返回已收到的响应，避免固定 sleep 造成的慢与 flaky。
 */
function callMcp(requests, { timeoutMs = 5000 } = {}) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [MCP_PATH], {
      stdio: ['pipe', 'pipe', 'inherit']
    });

    const responses = [];
    let buffer = '';
    let settled = false;

    const finish = (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      proc.kill();
      if (err) reject(err);
      else resolve(responses);
    };

    const timer = setTimeout(() => finish(), timeoutMs);

    proc.stdout.on('data', (chunk) => {
      if (settled) return;
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          responses.push(JSON.parse(line));
        } catch (e) {
          finish(new Error(`Failed to parse response: ${line}`));
          return;
        }
      }
      // 收齐期望数量的响应即收工
      if (responses.length >= requests.length) finish();
    });

    proc.on('error', (err) => finish(err));

    for (const req of requests) {
      proc.stdin.write(JSON.stringify(req) + '\n');
    }
  });
}

test('清道夫 (Scavenger) MCP 协议与自动化排查全链路真实性测试', async (t) => {
  await t.test('1. 协议自愈性：正确响应 initialize 与 tools/list', async () => {
    const responses = await callMcp([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      { jsonrpc: '2.0', id: 2, method: 'tools/list', params: {} }
    ]);

    assert.equal(responses.length, 2);
    assert.equal(responses[0].result.serverInfo.name, 'scavenger-mcp');
    assert.equal(responses[0].result.protocolVersion, '2024-11-05');
    // 版本号单一真相源：serverInfo 必须与 mcp/package.json 一致，不得各自硬编码
    const pkgVersion = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, '../mcp/package.json'), 'utf-8')
    ).version;
    assert.equal(responses[0].result.serverInfo.version, pkgVersion);

    const tools = responses[1].result.tools;
    assert.equal(tools.length, 4);
    const toolNames = tools.map((tool) => tool.name);
    assert.ok(toolNames.includes('scavenger_scan_token_drift'));
    assert.ok(toolNames.includes('scavenger_scan_dead_code'));
    assert.ok(toolNames.includes('scavenger_check_truth_split'));
    assert.ok(toolNames.includes('scavenger_generate_audit_report'));
  });

  await t.test('2. Token 漂移硬检：精准发现硬编码色值并忽略 token 定义文件', async () => {
    const responses = await callMcp([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'scavenger_scan_token_drift',
          arguments: { directory: 'test/fixtures', allowedTokensFile: 'tokens.ts' }
        }
      }
    ]);

    const resultText = responses[1].result.content[0].text;
    assert.ok(resultText.includes('发现 2 处设计 Token 漂移 (P2)'));
    assert.ok(resultText.includes('#ff5733'));
    assert.ok(resultText.includes('#00ff00'));
    assert.ok(resultText.includes('BadComponent.tsx'));
    // tokens.ts 中的颜色不应被误判为漂移
    assert.ok(!resultText.includes('#3b82f6'));
  });

  await t.test('3. 死代码与尸骸排查：精准捕获零引用导出和注释掉的代码块', async () => {
    const responses = await callMcp([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'scavenger_scan_dead_code',
          arguments: { directory: 'test/fixtures' }
        }
      }
    ]);

    const resultText = responses[1].result.content[0].text;
    // 捕获到无人调用的导出
    assert.ok(resultText.includes('completelyDeadExport'));
    assert.ok(resultText.includes('DeadModule.ts'));
    // 捕获到废弃注释尸骸
    assert.ok(resultText.includes('连续 4 行被注释的代码块'));
  });

  await t.test('4. 真相分裂诊断：同名函数在两处平行实现必须发出 P1 告警', async () => {
    const responses = await callMcp([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'scavenger_check_truth_split',
          arguments: {
            symbolOrKeyword: 'calculateDiscount',
            directory: 'test/fixtures'
          }
        }
      }
    ]);

    const resultText = responses[1].result.content[0].text;
    assert.ok(resultText.includes('真相分裂预警 (P1)：检测到 2 处平行定义'));
    assert.ok(resultText.includes('OrderService.ts'));
    assert.ok(resultText.includes('PaymentService.ts'));
  });

  await t.test('5. 综合巡检清单：一键生成结构化分级审计报告', async () => {
    const responses = await callMcp([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'scavenger_generate_audit_report',
          arguments: { directory: 'test/fixtures' }
        }
      }
    ]);

    const resultText = responses[1].result.content[0].text;
    assert.ok(resultText.includes('清道夫 (Scavenger) 自动化审计速报'));
    assert.ok(resultText.includes('Token 漂移'));
    assert.ok(resultText.includes('死代码与尸骸'));
    // P0/P1 必须显式标注「未覆盖」而非虚报覆盖范围
    assert.ok(resultText.includes('未覆盖'));
    assert.ok(resultText.includes('用户确认前严禁擅动源码'));
  });

  // --- 回归测试：以下用例对应 2026-10 修复的实测 bug，防止复发 ---

  await t.test('6. 回归：同文件内使用的导出不得误判为死代码', async () => {
    // SameFileUse.ts 的 formatMoney 在本文件被 renderPrice 调用，
    // renderPrice 又被 PriceApp 引用 —— 三者全是活代码
    const responses = await callMcp([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'scavenger_scan_dead_code',
          arguments: { directory: 'test/fixtures' }
        }
      }
    ]);

    const resultText = responses[1].result.content[0].text;
    assert.ok(!resultText.includes('`formatMoney`'), '同文件内被使用的导出被误判为死代码（bug 复发）');
    assert.ok(!resultText.includes('`renderPrice`'), '被外部文件引用的导出被误判为死代码（bug 复发）');
    assert.ok(!resultText.includes('`selectorFixture`'), '被外部文件引用的导出被误判为死代码（bug 复发）');
  });

  await t.test('7. 回归：CSS id 选择器与 issue 引用不得误报为颜色漂移', async () => {
    const responses = await callMcp([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'scavenger_scan_token_drift',
          arguments: { directory: 'test/fixtures', allowedTokensFile: 'tokens.ts' }
        }
      }
    ]);

    const resultText = responses[1].result.content[0].text;
    assert.ok(!resultText.includes('#feed'), 'CSS id 选择器 #feed 被误报为颜色（bug 复发）');
    assert.ok(!resultText.includes('#cab'), 'CSS id 选择器 #cab 被误报为颜色（bug 复发）');
    assert.ok(!resultText.includes('#123'), 'issue 引用 #123 被误报为颜色（bug 复发）');
    // 6 位高置信 hex 依然要报，防止修复矫枉过正
    assert.ok(resultText.includes('发现 2 处设计 Token 漂移 (P2)'));
  });

  await t.test('8. 回归：含正则元字符的符号名不得导致服务端报错', async () => {
    // LLM 调用时可能传带签名的形式，未转义会抛 "Unterminated group"
    const responses = await callMcp([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'scavenger_check_truth_split',
          arguments: { symbolOrKeyword: 'formatMoney(cents', directory: 'test/fixtures' }
        }
      }
    ]);

    assert.equal(responses[1].error, undefined, `不应返回 JSON-RPC 错误: ${JSON.stringify(responses[1].error)}`);
    const resultText = responses[1].result.content[0].text;
    // 转义后正则应正确工作：该签名恰好命中 SameFileUse.ts 的唯一定义（修复前直接 SyntaxError）
    assert.ok(
      resultText.includes('单一真相源验证通过'),
      `转义后应正常执行并正确命中定义，实际返回: ${resultText}`
    );
  });

  await t.test('9. 回归：allowedTokensFile 匹配不到文件时必须显式警告而非静默', async () => {
    const responses = await callMcp([
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: {} },
      {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'scavenger_scan_token_drift',
          arguments: { directory: 'test/fixtures', allowedTokensFile: 'no-such-file' }
        }
      }
    ]);

    const resultText = responses[1].result.content[0].text;
    assert.ok(resultText.includes('未匹配到任何文件'), '参数静默失效（bug 复发）');
  });
});
