import AsyncStorage from "@react-native-async-storage/async-storage";
// If you are using expo-secure-store instead, import SecureStore:
// import * as SecureStore from "expo-secure-store";

const API_URL = "http://172.20.10.3:5000/api/auth";
const TOKEN_KEY = "user_token";

export interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "customer" | "admin";
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: User;
}

// ============================
// TOKEN STORAGE HELPERS
// ============================
export const saveAuthToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return await AsyncStorage.getItem(TOKEN_KEY);
};

// Use this only when you want to permanently clear the token
export const clearAuthToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

// ============================
// SIGN UP
// ============================
export const signUpUser = async (data: {
  fullName?: string;
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Sign up failed");
  }

  // Auto-save token on signup if backend returns one
  if (result.token) {
    await saveAuthToken(result.token);
  }

  return result;
};

// ============================
// LOGIN
// ============================
export const loginUser = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed");
  }

  // Store token upon successful login
  if (result.token) {
    await saveAuthToken(result.token);
  }

  return result;
};

// ============================
// RE-LOGIN WITH STORED TOKEN
// ============================
export const reloginWithToken = async (): Promise<AuthResponse> => {
  const token = await getAuthToken();

  if (!token) {
    throw new Error("No saved token found.");
  }

  // Validate stored token against the backend /me endpoint
  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Session expired. Please log in again.");
  }

  return {
    success: true,
    token,
    user: result.user || result,
  };
};

// ============================
// LOGOUT (PRESERVES STORED TOKEN)
// ============================
export const logoutUser = async (): Promise<{ success: boolean }> => {
  try {
    const token = await getAuthToken();

    // Optional: Notify backend to end server session without removing client token
    if (token) {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }

    // Explicitly keeping the token in AsyncStorage
    return { success: true };
  } catch (error) {
    console.warn("Logout notification failed, proceeding locally", error);
    return { success: true };
  }
};