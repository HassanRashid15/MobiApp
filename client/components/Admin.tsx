import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  insertAdminTask,
  fetchAllAdminTasks,
  fetchAllProfiles,
} from "../lib/adminTasks";
import { useAuth } from "../hooks/useAuth";

export default function Admin() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assigned_to: "",
    priority: "Medium",
    status: "Pending",
  });

  // Fetch tasks from Supabase
  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await fetchAllAdminTasks();
      setTasks(data || []);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch profiles for user name mapping
  const loadProfiles = async () => {
    try {
      const data = await fetchAllProfiles();
      setProfiles(data || []);
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
  };

  useEffect(() => {
    loadTasks();
    loadProfiles();
  }, []);

  const getUserName = (userId: string) => {
    const user = profiles.find((p) => p.id === userId);
    return user ? user.full_name : userId;
  };

  const handleCreateTask = async () => {
    if (!user) {
      Alert.alert("Error", "User not authenticated");
      return;
    }
    if (!newTask.title.trim() || !newTask.assigned_to.trim()) {
      Alert.alert("Error", "Task title and assignee are required");
      return;
    }
    setLoading(true);
    try {
      await insertAdminTask({
        ...newTask,
        assigned_by: user.id,
        status: newTask.status as
          | "Pending"
          | "In Progress"
          | "Completed"
          | "Cancelled",
        priority: newTask.priority as "Low" | "Medium" | "High" | "Urgent",
      });
      setIsModalVisible(false);
      setNewTask({
        title: "",
        description: "",
        assigned_to: "",
        priority: "Medium",
        status: "Pending",
      });
      await loadTasks();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  // Status update handler
  const handleStatusUpdate = async (task: any) => {
    const statuses = ["Pending", "In Progress", "Completed", "Cancelled"];
    const currentIndex = statuses.indexOf(task.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    setLoading(true);
    try {
      await insertAdminTask({
        ...task,
        status: nextStatus as
          | "Pending"
          | "In Progress"
          | "Completed"
          | "Cancelled",
        assigned_by: task.assigned_by,
        priority: task.priority as "Low" | "Medium" | "High" | "Urgent",
      });
      await loadTasks();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.createButtonText}>Create New Task</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 40 }}
        />
      ) : (
        <ScrollView style={styles.taskList}>
          {tasks.length === 0 ? (
            <Text style={styles.noTasksText}>No tasks created yet</Text>
          ) : (
            tasks.map((task) => (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                onPress={() => {
                  // Handle task click
                  console.log(`Clicked on task: ${task.title}`);
                }}
              >
                <View style={styles.taskHeader}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <TouchableOpacity
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          task.status === "Completed"
                            ? "#4CAF50"
                            : task.status === "In Progress"
                            ? "#FFC107"
                            : "#E0E0E0",
                      },
                    ]}
                    onPress={() => handleStatusUpdate(task)}
                  >
                    <Text style={styles.statusText}>{task.status}</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.taskDescription}>{task.description}</Text>
                <View style={styles.taskFooter}>
                  <Text style={styles.taskDate}>
                    Created:{" "}
                    {task.created_at
                      ? new Date(task.created_at).toLocaleDateString()
                      : "-"}
                  </Text>
                  {task.assigned_to && (
                    <Text style={styles.taskAssigned}>
                      Assigned to: {getUserName(task.assigned_to)}
                    </Text>
                  )}
                  {task.assigned_by && (
                    <Text style={styles.taskAssigned}>
                      Assigned by: {getUserName(task.assigned_by)}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
      {/* Create Task Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Task Title"
              value={newTask.title}
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Task Description"
              value={newTask.description}
              onChangeText={(text) =>
                setNewTask({ ...newTask, description: text })
              }
              multiline
              numberOfLines={4}
            />
            <Picker
              selectedValue={newTask.assigned_to}
              onValueChange={(itemValue) =>
                setNewTask({ ...newTask, assigned_to: itemValue })
              }
              style={styles.input}
            >
              <Picker.Item label="Select Assignee" value="" />
              {profiles.map((profile) => (
                <Picker.Item
                  key={profile.id}
                  label={profile.full_name}
                  value={profile.id}
                />
              ))}
            </Picker>
            <Picker
              selectedValue={newTask.priority}
              onValueChange={(itemValue) =>
                setNewTask({ ...newTask, priority: itemValue })
              }
              style={styles.input}
            >
              <Picker.Item label="Low" value="Low" />
              <Picker.Item label="Medium" value="Medium" />
              <Picker.Item label="High" value="High" />
              <Picker.Item label="Urgent" value="Urgent" />
            </Picker>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.createTaskButton]}
                onPress={handleCreateTask}
              >
                <Text style={styles.buttonText}>Create Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  createButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  taskList: {
    flex: 1,
    padding: 20,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  modalButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  createTaskButton: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
