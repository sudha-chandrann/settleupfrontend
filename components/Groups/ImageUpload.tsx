import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { UploadSimple, XCircle } from "phosphor-react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { ImageUploadProps } from "@/utils/type";
import { colortheme } from "@/utils/theme";
import { getFilePath } from "@/services/imageservice";
import { responsiveFontSize, responsiveHeight, responsiveSpacing, responsiveWidth, spacing } from "@/utils/style";

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "",
}: ImageUploadProps) => {

  const pickImage = async () => {
    try {
      const { status: existingStatus } =
        await ImagePicker.getMediaLibraryPermissionsAsync();

      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Permission Required",
          "Sorry, we need camera roll permissions to select images.",
          [{ text: "OK" }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.5,
        exif: false,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        onSelect(result.assets[0]);
      }
    } catch (error) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  return (
    <View>
      {!file && (
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.inputContainer, containerStyle && containerStyle]}
        >
          <UploadSimple color={colortheme.primary.main} />
          {placeholder && (
            <Text style={{ color: colortheme.primary.contrastText }}>
              {placeholder}
            </Text>
          )}
        </TouchableOpacity>
      )}
      {file && (
        <View style={[styles.image, imageStyle && imageStyle]}>
          <Image
            style={{ flex: 1 }}
            source={getFilePath(file)}
            contentFit="cover"
            transition={100}
          />
          <TouchableOpacity style={styles.deletIcon} onPress={onClear}>
            <XCircle
              size={responsiveFontSize(29)}
              weight="fill"
              color={colortheme.primary.contrastText}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;

const styles = StyleSheet.create({
  inputContainer: {
    height: responsiveHeight(54),
    backgroundColor: colortheme.background.surface,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: colortheme.border,
    borderStyle: "dashed",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  image: {
    height: responsiveWidth(150),
    width: responsiveWidth(150),
    borderRadius: 12,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  deletIcon: {
    position: "absolute",
    right: responsiveSpacing(2),
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
});
