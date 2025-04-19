import {
  type BlockSchema,
  type NodeSchema,
  type Dependencie,
  type ParseVueOptions,
  type ProjectSchema,
  type JSExpression,
  type JSFunction,
  BlockModel
} from '@vtj/core';
import { tsFormatter } from '@vtj/coder';
import { parseSFC, isJSCode } from '../shared';
import { parseTemplate } from './template';
import { parseScripts, type ImportStatement } from './scripts';
import { parseStyle } from './style';
import { patchCode, replacer } from './utils';

export type IParseVueOptions = ParseVueOptions & { project: ProjectSchema };

export { patchCode, replacer };

export async function parseVue(options: IParseVueOptions) {
  const { id, name, source, project } = options;
  const { dependencies = [] } = project || {};
  const sfc = parseSFC(source);
  const { styles, css } = parseStyle(sfc.styles.join('\n'));
  const {
    state,
    watch,
    lifeCycles,
    computed,
    methods,
    props,
    emits,
    inject,
    handlers,
    imports
  } = parseScripts(sfc.script);
  const { nodes, slots, context } = parseTemplate(id, name, sfc.template, {
    handlers,
    styles
  });

  const dsl: BlockSchema = {
    id,
    name,
    inject,
    props,
    state,
    watch,
    lifeCycles,
    computed,
    methods,
    slots,
    emits,
    nodes,
    css
  };

  const computedKeys = Object.keys(computed || {});
  const members: string[] = [
    '$el',
    '$emit',
    '$nextTick',
    '$parent',
    '$root',
    '$refs',
    '$attrs',
    '$slots',
    '$watch',
    '$props',
    '$options',
    '$forceUpdate',
    'state',
    '$props',
    'props',
    ...Object.keys(methods || {})
  ];
  const { libs } = parseDeps(imports, dependencies);
  const patchCodeOpt = {
    context,
    computed: computedKeys,
    libs,
    members
  };
  await walkDsl(
    dsl,
    async (node: NodeSchema) => {
      await walkNode(node, async (content: any) => {
        if (isJSCode(content)) {
          const code = await tsFormatter(content.value);
          content.value = patchCode(code, node.id as string, patchCodeOpt);
        }
      });
    },
    async (exp: JSExpression | JSFunction) => {
      const code = await tsFormatter(exp.value);
      exp.value = patchCode(code, '', patchCodeOpt);
    }
  );

  const model = new BlockModel(dsl);
  return model.toDsl();
}

async function walkDsl(
  dsl: BlockSchema,
  callback: (n: NodeSchema, p?: NodeSchema) => Promise<void>,
  expCallback: (value: any) => Promise<void>
) {
  const walking = async (node: NodeSchema, parent?: NodeSchema) => {
    await callback(node, parent);
    if (Array.isArray(node.children)) {
      for (const n of node.children) {
        await walking(n, node);
      }
    }
  };

  const walkingExp = async (item: unknown) => {
    if (!item) return;
    if (typeof item !== 'object') return;
    if (Array.isArray(item)) {
      for (let n of item) {
        await walkingExp(n);
      }
      return;
    }

    const values = Object.values(item as Record<string, any>);
    for (const value of values) {
      if (isJSCode(value)) {
        await expCallback(value);
      } else {
        await walkingExp(value);
      }
    }
  };

  const {
    state,
    watch,
    computed,
    props,
    dataSources,
    methods,
    lifeCycles,
    inject
  } = dsl;

  await walkingExp({
    state,
    watch,
    computed,
    props,
    dataSources,
    methods,
    lifeCycles,
    inject
  });

  if (Array.isArray(dsl.nodes)) {
    for (const n of dsl.nodes) {
      await walking(n);
    }
  }
}

async function walkNode(node: NodeSchema, callback: (n: any) => Promise<void>) {
  const walking = async (item: unknown) => {
    if (!item) return;
    if (typeof item !== 'object') return;
    if (Array.isArray(item)) {
      for (let n of item) {
        await callback(n);
        await walking(n);
      }
      return;
    }

    if (isJSCode(item)) {
      await callback(item);
      return;
    }
    const values = Object.values(item as Record<string, any>);
    for (const value of values) {
      await callback(value);
      await walking(value);
    }
  };
  await walking(node);
}

function parseDeps(
  imports: ImportStatement[] = [],
  dependencies: Dependencie[] = []
) {
  const libs: Record<string, string> = {};
  const depsMap = dependencies.reduce(
    (prev, current) => {
      prev[current.package] = current.library;
      return prev;
    },
    {} as Record<string, string>
  );
  for (const { from, imports: names } of imports) {
    names.forEach((name) => {
      const library = depsMap[from];
      if (library) {
        libs[name] = library;
      }
    });
  }
  return {
    libs
  };
}
