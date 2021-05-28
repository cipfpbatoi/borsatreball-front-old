import state from '@/store/state'

const ROL_ADMINISTRADOR = 2
const ROL_RESPONSABLE = 3
const ROL_EMPLEADOR = 5
const ROL_TRABAJADOR = 7

class Rol {
    static getAllRoles(){
        return [
            {
                id: ROL_ADMINISTRADOR,
                rol: 'Administrador'
            }, {
                id: ROL_RESPONSABLE,
                rol: 'Responsable'
            }, {
                id: ROL_EMPLEADOR,
                rol: 'Empleador'
            }, {
                id: ROL_TRABAJADOR,
                rol: 'Alumne'
            }    
        ]
    }
    static getRoles(cod) {
        if (!cod) return []
        return this.getAllRoles().filter(rol => !(cod % rol.id))
    }
    static imAdmin(rol = state.user.rol) {
        return rol === ROL_ADMINISTRADOR
    }
    static imResponsable(rol = state.user.rol) {
        return (rol === ROL_ADMINISTRADOR || rol === ROL_RESPONSABLE)
    }
    static imEmpresa(rol = state.user.rol) {
        return rol === ROL_EMPLEADOR
    }
    static imAlumno(rol = state.user.rol) {
        return rol === ROL_TRABAJADOR
    }
}

export default Rol
