import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ErrorState, ErrorType } from "@/utils/type";
import ToastMessage from "../ToastMessage";
import { colortheme } from "@/utils/theme";
import {
  fontSize,
  responsiveFontSize,
  responsiveHeight,
  responsiveSpacing,
  spacing,
} from "@/utils/style";
import ImageUpload from "../Groups/ImageUpload";
import CustomButton from "../CustomButtom";
import { CaretLeftIcon } from "phosphor-react-native";

const CreateGroupModal = ({ onClose }: { onClose: () => void }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<any>("");
  const [isLoading, setIsLoading] = useState(false);
  const [toastState, settoastState] = useState<ErrorState>({
    visible: false,
    message: "",
    type: "error",
  });

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

  const validateForm = () => {
    if (!groupName.trim()) {
      showtoastMessage("Group name is required", "error");
      return false;
    }
    if (groupName.trim().length < 3) {
      showtoastMessage(
        "Group name must be at least 3 characters long",
        "error"
      );
      return false;
    }
    if (groupName.trim().length > 50) {
      showtoastMessage("Group name must be less than 50 characters", "error");
      return false;
    }
    return true;
  };

  const handleCreateGroup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
    } catch {
      showtoastMessage("Network error. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
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

        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerButtom}>
            <CaretLeftIcon color={colortheme.primary.contrastText} weight={"bold"}/>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Group</Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Choose Icon</Text>
            <ImageUpload
              file={icon}
              onSelect={(file) => setIcon(file)}
              onClear={() => {
                setIcon(null);
              }}
              placeholder="Upload Image"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Group Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter group name"
              placeholderTextColor={colortheme.text.muted}
              value={groupName}
              onChangeText={setGroupName}
              maxLength={50}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <Text style={styles.characterCount}>{groupName.length}/50</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="What's this group about?"
              placeholderTextColor={colortheme.text.muted}
              value={description}
              onChangeText={setDescription}
              maxLength={200}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="done"
            />
            <Text style={styles.characterCount}>{description.length}/200</Text>
          </View>

          <View style={styles.buttomContainer}>
            <CustomButton
              style={styles.submitButton}
              onPress={handleCreateGroup}
              loading={isLoading}
            >
              <Text style={styles.buttomtext}>
                {isLoading ? "Creating Group ..." : "Create Wallet"}
              </Text>
            </CustomButton>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateGroupModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colortheme.background.default,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colortheme.divider,
  },
   headerButtom:{
    position: "absolute",
    left:10,
    backgroundColor:colortheme.primary.main,
    borderRadius:12,
    padding:responsiveFontSize(5)

  },
  headerTitle: {
    color: colortheme.text.primary,
    fontSize: fontSize.lg,
    fontWeight: "600",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: {
    marginTop: spacing.xl,
  },
  sectionTitle: {
    color: colortheme.text.primary,
    fontSize: fontSize.md,
    fontWeight: "600",
    marginBottom: spacing.md,
  },
  iconContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  iconOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colortheme.background.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  iconOptionSelected: {
    borderColor: colortheme.primary.main,
    backgroundColor: colortheme.primary.main + "20",
  },
  iconText: {
    fontSize: 24,
  },
  input: {
    backgroundColor: colortheme.background.surface,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSize.md,
    color: colortheme.text.primary,
    borderWidth: 1,
    borderColor: colortheme.border,
  },
  descriptionInput: {
    height: responsiveHeight(80),
    paddingTop: spacing.md,
  },
  characterCount: {
    color: colortheme.text.muted,
    fontSize: fontSize.sm,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  buttomContainer: {
    flex: 1,
    marginTop: responsiveSpacing(40),
  },
  submitButton: {
    marginTop: "auto",
    marginBottom: spacing.xs,
  },
  buttomtext: {
    color: colortheme.primary.contrastText,
    fontSize: responsiveFontSize(16),
  },
});
