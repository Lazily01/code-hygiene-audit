import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MCP_PATH = path.resolve(__dirname, '../mcp/index.js');
const FIXTURES_DIR = path.resolve(__dirname, 'fixtures');

// Helper to interact with the stdio MCP server
function callMcp(requests) {
  return new Promise((resolve, reject) => {
    const proc = spawn('node', [MCP_PATH], {
      stdio: ['pipe', 'pipe', 'inherit']
    });

    const responses = [];
    let buffer = '';

    proc.stdout.on('data', (chunk) => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          responses.push(JSON.parse(line));
        } catch (e) {
          reject(new Error(`Failed to parse response: ${line}`));
        }
      }
    });

    proc.on('error', reject);

    for (const req of requests) {
      proc.stdin.write(JSON.stringify(req) + '\n');
    }

    setTimeout(() => {
      proc.kill();
      resolve(responses);
    }, 1200);
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

    const tools = responses[1].result.tools;
    assert.equal(tools.length, 4);
    const toolNames = tools.map((t) => t.name);
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

  await t.test('5. 综合巡检清单：一键生成结构化 P0~P3 审计报告', async () => {
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
    assert.ok(resultText.includes('用户确认前严禁擅动源码'));
  });
});
