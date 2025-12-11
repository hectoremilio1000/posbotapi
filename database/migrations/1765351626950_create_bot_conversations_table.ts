// database/migrations/xxxx_bot_conversations.ts
import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bot_conversations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('phone', 32).notNullable() // 52155...
      table.integer('restaurant_id').notNullable() // restaurants.id

      table.string('state', 50).nullable() // "reporte", "manual", etc.
      table.string('last_intent', 255).nullable() // "Reporte de ventas..."
      table.text('last_message').nullable() // último texto del user

      table.timestamps(true, true) // created_at, updated_at

      table.unique(['phone', 'restaurant_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
