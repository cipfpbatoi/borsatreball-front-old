// import Rol from '@/service/Rol'

export default {
    getCicloById: (state) => (id) => {
        const ciclo = state.ciclos.find((item) => item.id === id)
        return (ciclo ? ciclo : {})
    },
    getEmpresaById: (state) => (id) => {
        const empresa = state.empresas.find((item) => item.id === id)
        return (empresa ? empresa : {})
    },
    getOfertasByEmpresa: (state) => (id) => {
        return state.ofertas.filter((item) => item.id_empresa === Number(id))
    },
    nomDept: (state) => (cod) => {
        return state.departamentos.find((item) => item.cod === cod).nombre
    },
    getUser: state => {
         return state.user
    },
    // imAdmin: state => {
    //     return state.user.rol == CONSTANTS.ROL_ADMINISTRADOR
    // },
    // imResponsable: state => {
    //     return state.user.rol <= CONSTANTS.ROL_RESPONSABLE
    // },
    // imEmpresa: state => {
    //     return state.user.rol == CONSTANTS.ROL_EMPLEADOR
    // },
    // imAlumno: state => {
    //     return state.user.rol == CONSTANTS.ROL_TRABAJADOR
    // },
}