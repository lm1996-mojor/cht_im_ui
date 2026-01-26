<template>
  <button
    class="vc-btn"
    :class="customClass"
    :style="customStyle"
    :data-type="type"
    :size="size"
    :plain="plain"
    @tap.stop="handleClick"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed, type PropType } from 'vue';

defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'apply-shared',
  },
});

const props = defineProps({
  customClass: String,
  customStyle: String,
  type: {
    type: String as PropType<'default' | 'primary' | 'warn'>,
    default: 'default',
  },
  size: {
    type: String as PropType<'default' | 'mini'>,
    default: 'default',
  },
  plain: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits<{ (e: 'click'): void }>();

function handleClick() {
  emit('click');
}
</script>

<style lang="scss" scoped>
.vc-btn {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &[data-type='default'] {
    color: #14532d;
    background: #f7fff9;
    border: 1px solid #d1fae5;
  }

  &[data-type='primary'] {
    color: #10b981;
    background: #f7fff9;
    border: 1px solid #10b981;
  }

  &[data-type='warn'] {
    color: #ca8a04;
    background: #f7fff9;
    border: 1px solid #ca8a04;
  }

  &[size='default'] {
    height: 44px;
    font-size: 14px;
    padding: 0px 14px;
  }

  &[size='mini'] {
    height: 32px;
    font-size: 12px;
    padding: 0px 10px;
  }
}
</style>
