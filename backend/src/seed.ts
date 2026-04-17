import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'
import type { User } from './types/user'

const USERS_PATH = path.resolve(__dirname, '../data/users.json')

async function seed(): Promise<void> {
  const passwordHash = await bcrypt.hash('Test1234!', 10)

  const testUser: User = {
    id: randomUUID(),
    firstName: 'Mario',
    lastName: 'Rossi',
    fiscalCode: 'RSSMRA80A01H501Z',
    email: 'mario.rossi@test.it',
    passwordHash,
    phone: '+39 333 1234567',
    address: 'Via Roma 1, Milano',
    repertoires: ['MUSICA'],
    birthDate: '1980-01-01',
    createdAt: new Date().toISOString(),
  }

  fs.writeFileSync(USERS_PATH, JSON.stringify([testUser], null, 2))
  console.log('Utente di test creato:', testUser.email)
}

seed().catch(console.error)
