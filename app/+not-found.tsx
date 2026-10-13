import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!! Not Found" }} />
      <View style={styles.container}></View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#234875",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    fontSize: 22,
    textDecorationLine: "underline",
    color: "#fdf4f7",
  },
});
