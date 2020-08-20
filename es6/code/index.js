// 1. 原型链继承
function Parent () {
  this.name = '光辉'
}

function Children (age) {
  this.age = age
}

Parent.prototype.say = function () {
  console.log('say: ' + this.name);
}

Children.prototype = new Parent()


var c = new Children()

c.say()