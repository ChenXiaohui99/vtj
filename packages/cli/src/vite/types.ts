import type {
  UserConfig,
  UserConfigExport,
  ProxyOptions,
  PluginOption
} from 'vite';

/**
 * 代理配置
 */
export type ProxyConfig = Record<string, string | ProxyOptions>;
/**
 * 环境变量配置
 */
export type EnvConfig = Record<string, string | number | boolean>;
/**
 * 环境类型
 */
export type EnvType = 'local' | 'dev' | 'sit' | 'uat' | 'pre' | 'live';

/**
 * 环境变量映射
 */
export type EnvConfigMap = Partial<Record<EnvType, EnvConfig>>;

/**
 * createViteConfig函数参数
 */
export interface CreateViteConfigOptions {
  /**
   * 打印最终 vite.config
   */
  debug?: boolean;

  /**
   * 库模式
   */
  lib?: boolean;

  /**
   * 开发或生产环境服务的公共基础路径
   */
  base?: string;

  /**
   * 打包输出文件夹
   */
  outDir?: string;

  /**
   * 清空输出目录
   */
  emptyOutDir?: boolean;

  /**
   * 自定义配置 vite 配置
   */
  defineConfig?: (config: UserConfig) => UserConfigExport;

  /**
   * 开发端口
   */
  port?: number;

  /**
   * 预览端口
   */
  previewPort?: number;

  /**
   * 主机头
   */
  host?: string;

  /**
   * 开启https
   */
  https?: boolean;

  /**
   * 代理
   */
  proxy?: ProxyConfig;

  /**
   * 环境变量配置
   */
  envConfig?: EnvConfigMap;

  /**
   * 当前环境类型
   */
  envType?: string;

  /**
   * Vite 服务器默认会忽略对 .git/ 和 node_modules/ 目录的监听。如果你需要对 node_modules/ 内的包进行监听
   */
  watchModules?: string[];

  /**
   * 别名
   */
  alias?: Record<string, string>;

  /**
   * UniApp 应用
   */
  uniapp?: boolean;

  /**
   * 生成定义文件, 在库模式有效
   */
  dts?: boolean;

  /**
   * 定义文件输出文件夹
   */
  dtsOutputDir?: string;

  /**
   * 适配传统浏览器, 在非库模式下有效
   */
  legacy?: boolean;

  /**
   * 编译目标浏览器
   */
  targets?: string | string[];

  /**
   * 设置 polyfills，在非库模式下有效，默认为true
   */
  polyfills?: boolean | string[];

  /**
   *  lib 入口文件
   */
  entry?: string;

  /**
   * 不打包的依赖
   */
  external?: string[];

  /**
   * 从全局引用的依赖
   */
  externalGlobals?: Record<string, string>;

  /**
   * 库模式在umd文件导出变量名称
   */
  library?: string;

  /**
   * 库模式输入格式
   */
  formats?: string[];

  /**
   * 库模式编译输出文件名
   */
  libFileName?: string;

  /**
   * 自定义 chunk name, 在库模式无效
   */
  manualChunks?: (id: string) => string | void;

  /**
   * 强制更新依赖
   */
  force?: boolean;

  /**
   * 预构建依赖
   */
  optimizeDeps?: string[];

  /**
   * 生成报告
   */
  visualizer?: boolean;

  /**
   * 插件
   */
  plugins?: PluginOption[];

  /**
   * 开启babel
   */
  babel?: boolean;

  /**
   *  开启生成版本号文件
   */
  version?: boolean;

  /**
   * 开启 unplugin-element-plus
   */
  elementPlus?: boolean | Record<string, any>;

  /**
   * 静态服务目录
   */
  staticDirs?: string[];
}
