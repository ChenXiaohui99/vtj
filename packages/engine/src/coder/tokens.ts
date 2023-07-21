import {
  BlockSchema,
  StateSchema,
  JSExpression,
  JSFunction,
  DefineProps,
  PropDataType,
  InjectSchema,
  WatchSchema,
  NodeSchema,
  PropsSchema,
  NodeEventSchema,
  NodeEventsSchema,
  NodeChildrenSchema,
  NodeDirectiveSchema,
  NodeSlotSchema,
  Assets,
  DataSourceSchema
} from '../core';
import {
  isJSFunction,
  isJSExpression,
  upperFirstCamelCase,
  isPlainObject,
  getModifiers,
  toTsType,
  getDiretives,
  dedupArray
} from '../utils';

function replaceComputedValue(content: string, keys: string[] = []) {
  let result = content;
  for (const key of keys) {
    result = result.replaceAll(`this.${key}.value`, `this.${key}`);
  }
  return result;
}

function replaceFunctionTag(content: string) {
  let handler: string = content.trim();
  if (handler.startsWith('function')) {
    handler = handler.replace('function', '');
  } else {
    handler = handler.replace(/() \=\>/, '');
  }
  return handler;
}

function replaceThis(content: string) {
  return content.replaceAll('this.', '');
}

function parseValue(val: unknown, stringify: boolean = true) {
  return isJSExpression(val)
    ? `${(val as JSExpression).value}`
    : isJSFunction(val)
    ? (val as JSFunction).value
    : stringify
    ? JSON.stringify(val)
    : val;
}

function parseFunctionMap(
  map: Record<string, JSFunction> = {},
  computedKeys: string[] = []
) {
  return Object.entries(map).map(([name, val]) => {
    let handler = replaceFunctionTag(parseValue(val) as string);
    handler = replaceComputedValue(handler, computedKeys);
    return `${name}${handler}`;
  });
}

function parseState(state: StateSchema = {}) {
  return Object.entries(state).map(([name, val]) => {
    const value = parseValue(val);
    return `${name}:${value}`;
  });
}

