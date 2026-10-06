// 回归夹具：formatMoney 仅在本文件内被 renderPrice 使用，renderPrice 又被 PriceApp 引用。
// 三者均为活代码 —— 任何被判「全仓零引用」都是死代码扫描器同文件引用误报的回归。
export function formatMoney(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function renderPrice(cents: number): string {
  return `${formatMoney(cents)} yuan`;
}
