import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react-native";
import { signUpUser } from "../../../services/authService";
import { GoogleIcon, FacebookIcon } from "../../components/SocialIcons";

export default function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Email Validation Logic
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailTouched = email.length > 0;
  const isEmailValid = emailRegex.test(email);

  // Form Validity check (All fields filled + Valid Email)
  const isFormValid =
    fullName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.trim().length > 0 &&
    isEmailValid;

  const handleSignUp = async () => {
    if (!isFormValid || loading) return;

    Keyboard.dismiss();
    setLoading(true);
    setErrorMessage(null);

    try {
      // signUpUser automatically saves 'user_token' in AsyncStorage
      const response = await signUpUser({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (!response || !response.user) {
        throw new Error("Sign up completed, but user details are missing.");
      }

      const { user } = response;

      // Save local UI metadata
      await AsyncStorage.setItem("user", JSON.stringify(user));
      await AsyncStorage.setItem("userRole", user.role);

      // Route based on role
      if (user.role === "admin") {
        router.replace("/admin/(tabs)");
        return;
      }

      if (user.role === "customer") {
        router.replace("/(tabs)/discover");
        return;
      }

      router.replace("/(tabs)/discover");
    } catch (error: any) {
      const message =
        error?.message || "Unable to connect to server. Please try again.";
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // Helper for dynamic email input border styling
  const getEmailBorderStyle = () => {
    if (!isEmailTouched) return styles.defaultBorder;
    return isEmailValid ? styles.validBorder : styles.invalidBorder;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Section */}
          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subtitle}>Let’s create your account.</Text>

          {/* Dynamic Error Banner */}
          {errorMessage && (
            <View style={styles.errorBanner}>
              <AlertCircle size={18} color="#DC2626" />
              <Text style={styles.errorBannerText}>{errorMessage}</Text>
            </View>
          )}

          {/* Input Fields Form */}
          <View style={styles.formContainer}>
            {/* Full Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.inputWrapper, styles.defaultBorder]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#9CA3AF"
                  value={fullName}
                  onChangeText={(text) => {
                    setFullName(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                />
              </View>
            </View>

            {/* Email Input with Dynamic Validation */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.inputWrapper, getEmailBorderStyle()]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                />
                {isEmailTouched && (
                  <View style={styles.iconRight}>
                    {isEmailValid ? (
                      <CheckCircle2 size={20} color="#16A34A" />
                    ) : (
                      <AlertCircle size={20} color="#DC2626" />
                    )}
                  </View>
                )}
              </View>
            </View>

            {/* Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.inputWrapper, styles.defaultBorder]}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={(text) => {
                    setPassword(text);
                    if (errorMessage) setErrorMessage(null);
                  }}
                />
                <TouchableOpacity
                  style={styles.iconRight}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye size={20} color="#9CA3AF" />
                  ) : (
                    <EyeOff size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Terms & Conditions Text */}
          <Text style={styles.termsText}>
            By signing up you agree to our{" "}
            <Text style={styles.linkText}>Terms</Text>,{" "}
            <Text style={styles.linkText}>Privacy Policy</Text>, and{" "}
            <Text style={styles.linkText}>Cookie Use</Text>
          </Text>

          {/* Create Account Action Button */}
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!isFormValid || loading) && styles.disabledButton,
            ]}
            disabled={!isFormValid || loading}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text
                style={[
                  styles.primaryButtonText,
                  !isFormValid && styles.disabledButtonText,
                ]}
              >
                Create an Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Logins */}
          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButtonGoogle}
              activeOpacity={0.8}
            >
              <GoogleIcon size={20} />
              <Text style={styles.socialGoogleText}>Sign Up with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButtonFacebook}
              activeOpacity={0.8}
            >
              <FacebookIcon size={20} />
              <Text style={styles.socialFacebookText}>
                Sign Up with Facebook
              </Text>
            </TouchableOpacity>
          </View>

          {/* Footer Navigation */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.footerLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -0.8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 20,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    fontSize: 13,
    color: "#991B1B",
    fontWeight: "500",
    flex: 1,
  },
  formContainer: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  inputWrapper: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },
  defaultBorder: {
    borderColor: "#E5E7EB",
  },
  validBorder: {
    borderColor: "#16A34A",
  },
  invalidBorder: {
    borderColor: "#DC2626",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#111827",
  },
  iconRight: {
    marginLeft: 8,
  },
  termsText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginTop: 16,
    marginBottom: 20,
  },
  linkText: {
    fontWeight: "700",
    textDecorationLine: "underline",
    color: "#111827",
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#E5E7EB",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabledButtonText: {
    color: "#9CA3AF",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: "#9CA3AF",
  },
  socialContainer: {
    gap: 12,
  },
  socialButtonGoogle: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
  },
  socialGoogleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  socialButtonFacebook: {
    height: 52,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1877F2",
  },
  socialFacebookText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    textDecorationLine: "underline",
  },
});