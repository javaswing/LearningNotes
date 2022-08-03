
function addSuffix(str ) {
    return str + ' 👉CJS'
}

const name = 'I am cjs module';


module.exports = {
    addSuffix,
    name
}