import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../../hooks/useAuth";

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const role = user?.user_metadata?.role;

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.welcomeTitle}>Welcome</Text>
        <Text style={styles.welcomeMessage}>
          Please log in to view your dashboard.
        </Text>
      </View>
    );
  }

  if (!role) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.welcomeTitle}>Welcome</Text>
        <Text style={styles.welcomeMessage}>
          No role assigned. Please contact support.
        </Text>
      </View>
    );
  }

  return (
    <ScreenWrapper backgroundColor="#007AFF" statusBarStyle="light-content">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeTitle}>Welcome</Text>
            <Text style={styles.roleText}>{role}</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <FontAwesome
              name="bell"
              size={Platform.OS === "ios" ? 22 : 20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  welcomeMessage: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  welcomeContainer: {
    flex: 1,
  },
  roleText: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "600",
  },
  notificationButton: {
    padding: 10,
  },
});
