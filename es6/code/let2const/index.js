// 1. 基本使用方法
// {
//   let a = 0;
//   var b = 1
// }

// console.log(b); // 1
// console.log(a); // ReferenceError: a is not defined

// 2.for循环中使用let和var
// for (let index = 0; index < 10; index++) {
//   console.log(index); // 输出0-9
// }

// console.log(index); // ReferenceError: index is not defined

// for (var j = 0; j < 10; j++) {
//   console.log(j); // 输出 0-9
// }

// console.log(j); // 10

// for (let index = 0; index < 5; index++) {
//   let index = 'test'
//   console.log(index);
// }

// 3.变量提升

// console.log(foo); // undefinded
// var foo = 1;

// console.log(bar); // ReferenceError: bar is not defined
// let bar = 2;

// 4.暂时性死区

// let x = 'tdz outer';

// (function(){
//   console.log(x);
//   let x = 'tdz inner'
// })();

// 5.不允许重复声明

// function t () {
//   let a = 10;
//   var a = 2; // Duplicate declaration "a"
// }


// 6.块级作用域

// var t = new Date()

// function f() {
//   console.log(t); // undefined
//   if(false) {
//     var t = 'hello'
//   }
// }

// f();

// var s = 'hello'
// for (var i = 0; i < s.length; i++) {
//   console.log(s[i]);
// }

// console.log(i);

// function f() {
//   let n = 5;
//   if(true) {
//     let n = 10
//   }
//   console.log(n);
// }

// for (var index = 0; index < 3; index++) {
//   (function(){
//     var j = index
//     setTimeout(function(){
//       console.log(j);
//     }, 1000)
//   })()
// }


// 7.块级作用域与函数声明

// function f() {
//   console.log('outside');
// }

// (function(){
//   function f() {
//     console.log('inside');
//   }
//   f();
// }())
// 'use strict'
// if(true) {
//   function f() {}
// }

// 报错
// 'use strict'
// if(true) 
//   function f() {}

// let x = do {
//   let t = f()
//   t * t + 1
// }

// 8. const

// const MAX = 1
// console.log(MAX);
// MAX = 2

// const foo = {}

// foo.prop = 133
 
// console.log(foo);

// foo = {}