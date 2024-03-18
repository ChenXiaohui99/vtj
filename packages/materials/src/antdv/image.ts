import type { MaterialDescription } from '@vtj/core';

const components: MaterialDescription[] = [
  {
    name: 'AImage',
    alias: 'Image',
    label: '图片',
    categoryId: 'data',
    doc: 'https://www.antdv.com/components/image-cn',
    props: [
      {
        name: 'alt',
        label: 'alt',
        title: '图像描述',
        setters: 'StringSetter'
      },
      {
        name: 'fallback',
        label: 'fallback',
        title: '加载失败容错地址',
        setters: 'StringSetter'
      },
      {
        name: 'height',
        label: 'height',
        title: '图像高度',
        setters: ['StringSetter', 'NumberSetter']
      },
      {
        name: 'placeholder',
        label: 'placeholder',
        title: '加载占位, 为 true 时使用默认占位',
        setters: 'BooleanSetter' //?? boolean | slot
      },
      {
        name: 'preview',
        label: 'preview',
        title: '预览参数，为 false 时禁用',
        setters: ['BooleanSetter', 'ObjectSetter'], //?? boolean | previewType
        defaultValue: true
      },
      {
        name: 'src',
        label: 'src',
        title: '图片地址',
        setters: 'StringSetter'
      },
      {
        name: 'previewMask',
        label: 'previewMask',
        title: '自定义 mask',
        setters: ['FunctionSetter', 'StringSetter'] //?? false | function | slot
      },
      {
        name: 'width',
        label: 'width',
        title: '图像宽度',
        setters: ['StringSetter', 'NumberSetter']
      }
    ],
    events: ['error'],
    slots: ['placeholder', 'previewMask']
  }
];
export default components;
