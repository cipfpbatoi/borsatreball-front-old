import API from '@/service/API';

export default {
    login(context, user) {
        return new Promise ((resolve, reject) => {
            API.users.login(user)
            .then((response) => {
                context.commit('loginUser', response.data)
                context.dispatch('getMenu')
                resolve(true)
            })
            .catch((err) => {
                context.commit('setError', err)
                reject(err)
            })
        })
    },
    getMenu({ commit }) {
        API.users.getMenu()
        .then((response) => commit('setMenu', response.data.data))
        .catch((err) =>  commit('setError', err))
    },
    getCiclos({ commit }) {
        API.ciclos.getAll()
        .then((response) => commit('setCiclos', response.data.data))
        .catch((err) =>  commit('setError', err))
    }
}