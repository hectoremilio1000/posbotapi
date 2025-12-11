// app/middleware/bot_auth_middleware.ts
import type { HttpContext } from '@adonisjs/core/http'

export default class BotAuthMiddleware {
  public async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const secret = request.header('x-bot-secret')

    if (!secret || secret !== process.env.BOT_SHARED_SECRET) {
      return response.unauthorized({ error: 'bot unauthorized' })
    }

    await next()
  }
}
