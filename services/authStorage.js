import * as SecureStore from 'expo-secure-store';

export const storeAuthToken = async (token) => {
  try {
    await SecureStore.setItemAsync('authToken', token);
    console.log('Token stored securely!');
  } catch (error) {
    console.error('Error storing token:', error);
  }
};

export const getAuthToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    return token || null;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

export const removeAuthToken = async () => {
  try {
    await SecureStore.deleteItemAsync('authToken');
    console.log('Token removed!');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};