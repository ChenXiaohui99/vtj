import { createApp } from 'vue';
import { createProvider, LocalService } from '@vtj/web';
import router from './router';
import App from './App.vue';
import './style/index.scss';
const modules = import.meta.glob([
  '/.vtj/*.json',
  '/.vtj/files/*.json',
  '/.vtj/raw/*.vue'
]);
const app = createApp(App);
const service = new LocalService();
const { provider, onReady } = createProvider({
  service,
  modules,
  router,
  dependencies: {
    Vue: () => import('vue'),
    VueRouter: () => import('vue-router'),
    ElementPlus: () => import('element-plus')
  }
});

onReady(async () => {
  app.use(router);
  app.use(provider);
  app.mount('#app');
  console.log('VTJ provider', provider, modules);
});
