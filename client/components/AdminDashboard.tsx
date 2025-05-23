import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";

interface Task {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
  assignedTo?: string;
}

interface AdminDashboardProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, newStatus: Task["status"]) => void;
}

export default function AdminDashboard({
  tasks,
  onTaskStatusChange,
}: AdminDashboardProps) {
  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "in-progress":
        return "#FFC107";
      default:
        return "#E0E0E0";
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Task Dashboard</Text>

        {tasks.length === 0 ? (
          <Text style={styles.emptyText}>No tasks created yet</Text>
        ) : (
          tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.card}
              onPress={() => {
                // Handle task click - can be expanded for more details
                console.log(`Clicked on task: ${task.name}`);
              }}
            >
              <View style={styles.taskHeader}>
                <Text style={styles.cardTitle}>{task.name}</Text>
                <TouchableOpacity
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(task.status) },
                  ]}
                  onPress={() => {
                    // Cycle through statuses
                    const statuses: Task["status"][] = [
                      "pending",
                      "in-progress",
                      "completed",
                    ];
                    const currentIndex = statuses.indexOf(task.status);
                    const nextStatus =
                      statuses[(currentIndex + 1) % statuses.length];
                    onTaskStatusChange(task.id, nextStatus);
                  }}
                >
                  <Text style={styles.statusText}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.description}>{task.description}</Text>

              <View style={styles.taskFooter}>
                <Text style={styles.dateText}>
                  Created: {task.createdAt.toLocaleDateString()}
                </Text>
                {task.assignedTo && (
                  <Text style={styles.assignedText}>
                    Assigned to: {task.assignedTo}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))
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
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginBottom: 15,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  dateText: {
    fontSize: 12,
    color: "#888",
  },
  assignedText: {
    fontSize: 12,
    color: "#888",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "500",
  },
});
