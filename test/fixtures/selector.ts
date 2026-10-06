// 回归夹具：#feed / #cab / #123 是 CSS id 选择器 / issue 引用，不是颜色，
// 不得被 Token 漂移扫描误报。
const feedEl = document.querySelector('#feed');
const cabEl = document.querySelector('#cab');
const issueRef = '#123';

export const selectorFixture = { feedEl, cabEl, issueRef };
