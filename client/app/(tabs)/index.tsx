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
import { useTasks, Task } from "../../context/TaskContext";

export default function HomeScreen() {
  const { user, loading } = useAuth();
  const role = user?.user_metadata?.role;
  const { getTasksByRole, updateTaskStatus } = useTasks();
  const filteredTasks = role ? getTasksByRole(role) : [];

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

        <View style={styles.tasksContainer}>
          <Text style={styles.sectionTitle}>Your Tasks</Text>
          {filteredTasks.length === 0 ? (
            <Text style={styles.noTasksText}>No tasks assigned</Text>
          ) : (
            filteredTasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => {
                  // Handle task click
                  console.log(`Clicked on task: ${task.name}`);
                }}
              >
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle}>{task.name}</Text>
                  <TouchableOpacity
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          task.status === "completed"
                            ? "#4CAF50"
                            : task.status === "in-progress"
                            ? "#FFC107"
                            : "#E0E0E0",
                      },
                    ]}
                    onPress={() => {
                      const statuses: Task["status"][] = [
                        "pending",
                        "in-progress",
                        "completed",
                      ];
                      const currentIndex = statuses.indexOf(task.status);
                      const nextStatus =
                        statuses[(currentIndex + 1) % statuses.length];
                      updateTaskStatus(task.id, nextStatus);
                    }}
                  >
                    <Text style={styles.statusText}>
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.taskDescription}>{task.description}</Text>
                <View style={styles.taskFooter}>
                  <Text style={styles.taskDate}>
                    Created: {task.createdAt.toLocaleDateString()}
                  </Text>
                  {task.assignedTo && (
                    <Text style={styles.taskAssigned}>
                      Assigned to: {task.assignedTo}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
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
  tasksContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  noTasksText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  taskCard: {
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
  taskTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  taskDescription: {
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
  taskDate: {
    fontSize: 12,
    color: "#888",
  },
  taskAssigned: {
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
