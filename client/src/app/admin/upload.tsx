import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Switch,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { ChevronLeft, ImagePlus, Save, Check, X } from "lucide-react-native";

import { useRouter } from 'expo-router';


export default function AddProductScreen({ navigation }: any) {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // Form Fields State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("0");
  const [category, setCategory] = useState("Tops");
  const [isActive, setIsActive] = useState(true);

  // Feedback Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStatus, setModalStatus] = useState<"success" | "error">(
    "success",
  );
  const [modalMessage, setModalMessage] = useState({ title: "", body: "" });

  // Reset all input states to default
  const resetForm = () => {
    setImageUri(null);
    setTitle("");
    setDescription("");
    setPrice("");
    setDiscountPrice("");
    setStock("0");
    setCategory("Tops");
    setIsActive(true);
  };

  // Helper to show modal pop-up
  const showFeedbackModal = (
    type: "success" | "error",
    titleText: string,
    bodyText: string,
  ) => {
    setModalStatus(type);
    setModalMessage({ title: titleText, body: bodyText });
    setModalVisible(true);
  };

  // 1. Pick image from device gallery
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      showFeedbackModal(
        "error",
        "Permission Denied",
        "Permission to access media library is required.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImageUri(result.assets[0].uri);
    }
  };

  // 2. Upload image file to server
  const uploadImageToServer = async (uri: string): Promise<string | null> => {
    const filename = uri.split("/").pop() || "photo.jpg";
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    const formData = new FormData();
    formData.append("image", {
      uri,
      name: filename,
      type,
    } as any);

    try {
      const response = await fetch("http://172.20.10.3:5000/api/upload", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await response.json();
      if (data.success) {
        return data.imageUrl;
      } else {
        throw new Error(data.message || "Image upload failed");
      }
    } catch (error: any) {
      showFeedbackModal("error", "Upload Error", error.message);
      return null;
    }
  };

  // 3. Save Product Handler
  const handleSaveProduct = async () => {
    if (!title.trim()) {
      showFeedbackModal(
        "error",
        "Validation Error",
        "Please enter a product title",
      );
      return;
    }
    if (!price) {
      showFeedbackModal(
        "error",
        "Validation Error",
        "Please enter a product price",
      );
      return;
    }
    if (!imageUri) {
      showFeedbackModal(
        "error",
        "Validation Error",
        "Please select a product image",
      );
      return;
    }

    setLoading(true);

    const uploadedImageUrl = await uploadImageToServer(imageUri);

    if (!uploadedImageUrl) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://172.20.10.3:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price) || 0,
          discountPrice: parseFloat(discountPrice) || 0,
          stock: parseInt(stock, 10) || 0,
          category,
          status: isActive ? "Active" : "Draft",
          image: uploadedImageUrl,
        }),
      });

      const resData = await response.json();
      if (resData.success) {
        // Clear all form inputs on success
        resetForm();
        showFeedbackModal(
          "success",
          "Congratulations!",
          "Your new product has been added.",
        );
      } else {
        showFeedbackModal(
          "error",
          "Upload Failed",
          resData.message || "Failed to create product",
        );
      }
    } catch (error: any) {
      showFeedbackModal("error", "Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header Bar */}
      <SafeAreaView style={styles.safeArea}>
  
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()} 
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <ChevronLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Product</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

  
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Upload Zone */}
        <TouchableOpacity
          style={styles.uploadArea}
          onPress={pickImage}
          activeOpacity={0.7}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <View style={styles.iconContainer}>
                <ImagePlus size={36} color="#6b7280" strokeWidth={1.5} />
              </View>
              <Text style={styles.uploadTitle}>
                Click or drag to upload.{"\n"}High-res square images{"\n"}
                recommended.
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* BASIC INFORMATION */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>BASIC INFORMATION</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Minimalist Cashmere Sweater"
              placeholderTextColor="#9ca3af"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Provide a detailed description of the product..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>
        </View>

        {/* PRICING */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>PRICING</Text>
          <View style={styles.row}>
            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Price</Text>
              <TextInput
                style={styles.input}
                placeholder="$ 0.00"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={[styles.inputGroup, styles.flex1]}>
              <Text style={styles.label}>Discount Price</Text>
              <TextInput
                style={styles.input}
                placeholder="$ 0.00"
                placeholderTextColor="#9ca3af"
                keyboardType="decimal-pad"
                value={discountPrice}
                onChangeText={setDiscountPrice}
              />
            </View>
          </View>
        </View>

        {/* INVENTORY & CATEGORY */}
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>INVENTORY & CATEGORY</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stock Quantity</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              value={stock}
              onChangeText={setStock}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              placeholder="Select category"
              placeholderTextColor="#9ca3af"
              value={category}
              onChangeText={setCategory}
            />
          </View>
        </View>

        {/* PRODUCT STATUS */}
        <View style={styles.card}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.sectionHeaderNoMargin}>PRODUCT STATUS</Text>
              <Text style={styles.subLabel}>
                Make product visible on storefront
              </Text>
            </View>
            <View style={styles.switchContainer}>
              <Switch
                value={isActive}
                onValueChange={setIsActive}
                trackColor={{ false: "#e5e7eb", true: "#111827" }}
                thumbColor="#ffffff"
              />
              <Text style={styles.statusLabelText}>
                {isActive ? "Active" : "Draft"}
              </Text>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveProduct}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <View style={styles.saveBtnContent}>
              <Save size={18} color="#ffffff" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Save Product</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Success / Error Status Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Status Icon Badge */}
            <View
              style={[
                styles.modalIconRing,
                modalStatus === "success"
                  ? styles.successRing
                  : styles.errorRing,
              ]}
            >
              {modalStatus === "success" ? (
                <Check size={36} color="#16a34a" strokeWidth={3} />
              ) : (
                <X size={36} color="#dc2626" strokeWidth={3} />
              )}
            </View>

            {/* Status Titles */}
            <Text style={styles.modalTitle}>{modalMessage.title}</Text>
            <Text style={styles.modalBody}>{modalMessage.body}</Text>

            {/* Action Button */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Thanks</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingBottom:10,
  },
  header: {
    height: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#ffffff",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  headerRightPlaceholder: {
    width: 32,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    backgroundColor: "#f9fafb",
  },
  uploadArea: {
    height: 240,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    overflow: "hidden",
  },
  uploadPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  iconContainer: {
    marginBottom: 12,
  },
  uploadTitle: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    gap: 14,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    letterSpacing: 0.5,
  },
  sectionHeaderNoMargin: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
    letterSpacing: 0.5,
  },
  subLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#ffffff",
  },
  textArea: {
    height: 100,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusLabelText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  saveButton: {
    backgroundColor: "#000000",
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 44,
  },
  saveBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  saveIcon: {
    marginRight: 4,
  },
  saveButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },

  /* Status Overlay Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalIconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  successRing: {
    borderColor: "#22c55e",
    backgroundColor: "#f0fdf4",
  },
  errorRing: {
    borderColor: "#ef4444",
    backgroundColor: "#fef2f2",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  modalBody: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  modalButton: {
    width: "100%",
    backgroundColor: "#18181b",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
