## let 命令

`let`命令是`es2015`中新增的声明变量的方式与`var`不同的地方是：这是用这个命令声明的变量具有**块级作用域**。可以解决一些环境下必须要用[IIFF(立即执行函数)](https://developer.mozilla.org/zh-CN/docs/Glossary/%E7%AB%8B%E5%8D%B3%E6%89%A7%E8%A1%8C%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F)函数才能解决的问题。

### 基本用法
let命令的使用方法很简单，和`var`一样声明使用就好,但是声明的变量只在当前的代码块内有效。

```js
{
  let a = 0;
  var b = 1
}

console.log(b); // 1
console.log(a); // ReferenceError: a is not defined
```
从上面代码的运行结果可以看出来，使用`var`声明的变量变成了全局的变量，可以在代码块之外引用。但是，使用`let`声明的变量在，代码块之外使用就会报错。

#### 在`for`循环中使用`let`和`var`变量

- for循环中使用let和var
```js
for (let index = 0; index < 10; index++) {
  console.log(index); // 输出0-9
}

console.log(index); // ReferenceError: index is not defined

for (var j = 0; j < 10; j++) {
  console.log(j); // 输出 0-9
}

console.log(j); // 10
```
从上面的代码可以验证在**for循环中使用let声明的变量**，只存在于for循环的代码块中，不能在代码块之外。而**var声明的变量则是在代码块之外都可以正常使用**。

问题：考虑以下代码的输出 
```js
for (let index = 0; index < 5; index++) {
  let index = 'test'
  console.log(index);
}
```


> 这一块代码的执行结果我在`chrome`（ 80.0.3987.163）和自己配置的`babel`中出现了两个不同的结果。

TODO: 请在后面进行检查下搭建的环境
- chrome下的执行结果

![image](https://raw.githubusercontent.com/javaSwing/LearningNotes/master/es6/docs/images/2.1.1.jpeg)

- 自己搭建的环境

![image](https://raw.githubusercontent.com/javaSwing/LearningNotes/master/es6/docs/images/2.1.2.jpeg)


**结合书本上所说的：执行的结果应该为输出5次test，目前感觉应该是我目前搭建的环境的问题**

上面代码说明：for循环中声明的`index`变量和for代码体内声明的变量不是同一个变量。也就是代码体内为子作用域，而for循环为父级作用域。


### 变量提升

> 变量提升：在传统的`var`声明变量的方式中，**使用一个变量可以在声明前，默认值为`undefinded`**

```js
console.log(foo); // undefinded
var foo = 1;

console.log(bar); // ReferenceError: bar is not defined
let bar = 2
```
如果一个变量使用的是`let`方式声明，那么在使用之前一定要进行初始下，否则会报错。


### 暂时性死区 Temporal Dead Zone(TDZ)

> TDZ(暂时性死区)，只要进入作用域时，所有使用的变量都已经存在，但是是不可以获取的，只能初始化之后才能使用。这个过程就叫暂时死区。

```js
let x = 'tdz outer';

(function(){
  console.log(x); //  ReferenceError: Cannot access 'x' before initialization
  let x = 'tdz inner'
})();
```

chrome下执行： ReferenceError: Cannot access 'x' before initialization

暂时性死区的理解：
- 在`var`声明变量的时代，所有的变量都会系统自动进入声明，并且初始化的值为`undefined`。
- 用`let`、`const`声明变量时，解析引擎默认为解析所有变量，但是并不能在真正声明变量代码之前使用，这期间叫暂时死区。

暂时性死区对于`let`、`const`声明的变量都是一样的处理。且暂时死是一种**运行时错误**。


### 不允许重复声明

```js
function t () {
  let a = 10;
  var a = 2; // Duplicate declaration "a"
}
```
在一个块级作用域内，一个变量只能声明一次。

## 块级作用域

### 为什么需要块级作用域

在`ES5`的时候只有全局作用域和函数作用域，没有块级作用域,会导致以下问题：

- 内层变量覆盖外层变量

```js
var t = new Date()

function f() {
  console.log(t); // undefined
  if (false) {
    var t = 'hello'
  }
}

f();
```
分析：导致这种情况的原因是内层变量的`t`覆盖了，全局的`t`。导致全局的变量为`undefined`。

- 用来计数的循环变量泄露为全局变量
 
```js
var s = 'hello'
for (var i = 0; i < s.length; i++) {
  console.log(s[i]); // h e l l o 依次输出
}

console.log(i); // 5
```
上面的代码中用来循环的变量，i在循环完成之后。泄露成了全局变量。


### ES6的块级作用域

```js
function f() {
  let n = 5;
  if(true) {
    let n = 10;
  }
  console.log(n); // 5
}
```
块级作用域的出现在，使得[IIFF(立即执行函数)](https://developer.mozilla.org/zh-CN/docs/Glossary/%E7%AB%8B%E5%8D%B3%E6%89%A7%E8%A1%8C%E5%87%BD%E6%95%B0%E8%A1%A8%E8%BE%BE%E5%BC%8F)不再必要了

```js
for (var index = 0; index < 3; index++) {
  setTimeout(function() {
    console.log(index); // 输出3次3
  }, 1000)
}


for (let index = 0; index < 3; index++) {
  setTimeout(function() {
    console.log(index); // 依次输出 0、1、2
  }, 1000)
}

// 使用IIFE加闭包模拟块级作用域
for (var index = 0; index < 3; index++) {
  (function(){
    var j = index
    setTimeout(function(){
      console.log(j);
    }, 1000)
  })()
}
```

### 块级作用域与函数声明

即函数中写别一个函数，这个函数也有应该有块级作用域。
```js
function f() {
  console.log('outside');
}

(function(){
  function f() {
    console.log('inside');
  }
  f();
}())
```
上段代码的执行结果是：`inside`,但是在真的在ES6浏览器上运行上面的代码会报错，

**ES6的块级作用域，只能在大括号的情况下成立，如果没有大括号是会报错的**
```js
'use strict'
if(true) {
  function f() {}
}


// 报错
'use strict'
if(true) 
  function f() {}
```
### do 表达式

本质上块级作用域就是一个语句，将多个操作封装在一起，没有返回值。

```js
let x = do {
  let t = f()
  t * t + 1
}
```
目前这是一个提案，并没有实现。

## `const`命令

const和let声明变量的方式，基本相同，但是有一点是不同的，就是`const`一旦声明，后面就不能进行修改。而且在书写的时候也，建议使用**全大写**的方式(特别是基本数据类型的时候)

```js
const MAX = 1
console.log(MAX);
```

const的本质，实际上并不是变量的值不得改动，而是变量指向的那个内存地址不得发动（基本类型和引用类型）

```js

const foo = {}

foo.prop = 133;// 可以添加成功
console.log(foo);

foo = {} // 报错，"foo" is read-only
```

如果真想冻结一个对象，请使用[Object.freeze()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)。

## 参考
[理解ES6中的暂时死区(TDZ)](https://segmentfault.com/a/1190000008213835)

