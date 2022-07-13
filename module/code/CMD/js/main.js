define('main', ["./add", './increment'],function(require, exports, module) {
    var inc = require('increment').increment;
    var add = require('add').add;
    
    console.log(`2 + 3 = `, add(2,3))
    console.log(`5 - 3 = `, inc(5,3))
});