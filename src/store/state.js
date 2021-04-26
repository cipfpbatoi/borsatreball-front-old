export default {
    title: "Borsa de treball",
    center: process.env.VUE_APP_CENTER,
    user: {
        name: '',
    },
    errors: [],
    ciclos: [],
    ofertas: [],
    menu: [
        {
            "id": 9,
            "order": 97,
            "icon": "mdi-login",
            "text": "Loguejar-te",
            "path": "/login",
            "rol": 9999,
            "parent": null,
            "model": 0,
            "active": 1,
            "comments": null,
            "icon_alt": null
        },
        {
            "id": 29,
            "order": 98,
            "icon": "mdi-account-plus-outline",
            "text": "Registrar-te",
            "path": "/register",
            "rol": 9999,
            "parent": null,
            "model": 0,
            "active": 1,
            "comments": null,
            "icon_alt": null
        }
    ]
}