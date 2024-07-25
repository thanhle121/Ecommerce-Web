// src/axiosInstance.ts
import axios from 'axios';

// Tạo instance của axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8070',
  timeout: 10000, // thời gian chờ yêu cầu, có thể tùy chỉnh
});

// Thêm request interceptor
axiosInstance.interceptors.request.use(
  function (config) {
    // Làm gì đó trước khi gửi request
    const token = localStorage.getItem('accessToken'); // Ví dụ: lấy token từ localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    // Làm gì đó với lỗi request
    return Promise.reject(error);
  }
);

// Thêm response interceptor
axiosInstance.interceptors.response.use(
  function (response) {
    // Làm gì đó với dữ liệu phản hồi
    return response;
  },
  function (error) {
    // Làm gì đó với lỗi phản hồi
    if (error.response.status === 401) {
      // Ví dụ: chuyển hướng đến trang đăng nhập nếu không xác thực
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
