import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  Package,
  UserCheck,
  Home,
  CreditCard,
  HelpCircle,
  Headphones,
  LogOut,
  ChevronRight,
} from 'lucide-react-native';
import { logoutUser } from '../../../services/authService';

const AccountScreen = () => {
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logoutUser();
          router.replace('/login');
        },
      },
    ]);
  };

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
        <Text style={styles.headerTitle}>Account</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Orders */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/orders')}
          >
            <View style={styles.menuIcon}>
              <Package size={22} color="#111827" />
            </View>
            <Text style={styles.menuLabel}>My Orders</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Section 2: Account Settings */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[styles.menuItem, styles.borderBottom]}
            onPress={() => router.push('/details')}
          >
            <View style={styles.menuIcon}>
              <UserCheck size={22} color="#111827" />
            </View>
            <Text style={styles.menuLabel}>My Details</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.borderBottom]}
            onPress={() => router.push('/address-book')}
          >
            <View style={styles.menuIcon}>
              <Home size={22} color="#111827" />
            </View>
            <Text style={styles.menuLabel}>Address Book</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.borderBottom]}
            onPress={() => router.push('/')}
          >
            <View style={styles.menuIcon}>
              <CreditCard size={22} color="#111827" />
            </View>
            <Text style={styles.menuLabel}>Payment Methods</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/notifications')}
          >
            <View style={styles.menuIcon}>
              <Bell size={22} color="#111827" />
            </View>
            <Text style={styles.menuLabel}>Notifications</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Section 3: Support */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={[styles.menuItem, styles.borderBottom]}
            onPress={() => router.push('/faqs')}
          >
            <View style={styles.menuIcon}>
              <HelpCircle size={22} color="#111827" />
            </View>
            <Text style={styles.menuLabel}>FAQs</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/help-center')}
          >
            <View style={styles.menuIcon}>
              <Headphones size={22} color="#111827" />
            </View>
            <Text style={styles.menuLabel}>Help Center</Text>
            <ChevronRight size={18} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        {/* Section 4: Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuIcon}>
              <LogOut size={22} color="#ef4444" />
            </View>
            <Text style={[styles.menuLabel, { color: '#ef4444' }]}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountScreen;

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
    backgroundColor: '#ffffff',
  },
  headerBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  menuSection: {
    borderBottomWidth: 8,
    borderBottomColor: '#f4f5f7',
  },
  logoutSection: {
    backgroundColor: '#ffffff',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuIcon: {
    width: 24,
    height: 24,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
});