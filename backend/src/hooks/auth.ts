import { User } from '@prisma/client'
import { onRequestAsyncHookHandler } from 'fastify'
import { SKIP_ROUTE_HOOKS } from '@/const/skipRouteHooks'
import { Hook } from '@/hooks/types'

declare module 'fastify' {
  interface FastifyRequest {
    user?: Pick<User, 'id' | 'username'>
  }
}

// TODO we need to exclude swagger, so add this hook only for specific subset?
export const authHook: Hook<'onRequest'> = {
  handler: async (request, reply) => {
    const { url } = request.routeOptions
    console.log(url)

    // TODO костыль
    if (url && /^\/swagger\/.*/.test(url)) {
      console.log('SWAG')
      return
    }

    if (url && SKIP_ROUTE_HOOKS.auth.includes(url)) {
      return
    }
    const { sessionId } = request.cookies
    if (!sessionId) {
      console.log('UNAUTH', request.cookies)
      reply.code(401)
      throw { error: 'UNAUTHORIZED' }
    }
    try {
      const session = await request.server.prisma.authSession.findUnique({
        where: { data: sessionId },
        select: { user: { select: { id: true, username: true, role: true } } },
      })
      request.user = session?.user
    } catch (err) {
      throw err
    }
  },
  stage: 'onRequest',
}
