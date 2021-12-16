## 前言
这是最近做项目时遇到的一个TS类型描述问题，通过自己的摸索与寻找，找一到了一个比较优雅的解决方案，在此记录一下。
​

有如下代码：
```typescript
class Conf {
  constructor(conf = { width: 800, height: 480, render: "canvas" }{}) {
    this.conf = conf;
    this.copyFromMultipleVal(conf, 'width', 'w', 800);
 
  }
  copyFromMultipleVal(conf, key, otherKey, defalutVal) {
    this.conf[key] = conf[key] || conf[otherKey] || defalutVal;
  }
}
```
现在需要你给上面的`Conf`修改为ts语言时，我第一次写的时候如下：
```typescript
interface ConfOptions {
  width?: number;
  w?: number;
  height?: number;
  render?: string;
}

interface ConfOptionsTrue {
  width: number;
  height: number;
  render: string;
}

class Conf {
  conf: ConfOptionsTrue;
  constructor(conf: ConfOptions = { width: 800, height: 480, render: "canvas" }) {
    // @ts-ignore
    this.conf = conf;
    this.copyFromMultipleVal(conf, "width", "w", 800);
  }

  copyFromMultipleVal(conf, key, otherKey, defalutVal) {
    this.conf[key] = conf[key] || conf[otherKey] || defalutVal;
  }
}
```
## 分析
其实最上面的那段js代码，就是一个普通的类。但是在实例化的时候，为了兼容各种各样的神奇参数，不得不做的hack（这样的代码在修改旧代码的时候特别常见）。把他修改为TypeScript的，添加的类型并不准确，在别人使用你的这个类的时候，类型并不能准确的告诉他 `width`和`w`其实是一个属性，在代码里面若想设置`width`属性的值会有以下情况：
```typescript
const c1 = new Conf({ width: 100, w: 200 });
const c2 = new Conf({ width: 100 });
const c3 = new Conf({ w: 200 });
```
其实我们写TS类型，并不想达到如下的效果。希望类型提示的更加准确些。
## 问题
总结下来，若想设置`width`就是：(w、width)**两个属性有且仅有一个不能为空。**
## 解决
**如果一个类型只有一个或者两个这样的参数，我们可以使用**[**联合类型**](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)结合[never](https://jkchao.github.io/typescript-book-chinese/typings/neverType.html)进行屏蔽相对立的属性。
```typescript
interface BaseConfOptions {
  height?: number;
  h?: number;
  parallel?: number;
  frames?: number;
  clarity?: string;
  renderClarity?: string;
}

type ConfOptions =
  | (BaseConfOptions & { width?: number; w?: never })
  | ({ w?: number; width?: never } & BaseConfOptions);
```
效果如下：
![image.png](https://cdn.nlark.com/yuque/0/2021/png/718520/1639663955178-fe114e4a-6d69-4f1f-91cd-4dd5f3a006e2.png#clientId=u875c454c-a4b1-4&from=paste&height=154&id=u934d9d58&margin=%5Bobject%20Object%5D&name=image.png&originHeight=308&originWidth=988&originalType=binary&ratio=1&size=57729&status=done&style=none&taskId=u01e11aa9-5357-481e-bc06-c42058549f6&width=494)
堪称完美，用TS的智能类型提示，又让我们的代码更加的精准。
有没有更优雅的写法呢？肯定是有的，先上答案：
```typescript
type RequireOnlyOne<T, U extends keyof T = keyof T> = Omit<T, U> &
  {
    [K in U]-?: Required<Pick<T, K>> & Partial<Record<Exclude<U, K>, never>>;
  }[U];
```
修改代码如下：
```typescript
type ConfOptionsOnlyOne = RequireOnlyOne<ConfOptions, "width" | "w" >;

class Conf {
  conf: ConfOptionsTrue;
  constructor(conf: ConfOptionsOnlyOne = { width: 800, height: 480, render: "canvas" }) {
    // @ts-ignore
    this.conf = conf;
    this.copyFromMultipleVal(conf, "width", "w", 800);
  }
}
```
## 理解表达式
咋一看这个类型有点复杂，但是我们拿一个例子一步步的拆解，来理解。
```typescript
type RequireOnlyOne<T, U extends keyof T = keyof T> = Omit<T, U> &
  {
    [K in U]-?: Required<Pick<T, K>> & Partial<Record<Exclude<U, K>, never>>;
  }[U];

interface Square {
  width: number;
  height?: number;
  h?: number;
}
type Test = RequireOnlyOne<Square, "height" | "h">;
```

1. 先把最外面的泛型转换成真实，类型中的key
```typescript
type One = { width: number } & {
  height: Required<{ height?: number }> & Partial<{ h: never }>;
  h: Required<{ h?: number }> & Partial<{ height: never }>;
}["height" | "h"];
```

2. 把表达式中的 Required和Partial，转换下
```typescript
type Two = { width: number } & {
  height: { height: number; h?: never };
  h: { h: number; height?: never };
}["height" | "h"];
```

3. 最后再简化下，达到最终形态
```typescript
type Three =
  | { width: number; height: number; h?: never }
  | { width: number; h: number; height?: never };
```
## 其它
与这个类型相类似的，还有一个`RequireAtLeastOne`类型，即：**至少要选择一个属性**
```typescript
type RequireAtLeastOne<T, R extends keyof T = keyof T> = Omit<T, R> &
  {
    [K in R]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<R, K>>>;
  }[R];
```
两个辅助类型的示例请参考[这里](https://www.typescriptlang.org/play?#code/C4TwDgpgBAShCOBXAlgJwgeQHYBsTYgB4AVAGigFUoIAPYCLAEwGcoBrCEAewDMpioAXnade-AHxCoGALbJgJchUkAyALAAoKFADem7doDaAaSjIslALoBaAPwAuWAhTpGhAArIAxm0VRj4qpQ7gCGqMDIITiEcF5cqG4AojReOIiMRBTkAeRYEABuEKiBANz6UAC+hhSWZRqa5vSoPCFe0ADCXFg8GGARXax6WlAA7siMwAAWDlBYiDIARkV12iMzc4vL5ZMQyADmk8Dr80uoK1DoTEUzzMCo5nt1FZqaAPSvZlhNLW1QAEIhZgQTrdXr9LCDN4fbQ7faHY6bM5QgzTRwbU51d4GS4ZVA3O4PTHQi4MXHXRy3e5YR7I571DRY0CQKAgnp9ZADITI7QAHygAAoAUDWWCORCoCpdKNxlMERjRusCkVKgBKblQPn8nQKtEnZbSiao2ZK1CVCX-QHArps8HMFV1TRMjrW0UDbB4AhSOBINCYXD4PKEEXsgbkABEY0NYY1UAj0fEDo0jSKP2doJDEOIqEQ0CGqxlk11iPOsIOwCLGPKOKKFIJ1POhho9kpD0sjhCWBATxeGlSgNYrN05Ti3UcwdtWZz5xHlMQXmA8X5I54Y5dGeY7oD0GE2sjU0cAA4AAxH8ilw6OAAsx-I1dQjjDXg7+UB0YqKqHw20WIAAsBmNY+xYPEEDlNoUzIMwAB0y5SMu5zgZMkEwVwYAgAAYqgXAyAAsogOARGAOAQAAalES7WuGe6TGGVG0VAx5Hva5R0sOqEYVhuH4YRxFkTgFGjk4cQJIQLbUuQHYgOI5AcCAtZUns5BcFMRTGJw8kPOQGQtGkwB8RWRQfnmBgQdBy6GLJlhwdaFmcFZPJ8uZyk7KgakgPZfLaVEiB6VE5x0qxvYDMAUBeAAjFIeQjCy1paga+5QGFJ7kCMjgAEwnu+dQziFXhpZFEDRaycXUY4SVHqq2XBaFADMBVFbFu7pSelWaDloWXvVMXdPyzH0ligiDUNw0jaNY3jRNk1TdNM2zXN83zT2TpOD66AAILAAAMhAgLAAQfgwNQdCkqwsliAIwhnXwxCSMIsjyAdqjlMZRimOYsA2DM3ouBAbieD4fgBEEoThJE0T-b4ZBQMkqTpEQMDZIECYsYYMC1D2ybNK00AAMpIGEublKVsx6kiwznkcBlkzCcpbBogXLdtu2esI32+htTO3PteOIAT5AAOSTPzMaC7sZb8+IPbteWUCc3teRSC98WFgxmiBdLaWOHLLOfgYyuHqQYFQCrACchtfsbYsXolR5q0AA)
## 总结
在日常的开发过程中我们遇到TS类型的问题，尽可能的多思考下，怎么样优雅的处理问题，也可以多看一些辅助类型源码（[utility-types](https://github.com/piotrwitek/utility-types)），帮助我们更好的理解TS。也让TS更好的服务于我们的代码。否则，我们仅仅处于只能简单的看懂TS和简单的使用。没有理解到TS的精髓。
## 参考

- [Typescript type shenanigans 2: specify at least one property](https://realfiction.net/2019/02/03/typescript-type-shenanigans-2-specify-at-least-one-property)
- [React typescript interface only one of two required [duplicate]](https://pretagteam.com/question/react-typescript-interface-only-one-of-two-required-duplicate)
- [typescript interface require one of two properties to exist](https://stackoverflow.com/questions/40510611/typescript-interface-require-one-of-two-properties-to-exist/49725198#49725198)
