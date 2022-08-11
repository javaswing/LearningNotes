function addSuffix(str) {
  return str + " 👉CJS";
}

function showName() {
  return 'cjs'
}

module.exports = addSuffix;

module.exports.showName = showName;
