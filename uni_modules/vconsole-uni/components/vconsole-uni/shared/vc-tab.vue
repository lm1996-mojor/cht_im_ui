<template>
  <view class="vconsole-tab" :class="{ active }" @tap="handleClick">
    <text class="label">{{ item.label }}</text>
  </view>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';

defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'apply-shared',
  },
});

export type TabItem = {
  key: string;
  label: string;
};

const props = defineProps({
  active: {
    type: Boolean,
    required: true,
  },
  item: {
    type: Object as PropType<TabItem>,
    required: true,
  },
});
const emit = defineEmits<{
  (e: 'click', key: string): void;
}>();

function handleClick() {
  emit('click', props.item.key);
}
</script>

<style lang="scss" scoped>
.vconsole-tab {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 6px 8px;
  border-radius: 4px;
  color: #14532d;
  font-size: 14px;

  & + & {
    margin-left: 12px;
  }

  &.active {
    color: #065f46;
    background: #dcfce7;
  }
}
</style>
