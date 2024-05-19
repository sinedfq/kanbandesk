import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  // Вы можете добавить другие настройки здесь
  // headers: {'Authorization': 'Bearer yourToken'}
});

export default axiosInstance;