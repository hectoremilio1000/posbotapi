// database/migrations/xxxx_bot_conversation_messages.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bot_conversation_messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table
        .integer('conversation_id')
        .unsigned()
        .references('id')
        .inTable('bot_conversations')
        .onDelete('CASCADE')

      table.enum('role', ['user', 'assistant', 'system']).notNullable()
      table.text('content').notNullable()

      table.string('intent', 255).nullable() // nombre del intent textual
      table.jsonb('intent_payload').nullable() // JSON: tipo_mensaje, fechas, etc.

      table.timestamps(true, true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
