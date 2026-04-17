export interface User {
  id: string
  firstName: string
  lastName: string
  fiscalCode: string
  email: string
  passwordHash: string
  phone: string
  address: string
  repertoires: string[]
  photo?: string
  birthDate: string
  createdAt: string
}

export interface UserCredentials {
  email: string
  password: string
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  fiscalCode: string
  email: string
  password: string
  phone: string
  address: string
  repertoires: string[]
  photo?: string
  birthDate: string
}
