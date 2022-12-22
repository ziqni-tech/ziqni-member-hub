import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import store from './store';

import CoreuiVue from '@coreui/vue';

import AppLayout from './layouts/AppLayout';
import './assets/scss/main.scss';


createApp({
            extends: App,
          })
  .use(router)
  .use(CoreuiVue)
  .use(store)
  .component('AppLayout', AppLayout)
  .mount('#app');

