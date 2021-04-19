export default {
    loginUser(state, user) {
        state.user = user
        localStorage.token = user.access_token
    },
    logoutUser(state) {
        state.user = {}
        localStorage.removeItem('token')
    },
    setMenu(state, menu) {
        state.menu = menu
    },
    setCiclos(state, ciclos) {
        state.ciclos = ciclos
    },
    setError(state, error, type) {
        let msg = ''
        if (error.response) {
            msg = `Response error ${error.response.status} (${error.response.statusText})`
        } else if (error.status) {
            msg = `Error ${error.status} (${error.statusText}): ${error.message}`
        } else {
            msg = error
        }
        state.errors.push({
            show: true,
            type: type || 'error',
            msg
        })
    }
}