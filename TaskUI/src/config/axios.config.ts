import axios from 'axios';
import { decodeToken } from 'react-jwt';
import { environment } from '../environments/environment';


const API = axios.create({
	baseURL: environment.APP_API_URL
});


const getBearerToken = async () => {
  try {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) return null;

    const parsed = JSON.parse(storedUser); // 👈 parse JSON string
    const token = parsed.token; // 👈 extract token

    if (!token) return null;

    const decodedToken: any = decodeToken(token);
    if (decodedToken) {
      // Check expiration
      const expirationTime = new Date(decodedToken.exp * 1000);
      const currentTime = new Date();
      const timeDifferenceInSeconds =
        (expirationTime.getTime() - currentTime.getTime()) / 1000;

      if (timeDifferenceInSeconds > 0) {
        return token; // ✅ return valid token
      } else {
        console.warn('Token expired');
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error in getting bearer token:', error);
    return null;
  }
};

API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      window.location.href = '/401';
    } else if (error?.response?.status === 403) {
      window.location.href = '/403';
    }
    return Promise.reject(error);
  }
);

API.interceptors.request.use(
  async (config: any) => {
    const token = await getBearerToken(); // this should return the raw JWT string
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}` // ✅ proper formatting
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default API;
