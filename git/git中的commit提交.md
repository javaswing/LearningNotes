使用`git`这么长时间了，特别是去年在git的使用上学到很多的东西在这里记录下：

## Commit message 部分
### 相关命令

```shell
git commit -m "xxxx"
```
这个命令中的`xxx`对应的就是message,在这里想写什么就写什么，也可以不填。很长一段时间都不太明白写这个东西的作用。也没有太在意，等到进入到大的团的时候，才知道这种东西的重要性，`commit message`可以给我们提供一些重要的信息，比如：你提交这次代码的作用、涉及的文件、详细说明。这无论对于自己还是别人都是有很大的帮助。结合 [`Commitizen`](https://github.com/commitizen/cz-cli)和`git rebase`，维护一个**整洁、有序、可追溯**的**git树**是很有必要性的。同时也可以给我们生成`Change Log`。


### 作用
1. 提供更多的历史信息，方便快速浏览。
下图为我之前的规范格式
```shell
git log  HEAD --pretty=format:%s
```
![image](https://raw.githubusercontent.com/javaSwing/LearningNotes/master/images/git/git-commit1.png)

2.可以过滤某些commit（比如文档改动），便于快速查找信息。
```shell
git log <last release> HEAD --grep feature
```
仅过滤为`feature`特性的提交

3.可以直接从`commit message`中生成Change Log
![image](https://raw.githubusercontent.com/javaSwing/LearningNotes/master/images/git/git-commit2.png)

### commit message 格式
提交的`commit message`格式如下：分为`Header`、`Body`、`Footer`

```html
<type>(<scope>):<subject>
// 空一行
<body>
// 空一行
<footer>
```

其中`Header`是必须的、`body`和`footer`是可以省略的。

不管哪一部分，任何一行都不能超过**72**或**100**个字符。这是为了避免自动换行影响美观

1.`Header`

`Header`格式中包含：`type`、`scope`、`subject`这三个字段

- `type`
type用于说明本次`commit`的提交类型，主要为以下几种：

```html
 feat：新功能（feature）
 fix: 修复Bug (fixedBug)
 docs: 修改文件
 style: 修改代码格式化方式，不个性代码
 refactor: 重构（即不是新功能，也不bug修复）
 build: 发布功能修改（gulp、npm）
 ci: 自动化构建修改
 chore：其它修改（不包含src和test目录）
 revert：重置到上次提交
 perf：性能优化
 test: 测试提交
```

如果`type`为`feat`和`fix`，则该commit 必须会出现在Change Log中，其它的是提交是你决定要不要放到Change log中

- `Scope`
scope这次提交的影响范围，可以是某个目录、文件、业务

- `Subject`
`subject`是commit 目的的简短描述，不超过50个字符。

2.`Body`
body是对本次`commit`的详细描述：可以有多行

3.`Footer`
有两种情况：
1.不兼容更新
如果当前代码不兼容之前的代码不兼容，则Footer以`BREAK CHANGE`开头，

```
BREAKING CHANGE: isolate scope bindings definition has changed.

To migrate the code follow the example below:

Before:

scope: {
  myAttr: 'attribute',
}

After:

scope: {
  myAttr: '@',
}

The removed `inject` wasn't generaly useful for directives so there should be no code using it.
```
2.Issue
如果能当前`commit`是针对某个issue，可以在footer里这样写
```
Close #234
# 关闭多个
Close #234,#21,#12
```

### 工具

[Commitizen](https://github.com/commitizen/cz-cli)是一个撰写合格Commit message的工具




