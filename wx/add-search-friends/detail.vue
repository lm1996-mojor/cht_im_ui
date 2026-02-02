<template>
  <view class="bgColor">
    <!-- ✅ 不变：纯左右布局 - 头像居左 资料居右 完美保留 -->
    <view class="user-info-box">
      <view class="avatar-left">
        <user-avatar
          class="user-avatar"
          :modelValue="userInfo.avatar"
        ></user-avatar>
      </view>
      <view class="info-right">
        <view class="user-nickname">{{ userInfo.nickname || '用户昵称' }}</view>
        <view class="user-account"
          >微聊号：{{ userInfo.userId || form.userId }}</view
        >
        <view class="user-signature">{{
          userInfo.signature || '该用户暂无个人介绍'
        }}</view>
      </view>
    </view>

    <!-- ✅ ✨核心修正：两行列表项 【左图标 + 中文字 + 右箭头】可点击跳转 -->
    <view class="user-menu-list">
      <!-- 第一行：资料 -->
      <view class="menu-item" @click="goUserProfile">
        <view class="menu-icon">
          <uni-icons
            type="contact-filled"
            size="30"
            color="#2D8CF0"
          ></uni-icons>
        </view>
        <view class="menu-text">资料</view>
        <view class="menu-arrow">
          <uni-icons type="right" size="26" color="#C8C9CC"></uni-icons>
        </view>
      </view>
      <!-- 第二行：圈子 -->
      <view class="menu-item" @click="goUserCircle">
        <view class="menu-icon">
          <uni-icons
            type="moments-filled"
            size="30"
            color="#FF9500"
          ></uni-icons>
        </view>
        <view class="menu-text">圈子</view>
        <view class="menu-arrow">
          <uni-icons type="right" size="26" color="#C8C9CC"></uni-icons>
        </view>
      </view>
    </view>

    <!-- ✅ 不变：验证消息输入区 -->
    <view class="search-friends-send">
      <view class="search-friends-send-title"
        >你需要发送验证消息，等对方通过</view
      >
      <view class="search-friends-send-item">
        <textarea
          class="search-friends-send-textarea"
          auto-height
          placeholder="请输入验证信息..."
          maxlength="200"
          v-model="form.message"
        ></textarea>
      </view>
    </view>

    <!-- ✅ 不变：底部固定添加按钮 -->
    <view class="submit-btn-box">
      <view class="add-friend-btn" @click="subform">添加到通讯录</view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    userId: {
      type: String
    }
  },
  data() {
    return {
      userInfo: {},
      form: {
        userId: '',
        source: '',
        message: '',
        nickname: ''
      }
    }
  },
  onLoad(e) {
    this.form.userId = e.userId
    this.form.nickname = e.nickname
    this.form.source = e.source || 'search'
    this.getUserInfo()
  },
  methods: {
    // ✅ ✨不变：点击【资料】跳转列表页
    goUserProfile() {
      uni.navigateTo({
        url: `/pages/user/profile?userId=${this.form.userId}&type=profile`
      })
    },
    // ✅ ✨不变：点击【圈子】跳转列表页
    goUserCircle() {
      uni.navigateTo({
        url: `/pages/user/circle?userId=${this.form.userId}&type=circle`
      })
    },

    // ✅ 不变：获取用户信息 (已改好动态userId，无需修改)
    getUserInfo() {
      uni.showLoading({
        title: '加载中...',
        mask: true
      })
      this.$http.request({
        url: '/chat_im/friend/search?keyword=' + this.form.nickname,
        method: 'GET',
        success: res => {
          if (res.data.code == 200) {
            this.userInfo = res.data.data.content[0] || {}
          } else {
            uni.showToast({
              title: res.data.msg || '获取用户信息失败',
              icon: 'none'
            })
          }
        },
        fail: () => {
          uni.showToast({
            title: '网络异常，获取资料失败',
            icon: 'none'
          })
        },
        complete: () => {
          uni.hideLoading()
        }
      })
    },

    // ✅ 不变：提交申请 (所有bug修复都保留)
    subform() {
      var rules = {
        message: {
          rules: [
            {
              checkType: 'required',
              errorMsg: '请填写验证内容'
            }
          ]
        }
      }
      var formData = JSON.parse(
        JSON.stringify({
          friendId: this.form.userId,
          message: this.form.message
        })
      )
      var checkRes = this.$zmmFormCheck.check(formData, rules)
      if (checkRes) {
        this.$http.request({
          url: '/chat_im/friend/send/request',
          method: 'POST',
          data: JSON.stringify(formData),
          success: res => {
            if (res.data.code == 200) {
              uni.showToast({
                title: '好友申请发送成功，等待对方通过',
                icon: 'none',
                duration: 2000
              })
              setTimeout(() => {
                uni.navigateBack({ delta: 1 })
              }, 500)
            } else {
              uni.showToast({
                title: res.data.msg || '发送申请失败',
                icon: 'none'
              })
            }
          },
          fail: () => {
            uni.showToast({
              title: '网络异常，发送失败',
              icon: 'none'
            })
          }
        })
      } else {
        uni.showToast({
          title: this.$zmmFormCheck.error,
          icon: 'none',
          position: 'bottom'
        })
      }
    }
  },
  onNavigationBarButtonTap(e) {
    switch (e.index) {
      case 0:
        this.subform()
        break
      default:
        break
    }
  }
}
</script>

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
  padding-bottom: 120rpx;
}
/* #endif */
/* #ifdef H5 */
page {
  background: #ededed;
  padding-bottom: 120rpx;
}
/* #endif */