function parseProps(props: DefineProps = []) {
  const toTypes = (type?: PropDataType | PropDataType[]) => {
    if (!type) return undefined;
    const types = Array.isArray(type) ? type : [type];
    const _types = types.map((n) => {
      return n.replace(/\'|\"/gi, '');
    });
    return `[${_types.join(',')}]`;
  };

  return props.map((prop) => {
    if (typeof prop === 'string') {
      return `${prop}: {}`;
    } else {
      return `${prop.name}: {
        type:${toTypes(prop.type)},
        required: ${prop.required},
        default: ${parseValue(prop.default)}
        }`;
    }
  });
}

function parseInject(inject: InjectSchema[] = []) {
  return inject.map((n) => {
    return `${n.name}: {
        from: '${n.from}',
        default: ${parseValue(n.default)}
    }`;
  });
}

function parseEmits(emits: string[] = []) {
  return emits.map((n) => {
    return `'${n}'`;
  });
}

function parseWatch(watch: WatchSchema[] = [], computedKeys: string[] = []) {
  const watchers = watch.reduce((prev, current) => {
    if (current.id && isJSFunction(current.source)) {
      prev[`watcher_${current.id}`] = current.source;
    }
    return prev;
  }, {} as Record<string, JSFunction>);
  const computed = parseFunctionMap(watchers, computedKeys);

  const watches = watch.map((n) => {
    return `watcher_${n.id}: {
      deep: ${n.deep},
      immediate:${n.immediate},
      handler${replaceFunctionTag(n.handler.value)}
    }`;
  });
  return {
    computed,
    watches
  };
}

function parseTemplate(
  children: NodeSchema[] = [],
  computedKeys: string[] = []
) {
  const nodes: string[] = [];
  let methods: Record<string, JSFunction> = {};
  let components: string[] = [];
  for (let child of children) {
    const { id, name, invisible, slot } = child;
    if (invisible) {
      continue;
    }
    components.push(name);
    const props = bindNodeProps(child.props).join(' ');
    const { binders, handlers } = bindNodeEvents(id || name, child.events);
    const events = binders.join(' ');
    Object.assign(methods, handlers);
    const directives = parseDirectives(child.directives).join(' ');
    const nodeChildren = parseNodeChildren(child.children, computedKeys);
    let childContent = '';
    if (typeof nodeChildren === 'string') {
      childContent = nodeChildren;
    } else {
      childContent = (nodeChildren?.nodes || []).join('\n');
      Object.assign(methods, nodeChildren?.methods || {});
      components = components.concat(nodeChildren?.components || []);
    }

    const node = wrapSlot(
      slot,
      `<${name} ${directives} ${props} ${events}>
      ${childContent}
    </${name}>`
    );
    nodes.push(node);
  }
  return {
    nodes,
    methods,
    components: dedupArray(components) as string[]
  };
}

function parsePlainObjectValue(obj: Record<string, any> = {}) {
  return Object.entries(obj).map(([name, value]) => {
    return `${name}: ${parseValue(value)}`;
  });
}

function bindProp(name: string, value: unknown) {
  if (typeof value === 'string') {
    return `${name}="${value}"`;
  } else if (isJSExpression(value) || isJSFunction(value)) {
    return `:${name}="${parseValue(value)}"`;
  } else if (isPlainObject(value)) {
    return `:${name}='{${parsePlainObjectValue(
      value as Record<string, any>
    ).join(', ')}}'`;
  } else {
    return `:${name}="${JSON.stringify(value)}"`;
  }
}

function bindNodeProps(props: PropsSchema = {}) {
  return Object.entries(props).map(([name, value]) => {
    return bindProp(name, value);
  });
}

function bindEvent(
  id: string,
  name: string,
  value: NodeEventSchema,
  binder: string
) {
  const modifiers = getModifiers(value.modifiers, true);
  return `@${name}${modifiers.join('')}="${binder}"`;
}

function bindNodeEvents(id: string, events: NodeEventsSchema = {}) {
  const handlers: Record<string, JSFunction> = {};
  const binders = Object.entries(events).map(([name, value]) => {
    const binder = `${name}_handler_${id}`;
    handlers[binder] = value.handler;
    return bindEvent(id, name, value, binder);
  });
  return {
    binders,
    handlers
  };
}

function parseNodeChildren(
  children?: NodeChildrenSchema,
  computedKeys: string[] = []
) {
  if (!children) return '';
  if (typeof children === 'string') {
    return children;
  }
  if (isJSExpression(children)) {
    let content = parseValue(children) as string;
    content = replaceComputedValue(content, computedKeys);
    content = replaceThis(content);
    return `{{ ${content} }}`;
  }

  if (Array.isArray(children)) {
    return parseTemplate(children, computedKeys);
  }
}

function parseDirectives(directives: NodeDirectiveSchema[] = []) {
  const result: string[] = [];
  const { vIf, vShow, vModels, vFor, others } = getDiretives(directives);
  if (vIf) {
    result.push(`v-if="${parseValue(vIf.value)}"`);
  }
  if (vShow) {
    result.push(`v-show="${parseValue(vShow.value)}"`);
  }

  vModels.forEach((vModel) => {
    const modifiers = getModifiers(vModel.modifiers, true);
    const arg = vModel.arg
      ? isJSExpression(vModel.arg)
        ? `:[${parseValue(vModel.arg)}]`
        : `:${vModel.arg}`
      : '';
    result.push(`v-model${arg}${modifiers}="${parseValue(vModel.value)}"`);
  });

  if (vFor) {
    const { item, index } = vFor.iterator || { item: 'item', index: 'index' };
    result.push(`v-for="(${item}, ${index}) in ${parseValue(vFor.value)}"`);
  }
  // todo: 实现others 指令
  return result;
}

function wrapSlot(slot: string | NodeSlotSchema | undefined, content: string) {
  if (!slot) return content;
  const realSlot =
    typeof slot === 'string'
      ? { name: slot, params: [] }
      : { params: [], ...slot };
  const slotString = `#${realSlot.name}="${
    realSlot.params?.length > 0 ? `{${realSlot.params?.join(',')}}` : 'scope'
  }"`;
  return `<template ${slotString}>${content}</template>`;
}

function parseImports(
  assets: Assets,
  components: string[] = [],
  dataSources: Record<string, DataSourceSchema> = {}
) {
  const { componentMap, project } = assets;
  const imports: Record<string, string[]> = {
    vue: [
      'defineComponent',
      'reactive',
      'getCurrentInstance',
      'ComponentPublicInstance'
    ]
  };

  for (const name of components) {
    const desc = componentMap[name];
    if (desc && desc.package) {
      const items = imports[desc.package] ?? (imports[desc.package] = []);
      items.push(name);
    }
  }

  for (const item of Object.values(dataSources)) {
    const apis = imports['@/api'] ?? (imports['@/api'] = []);
    apis.push(item.detail);
  }

  return Object.entries(imports)
    .filter(([name, values]) => !!values.length)
    .map(([name, values]) => {
      return `import { ${(dedupArray(values) as string[]).join(
        ','
      )}} from '${name}'`;
    });
}

function parseDataSources(dataSources: Record<string, DataSourceSchema> = {}) {
  return Object.values(dataSources).map((item) => {
    const transform = isJSFunction(item.transform)
      ? item.transform.value || `(res) => res`
      : `(res) => res`;
    return `async ${item.name}(...args:any[]) {
        return await ${item.detail}.call(this, ...args).then(${transform});
      }`;
  });
}

export interface Tokens {
  name: string;
  state: string;
  inject: string;
  props: string;
  emits: string;
  expose: string;
  computed: string;
  watch: string;
  methods: string;
  lifeCycles: string;
  template: string;
  css: string;
  imports: string;
  components: string;
}

export function parser(dsl: BlockSchema, assets: Assets) {
  const tokens = {} as Tokens;
  const computedKeys = Object.keys(dsl.computed || {});
  const lifeCycles = parseFunctionMap(dsl.lifeCycles, computedKeys);
  const computed = parseFunctionMap(dsl.computed, computedKeys);
  const watch = parseWatch(dsl.watch, computedKeys);
  const dataSources = parseDataSources(dsl.dataSources);

  const { methods, nodes, components } = parseTemplate(
    dsl.children,
    computedKeys
  );
  const mergeComputed = [...computed, ...watch.computed];

  const mergeMethods = parseFunctionMap(
    {
      ...methods,
      ...(dsl.methods || {})
    },
    computedKeys
  );

  const imports = parseImports(assets, components, dsl.dataSources || {});

  tokens.name = dsl.name;
  tokens.state = parseState(dsl.state).join(',');
  tokens.inject = parseInject(dsl.inject).join(',');
  tokens.props = parseProps(dsl.props).join(',');
  tokens.emits = parseEmits(dsl.emits).join(',');
  tokens.expose = `'vtj'`;
  tokens.computed = mergeComputed.join(',');
  tokens.watch = watch.watches.join(',');
  tokens.methods = [...dataSources, ...mergeMethods].join(',');
  tokens.lifeCycles = lifeCycles.length ? ',' + lifeCycles.join(',') : '';
  tokens.template = nodes.join('\n');
  tokens.css = dsl.css || '';
  tokens.imports = imports.join('\n');
  tokens.components = components.join(',');

  return tokens;
}
