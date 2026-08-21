import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';

const { height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(tabs)/discover');
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      router.replace('/(tabs)/discover');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        {/* Wavy lines background vector behind text */}
        <Image
          source={require('../../assets/images/wave2.png')}
          style={styles.wavePattern}
          resizeMode="contain"
        />

        {/* Dynamic Display Title */}
        <Text style={styles.title}>
          Define{'\n'}yourself in{'\n'}your unique{'\n'}way.
        </Text>
      </View>

      <View style={styles.imageSection}>
        <Image
          source={require('../../assets/images/onboarding.png')}
          style={styles.characterImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <ArrowRight color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topSection: {
    paddingHorizontal: 24,
    paddingTop: 32,
    position: 'relative',
    zIndex: 2,
  },
  wavePattern: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    width: '100%',
    height: 180,
    opacity: 0.15,
  },
  title: {
    fontSize: 52,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 49,
    letterSpacing: -1.5,

    
  },
  imageSection: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: -20,
  },
  characterImage: {
    width: '100%',
    height: height * .63,
  },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  button: {
    height: 56,
    backgroundColor: '#18181B',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});