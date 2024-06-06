import type { PropType } from 'vue';
import type {
  PickerColumns,
  PrickerFields,
  PickerDialogProps,
  PickerGridProps,
  PickerLoader
} from './types';

export const pickerProps = {
  /**
   * 表格列配置
   */
  columns: {
    type: Array as PropType<PickerColumns>
  },
  /**
   * 查询条件表单字段
   */
  fields: {
    type: Array as PropType<PrickerFields>
  },

  /**
   * 表格数据加载器
   */
  loader: {
    type: Function as PropType<PickerLoader>
  },

  /**
   * 值
   */
  modelValue: {
    type: [String, Number, Object, Array]
  },

  /**
   * 多选模式
   */
  multiple: {
    type: Boolean
  },

  /**
   * 值为对象模式
   */
  raw: {
    type: Boolean
  },

  /**
   * 禁用
   */
  disabled: {
    type: Boolean
  },

  /**
   * 多选追加模式
   */
  append: {
    type: Boolean
  },
  /**
   * 值映射字段名称
   */
  valueKey: {
    type: String,
    default: 'value'
  },
  /**
   * 输入显示映射字段名称
   */
  labelKey: {
    type: String,
    default: 'label'
  },

  /**
   * 查询参数名称
   */
  queryKey: {
    type: String
  },
  /**
   * 单选模式，回车时自动检测取回有且计有唯一数据
   */
  preload: {
    type: Boolean
  },

  /**
   * 初始默认查询参数
   */
  defaultQuery: {
    type: Function as PropType<() => any>
  },
  /**
   *  弹窗组件配置参数
   */
  dialogProps: {
    type: Object as PropType<PickerDialogProps>
  },

  /**
   * 表格组件配置参数
   */
  gridProps: {
    type: Object as PropType<PickerGridProps>
  }
};
