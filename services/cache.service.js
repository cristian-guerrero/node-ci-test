
const mongoose = require('mongoose')

const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.exec = function () {

  console.log('About to run a Query')
  return exec.apply(this, arguments)
}