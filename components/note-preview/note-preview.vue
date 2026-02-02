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
      <uni-card v-if="item.dataType === 'text'" class="preview-text" margin="0">
        {{ item.content || '请输入文本内容' }}
      </uni-card>

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
      <uni-card
        v-if="item.dataType === 'user'"
        @click="handleClickUserCard(item)"
        margin="0"
      >
        <view class="user">
          <user-avatar :modelValue="item.data.avatar"></user-avatar>
          <view>
            <view>{{ item.data.nickname }}</view>
            <view>{{ item.data.account }}</view>
          </view>
          <uni-icons
            type="forward"
            color="#999"
            size="30"
            style="flex: 1; text-align: right"
          ></uni-icons>
        </view>
      </uni-card>
      <!-- 群名片 -->
      <uni-card
        v-if="item.dataType === 'group'"
        @click="handleClickGroupCard(item)"
        margin="0"
      >
        <view class="user">
          <group-avatar :modelValue="item.data.avatar"></group-avatar>
          <view>
            <view>{{ item.data.name }}</view>
            <!-- <view>{{ item.id }}</view> -->
          </view>
          <uni-icons
            type="forward"
            color="#999"
            size="30"
            style="flex: 1; text-align: right"
          ></uni-icons>
        </view>
      </uni-card>
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
    },
    handleClickUserCard(e) {
      this.$emit('clickUser', e, 'user')
    },
    handleClickGroupCard(e) {
      this.$emit('clickGroup', e, 'group')
    }
  }
}
</script>

<style scoped>
/* 预览组件容器（全屏覆盖） */
.note-preview-wrap {
  padding: 10px;
  overflow: auto !important;
}

.user {
  display: flex;
  gap: 10px;
  /* padding: 4px; */
  align-items: center;
}

/* 预览内容滚动区 */
.preview-content {
  width: 100%;
  height: 100%;
  /* padding: 30rpx; */
  box-sizing: border-box;
}

/* 空状态提示 */
.empty-tips {
  text-align: center;
  font-size: 30rpx;
  color: #999;
  /* margin-top: 100rpx; */
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
  /* margin-bottom: 10rpx; */
  /* margin: 20rpx; */
}

/* 文本预览样式 */
.preview-text {
  font-size: 30rpx;
  line-height: 48rpx;
  color: #666;
  white-space: pre-wrap;
  word-wrap: break-word;
  /* margin: 20rpx; */
}

/* 媒体容器样式 */
.preview-media-wrap {
  width: 100%;
  border-radius: 8rpx;
  overflow: hidden;
  /* margin: 20rpx; */
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
