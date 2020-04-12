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
- chrome下的执行结果
![image](https://raw.githubusercontent.com/javaSwing/LearningNotes/master/es6/docs/images/2.1.1.jpge)

- 自己搭建的环境
![image](https://raw.githubusercontent.com/javaSwing/LearningNotes/master/es6/docs/images/2.1.2.jpge)





### 变量提升


### 暂时性死区

### 不允许重复声明

## 块级作用域

