import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

// Replace these with your Supabase project URL and anon key
const supabaseUrl = "https://svmrnvddjbljnuoolkbr.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2bXJudmRkamJsam51b29sa2JyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NDg4MzksImV4cCI6MjA2MzMyNDgzOX0.ZQlp0MFC05AXxqgXWMVuRtJjmK2naSbNls8xqzdnS60";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
