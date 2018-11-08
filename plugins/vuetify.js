import Vue from 'vue'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: '#6b80ca',
    secondary: colors.amber.darken3,
    accent: colors.grey.darken3,
    success: '#43b581',
    info: '#6b80ca',
    warning: '#faa61a',
    error: '#f04747'
  }
})
