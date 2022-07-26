import { esmAddEmoji } from './esm/util';

const { cjsFormatStr } = require( './commonjs/util');

const name1 = 'javaswing';

const name2 = '李白';


console.log(cjsFormatStr(name1))


console.log(esmAddEmoji(name2))