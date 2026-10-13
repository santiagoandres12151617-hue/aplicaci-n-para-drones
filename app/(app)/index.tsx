import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../src/auth/AuthContext";

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Hola, {user?.nombre}!</Text>
      <Text style={styles.subtitle}>Has iniciado sesión correctamente</Text>

      <TouchableOpacity style={styles.button} onPress={signOut}>
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#003366",
  },
  subtitle: { fontSize: 15, color: "#666", marginBottom: 32 },
  button: {
    backgroundColor: "#c0392b",
    padding: 16,
    borderRadius: 8,
    paddingHorizontal: 32,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
