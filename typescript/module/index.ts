import addSuffix from "./cjs/util";
import { showName } from "./cjs/util";

const nameStr = "ts-module";

console.log(addSuffix(nameStr));

console.log(showName());

// 编译命令
// tsc index.ts --esModuleInterop --module commonjs --target ES2019
