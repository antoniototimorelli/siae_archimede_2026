export interface User {
  id: string
  firstName: string
  lastName: string
  fiscalCode: string
  email: string
  phone: string
  address: string
  repertoires: string[]
  photo?: string
  birthDate: string
  createdAt: string
}

export interface LoginResponse {
  token: string
}

export interface ApiError {
  error: string
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
