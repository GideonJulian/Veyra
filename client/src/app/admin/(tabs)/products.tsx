import React, { useState, useMemo } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react-native';

interface Product {
  id: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  status: 'Active' | 'Draft';
  image: string;
}

const CATEGORIES = ['All', 'Tops', 'Bottoms', 'Shoes', 'Accessories'];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Slim Fit Linen Shirt',
    price: 89.0,
    stock: 45,
    category: 'Tops',
    status: 'Active',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCl3fDAieR1lnVaSIelSImby-AQ_l6h8SVclpoRg-I1B0oP9bMMpUixM9h5vJJsGHktVPWeRE-4hDJpU2gTjBM0yaqrUN5nw83FRKolImOglu2vGoY-ZMl8KxlBzi6JHqtAflKe2CQRJ7uccZmLHgRjYhUihCbnm3mT0opj5h4w9uMkfaoNEFqRrU6SCaBV4e36MVczyoPAEqq5uG3ZIeklkmaxbK3J5b6X3a134krplmhgYoCv4grF',
  },
  {
    id: '2',
    title: 'Straight Leg Denim',
    price: 120.0,
    stock: 0,
    category: 'Bottoms',
    status: 'Draft',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAKGgWj6bqhKyZ8PLYVveqUx4lKBZ5DP9vFjTgV1pmPrWyyhYfarWHVKmQkHr2wVfd56IU_p1zjhIlNrRuNt1-5KGmXBtU0dB57SncoNVDy_xsSNoDxJEn0cW3rH_CdnJ9yyC6wkHdotmMiVWymMQ8twer6YCZ0q5Tf7iDFBGELiMaWlyCe4q6ThrdHBAfp55ApG5XRhgPeOCMTtdVeMRAVRbpE9z6RTfaCLJmAPczTiDiQgQeYuT6-',
  },
  {
    id: '3',
    title: 'Classic White Sneakers',
    price: 145.0,
    stock: 12,
    category: 'Shoes',
    status: 'Active',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC2Ydw-0ZI_ILfxx4i_muWr8qPKauXoVRh1helHE4OuRkp1AKmjRGNsxOYYBM2zE7-iVxJdQvT1ZinoPNTdHPaQubjlKytsFg7wkszD_32HwrHKMS7Xc-UgYpQtaxOAiMTi50ay13W9e8SYPZ2aVwbcA4FaJdfO0VvMU9U6Q3OI-L79BGsSBr3mSDoAwW-L6rbp3XE2HoXHoPF67-8u3iV5j2x80BDmd7T593lsWpz7zZFLjcDCQq9W',
  },
];

const AdminProductsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Filter products based on search query and category chip selection
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

  const handleDeleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const renderProductCard = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />

        {/* Action overlay buttons */}
        <View style={styles.actionOverlay}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push(``)}
          >
            <Edit2 size={16} color="#4b5563" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleDeleteProduct(item.id)}
          >
            <Trash2 size={16} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Status Badge */}
        <View style={styles.statusBadgeContainer}>
          <Text
            style={[
              styles.statusText,
              item.status === 'Active'
                ? styles.statusActive
                : styles.statusDraft,
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
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Header (Menu Icon Removed) */}
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

      <View style={styles.container}>
        {/* Search Input */}
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

        {/* Horizontal Category Chips */}
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
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

        {/* Product Cards List */}
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderProductCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found.</Text>
            </View>
          }
        />
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
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
  },
  header: {
    height: 60,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    marginTop: 16,
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
    marginVertical: 14,
  },
  categoryScroll: {
    gap: 8,
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
  listContent: {
    paddingBottom: 24,
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
    justify: 'space-between',
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
    justify: 'space-between',
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
});