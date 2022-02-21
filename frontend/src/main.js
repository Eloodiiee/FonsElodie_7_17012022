import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import Axios from 'axios' //Librairie JS


//Adresse d'envoi des requêtes
Axios.defaults.baseURL = "http://localhost:3000/api"
//Pour éviter d'importer Axios à chaque fois, il est gardé dans le stockage prototype de Vue
Vue.prototype.$axios = Axios


new Vue ({
    router, 
    render: h=> h(App)
})

.$mount("#app")