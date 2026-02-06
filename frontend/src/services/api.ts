import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error', error)
    return Promise.reject(error)
  },
)

export default api
