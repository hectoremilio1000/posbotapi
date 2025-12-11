// config/database.ts
import env from '#start/env'

const databaseConfig = {
  connection: 'pg',
  connections: {
    pg: {
      client: 'pg',
      connection: env.get('DATABASE_URL'),
      migrations: {
        naturalSort: true,
      },
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
}

export default databaseConfig
