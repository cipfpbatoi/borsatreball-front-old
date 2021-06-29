export default {
    setTitle(state, { title, helpPage }) {
        state.title = title
        state.helpPage = helpPage
    },
    loginUser(state, user) {
        state.user = user
        localStorage.user = JSON.stringify(user)
    },
    logoutUser(state) {
        state.user = {}
        localStorage.removeItem('user')
        state.menu = [
            {
                "icon": "mdi-login",
                "text": "Iniciar sessió",
                "path": "/login",
            },
            {
                "icon": "mdi-account-plus-outline",
                "text": "Crear nou compte",
                "path": "/register",
            }
        ]
    },
    setTable(state, { table, data }) {
        state[table] = data
        if (table === 'ciclos') {
            // Hay que contruir el array de Departamentos
            // y de CiclosCategorized (por departamento)
            const ciclosCategorized = {}
            const departamentos = []
            data.forEach(element => {
                if (!ciclosCategorized[element.vDept]) {
                    ciclosCategorized[element.vDept] = []
                    departamentos.push({
                        cod: element.Dept,
                        nombre: element.vDept
                    })
                }
                ciclosCategorized[element.vDept].push(element)
            });
            for (let dept in ciclosCategorized) {
                if (state.ciclosCategorized.length) {
                    state.ciclosCategorized.push({ divider: true })
                }
                state.ciclosCategorized.push({ header: dept })
                ciclosCategorized[dept].forEach(element =>
                    state.ciclosCategorized.push(element))
            }
            state.departamentos = departamentos
        }
    },
    addItem(state, { table, data }) {
        state[table].push(data)
    },
    modifyItem(state, { table, data }) {
        const index = state[table].findIndex(
            (element) => element.id === data.id
        )
        if (index >= 0) state[table].splice(index, 1, data)
    },
    delItem(state, { table, id }) {
        const index = state[table].findIndex(
            (item) => item.id === Number(id)
        )
        if (index >= 0) state[table].splice(index, 1)
    },
    setError(state, error) {
        let msg = ''
        if (error.response) {
            msg = `Error ${error.response.status}: ${error.response.data.message}`
            const errors = error.response.data.errors
            if (errors) {
                if (typeof errors === 'object') {
                    for (let field in errors) {
                        msg += ' (Field "' + field + '": ' + errors[field][0] + ')'
                    }
                } else {
                    msg += ' - ' + errors
                }
            } else {
                msg = error.response.data.message || error.response.data
            }
        } else if (error.status) {
            msg = `Error ${error.status}: ${error.message}`
        } else {
            msg = error.message || error
        }
        state.errors.push({
            show: true,
            type: error.type || 'error',
            msg
        })
    },
}