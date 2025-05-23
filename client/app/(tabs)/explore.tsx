import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { useAuth } from "../../hooks/useAuth";
import Admin from "../../components/Admin";
import Manager from "../../components/Manager";
import Operator from "../../components/Operator";
import Tenants from "../../components/Tenants";

export default function ExploreScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const role = user?.user_metadata?.role?.toLowerCase();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      {!user ? (
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
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Explore</Text>

            {role === "admin" && <Admin />}
            {role === "manager" && <Manager />}
            {role === "operator" && <Operator />}
            {role === "tenant" && <Tenants />}

            {!role && (
              <Text style={styles.noRoleText}>
                No role assigned. Please contact support.
              </Text>
            )}
          </View>
        </ScrollView>
      )}
    </>
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
  adminSection: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#444",
    marginBottom: 15,
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
  },
});
