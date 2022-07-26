import esmName, { esmAddEmoji } from '../esm/util';

function cjsGetTime() {
    return 'cjsGetTime' + Date.now()
}


function cjsFormatStr(source) {
    return esmAddEmoji('cjsPrefix-' + source);
}

console.log(esmName)

module.exports = {
    cjsGetTime,
    cjsFormatStr
}