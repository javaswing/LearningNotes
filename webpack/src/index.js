// CommonJS 代码

// const {num ,increase} = require('./commonjs/count')

// console.log('num is ', num)

// increase()

// console.log('after increase num is ', num)


// ESM 代码

import {
  increase,
  num,
} from './esm/increase';

const {word} = require('./commonjs/config')

console.log('%c esm num is ','color: red;font-size: 18px;', num)

increase();

console.log(word)

console.log('%c esm after increase num is ','color: red;font-size: 18px;', num)