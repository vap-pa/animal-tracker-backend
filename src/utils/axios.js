import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5006',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('accessToken');
        console.log('Request interceptor - Token:', token ? 'Present' : 'Missing');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('Request headers:', config.headers);
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => {
        console.log('Response received:', response.status, response.data);
        return response;
    },
    async (error) => {
        console.error('Response error:', error.response?.status, error.response?.data);
        
        // Handle authentication errors
        if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('Authentication error - redirecting to login');
            sessionStorage.removeItem('accessToken');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api; 