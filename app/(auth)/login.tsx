import React, {  useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fontSize,
  responsiveFontSize,
  responsiveSpacing,
  spacing,
} from "@/utils/style";
import { colortheme } from "@/utils/theme";
import { EyeClosedIcon, EyeIcon, UserCircleIcon } from "phosphor-react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { ErrorState, ErrorType } from "@/utils/type";
import { authService } from "@/services/service";
import ToastMessage from "@/components/ToastMessage";
import { useAuth } from "@/hooks/auth";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toastState, settoastState] = useState<ErrorState>({
    visible: false,
    message: "",
    type: "error",
  });
  const {  setUser, setIsAuthenticated } = useAuth();

  const showtoastMessage = (
    message: string,
    type: ErrorType = "error",
    title?: string
  ) => {
    settoastState({
      visible: true,
      message,
      type,
      title,
    });
  };

  const hidetoastMessage = () => {
    settoastState((prev) => ({
      ...prev,
      visible: false,
    }));
  };
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: undefined }));
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      if (response.success) {
        showtoastMessage(response.message, "success", "Success");
        if (response.data) {
          setUser(response.data.user);
          setIsAuthenticated(true);
        }

        setTimeout(() => {
          router.replace('/(dashboard)')
        }, 1000);
        setFormData({
          email: "",
          password: "",
        });
      } else {
        showtoastMessage(
          response.message ||
            "Login failed. Please check your connection and try again.",
          "error",
          "Login Error"
        );
        if (response.errors) {
          const newErrors: FormErrors = {};

          response.errors.map((error) => {
            if (error.path[0] === "email") newErrors.email = error?.message;
            else if (error.path[0] === "password")
              newErrors.password = error?.message;
            else newErrors.general = error.message;
          });
          setErrors(newErrors);
        }
      }
    } catch (error: any) {
      showtoastMessage(
        error.message ||
          "Login failed. Please check your connection and try again.",
        "error",
        "Login Error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupNavigation = () => {
    router.push("/signup");
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Reset Password",
      "Password reset functionality will be available soon.",
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colortheme.background.default}
        barStyle="light-content"
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ToastMessage
          visible={toastState.visible}
          message={toastState.message}
          type={toastState.type}
          title={toastState.title}
          onClose={hidetoastMessage}
          autoHide={toastState.type === "success"}
          autoHideDuration={2000}
        />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Animated.View
              entering={FadeInUp.duration(800).delay(100)}
              style={styles.logoContainer}
            >
              <View style={styles.logoCircle}>
                <UserCircleIcon color="white" size={"100%"} />
              </View>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.duration(800).delay(200)}
              style={styles.header}
            >
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>
                Sign in to your Settle Up account
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(800).delay(400)}
              style={styles.form}
            >
              {errors.general && (
                <View style={styles.generalErrorContainer}>
                  <Text style={styles.generalErrorText}>{errors.general}</Text>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={[styles.input, errors.email && styles.inputError]}
                  value={formData.email}
                  onChangeText={(text) =>
                    handleInputChange("email", text.toLowerCase())
                  }
                  placeholder="Enter your email"
                  placeholderTextColor={colortheme.text.muted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="next"
                  autoComplete="email"
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      errors.password && styles.inputError,
                    ]}
                    value={formData.password}
                    onChangeText={(text) => handleInputChange("password", text)}
                    placeholder="Enter your password"
                    placeholderTextColor={colortheme.text.muted}
                    secureTextEntry={!showPassword}
                    returnKeyType="done"
                    autoComplete="password"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeIcon color={colortheme.text.primary} />
                    ) : (
                      <EyeClosedIcon color={colortheme.text.primary} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}
              </View>

              <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>
                    Forgot Password?
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    router.push("/(auth)/verfication");
                  }}
                >
                  <Text style={styles.forgotPasswordText}>
                    Email Verification
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoading && styles.submitButtonDisabled,
                ]}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? "Signing In..." : "Login"}
                </Text>
              </TouchableOpacity>

              <View style={styles.signupLinkContainer}>
                <Text style={styles.signupLinkText}>
                  Don&apos;t have an account?{" "}
                </Text>
                <TouchableOpacity onPress={handleSignupNavigation}>
                  <Text style={styles.signupLink}>Sign up</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colortheme.background.default,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: responsiveSpacing(40),
    paddingBottom: spacing.lg,
  },

  logoContainer: {
    alignItems: "center",
  },
  logoCircle: {
    width: responsiveSpacing(80),
    height: responsiveSpacing(80),
    borderRadius: responsiveSpacing(40),
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    marginBottom: responsiveSpacing(36),
    alignItems: "center",
  },
  title: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: colortheme.primary.main,
  },
  subtitle: {
    fontSize: responsiveFontSize(16),
    color: colortheme.text.muted,
    textAlign: "center",
    lineHeight: fontSize.md * 1.2,
  },

  form: {
    flex: 1,
  },

  generalErrorContainer: {
    backgroundColor: colortheme.status.error.background,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colortheme.status.error.main,
  },
  generalErrorText: {
    color: colortheme.status.error.text,
    fontSize: fontSize.sm,
    textAlign: "center",
  },

  inputGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.sm,
    color: colortheme.primary.light,
    marginBottom: spacing.xs,
    fontWeight: "500",
  },
  input: {
    backgroundColor: colortheme.background.surface,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colortheme.text.primary,
    borderWidth: 1,
    borderColor: colortheme.border,
  },
  inputError: {
    borderColor: colortheme.status.error.main,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: spacing.xl * 2,
  },
  eyeButton: {
    position: "absolute",
    right: spacing.md,
    top: spacing.md,
    padding: spacing.xs,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colortheme.status.error.main,
    marginTop: spacing.xs,
  },

  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xl,
  },

  forgotPasswordText: {
    fontSize: fontSize.sm,
    color: colortheme.primary.main,
    fontWeight: "600",
  },

  submitButton: {
    backgroundColor: colortheme.primary.main,
    borderRadius: 14,
    paddingVertical: spacing.md,
    marginTop: spacing.xl,
  },
  submitButtonDisabled: {
    backgroundColor: colortheme.text.muted,
  },
  submitButtonText: {
    color: colortheme.primary.contrastText,
    fontSize: fontSize.md,
    fontWeight: "600",
    textAlign: "center",
  },

  signupLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
  },
  signupLinkText: {
    fontSize: responsiveFontSize(14),
    color: colortheme.text.secondary,
  },
  signupLink: {
    fontSize: responsiveFontSize(14),
    color: colortheme.primary.main,
    fontWeight: "600",
  },
});

export default LoginScreen;
