import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { UsersIcon } from "phosphor-react-native";
import { colortheme } from "@/utils/theme";
import {
  fontSize,
  responsiveFontSize,
  responsiveSpacing,
  spacing,
} from "@/utils/style";

const EmptyState = () => {
  return (
    <View style={styles.emptyState}>
      <View style={styles.iconcontainer}>
        <UsersIcon
          weight="fill"
          color={colortheme.primary.main}
          size={responsiveFontSize(90)}
        />
      </View>
      <Text style={styles.emptyStateTitle}>No Groups Yet</Text>
      <Text style={styles.emptyStateMessage}>
        Create your first group to start tracking shared expenses with friends!
      </Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  iconcontainer: {
    backgroundColor: colortheme.background.muted,
    padding: responsiveSpacing(20),
    borderRadius: responsiveFontSize(70),
    marginBottom:fontSize.sm
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyStateTitle: {
    fontSize: fontSize.xl,
    fontWeight: "bold",
    color: colortheme.text.primary,
    marginBottom: spacing.md,
    textAlign: "center",
  },
  emptyStateMessage: {
    fontSize: fontSize.md,
    color: colortheme.text.secondary,
    textAlign: "center",
    lineHeight: fontSize.md * 1.5,
    marginBottom: spacing.xl,
  },
});
