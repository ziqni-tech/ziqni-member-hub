import { createApp } from 'vue';
import App from './App.vue';
import store from './store'

import CoreuiVue from '@coreui/vue';

import index from './router';
import AppLayout from './layouts/AppLayout';


createApp({
    extends: App,
    // beforeCreate() { this.$store.commit('initialiseStore') }
})
    .use(index)
    .use(CoreuiVue)
    .component('AppLayout', AppLayout)
    // .use(store)
.mount('#app')

