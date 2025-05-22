import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
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
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const options = {
  headerShown: false,
};

function validateEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [biometricLoading, setBiometricLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // On mount, check for saved email
  useEffect(() => {
    (async () => {
      const savedEmail = await AsyncStorage.getItem("remembered_email");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    })();
  }, []);

  const isFormValid = () => {
    return validateEmail(email) && password.length >= 6 && rememberMe;
  };

  const handleLogin = async () => {
    let valid = true;
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        // Offer to save credentials for biometrics
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        if (hasHardware && isEnrolled) {
          Alert.alert(
            "Enable Biometric Login?",
            "Would you like to use fingerprint/Face ID for future logins?",
            [
              {
                text: "No",
                style: "cancel",
                onPress: () => router.replace("/(tabs)"),
              },
              {
                text: "Yes",
                onPress: async () => {
                  await SecureStore.setItemAsync("biometric_email", email);
                  await SecureStore.setItemAsync(
                    "biometric_password",
                    password
                  );
                  router.replace("/(tabs)");
                },
              },
            ]
          );
        } else {
          router.replace("/(tabs)");
        }
      }

      if (rememberMe) {
        await AsyncStorage.setItem("remembered_email", email);
      } else {
        await AsyncStorage.removeItem("remembered_email");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    setLoading(false);
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Success",
        "Password reset email sent. Please check your inbox."
      );
    }
  };

  const handleBiometricLogin = async (type: "fingerprint" | "face") => {
    setBiometricLoading(true);
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        Alert.alert("Biometric authentication not available");
        setBiometricLoading(false);
        return;
      }
      const promptMessage =
        type === "face" ? "Login with Face ID" : "Login with Fingerprint";
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
      });
      if (result.success) {
        // Try to get stored credentials
        const savedEmail = await SecureStore.getItemAsync("biometric_email");
        const savedPassword = await SecureStore.getItemAsync(
          "biometric_password"
        );
        if (savedEmail && savedPassword) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          await handleLoginWithCredentials(savedEmail, savedPassword);
        } else {
          Alert.alert(
            "No credentials stored",
            "Please log in manually first. After a successful login, you'll be prompted to enable biometric login."
          );
        }
      }
    } catch (e) {
      Alert.alert("Biometric authentication failed");
    }
    setBiometricLoading(false);
  };

  const handleLoginWithCredentials = async (
    emailToUse: string,
    passwordToUse: string
  ) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: passwordToUse,
      });
      if (error) throw error;
      if (data?.user) {
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/(tabs)")}
      >
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Login</Text>
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 0,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={{ marginRight: 8 }}
          >
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 1,
                borderColor: "#007AFF",
                backgroundColor: rememberMe ? "#007AFF" : "#fff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {rememberMe && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
          </TouchableOpacity>

          <Text style={{ color: "#222", fontSize: 15 }}>Remember Me</Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/forgotpassword")}
          disabled={loading}
        >
          <Text style={{ color: "#007AFF", marginTop: 0 }}>
            Forgot Password?
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.loginButton,
          (loading || !isFormValid()) && styles.loginButtonDisabled,
        ]}
        onPress={handleLogin}
        disabled={loading || !isFormValid()}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerLink}
        onPress={() => router.push("/register")}
        disabled={loading}
      >
        <Text style={styles.registerLinkText}>
          Dont have an account? Register here
        </Text>
      </TouchableOpacity>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => handleBiometricLogin("fingerprint")}
          style={{ alignItems: "center", marginHorizontal: 16 }}
          disabled={biometricLoading || loading}
        >
          <Ionicons name="finger-print" size={36} color="#007AFF" />
          <Text style={{ color: "#007AFF", fontSize: 12, marginTop: 4 }}>
            Fingerprint
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleBiometricLogin("face")}
          style={{ alignItems: "center", marginHorizontal: 16 }}
          disabled={biometricLoading || loading}
        >
          <Ionicons name="person-circle-outline" size={36} color="#007AFF" />
          <Text style={{ color: "#007AFF", fontSize: 12, marginTop: 4 }}>
            Face ID
          </Text>
        </TouchableOpacity>
      </View>
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
  loginButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  loginButtonDisabled: {
    backgroundColor: "#007AFF80",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  registerLink: {
    marginTop: 16,
    padding: 8,
  },
  registerLinkText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
