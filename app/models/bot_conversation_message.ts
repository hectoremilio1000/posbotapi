// app/models/bot_conversation_message.ts
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import BotConversation from './bot_conversation.js'

export default class BotConversationMessage extends BaseModel {
  public static table = 'bot_conversation_messages'

  @column({ isPrimary: true })
  declare id: number

  @column({ columnName: 'conversation_id' })
  declare conversationId: number

  @column()
  declare role: 'user' | 'assistant' | 'system'

  @column()
  declare content: string

  @column()
  declare intent?: string | null

  @column({ serializeAs: 'intentPayload' })
  declare intentPayload?: any | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => BotConversation)
  declare conversation: BelongsTo<typeof BotConversation>
}
