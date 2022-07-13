(function(root, factory){
     if(typeof module === 'object' && module.exports) { // CommonJS
        console.log('执行了CommonJS规范')
        module.exports = factory()
    } 
    // 先判断AMD规范
    // @see https://github.com/favrio/notes/issues/4
    else if(typeof define === 'function' && define.amd) {
        console.log('执行了AMD规范')
        define(factory)
    } else if (typeof define === "function" && define.cmd) {
        // @see https://github.com/Ziphwy/Blog/issues/8
        console.log('执行了CMD规范')
        define(function(require, exports, module) {
            module.exports = factory();
        });
    } else { // 如果都不是以上模块环境，就封装成 IIFE 模块
        console.log('window Global')
        root.returnExports = factory() 
    }
}(this, function() {
    function Time() {
        this._date = new Date();
    }
    return {
        Time: Time,
        name: 'umd-depended'
    }
}))
