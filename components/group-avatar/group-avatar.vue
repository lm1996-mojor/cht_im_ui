<template>
  <view class="bgColor">
    <view class="wxgrouplist">
      <view class="wxgrouplist-item">
        <view class="wxgrouplist-imgs">
          <image
            v-for="(item, index) in JSON.parse(modelValue || '[]')"
            :key="index"
            :src="item > 0 ? `../../static/img/avatar/avatar${item}.jpg` : item"
            mode="aspectFill"
          ></image>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  props: {
    modelValue: {
      type: String,
      default: '[]'
    }
  },
  computed: {},
  onLoad(e) {},
  onShow() {},
  methods: {}
}
</script>

<!-- 修复：1. 声明 lang="scss"，支持嵌套语法解析 -->
<style scoped lang="scss">
/* #ifdef APP-PLUS */
.bgColor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ededed;
  overflow: auto;
}
/* #endif */

/* #ifdef H5 */
page {
  background: #ededed;
}
/* #endif */

.wxgrouplist {
  display: flex;
  flex-direction: column;
  margin-top: 10rpx;
}

.wxgrouplist-item {
  padding: 0 28rpx;
  background-color: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  /* 优化：给列表项添加底部边框，替代标题上的边框，布局更整齐 */
  border-bottom: 1rpx solid #f4f4f4;
}

.wxgrouplist-imgs {
  width: 80rpx;
  height: 80rpx;
  border-radius: 12rpx;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  background-color: #dedede;
}

.wxgrouplist-imgs image {
  margin: 2rpx;
  width: 36rpx;
  height: 36rpx;
}

.wxgrouplist-title {
  flex: 1;
  /* 移除：标题上的边框移到列表项上 */
  /* border-bottom: 1px #f4f4f4 solid; */
  font-size: 32rpx;
  color: #333;
  line-height: 105rpx;
  margin-left: 38rpx;
}

.radio-btn {
  width: 30rpx;
  height: 30rpx;
  flex-shrink: 0;
  //   margin-top: 20rpx;
  margin-right: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;

  /* 现在能正常解析 SCSS 嵌套 */
  &:active {
    opacity: 0.8;
  }

  .radio-icon {
    width: 28rpx;
    height: 28rpx;
    border: 2rpx solid #c9cacc;
    border-radius: 50%;
    box-sizing: border-box;
    transition: all 0.2s ease;

    /* 现在能正常解析 SCSS 嵌套，选中样式生效 */
    &.checked {
      border-color: #007aff;
      background-color: #007aff;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 12rpx;
        height: 12rpx;
        border-radius: 50%;
        background-color: #ffffff;
      }
    }
  }
}
</style>
