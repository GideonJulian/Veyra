import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://172.20.10.3:5000/api/auth";
const TOKEN_KEY = "user_token";

export interface User {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  role: "customer" | "admin";
  profileImage?: string;
  createdAt?: string;
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

  // Save token permanently on successful signup
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

  // Save token permanently on successful login
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

  const response = await fetch(`${API_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    // If server rejects the token, clear local storage
    await clearAuthToken();
    throw new Error(result.message || "Session expired. Please log in again.");
  }

  return {
    success: true,
    token,
    user: result.user || result,
  };
};

// ============================
// LOGOUT
// ============================
export const logoutUser = async (): Promise<{ success: boolean }> => {
  try {
    const token = await getAuthToken();

    if (token) {
      await fetch(`${API_URL}/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.warn("Server logout notification failed, clearing local token...", error);
  } finally {
    // Always clear the token from AsyncStorage upon logging out
    await clearAuthToken();
  }

  return { success: true };
};