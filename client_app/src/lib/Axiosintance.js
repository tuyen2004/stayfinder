
import axios from 'axios';

const AxiosInstance = (contentType = 'application/json') => {
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    const axiosInstance = axios.create({
        baseURL: 'http://localhost:8000/'
    });

    axiosInstance.interceptors.request.use(
        async (config) => {
            config.headers = {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'Content-Type': contentType
            }
            return config;
        },
        err => Promise.reject(err)  
    );

    axiosInstance.interceptors.response.use(
        res => res.data,
        err => Promise.reject(err)
    );
    return axiosInstance;
};

export default AxiosInstance;


