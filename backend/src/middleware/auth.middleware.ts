import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../services/auth.service'

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; email: string }
    }
  }
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token mancante' })
    return
  }
  const token = authHeader.slice(7)
  try {
    req.user = verifyToken(token)
    next()
  } catch {

  const token = authHeader.slice(7)

  try {
    req.user = verifyToken(token)
    next()
  } catch (err) {
    const message = (err as Error).message
    if (message === 'JWT_SECRET non definito') {
      res.status(500).json({ error: 'Errore di configurazione del server' })
      return
    }
    res.status(401).json({ error: 'Token non valido' })
  }
}
