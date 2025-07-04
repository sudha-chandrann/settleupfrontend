import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import {
  responsiveWidth,
  responsiveSpacing,
  fontSize,
  spacing,
  responsiveFontSize,
} from "../../utils/style";
import { colortheme } from "../../utils/theme";
import EmptyState from "@/components/Groups/EmptyState";
import { Group } from "@/utils/type";
import GroupItem from "@/components/Groups/GroupItem";
import { PlusIcon } from "phosphor-react-native";
import CreateGroupModal from "@/components/modals/CreateGroupModal";

interface AllGroupsScreenProps {
  navigation?: any;
}

const AllGroupsScreen: React.FC<AllGroupsScreenProps> = ({ navigation }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dummyGroups: Group[] = [
    {
      _id: "1",
      name: "Trip to Goa",
      icon: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=100&fit=crop&crop=center",
      description: "Beach vacation with friends",
      memberCount: 5,
      totalExpenses: 15000,
    },
    {
      _id: "2",
      name: "Roommates",
      icon: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=center",
      description: "Monthly house expenses",
      memberCount: 3,
      totalExpenses: 8500,
    },
    {
      _id: "3",
      name: "Office Lunch",
      icon: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop&crop=center",
      description: "Daily lunch orders",
      memberCount: 8,
      totalExpenses: 3200,
    },
    {
      _id: "4",
      name: "Weekend Trip",
      icon: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop&crop=center",
      memberCount: 4,
      totalExpenses: 12000,
    },
  ];

  const fetchGroups = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setGroups(dummyGroups);
    } catch (error: any) {
      console.log(" the error is", error);
      Alert.alert("Error", "Failed to fetch groups");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchGroups();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartNewGroup = () => {
    setModalVisible(true);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Groups</Text>
      <Text style={styles.headerSubtitle}>
        {groups.length} {groups.length === 1 ? "group" : "groups"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colortheme.primary.main} />
          <Text style={styles.loadingText}>Loading groups...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <CreateGroupModal
          onClose={() => {
            setModalVisible(false);
          }}
        />
      </Modal>
      <FlatList
        data={groups}
        renderItem={GroupItem}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={EmptyState}
        contentContainerStyle={[
          styles.listContainer,
          groups.length === 0 && styles.emptyListContainer,
        ]}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleStartNewGroup}
        activeOpacity={0.8}
      >
        <PlusIcon
          color={colortheme.primary.contrastText}
          size={fontSize.xl}
          weight="bold"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colortheme.background.default,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: colortheme.text.secondary,
    fontSize: fontSize.md,
    marginTop: spacing.md,
  },
  listContainer: {
    paddingHorizontal: spacing.lg,
  },
  emptyListContainer: {
    flex: 1,
  },
  iconcontainer: {
    backgroundColor: colortheme.background.muted,
    padding: responsiveSpacing(20),
    borderRadius: responsiveFontSize(70),
  },
  header: {
    paddingVertical: spacing.xl,
    paddingBottom: spacing.lg,
  },

  headerTitle: {
    fontSize: fontSize["2xl"],
    fontWeight: "bold",
    color: colortheme.text.primary,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colortheme.text.secondary,
  },

  fab: {
    position: "absolute",
    bottom: responsiveSpacing(24),
    right: responsiveSpacing(24),
    width: responsiveWidth(46),
    height: responsiveWidth(46),
    maxWidth: 70,
    maxHeight: 70,
    borderRadius: responsiveWidth(28),
    backgroundColor: colortheme.primary.main,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AllGroupsScreen;
