import {
    findUserByEmail,
    hashPassword,
    insertUser,
    UserRecord,
} from "../storage/FileStorage";

export interface AuthResult {
  success: boolean;
  message: string;
  user?: Omit<UserRecord, "passwordHash">;
}

/**
 * Intenta iniciar sesión con email y contraseña.
 */
export async function login(
  email: string,
  password: string,
): Promise<AuthResult> {
  try {
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, message: "Usuario no encontrado" };
    }

    const inputHash = hashPassword(password);
    if (user.passwordHash !== inputHash) {
      return { success: false, message: "Contraseña incorrecta" };
    }

    // No devolvemos el hash al exterior
    const { passwordHash, ...safeUser } = user;
    return {
      success: true,
      message: "Inicio de sesión exitoso",
      user: safeUser,
    };
  } catch (error) {
    console.error("❌ Error en login:", error);
    return { success: false, message: "Error interno. Intenta de nuevo." };
  }
}

/**
 * ⚠️ MÓDULO DE REGISTRO - DESACTIVADO POR DEFECTO
 *
 * Está completamente implementado y listo para activarse.
 * Para activarlo: cambia REGISTRATION_ENABLED a true en src/config/authConfig.ts
 */
export async function register(
  email: string,
  password: string,
  nombre: string,
): Promise<AuthResult> {
  try {
    const existing = await findUserByEmail(email);
    if (existing) {
      return { success: false, message: "Este correo ya está registrado" };
    }

    const newUser = await insertUser({
      email: email.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      nombre: nombre.trim(),
      fechaRegistro: new Date().toISOString().split("T")[0],
    });

    const { passwordHash, ...safeUser } = newUser;
    return {
      success: true,
      message: "Usuario registrado correctamente",
      user: safeUser,
    };
  } catch (error) {
    console.error("❌ Error en registro:", error);
    return { success: false, message: "Error al registrar. Intenta de nuevo." };
  }
}
