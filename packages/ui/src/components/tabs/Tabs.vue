<template>
  <ElTabs class="x-tabs" :class="classComputed" v-bind="$attrs">
    <ElTabPane
      v-for="item of props.items"
      :key="item.value ?? item.name"
      v-bind="getTabPane(item)">
      <template #label>
        <slot name="label" v-bind="item">
          <component
            v-if="item.icon"
            class="x-tabs__icon"
            :is="useIcon(item.icon)"></component>
          <div class="x-tabs__label-inner">
            {{ item.label }}
            <div
              class="x-tabs__actions"
              v-if="
                item.actions &&
                [item.name, item.value].includes($attrs.modelValue as any)
              ">
              <XAction
                v-for="action of item.actions"
                mode="icon"
                type="primary"
                size="small"
                circle
                v-bind="action"
                @click="onActionClick"
                @command="onActionCommand"></XAction>
            </div>
          </div>
        </slot>
      </template>
      <slot v-if="isMounted" v-bind="item">
        <component
          v-if="item.component"
          :is="item.component"
          v-bind="item.props"></component>
      </slot>
      <slot v-if="item.slot" :name="item.slot" v-bind="item"></slot>
    </ElTabPane>
  </ElTabs>
</template>
<script lang="ts" setup>
  import { computed, onMounted, ref, onUnmounted } from 'vue';
  import { ElTabs, ElTabPane } from 'element-plus';
  import { XAction, type ActionProps, type ActionMenuItem } from '../';
  import { tabsProps, type TabsItem, type TabsEmits } from './types';
  import { useIcon } from '../../hooks';

  defineOptions({
    name: 'XTabs'
  });

  const props = defineProps(tabsProps);
  const emit = defineEmits<TabsEmits>();
  const isMounted = ref(false);
  const tabSlots = computed(() => {
    const items = props.items || [];
    return items.filter((n: TabsItem) => !!n.slot).map((n: TabsItem) => n.slot);
  });
  const getTabPane = (item: TabsItem) => {
    const { label, name, value, disabled, closable, lazy } = item;
    return {
      label,
      name: value ?? name,
      disabled,
      closable,
      lazy
    };
  };

  const classComputed = computed(() => {
    return {
      'is-no-border': !props.border,
      'is-fit': !!props.fit,
      [`is-align-${props.align}`]: !!props.align
    };
  });

  const onActionClick = (e: ActionProps) => {
    emit('actionClick', e);
  };

  const onActionCommand = (e: ActionMenuItem) => {
    emit('actionCommand', e);
  };

  onMounted(() => {
    isMounted.value = true;
  });

  onUnmounted(() => {
    isMounted.value = false;
  });

  const $vtjDynamicSlots = () => {
    return tabSlots.value;
  };

  defineExpose({
    $vtjDynamicSlots
  });
</script>
