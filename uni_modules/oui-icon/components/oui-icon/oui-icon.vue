<template>
  <view :class="rootClass" :style="rootStyle" @click="handleClick">
    <image v-if="isImage" class="oui-icon__image" :src="name" />
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CSSProperties } from 'vue';
import { addUnit, convertStyle, test } from '@/uni_modules/oui-utils';
import type { IconEmits } from './types';
import { iconProps } from './types';

defineOptions({
  name: 'oui-icon',
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'apply-shared',
  },
});

const emit = defineEmits<IconEmits>();

const props = defineProps(iconProps);

const isImage = computed(() => {
  return test.def(props.name) && props.name?.includes('/');
});

const rootClass = computed(() => {
  const prefix = props.classPrefix;
  return [prefix, props.customClass, isImage.value ? 'oui-icon--image' : `${prefix}-${props.name}`];
});

const rootStyle = computed(() => {
  let style: CSSProperties = {
    color: props.color,
    fontSize: addUnit(props.size),
  };

  if (props.customStyle) {
    style = { ...style, ...convertStyle(props.customStyle) };
  }

  return style;
});

const handleClick = (event: any) => {
  emit('click', event);
};
</script>

<style scoped lang="scss">
@use './icons.scss';
</style>
