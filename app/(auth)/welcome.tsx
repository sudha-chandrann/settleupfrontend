import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fontSize, spacing, size } from "@/utils/style";
import { colortheme } from "@/utils/theme";
import { useRouter } from "expo-router";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  
  const handleGetStarted = () => {
    router.push("/signup");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={colortheme.background.default}
        barStyle="light-content"
        translucent={false}
      />

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Animated.Image
              entering={FadeIn.duration(2000)}
              source={require("../../assets/images/settleup.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.appName}>Settle Up</Text>
            <Text style={styles.tagline}>Simplify Shared Expenses</Text>
            <Text style={styles.description}>
              Split bills, track expenses, and settle up with friends
              effortlessly
            </Text>
          </View>
        </View>

        <View>
          <Animated.View
            style={styles.buttonContainer}
            entering={FadeInDown.duration(2000)
              .delay(200)
              .springify()
              .damping(12)}
          >
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text style={styles.ButtonText}>Get Started</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View
            style={styles.buttonContainer}
            entering={FadeInDown.duration(2000)
              .delay(300)
              .springify()
              .damping(12)}
          >
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.ButtonText}>Login</Text>
            </TouchableOpacity>
          </Animated.View>

          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colortheme.background.default,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  headerSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.xl,
  },
  logoContainer: {
    marginBottom: spacing.xl,
  },
  logo: {
    width: size.fullWidth * 0.5,
    height: size.fullWidth * 0.5,
    maxWidth: 200,
    maxHeight: 200,
  },

  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  appName: {
    fontSize: fontSize["2xl"],
    fontWeight: "bold",
    color: colortheme.text.primary,
  },

  tagline: {
    fontSize: fontSize.lg,
    color: colortheme.primary.main,
    fontWeight: "600",
  },
  description: {
    fontSize: fontSize.sm,
    color: colortheme.text.secondary,
    textAlign: "center",
    lineHeight: fontSize.md * 1.2,
  },

  buttonContainer: {
    width: "100%",
  },
  primaryButton: {
    backgroundColor: colortheme.primary.main,
    borderRadius: 14,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
    shadowColor: colortheme.primary.main,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  ButtonText: {
    color: colortheme.primary.contrastText,
    fontSize: fontSize.md,
    fontWeight: "600",
    textAlign: "center",
  },

  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colortheme.border,
    borderRadius: 14,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  footerText: {
    fontSize: fontSize.sm,
    color: colortheme.text.muted,
    textAlign: "center",
    lineHeight: fontSize.sm * 1.3,
    paddingHorizontal: spacing.md,
  },
});

export default WelcomeScreen;
