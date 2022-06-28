let face = '😄';
// exports和module.exports是属于commonjs的规范。默认情况下如果不使用exports或者module.exports进行导出，默认导出为 {} 即空对象
// 1. 如果一个commonjs文件中单独使用exports进行导出，需要使用export.xx = xx这样的方式，为导出对象添加属性
// 1.1 如果直接使用exports = xxx方式，则会使下面的exports输出失效。下面代码导出为 {}
// exports = '更新指针';
// exports.feeling = '😍';
// exports.face = '🥲';
// 1.2 如果直接使用exports = xxx方式，放在最下面下面代码导出为 { feeling: '😍', face: '🥲' }
// exports.feeling = '😍';
// exports.face = '🥲';
// exports = '更新指针';
// exports.face2 = '222';
/** 从上面的测试结果来看，exports会首先在exports导出的对象上添加属性。但是如果你直接使用exports = xxx，会导出在此之后的导出都无效 */


// 2. 使用module.exports进行导出
// 2.1 一个文件中同时存在exports和module.exports最终的导出都是以module.exports为主。以下代码运行结果为：{ feeling: '😍' }
// exports.feeling = '😍';
// exports.face = '🥲';
module.exports = {
    feeling: '😍',
    face: face
  }

/** ===========总结=========== */
// 1. 在写commonjs的代码时，最好只使用module.exports进行导出，毕竟exports仅仅只是一个辅助方法。主力还是module.exports
// 2. exports的使用方法为exports.xxx = xxx 方式使用