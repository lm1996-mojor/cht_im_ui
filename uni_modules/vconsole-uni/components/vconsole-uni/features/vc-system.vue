<template>
  <view class="vc-system">
    <view class="vc-system__header">
      <vc-button @click="refresh">刷新</vc-button>
      <view class="gap" />
      <vc-button @click="handleCopy">复制信息</vc-button>
    </view>

    <view class="vc-system__body">
      <scroll-view scroll-y style="width: 100%; height: 100%">
        <view class="vc-section">
          <text class="vc-section__title">设备</text>
          <view class="vc-kv">
            <text class="k">品牌</text>
            <text class="v">{{ systemInfo.brand ?? '-' }}</text>
          </view>
          <view class="vc-kv">
            <text class="k">型号</text>
            <text class="v">{{ systemInfo.model ?? '-' }}</text>
          </view>
          <view class="vc-kv">
            <text class="k">平台</text>
            <text class="v">{{ systemInfo.platform ?? '-' }}</text>
          </view>
          <view class="vc-kv">
            <text class="k">系统</text>
            <text class="v">{{ systemInfo.system ?? '-' }}</text>
          </view>
          <view class="vc-kv">
            <text class="k">语言</text>
            <text class="v">{{ systemInfo.language ?? '-' }}</text>
          </view>
          <view class="vc-kv">
            <text class="k">屏幕</text>
            <text class="v"> {{ systemInfo.screenWidth }} x {{ systemInfo.screenHeight }} </text>
          </view>
          <view class="vc-kv">
            <text class="k">像素比</text>
            <text class="v">{{ systemInfo.pixelRatio }}</text>
          </view>
        </view>

        <view class="vc-section">
          <text class="vc-section__title">运行环境</text>
          <view class="vc-kv">
            <text class="k">App平台</text>
            <text class="v">{{ systemInfo.appPlatform ?? '-' }}</text>
          </view>
          <view class="vc-kv">
            <text class="k">App版本</text>
            <text class="v">{{ systemInfo.appVersion ?? '-' }}</text>
          </view>
          <view class="vc-kv">
            <text class="k">SDK版本</text>
            <text class="v">{{ systemInfo.SDKVersion ?? '-' }}</text>
          </view>
          <view class="vc-kv">
            <text class="k">网络</text>
            <text class="v">{{ netType ?? '-' }}</text>
          </view>
        </view>

        <view class="vc-section">
          <view class="vc-section__title">原始信息</view>
          <view class="pre">{{ prettyJson(systemInfo) }}</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { setClipboardData } from '../../../libs/utils/api';
import { prettyJson } from '../../../libs/utils/formatter';
import VcButton from '../shared/vc-button.vue';

defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'apply-shared',
  },
});

const systemInfo = ref<Record<string, any>>({});
const netType = ref<string | null>(null);

function refresh() {
  try {
    const s = uni.getSystemInfoSync();

    // 附加可能存在的 app 信息
    const appBase: any = (uni as any).getAppBaseInfo ? (uni as any).getAppBaseInfo() : {};

    systemInfo.value = { ...s, ...appBase };
  } catch (error) {
    systemInfo.value = { error: 'getSystemInfoSync failed', message: String(error) };
  }

  uni.getNetworkType({
    success(res) {
      netType.value = res.networkType;
    },
  });
}

function handleCopy() {
  setClipboardData(prettyJson(systemInfo.value));
}

onMounted(() => refresh());
</script>

<style scoped lang="scss">
.vc-system {
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

.vc-section {
  padding: 10px 12px;

  &__title {
    font-size: 13px;
    font-weight: bold;
    color: #047857;
    margin-bottom: 6px;
  }
}

.vc-kv {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px dashed #d1fae5;

  .k {
    color: #047857;
  }

  .v {
    color: #14532d;
  }
}

.pre {
  white-space: pre-wrap;
  background: #f7fff9;
  color: #14532d;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #d1fae5;
}
</style>
