<template>
  <view class="vc-network">
    <view class="vc-network__header">
      <vconsole-button @click="handleClear">清空️</vconsole-button>
      <view class="gap" />
      <vconsole-button @click="handleMethodFilter">
        {{ methodLabel }}
      </vconsole-button>
      <view class="gap" />
      <vconsole-input
        v-model="filterValues.keyword"
        placeholder="搜索 URL"
        custom-style="flex: 1 1 0%"
      />
    </view>

    <view class="vc-logs__body">
      <scroll-view scroll-y style="width: 100%; height: 100%">
        <view
          v-for="v in displayNetworks"
          :key="v.id"
          class="net-item"
          :class="[v.ok ? 'net-item--success' : 'net-item--error']"
          @click="handleItemClick(v)"
        >
          <view class="net-item__header">
            <view class="net-meta">
              <text class="net-mth">{{ v.method }}</text>
              <text v-if="v.status != null" class="net-st">{{ v.status }}</text>
              <text class="net-dur">{{ v.duration }}ms</text>
            </view>
            <vconsole-button size="mini" @click="handleCopy(v)">复制</vconsole-button>
          </view>
          <view class="net-item__content">
            <text>{{ v.url }}</text>
          </view>
        </view>

        <view class="safe-area-inset-bottom" />
      </scroll-view>
    </view>

    <vconsole-overlay
      title="请求详情"
      :open="overlayVisible"
      :z-index="100001"
      @close="handleOverlayClose"
    >
      <scroll-view class="net-detail" scroll-y>
        <template v-if="selectedNetwork != null">
          <view class="kv">
            <text class="k">方法</text>
            <text class="v">{{ selectedNetwork.method }}</text>
          </view>
          <view class="kv">
            <text class="k">状态</text>
            <text class="v">{{ selectedNetwork.status ?? '-' }}</text>
          </view>
          <view class="kv">
            <text class="k">耗时</text>
            <text class="v">{{ selectedNetwork.duration }}ms</text>
          </view>
          <view class="kv">
            <text class="k">时间</text>
            <text class="v">{{ selectedNetwork.time }}</text>
          </view>
          <view class="kv">
            <text class="k">URL</text>
            <text class="v">{{ selectedNetwork.url }}</text>
          </view>

          <view class="sec">
            <text class="sec-title">请求头</text>
            <text class="sec-copy" @click="copyJson(selectedNetwork.requestHeaders)"> 复制 </text>
          </view>
          <text class="json">{{ prettyJson(selectedNetwork.requestHeaders, '-') }}</text>

          <view class="sec">
            <text class="sec-title">请求体</text>
            <text class="sec-copy" @click="copyJson(selectedNetwork.requestBody)"> 复制 </text>
          </view>
          <text class="json">{{ prettyJson(selectedNetwork.requestBody, '-') }}</text>

          <view class="sec">
            <text class="sec-title">响应头</text>
            <text class="sec-copy" @click="copyJson(selectedNetwork.responseHeaders)"> 复制 </text>
          </view>
          <text class="json">{{ prettyJson(selectedNetwork.responseHeaders, '-') }}</text>

          <view class="sec">
            <text class="sec-title">响应体</text>
            <text
              class="sec-copy"
              @click="copyJson(selectedNetwork.responseBody ?? selectedNetwork.responseBodySummary)"
            >
              复制
            </text>
          </view>
          <text class="json">
            {{
              prettyJson(selectedNetwork.responseBody ?? selectedNetwork.responseBodySummary, '-')
            }}
          </text>
        </template>

        <view class="safe-area-inset-bottom" />
      </scroll-view>
    </vconsole-overlay>
  </view>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
import type { VNetItem } from '../../../libs/core/network-capture';
import { getNetworkRef, clearNetwork } from '../../../libs/core/network-capture';
import { prettyJson } from '../../../libs/utils/formatter';
import { setClipboardData } from '../../../libs/utils/api';
import VconsoleOverlay from '../shared/vc-overlay.vue';
import VconsoleButton from '../shared/vc-button.vue';
import VconsoleInput from '../shared/vc-input.vue';

defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'apply-shared',
  },
});

const methods = ['All', 'GET', 'POST', 'PUT', 'DELETE', 'UPLOAD', 'DOWNLOAD'];

const overlayVisible = ref(false);
const allNetworks = getNetworkRef();
const filterValues = reactive({
  method: 0,
  keyword: '',
});
const selectedNetwork = ref<VNetItem | null>(null);

const methodLabel = computed(() => methods[filterValues.method]);

const displayNetworks = computed(() => {
  let filteredNetworks = allNetworks.value;

  if (filterValues.method > 0) {
    const target = methods[filterValues.method];
    filteredNetworks = filteredNetworks.filter((v) => v.method === target);
  }

  const keyword = filterValues.keyword.trim().toLowerCase();
  if (keyword) {
    filteredNetworks = filteredNetworks.filter((v) => v.url?.toLowerCase()?.includes(keyword));
  }

  return filteredNetworks as VNetItem[];
});

function handleMethodFilter() {
  uni.showActionSheet({
    itemList: methods.slice(0, 6),
    success: (res: any) => {
      if (typeof res?.tapIndex === 'number') {
        filterValues.method = res.tapIndex;
      }
    },
  });
}

function copyJson(obj: any) {
  const text = prettyJson(obj, '-');

  setClipboardData(text);
}

function handleItemClick(network: VNetItem) {
  selectedNetwork.value = network;
  overlayVisible.value = true;
}

function handleOverlayClose() {
  selectedNetwork.value = null;
  overlayVisible.value = false;
}

function handleCopy(network: VNetItem) {
  setClipboardData(network.url);
}

function handleClear() {
  clearNetwork();
}
</script>

<style lang="scss" scoped>
.vc-network {
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

.net-item {
  padding: 8px 12px;
  border-bottom: 1px dashed #d1fae5;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;

    .net-meta {
      flex: 1 1 0%;
      display: flex;
      flex-direction: row;
      margin-right: 8px;

      .net-mth {
        font-weight: bold;
        margin-right: 8px;
      }

      .net-st {
        margin-right: 8px;
      }

      .net-dur {
        color: #047857;
      }
    }
  }

  &__content {
    margin-top: 4px;
  }

  &--success {
    .net-meta .net-st {
      color: #10b981;
    }
  }

  &--error {
    .net-meta .net-st {
      color: #b91c1c;
    }
  }
}

.safe-area-inset-bottom {
  height: env(safe-area-inset-bottom);
}

.net-detail {
  width: 100%;
  height: 100%;

  .kv {
    display: flex;
    flex-direction: row;
    padding: 8px 12px;

    .k {
      min-width: 60px;
      color: #047857;
      margin-right: 8px;
    }

    .v {
      flex: 1 1 0%;
      min-width: 0px;
      min-height: 0px;
    }
  }

  .sec {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    margin-top: 6px;
    border-top: 1px dashed #d1fae5;

    .sec-title {
      font-weight: bold;
      margin-right: 8px;
    }

    .sec-copy {
      color: #047857;
    }
  }

  .json {
    white-space: pre-wrap;
    padding: 0 12px 12px;
  }
}
</style>
