import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Edit2,
  Store,
  Copy,
  LogOut,
  User as UserIcon,
} from "lucide-react-native";
import {
  reloginWithToken,
  clearAuthToken,
  User,
  logoutUser,
} from "../../../../services/authService";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Default dynamic avatar placeholder using UI Avatars or a default image URL
const DEFAULT_AVATAR =
  "https://via.placeholder.com/150/111827/FFFFFF?text=User";

const AdminProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await reloginWithToken();
      if (res.user) {
        setUser(res.user);
      }
    } catch (error: any) {
      console.warn("Failed to load user profile:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logoutUser();

            await AsyncStorage.multiRemove(["user", "userRole"]);

            router.replace("/login");
          } catch (error) {
            console.error("Error during logout:", error);
            router.replace("/login");
          }
        },
      },
    ]);
  };

  const copyToClipboard = (text: string) => {
    Alert.alert("Copied", `${text} copied to clipboard!`);
  };

  // Helper function to resolve image URL or placeholder
  const getProfileImage = () => {
    if (user?.profileImage) {
      return { uri: user.profileImage };
    }
    // Generates dynamic initials fallback using user's name
    if (user?.fullName) {
      return {
        uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.fullName,
        )}&background=111827&color=ffffff&size=128`,
      };
    }
    return { uri: DEFAULT_AVATAR };
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, styles.centered]}>
        <ActivityIndicator size="large" color="#111827" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Top Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        <TouchableOpacity style={styles.avatarMiniBorder}>
          <Image source={getProfileImage()} style={styles.avatarMini} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Info Card */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.cardEditBtn}>
            <Edit2 size={18} color="#6b7280" />
          </TouchableOpacity>

          <View style={styles.profileHeader}>
            <View style={styles.avatarLargeBorder}>
              <Image source={getProfileImage()} style={styles.avatarLarge} />
            </View>

            <View style={styles.profileMeta}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {user?.role ? user.role.toUpperCase() : "USER"}
                </Text>
              </View>
              {/* Display User Name */}
              <Text style={styles.userName}>
                {user?.fullName || "Guest User"}
              </Text>
              {/* Display User Email */}
              <Text style={styles.userEmail}>
                {user?.email || "no-email@domain.com"}
              </Text>
            </View>
          </View>

          {/* User Details Grid */}
          <View style={styles.profileGrid}>
            <View style={styles.gridCol}>
              <Text style={styles.gridLabel}>Joined</Text>
              <Text style={styles.gridValue}>
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
              </Text>
            </View>
            <View style={styles.gridCol}>
              <Text style={styles.gridLabel}>User ID</Text>
              <Text style={styles.gridValue} numberOfLines={1}>
                {user?._id ? `...${user._id.slice(-6)}` : "N/A"}
              </Text>
            </View>
          </View>
        </View>

        {/* Store Info Section */}
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Store size={18} color="#6b7280" />
            <Text style={styles.sectionTitle}>Store Info</Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Store Name</Text>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldValue}>Lumina Boutique</Text>
              <TouchableOpacity>
                <Edit2 size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Store URL</Text>
            <View style={styles.fieldRow}>
              <Text style={[styles.fieldValue, styles.linkText]}>
                lumina.shop
              </Text>
              <TouchableOpacity onPress={() => copyToClipboard("lumina.shop")}>
                <Copy size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.fieldGroup, { borderBottomWidth: 0 }]}>
            <Text style={styles.fieldLabel}>Contact Email</Text>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldValue}>
                {user?.email || "hello@lumina.shop"}
              </Text>
              <TouchableOpacity>
                <Edit2 size={16} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Danger Zone / Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={18} color="#ef4444" />
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    backgroundColor: "#ffffff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  avatarMiniBorder: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  avatarMini: {
    width: "100%",
    height: "100%",
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 16,
    position: "relative",
  },
  cardEditBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 6,
    zIndex: 1,
  },
  profileHeader: {
    alignItems: "center",
    gap: 12,
  },
  avatarLargeBorder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    overflow: "hidden",
  },
  avatarLarge: {
    width: "100%",
    height: "100%",
  },
  profileMeta: {
    alignItems: "center",
  },
  badge: {
    backgroundColor: "rgba(17, 24, 39, 0.08)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#111827",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#6b7280",
  },
  profileGrid: {
    flexDirection: "row",
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f3f4f6",
  },
  gridCol: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  gridValue: {
    fontSize: 13,
    color: "#111827",
    marginTop: 4,
    fontWeight: "500",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  fieldGroup: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  fieldLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 4,
  },
  fieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
  },
  linkText: {
    color: "#2563eb",
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#fca5a5",
    backgroundColor: "#fef2f2",
    marginTop: 8,
  },
  logoutBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ef4444",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
