import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import {
  ArrowLeft,
  Bell,
  Search as SearchIcon,
  Mic,
  XCircle,
  ArrowUpRight,
  SearchX,
  History,
} from "lucide-react-native";

const STORAGE_KEY = "@recent_searches";

const MOCK_PRODUCTS = [
  {
    id: "1",
    title: "Regular Fit Slogan",
    price: "$1,190",
    discount: null,
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150",
  },
  {
    id: "2",
    title: "Regular Fit Polo",
    price: "$1,100",
    discount: "-52%",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=150",
  },
  {
    id: "3",
    title: "Regular Fit Black",
    price: "$1,690",
    discount: null,
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=150",
  },
  {
    id: "4",
    title: "Regular Fit V-Neck",
    price: "$1,290",
    discount: null,
    image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=150",
  },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof MOCK_PRODUCTS>([]);

  const shimmerValue = new Animated.Value(0.3);

  // Load Recent Searches on Mount
  useEffect(() => {
    loadRecentSearches();
  }, []);

  // Shimmer Loader Animation
  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerValue, {
            toValue: 0.3,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [loading]);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load recent searches:", error);
    }
  };

  const saveRecentSearch = async (searchTerm: string) => {
    const trimmed = searchTerm.trim();
    if (!trimmed) return;

    try {
      // Remove duplicate if exists, then prepend to top
      const updated = [
        trimmed,
        ...recentSearches.filter(
          (item) => item.toLowerCase() !== trimmed.toLowerCase()
        ),
      ].slice(0, 10); // Keep max 10 recent searches

      setRecentSearches(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save search term:", error);
    }
  };

  const handleSearchChange = (text: string) => {
    setQuery(text);

    if (text.trim().length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const filtered = MOCK_PRODUCTS.filter((item) =>
        item.title.toLowerCase().includes(text.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 800);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      saveRecentSearch(query);
    }
  };

  const removeRecentSearch = async (itemToRemove: string) => {
    try {
      const updated = recentSearches.filter((item) => item !== itemToRemove);
      setRecentSearches(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to remove search item:", error);
    }
  };

  const clearAllRecent = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear recent searches:", error);
    }
  };

  const selectRecentSearch = (item: string) => {
    setQuery(item);
    handleSearchChange(item);
    saveRecentSearch(item);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Bell size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        {/* Search Bar Input */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <SearchIcon size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for clothes..."
              placeholderTextColor="#9CA3AF"
              value={query}
              onChangeText={handleSearchChange}
              onSubmitEditing={handleSearchSubmit}
              returnKeyType="search"
              autoFocus
            />
            {query.length > 0 ? (
              <TouchableOpacity onPress={() => handleSearchChange("")}>
                <XCircle size={18} color="#9CA3AF" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity>
                <Mic size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Main Content Areas */}
        {loading ? (
          <View style={styles.contentContainer}>
            {[1, 2, 3, 4].map((key) => (
              <View key={key} style={styles.skeletonRow}>
                <Animated.View
                  style={[styles.skeletonThumb, { opacity: shimmerValue }]}
                />
                <View style={styles.skeletonTextContainer}>
                  <Animated.View
                    style={[styles.skeletonTitle, { opacity: shimmerValue }]}
                  />
                  <Animated.View
                    style={[styles.skeletonPrice, { opacity: shimmerValue }]}
                  />
                </View>
              </View>
            ))}
          </View>
        ) : query.length > 0 ? (
          results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.resultsList}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productRow}
                  activeOpacity={0.7}
                  onPress={() => saveRecentSearch(query)}
                >
                  <Image source={{ uri: item.image }} style={styles.productImage} />
                  <View style={styles.productInfo}>
                    <Text style={styles.productTitle}>{item.title}</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.productPrice}>{item.price}</Text>
                      {item.discount && (
                        <Text style={styles.discountBadge}>{item.discount}</Text>
                      )}
                    </View>
                  </View>
                  <ArrowUpRight size={22} color="#111827" />
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.emptyStateContainer}>
              <View style={styles.emptyIconCircle}>
                <SearchX size={52} color="#9CA3AF" />
              </View>
              <Text style={styles.emptyTitle}>No Results Found!</Text>
              <Text style={styles.emptySubtitle}>
                Try a similar word or something more general.
              </Text>
            </View>
          )
        ) : (
          <View style={styles.contentContainer}>
            {recentSearches.length > 0 ? (
              <>
                <View style={styles.recentHeader}>
                  <Text style={styles.recentTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearAllRecent}>
                    <Text style={styles.clearAllText}>Clear all</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={recentSearches}
                  keyExtractor={(item, index) => `${item}-${index}`}
                  keyboardShouldPersistTaps="handled"
                  renderItem={({ item }) => (
                    <View style={styles.recentRow}>
                      <TouchableOpacity
                        style={styles.recentTextTouch}
                        onPress={() => selectRecentSearch(item)}
                      >
                        <Text style={styles.recentItemText}>{item}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => removeRecentSearch(item)}
                        style={styles.deleteIconBtn}
                      >
                        <XCircle size={20} color="#9CA3AF" />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </>
            ) : (
              <View style={styles.emptyStateContainer}>
                <View style={styles.emptyIconCircle}>
                  <History size={48} color="#9CA3AF" />
                </View>
                <Text style={styles.emptyTitle}>No Recent Searches</Text>
                <Text style={styles.emptySubtitle}>
                  Search history will appear here once you start exploring.
                </Text>
              </View>
            )}
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  headerIconBtn: {
    padding: 4,
  },
  searchBarContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
  },
  searchBar: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#111827",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    textDecorationLine: "underline",
  },
  recentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  recentTextTouch: {
    flex: 1,
  },
  recentItemText: {
    fontSize: 15,
    color: "#374151",
  },
  deleteIconBtn: {
    paddingLeft: 10,
  },
  resultsList: {
    paddingHorizontal: 20,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  productInfo: {
    flex: 1,
    marginLeft: 14,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  productPrice: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  discountBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#EF4444",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  emptyIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
  skeletonRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  skeletonThumb: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  skeletonTextContainer: {
    flex: 1,
    marginLeft: 14,
    gap: 8,
  },
  skeletonTitle: {
    height: 16,
    width: "60%",
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
  skeletonPrice: {
    height: 12,
    width: "30%",
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
  },
});