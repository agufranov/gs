import { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import cookie from '@fastify/cookie'

export default fp(async (server: FastifyInstance) => {
  server.register(cookie)
})
