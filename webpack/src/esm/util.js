const { cjsGetTime } = require( '../commonjs/util');

function esmGetTime() {
    console.log('esGetTime')
    cjsGetTime()
    return 'esGetTime' + Date.now();
}


function esmAddEmoji(source) {
    return source + '-💩';
}
export { esmAddEmoji, esmGetTime };

const esmName = 'ESM';

export default esmName;