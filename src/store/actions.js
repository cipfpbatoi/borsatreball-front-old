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
        API.table.getAll(table)
        .then((response) => commit('setTable', {
            table, 
            data: response.data.data
        }))
        .catch((err) =>  commit('setError', err))
    },
    saveItemToTable({ commit }, { table, item }) {
        if (item.id) {
            API.table.modifyItem(table, item)
            .then((response) => {
                commit('modifyItem', {
                table, 
                data: response.data.data
            })})
            .catch((err) =>  commit('setError', err))    
        } else {
            API.table.addItem(table, item)
            .then((response) => commit('addItem', {
                table, 
                data: response.data.data
            }))
            .catch((err) =>  commit('setError', err))    
        }
    },
    delItemFromTable({ commit }, { table, id }) {
        API.table.delItem(table, id)
        .then((response) => commit('delItem', {
            table, 
            id: response.data.data.id,
        }))
        .catch((err) =>  commit('setError', err))
    },
    changeValidity({ commit }, payload) {
        API.alumns.changeValidity(payload)
        .then((response) => commit('changeAlumn', response.data.data))
        .catch((err) =>  commit('setError', err))

    }

}