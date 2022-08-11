"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = __importDefault(require("./cjs/util"));
const util_2 = require("./cjs/util");
const nameStr = "ts-module";
console.log((0, util_1.default)(nameStr));
console.log((0, util_2.showName)());
// 编译命令
// tsc index.ts --esModuleInterop --module commonjs --target ES2019
