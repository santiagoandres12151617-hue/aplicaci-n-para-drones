import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { authConfig } from "../config/authConfig";
import { initDatabase } from "../storage/FileStorage";
import { AuthResult, login as loginService } from "./AuthService";

// ─────────────────────────────────────────────────────────────
// TIPOS
// ─────────────────────────────────────────────────────────────

interface SessionUser {
  id: number;
  email: string;
  nombre: string;
  fechaRegistro: string;
}

interface AuthContextType {
  user: SessionUser | null;
  isLoading: boolean;
  isAuthenticated: boolean; // ✅ Clave para el fix
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────
// CONTEXTO
// ─────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

// ─────────────────────────────────────────────────────────────
// PROVIDER
// ─────────────────────────────────────────────────────────────

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔍 Log de depuración
  //console.log("🔍 AuthProvider render:", { user, isLoading });

  // ✅ useEffect con [] — solo corre UNA VEZ al montar
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        // 1. Inicializar la base de datos si no existe
        //await resetDatabase();
        await initDatabase();

        // 2. Cargar sesión guardada
        // ⬇️ AÑADE ESTE LOG
        const stored = await AsyncStorage.getItem(authConfig.SESSION_USER_KEY);
        console.log("🔍 Sesión:", stored);

        // ⬇️ Importa getAllUsers y añade esto
        const { getAllUsers } = await import("../storage/FileStorage");
        const users = await getAllUsers();
        console.log("🔍 Usuarios en DB:", JSON.stringify(users, null, 2));
        if (isMounted && stored) {
          setUser(JSON.parse(stored));
        }
      } catch (error) {
        console.error("❌ Error cargando sesión:", error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []); // ⬅️ CRÍTICO: array vacío

  // ─────────────────────────────────────────────────────────
  // signIn: guarda el usuario y actualiza el estado
  // ─────────────────────────────────────────────────────────
  const signIn = async (
    email: string,
    password: string,
  ): Promise<AuthResult> => {
    const result = await loginService(email, password);
    //console.log("🔍 signIn result:", result);

    if (result.success && result.user) {
      try {
        await AsyncStorage.setItem(
          authConfig.SESSION_USER_KEY,
          JSON.stringify(result.user),
        );
        //console.log("🔍 Guardado en AsyncStorage:", result.user);
        setUser(result.user);
        //console.log("🔍 setUser llamado — isAuthenticated ahora es true");
      } catch (error) {
        console.error("❌ Error guardando sesión:", error);
      }
    }

    return result;
  };

  // ─────────────────────────────────────────────────────────
  // signOut: elimina el usuario y limpia el estado
  // ─────────────────────────────────────────────────────────
  const signOut = async () => {
    try {
      await AsyncStorage.removeItem(authConfig.SESSION_USER_KEY);
      setUser(null);
      //console.log("🔍 Sesión cerrada");
    } catch (error) {
      console.error("❌ Error cerrando sesión:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user, // ✅ Se recalcula en cada render
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
