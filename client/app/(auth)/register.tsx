import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";
import * as ImagePicker from "expo-image-picker";

export const options = {
  headerShown: false,
};

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [roleError, setRoleError] = useState("");
  const [roleModalVisible, setRoleModalVisible] = useState(false);
  const roles = ["Admin", "Manager", "Operator", "Tenant"];
  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      validateEmail(email) &&
      password.length >= 6 &&
      role !== "" &&
      image !== null &&
      phone.length >= 10 &&
      !uploading
    );
  };

  const handleRegister = async () => {
    let valid = true;
    if (!name.trim()) {
      setNameError("Name is required.");
      valid = false;
    } else {
      setNameError("");
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters.");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (phone.length < 10) {
      setPhoneError("Please enter a valid phone number.");
      valid = false;
    } else {
      setPhoneError("");
    }
    if (!role) {
      setRoleError("Role is required.");
      valid = false;
    } else {
      setRoleError("");
    }
    if (!valid) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        phone,
        options: {
          data: {
            full_name: name,
            role: role,
            phone: phone,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        let avatarUrl = null;
        if (image) {
          avatarUrl = await uploadImageToSupabase(data.user.id, image);
          if (avatarUrl) {
            await supabase.auth.updateUser({
              data: { avatar_url: avatarUrl },
            });
            await supabase
              .from("profiles")
              .update({ avatar_url: avatarUrl })
              .eq("id", data.user.id);
          }
        }
        // Redirect to 2FA setup page
        router.push({
          pathname: "/verify",
          params: { userId: data.user.id },
        });
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
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

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Register</Text>
      <View style={{ alignItems: "center", marginBottom: 16 }}>
        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={pickImage}
          disabled={loading || uploading}
        >
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                marginBottom: 8,
              }}
            />
          ) : (
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#eee",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 8,
              }}
            >
              <Ionicons name="camera" size={32} color="#888" />
            </View>
          )}
          <Text style={{ color: "#007AFF" }}>
            {uploading ? "Uploading..." : "Pick Profile Picture"}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name :</Text>
        <TextInput
          style={[styles.input, nameError && styles.inputError]}
          placeholder="Enter your name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />
        {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email :</Text>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password :</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[
              styles.input,
              { flex: 1 },
              passwordError && styles.inputError,
            ]}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
          />
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#555"
            />
          </Pressable>
        </View>
        {passwordError ? (
          <Text style={styles.error}>{passwordError}</Text>
        ) : null}
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number :</Text>
        <TextInput
          style={[styles.input, phoneError && styles.inputError]}
          placeholder="Enter your phone number"
          placeholderTextColor="#999"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          editable={!loading}
        />
        {phoneError ? <Text style={styles.error}>{phoneError}</Text> : null}
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Role :</Text>
        <TouchableOpacity
          style={[
            styles.input,
            { justifyContent: "center" },
            roleError && styles.inputError,
          ]}
          onPress={() => setRoleModalVisible(true)}
          disabled={loading}
        >
          <Text style={{ color: role ? "#222" : "#aaa", fontSize: 16 }}>
            {role || "Select Role"}
          </Text>
        </TouchableOpacity>
        {roleError ? <Text style={styles.error}>{roleError}</Text> : null}
        <Modal
          visible={roleModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setRoleModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setRoleModalVisible(false)}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.3)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  padding: 20,
                  minWidth: 200,
                }}
              >
                <FlatList
                  data={roles}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={{ padding: 12 }}
                      onPress={() => {
                        setRole(item);
                        setRoleModalVisible(false);
                      }}
                    >
                      <Text style={{ fontSize: 16 }}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      <TouchableOpacity
        style={[
          styles.registerButton,
          (loading || !isFormValid()) && styles.registerButtonDisabled,
        ]}
        onPress={handleRegister}
        disabled={loading || !isFormValid()}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.registerButtonText}>Register</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => router.push("/login")}
        disabled={loading}
      >
        <Text style={styles.loginLinkText}>
          Already have an account? Login here
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
    color: "#222",
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  inputError: {
    borderColor: "#d00",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeButton: {
    padding: 8,
    marginLeft: 4,
    position: "absolute",
    right: 5,
    top: 5,
  },
  error: {
    color: "#d00",
    fontSize: 13,
    marginTop: 2,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 8,
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: "#007AFF",
  },
  registerButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  registerButtonDisabled: {
    backgroundColor: "#007AFF80",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  loginLink: {
    marginTop: 16,
    padding: 8,
  },
  loginLinkText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
