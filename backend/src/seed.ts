import 'dotenv/config'
import { findByEmail, createUser } from './services/user.service'

const TEST_EMAIL = 'test@siae.it'

if (!findByEmail(TEST_EMAIL)) {
  createUser({
    firstName: 'Mario',
    lastName: 'Rossi',
    fiscalCode: 'RSSMRA85M01H501Z',
    email: TEST_EMAIL,
    password: 'Test1234!',
    phone: '3331234567',
    address: 'Via Roma 1, Milano',
    repertoires: ['musica'],
    birthDate: '1985-08-01',
  })
  console.log('Seed: utente test creato —', TEST_EMAIL)
} else {
  console.log('Seed: utente test già presente')
}
