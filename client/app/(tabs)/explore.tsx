import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../hooks/useAuth";

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.user_metadata?.role?.toLowerCase();

  const navigateTo = (screen: string) => {
    router.push(screen as any);
  };

  if (!user) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.loginMessage}>
          Login to explore role-specific items
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Explore</Text>

        {role === "admin" && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigateTo("Admin")}
          >
            <Text style={styles.buttonText}>Go to Admin</Text>
          </TouchableOpacity>
        )}

        {role === "manager" && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigateTo("Manager")}
          >
            <Text style={styles.buttonText}>Go to Manager</Text>
          </TouchableOpacity>
        )}

        {role === "operator" && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigateTo("Operator")}
          >
            <Text style={styles.buttonText}>Go to Operator</Text>
          </TouchableOpacity>
        )}

        {role === "tenant" && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigateTo("Tenants")}
          >
            <Text style={styles.buttonText}>Go to Tenants</Text>
          </TouchableOpacity>
        )}

        {!role && (
          <Text style={styles.noRoleText}>
            No role assigned. Please contact support.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    padding: 20,
    gap: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  noRoleText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  loginMessage: {
    fontSize: 18,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
