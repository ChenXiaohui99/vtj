import {
  type NodeModel,
  type BlockModel,
  type JSExpression,
  type JSFunction,
  isBlock,
  parseExpression,
  parseFunction
} from '@vtj/core';
import { ElNotification, ElMessageBox } from 'element-plus';

export function getComponentName(node: NodeModel | BlockModel) {
  if (isBlock(node)) return node.name;
  if (node.name === 'component') {
    const name = node.props.is?.value;
    return typeof name === 'string' ? name : node.name;
  }
  return node.name;
}

export function notify(message: string) {
  return ElNotification.warning({
    title: '提示',
    message
  });
}

export async function confirm(message: string) {
  return await ElMessageBox.confirm(message, '提示', { type: 'warning' }).catch(
    () => false
  );
}

export function expressionValidate(
  str: JSExpression | JSFunction,
  self: any,
  thisRequired = false
) {
  let vaild = true;
  try {
    if (str.type === 'JSExpression') {
      parseExpression(str, self, thisRequired, true);
    } else {
      parseFunction(str, self, thisRequired, true);
    }
  } catch (e: any) {
    vaild = false;
    ElNotification.error({
      title: '代码错误',
      message: e.message
    });
  }
  return vaild;
}
