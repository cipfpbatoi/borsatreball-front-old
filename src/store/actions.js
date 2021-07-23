import API from '@/service/API';

export default {
    login(context, user) {
        return new Promise((resolve, reject) => {
            API.users.login(user)
                .then((response) => {
                    context.commit('loginUser', response.data.data)
                    context.dispatch('getTable', {table: 'menu'})
                    resolve(true)
                })
                .catch((err) => {
                    reject(err)
                })
        })
    },
    getTable({ commit }, {table, params}) {
        let query = ''
        if (params) {
            query = Object.entries(params)
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join('&');
        }
        API.table.getAll(table, query)
            .then((response) => commit('setTable', {
                table,
                data: response.data.data
            }))
            .catch((err) => commit('setError', err))
    },
    saveItemToTable({ commit }, { table, item }) {
        return new Promise((resolve, reject) => {
            if (item.id) {
                API.table.modifyItem(table, item)
                    .then((response) => {
                        commit('modifyItem', {
                            table,
                            data: response.data.data
                        })
                        resolve(response.data.data)
                    })
                    .catch((err) => reject(err))
            } else {
                API.table.addItem(table, item)
                    .then((response) => {
                        commit('addItem', {
                            table,
                            data: response.data.data
                        })
                        resolve(response.data.data)
                    })
                    .catch((err) => reject(err))
            }
        })
    },
    delItemFromTable({ commit }, { table, id }) {
        API.table.delItem(table, id)
            .then((response) => commit('delItem', {
                table,
                id: response.data.data.id,
            }))
            .catch((err) => commit('setError', err))
    },
    changeAlumnoValidity({ commit }, payload) {
        API.alumns.changeValidity(payload)
            .then((response) => commit('modifyItem', {
                table: 'alumnos',
                data: response.data.data
            }))
            .catch((err) => commit('setError', err))
    },
    changeAlumnoInterest({ commit }, payload) {
        API.alumns.changeInterest(payload)
            .then((response) => commit('modifyItem', {
                table: 'alumnos',
                data: response.data.data
            }))
            .catch((err) => commit('setError', err))
    },
    changeOfertaValidity({ commit }, payload) {
        API.ofertas.changeValidity(payload)
            .then((response) => commit('modifyItem', {
                table: 'ofertas',
                data: response.data.data
            }))
            .catch((err) => commit('setError', err))
    },
}