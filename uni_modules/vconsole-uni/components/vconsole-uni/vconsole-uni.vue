<template>
  <vc-fab v-if="enableDebug && !overlayVisible" @click="handleFabClick" />

  <vc-overlay title="vConsole" :open="overlayVisible" @close="handleOverlayClose">
    <view class="overlay">
      <vc-tabs :items="tabs" :activeKey="tab" @change="handleTabChange" />

      <view class="overlay__body">
        <vc-logs v-if="tab === 'logs'" />
        <vc-network v-if="tab === 'network'" />
        <vc-storage v-if="tab === 'storage'" />
        <vc-system v-if="tab === 'system'" />
      </view>
    </view>
  </vc-overlay>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getEnableDebugRef } from '../../libs/core/bootstrap';
import VcFab from './shared/vc-fab.vue';
import VcOverlay from './shared/vc-overlay.vue';
import VcTabs from './shared/vc-tabs.vue';
import VcLogs from './features/vc-logs.vue';
import VcNetwork from './features/vc-network.vue';
import VcStorage from './features/vc-storage.vue';
import VcSystem from './features/vc-system.vue';

type TabKey = 'logs' | 'network' | 'storage' | 'system';

const tabs = [
  { key: 'logs', label: '日志' },
  { key: 'network', label: '网络' },
  { key: 'storage', label: '存储' },
  { key: 'system', label: '系统' },
];

const enableDebug = getEnableDebugRef();
const tab = ref<TabKey>('logs');
const overlayVisible = ref(false);

function handleFabClick() {
  overlayVisible.value = true;
}

function handleOverlayClose() {
  overlayVisible.value = false;
}

function handleTabChange(key: string) {
  tab.value = key as TabKey;
}
</script>

<style lang="scss" scoped>
:global(input),
:global(textarea),
:global(button),
:global(view),
:global(text) {
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
}

.overlay {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__body {
    flex: 1 1 0%;
    min-height: 0px;
    min-width: 0px;
    overflow: auto;
  }
}
</style>
