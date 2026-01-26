<template>
  <view v-if="open" class="vc-overlay-mask" :style="{ zIndex }">
    <view class="vc-overlay">
      <view class="vc-overlay__header">
        <text class="title">{{ title }}</text>
        <view class="close" @click="handleClose">
          <oui-icon name="close" size="20px" color="#ffffff" />
        </view>
      </view>

      <view class="vc-overlay__body">
        <slot></slot>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'apply-shared',
  },
});

defineProps({
  title: {
    type: String,
    default: 'vConsole',
  },
  open: {
    type: Boolean,
    default: false,
  },
  zIndex: {
    type: Number,
    default: 10001,
  },
});

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>

<style lang="scss" scoped>
.vc-overlay-mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.28);
}

.vc-overlay {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  top: auto;
  height: 84%;
  background: #f7fff9;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    background: #10b981;

    .title {
      color: #ffffff;
      font-size: 18px;
    }
  }

  &__body {
    flex: 1 1 0%;
    min-width: 0px;
    min-height: 0px;
    overflow: auto;
  }
}
</style>
