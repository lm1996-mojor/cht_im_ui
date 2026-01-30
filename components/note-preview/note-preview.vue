<template>
  <view class="note-preview-wrap">
    <!-- 预览内容滚动区域 -->
    <!-- <scroll-view scroll-y class="preview-content"> -->
    <!-- 内容块列表 -->
    <view
      class="preview-block"
      v-for="(item, index) in contentList"
      :key="item.id"
      :style="{ marginBottom: '40rpx' }"
    >
      <!-- 标题块预览 -->
      <view v-if="item.dataType === 'title'" class="preview-title">
        {{ item.content || '请输入标题' }}
      </view>

      <!-- 文本块预览 -->
      <view v-if="item.dataType === 'text'" class="preview-text">
        {{ item.content || '请输入文本内容' }}
      </view>

      <!-- 图片块预览 -->
      <view v-if="item.dataType === 'image'" class="preview-media-wrap">
        <image
          :src="item.content"
          mode="widthFix"
          class="preview-img"
          @error="handleImageError"
        />
      </view>

      <!-- 视频块预览 -->
      <view v-if="item.dataType === 'video'" class="preview-media-wrap">
        <video
          :src="item.content"
          class="preview-video"
          controls
          show-center-play-btn
        />
      </view>
      <!-- 个人名片 -->
      <view v-if="item.dataType === 'user'" class="block-content">
        <view class="preview-wrap">
          <view class="user">
            <user-avatar :modelValue="item.data.avatar"></user-avatar>
            <view>
              <view>{{ item.data.nickname }}</view>
              <view>{{ item.data.account }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 空状态提示 -->
    <view v-if="contentList.length === 0" class="empty-tips">
      暂无内容可预览
    </view>
    <!-- </scroll-view> -->
  </view>
</template>

<script>
export default {
  name: 'NotePreview',
  // 接收父组件传递的属性
  props: {
    // 内容列表（必传）
    contentList: {
      type: Array,
      required: true,
      default: () => []
    },
    // 预览组件显隐状态
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 关闭预览（向父组件发送事件）
    handleClose() {
      this.$emit('close')
    },
    // 图片加载错误处理
    handleImageError(e) {
      // 替换为默认占位图（可根据项目路径调整）
      e.target.src = '/static/images/default-img.png'
    }
  }
}
</script>

<style scoped>
/* 预览组件容器（全屏覆盖） */
.note-preview-wrap {
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #fff;
  z-index: 9999;
  overflow: hidden;
  .user{
	  display: flex;
	  gap:4px;
	  padding:4px;
	  align-items: center;
  } */
}

/* 关闭按钮 */
.close-btn {
  position: fixed;
  top: 20rpx;
  right: 20rpx;
  width: 60rpx;
  height: 60rpx;
  line-height: 60rpx;
  text-align: center;
  font-size: 36rpx;
  color: #666;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  z-index: 10000;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

/* 预览内容滚动区 */
.preview-content {
  width: 100%;
  height: 100%;
  padding: 30rpx;
  box-sizing: border-box;
}

/* 空状态提示 */
.empty-tips {
  text-align: center;
  font-size: 30rpx;
  color: #999;
  margin-top: 100rpx;
}

/* 通用预览块样式 */
.preview-block {
  width: 100%;
}

/* 标题预览样式 */
.preview-title {
  font-size: 36rpx;
  font-weight: 700;
  line-height: 56rpx;
  color: #333;
  word-wrap: break-word;
  margin-bottom: 10rpx;
}

/* 文本预览样式 */
.preview-text {
  font-size: 30rpx;
  line-height: 48rpx;
  color: #666;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* 媒体容器样式 */
.preview-media-wrap {
  width: 100%;
  border-radius: 8rpx;
  overflow: hidden;
  margin-top: 10rpx;
}

/* 图片预览样式 */
.preview-img {
  width: 100%;
}

/* 视频预览样式 */
.preview-video {
  width: 100%;
  height: auto;
  min-height: 300rpx;
}
</style>
