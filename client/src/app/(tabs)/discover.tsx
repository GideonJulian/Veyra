import React, { useState, useEffect, useCallback } from "react";
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
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import {
  Bell,
  Search,
  Mic,
  SlidersHorizontal,
  X,
  ChevronDown,
  AlertCircle,
} from "lucide-react-native";
import ProductCard from "../../components/ProductCard";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const API_URL = "http://172.20.10.3:5000/api/products";

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

interface Product {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  image?: string;
  images?: string[];
  price?: number;
  category?: string;
  [key: string]: any;
}

const Discover = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  // Filter Modal States
  const [selectedSort, setSelectedSort] = useState("Relevance");
  const [selectedSize, setSelectedSize] = useState("L");
  const [isSizeDropdownOpen, setIsSizeDropdownOpen] = useState(false);

  // Fetch products from backend API
  const fetchProducts = useCallback(async () => {
    try {
      setErrorMessage(null);
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();

      // Normalize array response (handles root array or nested { products: [] })
      const productList = Array.isArray(data) ? data : data.products || [];
      setProducts(productList);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setErrorMessage(
        error?.message || "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts();
  }, [fetchProducts]);

  // Client-side Filter Logic for Category and Search Input
  const filteredProducts = products.filter((product) => {
    const title = (product.title || product.name || "").toLowerCase();
    const category = (product.category || "").toLowerCase();

    const matchesSearch = title.includes(searchQuery.toLowerCase().trim());
    const matchesCategory =
      selectedCategory === "All" ||
      category.includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

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

        {/* Products Grid / State Handlers */}
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#18181B" />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : errorMessage ? (
          <View style={styles.centerContainer}>
            <AlertCircle size={40} color="#DC2626" />
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchProducts}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.productsGrid}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {filteredProducts.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products found.</Text>
              </View>
            ) : (
              filteredProducts.map((product) => {
                const productId = product._id || product.id;
                return (
                  <View key={productId} style={styles.productCard}>
                    <ProductCard
                      product={product}
                      onPress={() => router.push(`/product/${productId}`)}
                    />
                  </View>
                );
              })
            )}
          </ScrollView>
        )}

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
              <View style={styles.dragHandle} />

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
                  <Text style={styles.priceRangeValue}>$0 - $100</Text>
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
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  errorText: {
    marginTop: 12,
    fontSize: 15,
    color: "#DC2626",
    textAlign: "center",
    fontWeight: "500",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#18181B",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    width: "100%",
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 15,
    color: "#6B7280",
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