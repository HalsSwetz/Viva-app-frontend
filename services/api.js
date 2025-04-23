import axios from 'axios';

const api = axios.create({
  baseURL: 'https://viva-api-server-8920686ec75a.herokuapp.com/', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;