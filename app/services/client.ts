import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  responseType: 'json',
});

apiClient.interceptors.request.use(async function (config) {
  let token = await AsyncStorage.getItem('token'); //|| '';
  if (token == 'null' || token == null) {
    token = '';
    config.headers = {
      'Content-Type': 'application/json',
    };
  } else {
    config.headers = {
      authorization: token,
      'Content-Type': 'application/json',
    };
  }
  return config;
});
export { apiClient };
