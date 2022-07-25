const {word} = require('./config')

var num = 1;
function increase () {
    console.log(word)
    return num++;
}

module.exports = {num, increase}