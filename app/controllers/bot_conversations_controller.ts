// app/controllers/bot_conversations_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import BotConversation from '#models/bot_conversation'
import BotConversationMessage from '#models/bot_conversation_message'

export default class BotConversationsController {
  // GET /api/bot/conversations/by-phone?phone=&restaurantId=
  public async showByPhone({ request, response }: HttpContext) {
    const phone = String(request.qs().phone || '').trim()
    const restaurantId = Number(request.qs().restaurantId || 0)

    if (!phone || !restaurantId) {
      return response.badRequest({ error: 'phone y restaurantId requeridos' })
    }

    const conv = await BotConversation.query()
      .where('phone', phone)
      .andWhere('restaurant_id', restaurantId)
      .first()

    return response.ok(conv || null)
  }

  // POST /api/bot/conversations
  public async store({ request, response }: HttpContext) {
    const { phone, restaurantId, state, lastIntent, lastMessage } = request.only([
      'phone',
      'restaurantId',
      'state',
      'lastIntent',
      'lastMessage',
    ])

    if (!phone || !restaurantId) {
      return response.badRequest({ error: 'phone y restaurantId requeridos' })
    }

    const conv = await BotConversation.updateOrCreate(
      { phone, restaurantId },
      {
        state: state ?? null,
        lastIntent: lastIntent ?? null,
        lastMessage: lastMessage ?? null,
      }
    )

    return response.ok(conv)
  }

  // POST /api/bot/conversations/:id/messages
  public async addMessage({ params, request, response }: HttpContext) {
    const conv = await BotConversation.find(params.id)
    if (!conv) return response.notFound({ error: 'conversation_not_found' })

    const { role, content, intent, intentPayload } = request.only([
      'role',
      'content',
      'intent',
      'intentPayload',
    ])

    if (!role || !content) {
      return response.badRequest({ error: 'role y content requeridos' })
    }

    const msg = await BotConversationMessage.create({
      conversationId: conv.id,
      role,
      content,
      intent: intent ?? null,
      intentPayload: intentPayload ?? null,
    })

    return response.created(msg)
  }
}
