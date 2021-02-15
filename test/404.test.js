'use strict'

const t = require('tap')
const test = t.test
const buildFastify = require('./buildFastify')

test('default 404', async t => {
  t.plan(5)

  const fastify = await buildFastify()
  t.tearDown(() => fastify.close())

  const response = await fastify.inject({
    method: 'GET',
    url: '/notSupported'
  })
  t.strictEqual(response.statusCode, 404)
  t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
  t.notOk(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-limit'))
  t.notOk(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-remaining'))
  t.notOk(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-reset'))
})
