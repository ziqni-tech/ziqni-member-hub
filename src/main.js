import { createApp } from 'vue';
import App from './App.vue';
import store from './store';

import CoreuiVue from '@coreui/vue';

import index from './router';
import AppLayout from './layouts/AppLayout';
import './assets/scss/main.scss';


createApp({
            extends: App,
          })
  .use(index)
  .use(CoreuiVue)
  .use(store)
  .component('AppLayout', AppLayout)
  .mount('#app');

