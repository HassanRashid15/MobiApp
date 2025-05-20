import { StyleSheet, View, Text, FlatList } from "react-native";

const notifications = [
  {
    id: "1",
    title: "New Message",
    message: "You have received a new message from John",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "System Update",
    message: "Your app has been updated to the latest version",
    time: "1 hour ago",
    read: true,
  },
  {
    id: "3",
    title: "Reminder",
    message: "Don't forget to complete your profile",
    time: "3 hours ago",
    read: true,
  },
];

export default function NotificationsScreen() {
  const renderNotification = ({ item }) => (
    <View style={[styles.notificationItem, !item.read && styles.unread]}>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listContainer: {
    padding: 15,
  },
  notificationItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  unread: {
    backgroundColor: "#f0f8ff",
    borderColor: "#007AFF",
  },
  notificationContent: {
    gap: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
});
