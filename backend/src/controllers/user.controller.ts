import fs from 'fs'
import path from 'path'
import type { Request, Response } from 'express'
import type { User } from '../types/user'

const USERS_PATH = path.resolve(__dirname, '../../data/users.json')

// GET /api/users/me | header: Authorization Bearer | res: 200 User (senza passwordHash) | 401
export function getMe(req: Request, res: Response): void {
  const raw = fs.readFileSync(USERS_PATH, 'utf-8')
  const users: User[] = JSON.parse(raw)

  const user = users.find(u => u.id === req.user?.userId)
  if (!user) {
    res.status(404).json({ error: 'Utente non trovato' })
    return
  }

  const { passwordHash: _, ...userWithoutHash } = user
  res.status(200).json(userWithoutHash)
}
