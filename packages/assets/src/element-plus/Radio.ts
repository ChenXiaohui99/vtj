import { ComponentDescription } from '@vtj/engine';
const Radio: ComponentDescription[] = [
  {
    name: 'ElRadio',
    title: '单选框',

    categoryId: 'form',
    doc: 'https://element-plus.org/zh-CN/component/radio.html',
    package: 'element-plus',
    props: [
      {
        name: 'modelValue',
        defaultValue: '',
        setters: ['InputSetter', 'NumberSetter', 'BooleanSetter']
      },
      {
        name: 'label',
        defaultValue: '',
        setters: ['InputSetter', 'NumberSetter', 'BooleanSetter']
      },
      {
        name: 'disabled',
        defaultValue: false,
        setters: 'BooleanSetter'
      },
      {
        name: 'border',
        defaultValue: false,
        setters: 'BooleanSetter'
      },
      {
        name: 'size',
        defaultValue: '',
        options: ['large', 'default', 'small'],
        setters: 'SelectSetter'
      },
      {
        name: 'name',
        defaultValue: '',
        setters: 'BooleanSetter'
      }
    ],
    events: [
      {
        name: 'change'
      }
    ],
    snippet: {
      props: {
        label: '选项一'
      }
    }
  },
  {
    name: 'ElRadioGroup',
    title: '单选框组',

    categoryId: 'form',
    package: 'element-plus',
    props: [
      {
        name: 'modelValue',
        defaultValue: '',
        setters: ['InputSetter', 'NumberSetter', 'BooleanSetter']
      },
      {
        name: 'size',
        defaultValue: '',
        options: ['large', 'default', 'small'],
        setters: 'SelectSetter'
      },
      {
        name: 'disabled',
        defaultValue: false,
        setters: 'BooleanSetter'
      },
      {
        name: 'textColor',
        defaultValue: '#ffffff',
        setters: 'ColorSetter'
      },

      {
        name: 'fill',
        defaultValue: '#409EFF',
        setters: 'ColorSetter'
      },

      {
        name: 'validateEvent',
        defaultValue: true,
        setters: 'BooleanSetter'
      }
    ],
    events: [
      {
        name: 'change'
      }
    ],
    snippet: {
      name: 'ElRadioGroup',
      children: [
        {
          name: 'ElRadio',
          props: {
            label: '选项一'
          }
        },
        {
          name: 'ElRadio',
          props: {
            label: '选项二'
          }
        },
        {
          name: 'ElRadio',
          props: {
            label: '选项三'
          }
        }
      ]
    }
  },
  {
    name: 'ElRadioButton',
    title: '单选框按钮',

    categoryId: 'form',
    package: 'element-plus',
    props: [
      {
        name: 'label',
        defaultValue: '',
        setters: ['InputSetter', 'NumberSetter']
      },
      {
        name: 'disabled',
        defaultValue: false,
        setters: 'BooleanSetter'
      },
      {
        name: 'name',
        defaultValue: '',
        setters: 'InputSetter'
      }
    ],
    snippet: {
      children: '按钮选项'
    }
  }
];

export default Radio;
