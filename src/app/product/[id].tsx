import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import {
  ArrowLeft,
  Bell,
  Heart,
  Star,
  ShoppingBag,
} from "lucide-react-native";
import { router, useLocalSearchParams, useRouter } from "expo-router";

interface ProductDetails {
  id: string;
  title: string;
  rating: number;
  reviewCount: number;
  description: string;
  sizes: string[];
  price: number;
  image: string;
}

const ProductDetailsScreen = ({ navigation, route }: any) => {
const { id } = useLocalSearchParams<{ id: string }>();
  const productId = route?.params?.productId || "1";

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("S");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      // API ENDPOINT PLACEHOLDER:
      // const response = await fetch(`https://api.yourdomain.com/products/${productId}`);
      // const data = await response.json();

      // Mocked Response matching image design
      const mockData: ProductDetails = {
        id: productId,
        title: "Regular Fit Slogan",
        rating: 4.0,
        reviewCount: 45,
        description:
          "The name says it all, the right size slightly snugs the body leaving enough room for comfort in the sleeves and waist.",
        sizes: ["S", "M", "L"],
        price: 1190,
        image:
          "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
      };

      setProduct(mockData);
      if (mockData.sizes.length > 0) setSelectedSize(mockData.sizes[0]);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    // API ENDPOINT PLACEHOLDER:
    // await fetch("https://api.yourdomain.com/cart", {
    //   method: "POST",
    //   body: JSON.stringify({ productId, size: selectedSize }),
    // });
    console.log("Added to cart:", { productId, selectedSize });
  };

  if (loading || !product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
         onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={22} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Product Image & Heart Action */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.image }} style={styles.productImage} />
          <TouchableOpacity
            style={styles.favoriteButton}
            activeOpacity={0.8}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart
              size={20}
              color={isFavorite ? "#EF4444" : "#111827"}
              fill={isFavorite ? "#EF4444" : "none"}
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <Text style={styles.productTitle}>{product.title}</Text>

        {/* Reviews Summary Link */}
        <TouchableOpacity
          style={styles.ratingRow}
          activeOpacity={0.7}
          onPress={() =>
            navigation?.navigate("Reviews", { productId: product.id })
          }
        >
          <Star size={18} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.ratingText}>
            <Text style={styles.ratingBold}>{product.rating.toFixed(1)}/5</Text>{" "}
            ({product.reviewCount} reviews)
          </Text>
        </TouchableOpacity>

        {/* Description */}
        <Text style={styles.description}>{product.description}</Text>

        {/* Size Selection */}
        <Text style={styles.sectionTitle}>Choose size</Text>
        <View style={styles.sizesRow}>
          {product.sizes.map((size) => {
            const isSelected = selectedSize === size;
            return (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeChip,
                  isSelected && styles.sizeChipActive,
                ]}
                onPress={() => setSelectedSize(size)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.sizeText,
                    isSelected && styles.sizeTextActive,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.priceLabel}>Price</Text>
          <Text style={styles.priceValue}>
            $ {product.price.toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addToCartButton}
          activeOpacity={0.8}
          onPress={handleAddToCart}
        >
          <ShoppingBag size={20} color="#FFFFFF" />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  iconButton: {
    padding: 6,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 380,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    overflow: "hidden",
    marginTop: 8,
    marginBottom: 20,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  ratingBold: {
    color: "#111827",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: "#9CA3AF",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  sizesRow: {
    flexDirection: "row",
    gap: 12,
  },
  sizeChip: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  sizeChipActive: {
    borderColor: "#111827",
  },
  sizeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  sizeTextActive: {
    fontWeight: "800",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  priceLabel: {
    fontSize: 13,
    color: "#9CA3AF",
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  addToCartButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#18181B",
    paddingHorizontal: 32,
    height: 54,
    borderRadius: 14,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default ProductDetailsScreen;