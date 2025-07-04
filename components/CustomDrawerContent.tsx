import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from "@react-navigation/drawer";
import { useAuth } from "@/hooks/auth";
import { colortheme } from "@/utils/theme";
import {
  fontSize,
  responsiveFontSize,
  responsiveSpacing,
  responsiveWidth,
  spacing,
} from "@/utils/style";
import { generateColorFromName, getInitials } from "@/utils/constant";
import { SignOutIcon } from "phosphor-react-native";

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: logout,
      },
    ]);
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
        
        <View style={styles.userSection}>

          <View style={styles.avatarContainer}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: generateColorFromName(user?.name || "") },
              ]}
            >
              {user?.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarText}>
                  {getInitials(user?.name || "")}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName} numberOfLines={1}>
              {user?.name || "User"}
            </Text>
            <Text style={styles.userEmail} numberOfLines={1}>
              {user?.email || "user@email.com"}
            </Text>
          </View>

        </View>


      <View style={styles.content}>
        <View style={styles.navigationSection}>
          <DrawerItemList {...props} />
        </View>
      </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <View style={styles.logoutContent}>
            <SignOutIcon size={responsiveFontSize(20)} color={colortheme.text.primary} weight="bold"/>
            <Text style={styles.logoutText}>Logout</Text>
          </View>
        </TouchableOpacity>

    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colortheme.background.default,
  },

  userSection: {
    marginTop:spacing.md,
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },

  avatarContainer: {
    position: "relative",
    marginBottom: spacing.md,
  },

  avatar: {
    width: responsiveWidth(60),
    height: responsiveWidth(60),
    borderRadius: responsiveWidth(40),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colortheme.text.primary,
  },

  avatarImage: {
    width: responsiveWidth(80),
    height: responsiveWidth(80),
    borderRadius: responsiveWidth(37),
  },

  avatarText: {
    fontSize: responsiveFontSize(25),
    fontWeight: "700",
    color: colortheme.text.primary,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  userInfo: {
    alignItems: "center",
    width: "100%",
  },

  userName: {
    fontSize: fontSize.xl,
    fontWeight: "700",
    color: colortheme.text.primary,
    marginBottom: spacing.xs,
    textAlign: "center",
  },

  userEmail: {
    fontSize: fontSize.sm,
    color: colortheme.text.secondary,
    marginBottom: spacing.md,
    textAlign: "center",
  },

  content: {
    flex: 1,
    paddingTop: spacing.lg,
  },

  navigationSection: {
    flex: 1,
    paddingHorizontal: spacing.sm,
  },

  logoutButton: {
    backgroundColor: colortheme.status.error.main,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.sm,
    alignItems: "center",
    marginBottom: spacing.sm,
    marginHorizontal:spacing.md
  },

  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap:responsiveSpacing(5)
  },
  logoutText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colortheme.text.primary,
  },
});

export default CustomDrawerContent;
