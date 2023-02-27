import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import store from './store';

import CoreuiVue from '@coreui/vue';

import AppLayout from './layouts/AppLayout';
import './assets/scss/main.scss';
import VNetworkGraph from 'v-network-graph';
import 'v-network-graph/lib/style.css';



createApp({
            extends: App,
          })
  .use(router)
  .use(CoreuiVue)
  .use(VNetworkGraph)
  .use(store)
  .component('AppLayout', AppLayout)
  .mount('#app');

