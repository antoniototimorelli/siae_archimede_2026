// POST /api/auth/login | body: { email, password } | res: 200 { token } | 401 { error }
import type { Request, Response } from 'express'
import { verifyCredentials, generateToken } from '../services/auth.service'

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string }
import type { Request, Response } from 'express'
import { verifyCredentials, generateToken } from '../services/auth.service'

// POST /api/auth/login | body: { email, password } | res: 200 { token } | 401 { error }
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email?: string; password?: string }

  if (!email || !password) {
    res.status(400).json({ error: 'Email e password sono obbligatori' })
    return
  }
  const user = await verifyCredentials(email, password)
  if (!user) {
    res.status(401).json({ error: 'Credenziali non valide' })
    return
  }
  const token = generateToken(user.id, user.email)
  res.status(200).json({ token })

  try {
    const user = await verifyCredentials(email, password)
    if (!user) {
      res.status(401).json({ error: 'Credenziali non valide' })
      return
    }
    const token = generateToken(user.id, user.email)
    res.status(200).json({ token })
  } catch {
    res.status(500).json({ error: 'Errore interno del server' })
  }
}
