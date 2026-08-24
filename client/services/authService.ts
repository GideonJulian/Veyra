// Replace these dummy calls with your real API endpoint requests (axios or fetch)

export const signUpUser = async (data: { fullName?: string; email: string; password: string }) => {
  // Example: const response = await fetch('YOUR_API_URL/signup', { method: 'POST', body: JSON.stringify(data) });
  console.log("Signing up with:", data);
  return { success: true };
};

export const loginUser = async (data: { email: string; password: string }) => {
  // Example: const response = await fetch('YOUR_API_URL/login', { method: 'POST', body: JSON.stringify(data) });
  console.log("Logging in with:", data);
  return { success: true };
};