import type { Plugin } from 'vue';
import { isFunction, isString } from '@vtj/utils';
import { HTML_TAGS, BUILD_IN_TAGS } from '../constants';
export function toString(value: any) {
  return isString(value) ? value : JSON.stringify(value);
}

export function adoptedStyleSheets(global: Window, id: string, css: string) {
  const CSSStyleSheet = (global as any).CSSStyleSheet;
  // chrome > 71 才支持 replaceSync
  if (CSSStyleSheet.prototype.replaceSync) {
    const styleSheet = new CSSStyleSheet();
    styleSheet.id = id;
    styleSheet.replaceSync(css);
    const doc: any = global.document;
    const adoptedStyleSheets = doc.adoptedStyleSheets;
    const sheets = Array.from(adoptedStyleSheets).filter(
      (n: any) => n.id !== id
    );
    doc.adoptedStyleSheets = [...sheets, styleSheet];
  } else {
    const doc = global.document;
    let styleSheet = doc.getElementById(id);
    if (styleSheet) {
      styleSheet.innerHTML = css;
    } else {
      styleSheet = doc.createElement('style');
      styleSheet.id = id;
      styleSheet.innerHTML = css;
      doc.head.appendChild(styleSheet);
    }
  }
}

export async function loadCss(id: string, url: string) {
  const css = await window
    .fetch(url)
    .then((res) => res.text())
    .catch(() => '');
  if (css) {
    adoptedStyleSheets(window, id, css);
  }
}

export function loadCssUrl(urls: string[], global: any = window) {
  const doc = global.document;
  const head = global.document.head;
  for (const url of urls) {
    const el = doc.getElementById(url);
    if (!el) {
      const link = doc.createElement('link');
      link.rel = 'stylesheet';
      link.id = url;
      link.href = url;
      head.appendChild(link);
    }
  }
}

export async function loadScriptUrl(
  urls: string[],
  library: string,
  global: any = window
) {
  const doc = global.document;
  const head = global.document.head;
  let module = global[library];
  if (module) return module.default || module;
  return new Promise((reslove, inject) => {
    for (const url of urls) {
      const el = doc.createElement('script');
      el.src = url;
      el.onload = () => {
        module = global[library];
        if (module) {
          reslove(module.default || module);
        } else {
          inject(null);
        }
      };
      el.onerror = (e: any) => {
        inject(e);
      };
      head.appendChild(el);
    }
  });
}

export function isVuePlugin(value: unknown): value is Plugin {
  return isFunction(value) || isFunction((value as any)?.install);
}

export function isBuiltInTag(tag: string) {
  return BUILD_IN_TAGS.includes(tag);
}

export function isNativeTag(tag: string) {
  return HTML_TAGS.includes(tag);
}
