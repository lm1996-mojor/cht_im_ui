<template>
  <view class="vc-tabs-inner">
    <vc-tab
      v-for="item in items"
      :key="item.key"
      :item="item"
      :active="activeKey != null && activeKey === item.key"
      @click="handleTabClick"
    />
  </view>
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import VcTab from './vc-tab.vue';
import type { TabItem } from './vc-tab.vue';

defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'apply-shared',
  },
});

const props = defineProps({
  items: {
    type: Array as PropType<TabItem[]>,
    default: () => [],
  },
  activeKey: String,
});
const emit = defineEmits<{
  (e: 'change', key: string): void;
}>();

function handleTabClick(key: string) {
  if (props.activeKey == null) {
    emit('change', key);
  } else if (props.activeKey !== key) {
    emit('change', key);
  }
}
</script>

<style lang="scss" scoped>
.vc-tabs-inner {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 8px 12px;
}
</style>
