import { createApp } from "vue";
import { createPinia } from "pinia";
import 'bootstrap/dist/js/bootstrap.min.js';
//import piniaPluginPersistedState from "pinia-plugin-persistedstate"

// Import Bootstrap and BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'


import "./assets/main.css";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);
const pinia = createPinia();
//pinia.use(piniaPluginPersistedState);
app.use(pinia);
app.use(router);

app.mount("#app");
