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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../lib/supabase";

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
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);

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
    if (!valid) return;

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        Alert.alert(
          "Registration Successful",
          "Please check your email to verify your account.",
          [{ text: "OK", onPress: () => router.push("/login") }]
        );
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Register</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={[styles.input, nameError && styles.inputError]}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          editable={!loading}
        />
        {nameError ? <Text style={styles.error}>{nameError}</Text> : null}
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!loading}
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordRow}>
          <TextInput
            style={[
              styles.input,
              { flex: 1 },
              passwordError && styles.inputError,
            ]}
            placeholder="Password"
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
      <TouchableOpacity
        style={[
          styles.registerButton,
          loading && styles.registerButtonDisabled,
        ]}
        onPress={handleRegister}
        disabled={loading}
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
