import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  View,
  Modal,
  SafeAreaView,
  Dimensions,
  Platform,
} from "react-native";
import { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { FontAwesome } from "@expo/vector-icons";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const isSmallScreen = SCREEN_WIDTH < 375;

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

interface Task {
  id: string;
  room: string;
  description?: string;
  todoList?: { id: string; text: string; completed: boolean }[];
  status: "in progress" | "pending" | "done" | "in review";
  assignedTo: TeamMember[];
  priority: "low" | "medium" | "high";
  dueDate?: string;
}

export default function BuildingTodoScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    room: "",
    description: "",
    todoList: [] as { id: string; text: string; completed: boolean }[],
    assignedTo: [] as TeamMember[],
    priority: "medium" as "low" | "medium" | "high",
    status: "pending" as "in progress" | "pending" | "done" | "in review",
    dueDate: "",
  });
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [roomDropdownVisible, setRoomDropdownVisible] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [statusDropdownVisible, setStatusDropdownVisible] = useState(false);
  const [statusEditModalVisible, setStatusEditModalVisible] = useState(false);
  const [showTodoInput, setShowTodoInput] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [newTodoItem, setNewTodoItem] = useState("");

  const rooms = [
    "Living Room",
    "Kitchen",
    "Bedroom",
    "Bathroom",
    "Office",
    "Garage",
  ];

  const teamMembers: TeamMember[] = [
    { id: "1", name: "John Smith", role: "Project Manager" },
    { id: "2", name: "Sarah Johnson", role: "Senior Engineer" },
    { id: "3", name: "Mike Brown", role: "Electrician" },
    { id: "4", name: "Lisa Chen", role: "Plumber" },
    { id: "5", name: "David Wilson", role: "Carpenter" },
  ];

  const addTask = () => {
    if (!newTask.room) {
      Alert.alert("Error", "Please select a room");
      return;
    }
    if (
      !newTask.description &&
      (!newTask.todoList || newTask.todoList.length === 0)
    ) {
      Alert.alert(
        "Error",
        "Please add either a description or at least one todo item"
      );
      return;
    }
    if (newTask.assignedTo.length === 0) {
      Alert.alert(
        "Error",
        "Please assign the task to at least one team member"
      );
      return;
    }
    const task: Task = {
      id: Date.now().toString(),
      room: newTask.room,
      status: newTask.status,
      assignedTo: newTask.assignedTo,
      priority: newTask.priority,
      dueDate: newTask.dueDate,
    };

    if (newTask.description) {
      task.description = newTask.description;
    }
    if (newTask.todoList && newTask.todoList.length > 0) {
      task.todoList = newTask.todoList;
    }

    setTasks([...tasks, task]);
    setNewTask({
      room: "",
      description: "",
      todoList: [],
      assignedTo: [],
      priority: "medium",
      status: "pending",
      dueDate: "",
    });
    setShowDescriptionInput(false);
    setShowTodoInput(false);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "done" ? "in progress" : "done",
            }
          : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setTasks(tasks.filter((task) => task.id !== taskId)),
      },
    ]);
  };

  const toggleTeamMember = (member: TeamMember) => {
    setNewTask((prev) => {
      const isAlreadyAssigned = prev.assignedTo.some((m) => m.id === member.id);
      if (isAlreadyAssigned) {
        return {
          ...prev,
          assignedTo: prev.assignedTo.filter((m) => m.id !== member.id),
        };
      } else {
        return {
          ...prev,
          assignedTo: [...prev.assignedTo, member],
        };
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#FF3B30";
      case "medium":
        return "#FF9500";
      case "low":
        return "#34C759";
      default:
        return "#8E8E93";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in progress":
        return "#007AFF";
      case "pending":
        return "#FF9500";
      case "done":
        return "#34C759";
      case "in review":
        return "#5856D6";
      default:
        return "#8E8E93";
    }
  };

  const filteredTasks = selectedRoom
    ? tasks.filter((task) => task.room === selectedRoom)
    : tasks;

  const viewTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setShowDetailsModal(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.headerTitle}>Task Management</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Assign and track tasks
          </ThemedText>
        </View>

        {/* Add New Task Card */}
        <View style={styles.card}>
          <ThemedText style={styles.cardTitle}>Create New Task</ThemedText>

          {/* Room Selection */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Room</ThemedText>
            <TouchableOpacity
              style={styles.roomSelector}
              onPress={() => setRoomDropdownVisible(!roomDropdownVisible)}
            >
              <ThemedText style={styles.roomSelectorText}>
                {newTask.room || "Select room"}
              </ThemedText>
              <FontAwesome
                name={roomDropdownVisible ? "chevron-up" : "chevron-down"}
                size={16}
                color="#8E8E93"
              />
            </TouchableOpacity>
            {roomDropdownVisible && (
              <View style={styles.roomDropdown}>
                {rooms.map((room) => (
                  <TouchableOpacity
                    key={room}
                    style={styles.roomDropdownItem}
                    onPress={() => {
                      setNewTask({ ...newTask, room });
                      setRoomDropdownVisible(false);
                    }}
                  >
                    <ThemedText style={styles.roomDropdownText}>
                      {room}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Description/Todo Selection */}
          <View style={styles.inputGroup}>
            <View style={styles.contentTypeSelection}>
              <TouchableOpacity
                style={[
                  styles.contentTypeButton,
                  showDescriptionInput && styles.contentTypeButtonSelected,
                ]}
                onPress={() => setShowDescriptionInput(!showDescriptionInput)}
              >
                <FontAwesome
                  name="file-text-o"
                  size={16}
                  color={showDescriptionInput ? "#FFFFFF" : "#8E8E93"}
                />
                <ThemedText
                  style={[
                    styles.contentTypeText,
                    showDescriptionInput && styles.contentTypeTextSelected,
                  ]}
                >
                  Description
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.contentTypeButton,
                  showTodoInput && styles.contentTypeButtonSelected,
                ]}
                onPress={() => setShowTodoInput(!showTodoInput)}
              >
                <FontAwesome
                  name="list-ul"
                  size={16}
                  color={showTodoInput ? "#FFFFFF" : "#8E8E93"}
                />
                <ThemedText
                  style={[
                    styles.contentTypeText,
                    showTodoInput && styles.contentTypeTextSelected,
                  ]}
                >
                  Todo List
                </ThemedText>
              </TouchableOpacity>
            </View>

            {showDescriptionInput && (
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Description</ThemedText>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="What needs to be done?"
                  value={newTask.description}
                  onChangeText={(text) =>
                    setNewTask({ ...newTask, description: text })
                  }
                  placeholderTextColor="#A1A1A6"
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}

            {showTodoInput && (
              <View style={styles.inputContainer}>
                <ThemedText style={styles.label}>Todo List</ThemedText>
                <View style={styles.todoInputContainer}>
                  <TextInput
                    style={[styles.input, styles.todoInput]}
                    placeholder="Add todo item"
                    value={newTodoItem}
                    onChangeText={setNewTodoItem}
                    placeholderTextColor="#A1A1A6"
                  />
                  <TouchableOpacity
                    style={styles.addTodoButton}
                    onPress={() => {
                      if (newTodoItem.trim()) {
                        setNewTask({
                          ...newTask,
                          todoList: [
                            ...newTask.todoList,
                            {
                              id: Date.now().toString(),
                              text: newTodoItem.trim(),
                              completed: false,
                            },
                          ],
                        });
                        setNewTodoItem("");
                      }
                    }}
                  >
                    <FontAwesome name="plus" size={16} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                {newTask.todoList.length > 0 && (
                  <View style={styles.todoList}>
                    {newTask.todoList.map((item) => (
                      <View key={item.id} style={styles.todoItem}>
                        <ThemedText style={styles.todoText}>
                          {item.text}
                        </ThemedText>
                        <TouchableOpacity
                          style={styles.removeTodoButton}
                          onPress={() => {
                            setNewTask({
                              ...newTask,
                              todoList: newTask.todoList.filter(
                                (todo) => todo.id !== item.id
                              ),
                            });
                          }}
                        >
                          <FontAwesome name="times" size={16} color="#FF3B30" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>

          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Priority</ThemedText>
            <View style={styles.priorityButtons}>
              {["low", "medium", "high"].map((priority) => (
                <TouchableOpacity
                  key={priority}
                  style={[
                    styles.priorityButton,
                    newTask.priority === priority && {
                      backgroundColor: getPriorityColor(priority),
                    },
                  ]}
                  onPress={() =>
                    setNewTask({
                      ...newTask,
                      priority: priority as "low" | "medium" | "high",
                    })
                  }
                >
                  <ThemedText
                    style={[
                      styles.priorityText,
                      newTask.priority === priority &&
                        styles.priorityTextSelected,
                    ]}
                  >
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.assignButton}
            onPress={() => setShowAssignModal(true)}
          >
            <FontAwesome name="user-plus" size={18} color="#007AFF" />
            <ThemedText style={styles.assignButtonText}>
              {newTask.assignedTo.length > 0
                ? `${newTask.assignedTo.length} member${
                    newTask.assignedTo.length > 1 ? "s" : ""
                  } assigned`
                : "Assign Team Members"}
            </ThemedText>
          </TouchableOpacity>

          {newTask.assignedTo.length > 0 && (
            <View style={styles.selectedMembers}>
              {newTask.assignedTo.map((member) => (
                <View key={member.id} style={styles.selectedMemberChip}>
                  <ThemedText style={styles.selectedMemberName}>
                    {member.name}
                  </ThemedText>
                  <TouchableOpacity
                    onPress={() => toggleTeamMember(member)}
                    style={styles.removeButton}
                  >
                    <FontAwesome name="times" size={12} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity style={styles.createButton} onPress={addTask}>
            <ThemedText style={styles.createButtonText}>Create Task</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Room Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.roomFilter}
          contentContainerStyle={styles.roomFilterContent}
        >
          <TouchableOpacity
            style={[styles.roomChip, !selectedRoom && styles.roomChipSelected]}
            onPress={() => setSelectedRoom(null)}
          >
            <ThemedText
              style={[
                styles.roomChipText,
                !selectedRoom && styles.roomChipTextSelected,
              ]}
            >
              All Rooms
            </ThemedText>
          </TouchableOpacity>
          {rooms.map((room) => (
            <TouchableOpacity
              key={room}
              style={[
                styles.roomChip,
                selectedRoom === room && styles.roomChipSelected,
              ]}
              onPress={() => setSelectedRoom(room)}
            >
              <ThemedText
                style={[
                  styles.roomChipText,
                  selectedRoom === room && styles.roomChipTextSelected,
                ]}
              >
                {room}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tasks List */}
        <View style={styles.taskList}>
          {filteredTasks.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome name="tasks" size={48} color="#C7C7CC" />
              <ThemedText style={styles.emptyStateText}>
                No tasks yet
              </ThemedText>
              <ThemedText style={styles.emptyStateSubtext}>
                {selectedRoom
                  ? `No tasks found for ${selectedRoom}`
                  : "Create a new task to get started"}
              </ThemedText>
            </View>
          ) : (
            filteredTasks.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <TouchableOpacity
                  style={styles.taskHeader}
                  onPress={() => toggleTaskStatus(task.id)}
                >
                  <View style={styles.taskHeaderLeft}>
                    <FontAwesome
                      name={
                        task.status === "done" ? "check-circle" : "circle-o"
                      }
                      size={24}
                      color={task.status === "done" ? "#34C759" : "#C7C7CC"}
                    />
                    <View style={styles.taskContent}>
                      <ThemedText style={styles.taskRoom}>
                        {task.room}
                      </ThemedText>
                      <View style={styles.cardStatusRow}>
                        <View
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: getStatusColor(task.status),
                            marginRight: 6,
                          }}
                        />
                        <ThemedText style={styles.cardStatusText}>
                          {task.status.charAt(0).toUpperCase() +
                            task.status.slice(1)}
                        </ThemedText>
                      </View>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.priorityBadge,
                      { backgroundColor: getPriorityColor(task.priority) },
                    ]}
                  >
                    <ThemedText style={styles.priorityBadgeText}>
                      {task.priority}
                    </ThemedText>
                  </View>
                </TouchableOpacity>

                <View style={styles.taskFooter}>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.assigneeScroll}
                  >
                    {task.assignedTo.map((member, index) => (
                      <View key={member.id} style={styles.assigneeInfo}>
                        <FontAwesome
                          name="user-circle"
                          size={20}
                          color="#8E8E93"
                        />
                        <ThemedText style={styles.assigneeText}>
                          {member.name}
                          {index < task.assignedTo.length - 1 ? "," : ""}
                        </ThemedText>
                      </View>
                    ))}
                  </ScrollView>
                  <View style={styles.taskActions}>
                    <TouchableOpacity
                      style={styles.viewButton}
                      onPress={() => viewTaskDetails(task)}
                    >
                      <FontAwesome name="eye" size={18} color="#007AFF" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => deleteTask(task.id)}
                    >
                      <FontAwesome name="trash" size={18} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Assign Task Modal */}
      <Modal
        visible={showAssignModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAssignModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>
                Select Team Members
              </ThemedText>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowAssignModal(false)}
              >
                <FontAwesome name="times" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.teamList}>
              {teamMembers.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={styles.teamMemberItem}
                  onPress={() => toggleTeamMember(member)}
                >
                  <View style={styles.teamMemberInfo}>
                    <View style={styles.avatarCircle}>
                      <FontAwesome name="user" size={20} color="#FFFFFF" />
                    </View>
                    <View>
                      <ThemedText style={styles.teamMemberName}>
                        {member.name}
                      </ThemedText>
                      <ThemedText style={styles.teamMemberRole}>
                        {member.role}
                      </ThemedText>
                    </View>
                  </View>
                  {newTask.assignedTo.some((m) => m.id === member.id) && (
                    <FontAwesome name="check" size={20} color="#34C759" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.modalDoneButton}
              onPress={() => setShowAssignModal(false)}
            >
              <ThemedText style={styles.modalDoneButtonText}>Done</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Task Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText style={styles.modalTitle}>Task Details</ThemedText>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setShowDetailsModal(false)}
              >
                <FontAwesome name="times" size={20} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {selectedTask && (
              <ScrollView style={styles.taskDetailsContent}>
                <View style={styles.detailCard}>
                  <View style={styles.detailHeader}>
                    <View style={styles.detailHeaderLeft}>
                      <View style={styles.roomIcon}>
                        <FontAwesome name="home" size={20} color="#FFFFFF" />
                      </View>
                      <View>
                        <ThemedText style={styles.detailRoom}>
                          {selectedTask.room}
                        </ThemedText>
                        <View style={styles.headerStatus}>
                          <View
                            style={[
                              styles.statusIndicator,
                              {
                                backgroundColor:
                                  selectedTask.status === "done"
                                    ? "#34C759"
                                    : selectedTask.status === "in progress"
                                    ? "#007AFF"
                                    : selectedTask.status === "in review"
                                    ? "#5856D6"
                                    : "#FF9500",
                              },
                            ]}
                          />
                          <ThemedText style={styles.headerStatusText}>
                            {selectedTask.status.charAt(0).toUpperCase() +
                              selectedTask.status.slice(1)}
                          </ThemedText>
                        </View>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.priorityBadge,
                        {
                          backgroundColor: getPriorityColor(
                            selectedTask.priority
                          ),
                        },
                      ]}
                    >
                      <ThemedText style={styles.priorityBadgeText}>
                        {selectedTask.priority}
                      </ThemedText>
                    </View>
                  </View>

                  <View style={styles.detailDivider} />

                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailLabel}>Status</ThemedText>
                    <View style={styles.statusSection}>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.statusButtons}
                      >
                        {["in progress", "pending", "done", "in review"].map(
                          (status) => (
                            <TouchableOpacity
                              key={status}
                              style={[
                                styles.statusButton,
                                {
                                  backgroundColor:
                                    selectedTask.status === status
                                      ? getStatusColor(status)
                                      : "#F2F2F7",
                                },
                              ]}
                              onPress={() => {
                                setTasks(
                                  tasks.map((task) =>
                                    task.id === selectedTask.id
                                      ? {
                                          ...task,
                                          status: status as
                                            | "in progress"
                                            | "pending"
                                            | "done"
                                            | "in review",
                                        }
                                      : task
                                  )
                                );
                                setSelectedTask({
                                  ...selectedTask,
                                  status: status as
                                    | "in progress"
                                    | "pending"
                                    | "done"
                                    | "in review",
                                });
                              }}
                            >
                              <ThemedText
                                style={[
                                  styles.statusButtonText,
                                  {
                                    color:
                                      selectedTask.status === status
                                        ? "#fff"
                                        : "#8E8E93",
                                  },
                                ]}
                              >
                                {status.charAt(0).toUpperCase() +
                                  status.slice(1)}
                              </ThemedText>
                            </TouchableOpacity>
                          )
                        )}
                      </ScrollView>
                    </View>
                  </View>

                  <View style={styles.detailDivider} />

                  {selectedTask.description && (
                    <>
                      <View style={styles.detailSection}>
                        <ThemedText style={styles.detailLabel}>
                          Description
                        </ThemedText>
                        <ThemedText style={styles.detailValue}>
                          {selectedTask.description}
                        </ThemedText>
                      </View>
                      <View style={styles.detailDivider} />
                    </>
                  )}

                  {selectedTask.todoList &&
                    selectedTask.todoList.length > 0 && (
                      <>
                        <View style={styles.detailSection}>
                          <ThemedText style={styles.detailLabel}>
                            Todo List
                          </ThemedText>
                          <View style={styles.modalTodoList}>
                            {selectedTask.todoList.map((item) => (
                              <TouchableOpacity
                                key={item.id}
                                style={styles.modalTodoItem}
                                onPress={() => {
                                  setTasks(
                                    tasks.map((task) =>
                                      task.id === selectedTask.id
                                        ? {
                                            ...task,
                                            todoList: task.todoList?.map(
                                              (todo) =>
                                                todo.id === item.id
                                                  ? {
                                                      ...todo,
                                                      completed:
                                                        !todo.completed,
                                                    }
                                                  : todo
                                            ),
                                          }
                                        : task
                                    )
                                  );
                                  if (selectedTask.todoList) {
                                    setSelectedTask({
                                      ...selectedTask,
                                      todoList: selectedTask.todoList.map(
                                        (todo) =>
                                          todo.id === item.id
                                            ? {
                                                ...todo,
                                                completed: !todo.completed,
                                              }
                                            : todo
                                      ),
                                    });
                                  }
                                }}
                              >
                                <View style={styles.modalTodoItemLeft}>
                                  <FontAwesome
                                    name={
                                      item.completed
                                        ? "check-circle"
                                        : "circle-o"
                                    }
                                    size={20}
                                    color={
                                      item.completed ? "#34C759" : "#C7C7CC"
                                    }
                                  />
                                  <ThemedText
                                    style={[
                                      styles.modalTodoText,
                                      item.completed &&
                                        styles.modalTodoTextCompleted,
                                    ]}
                                  >
                                    {item.text}
                                  </ThemedText>
                                </View>
                              </TouchableOpacity>
                            ))}
                          </View>
                        </View>
                        <View style={styles.detailDivider} />
                      </>
                    )}

                  <View style={styles.detailDivider} />

                  <View style={styles.detailSection}>
                    <ThemedText style={styles.detailLabel}>
                      Assigned Team Members
                    </ThemedText>
                    {selectedTask.assignedTo.map((member) => (
                      <View key={member.id} style={styles.assignedMember}>
                        <View style={styles.avatarCircle}>
                          <FontAwesome name="user" size={20} color="#FFFFFF" />
                        </View>
                        <View style={styles.memberInfo}>
                          <ThemedText style={styles.memberName}>
                            {member.name}
                          </ThemedText>
                          <ThemedText style={styles.memberRole}>
                            {member.role}
                          </ThemedText>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.modalDoneButton}
              onPress={() => setShowDetailsModal(false)}
            >
              <ThemedText style={styles.modalDoneButtonText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  container: {
    flex: 1,
    padding: isSmallScreen ? 12 : 16,
  },
  header: {
    marginBottom: isSmallScreen ? 16 : 24,
  },
  headerTitle: {
    fontSize: isSmallScreen ? 28 : 34,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
    paddingTop: 30,
  },
  headerSubtitle: {
    fontSize: isSmallScreen ? 15 : 17,
    color: "#8E8E93",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: isSmallScreen ? 12 : 16,
    marginBottom: 24,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#000000",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: isSmallScreen ? 13 : 15,
    fontWeight: "500",
    color: "#8E8E93",
    marginBottom: 8,
  },
  roomSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 12,
  },
  roomSelectorText: {
    fontSize: isSmallScreen ? 15 : 17,
    color: "#000000",
  },
  roomDropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginTop: 4,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  roomDropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  roomDropdownText: {
    fontSize: isSmallScreen ? 15 : 17,
    color: "#000000",
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 12,
    fontSize: isSmallScreen ? 15 : 17,
    color: "#000000",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  priorityButtons: {
    flexDirection: "row",
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
  },
  priorityText: {
    fontSize: isSmallScreen ? 13 : 15,
    fontWeight: "500",
    color: "#8E8E93",
  },
  priorityTextSelected: {
    color: "#FFFFFF",
  },
  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    marginBottom: 16,
  },
  assignButtonText: {
    fontSize: isSmallScreen ? 15 : 17,
    color: "#007AFF",
  },
  selectedMembers: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  selectedMemberChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 8,
  },
  selectedMemberName: {
    color: "#FFFFFF",
    fontSize: isSmallScreen ? 13 : 15,
  },
  removeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: isSmallScreen ? 15 : 17,
    fontWeight: "600",
  },
  roomFilter: {
    marginBottom: 24,
  },
  roomFilterContent: {
    paddingRight: 16,
  },
  roomChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    marginRight: 8,
  },
  roomChipSelected: {
    backgroundColor: "#007AFF",
  },
  roomChipText: {
    fontSize: isSmallScreen ? 13 : 15,
    color: "#8E8E93",
  },
  roomChipTextSelected: {
    color: "#FFFFFF",
    fontWeight: "500",
  },
  taskList: {
    flex: 1,
  },
  taskCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    padding: isSmallScreen ? 12 : 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  taskHeaderLeft: {
    flexDirection: "row",
    gap: 12,
    flex: 1,
  },
  taskContent: {
    flex: 1,
  },
  taskRoom: {
    fontSize: isSmallScreen ? 12 : 13,
    color: "#8E8E93",
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: isSmallScreen ? 15 : 17,
    color: "#000000",
  },
  taskCompleted: {
    textDecorationLine: "line-through",
    color: "#8E8E93",
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  priorityBadgeText: {
    color: "#FFFFFF",
    fontSize: isSmallScreen ? 10 : 12,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  assigneeScroll: {
    flex: 1,
  },
  assigneeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 16,
  },
  assigneeText: {
    fontSize: isSmallScreen ? 12 : 13,
    color: "#8E8E93",
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: isSmallScreen ? 32 : 48,
  },
  emptyStateText: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: isSmallScreen ? 13 : 15,
    color: "#8E8E93",
    marginTop: 8,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  modalTitle: {
    fontSize: isSmallScreen ? 20 : 24,
    fontWeight: "700",
    color: "#000000",
  },
  modalCloseButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
  },
  teamList: {
    padding: 16,
  },
  teamMemberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  teamMemberInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  teamMemberName: {
    fontSize: isSmallScreen ? 15 : 17,
    fontWeight: "500",
    color: "#000000",
  },
  teamMemberRole: {
    fontSize: isSmallScreen ? 12 : 13,
    color: "#8E8E93",
  },
  modalDoneButton: {
    margin: 20,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalDoneButtonText: {
    color: "#FFFFFF",
    fontSize: isSmallScreen ? 15 : 17,
    fontWeight: "600",
  },
  taskActions: {
    flexDirection: "row",
    gap: 8,
  },
  viewButton: {
    padding: 8,
  },
  taskDetailsContent: {
    padding: 20,
  },
  detailCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 16,
  },
  detailHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  roomIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  detailRoom: {
    fontSize: isSmallScreen ? 18 : 20,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  headerStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 0,
  },
  headerStatusText: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "500",
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusSection: {
    marginTop: 8,
  },
  statusButtons: {
    flexDirection: "row",
    paddingRight: 16,
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  statusButtonText: {
    fontWeight: "500",
    fontSize: 13,
  },
  detailDivider: {
    height: 1,
    backgroundColor: "#F2F2F7",
    marginHorizontal: 16,
  },
  detailSection: {
    padding: 16,
  },
  detailLabel: {
    fontSize: isSmallScreen ? 13 : 15,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: isSmallScreen ? 15 : 17,
    color: "#000000",
    lineHeight: 22,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F2F2F7",
    padding: 12,
    borderRadius: 10,
  },
  dueDateText: {
    fontSize: isSmallScreen ? 15 : 17,
    color: "#000000",
  },
  assignedMember: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: isSmallScreen ? 15 : 17,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 2,
  },
  memberRole: {
    fontSize: isSmallScreen ? 12 : 13,
    color: "#8E8E93",
  },
  cardStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
    marginBottom: 2,
  },
  cardStatusText: {
    fontSize: 13,
    color: "#8E8E93",
    fontWeight: "500",
  },
  contentTypeSelection: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  contentTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
  },
  contentTypeButtonSelected: {
    backgroundColor: "#007AFF",
  },
  contentTypeText: {
    fontSize: isSmallScreen ? 13 : 15,
    fontWeight: "500",
    color: "#8E8E93",
  },
  contentTypeTextSelected: {
    color: "#FFFFFF",
  },
  inputContainer: {
    marginTop: 8,
  },
  todoInputContainer: {
    flexDirection: "row",
    gap: 8,
  },
  todoInput: {
    flex: 1,
  },
  addTodoButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  todoList: {
    marginTop: 12,
  },
  todoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    marginBottom: 8,
  },
  todoText: {
    flex: 1,
    fontSize: isSmallScreen ? 13 : 15,
    color: "#000000",
  },
  removeTodoButton: {
    padding: 4,
  },
  modalTodoList: {
    marginTop: 8,
  },
  modalTodoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  modalTodoItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  modalTodoText: {
    fontSize: isSmallScreen ? 15 : 17,
    color: "#000000",
  },
  modalTodoTextCompleted: {
    textDecorationLine: "line-through",
    color: "#8E8E93",
  },
});

// Minimal Picker-in-Modal Example for iOS testing
import React from "react";

export function TestPickerModal() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [status, setStatus] = React.useState("pending");

  // Local getStatusColor for the test modal
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in progress":
        return "#007AFF";
      case "pending":
        return "#FF9500";
      case "done":
        return "#34C759";
      case "in review":
        return "#5856D6";
      default:
        return "#8E8E93";
    }
  };

  return (
    <View style={{ marginTop: 40, padding: 16 }}>
      <TouchableOpacity
        style={{ backgroundColor: "#007AFF", padding: 12, borderRadius: 8 }}
        onPress={() => setModalVisible(true)}
      >
        <ThemedText style={{ color: "#fff", textAlign: "center" }}>
          Open Status Picker Modal
        </ThemedText>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        presentationStyle="pageSheet"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 24,
              width: 300,
            }}
          >
            <ThemedText style={{ marginBottom: 12 }}>Select Status</ThemedText>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {["in progress", "pending", "done", "in review"].map((s) => (
                <TouchableOpacity
                  key={s}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 8,
                    backgroundColor:
                      status === s ? getStatusColor(s) : "#F2F2F7",
                    alignItems: "center",
                  }}
                  onPress={() => setStatus(s)}
                >
                  <ThemedText
                    style={{
                      color: status === s ? "#fff" : "#8E8E93",
                      fontWeight: "500",
                    }}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={{
                marginTop: 16,
                backgroundColor: "#007AFF",
                padding: 12,
                borderRadius: 8,
              }}
              onPress={() => setModalVisible(false)}
            >
              <ThemedText style={{ color: "#fff", textAlign: "center" }}>
                Close
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
