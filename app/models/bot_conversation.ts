// app/models/bot_conversation.ts
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import BotConversationMessage from './bot_conversation_message.js'

export default class BotConversation extends BaseModel {
  public static table = 'bot_conversations'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare phone: string

  @column({ columnName: 'restaurant_id' })
  declare restaurantId: number

  @column()
  declare state?: string | null

  @column({ columnName: 'last_intent' })
  declare lastIntent?: string | null

  @column({ columnName: 'last_message' })
  declare lastMessage?: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @hasMany(() => BotConversationMessage)
  declare messages: HasMany<typeof BotConversationMessage>
}
