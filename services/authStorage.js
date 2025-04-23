import EncryptedStorage from 'react-native-encrypted-storage';

// Save the token securely
export const storeAuthToken = async (token) => {
  try {
    await EncryptedStorage.setItem('authToken', token);
    console.log('Token stored securely!');
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

// Get the stored token securely
export const getAuthToken = async () => {
  try {
    const token = await EncryptedStorage.getItem('authToken');
    if (token) {
      return token;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Remove the stored token (e.g., during logout)
export const removeAuthToken = async () => {
  try {
    await EncryptedStorage.removeItem('authToken');
    console.log('Token removed!');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};