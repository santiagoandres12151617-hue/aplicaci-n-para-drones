/**
 * Valida formato de email.
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Valida fortaleza de contraseña.
 * Retorna null si es válida, o un mensaje de error.
 */
export function validatePassword(password: string): string | null {
  if (password.length < 8)
    return "La contraseña debe tener al menos 8 caracteres";
  if (!/[A-Z]/.test(password)) return "Debe contener al menos una mayúscula";
  if (!/[0-9]/.test(password)) return "Debe contener al menos un número";
  return null;
}

/**
 * Valida que todos los campos estén completos.
 */
export function areFieldsComplete(fields: Record<string, string>): boolean {
  return Object.values(fields).every((v) => v.trim() !== "");
}
