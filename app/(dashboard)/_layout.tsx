import CustomDrawerContent from "@/components/CustomDrawerContent";
import { fontSize, size, spacing } from "@/utils/style";
import { colortheme } from "@/utils/theme";
import { Drawer } from "expo-router/drawer";
import { BellRingingIcon, HouseIcon, UserIcon, UsersIcon } from "phosphor-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        initialRouteName="index"
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerStyle: {
            backgroundColor: colortheme.background.default,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: colortheme.text.primary,
          headerTitleStyle: {
            fontSize: fontSize.lg,
            fontWeight: "600",
          },
          drawerStyle: {
            backgroundColor: colortheme.background.surface,
            width: size.fullWidth * 0.7,
            maxWidth: 450,
          },
          drawerActiveTintColor: colortheme.primary.main,
          drawerInactiveTintColor: colortheme.text.secondary,
          drawerLabelStyle: {
            fontSize: fontSize.md,
            fontWeight: "500",
          },
          drawerItemStyle: {
            marginHorizontal: spacing.xs,
            marginVertical: spacing.xs,
            borderRadius: spacing.sm,
          },
          drawerActiveBackgroundColor: colortheme.primary.main + "40",
        }}
      >
        <Drawer.Screen
          name="index"
          options={{
            title: "Home",
            headerTitle: "Settle Up",
            drawerIcon: ({ color, size,focused }) => (
              <HouseIcon color={color} size={size} weight={focused ? "fill" : "regular"}/>
            ),
          }}
        />
        <Drawer.Screen
          name="group"
          options={{
            title: "Groups",
            headerTitle: "My Groups",
            drawerIcon: ({ color, size ,focused}) => (
              <UsersIcon color={color} size={size} weight={focused ? "fill" : "regular"} />
            ),
          }}
        />
        <Drawer.Screen
          name="notifications"
          options={{
            title: "Notifications",
            headerTitle: "Notifications",
            drawerIcon: ({ color, size, focused }) => (
              <BellRingingIcon
                color={color} 
                size={size} 
                weight={focused ? "fill" : "regular"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            title: "Profile",
            headerTitle: "My Profile",
            drawerIcon:({ color, size, focused }) => (
              <UserIcon color={color} size={size} weight={focused ? "fill" : "regular"} />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
