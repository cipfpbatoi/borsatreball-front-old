import axios from 'axios'
import store from '@/store'
import router from '@/router'

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
    changeInterest: (payload) => axios.put(`${API_URL}/ofertas/${payload.id_oferta}/alumno`,
        {
            'id': payload.id_alumno,
            'interesado': payload.interesado
        }),
}

const ofertas = {
    changeValidity: (payload) => axios.put(`${API_URL}/ofertas/${payload.id_oferta}/validar`,
        {
            'validada': Number(payload.validada)
        }),
}

const table = {
    getAll: (table, params) => axios.get(`${API_URL}/${table}` + (params ? '?' + params : '')),
    getItem: (table, id) => axios.get(`${API_URL}/${table}/${id}`),
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
        if ((error.response.status === 401 && store.state.user.access_token)
            || error.response.status === 421 && /authenticated/.test(error.response.data.message)) {
            store.commit('logoutUser')
            error.response.data.errors = (error.response.status === 421)
                ? 'La teua sessió ha caducat. Has de tornar-te a loguejar'
                : 'Pàgina restringida. Has de loguejar-te'

            if (! /\/login/.test(router.currentRoute.path)) {
                router.replace({
                    path: 'login',
                    query: { redirect: router.currentRoute.path },
                })
            }
        }
    }
    if (DEBUG) {
        console.info('Response error: ', error)
    }
    return Promise.reject(error)
})

export default {
    users,
    alumns,
    ofertas,
    table,
};