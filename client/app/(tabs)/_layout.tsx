import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Platform } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function TabLayout() {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setRole(null);
        setIsActive(true);
        return;
      }
      const { data, error } = await supabase
        .from("profiles")
        .select("role, is_active")
        .eq("id", user.id)
        .single();
      setRole(data?.role || null);
      setIsActive(data?.is_active ?? true);
    };
    fetchProfile();
  }, [user]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#eee",
          height: Platform.OS === "ios" ? 85 : 60,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: Platform.OS === "ios" ? 12 : 10,
          fontWeight: "500",
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="home"
              size={Platform.OS === "ios" ? 24 : 22}
              color={color}
            />
          ),
        }}
      />
      {role && role.toLowerCase() === "admin" && (
        <Tabs.Screen
          name="admin-dashboard"
          options={{
            title: "Admin",
            tabBarIcon: ({ color }) => (
              <FontAwesome
                name="dashboard"
                size={Platform.OS === "ios" ? 24 : 22}
                color={color}
              />
            ),
          }}
        />
      )}
      {isActive && (
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            tabBarIcon: ({ color }) => (
              <FontAwesome
                name="search"
                size={Platform.OS === "ios" ? 24 : 22}
                color={color}
              />
            ),
          }}
        />
      )}
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="user"
              size={Platform.OS === "ios" ? 24 : 22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="cog"
              size={Platform.OS === "ios" ? 24 : 22}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="bell"
              size={Platform.OS === "ios" ? 24 : 22}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
