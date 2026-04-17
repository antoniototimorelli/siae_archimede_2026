export type Repertoire =
  | 'MUSICA'
  | 'CINEMA'
  | 'DOR'
  | 'LIRICA'
  | 'OLAF_LETTERARIE'
  | 'OLAF_FIGURATIVE'

export interface User {
  id: string
  firstName: string
  lastName: string
  fiscalCode: string
  email: string
  passwordHash: string
  phone: string
  address: string
  photoBase64?: string
  repertoires: Repertoire[]
  birthDate?: string
  createdAt: string
}
