import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function Operator() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Operator Dashboard</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>View Tasks</Text>
            <Text style={styles.cardDescription}>
              Check and manage your assigned tasks
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule</Text>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Work Schedule</Text>
            <Text style={styles.cardDescription}>
              View your work schedule and shifts
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reports</Text>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Task Reports</Text>
            <Text style={styles.cardDescription}>
              Submit and view task reports
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
