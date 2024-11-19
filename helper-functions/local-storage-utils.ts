import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeDataLocalStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value)); // Convert value to string
    console.log('Data saved successfully!');
  } catch (e) {
    console.error('Failed to save data:', e);
  }
};

export const getLocalStorageData = async key => {
  const value = await AsyncStorage.getItem(key);
  if (value !== null) {
    return JSON.parse(value); // Convert string back to JSON
  }
  return null;
};

export const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('Local storage cleared successfully!');
  } catch (e) {
    console.error('Failed to clear local storage:', e);
  }
};
