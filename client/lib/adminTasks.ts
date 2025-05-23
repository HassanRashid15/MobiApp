import { supabase } from "./supabase";

// Insert a new admin task
export async function insertAdminTask(task: {
  title: string;
  description?: string;
  assigned_to: string;
  assigned_by: string;
  status?: "Pending" | "In Progress" | "Completed" | "Cancelled";
  priority?: "Low" | "Medium" | "High" | "Urgent";
  due_date?: string;
  notes?: string;
}) {
  const { data, error } = await supabase
    .from("admin_tasks")
    .insert([
      {
        ...task,
        status: task.status || "Pending",
        priority: task.priority || "Medium",
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Fetch all admin tasks (for admin)
export async function fetchAllAdminTasks() {
  const { data, error } = await supabase
    .from("admin_tasks")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

// Fetch all user profiles (id and full_name)
export async function fetchAllProfiles() {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name");
  if (error) throw error;
  return data;
}
