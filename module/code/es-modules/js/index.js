import { add, addInit, computeInit } from "./add.js";
import { increment } from "./increment.js";

console.log('3 + 2 = ', add(3,2))
console.log('3 - 2 = ', increment(3, 2))

console.log('index.js addStr = ', addInit)
computeInit()
console.log('index.js addStr = ', addInit)