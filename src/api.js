import axios from 'axios';

export const API_SECRET = process.env.REACT_APP_API_SECRET

const API = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 10000,
});
export default API