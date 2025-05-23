import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function Manager() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Manager Dashboard</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Team Management</Text>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>View Team</Text>
            <Text style={styles.cardDescription}>
              Manage your team members and assignments
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Operations</Text>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Daily Operations</Text>
            <Text style={styles.cardDescription}>
              Monitor and manage daily operations
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports</Text>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Team Reports</Text>
            <Text style={styles.cardDescription}>
              View team performance and reports
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  section: {
    marginBottom: 25,
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
