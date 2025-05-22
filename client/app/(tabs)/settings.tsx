import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../lib/supabase";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchAccountStatus();
    }
  }, [user]);

  const fetchAccountStatus = async () => {
    try {
      setLoadingStatus(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("is_active")
        .eq("id", user?.id)
        .single();
      if (error) throw error;
      setIsActive(data?.is_active ?? true);
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoadingStatus(false);
    }
  };

  const toggleAccountStatus = async () => {
    try {
      setLoadingStatus(true);
      const { error } = await supabase
        .from("profiles")
        .update({ is_active: !isActive })
        .eq("id", user?.id);
      if (error) throw error;
      setIsActive((prev) => !prev);
    } catch (error) {
      // Optionally handle error
    } finally {
      setLoadingStatus(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={notifications ? "#007AFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={darkMode ? "#007AFF" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        {user ? (
          <>
            {!isActive ? (
              <View style={{ alignItems: "center", marginVertical: 40 }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#ff3b30",
                    marginBottom: 20,
                    textAlign: "center",
                  }}
                >
                  Your account is not active. Please activate your account to
                  continue.
                </Text>
                {loadingStatus ? (
                  <ActivityIndicator color="#007AFF" />
                ) : (
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#4CD964",
                      padding: 14,
                      borderRadius: 8,
                    }}
                    onPress={toggleAccountStatus}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 16,
                      }}
                    >
                      Activate Account
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <>
                <TouchableOpacity style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                  <Text style={styles.settingLabel}>Privacy Settings</Text>
                </TouchableOpacity>
                <View style={styles.settingItem}>
                  {loadingStatus ? (
                    <ActivityIndicator color="#007AFF" />
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#FF3B30",
                        padding: 10,
                        borderRadius: 8,
                      }}
                      onPress={toggleAccountStatus}
                    >
                      <Text style={{ color: "#fff", fontWeight: "bold" }}>
                        Deactivate Account
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.settingItem}
                  onPress={handleLogout}
                >
                  <Text style={[styles.settingLabel, styles.dangerText]}>
                    Log Out
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.settingLabel}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.settingLabel}>Login</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: Platform.OS === "ios" ? 20 : 16,
    paddingTop: Platform.OS === "ios" ? 20 : 16,
  },
  section: {
    marginBottom: Platform.OS === "ios" ? 30 : 24,
  },
  sectionTitle: {
    fontSize: Platform.OS === "ios" ? 18 : 16,
    fontWeight: "600",
    marginBottom: Platform.OS === "ios" ? 15 : 12,
    color: "#333",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Platform.OS === "ios" ? 12 : 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingLabel: {
    fontSize: Platform.OS === "ios" ? 16 : 15,
    color: "#333",
  },
  dangerText: {
    color: "#ff3b30",
  },
});
