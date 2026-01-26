<template>
  <textarea
    class="vc-textarea"
    :style="customStyle"
    :value="innerValue"
    :placeholder="placeholder"
    @input="handleInput"
    @confirm="handleConfirm"
  />
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

defineOptions({
  options: {
    virtualHost: true,
    addGlobalClass: true,
    styleIsolation: 'apply-shared',
  },
});

const props = defineProps({
  modelValue: String,
  placeholder: String,
  customStyle: String,
});
const emit = defineEmits<{
  (e: 'update:modelValue', value?: string): void;
  (e: 'confirm', value?: string): void;
}>();

const innerValue = ref<string>();

function handleInput(event: any) {
  innerValue.value = event.detail.value;

  emit('update:modelValue', innerValue.value);
}

function handleConfirm() {
  emit('confirm', innerValue.value);
}

watch(
  () => props.modelValue,
  () => {
    innerValue.value = props.modelValue;
  },
);
</script>

<style scoped>
.vc-textarea {
  padding: 8px 12px;
  border: 1px solid #d1fae5;
  background: #f7fff9;
  color: #14532d;
  height: 44px;
  border-radius: 4px;
}
</style>
