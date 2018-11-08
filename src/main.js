import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import Buefy from 'buefy'
import VueI18n from 'vue-i18n'

Vue.use(Buefy);
Vue.use(VueI18n);
Vue.config.productionTip = false;

const messages = {
    en: {
        navbar: {
            help: 'Help'
        }
    },
    ru:{
        navbar: {
            help: 'Помощь'
        }
    }
};
const i18n = new VueI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages,
});

new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
