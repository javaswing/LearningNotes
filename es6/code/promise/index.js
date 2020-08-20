// promise实现

new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('promise-timeouts')
  })
}).then(res => {
  console.log(res);
}, err => {

})



const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function Promise2(executor) {
  var self = this
  this.status = PENDING
  this.reason = undefined
  this.value = undefined
  this.onResovedCallBack = []
  this.onRejectedCallBack = []

  // resolve
  function resolve(value) {
    if (self.status === PENDING) {
      self.value = value
      self.status = FULFILLED
    }
  }

  // reject
  function reject (reason) {
    if (self.status === PENDING) {
      self.status = REJECTED
      self.reason = reason
    }
  }
  
  try {
    executor(resolve, reject)
  } catch (error) {
    reject(error)
  }
  
}


Promise2.prototype.then = function(resolveFn, rejectFn) {
  
}