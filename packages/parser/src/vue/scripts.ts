import type {
  BlockStatement,
  StringLiteral,
  ObjectExpression,
  ObjectProperty,
  ObjectMethod,
  BooleanLiteral,
  ArrayExpression
} from '@babel/types';
import { parseScript as toAST, traverseAST, generateCode } from '../shared';
import type { BlockState, JSFunction, BlockWatch, BlockProp } from '@vtj/core';
import { getJSExpression, getJSFunction, LIFE_CYCLES_LIST } from './utils';

export interface ImportStatement {
  from: string;
  imports: string[];
}

export interface ParseScriptsResult {
  imports?: ImportStatement[];
  name?: string;
  state?: BlockState;
  methods?: Record<string, JSFunction>;
  computed?: Record<string, JSFunction>;
  watchers?: Record<string, JSFunction>;
  lifeCycles?: Record<string, JSFunction>;
  watch?: BlockWatch[];
  props?: Array<string | BlockProp>;
}

export function parseScripts(content: string) {
  const imports = parseImports(content);
  const result: ParseScriptsResult = {
    imports
  };
  const ast = toAST(content);
  traverseAST(ast, {
    ExportDefaultDeclaration(path) {
      const declaration = path.node.declaration;
      if (declaration.type !== 'CallExpression') return;
      const options = declaration.arguments[0];
      if (options?.type !== 'ObjectExpression') return;

      const properties = options.properties.filter(
        (n) => n.type === 'ObjectProperty'
      );
      const methods = options.properties.filter(
        (n) => n.type == 'ObjectMethod'
      );

      const computed = properties.find(
        (n) => (n.key as any).name === 'computed'
      );
      if (computed) {
        result.computed = getMethods(computed.value as ObjectExpression);
        result.watchers = getWatchers(computed.value as ObjectExpression);
      }

      for (const item of properties) {
        const keyName = (item.key as any).name;
        switch (keyName) {
          case 'name':
            result.name = (item.value as StringLiteral).value;
            break;
          case 'methods':
            result.methods = getMethods(item.value as ObjectExpression);
            break;
          case 'watch':
            result.watch = getWatches(
              item.value as ObjectExpression,
              result.watchers
            );
            break;
          case 'props':
            result.props = processProps(item.value as any);
            break;
        }
      }

      for (const item of methods) {
        const keyName = (item.key as any).name;
        switch (keyName) {
          case 'setup':
            result.state = getState(item.body);
            break;
        }
      }

      result.lifeCycles = getLifeCycles(methods);
    }
  });
  //   console.log(ast);

  // console.log(result);
  console.log('----------');

  return result;
}

