(function(root, factory){
    typeof define === 'function' && define.amd ? define(['umdModuleDepended'], factory) :
    typeof module === 'object' && module.exports ? module.exports = factory(require('./umdModuleDepended')) : root.returnExports = factory(root.returnExports)
}(this, function(umdModule) {
    console.log('我调用了依赖模块', umdModule)
    return {
        name: 'umd-module'
    }
}))