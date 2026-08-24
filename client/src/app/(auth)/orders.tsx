import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Image,
  ListRenderItemInfo,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Bell, Star, Package, X } from 'lucide-react-native';

type TabType = 'Ongoing' | 'Completed';

interface OrderItem {
  id: string;
  title: string;
  size: string;
  price: string;
  status: 'Completed' | 'Ongoing' | 'In Transit' | 'Picked';
  image: string;
  rating?: string;
  tab: TabType;
}

const INITIAL_ORDERS: OrderItem[] = [
  {
    id: '1',
    title: 'Regular Fit Slogan',
    size: 'Size M',
    price: '$ 1,190',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&q=80',
    tab: 'Completed',
  },
  {
    id: '2',
    title: 'Regular Fit Polo',
    size: 'Size L',
    price: '$ 1,100',
    status: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1625910513413-4ec3583526f8?w=400&q=80',
    tab: 'Ongoing',
  },
  {
    id: '3',
    title: 'Regular Fit Black',
    size: 'Size L',
    price: '$ 1,690',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80',
    tab: 'Completed',
  },
  {
    id: '4',
    title: 'Regular Fit V-Neck',
    size: 'Size S',
    price: '$ 1,290',
    status: 'Ongoing',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=400&q=80',
    tab: 'Ongoing',
  },
  {
    id: '5',
    title: 'Regular Fit Pink',
    size: 'Size M',
    price: '$ 1,341',
    status: 'Completed',
    rating: '3.5/5',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=400&q=80',
    tab: 'Completed',
  },
];

export default function OrdersScreen() {
  const [activeTab, setActiveTab] = useState<TabType>('Ongoing');
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);

  // Review Modal State
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  const filteredOrders = orders.filter((order) => order.tab === activeTab);

  const openReviewModal = (item: OrderItem) => {
    setSelectedOrder(item);
    setSelectedRating(0);
    setReviewText('');
    setIsModalVisible(true);
  };

  const closeReviewModal = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const handleSubmitReview = () => {
    if (selectedOrder && selectedRating > 0) {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, rating: `${selectedRating}/5` }
            : order
        )
      );
    }
    closeReviewModal();
  };

  const renderActionButton = (item: OrderItem) => {
    if (activeTab === 'Ongoing' || item.status === 'Ongoing') {
      return (
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Track order</Text>
        </TouchableOpacity>
      );
    }

    if (item.rating) {
      return (
        <View style={styles.ratingBadge}>
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => openReviewModal(item)}
      >
        <Text style={styles.actionBtnText}>Leave Review</Text>
      </TouchableOpacity>
    );
  };

  const renderOrderItem = ({ item }: ListRenderItemInfo<OrderItem>) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.cardContent}>
        <View style={styles.cardTopRow}>
          <Text style={styles.productTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <View
            style={[
              styles.statusBadge,
              activeTab === 'Ongoing'
                ? styles.statusBadgeOngoing
                : styles.statusBadgeCompleted,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                activeTab === 'Ongoing'
                  ? styles.statusTextOngoing
                  : styles.statusTextCompleted,
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.sizeText}>{item.size}</Text>

        <View style={styles.cardBottomRow}>
          <Text style={styles.priceText}>{item.price}</Text>
          {renderActionButton(item)}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrapper}>
        <Package size={64} color="#9ca3af" strokeWidth={1.5} />
      </View>
      <Text style={styles.emptyTitle}>
        {activeTab === 'Ongoing'
          ? 'No Ongoing Orders!'
          : 'No Completed Orders!'}
      </Text>
      <Text style={styles.emptySubtitle}>
        {activeTab === 'Ongoing'
          ? 'You don’t have any ongoing orders at this time.'
          : 'You don’t have any completed orders yet.'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => router.back()}
        >
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
     
      </View>

      {/* Toggle Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Ongoing' && styles.activeTab]}
          onPress={() => setActiveTab('Ongoing')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Ongoing' && styles.activeTabText,
            ]}
          >
            Ongoing
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'Completed' && styles.activeTab]}
          onPress={() => setActiveTab('Completed')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Completed' && styles.activeTabText,
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Orders List / Empty State */}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrderItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          filteredOrders.length === 0
            ? styles.emptyListContainer
            : styles.listContainer
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Review Bottom Sheet Modal */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeReviewModal}
      >
        <TouchableWithoutFeedback onPress={closeReviewModal}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.modalContent}
              >
                {/* Drag Handle Indicator */}
                <View style={styles.dragHandle} />

                {/* Modal Header */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Leave a Review</Text>
                  <TouchableOpacity onPress={closeReviewModal}>
                    <X size={22} color="#111827" />
                  </TouchableOpacity>
                </View>

                {/* Section Title & Subtitle */}
                <Text style={styles.modalQuestion}>How was your order?</Text>
                <Text style={styles.modalSubtitle}>
                  Please give your rating and also your review.
                </Text>

                {/* Star Rating Selection */}
                <View style={styles.starRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setSelectedRating(star)}
                      activeOpacity={0.7}
                    >
                      <Star
                        size={32}
                        color="#f59e0b"
                        fill={star <= selectedRating ? '#f59e0b' : 'transparent'}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Review Text Input */}
                <TextInput
                  style={styles.textInput}
                  placeholder="Write your review..."
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  value={reviewText}
                  onChangeText={setReviewText}
                />

                {/* Submit Button */}
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={handleSubmitReview}
                >
                  <Text style={styles.submitBtnText}>Submit</Text>
                </TouchableOpacity>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 52,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 10,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#ffffff',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#111827',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  productImage: {
    width: 76,
    height: 84,
    borderRadius: 10,
    backgroundColor: '#f3f4f6',
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusBadgeCompleted: {
    backgroundColor: '#f0fdf4',
  },
  statusBadgeOngoing: {
    backgroundColor: '#eff6ff',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusTextCompleted: {
    color: '#16a34a',
  },
  statusTextOngoing: {
    color: '#2563eb',
  },
  sizeText: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  actionBtn: {
    backgroundColor: '#18181b',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  actionBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconWrapper: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
  },
  dragHandle: {
    width: 48,
    height: 5,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 14,
    padding: 14,
    height: 110,
    fontSize: 14,
    color: '#111827',
    marginBottom: 30,
  },
  submitBtn: {
    backgroundColor: '#18181b',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
  
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});