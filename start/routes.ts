import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const BotController = () => import('#controllers/bots_controller') // ya lo tienes
const BotConversationsController = () => import('#controllers/bot_conversations_controller')

router.get('/', async () => {
  return {
    ok: true,
    service: 'pos-bot-api',
  }
})
// Rutas existentes bot/company-by-phone y bot/sales-report
router
  .group(() => {
    router.get('bot/company-by-phone', [BotController, 'companyByPhone'])
    router.get('bot/sales-report', [BotController, 'salesReport'])

    // 👇 nuevas rutas de conversación
    router.get('bot/conversations/by-phone', [BotConversationsController, 'showByPhone'])
    router.post('bot/conversations', [BotConversationsController, 'store'])
    router.post('bot/conversations/:id/messages', [BotConversationsController, 'addMessage'])
  })
  .prefix('api')
  .use(middleware.botAuth())
