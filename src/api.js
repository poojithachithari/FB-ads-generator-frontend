import axios from 'axios'

// In development, VITE_API_URL is unset so baseURL is '' (Vite proxy handles /api/...)
// In production (Netlify), VITE_API_URL=https://your-render-url.onrender.com
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ''
})

export default api
