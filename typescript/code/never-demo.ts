const error = (msg) => {
  throw new Error(msg);
}; // never类型

interface Person {
  name: string;
  age: number;
}

/**
 * Exclude from T those types that are assignable to U
 */
//  type Exclude<T, U> = T extends U ? never : T;

/**
 * Extract from T those types that are assignable to U
 */
//  type Extract<T, U> = T extends U ? T : never;

type A = "🥶" | "🤯" | "👺" | "🆚";

type B = "😈" | "🤯" | "👺" | "🆘";

type C = Exclude<A, B>; // "🥶" '🆚'
// Exclude<T, U>：返回T中不包含U的类型

type D = Extract<A, B>; // "🤯" '👺'
// Extract<T, U>：返回T中包含U的类型

// 注：Exclude和Extract，一般主要用于字符类型的过滤，用于辅助。要过滤某个对象的某个属性，可以辅助使用 keyof T返回对象的属性，然后使用Exclude和Extract过滤。

// 从上面的例子可以看出，当我们不需要让编译器不捕获当前值或者类型的时候，可以使用never类型

type PickType<T, K extends keyof T> = {
  [P in K]: T[P];
};

type S = PickType<Person, "age">;

type OmitType<T, K extends keyof T> = PickType<T, Exclude<keyof T, K>>;

type O = OmitType<Person, "age">;

// 思考一个问题：如果一个对象(Square)中包含三个属性：width、height 、h，height和h这两个属性都为number类型，但是两者必须且只能存在一个，如何解决？

// interface Square {
//     width: number;
//     height: number;
//     h: number;
// }

// 1. 首先想到的是如下做法：
// interface BaseProps {
//     width: number;
// }

// interface SquareProps1 extends BaseProps {
//     height: number;
// }

// interface SquareProps2 extends BaseProps {
//     h: number;
// }

// type Square = SquareProps1 | SquareProps2;

// type SKey = keyof Square; // "width"

// const obj: Square = {
//     width: 1,
//     height: 2,
//     h: 3
// }

// 但是这样写也是可以的，没有满足有且只有一个的需求， height h

interface Square {
  width: number;
  height?: number;
  h?: number;
}

type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Omit<T, Keys> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

// 分析 RequireAtLeastOne

type one = { width: number } & {
  height: Required<{ height?: number }> & { h?: number };
  h: Required<{ h?: number }> & { height?: number };
}["height" | "h"];

type two = { width: number } & {
  height: { height: number; h?: number };
  h: { h: number; height?: number };
}["height" | "h"];

type third = { width: number } & { height: number; h?: number } & {
  h: number;
  height?: number;
};

// type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
//   T,
//   Exclude<keyof T, Keys>
// > &
//   {
//     [K in Keys]-?: Required<Pick<T, K>> &
//       Partial<Record<Exclude<Keys, K>, undefined>>;
//   }[Keys];

type RequireOnlyOne<T, U extends keyof T = keyof T> = Omit<T, U> &
  {
    [K in U]-?: Required<Pick<T, K>> & Partial<Record<Exclude<U, K>, never>>;
  }[U];

type One = { width: number } & {
  height: Required<{ height?: number }> & Partial<{ h: never }>;
  h: Required<{ h?: number }> & Partial<{ height: never }>;
}["height" | "h"];

type Two = { width: number } & {
  height: { height: number; h?: never };
  h: { h: number; height?: never };
}["height" | "h"];

type Three =
  | { width: number; height: number; h?: never }
  | { width: number; h: number; height?: never };

//  type Three = {width: number; height: number; h?: never} | {width: number, h: number, height?:never}

type Test = RequireOnlyOne<Square, "height" | "h">;

const obj: Three = {
  width: 1,
  //   height: 2,
  h: 3,
};

interface ConfOptions {
  width?: number;
  w?: number;
  height?: number;
  render?: string;
}

// interface BaseConfOptions {
//   height?: number;
//   h?: number;
//   render?: string;
//   renderer?: string;
// }

// type ConfOptions =
//   | (BaseConfOptions & { width?: number; w?: never })
//   | ({ w?: number; width?: never } & BaseConfOptions);

type ConfOptionsOnlyOne = RequireOnlyOne<ConfOptions, "width" | "w">;

interface ConfOptionsTrue {
  width: number;
  height: number;
  render: string;
}

class Conf {
  conf: ConfOptionsTrue;
  constructor(
    conf: ConfOptionsOnlyOne = { width: 800, height: 480, render: "canvas" }
  ) {
    // @ts-ignore
    this.conf = conf;
    this.copyFromMultipleVal(conf, "width", "w", 800);
  }

  copyFromMultipleVal(conf, key, otherKey, defalutVal) {
    this.conf[key] = conf[key] || conf[otherKey] || defalutVal;
  }
}

const c1 = new Conf({ width: 100, w: 200 });
const c2 = new Conf({ width: 100 });
const c3 = new Conf({ w: 200 });
const c4 = new Conf();
