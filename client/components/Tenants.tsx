import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

export default function Tenants() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Tenant Dashboard</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Space</Text>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>View Space</Text>
            <Text style={styles.cardDescription}>
              View and manage your rented space
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Maintenance</Text>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Request Maintenance</Text>
            <Text style={styles.cardDescription}>
              Submit maintenance requests
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payments</Text>
          <TouchableOpacity style={styles.card}>
            <Text style={styles.cardTitle}>Payment History</Text>
            <Text style={styles.cardDescription}>
              View payment history and make payments
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
