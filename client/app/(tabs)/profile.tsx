import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";

export default function ProfileScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.notLoggedInText}>
          Please log in to view your profile
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri:
                user.user_metadata?.avatar_url ||
                "https://via.placeholder.com/150",
            }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.name}>
          {user.user_metadata?.full_name || user.email?.split("@")[0]}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue}>{user.id}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Sign In</Text>
            <Text style={styles.infoValue}>
              {new Date(user.last_sign_in_at || "").toLocaleDateString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#007AFF",
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  notLoggedInText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
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
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
