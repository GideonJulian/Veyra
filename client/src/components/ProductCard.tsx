import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image } from 'react-native'
import React from 'react'
import { Heart } from 'lucide-react-native';

const { width } = Dimensions.get("window");

// 1. Export the interface so screen files can import it
// 2. Add support for backend properties (_id, optional image/title)
export interface Product {
  id?: string;
  _id?: string;
  title?: string;
  name?: string;
  image?: string;
  price?: number;
  category?: string;
  [key: string]: any;
}

export interface ProductCardProps {
  product: Product;
  onFavoritePress?: (id: string) => void;
  onPress?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onFavoritePress, onPress }) => {
  const productId = product.id || product._id || "";
  const displayTitle = product.title || product.name || "Untitled Product";
  const displayImage = product.image || "https://via.placeholder.com/300";

  return (
    <TouchableOpacity 
      style={styles.productCard} 
      activeOpacity={0.9} 
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: displayImage }} style={styles.productImage} />
        <TouchableOpacity
          style={styles.favoriteButton}
          activeOpacity={0.8}
          onPress={(e) => {
            e.stopPropagation();
            onFavoritePress && onFavoritePress(productId);
          }}
        >
          <Heart size={18} color="#111827" />
        </TouchableOpacity>
      </View>
      <Text style={styles.productTitle} numberOfLines={1}>
        {displayTitle}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({ 
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
});

export default ProductCard;