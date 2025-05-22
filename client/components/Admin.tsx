import { StyleSheet, View, Text } from "react-native";

export default function Admin() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi from Admin.tsx</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
});
