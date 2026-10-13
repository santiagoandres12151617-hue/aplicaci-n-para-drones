// src/storage/FileStorage.ts  (versión NATIVA - iOS/Android)
import { File, Paths } from "expo-file-system";

const usersFile = new File(Paths.document, "users.txt");
const HEADER = "id|email|passwordHash|nombre|fechaRegistro";

export interface UserRecord {
  id: number;
  email: string;
  passwordHash: string;
  nombre: string;
  fechaRegistro: string;
}

export async function initDatabase(): Promise<void> {
  try {
    if (!usersFile.exists) {
      await usersFile.write(HEADER);
      console.log("✅ Base de datos creada en:", usersFile.uri);

      await insertUser({
        email: "admin@unicaribe.edu",
        passwordHash: hashPassword("Admin123"),
        nombre: "Administradora",
        fechaRegistro: new Date().toISOString().split("T")[0],
      });
      await insertUser({
        email: "profesor@unicaribe.edu",
        passwordHash: hashPassword("Profesor123"),
        nombre: "Profesor Demo",
        fechaRegistro: new Date().toISOString().split("T")[0],
      });
    }
  } catch (error) {
    console.error("❌ Error inicializando DB:", error);
    throw new Error("No se pudo inicializar la base de datos local");
  }
}

export async function getAllUsers(): Promise<UserRecord[]> {
  try {
    if (!usersFile.exists) return [];
    const content = await usersFile.text();
    const lines = content.split("\n").filter((line) => line.trim() !== "");
    return lines.slice(1).map((line) => {
      const [id, email, passwordHash, nombre, fechaRegistro] = line.split("|");
      return {
        id: parseInt(id, 10),
        email: email ?? "",
        passwordHash: passwordHash ?? "",
        nombre: nombre ?? "",
        fechaRegistro: fechaRegistro ?? "",
      };
    });
  } catch (error) {
    console.error("❌ Error leyendo usuarios:", error);
    return [];
  }
}

export async function findUserByEmail(
  email: string,
): Promise<UserRecord | null> {
  const users = await getAllUsers();
  return (
    users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null
  );
}

export async function insertUser(
  user: Omit<UserRecord, "id">,
): Promise<UserRecord> {
  try {
    const users = await getAllUsers();
    const newId =
      users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
    const newUser: UserRecord = { id: newId, ...user };
    const newLine = `${newUser.id}|${newUser.email}|${newUser.passwordHash}|${newUser.nombre}|${newUser.fechaRegistro}`;
    const currentContent = usersFile.exists ? await usersFile.text() : HEADER;
    const separator = currentContent.endsWith("\n") ? "" : "\n";
    await usersFile.write(`${currentContent}${separator}${newLine}`);
    return newUser;
  } catch (error) {
    console.error("❌ Error insertando usuario:", error);
    throw new Error("No se pudo guardar el usuario");
  }
}

export function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(32, "0");
}

export async function resetDatabase(): Promise<void> {
  try {
    if (usersFile.exists) usersFile.delete();
  } catch (error) {
    console.error("❌ Error reseteando DB:", error);
  }
}
