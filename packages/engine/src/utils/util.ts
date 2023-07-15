import type {
  JSExpression,
  JSFunction,
  NodeModifiers,
  PropDataType,
  NodeDirectiveSchema,
  BlockSchema,
  ProjectSchema,
  ApiSchema
} from '../core';

import type { Block, Node } from '../models';
export {
  merge,
  camelCase,
  upperFirst,
  cloneDeep,
  isEqual,
  upperFirstCamelCase,
  uid,
  set,
  isPlainObject,
  lowerFirst,
  delay
} from '@vtj/utils';

export { toTypeString, toRawType } from '@vue/shared';

import { createApi, jsonp, camelCase } from '@vtj/utils';

import { BUILDIN_DIRECTIVES } from '../constants';
import { parseExpression } from './parser';

export function isFunction(fn: any): boolean {
  return typeof fn === 'function';
}

export function isJSExpression(data: any): data is JSExpression {
  return data && data.type === 'JSExpression';
}

export function isJSFunction(x: any): x is JSFunction {
  return typeof x === 'object' && x && x.type === 'JSFunction';
}

export function isObject(value: any): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isUndefined(value: any): boolean {
  return typeof value === 'undefined' || value === null;
}

export function omit<
  T extends Record<string, any>,
  K extends Record<string, any>
>(target: T, keys: string[]): K {
  const result: Record<string, any> = {};
  Object.keys(target).forEach((k) => {
    if (!keys.includes(k)) {
      result[k] = target[k];
    }
  });
  return result as K;
}

export function pick<
  T extends Record<string, any>,
  K extends Record<string, any>
>(target: T, keys: string[]): K {
  const result: Record<string, any> = {};
  Object.keys(target).forEach((k) => {
    if (keys.includes(k)) {
      result[k] = target[k];
    }
  });
  return result as K;
}

export function toString(value: any) {
  return typeof value === 'string' ? value : JSON.stringify(value);
}

export function getModifiers(
  modifiers: NodeModifiers = {},
  isToString: boolean = false
) {
  const keys = Object.keys(modifiers);
  return isToString ? keys.map((n) => '.' + n) : keys;
}

export function toTsType(type: PropDataType | PropDataType[]) {
  if (Array.isArray(type)) return 'any';
  if (type === 'Object') {
    return 'Record<string, any>';
  } else if (type === 'Array') {
    return 'any[]';
  } else {
    return type.toLowerCase();
  }
}

export function getDiretives(directives: NodeDirectiveSchema[] = []) {
  const vIf = directives.find((n) => camelCase(n.name) === 'vIf');
  const vFor = directives.find((n) => camelCase(n.name) === 'vFor');
  const vShow = directives.find((n) => camelCase(n.name) === 'vShow');
  const vBind = directives.find((n) => camelCase(n.name) === 'vBind');
  const vModels = directives.filter((n) => camelCase(n.name) === 'vModel');
  const others = directives.filter(
    (n) => !BUILDIN_DIRECTIVES.includes(camelCase(n.name))
  );
  return {
    vIf,
    vFor,
    vShow,
    vModels,
    vBind,
    others
  };
}

export function isBlockDsl(schema: unknown): schema is BlockSchema {
  return !!(schema as any)?.__VTJ_BLOCK__;
}

export function isBlock(value: unknown): value is Block {
  return !!(value as any)?.__VTJ_BLOCK__;
}

export function isNode(value: unknown): value is Node {
  return !!(value as any)?.__VTJ_NODE__;
}

export function isProjectDsl(schema: unknown): schema is ProjectSchema {
  return !!(schema as any)?.__VTJ_PROJECT__;
}

export function isCSSUrl(url: string): boolean {
  return /\.css$/.test(url);
}

export function isJSUrl(url: string): boolean {
  return /\.js$/.test(url);
}

export function createAssetScripts(scripts: string[]): string {
  return scripts.map((url) => `<script src="${url}"></script>`).join('');
}

export function createAssetsCss(css: string[] = []) {
  return css.map((url) => `<link rel="stylesheet" href="${url}" />`).join('');
}

export function dedupArray(array: any[]) {
  return Array.from(new Set(array));
}

export function createApiHandler(api: ApiSchema) {
  const { url, method = 'GET', settings } = api;
  const opts = settings ? parseExpression(settings, {}) : undefined;
  if (method.toLowerCase() === 'jsonp') {
    return (params: any) => jsonp(url, params, opts as any);
  }
  return createApi({
    url,
    method,
    settings: opts
  });
}
