import axios from 'axios';
// import Cookies from 'js-cookie';

const authToken = localStorage.getItem('authToken');

export const axiosClient = axios.create({
    baseURL: 'http://localhost:8800/v1/api',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
    },
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 403) {
            localStorage.removeItem('authToken');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

