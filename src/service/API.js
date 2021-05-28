import axios from 'axios'
import store from '@/store'

const API_URL = process.env.VUE_APP_API
const DEBUG = true

const users = {
    login: (item) => axios.post(`${API_URL}/auth/login`, item),
    register: (user) => axios.post(`${API_URL}/auth/signup`, user),
    checkEmailAvailable: (email) => axios.get(`${API_URL}/users/${email}/available`),
}

const alumns = {
    changeValidity: (payload) => axios.put(`${API_URL}/alumnos/${payload.id_alumno}/ciclo/${payload.id_ciclo}`,
        {
            'any': payload.any,
            'validado': payload.validado
        }),
}

const table = {
    getAll: (table) => axios.get(`${API_URL}/${table}`),
    addItem: (table, item) => axios.post(`${API_URL}/${table}`, item),
    modifyItem: (table, item) => axios.put(`${API_URL}/${table}/${item.id}`, item),
    delItem: (table, id) => axios.delete(`${API_URL}/${table}/${id}`),
}

axios.interceptors.request.use((config) => {
    if (DEBUG) {
        console.info('Request: ', config)
    }

    const token = store.state.user.access_token
    if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
    }
    return config;
}, (error) => {
    if (DEBUG) {
        console.error('Request error: ', error)
    }
    return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
    if (DEBUG) {
        console.info('Response: ', response)
    }
    return response
}, (error) => {
    if (error.response) {
        console.error('Response error ' + error.response.status + ' (' + error.response.statusText + ')')
    }
    if (DEBUG) {
        console.info('Response error: ', error)
    }
    return Promise.reject(error)
})

export default {
    users,
    alumns,
    table,
};