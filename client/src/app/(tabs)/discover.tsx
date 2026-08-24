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
  Modal,
  Image,
  Dimensions,
} from "react-native";
import {
  Bell,
  Search,
  Mic,
  SlidersHorizontal,
  X,
  Heart,
  ChevronDown,
} from "lucide-react-native";
import ProductCard from "../../components/ProductCard";

import { router } from "expo-router";
const { width } = Dimensions.get("window");

const CATEGORIES = [
  "All",
  "Tshirts",
  "Jeans",
  "Shoes",
  "Jackets",
  "Accessories",
];
const SORT_OPTIONS = ["Relevance", "Price: Low - High", "Price: High - Low"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

const PRODUCTS = [
  {
    id: "1",
    title: "Regular Fit Slogan",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300",
  },
  {
    id: "2",
    title: "Regular Fit Polo",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=300",
  },
];

const Discover = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState("Tshirts");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Filter Modal States
  const [selectedSort, setSelectedSort] = useState("Relevance");
  const [selectedSize, setSelectedSize] = useState("L");
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

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

            <TouchableOpacity
              style={styles.filterButton}
              activeOpacity={0.8}
              onPress={() => setIsFilterVisible(true)}
            >
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

        {/* Products Grid */}
        <ScrollView contentContainerStyle={styles.productsGrid}>
          {PRODUCTS.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <ProductCard
                product={product}
                onPress={() => router.push(`/product/[id]`)}
              />
            </View>
          ))}
        </ScrollView>

        {/* Filter Modal Sheet */}
        <Modal
          visible={isFilterVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setIsFilterVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={styles.modalBackdrop}
              activeOpacity={1}
              onPress={() => setIsFilterVisible(false)}
            />

            <View style={styles.modalContent}>
              {/* Sheet Drag Indicator */}
              <View style={styles.dragHandle} />

              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Filters</Text>
                <TouchableOpacity
                  onPress={() => setIsFilterVisible(false)}
                  style={styles.closeButton}
                >
                  <X size={22} color="#111827" />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.modalBody}
              >
                {/* Sort By Section */}
                <Text style={styles.sectionTitle}>Sort By</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.sortContainer}
                >
                  {SORT_OPTIONS.map((option) => {
                    const isSelected = selectedSort === option;
                    return (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.sortChip,
                          isSelected && styles.sortChipActive,
                        ]}
                        onPress={() => setSelectedSort(option)}
                        activeOpacity={0.8}
                      >
                        <Text
                          style={[
                            styles.sortText,
                            isSelected && styles.sortTextActive,
                          ]}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <View style={styles.divider} />

                {/* Price Range Section */}
                <View style={styles.priceHeaderRow}>
                  <Text style={styles.sectionTitle}>Price</Text>
                  <Text style={styles.priceRangeValue}>$0 - $19</Text>
                </View>
                <View style={styles.sliderTrackContainer}>
                  <View style={styles.sliderLine} />
                  <View style={[styles.sliderThumb, { left: 0 }]} />
                  <View style={[styles.sliderThumb, { right: 0 }]} />
                </View>

                <View style={styles.divider} />

                {/* Size Dropdown Section */}
                <View style={styles.sizeHeaderRow}>
                  <Text style={styles.sectionTitle}>Size</Text>
                  <TouchableOpacity
                    style={styles.sizeSelector}
                    onPress={() => setIsSizeDropdownOpen(!isSizeDropdownOpen)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.selectedSizeText}>{selectedSize}</Text>
                    <ChevronDown size={18} color="#6B7280" />
                  </TouchableOpacity>
                </View>

                {/* Size Selection List */}
                {isSizeDropdownOpen && (
                  <View style={styles.sizeOptionsList}>
                    {SIZES.map((size) => (
                      <TouchableOpacity
                        key={size}
                        style={[
                          styles.sizeOptionItem,
                          selectedSize === size && styles.sizeOptionSelected,
                        ]}
                        onPress={() => {
                          setSelectedSize(size);
                          setIsSizeDropdownOpen(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.sizeOptionText,
                            selectedSize === size &&
                              styles.sizeOptionTextSelected,
                          ]}
                        >
                          {size}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {/* Apply Filters Button */}
                <TouchableOpacity
                  style={styles.applyButton}
                  activeOpacity={0.8}
                  onPress={() => setIsFilterVisible(false)}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </Modal>
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
    paddingBottom: 16,
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
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 16,
    paddingTop: 12,
    paddingBottom: 32,
  },
  productCard: {
    width: (width - 56) / 2,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 200,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: "80%",
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  sortContainer: {
    gap: 10,
  },
  sortChip: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  sortChipActive: {
    backgroundColor: "#18181B",
    borderColor: "#18181B",
  },
  sortText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  sortTextActive: {
    color: "#FFFFFF",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 20,
  },
  priceHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceRangeValue: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  sliderTrackContainer: {
    height: 24,
    justifyContent: "center",
    position: "relative",
    marginTop: 8,
  },
  sliderLine: {
    height: 3,
    backgroundColor: "#111827",
    borderRadius: 2,
  },
  sliderThumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  sizeHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sizeSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  selectedSizeText: {
    fontSize: 15,
    color: "#6B7280",
    fontWeight: "600",
  },
  sizeOptionsList: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  sizeOptionItem: {
    width: 44,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  sizeOptionSelected: {
    borderColor: "#18181B",
    backgroundColor: "#18181B",
  },
  sizeOptionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  sizeOptionTextSelected: {
    color: "#FFFFFF",
  },
  applyButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default Discover;
