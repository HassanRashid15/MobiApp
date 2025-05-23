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
} from "react-native";
import { useState } from "react";
import { useTasks, Task } from "../context/TaskContext";

export default function Admin() {
  const { tasks, addTask, updateTaskStatus } = useTasks();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    name: "",
    description: "",
    assignedTo: "",
    status: "pending" as Task["status"],
    createdBy: "admin",
  });

  const handleCreateTask = () => {
    if (!newTask.name.trim()) {
      Alert.alert("Error", "Task name is required");
      return;
    }

    addTask(newTask);
    setNewTask({
      name: "",
      description: "",
      assignedTo: "",
      status: "pending",
      createdBy: "admin",
    });
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Task Creation Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.createButtonText}>Create New Task</Text>
      </TouchableOpacity>

      {/* Task List */}
      <ScrollView style={styles.taskList}>
        {tasks.map((task) => (
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
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
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
        ))}
      </ScrollView>

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
              placeholder="Task Name"
              value={newTask.name}
              onChangeText={(text) => setNewTask({ ...newTask, name: text })}
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

            <TextInput
              style={styles.input}
              placeholder="Assign To (admin/manager/employee)"
              value={newTask.assignedTo}
              onChangeText={(text) =>
                setNewTask({ ...newTask, assignedTo: text })
              }
            />

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
