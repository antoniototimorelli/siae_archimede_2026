import { Router, type Request, type Response } from 'express'

/**
 * GET /api/health
 * Input:  nessuno
 * Output: { status: 'ok', timestamp: string }
 */
export const healthRouter: Router = Router()

healthRouter.get('/', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})
