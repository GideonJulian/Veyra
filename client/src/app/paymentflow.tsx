import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ListRenderItem,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// -----------------------------------------------------------------------------
// TYPES & INTERFACES
// -----------------------------------------------------------------------------
export interface CardItem {
  id: string;
  brand: 'VISA' | 'MASTERCARD' | string;
  last4: string;
  isDefault: boolean;
}

export type ScreenState = 'list' | 'add';

export interface AddCardPayload {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
}

export interface SelectedCardPayload {
  cardId: string;
}

export default function PaymentFlow(): React.JSX.Element {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('list');

  // Payment Data State
  const [cards, setCards] = useState<CardItem[]>([
    { id: '1', brand: 'VISA', last4: '2512', isDefault: true },
    { id: '2', brand: 'MASTERCARD', last4: '5421', isDefault: false },
    { id: '3', brand: 'VISA', last4: '2512', isDefault: false },
  ]);
  const [selectedCardId, setSelectedCardId] = useState<string>('1');

  // Form Inputs State
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');

  // UI Flow States
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // API PLACEHOLDERS
  // ---------------------------------------------------------------------------
  const handleApplyPayment = async (): Promise<void> => {
    try {
      const payload: SelectedCardPayload = { cardId: selectedCardId };
      // TODO: Call your API to set selected payment method
      // await api.setSelectedCard(payload);
      console.log('Applied Card Payload:', payload);
    } catch (error) {
      console.error('Failed to apply card', error);
    }
  };

  const handleAddCardSubmit = async (): Promise<void> => {
    if (!cardNumber || !expiryDate || !cvc) return;

    setIsLoading(true);
    try {
      const payload: AddCardPayload = { cardNumber, expiryDate, cvc };
      // TODO: Call your API to tokenize / save card
      // const response = await api.addCard(payload);
      console.log('Submitted Payload:', payload);

      // Simulating API Latency
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newCard: CardItem = {
        id: Date.now().toString(),
        brand: 'VISA',
        last4: cardNumber.slice(-4) || '0000',
        isDefault: cards.length === 0,
      };

      setCards((prev) => [...prev, newCard]);
      if (cards.length === 0) setSelectedCardId(newCard.id);

      // Reset form & show modal
      setCardNumber('');
      setExpiryDate('');
      setCvc('');
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error adding card', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalThanks = (): void => {
    setShowSuccessModal(false);
    setCurrentScreen('list');
  };

 
  // RENDER ITEM FOR FLATLIST
 
  const renderCardItem: ListRenderItem<CardItem> = ({ item }) => {
    const isSelected = item.id === selectedCardId;

    return (
      <TouchableOpacity
        style={styles.cardItem}
        onPress={() => setSelectedCardId(item.id)}
        activeOpacity={0.8}
      >
        <View style={styles.cardInfo}>
          <Text style={styles.cardBrand}>{item.brand}</Text>
          <Text style={styles.cardMask}>•••• •••• •••• {item.last4}</Text>
          {item.isDefault && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>Default</Text>
            </View>
          )}
        </View>
        <Ionicons
          name={isSelected ? 'radio-button-on' : 'radio-button-off'}
          size={22}
          color={isSelected ? '#000' : '#C4C4C4'}
        />
      </TouchableOpacity>
    );
  };

  // ---------------------------------------------------------------------------
  // RENDER SCREEN 1: PAYMENT METHOD LIST
  // ---------------------------------------------------------------------------
  if (currentScreen === 'list') {
    const isEmpty = cards.length === 0;

    return (
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <View style={[styles.content, isEmpty && styles.emptyContent]}>
          {!isEmpty && <Text style={styles.sectionTitle}>Saved Cards</Text>}

          {isEmpty ? (
            /* Empty State Center Card Button */
            <TouchableOpacity
              style={styles.addCardBtn}
              onPress={() => setCurrentScreen('add')}
            >
              <Ionicons name="add" size={22} color="#000" />
              <Text style={styles.addCardText}>Add New Card</Text>
            </TouchableOpacity>
          ) : (
            /* Populated State List */
            <FlatList
              data={cards}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              renderItem={renderCardItem}
              ListFooterComponent={
                <TouchableOpacity
                  style={styles.addCardBtn}
                  onPress={() => setCurrentScreen('add')}
                >
                  <Ionicons name="add" size={22} color="#000" />
                  <Text style={styles.addCardText}>Add New Card</Text>
                </TouchableOpacity>
              }
            />
          )}
        </View>

        {/* Bottom Apply Action (Hidden if list is empty) */}
        {!isEmpty && (
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.primaryBtn} onPress={handleApplyPayment}>
              <Text style={styles.primaryBtnText}>Apply</Text>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER SCREEN 2: ADD NEW CARD
  // ---------------------------------------------------------------------------
  const isFormValid = cardNumber.length >= 12 && expiryDate.length >= 4 && cvc.length >= 3;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setCurrentScreen('list')}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Card</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Add Debit or Credit Card</Text>

          {/* Card Number Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Card number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your card number"
              placeholderTextColor="#A0A0A0"
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={setCardNumber}
              maxLength={19}
            />
          </View>

          {/* Expiry & CVC Row */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                placeholderTextColor="#A0A0A0"
                keyboardType="number-pad"
                value={expiryDate}
                onChangeText={setExpiryDate}
                maxLength={5}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Security Code</Text>
              <View style={styles.inputWithIcon}>
                <TextInput
                  style={[styles.input, { flex: 1, borderWidth: 0 }]}
                  placeholder="CVC"
                  placeholderTextColor="#A0A0A0"
                  keyboardType="number-pad"
                  secureTextEntry
                  value={cvc}
                  onChangeText={setCvc}
                  maxLength={4}
                />
                <Ionicons name="help-circle-outline" size={20} color="#888" />
              </View>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              isFormValid ? styles.submitBtnActive : styles.submitBtnDisabled,
            ]}
            disabled={!isFormValid || isLoading}
            onPress={handleAddCardSubmit}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text
                style={[
                  styles.submitBtnText,
                  isFormValid ? styles.submitBtnTextActive : styles.submitBtnTextDisabled,
                ]}
              >
                Add Card
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Success Modal */}
        <Modal
          visible={showSuccessModal}
          transparent
          animationType="fade"
          onRequestClose={handleModalThanks}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.successIconWrapper}>
                <Ionicons name="checkmark-sharp" size={32} color="#10B981" />
              </View>
              <Text style={styles.modalTitle}>Congratulations!</Text>
              <Text style={styles.modalSubtitle}>
                Your new card has been added.
              </Text>

              <TouchableOpacity
                style={styles.modalBtn}
                onPress={handleModalThanks}
              >
                <Text style={styles.modalBtnText}>Thanks</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// STYLES
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  iconBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  emptyContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardBrand: {
    fontWeight: '800',
    fontSize: 14,
    marginRight: 10,
    color: '#000000',
  },
  cardMask: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '600',
  },
  defaultBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  defaultText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
  addCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginTop: 4,
    width: '100%',
  },
  addCardText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 6,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  primaryBtn: {
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: '#000000',
  },
  row: {
    flexDirection: 'row',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingRight: 12,
  },
  submitBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitBtnDisabled: {
    backgroundColor: '#E5E7EB',
  },
  submitBtnActive: {
    backgroundColor: '#111111',
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  submitBtnTextDisabled: {
    color: '#9CA3AF',
  },
  submitBtnTextActive: {
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: '100%',
    padding: 24,
    alignItems: 'center',
  },
  successIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalBtn: {
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});