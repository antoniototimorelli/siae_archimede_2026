import { describe, it, expect } from 'vitest'
import {
  validateNome,
  validateCognome,
  validateCodiceFiscale,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateTelefono,
  validateIndirizzo,
  isFormValid,
} from '../useValidation'

describe('validateNome', () => {
  it('dato un nome valido, quando si valida, allora ritorna valid: true', () => {
    expect(validateNome('Mario').valid).toBe(true)
  })
  it('dato un nome con lettere accentate, quando si valida, allora ritorna valid: true', () => {
    expect(validateNome('Àngelò').valid).toBe(true)
  })
  it('dato un nome vuoto, quando si valida, allora ritorna errore', () => {
    const result = validateNome('')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Il nome può contenere solo lettere')
  })
  it('dato un nome con numeri, quando si valida, allora ritorna errore', () => {
    const result = validateNome('Mario1')
    expect(result.valid).toBe(false)
  })
  it('dato un nome di soli spazi, quando si valida, allora ritorna errore', () => {
    expect(validateNome('   ').valid).toBe(false)
  })
})

describe('validateCognome', () => {
  it('dato un cognome valido, quando si valida, allora ritorna valid: true', () => {
    expect(validateCognome('Rossi').valid).toBe(true)
  })
  it('dato un cognome con lettera accentata, quando si valida, allora ritorna valid: true', () => {
    expect(validateCognome('Ròssi').valid).toBe(true)
  })
  it('dato un cognome vuoto, quando si valida, allora ritorna errore', () => {
    const result = validateCognome('')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Il cognome può contenere solo lettere')
  })
  it('dato un cognome con numeri, quando si valida, allora ritorna errore', () => {
    expect(validateCognome('Rossi1').valid).toBe(false)
  })
  it('dato un cognome di soli spazi, quando si valida, allora ritorna errore', () => {
    expect(validateCognome('   ').valid).toBe(false)
  })
})

describe('validateCodiceFiscale', () => {
  it('dato un CF valido, quando si valida, allora ritorna valid: true', () => {
    expect(validateCodiceFiscale('RSSMRA85M01H501Z').valid).toBe(true)
  })
  it('dato un CF in minuscolo, quando si valida, allora ritorna valid: true (case insensitive)', () => {
    expect(validateCodiceFiscale('rssmra85m01h501z').valid).toBe(true)
  })
  it('dato un CF di lunghezza sbagliata, quando si valida, allora ritorna errore', () => {
    const result = validateCodiceFiscale('RSSMRA85')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Codice fiscale non valido (formato: RSSMRA85M01H501Z)')
  })
  it('dato un CF vuoto, quando si valida, allora ritorna errore', () => {
    expect(validateCodiceFiscale('').valid).toBe(false)
  })
})

describe('validateEmail', () => {
  it('data una email valida, quando si valida, allora ritorna valid: true', () => {
    expect(validateEmail('mario@example.com').valid).toBe(true)
  })
  it('data una email senza @, quando si valida, allora ritorna errore', () => {
    const result = validateEmail('marioexample.com')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Indirizzo email non valido')
  })
  it('data una email vuota, quando si valida, allora ritorna errore', () => {
    expect(validateEmail('').valid).toBe(false)
  })
})

describe('validatePassword', () => {
  it('data una password valida, quando si valida, allora ritorna valid: true', () => {
    expect(validatePassword('Password1').valid).toBe(true)
  })
  it('data una password senza maiuscola, quando si valida, allora ritorna errore', () => {
    const result = validatePassword('password1')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Password deve avere almeno 8 caratteri, una maiuscola e un numero')
  })
  it('data una password senza numero, quando si valida, allora ritorna errore', () => {
    expect(validatePassword('Password').valid).toBe(false)
  })
  it('data una password troppo corta, quando si valida, allora ritorna errore', () => {
    expect(validatePassword('Pa1').valid).toBe(false)
  })
  it('data una password vuota, quando si valida, allora ritorna errore', () => {
    expect(validatePassword('').valid).toBe(false)
  })
})

describe('validateConfirmPassword', () => {
  it('date due password uguali, quando si valida, allora ritorna valid: true', () => {
    expect(validateConfirmPassword('Password1', 'Password1').valid).toBe(true)
  })
  it('date due password diverse, quando si valida, allora ritorna errore', () => {
    const result = validateConfirmPassword('Password1', 'Password2')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Le password non coincidono')
  })
  it('dato confirm vuoto, quando si valida, allora ritorna errore', () => {
    expect(validateConfirmPassword('Password1', '').valid).toBe(false)
  })
})

describe('validateTelefono', () => {
  it('dato un telefono valido, quando si valida, allora ritorna valid: true', () => {
    expect(validateTelefono('3331234567').valid).toBe(true)
  })
  it('dato un telefono con lettere, quando si valida, allora ritorna errore', () => {
    const result = validateTelefono('333abc')
    expect(result.valid).toBe(false)
    expect(result.error).toBe('Il numero di telefono deve contenere almeno 9 cifre')
  })
  it('dato un telefono troppo corto, quando si valida, allora ritorna errore', () => {
    expect(validateTelefono('12345678').valid).toBe(false)
  })
  it('dato un telefono vuoto, quando si valida, allora ritorna errore', () => {
    expect(validateTelefono('').valid).toBe(false)
  })
})

describe('validateIndirizzo', () => {
  it('dato un indirizzo valido, quando si valida, allora ritorna valid: true', () => {
    expect(validateIndirizzo('Via Roma 1').valid).toBe(true)
  })
  it('dato un indirizzo vuoto, quando si valida, allora ritorna errore', () => {
    const result = validateIndirizzo('')
    expect(result.valid).toBe(false)
    expect(result.error).toBe("L'indirizzo è obbligatorio")
  })
  it('dato un indirizzo troppo corto, quando si valida, allora ritorna errore', () => {
    expect(validateIndirizzo('Via').valid).toBe(false)
  })
  it('dato un indirizzo con solo spazi, quando si valida, allora ritorna errore', () => {
    expect(validateIndirizzo('     ').valid).toBe(false)
  })
})

describe('isFormValid', () => {
  it('dati tutti i risultati validi, quando si chiama isFormValid, allora ritorna true', () => {
    expect(isFormValid([{ valid: true, error: '' }, { valid: true, error: '' }])).toBe(true)
  })
  it('dato almeno un risultato non valido, quando si chiama isFormValid, allora ritorna false', () => {
    expect(isFormValid([{ valid: true, error: '' }, { valid: false, error: 'err' }])).toBe(false)
  })
  it('data una lista vuota, quando si chiama isFormValid, allora ritorna true', () => {
    expect(isFormValid([])).toBe(true)
  })
})
