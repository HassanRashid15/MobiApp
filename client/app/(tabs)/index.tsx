import { StyleSheet, View, Text, ScrollView, Platform } from "react-native";
import ScreenWrapper from "../../components/ScreenWrapper";

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
    padding: 20,
    paddingTop: Platform.OS === "android" ? 20 : 20,
    // backgroundColor: "#007AFF",
  },
  title: {
    fontSize: Platform.OS === "ios" ? 28 : 24,
    fontWeight: "bold",
    color: "#fff",
  },
  content: {
    padding: 20,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: Platform.OS === "ios" ? 20 : 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },

});
