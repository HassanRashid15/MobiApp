import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { supabase } from "../../lib/supabase";

export const options = {
  headerShown: false,
};

export default function Verify2FAPage() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const [emailCode, setEmailCode] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  useEffect(() => {
    sendVerificationCodes();
  }, []);

  const sendVerificationCodes = async () => {
    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user?.email || !user?.phone) {
        throw new Error("User email or phone not found");
      }

      // Send email verification code
      const { error: emailError } = await supabase.auth.signInWithOtp({
        email: user.email,
        options: {
          emailRedirectTo: "mobiapp://verify-2fa",
        },
      });
      if (emailError) throw emailError;
      setEmailSent(true);

      // Send SMS verification code
      const { error: smsError } = await supabase.auth.signInWithOtp({
        phone: user.phone,
      });
      if (smsError) throw smsError;
      setSmsSent(true);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!emailCode || !phoneCode) {
      Alert.alert("Error", "Please enter both verification codes");
      return;
    }

    try {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user?.email || !user?.phone) {
        throw new Error("User email or phone not found");
      }

      // Verify email code
      const { error: emailError } = await supabase.auth.verifyOtp({
        email: user.email,
        token: emailCode,
        type: "email",
      });
      if (emailError) throw emailError;

      // Verify phone code
      const { error: phoneError } = await supabase.auth.verifyOtp({
        phone: user.phone,
        token: phoneCode,
        type: "sms",
      });
      if (phoneError) throw phoneError;

      Alert.alert("Success", "2FA verification completed successfully", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
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
      <Text style={styles.title}>Two-Factor Authentication</Text>
      <Text style={styles.subtitle}>
        Please enter the verification codes sent to your email and phone
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Verification Code :</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter email code"
          placeholderTextColor="#999"
          value={emailCode}
          onChangeText={setEmailCode}
          keyboardType="number-pad"
          editable={!loading}
        />
        {!emailSent && (
          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => sendVerificationCodes()}
            disabled={loading}
          >
            <Text style={styles.resendButtonText}>Resend Email Code</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Verification Code :</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone code"
          placeholderTextColor="#999"
          value={phoneCode}
          onChangeText={setPhoneCode}
          keyboardType="number-pad"
          editable={!loading}
        />
        {!smsSent && (
          <TouchableOpacity
            style={styles.resendButton}
            onPress={() => sendVerificationCodes()}
            disabled={loading}
          >
            <Text style={styles.resendButtonText}>Resend SMS Code</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.verifyButton, loading && styles.verifyButtonDisabled]}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.verifyButtonText}>Verify</Text>
        )}
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
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
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
  verifyButton: {
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingVertical: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 16,
  },
  verifyButtonDisabled: {
    backgroundColor: "#007AFF80",
  },
  verifyButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  resendButton: {
    marginTop: 8,
    padding: 8,
  },
  resendButtonText: {
    color: "#007AFF",
    fontSize: 14,
  },
});
