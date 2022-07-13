define(function(require) {
    // 先require就会先加载该文件
    var add = require('./add').add;
    var inc = require('./increment').increment;
    
    console.log(`2 + 3 = `, add(2,3))
    // console.log(`5 - 3 = `, inc(5,3))
});