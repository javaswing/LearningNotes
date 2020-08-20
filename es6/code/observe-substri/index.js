
const data = {
  name: ''
}

function say(name) {
  if(name === '亚索') {
    console.log('我是' + name+ ', 哈撒king');
  } else if (name === 'tm') {
    console.log('我是' + name + ', 哈哈哈');
  }
}

Object.keys(data).forEach(key => {
  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get () {
      return data[key]
    },
    set (val) {
      console.log('set value');
      say(val)
    }
  })
})

data.name = 'tm'