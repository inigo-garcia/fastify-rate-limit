'use strict'

const t = require('tap')
const test = t.test
const buildFastify = require('./buildFastify')

test('default 404', async t => {
  t.plan(12)

  const fastify = await buildFastify()
  t.tearDown(() => fastify.close())

  // First call
  let response = await fastify.inject({
    method: 'GET',
    url: '/notSupported'
  })
  t.strictEqual(response.statusCode, 404)
  t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')

  // Second call
  response = await fastify.inject({
    method: 'GET',
    url: '/notSupported'
  })
  t.strictEqual(response.statusCode, 404)
  t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
  t.notOk(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-limit'))
  t.notOk(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-remaining'))
  t.notOk(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-reset'))

  // Third call (it should return 409 error)
  response = await fastify.inject({
    method: 'GET',
    url: '/notSupported'
  })
  t.strictEqual(response.statusCode, 404)
  t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
  t.notOk(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-limit'))
  t.notOk(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-remaining'))
  t.notOk(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-reset'))
})

test('successfull request', async t => {
  t.plan(15)

  const fastify = await buildFastify()
  t.tearDown(() => fastify.close())

  // First call
  let response = await fastify.inject({
    method: 'GET',
    url: '/'
  })
  t.strictEqual(response.statusCode, 200)
  t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
  t.ok(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-limit'))
  t.ok(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-remaining'))
  t.ok(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-reset'))

  // Second call
  response = await fastify.inject({
    method: 'GET',
    url: '/'
  })
  t.strictEqual(response.statusCode, 200)
  t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
  t.ok(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-limit'))
  t.ok(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-remaining'))
  t.ok(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-reset'))

  // Third call (it returns 429 error)
  response = await fastify.inject({
    method: 'GET',
    url: '/'
  })
  t.strictEqual(response.statusCode, 429)
  t.strictEqual(response.headers['content-type'], 'application/json; charset=utf-8')
  t.ok(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-limit'))
  t.ok(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-remaining'))
  t.ok(Object.prototype.hasOwnProperty.call(response.headers, 'x-ratelimit-reset'))
})
