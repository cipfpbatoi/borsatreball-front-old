export default {
    title: "Borsa de treball",
    helpPage: '/',
    center: process.env.VUE_APP_CENTER,
    user: {
        name: '',
        rol: 99,
    },
    errors: [],
    ciclos: [],
    ciclosCategorized: [],
    departamentos: [],
    ofertas: [],
    'ofertas-arxiu': [],
    alumnos: [],
    empresas: [],
    responsables: [
        {
            id: 1,
            nombre: 'Juan yo'
        }
    ],
    users: [],
    menu: [
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
    ],
}