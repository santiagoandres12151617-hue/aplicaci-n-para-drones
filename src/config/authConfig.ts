/**
 * Configuración global de autenticación.
 *
 * 🔓 ACTIVAR REGISTRO: cambia REGISTRATION_ENABLED a true
 * cuando quieras que los usuarios puedan crear cuentas.
 */
export const authConfig = {
  REGISTRATION_ENABLED: true, // ⚠️ Cambiar a true para activar registro
  MIN_PASSWORD_LENGTH: 8,
  SESSION_TOKEN_KEY: "asisapp_session_token",
  SESSION_USER_KEY: "asisapp_session_user",
};
