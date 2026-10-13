import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/auth/AuthContext";
import { register as registerService } from "../../src/auth/AuthService";
import {
  areFieldsComplete,
  isValidEmail,
  validatePassword,
} from "../../src/auth/validators";
import { authConfig } from "../../src/config/authConfig";
export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(app)");
    }
  }, [isAuthenticated]);

  // 🚫 Bloqueo duro: si el registro está desactivado, no se muestra la pantalla
  if (!authConfig.REGISTRATION_ENABLED) {
    return (
      <View style={styles.disabledContainer}>
        <Text style={styles.disabledTitle}>Registro desactivado</Text>
        <Text style={styles.disabledText}>
          El registro de nuevos usuarios aún no está disponible.
        </Text>
      </View>
    );
  }

  const handleRegister = async () => {
    if (!areFieldsComplete({ email, password, confirmPassword, nombre })) {
      Alert.alert("Campos incompletos", "Completa todos los campos.");
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert("Correo inválido", "Ingresa un correo válido.");
      return;
    }

    const pwdError = validatePassword(password);
    if (pwdError) {
      Alert.alert("Contraseña débil", pwdError);
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      const result = await registerService(email, password, nombre);

      if (!result.success) {
        Alert.alert("Error", result.message);
        return;
      }
      await signIn(email, password);
      // Alert.alert("¡Éxito!", "Cuenta creada. Iniciando sesión...", [
      //   {
      //     text: "OK",
      //     onPress: async () => {
      //
      //       router.replace("/(app)");
      //     },
      //   },
      // ]);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../../assets/images/nexo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Crear Cuenta</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre completo"
        placeholderTextColor="#999"
        value={nombre}
        onChangeText={setNombre}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar contraseña"
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        editable={!loading}
      />

      <Text style={styles.hint}>
        Mínimo 8 caracteres, una mayúscula y un número.
      </Text>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Registrarse</Text>
        )}
      </TouchableOpacity>
      <Link href="/(auth)/login" style={styles.link}>
        ¿Ya tienes cuenta? Inicia sesión
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#003366",
  },
  link: {
    marginTop: 20,
    textAlign: "center",
    color: "#003366",
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 15,
    marginTop: -130,
    alignSelf: "center",
  },
  hint: { fontSize: 12, color: "#666", fontStyle: "italic", marginBottom: 16 },
  button: {
    backgroundColor: "#003366",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  disabledContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  disabledTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#999",
    marginBottom: 8,
  },
  disabledText: { fontSize: 14, color: "#666", textAlign: "center" },
});
