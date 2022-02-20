import Vue from 'vue'
import App from './App.vue'
import router from './router.js'
import Axios from 'axios' //Library JS
// import {BootstrapVue} from 'bootstrap-vue'
// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'

//where to send requests
Axios.defaults.baseURL = "http://localhost:3000/api"
//in order not to import Axios every time, to keep it in Vue proptotype storage
Vue.prototype.$axios = Axios
// Vue.use(BootstrapVue)


new Vue ({
    router, 
    render: h=> h(App)
})

.$mount("#app")