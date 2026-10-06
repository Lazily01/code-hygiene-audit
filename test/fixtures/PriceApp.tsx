import { renderPrice } from './SameFileUse';
import { selectorFixture } from './selector';

// 故意用 export default（而非命名导出）：本夹具只负责建立引用关系，
// 避免给死代码扫描引入新的待扫描导出符号，污染既有断言。
function PriceApp() {
  return `${renderPrice(100)} ${selectorFixture.issueRef}`;
}

export default PriceApp;
