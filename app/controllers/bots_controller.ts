import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

export default class BotController {
  public async companyByPhone({ request, response }: HttpContext) {
    const phone = String(request.qs().phone || '').trim()
    if (!phone) {
      return response.badRequest({ error: 'phone requerido' })
    }

    // TODO: ajusta tabla/columna según tu schema real en posapp
    // Ejemplo: tabla restaurants con columna phone
    const row = await db.from('restaurants').where('phone', phone).first()

    if (!row) {
      return response.ok(null)
    }

    return response.ok({
      id: row.id,
      name: row.name,
      phone: row.phone,
      // agrega lo que te sirva, pero NO cosas sensibles
    })
  }

  // ... companyByPhone se queda igual ...

  /**
   * GET /api/bot/sales-report?restaurantId=&typeReport=&dateStart=&dateEnd=&dateEspecify=
   * Usa la tabla orders (restaurant_id, status, total, created_at)
   */
  public async salesReport({ request, response }: HttpContext) {
    const restaurantId = Number(request.qs().restaurantId)
    const typeReport = String(request.qs().typeReport || '')
      .toLowerCase()
      .trim()
    const dateStart = request.qs().dateStart as string | undefined
    const dateEnd = request.qs().dateEnd as string | undefined
    const dateEspecify = request.qs().dateEspecify as string | undefined

    if (!restaurantId) {
      return response.badRequest({ error: 'restaurantId es obligatorio' })
    }

    if (!typeReport) {
      return response.badRequest({ error: 'typeReport es obligatorio' })
    }

    // Base: solo órdenes cerradas de ese restaurante
    const q = db.from('orders').where('restaurant_id', restaurantId).where('status', 'closed')

    // Filtros de fecha sobre created_at (igual que tu ApiBotWhatsappController)
    switch (typeReport) {
      case 'range': {
        if (!dateStart || !dateEnd) {
          return response.badRequest({
            error: 'Para typeReport="range" envía dateStart y dateEnd (YYYY-MM-DD)',
          })
        }

        const start = DateTime.fromISO(dateStart).startOf('day')
        const end = DateTime.fromISO(dateEnd).endOf('day')

        if (!start.isValid || !end.isValid) {
          return response.badRequest({
            error: 'Formato de fecha inválido. Usa YYYY-MM-DD para dateStart y dateEnd.',
          })
        }

        q.whereBetween('created_at', [start.toISO(), end.toISO()])
        break
      }

      case 'specific_date': {
        if (!dateEspecify) {
          return response.badRequest({
            error: 'Para typeReport="specific_date" envía dateEspecify (YYYY-MM-DD)',
          })
        }

        const dayStart = DateTime.fromISO(dateEspecify).startOf('day')
        const dayEnd = DateTime.fromISO(dateEspecify).endOf('day')

        if (!dayStart.isValid || !dayEnd.isValid) {
          return response.badRequest({
            error: 'Formato de fecha inválido. Usa YYYY-MM-DD para dateEspecify.',
          })
        }

        q.whereBetween('created_at', [dayStart.toISO(), dayEnd.toISO()])
        break
      }

      case 'greater_than': {
        if (!dateEspecify) {
          return response.badRequest({
            error: 'Para typeReport="greater_than" envía dateEspecify (YYYY-MM-DD)',
          })
        }

        const from = DateTime.fromISO(dateEspecify).startOf('day')

        if (!from.isValid) {
          return response.badRequest({
            error: 'Formato de fecha inválido. Usa YYYY-MM-DD para dateEspecify.',
          })
        }

        q.where('created_at', '>=', from.toISO())
        break
      }

      case 'less_than': {
        if (!dateEspecify) {
          return response.badRequest({
            error: 'Para typeReport="less_than" envía dateEspecify (YYYY-MM-DD)',
          })
        }

        const to = DateTime.fromISO(dateEspecify).endOf('day')

        if (!to.isValid) {
          return response.badRequest({
            error: 'Formato de fecha inválido. Usa YYYY-MM-DD para dateEspecify.',
          })
        }

        q.where('created_at', '<=', to.toISO())
        break
      }

      default:
        return response.badRequest({
          error:
            'typeReport no válido. Usa "range", "specific_date", "greater_than" o "less_than".',
        })
    }

    // Agregados: suma de total y conteo de órdenes
    const agg = await q
      .sum({ total_sum: 'total' }) // 👈 usa la columna REAL, "total"
      .count({ order_count: 'id' })
      .first()

    const total = Number((agg as any)?.total_sum ?? 0)
    const orderCount = Number((agg as any)?.order_count ?? 0)

    // Por ahora dejamos topWaiter/topProducts vacíos (los puedes construir luego)
    const result = {
      total,
      orderCount,
      topWaiter: null,
      topProducts: [],
    }

    return response.ok(result)
  }
}
