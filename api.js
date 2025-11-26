import axios from 'axios'

const api = {
    get: async (url, params = {}) => {
        try {
            const response = await axios.get(url, { params })
            return response.data
        } catch (error) {
            console.error('API Error:', error.message)
            return null
        }
    },

    post: async (url, data = {}) => {
        try {
            const response = await axios.post(url, data)
            return response.data
        } catch (error) {
            console.error('API Error:', error.message)
            return null
        }
    },

    download: async (url) => {
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' })
            return Buffer.from(response.data)
        } catch (error) {
            console.error('Download Error:', error.message)
            return null
        }
    }
}

export default api
