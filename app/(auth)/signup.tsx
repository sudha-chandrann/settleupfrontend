import React, { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  fontSize,
  responsiveFontSize,
  responsiveSpacing,
  spacing,
} from "@/utils/style";
import { colortheme } from "@/utils/theme";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { EyeClosedIcon, EyeIcon } from "phosphor-react-native";
import { authService } from "@/services/service";
import { ErrorState, ErrorType } from "@/utils/type";
import ToastMessage from "@/components/ToastMessage";

interface FormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toastState, settoastState] = useState<ErrorState>({
    visible: false,
    message: "",
    type: "error",
  });
  const router = useRouter();

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

  function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await authService.register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      if (response.success) {
        showtoastMessage(response.message, "success", "Success");
        setTimeout(() => {
          handleLoginNavigation();
        }, 1000);
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
      } else {
        showtoastMessage(
          response.message || "Failed to create account. Please try again.",
          "error",
          "SignUp Error"
        );
        if (response.errors) {
          const newErrors: FormErrors = {};

          response.errors.map((error) => {
            if (error.path[0] === "email") newErrors.email = error?.message;
            else if (error.path[0] === "password")
              newErrors.password = error?.message;
            else if (error.path[0] === "name")
              newErrors.fullName = error?.message;
          });
          setErrors(newErrors);
        }
        console.log(" the login falied :", response.errors);
      }
    } catch (error: any) {
      showtoastMessage(
        error?.message || "Failed to create account. Please try again.",
        "error",
        "SignUp Error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginNavigation = () => {
    router.push("/(auth)/login");
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
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Animated.View
              entering={FadeInDown.duration(800).delay(200)}
              style={styles.header}
            >
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Join Settle Up and start managing shared expenses
              </Text>
            </Animated.View>

            <Animated.View
              entering={FadeInDown.duration(800).delay(400)}
              style={styles.form}
            >
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={[styles.input, errors.fullName && styles.inputError]}
                  value={formData.fullName}
                  onChangeText={(text) => handleInputChange("fullName", text)}
                  placeholder="Enter your full name"
                  placeholderTextColor={colortheme.text.muted}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                {errors.fullName && (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                )}
              </View>

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
                    placeholder="Create a password"
                    placeholderTextColor={colortheme.text.muted}
                    secureTextEntry={!showPassword}
                    returnKeyType="next"
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

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={[
                      styles.input,
                      styles.passwordInput,
                      errors.confirmPassword && styles.inputError,
                    ]}
                    value={formData.confirmPassword}
                    onChangeText={(text) =>
                      handleInputChange("confirmPassword", text)
                    }
                    placeholder="Confirm your password"
                    placeholderTextColor={colortheme.text.muted}
                    secureTextEntry={!showConfirmPassword}
                    returnKeyType="done"
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeIcon color={colortheme.text.primary} />
                    ) : (
                      <EyeClosedIcon color={colortheme.text.primary} />
                    )}
                  </TouchableOpacity>
                </View>
                {errors.confirmPassword && (
                  <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                )}
              </View>
              <View style={styles.optionsContainer}>
                <TouchableOpacity onPress={()=>{router.push('/(auth)/verfication')}}>
                  <Text style={styles.emailverfication}>
                    Email Verification
                  </Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoading && styles.submitButtonDisabled,
                ]}
                onPress={handleSignup}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Text>
              </TouchableOpacity>

              <View style={styles.loginLinkContainer}>
                <Text style={styles.loginLinkText}>
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity onPress={handleLoginNavigation}>
                  <Text style={styles.loginLink}>Login</Text>
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

  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.md,
  },
  loginLinkText: {
    fontSize: responsiveFontSize(14),
    color: colortheme.text.secondary,
  },
  loginLink: {
    fontSize: responsiveFontSize(14),
    color: colortheme.primary.main,
    fontWeight: "600",
  },
   optionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  emailverfication: {
    fontSize: fontSize.sm,
    color: colortheme.primary.main,
    fontWeight: "600",
  },
});

export default SignupScreen;
