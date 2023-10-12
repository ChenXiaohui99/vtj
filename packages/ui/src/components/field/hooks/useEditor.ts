import {
  computed,
  ref,
  Ref,
  watch,
  ComponentInternalInstance,
  ComputedRef
} from 'vue';
import {
  BuiltinFieldEditor,
  builtinFieldEditors,
  FieldProps,
  FieldOption,
  FieldEmits,
  FieldEditorProps
} from '../types';
import { Emits, FormModel } from '../../';
import { merge, toArray } from '@vtj/utils';

export async function useOptions(
  props: FieldProps,
  cascader: Record<string, any>
) {
  const options = props.options;
  if (!options) return [];
  if (typeof options === 'function') {
    return (await options(cascader)) || [];
  }
  return options;
}

export function useEditor(
  props: FieldProps,
  emit: Emits<FieldEmits>,
  fieldVisible: ComputedRef<boolean>,
  instance: ComponentInternalInstance | null,
  model: FormModel | null
) {
  const optionsRef = ref<FieldOption[]>([]);

  const watcher = computed(() => {
    if (!instance || !model) return {};
    const cascader = toArray<string>(props.cascader);
    return cascader.reduce((prev, current) => {
      prev[current] = model[current];
      return prev;
    }, {} as FormModel);
  });

  watch(
    watcher,
    async (val: any) => {
      if (fieldVisible.value) {
        optionsRef.value = await useOptions(props, val);
        const reset = instance?.exposed?.reset;
        if (reset && props.name) {
          reset(props.name);
        }
      }
    },
    {
      immediate: true
    }
  );

  const editor = computed(() => {
    const {
      editor = 'text',
      placeholder,
      label = '...',
      disabled,
      readonly
    } = props;
    const editorProps: FieldEditorProps = {
      ...props.props,
      placeholder:
        placeholder || (placeholder === null ? undefined : `请输入${label}`),
      disabled,
      readonly,
      options: optionsRef.value,
      onFocus: () => emit('focus'),
      onBlur: () => emit('blur'),
      onChange: (v: any) => emit('change', v)
    };

    const builtinEditor: BuiltinFieldEditor =
      typeof editor === 'string'
        ? builtinFieldEditors[editor]
        : {
            component: editor,
            props: {}
          };

    return merge({}, builtinEditor, {
      props: editorProps
    }) as BuiltinFieldEditor;
  });

  return {
    editor
  };
}