function parseImports(script: string) {
  const importRegex = /import\s+{(.+?)}\s+from\s+['"](.+?)['"]/g;
  const imports: ImportStatement[] = [];
  let match;

  while ((match = importRegex.exec(script)) !== null) {
    imports.push({
      from: match[2],
      imports: match[1].split(',').map((s) => s.trim())
    });
  }

  return imports;
}

function findStateExpression(block: BlockStatement) {
  for (const n of block.body) {
    if (n.type === 'VariableDeclaration' && n.kind == 'const') {
      const { id, init } = n.declarations[0];
      if (
        id.loc?.identifierName === 'state' &&
        init?.type === 'CallExpression' &&
        init.callee.loc?.identifierName === 'reactive'
      ) {
        return init.arguments[0] as ObjectExpression;
      }
    }
  }
  return null;
}

function getState(block: BlockStatement) {
  const stateExpression = findStateExpression(block);
  if (!stateExpression) return {};
  const state: BlockState = {};
  for (const item of stateExpression.properties) {
    const { key, value } = item as ObjectProperty;
    if (key.type === 'Identifier') {
      const code = generateCode(value);
      state[key.name] = getJSExpression(code);
    }
  }
  return state;
}

function getFunction(item: ObjectMethod) {
  const { key, async, params, body } = item;
  const paramsStr = params.map((n: any) => n.name).join(', ');
  if (key.type === 'Identifier') {
    const name = key.name;
    const code = generateCode(body);
    const asyncContent = async ? 'async ' : '';
    const content = `${asyncContent}(${paramsStr}) => ${code}`;
    const watcher = name.startsWith('watcher_');
    return {
      name,
      watcher,
      exp: getJSFunction(content)
    };
  }
  return undefined;
}

function getMethods(expression: ObjectExpression) {
  if (!expression) return {};
  const methods: Record<string, JSFunction> = {};
  for (const item of expression.properties) {
    const method = getFunction(item as ObjectMethod);
    if (method && !method.watcher) {
      methods[method.name] = method.exp;
    }
  }
  return methods;
}

function getWatchers(expression: ObjectExpression) {
  if (!expression) return {};
  const watchers: Record<string, JSFunction> = {};
  for (const item of expression.properties) {
    const method = getFunction(item as ObjectMethod);
    if (method && method.watcher) {
      watchers[method.name] = method.exp;
    }
  }
  return watchers;
}

function getBooleanValue(properties: ObjectProperty[], name: string) {
  const node = properties.find(
    (n) => (n as any).key?.name === name
  ) as ObjectProperty;
  return !!(node?.value as BooleanLiteral)?.value;
}

function getFunctionExp(
  properties: Array<ObjectProperty | ObjectMethod>,
  name: string
) {
  const node = properties.find(
    (n) => (n as any).key?.name === name
  ) as ObjectMethod;
  if (node) {
    const func = getFunction(node);
    return func?.exp;
  }
  return undefined;
}

function getWatches(
  expression: ObjectExpression,
  watchers: Record<string, JSFunction> = {}
) {
  const watches: BlockWatch[] = [];
  for (const item of expression.properties) {
    const { key, value } = item as ObjectProperty;
    const name = (key as StringLiteral).value || '';

    if (watchers[name]) {
      const properties = (value as ObjectExpression)
        .properties as ObjectProperty[];
      watches.push({
        source: watchers[name],
        deep: getBooleanValue(properties, 'deep'),
        immediate: getBooleanValue(properties, 'immediate'),
        handler: getFunctionExp(properties, 'handler') as JSFunction
      });
    } else {
      if (item.type === 'ObjectMethod') {
        watches.push({
          // todo: 处理上下文
          source: {
            type: 'JSFunction',
            value: `this.${name}`
          },
          deep: false,
          immediate: false,
          handler: getFunction(item as ObjectMethod)?.exp as JSFunction
        });
      }

      if (item.type === 'ObjectProperty') {
        const properties = (value as ObjectExpression)
          .properties as ObjectProperty[];
        watches.push({
          // todo: 处理上下文
          source: {
            type: 'JSFunction',
            value: `this.${name}`
          },
          deep: getBooleanValue(properties, 'deep'),
          immediate: getBooleanValue(properties, 'immediate'),
          handler: getFunctionExp(properties, 'handler') as JSFunction
        });
      }
    }
  }
  // console.log(expression, watchers);
  return watches;
}

function getLifeCycles(methods: ObjectMethod[]) {
  const lifeCycles: Record<string, JSFunction> = {};
  for (const item of methods) {
    const key = (item.key as any).name;
    if (LIFE_CYCLES_LIST.includes(key)) {
      const func = getFunction(item as ObjectMethod);
      if (func) {
        lifeCycles[func.name] = func.exp;
      }
    }
  }
  return lifeCycles;
}

function getPropDataType(properties: ObjectProperty[]) {
  const node = properties.find(
    (n) => (n as any).key?.name === 'type'
  ) as ObjectProperty;
  if (!node) return undefined;
  if (node.value.type === 'ArrayExpression') {
    return node.value.elements.map((n: any) => n.name);
  } else {
    return (node.value as any).name;
  }
}

function getPropDefault(properties: ObjectProperty[]) {
  const node = properties.find(
    (n) => (n as any).key?.name === 'default'
  ) as ObjectProperty;
  if (!node) return undefined;

  return getJSExpression(generateCode(node.value));
}

function processProps(expression: ObjectExpression | ArrayExpression) {
  if (!expression) return [];
  let props: Array<string | BlockProp> = [];
  if (expression.type === 'ArrayExpression') {
    props = expression.elements.map((n: any) => n.value);
  } else if (expression.type === 'ObjectExpression') {
    props = expression.properties.map((n: any) => {
      const { key, value } = n as ObjectProperty;
      const properties = (value as any).properties || [];
      return {
        name: (key as any).name,
        required: getBooleanValue(properties, 'required'),
        type: getPropDataType(properties),
        default: getPropDefault(properties)
      };
    });
  }

  return props;
}
