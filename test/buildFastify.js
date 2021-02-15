const Fastify = require('fastify')
const rateLimit = require('../index')

async function buildFastify () {
  const fastify = Fastify()
  fastify.register(rateLimit, { max: 2, timeWindow: 1000 })

  fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
  })
  await fastify.listen(3000)
  return fastify
}

module.exports = buildFastify
