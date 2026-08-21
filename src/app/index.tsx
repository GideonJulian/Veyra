import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Easing, Image, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

export default function Splash() {
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoFloat = useRef(new Animated.Value(0)).current;

  const footerOpacity = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimations();
    clearstorage();
    init();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),

      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),

      Animated.timing(progress, {
        toValue: 1,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoFloat, {
          toValue: -8,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoFloat, {
          toValue: 0,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const clearstorage = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage cleared successfully.");
    } catch (error) {
      console.error("Error clearing AsyncStorage:", error);
    }
  };

  const init = async () => {
    await new Promise((resolve) => setTimeout(resolve, 4000));

    try {
      const hasSeenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");

      if (!hasSeenOnboarding) {
        router.replace("/onboarding");
        return;
      }
      router.replace("/(tabs)/discover");
    } catch (err) {
      console.log(err);
      router.replace("/onboarding");
    }
  };

  return (
    <View style={styles.container}>
      {/* Curved background pattern in the top-right corner */}
      <Image
        source={require("../../assets/images/wave.png")}
        style={styles.waveBackground}
        resizeMode="contain"
      />

      {/* Main center logo */}
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              transform: [{ scale: logoScale }, { translateY: logoFloat }],
            },
          ]}
        >
          <Image
            source={require("../../assets/icons/splash.png")}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* Loading spinner indicator */}
      <Animated.View style={[styles.loaderContainer, { opacity: footerOpacity }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    justifyContent: "center",
    alignItems: "center",
  },
  waveBackground: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "40%",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoWrapper: {
    width: 140,
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    // iOS White Glow Shadow
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    // Android Shadow Elevation
    elevation: 12,
  },
  logoImage: {
    width: "100%",
    height: "100%",
    tintColor: "#FFFFFF",
  },
  loaderContainer: {
    position: "absolute",
    bottom: 80,
    alignItems: "center",
  },
});