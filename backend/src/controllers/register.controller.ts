// POST /api/register | body: RegisterPayload | res: 201 { message, userId } | 400 | 409
import type { Request, Response } from 'express'
import { findByEmail, findByFiscalCode, createUser } from '../services/user.service'
import type { RegisterPayload } from '../types/user'

export async function register(req: Request, res: Response): Promise<void> {
  const body = req.body as Partial<RegisterPayload>
  const required: (keyof RegisterPayload)[] = [
    'firstName', 'lastName', 'fiscalCode', 'email', 'password', 'phone', 'address', 'repertoires',
  ]
  for (const field of required) {
    if (!body[field] || (Array.isArray(body[field]) && (body[field] as string[]).length === 0)) {
      res.status(400).json({ error: `Campo obbligatorio mancante: ${field}` })
      return
    }
  }

  if (findByEmail(body.email!)) {
    res.status(409).json({ error: 'Email già registrata. Accedi con le tue credenziali.' })
    return
  }
  if (findByFiscalCode(body.fiscalCode!)) {
    res.status(409).json({ error: 'Codice fiscale già registrato. Accedi con le tue credenziali.' })
    return
  }

  const user = createUser(body as RegisterPayload)
  res.status(201).json({ message: 'Registrazione completata con successo', userId: user.id })
}
