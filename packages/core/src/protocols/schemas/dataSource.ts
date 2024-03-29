import type { JSFunction, JSExpression } from '../shared';

/**
 * 数据源类型，目前仅实现api类型
 */
export type DataSourceType = 'api' | 'cube' | 'meta';

/**
 * 请求方法
 */
export type ApiMethod = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'jsonp';

/**
 * 项目级API类型数据源
 */
export interface ApiSchema {
  /**
   * 唯一标识
   */
  id: string;

  /**
   * 接口名称
   */
  name: string;

  /**
   * 接口描述说明
   */
  label?: string;

  /**
   * 接口请求url
   */
  url: string;

  /**
   * 接口请求方法
   */
  method?: ApiMethod;

  /**
   * 请求 设置配置
   */
  settings?: Record<string, any>;

  /**
   * 请求头配置
   */
  headers?: JSExpression | JSFunction;

  /**
   * jsonp请求配置
   */
  jsonpOptions?: Record<string, any>;

  /**
   * 模拟数据模板
   */
  mockTemplate?: MockField[] | JSFunction;
}

/**
 * 模拟数据模板字段配置
 * @see http://mockjs.com/0.1/#%E6%95%B0%E6%8D%AE%E6%A8%A1%E6%9D%BF%E5%AE%9A%E4%B9%89
 */
export interface MockField {
  name: string;
  rule?: string;
  value: any;
}

/**
 * 页面级引用数据源
 */
export interface DataSourceSchema {
  /**
   * 数据源类型
   */
  type: DataSourceType;

  /**
   * 数据源引用唯一标识
   */

  ref: string;

  /**
   * 数据源名称
   */
  name: string;

  /**
   * 描述标题
   */
  label?: string;

  /**
   * 数据转换函数
   */
  transform?: JSFunction;

  /**
   * 测试用例
   */
  test?: JSFunction;
}
