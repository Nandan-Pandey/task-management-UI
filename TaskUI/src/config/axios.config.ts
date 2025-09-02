import { Modal } from 'antd';
import axios from 'axios';
import { decodeToken } from 'react-jwt';
import { environment } from '../environments/environment';
import { API_ENDPOINTS } from '../shared/api-endpoints';

const API = axios.create({
	baseURL: environment.APP_API_URL
});
let refreshTokenPromise: Promise<string> | null = null;
const refreshToken = async (): Promise<string> => {
	if (refreshTokenPromise === null) {
		refreshTokenPromise = (async (): Promise<string> => {
			const inputBody = {
				refToken: sessionStorage?.refreshToken,
				redirect_uri: environment.MS_REDIRECT_URL
			};

			try {
				const result = await axios.post(`${API_ENDPOINTS.APP_REFRESH_TOKEN}`, inputBody, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					}
				});

				if (result.status === 200) {
					sessionStorage.setItem('accessToken', result.data.data.access_token);
				

					return result.data.data.access_token;
				} else {
					sessionStorage.clear();
					throw new Error('Token refresh failed');
				}
			} catch (error: any) {
				if (error.response && error.response.data && error.response.data.code === 401) {
					sessionStorage.clear();
					Modal.warning({
						title: 'Your session has timed out!',
						content: `Please login again if necessary.`,
						onOk() {
							setTimeout(() => {
								window.location.href = '/';
							}, 100);
						}
					});
				}
				throw error;
			} finally {
				refreshTokenPromise = null;
			}
		})();
	}

	return refreshTokenPromise;
};

const getBearerToken = async () => {
	try {
		const token = sessionStorage.getItem('accessToken');
		const decodedToken: any = token ? decodeToken(token) : '';
		if (decodedToken) {
			// Calculate the expiration time difference in seconds
			const expirationTime = new Date(decodedToken.exp * 1000); // Convert `exp` from seconds to milliseconds
			const currentTime = new Date();

			const timeDifferenceInSeconds = (expirationTime.getTime() - currentTime.getTime()) / 1000;

			if (timeDifferenceInSeconds <= 0) {
				return refreshToken();
			} else {
				return token;
			}
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error in getting bearer token:', error);
		return error;
	}
};

API.interceptors.request.use(
	async (config: any) => {
		const token = await getBearerToken();
		if (token) {
			return {
				...config,
				headers: {
					...config.headers,
					Authorization: `Bearer ${token}`
				}
			};
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

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

export default API;
