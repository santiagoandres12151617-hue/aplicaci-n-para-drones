// src/storage/FileStorage.web.ts
const STORAGE_KEY = "asisapp_users_db";
const HEADER = "id|email|passwordHash|nombre|fechaRegistro";

export interface UserRecord {
  id: number;
  email: string;
  passwordHash: string;
  nombre: string;
  fechaRegistro: string;
}

export async function initDatabase(): Promise<void> {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, HEADER);
    await insertUser({
      email: "admin@unicaribe.edu",
      passwordHash: hashPassword("Admin123"),
      nombre: "Administrador",
      fechaRegistro: new Date().toISOString().split("T")[0],
    });
  }
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const content = localStorage.getItem(STORAGE_KEY);
  if (!content) return [];
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
  const users = await getAllUsers();
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1;
  const newUser: UserRecord = { id: newId, ...user };
  const newLine = `${newUser.id}|${newUser.email}|${newUser.passwordHash}|${newUser.nombre}|${newUser.fechaRegistro}`;
  const currentContent = localStorage.getItem(STORAGE_KEY) || HEADER;
  const separator = currentContent.endsWith("\n") ? "" : "\n";
  localStorage.setItem(STORAGE_KEY, `${currentContent}${separator}${newLine}`);
  return newUser;
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
  localStorage.removeItem(STORAGE_KEY);
}
