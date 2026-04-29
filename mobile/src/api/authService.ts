import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    if (response.data?.data?.token) {
      await AsyncStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },
  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    if (response.data?.data?.token) {
      await AsyncStorage.setItem('token', response.data.data.token);
    }
    return response.data;
  },
  logout: async () => {
    await AsyncStorage.removeItem('token');
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};
