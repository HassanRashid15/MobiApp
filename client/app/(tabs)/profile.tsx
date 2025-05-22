import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useRouter } from "expo-router";
import { supabase } from "../../lib/supabase";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const role = user?.user_metadata?.role;
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setProfileLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .single();
      setAvatarUrl(data?.avatar_url || null);
      setProfileLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/(tabs)");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const uploadImageToSupabase = async (userId, imageUri) => {
    const fileExt = imageUri.split(".").pop().toLowerCase();
    let mimeType = "image/jpeg";
    if (fileExt === "png") mimeType = "image/png";
    else if (fileExt === "jpg" || fileExt === "jpeg") mimeType = "image/jpeg";
    else if (fileExt === "webp") mimeType = "image/webp";
    else if (fileExt === "gif") mimeType = "image/gif";
    else if (fileExt === "bmp") mimeType = "image/bmp";
    const fileName = `${userId}.${fileExt}`;
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: fileName,
      type: mimeType,
    } as any);
    const { error } = await supabase.storage
      .from("avatars")
      .upload(fileName, formData, {
        cacheControl: "3600",
        upsert: true,
        contentType: mimeType,
      });
    if (error) return null;
    const { data: publicUrl } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);
    return publicUrl?.publicUrl || null;
  };

  const pickAndUploadImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setUploading(true);
      try {
        const avatarUrl = await uploadImageToSupabase(user.id, imageUri);
        if (avatarUrl) {
          await supabase
            .from("profiles")
            .update({ avatar_url: avatarUrl })
            .eq("id", user.id);
          setAvatarUrl(avatarUrl);
        } else {
          Alert.alert(
            "Upload Failed",
            "Could not upload image. Please try a different file."
          );
        }
      } catch (error) {
        Alert.alert(
          "Error",
          error.message || "An error occurred during upload."
        );
      } finally {
        setUploading(false);
      }
    }
  };

  if (loading || profileLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.notLoggedInText}>
          Please log in to view your profile
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push("/login")}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <TouchableOpacity onPress={pickAndUploadImage} disabled={uploading}>
            <Image
              source={{
                uri: avatarUrl || "https://via.placeholder.com/150",
              }}
              style={styles.profileImage}
            />
            <Text style={{ color: "#fff", textAlign: "center", marginTop: 6 }}>
              {uploading ? "Uploading..." : "Change Avatar"}
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>
          {user.user_metadata?.full_name || user.email?.split("@")[0]}
        </Text>
        <Text style={styles.role}>{role || "No Role Assigned"}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>{role || "Not Assigned"}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>User ID</Text>
            <Text style={styles.infoValue}>{user.id}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Last Sign In</Text>
            <Text style={styles.infoValue}>
              {new Date(user.last_sign_in_at || "").toLocaleDateString()}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    padding: 20,
    backgroundColor: "#007AFF",
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  role: {
    fontSize: 18,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 5,
    fontWeight: "500",
  },
  email: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  notLoggedInText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
