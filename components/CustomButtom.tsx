import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import React from "react";
import { colortheme } from "@/utils/theme";
import { fontSize, responsiveHeight } from "@/utils/style";

interface CustomButtonProps extends TouchableOpacityProps {
  style?: ViewStyle;
  onPress?: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

const CustomButton = ({
  style,
  onPress,
  loading,
  children,
}: CustomButtonProps) => {
  if (loading) {
    return (
      <View style={[styles.button, { backgroundColor: "transparent" }]}>
        <View style={styles.container}>
          <ActivityIndicator
            size={fontSize.md}
            color={colortheme.primary.main}
          />
        </View>
      </View>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      {children}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: colortheme.primary.main,
    borderRadius: 14,
    borderCurve: "continuous",
    height: responsiveHeight(52),
    justifyContent: "center",
    alignItems: "center",
  },
});
