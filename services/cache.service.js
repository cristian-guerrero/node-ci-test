
const mongoose = require('mongoose')
const redis = require('redis')
const util = require('util')
const keys = require('../config/keys')


const client = redis.createClient(keys.redisUrl)
client.hget = util.promisify(client.hget)
const exec = mongoose.Query.prototype.exec

mongoose.Query.prototype.exec = async function () {
  if (!this.useCache) {
    //  console.log('doesnt catch')
    return exec.apply(this, arguments)
  }

  const key = JSON.stringify(Object.assign({}, this.getQuery(), {
    collection: this.mongooseCollection.name
  }))

  const cacheValue = await client.hget(this.hashKey, key)
  if (cacheValue) {
    // console.log('cacheValue', cacheValue)
    const doc = JSON.parse(cacheValue)
    return Array.isArray(doc) ? doc.map(x => new this.model(x)) : new this.model(doc)
  }


  const result = await exec.apply(this, arguments)
  client.hset(this.hashKey, key, JSON.stringify(result), 'EX', 10)
  console.log('mongoose', result)

  return result
}

mongoose.Query.prototype.cache = function (options = {}) {
  this.useCache = true
  this.hashKey = JSON.stringify(options.key || '')
  return this
}

module.exports = {
  clearHash(hashKey) {
    client.del(JSON.stringify(hashKey))
  }
}