// ✅ 不变：用户资料 左头像右资料样式
.user-info-box {
  display: flex;
  align-items: center;
  padding: 30rpx 24rpx;
  background: #fff;
  margin: 20rpx 24rpx;
  border-radius: 20rpx;
  gap: 28rpx;

  .avatar-left {
    flex-shrink: 0;
  }
  .user-avatar {
    width: 140rpx;
    height: 140rpx;
    border-radius: 50%;
  }

  .info-right {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .user-nickname {
    font-size: 38rpx;
    color: #333;
    font-weight: 600;
    line-height: 1.2;
  }
  .user-account {
    font-size: 26rpx;
    color: #999;
  }
  .user-signature {
    font-size: 28rpx;
    color: #666;
    line-height: 1.5;
    word-break: break-all;
  }
}

// ✅ ✨核心修正：两行菜单列表 左图标+中文字+右箭头 样式 (完美符合你的要求)
.user-menu-list {
  background: #fff;
  margin: 0 24rpx 20rpx;
  border-radius: 20rpx;
  overflow: hidden;

  // 每行菜单样式 - 核心布局
  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 28rpx 24rpx;
    // 点击整行都能跳转，添加按压反馈
    &:active {
      background: #f8f8f8;
    }
    // 只有第一行加底部分割线，第二行不加
    &:nth-child(1) {
      border-bottom: 1px solid #f5f5f5;
    }
  }

  // 左侧图标容器
  .menu-icon {
    flex-shrink: 0;
    margin-right: 20rpx;
  }

  // 中间文字
  .menu-text {
    font-size: 30rpx;
    color: #333;
    flex: 1; // 文字占满中间宽度，箭头永远靠右
  }

  // 右侧跳转箭头 (灰色，标准移动端样式)
  .menu-arrow {
    flex-shrink: 0;
  }
}

// ✅ 不变：验证消息输入区样式
.search-friends-send {
  margin: 0 24rpx;
  background-color: #fff;
  border-radius: 20rpx;
  overflow: hidden;
}
.search-friends-send-item {
  padding: 24rpx;
}
.search-friends-send-textarea {
  width: 100%;
  min-height: 120rpx;
  font-size: 30rpx;
  color: #333;
  line-height: 1.6;
}
.search-friends-send-title {
  padding: 24rpx 24rpx 0;
  color: #999;
  font-size: 26rpx;
}

// ✅ 不变：底部添加按钮样式
.submit-btn-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 24rpx;
  background: #ededed;
  box-sizing: border-box;
  z-index: 99;
  .add-friend-btn {
    width: 100%;
    height: 90rpx;
    line-height: 90rpx;
    text-align: center;
    font-size: 32rpx;
    color: #fff;
    background: #1bc418;
    border-radius: 45rpx;
  }
}
</style>
