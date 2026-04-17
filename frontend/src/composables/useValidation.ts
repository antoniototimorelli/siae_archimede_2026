export interface ValidationResult {
  valid: boolean
  error: string
}

const NOME_REGEX = /^[a-zA-ZàèìòùáéíóúÀÈÌÒÙÁÉÍÓÚ\s]+$/
const CF_REGEX = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TELEFONO_REGEX = /^[0-9]+$/

function ok(): ValidationResult {
  return { valid: true, error: '' }
}

function err(error: string): ValidationResult {
  return { valid: false, error }
}

export function validateNome(value: string): ValidationResult {
  if (!value.trim() || !NOME_REGEX.test(value.trim())) return err('Il nome può contenere solo lettere')
  return ok()
}

export function validateCognome(value: string): ValidationResult {
  if (!value.trim() || !NOME_REGEX.test(value.trim())) return err('Il cognome può contenere solo lettere')
  return ok()
}

export function validateCodiceFiscale(value: string): ValidationResult {
  if (!value || value.length !== 16 || !CF_REGEX.test(value))
    return err('Codice fiscale non valido (formato: RSSMRA85M01H501Z)')
  return ok()
}

export function validateEmail(value: string): ValidationResult {
  if (!value || !EMAIL_REGEX.test(value)) return err('Indirizzo email non valido')
  return ok()
}

export function validatePassword(value: string): ValidationResult {
  if (!value || value.length < 8 || !/[A-Z]/.test(value) || !/[0-9]/.test(value))
    return err('Password deve avere almeno 8 caratteri, una maiuscola e un numero')
  return ok()
}

export function validateConfirmPassword(password: string, confirm: string): ValidationResult {
  if (!confirm || confirm !== password) return err('Le password non coincidono')
  return ok()
}

export function validateTelefono(value: string): ValidationResult {
  if (!value || !TELEFONO_REGEX.test(value) || value.length < 9)
    return err('Il numero di telefono deve contenere almeno 9 cifre')
  return ok()
}

export function validateIndirizzo(value: string): ValidationResult {
  if (!value.trim() || value.trim().length < 5) return err("L'indirizzo è obbligatorio")
  return ok()
}

export function isFormValid(results: ValidationResult[]): boolean {
  return results.every((r) => r.valid)
}
