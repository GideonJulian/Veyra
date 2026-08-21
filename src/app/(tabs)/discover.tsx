import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Bell, Search, Mic, SlidersHorizontal,  } from "lucide-react-native";

const CATEGORIES = ["All", "Tshirts", "Jeans", "Shoes", "Jackets", "Accessories"];

const Discover = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tshirts");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Title and Notification Icon */}
        <View style={styles.topRow}>
          <Text style={styles.title}>Discover</Text>
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Bell size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Search Bar & Filter Button Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for clothes..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.micButton} activeOpacity={0.7}>
              <Mic size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.filterButton} activeOpacity={0.8}>
            <SlidersHorizontal size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Horizontal Category Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  isSelected && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -1,
  },
  iconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  searchContainer: {
    flex: 1,
    height: 52,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#111827",
  },
  micButton: {
    padding: 4,
  },
  filterButton: {
    width: 52,
    height: 52,
    backgroundColor: "#18181B",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    gap: 10,
    paddingRight: 20,
  },
  categoryChip: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  categoryChipActive: {
    backgroundColor: "#18181B",
    borderColor: "#18181B",
  },
  categoryText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
  },
  categoryTextActive: {
    color: "#FFFFFF",
  },
});

export default Discover;