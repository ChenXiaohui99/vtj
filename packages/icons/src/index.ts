import './style.scss';
import { App } from 'vue';
import { glyphs } from './iconfont/iconfont.json';
import * as svgIcons from './components';
import * as Icons from './icons';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
export * from './components';
export * from './icons';

export interface Icon {
  label: string;
  value: string;
  unicode: string;
}

const icons: Icon[] = glyphs.map((item) => {
  return {
    label: item.name,
    value: `vtj-icon-${item.font_class}`,
    unicode: item.unicode
  };
});

const components: Record<string, any> = {
  ...ElementPlusIconsVue,
  ...svgIcons,
  ...Icons
};

const install = (app: App) => {
  for (const [key, component] of Object.entries(components)) {
    app.component(key, component as any);
  }
};

export { icons, components, install };
