<template>
  <view class="vc-logs">
    <view class="vc-logs__header">
      <vc-button @click="handleClear">清空️</vc-button>
      <view class="gap" />
      <vc-button @click="handleLevelFilter">
        {{ levelLabel }}
      </vc-button>
      <view class="gap" />
      <vc-input v-model="filterValues.keyword" placeholder="搜索" custom-style="flex: 1 1 0%" />
    </view>

    <view class="vc-logs__body">
      <scroll-view scroll-y style="width: 100%; height: 100%">
        <view
          v-for="v in displayLogs"
          :key="v.id"
          class="log-item"
          :class="[`log-item--${v.level}`]"
        >
          <view class="log-item__header">
            <view class="log-meta">
              <text class="log-time">[{{ v.time }}]</text>
              <text class="log-level">{{ v.level.toUpperCase() }}</text>
            </view>
            <vc-button size="mini" @click="handleCopy(v)">复制</vc-button>
          </view>
          <view class="log-item__content">
            <text>{{ v.text }}</text>
          </view>
        </view>

        <view class="safe-area-inset-bottom" />
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, reactive } from 'vue';
import type { VLogItem } from '../../../libs/core/log-capture';
import { getLogsRef, clearLogs } from '../../../libs/core/log-capture';
import { setClipboardData } from '../../../libs/utils/api';
import VcButton from '../shared/vc-button.vue';
import VcInput from '../shared/vc-input.vue';

defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'apply-shared',
  },
});

const levels = ['All', 'Info', 'Debug', 'Warn', 'Error'];

const allLogs = getLogsRef();
const filterValues = reactive({
  level: 0,
  keyword: '',
});

const levelLabel = computed(() => levels[filterValues.level]);

const displayLogs = computed(() => {
  let filteredLogs = allLogs.value;

  if (filterValues.level > 0) {
    const map = ['info', 'debug', 'warn', 'error'];
    const target = map[filterValues.level - 1];
    filteredLogs = filteredLogs.filter((v) => v.level === target);
  }

  const keyword = filterValues.keyword.trim();
  if (keyword) {
    filteredLogs = filteredLogs.filter((v) => (v.text ?? '').includes(keyword));
  }

  return filteredLogs as VLogItem[];
});

function handleLevelFilter() {
  uni.showActionSheet({
    itemList: levels,
    success: (res: any) => {
      if (typeof res?.tapIndex === 'number') {
        filterValues.level = res.tapIndex;
      }
    },
  });
}

function handleCopy(log: VLogItem) {
  setClipboardData(log.text);
}

function handleClear() {
  clearLogs();
}
</script>

<style lang="scss" scoped>
.vc-logs {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    flex-direction: row;
    padding: 8px 12px;
    border-bottom: 1px solid #d1fae5;

    .gap {
      width: 12px;
    }
  }

  &__body {
    flex: 1 1 0%;
    min-width: 0px;
    min-height: 0px;
  }
}

.log-item {
  padding: 8px 12px;
  border-bottom: 1px dashed #d1fae5;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;

    .log-meta {
      flex: 1 1 0%;
      display: flex;
      flex-direction: row;
      margin-right: 8px;

      .log-time {
        color: #047857;
        margin-right: 8px;
      }

      .log-level {
        color: #0284c7;
        font-weight: bold;
      }
    }
  }

  &__content {
    margin-top: 4px;
  }

  &--info {
    .log-meta .log-level {
      color: #0284c7;
    }
  }

  &--debug {
    .log-meta .log-level {
      color: #10b981;
    }
  }

  &--warn {
    .log-meta .log-level {
      color: #ca8a04;
    }
  }

  &--error {
    .log-meta .log-level {
      color: #b91c1c;
    }
  }
}

.safe-area-inset-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
