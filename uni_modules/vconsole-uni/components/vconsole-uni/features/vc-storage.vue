<template>
  <view class="vc-storage">
    <view class="vc-storage__header">
      <vc-button @click="handleReload">刷新</vc-button>
      <view class="gap" />
      <vc-button @click="handleClear">清空</vc-button>
    </view>

    <view class="vc-storage__body">
      <scroll-view scroll-y style="width: 100%; height: 100%">
        <view class="vc-section">
          <text class="vc-section__title">当前存储（{{ storageList.length }}）</text>
          <view v-for="v in storageList" :key="v.key" class="storage-item">
            <view class="storage-item__header">
              <text class="key">{{ v.key }}</text>
              <vc-button size="mini" @click="copyValue(v)">复制</vc-button>
            </view>
            <view class="storage-item__content">{{ prettyJson(v.value) }}</view>
          </view>
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

type StorageItem = { key: string; value: any };

const storageList = ref<StorageItem[]>([]);

function handleReload() {
  try {
    const info = uni.getStorageInfoSync();
    const list: StorageItem[] = [];

    for (const k of info.keys) {
      let v: any = null;

      try {
        v = uni.getStorageSync(k);
      } catch (error) {
        v = { error: String(error) };
      }

      list.push({ key: k, value: v });
    }

    storageList.value = list;
  } catch (error) {
    storageList.value = [{ key: 'ERROR', value: String(error) }];
  }
}

function copyValue(storage: StorageItem) {
  setClipboardData(prettyJson(storage.value));
}

function handleClear() {
  uni.clearStorageSync();
  handleReload();
}

onMounted(() => handleReload());
</script>

<style scoped lang="scss">
.vc-storage {
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

.storage-item {
  padding: 12px 0;
  border-bottom: 1px solid #d1fae5;

  &__header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .key {
      font-weight: bold;
      color: #14532d;
      max-width: 60%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &__content {
    margin-top: 4px;
    white-space: pre-wrap;
    background: #f7fff9;
    color: #14532d;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #d1fae5;
    max-height: 180px;
    overflow: auto;
  }
}
</style>
