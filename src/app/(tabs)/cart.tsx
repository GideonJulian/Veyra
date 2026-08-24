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
  Alert,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from "react-native";
import {
  ArrowLeft,
  Bell,
  Trash2,
  Minus,
  Plus,
  ArrowRight,
  ShoppingCart,
} from "lucide-react-native";
import { useRouter } from "expo-router";

interface CartItem {
  id: string;
  title: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Constants
  const vatRate = 0.0; // 0% as shown in design
  const shippingFee = 80;

  useEffect(() => {
    fetchCartItems();
  }, []);

  // API ENDPOINT: Fetch Cart Items
  const fetchCartItems = async () => {
    try {
      setLoading(true);
      // const response = await fetch("https://api.yourdomain.com/cart");
      // const data = await response.json();
      // setCartItems(data);

      // Mock Initial Data matching UI
      const mockCart: CartItem[] = [
        {
          id: "1",
          title: "Regular Fit Slogan",
          size: "L",
          price: 1190,
          quantity: 2,
          image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400",
        },
        {
          id: "2",
          title: "Regular Fit Polo",
          size: "M",
          price: 1100,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400",
        },
        {
          id: "3",
          title: "Regular Fit Black",
          size: "L",
          price: 1290,
          quantity: 1,
          image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400",
        },
      ];

      setCartItems(mockCart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // API ENDPOINT: Update Quantity
  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      // Optimistic UI update
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
      );

      // await fetch(`https://api.yourdomain.com/cart/${id}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ quantity: newQuantity }),
      // });
    } catch (error) {
      console.error("Error updating quantity:", error);
      fetchCartItems(); // Revert on failure
    }
  };

  // API ENDPOINT: Remove Item
  const handleRemoveItem = async (id: string) => {
    try {
      setCartItems((prev) => prev.filter((item) => item.id !== id));

      // await fetch(`https://api.yourdomain.com/cart/${id}`, {
      //   method: "DELETE",
      // });
    } catch (error) {
      console.error("Error removing item:", error);
      fetchCartItems();
    }
  };

  // API ENDPOINT: Checkout
  const handleCheckout = async () => {
    try {
      setIsUpdating(true);
      // const response = await fetch("https://api.yourdomain.com/checkout", { method: "POST" });
      // if (response.ok) router.push("/checkout");
      Alert.alert("Success", "Proceeding to checkout...");
    } catch (error) {
      console.error("Error during checkout:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Calculations
  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const vat = subTotal * vatRate;
  const grandTotal = subTotal > 0 ? subTotal + vat + shippingFee : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Cart</Text>
      
      </View>

      {cartItems.length === 0 ? (
        /* Empty Cart State */
        <View style={styles.emptyContainer}>
          <ShoppingCart size={80} color="#D1D5DB" strokeWidth={1.2} />
          <Text style={styles.emptyTitle}>Your Cart Is Empty!</Text>
          <Text style={styles.emptySubtitle}>
            When you add products, they’ll appear here.
          </Text>
        </View>
      ) : (
        /* Cart List & Summary */
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Cart Items List */}
            <View style={styles.itemsList}>
              {cartItems.map((item) => (
                <View key={item.id} style={styles.card}>
                  <Image source={{ uri: item.image }} style={styles.cardImage} />

                  <View style={styles.cardDetails}>
                    <View style={styles.cardHeaderRow}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <TouchableOpacity onPress={() => handleRemoveItem(item.id)}>
                        <Trash2 size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>

                    <Text style={styles.itemSize}>Size {item.size}</Text>

                    <View style={styles.cardFooterRow}>
                      <Text style={styles.itemPrice}>
                        $ {item.price.toLocaleString()}
                      </Text>

                      {/* Quantity Controls */}
                      <View style={styles.quantityControls}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={14} color="#111827" />
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={14} color="#111827" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Bill Summary */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sub-total</Text>
                <Text style={styles.summaryValue}>$ {subTotal.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>VAT (%)</Text>
                <Text style={styles.summaryValue}>$ {vat.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping fee</Text>
                <Text style={styles.summaryValue}>$ {shippingFee.toFixed(2)}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>$ {grandTotal.toLocaleString()}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Checkout Button */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.checkoutBtn}
              activeOpacity={0.8}
              onPress={handleCheckout}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Text style={styles.checkoutBtnText}>Go To Checkout</Text>
                  <ArrowRight size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

interface Styles {
  container: ViewStyle;
  loadingContainer: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  iconButton: ViewStyle;
  scrollContent: ViewStyle;
  emptyContainer: ViewStyle;
  emptyTitle: TextStyle;
  emptySubtitle: TextStyle;
  itemsList: ViewStyle;
  card: ViewStyle;
  cardImage: ImageStyle;
  cardDetails: ViewStyle;
  cardHeaderRow: ViewStyle;
  itemTitle: TextStyle;
  itemSize: TextStyle;
  cardFooterRow: ViewStyle;
  itemPrice: TextStyle;
  quantityControls: ViewStyle;
  qtyBtn: ViewStyle;
  qtyText: TextStyle;
  summaryContainer: ViewStyle;
  summaryRow: ViewStyle;
  summaryLabel: TextStyle;
  summaryValue: TextStyle;
  divider: ViewStyle;
  totalLabel: TextStyle;
  totalValue: TextStyle;
  bottomBar: ViewStyle;
  checkoutBtn: ViewStyle;
  checkoutBtnText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
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
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  iconButton: {
    padding: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  /* Empty State */
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 22,
  },
  /* Cart List */
  itemsList: {
    gap: 16,
    marginTop: 12,
    marginBottom: 24,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 12,
    gap: 12,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  cardDetails: {
    flex: 1,
    justifyContent: "space-between",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  itemSize: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: -4,
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  /* Summary */
  summaryContainer: {
    gap: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 15,
    color: "#9CA3AF",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  /* Bottom Checkout */
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  checkoutBtn: {
    height: 56,
    backgroundColor: "#18181B",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  checkoutBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});