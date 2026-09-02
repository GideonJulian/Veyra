import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react-native';

interface Product {
  _id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  status: 'Active' | 'Draft';
  image: string;
}

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Shoes', 'Accessories'];
const API_URL = 'http://172.20.10.3:5000/api/products';

const AdminProductsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch product list from real server API
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL);
      const resData = await response.json();

      if (resData.success) {
        setProducts(resData.data);
      } else {
        Alert.alert('Error', resData.message || 'Failed to fetch products');
      }
    } catch (error: any) {
      Alert.alert('Network Error', error.message || 'Could not connect to backend server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Re-fetch products every time screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  // Delete product from backend API
  const handleDeleteProduct = (id: string) => {
    Alert.alert('Delete Product', 'Are you sure you want to delete this product?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await fetch(`${API_URL}/${id}`, {
              method: 'DELETE',
            });
            const resData = await response.json();

            if (resData.success) {
              setProducts((prev) => prev.filter((p) => p._id !== id));
            } else {
              Alert.alert('Error', resData.message || 'Could not delete product');
            }
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  // Filter products based on client-side search query and selected category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, products]);

  const renderProductCard = useCallback(({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />

        {/* Action overlay buttons */}
        <View style={styles.actionOverlay}>
          <TouchableOpacity
            style={styles.actionBtn}
            // onPress={() => router.push(`/admin/edit-product?id=${item._id}`)}
          >
            <Edit2 size={16} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDeleteProduct(item._id)}
          >
            <Trash2 size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadgeContainer}>
          <Text
            style={[
              styles.statusText,
              item.status === 'Active' ? styles.statusActive : styles.statusDraft,
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.productTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        </View>

        <View style={styles.cardFooterRow}>
          <Text style={styles.metaText}>Stock: {item.stock}</Text>
          <Text style={styles.metaText}>{item.category}</Text>
        </View>
      </View>
    </View>
  ), []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

 
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.fixedHeaderContainer}>
          {/* Header Bar */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Products</Text>

            <TouchableOpacity
              style={styles.addProductBtn}
              onPress={() => router.push('/admin/upload')}
            >
              <Plus size={18} color="#ffffff" />
              <Text style={styles.addProductText}>Add Product</Text>
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchWrapper}>
            <View style={styles.searchContainer}>
              <Search size={20} color="#9ca3af" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                placeholderTextColor="#9ca3af"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Horizontal Category Chips */}
          <View style={styles.categoryContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryScroll}
              keyboardShouldPersistTaps="handled"
            >
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.chip,
                      isActive ? styles.activeChip : styles.inactiveChip,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isActive ? styles.activeChipText : styles.inactiveChipText,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* --- SCROLLABLE PRODUCTS AREA --- */}
      <View style={styles.listWrapper}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#111827" />
          </View>
        ) : (
          <FlatList
            style={styles.list}
            data={filteredProducts}
            keyExtractor={(item) => item._id}
            renderItem={renderProductCard}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#111827']} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products found.</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdminProductsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  fixedHeaderContainer: {
    backgroundColor: '#ffffff',
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  addProductBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111827',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 4,
  },
  addProductText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchWrapper: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  categoryContainer: {
    marginTop: 0,
    marginBottom: 8,
    width: '100%',
  },
  categoryScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  activeChip: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  inactiveChip: {
    backgroundColor: '#ffffff',
    borderColor: '#e5e7eb',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#ffffff',
  },
  inactiveChipText: {
    color: '#374151',
  },
  listWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 50,
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 240,
    backgroundColor: '#f4f5f7',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 4,
    gap: 4,
  },
  actionBtn: {
    padding: 6,
  },
  statusBadgeContainer: {
    position: 'absolute',
    bottom: 8,
    left: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statusActive: {
    backgroundColor: '#d1fae5',
    color: '#065f46',
  },
  statusDraft: {
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
  },
  cardContent: {
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 8,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  metaText: {
    fontSize: 13,
    color: '#6b7280',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
});
