import React, { createContext, useContext, useState } from "react";
import { useAuth } from "../hooks/useAuth";

export interface Task {
  id: string;
  name: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  createdAt: Date;
  assignedTo?: string;
  createdBy?: string;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt">) => void;
  updateTaskStatus: (taskId: string, newStatus: Task["status"]) => void;
  deleteTask: (taskId: string) => void;
  getTasksByRole: (role: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();

  const addTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTaskStatus = (taskId: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  };

  const getTasksByRole = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return tasks;
      case "manager":
        return tasks.filter(
          (task) =>
            task.assignedTo === "manager" || task.assignedTo === "employee"
        );
      case "employee":
        return tasks.filter((task) => task.assignedTo === "employee");
      default:
        return [];
    }
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTaskStatus,
        deleteTask,
        getTasksByRole,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
}
