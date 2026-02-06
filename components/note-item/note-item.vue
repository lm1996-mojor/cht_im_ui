<template>
  <uni-card 
    :title="noteData?.titleItem?.content" 
    :sub-title="noteData?.textItem?.content" 
    extra=""
    :thumbnail="noteData?.imgItem?.content" 
    @click="onClick"
    margin="0"
  >
    <view slot="actions" class="card-actions">
		<view v-for="item in noteData.list" class="card-actions-item" @click.stop="actionsClick(item,'location')">
        <!-- <uni-icons :type="item.icon" size="18" color="#999"></uni-icons> -->
        <text class="card-actions-item-text">{{getActionText(item)}}</text>
      </view>
    </view>
    <text class="tag">笔记</text>
  </uni-card>
</template>

<script setup>
// 1. 导入需要的API和函数
import { computed } from 'vue'
import { getNoteLocation, getNoteVideo, getNoteCard, getItemByType } from '@/common/note.ts'

// 2. 定义组件props（Vue3的defineProps语法）
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => []
  }
})

// 3. 定义组件emit事件（Vue3的defineEmits语法）
const emit = defineEmits(['close', 'action'])

// 4. 定义方法（替代Vue2的methods）
// 关闭预览
const handleClose = () => {
  emit('close')
}

// 点击操作项
const actionsClick = (action) => {
  emit('action', action)
}

// 卡片点击事件（补充Vue2中缺失的实现）
const onClick = () => {
  console.log('卡片被点击', noteData.value)
  // 可根据需求扩展逻辑，比如emit自定义事件
}

// 5. 计算属性（替代Vue2的computed）
const noteData = computed(() => {
  const imgItem = getItemByType(props.data, 'image')
  const titleItem = getItemByType(props.data, 'title')
  const textItem = getItemByType(props.data, 'text')
  return {
    imgItem,
    titleItem,
    textItem,
	// 位置、视频、名片等子项
	list:getSubItems(props.data)
  }
})
const getSubItems = (data)=>{
	const locationItem = getItemByType(data, 'location')
	const videoItem = getItemByType(data, 'video')
	const userItem = getItemByType(data, 'user')
	return [
		locationItem,
		videoItem,
		userItem
	].filter(item => item)		
}
const getActionText = (item) => {
  if (item.dataType === 'location') {
    return '位置'
  } else if (item.dataType === 'video') {
    return '视频'
  } else if (item.dataType === 'user') {
    return '名片'
  }
  return item.content
}
</script>

<style scoped lang="scss">
// 保留原有样式，仅补充缺失的子项样式
.note-content-wrap {
  padding: 16rpx;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.note-card-title {
  display: flex;
  align-items: flex-start;
  gap: 12rpx;
}

.note-box {
  flex: 1;
  max-width: 550rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.note-title {
  font-size: 32rpx;
  color: #333333;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}

.note-content {
  font-size: 28rpx;
  color: #666666;
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  /* 多行省略备用方案
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  */
}

.tag {
  font-size: 20rpx;
  color: #888888;
  padding: 4rpx 10rpx;
  background-color: #f5f7fa;
  border-radius: 8rpx;
  width: fit-content;
}

.card-actions {
  display: flex;
  justify-content: space-between;
}

// 补充子项样式，让图标+文字排版更美观
.card-actions-item {
  display: flex;
  align-items: center;
  gap: 4rpx;
  font-size: 24rpx;
}

.card-actions-item-text {
  margin-left: 4px;
  color: #999;
}
</style>