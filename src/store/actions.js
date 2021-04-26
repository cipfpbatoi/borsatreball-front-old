import API from '@/service/API';

export default {
    login(context, user) {
        return new Promise ((resolve, reject) => {
            API.users.login(user)
            .then((response) => {
                context.commit('loginUser', response.data.data)
                context.dispatch('getTable', 'menu')
                resolve(true)
            })
            .catch((err) => {
                context.commit('setError', err)
                reject(err)
            })
        })
    },
    getTable({ commit }, table) {
        API[table].getAll()
        .then((response) => commit('setTable', {
            table, 
            data: response.data.data
        }))
        .catch((err) =>  commit('setError', err))
    }

}