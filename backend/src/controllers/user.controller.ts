// GET /api/users/me | header: Authorization Bearer | res: 200 User (senza passwordHash) | 401
import type { Request, Response } from 'express'
import { findById } from '../services/user.service'

export function getMe(req: Request, res: Response): void {
  if (!req.user) {
    res.status(401).json({ error: 'Non autenticato' })
    return
  }
  const user = findById(req.user.userId)
  if (!user) {
    res.status(404).json({ error: 'Utente non trovato' })
    return
  }
  const { passwordHash: _omit, ...safeUser } = user
  res.status(200).json(safeUser)
}
