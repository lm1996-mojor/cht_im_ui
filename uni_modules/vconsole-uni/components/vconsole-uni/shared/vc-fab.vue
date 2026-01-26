<template>
  <view
    class="vc-fab"
    :style="{ left: `${pos.x}px`, top: `${pos.y}px` }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @click.stop="emit('click')"
  >
    <oui-icon name="bug" size="28px" color="#ffffff" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { getVCPosStorage, setVCPosStorage } from '../../../libs/utils/storage';

defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'apply-shared',
  },
});

type Pos = {
  x: number;
  y: number;
};

const emit = defineEmits(['click']);

let dragging = false;
let startX = 0;
let startY = 0;
const sysInfo = uni.getSystemInfoSync();

function getVCPos() {
  const vcPos = getVCPosStorage();

  if (vcPos != null) {
    return vcPos;
  }

  return { x: 20, y: sysInfo.windowHeight - 100 };
}

function clampPos(x: number, y: number) {
  const w = 56;
  const h = 56;
  const nx = Math.max(8, Math.min(sysInfo.windowWidth - w - 8, x));
  const ny = Math.max(8, Math.min(sysInfo.windowHeight - h - 8, y));

  return { x: nx, y: ny };
}

const pos = ref<Pos>(getVCPos());

function handleTouchStart(e: TouchEvent) {
  dragging = true;

  const t = e.touches != null && e.touches.length > 0 ? e.touches[0] : null;

  if (t == null) {
    return;
  }

  startX = t.clientX - pos.value.x;
  startY = t.clientY - pos.value.y;
}

function handleTouchMove(e: TouchEvent) {
  if (!dragging) {
    return;
  }

  const t = e.touches && e.touches.length > 0 ? e.touches[0] : null;

  if (t == null) {
    return;
  }

  const nx = t.clientX - startX;
  const ny = t.clientY - startY;
  const np = clampPos(nx, ny);

  pos.value = np;
}

function handleTouchEnd() {
  if (!dragging) {
    return;
  }

  dragging = false;

  setVCPosStorage(pos.value);
}
</script>

<style scoped lang="scss">
.vc-fab {
  position: fixed;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background: #10b981;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
