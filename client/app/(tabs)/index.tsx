import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";
import { FontAwesome } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <ScreenWrapper backgroundColor="#007AFF" statusBarStyle="light-content">
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <FontAwesome
              name="bell"
              size={Platform.OS === "ios" ? 22 : 20}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {/* Add your content here */}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: Platform.OS === "ios" ? 20 : 16,
    paddingTop: Platform.OS === "ios" ? 20 : 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: Platform.OS === "ios" ? 28 : 24,
    fontWeight: "bold",
    color: "#fff",
  },
  notificationButton: {
    width: Platform.OS === "ios" ? 44 : 40,
    height: Platform.OS === "ios" ? 44 : 40,
    borderRadius: Platform.OS === "ios" ? 22 : 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: Platform.OS === "ios" ? 20 : 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: Platform.OS === "ios" ? 20 : 16,
    borderTopRightRadius: Platform.OS === "ios" ? 20 : 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  sectionTitle: {
    fontSize: Platform.OS === "ios" ? 20 : 18,
    fontWeight: "600",
    marginBottom: Platform.OS === "ios" ? 15 : 12,
    color: "#333",
  },
});
