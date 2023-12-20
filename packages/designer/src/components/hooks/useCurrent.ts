import { computed } from 'vue';
import { useEngine } from '../../framework';

export function useCurrent() {
  const engine = useEngine();
  const current = computed(() => engine.current.value);
  const context = computed(() => engine.context.value);
  const isEmpty = computed(() => current.value?.nodes.length === 0);

  return {
    engine,
    current,
    isEmpty,
    context
  };
}
