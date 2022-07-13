define('math', function() {
    'use strict';

    var increment = function(a, b) {
        return a - b;
    }

    return {
        increment: increment
    }
});