import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Group } from "@/utils/type";
import { colortheme } from "@/utils/theme";
import {
  fontSize,
  responsiveSpacing,
  responsiveWidth,
  spacing,
} from "@/utils/style";
import { CaretRightIcon } from "phosphor-react-native";
// import { useRouter } from "expo-router";

const GroupItem = ({ item }: { item: Group }) => {
  // const router = useRouter();

  const handleGroupPress = (groupId: string) => {
    // router.push({ pathname: "GroupScreen", params: { groupId } });
  };

  return (
    <TouchableOpacity
      style={styles.groupItem}
      onPress={() => handleGroupPress(item._id)}
      activeOpacity={0.7}
    >
      <View style={styles.groupIcon}>
        {item.icon ? (
          <Image
            source={{ uri: item.icon }}
            style={styles.iconImage}
            defaultSource={require("../../assets/images/favicon.png")}
          />
        ) : (
          <Image
            source={require("../../assets/images/favicon.png")}
            style={styles.iconImage}
          />
        )}
      </View>

      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.groupDescription}>{item.description}</Text>
        ) : null}
        <View style={styles.groupStats}>
          <Text style={styles.statsText}>
            {item.memberCount ?? 0} members • ₹{(item.totalExpenses ?? 0).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={styles.chevron}>
        <CaretRightIcon size={fontSize.xl} color={colortheme.text.primary} />
      </View>
    </TouchableOpacity>
  );
};

export default GroupItem;

const styles = StyleSheet.create({
  groupItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colortheme.background.surface,
    borderRadius: responsiveSpacing(12),
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colortheme.border,
  },
  groupIcon: {
    width: responsiveWidth(50),
    height: responsiveWidth(50),
    borderRadius: responsiveWidth(25),
    backgroundColor: colortheme.background.muted,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  iconImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: responsiveWidth(25),
  },
  groupInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  groupName: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colortheme.text.primary,
    marginBottom: spacing.xs,
  },
  groupDescription: {
    fontSize: fontSize.sm,
    color: colortheme.text.secondary,
    marginBottom: spacing.xs,
  },
  groupStats: {
    marginTop: spacing.xs,
  },
  statsText: {
    fontSize: fontSize.xs,
    color: colortheme.text.muted,
  },
  chevron: {
    width: responsiveWidth(24),
    height: responsiveWidth(24),
    justifyContent: "center",
    alignItems: "center",
  },
});
