import React, { useState, useEffect, useRef } from "react";
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
import { 
  EnvelopeIcon, 
  PaperPlaneTiltIcon,
  CheckCircleIcon, 
  ClockIcon, 
  ShieldCheckIcon,
  ArrowLeftIcon,
  ArrowArcRightIcon
} from "phosphor-react-native";
import { useRouter } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { ErrorState, ErrorType } from "@/utils/type";
import { authService } from "@/services/service";
import ToastMessage from "@/components/ToastMessage";

type StepType = "email" | "verification";

interface EmailFormData {
  email: string;
}

interface VerificationFormData {
  code: string[];
}

interface FormErrors {
  email?: string;
  code?: string;
  general?: string;
}

const EmailVerificationScreen: React.FC = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepType>("email");
  const [emailFormData, setEmailFormData] = useState<EmailFormData>({
    email: "",
  });
  const [verificationFormData, setVerificationFormData] = useState<VerificationFormData>({
    code: ["", "", "", "", "", ""],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(3*60);
  const [canResend, setCanResend] = useState(false);
  const [toastState, setToastState] = useState<ErrorState>({
    visible: false,
    message: "",
    type: "error",
  });

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const showToastMessage = (
    message: string,
    type: ErrorType = "error",
    title?: string
  ) => {
    setToastState({
      visible: true,
      message,
      type,
      title,
    });
  };

  const hideToastMessage = () => {
    setToastState((prev) => ({
      ...prev,
      visible: false,
    }));
  };

  useEffect(() => {
    if (currentStep === "verification" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [countdown, currentStep]);

  const validateEmailForm = (): boolean => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailFormData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(emailFormData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateVerificationForm = (): boolean => {
    const newErrors: FormErrors = {};
    const code = verificationFormData.code.join("");

    if (code.length !== 6) {
      newErrors.code = "Please enter the complete 6-digit verification code";
    } else if (!/^\d{6}$/.test(code)) {
      newErrors.code = "Verification code must contain only numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEmailInputChange = (value: string) => {
    setEmailFormData({ email: value.toLowerCase() });
    if (errors.email || errors.general) {
      setErrors({});
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...verificationFormData.code];
    newCode[index] = value;
    setVerificationFormData({ code: newCode });
    if (errors.code || errors.general) {
      setErrors({});
    }
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newCode.every(digit => digit !== "") && newCode.join("").length === 6) {
      setTimeout(() => handleVerifyCode(), 100);
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === "Backspace" && !verificationFormData.code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!validateEmailForm()) return;

    setIsLoading(true);

    try {
      const response = await authService.requestEmailVerificationCode({
        email: emailFormData.email,
      });

      if (response.success) {
        showToastMessage(
          "Verification email sent successfully!",
          "success",
          "Email Sent"
        );
        
        setCurrentStep("verification");
        setCountdown(3*60);
        setCanResend(false);

        setTimeout(() => {
          inputRefs.current[0]?.focus();
        }, 500);

      } else {
        showToastMessage(
          response.message || "Failed to send verification email. Please try again.",
          "error",
          "Email Error"
        );
      }
    } catch (error: any) {
      showToastMessage(
        error.message || "Network error. Please check your connection and try again.",
        "error",
        "Connection Error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validateVerificationForm()) return;

    setIsLoading(true);
    const verificationCode = verificationFormData.code.join("");

    try {
      const response = await authService.confirmEmailVerification({
        email: emailFormData.email,
        code: verificationCode,
      });

      if (response.success) {
        showToastMessage(
          "Email verified successfully! Welcome to Settle Up.",
          "success",
          "Verification Complete"
        );
        
        setTimeout(() => {
          router.replace("/(auth)/login"); 
        }, 2000);
      } else {
        showToastMessage(
          response.message || "Invalid verification code. Please try again.",
          "error",
          "Verification Failed"
        );
        setVerificationFormData({ code: ["", "", "", "", "", ""] });
        inputRefs.current[0]?.focus();
      }
    } catch (error: any) {
      showToastMessage(
        error.message || "Network error. Please check your connection and try again.",
        "error",
        "Connection Error"
      );
      
      setVerificationFormData({ code: ["", "", "", "", "", ""] });
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsResending(true);
    setCanResend(false);
    setCountdown(3*60);

    try {
      const response = await authService.requestEmailVerificationCode({
        email: emailFormData.email,
      });

      if (response.success) {
        showToastMessage(
          "New verification code sent to your email!",
          "success",
          "Code Resent"
        );
        
        setVerificationFormData({ code: ["", "", "", "", "", ""] });
        inputRefs.current[0]?.focus();
      } else {
        showToastMessage(
          response.message || "Failed to resend verification code. Please try again.",
          "error",
          "Resend Failed"
        );
        setCanResend(true);
        setCountdown(0);
      }
    } catch (error: any) {
      showToastMessage(
        error.message || "Network error. Please try again.",
        "error",
        "Connection Error"
      );
      setCanResend(true);
      setCountdown(0);
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToEmailStep = () => {
    setCurrentStep("email");
    setErrors({});
    setVerificationFormData({ code: ["", "", "", "", "", ""] });
    setCountdown(3*60);
    setCanResend(false);
  };

  const renderStepIndicator = () => (

    <View style={styles.stepIndicator}>
      <View style={styles.stepContainer}>
        <View style={[
          styles.stepCircle,
          currentStep === "email" ? styles.stepCircleActive : styles.stepCircleCompleted
        ]}>
          <Text style={[
            styles.stepNumber,
            currentStep === "email" ? styles.stepNumberActive : styles.stepNumberCompleted
          ]}>
            1
          </Text>
        </View>
        <Text style={[
          styles.stepLabel,
          currentStep === "email" ? styles.stepLabelActive : styles.stepLabelCompleted
        ]}>
          Enter Email
        </Text>
      </View>
      
      <View style={[
        styles.stepConnector,
        currentStep === "verification" ? styles.stepConnectorActive : styles.stepConnectorInactive
      ]} />
      
      <View style={styles.stepContainer}>
        <View style={[
          styles.stepCircle,
          currentStep === "verification" ? styles.stepCircleActive : styles.stepCircleInactive
        ]}>
          <Text style={[
            styles.stepNumber,
            currentStep === "verification" ? styles.stepNumberActive : styles.stepNumberInactive
          ]}>
            2
          </Text>
        </View>
        <Text style={[
          styles.stepLabel,
          currentStep === "verification" ? styles.stepLabelActive : styles.stepLabelInactive
        ]}>
          Verify Code
        </Text>
      </View>
    </View>
  );

  const renderEmailStep = () => (
    <Animated.View
      entering={FadeInDown.duration(600)}
      style={styles.stepContent}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <EnvelopeIcon color="white" size={responsiveSpacing(50)} />
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          Enter your email address and we&apos;ll send you a verification code
        </Text>
      </View>

      {errors.general && (
        <View style={styles.generalErrorContainer}>
          <Text style={styles.generalErrorText}>{errors.general}</Text>
        </View>
      )}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          value={emailFormData.email}
          onChangeText={handleEmailInputChange}
          placeholder="Enter your email address"
          placeholderTextColor={colortheme.text.muted}
          keyboardType="email-address"
          autoCapitalize="none"
          returnKeyType="done"
          autoComplete="email"
          onSubmitEditing={handleSendVerificationEmail}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          isLoading && styles.submitButtonDisabled,
        ]}
        onPress={handleSendVerificationEmail}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <PaperPlaneTiltIcon 
          color={colortheme.primary.contrastText} 
          size={20} 
          style={styles.buttonIcon}
        />
        <Text style={styles.submitButtonText}>
          {isLoading ? "Sending..." : "Send Verification Code"}
        </Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          We&apos;ll send a 6-digit verification code to your email address.
          Please check your inbox and spam folder.
        </Text>
      </View>
    </Animated.View>
  );

  const renderVerificationStep = () => (
    <Animated.View
      entering={FadeInDown.duration(600)}
      style={styles.stepContent}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoCircle}>
          <ShieldCheckIcon color="white" size={responsiveSpacing(50)} />
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Enter Verification Code</Text>
        <Text style={styles.subtitle}>
          We&apos;ve sent a 6-digit code to
        </Text>
        <Text style={styles.emailText}>{emailFormData.email}</Text>
      </View>

      {errors.general && (
        <View style={styles.generalErrorContainer}>
          <Text style={styles.generalErrorText}>{errors.general}</Text>
        </View>
      )}

      <View style={styles.codeInputContainer}>
        {verificationFormData.code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            style={[
              styles.codeInput,
              errors.code && styles.codeInputError,
              digit && styles.codeInputFilled,
            ]}
            value={digit}
            onChangeText={(value) => handleCodeChange(index, value)}
            onKeyPress={({ nativeEvent: { key } }) => handleKeyPress(index, key)}
            maxLength={1}
            keyboardType="numeric"
            textAlign="center"
            autoFocus={index === 0}
            selectTextOnFocus
          />
        ))}
      </View>

      {errors.code && (
        <Text style={styles.errorText}>{errors.code}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.submitButton,
          isLoading && styles.submitButtonDisabled,
        ]}
        onPress={handleVerifyCode}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <CheckCircleIcon 
          color={colortheme.primary.contrastText} 
          size={20} 
          style={styles.buttonIcon}
        />
        <Text style={styles.submitButtonText}>
          {isLoading ? "Verifying..." : "Verify Email"}
        </Text>
      </TouchableOpacity>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>
          Didn&apos;t receive the code?
        </Text>
        
        {canResend ? (
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={isResending}
            style={styles.resendButton}
          >
            <ArrowArcRightIcon 
              color={colortheme.primary.main} 
              size={16} 
              style={[styles.resendIcon, isResending && styles.resendIconSpinning]}
            />
            <Text style={styles.resendButtonText}>
              {isResending ? "Sending..." : "Resend Code"}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.countdownContainer}>
            <ClockIcon color={colortheme.text.muted} size={16} />
            <Text style={styles.countdownText}>
              Resend in {countdown}s
            </Text>
          </View>
        )}
      </View>

      <View style={styles.backLinkContainer}>
        <TouchableOpacity onPress={handleBackToEmailStep}>
          <View style={styles.backLinkWithIcon}>
            <ArrowLeftIcon color={colortheme.primary.main} size={16} />
            <Text style={styles.backLink}>Change Email Address</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );

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
          onClose={hideToastMessage}
          autoHide={toastState.type === "success"}
          autoHideDuration={2000}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {renderStepIndicator()}
            
            {currentStep === "email" ? renderEmailStep() : renderVerificationStep()}

            <View style={styles.backToContainer}>
              <TouchableOpacity onPress={()=>router.push('/(auth)/signup')}>
                <Text style={styles.backToLoginLink}>Back to Signup</Text>
              </TouchableOpacity>
               <TouchableOpacity onPress={()=>router.push('/(auth)/signup')}>
                <Text style={styles.backToLoginLink}>Back to Login</Text>
              </TouchableOpacity>
            </View>
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
  
  // Step Indicator Styles
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: responsiveSpacing(40),
  },
  stepContainer: {
    alignItems: "center",
  },
  stepCircle: {
    width: responsiveSpacing(40),
    height: responsiveSpacing(40),
    borderRadius: responsiveSpacing(20),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  stepCircleActive: {
    backgroundColor: colortheme.primary.main,
  },
  stepCircleCompleted: {
    backgroundColor: colortheme.status.success.main,
  },
  stepCircleInactive: {
    backgroundColor: colortheme.background.surface,
    borderWidth: 2,
    borderColor: colortheme.border,
  },
  stepNumber: {
    fontSize: fontSize.md,
    fontWeight: "bold",
  },
  stepNumberActive: {
    color: colortheme.primary.contrastText,
  },
  stepNumberCompleted: {
    color: "white",
  },
  stepNumberInactive: {
    color: colortheme.text.muted,
  },
  stepLabel: {
    fontSize: fontSize.sm,
    fontWeight: "500",
  },
  stepLabelActive: {
    color: colortheme.primary.main,
  },
  stepLabelCompleted: {
    color: colortheme.status.success.main,
  },
  stepLabelInactive: {
    color: colortheme.text.muted,
  },
  stepConnector: {
    width: responsiveSpacing(60),
    height: 2,
    marginHorizontal: spacing.md,
  },
  stepConnectorActive: {
    backgroundColor: colortheme.primary.main,
  },
  stepConnectorInactive: {
    backgroundColor: colortheme.border,
  },
  
  // Common Styles
  stepContent: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: responsiveSpacing(30),
  },
  logoCircle: {
    width: responsiveSpacing(80),
    height: responsiveSpacing(80),
    borderRadius: responsiveSpacing(40),
    backgroundColor: colortheme.primary.main,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colortheme.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    marginBottom: responsiveSpacing(30),
    alignItems: "center",
  },
  title: {
    fontSize: responsiveFontSize(24),
    fontWeight: "bold",
    color: colortheme.primary.main,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: responsiveFontSize(16),
    color: colortheme.text.muted,
    textAlign: "center",
    lineHeight: fontSize.md * 1.4,
  },
  emailText: {
    fontSize: responsiveFontSize(16),
    color: colortheme.primary.light,
    fontWeight: "600",
    marginTop: spacing.xs,
  },
  generalErrorContainer: {
    backgroundColor: colortheme.status.error.background,
    borderRadius: 12,
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
  
  // Email Step Styles
  inputGroup: {
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: fontSize.md,
    color: colortheme.primary.light,
    marginBottom: spacing.sm,
    fontWeight: "500",
  },
  input: {
    backgroundColor: colortheme.background.surface,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    fontSize: fontSize.md,
    color: colortheme.text.primary,
    borderWidth: 1,
    borderColor: colortheme.border,
  },
  inputError: {
    borderColor: colortheme.status.error.main,
  },
  errorText: {
    fontSize: fontSize.sm,
    color: colortheme.status.error.main,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: colortheme.background.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colortheme.primary.main,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colortheme.text.secondary,
    lineHeight: fontSize.sm * 1.4,
  },
  
  // Verification Step Styles
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  codeInput: {
    width: responsiveSpacing(45),
    height: responsiveSpacing(55),
    backgroundColor: colortheme.background.surface,
    borderRadius: 12,
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colortheme.text.primary,
    borderWidth: 2,
    borderColor: colortheme.border,
  },
  codeInputFilled: {
    borderColor: colortheme.primary.main,
    backgroundColor: colortheme.primary.main + "10",
  },
  codeInputError: {
    borderColor: colortheme.status.error.main,
  },
  resendContainer: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  resendText: {
    fontSize: fontSize.sm,
    color: colortheme.text.muted,
    marginBottom: spacing.sm,
  },
  resendButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  resendIcon: {
    marginRight: spacing.xs,
  },
  resendIconSpinning: {
    transform: [{ rotate: "180deg" }],
  },
  resendButtonText: {
    fontSize: fontSize.sm,
    color: colortheme.primary.main,
    fontWeight: "600",
  },
  countdownContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countdownText: {
    fontSize: fontSize.sm,
    color: colortheme.text.muted,
    marginLeft: spacing.xs,
  },
  
  // Common Button Styles
  submitButton: {
    backgroundColor: colortheme.primary.main,
    borderRadius: 14,
    paddingVertical: spacing.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colortheme.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonDisabled: {
    backgroundColor: colortheme.text.muted,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },
  submitButtonText: {
    color: colortheme.primary.contrastText,
    fontSize: fontSize.md,
    fontWeight: "600",
  },
  
  // Navigation Styles
  backLinkContainer: {
    alignItems: "center",
    marginTop: spacing.lg,
  },
  backLinkWithIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  backLink: {
    fontSize: fontSize.sm,
    color: colortheme.primary.main,
    fontWeight: "600",
    marginLeft: spacing.xs,
  },
  backToContainer: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems: "center",
    marginTop: spacing.xl,
  },
  backToLoginLink: {
    fontSize: fontSize.sm,
    color: colortheme.primary.main,
    fontWeight: "600",
  },
});

export default EmailVerificationScreen;