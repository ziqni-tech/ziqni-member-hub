import { createApp } from 'vue';
import router from './router';
import App from './App.vue';
import store from './store';

import CoreuiVue from '@coreui/vue';

import AppLayout from './layouts/DashboardLayout';
import './assets/scss/main.scss';
import VNetworkGraph from 'v-network-graph';
import 'v-network-graph/lib/style.css';

const app = createApp(App);

app
  .use(router)
  .use(CoreuiVue)
  .use(VNetworkGraph)
  .use(store)
  .component('AppLayout', AppLayout);

app.mount('#app');

