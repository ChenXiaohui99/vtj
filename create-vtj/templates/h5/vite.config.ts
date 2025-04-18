import { createViteConfig } from '@vtj/cli';
import { createDevTools } from '@vtj/pro/vite';
import proxy from './proxy.config';
export default createViteConfig({
  proxy,
  plugins: [createDevTools()]
});
