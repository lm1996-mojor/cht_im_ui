<template>
  <view class="bgColor">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <view class="user-avatar">
          <user-avatar :modelValue="data?.avatar" :imgSize="70" />
        </view>
        <view class="user-details">
          <view class="user-name">{{ data.nickname }}</view>
          <view class="user-id"
            >ID: {{ data.account }}
            <!-- 复制图标 -->
            <uni-icons type="wallet" size="20" color="#999"></uni-icons>
          </view>
        </view>
        <i class="fas fa-qrcode" style="font-size: 20px; opacity: 0.9"></i>
      </view>

      <view class="user-stats">
        <view class="stat-item">
          <view class="stat-value">{{ data.integralBalance }}</view>
          <view class="stat-label">积分</view>
        </view>
        <view class="stat-item">
          <!-- <view class="stat-value">1.2k</view> -->
          <view class="stat-label">
            <!-- 积分流水 -->
          </view>
        </view>
        <!-- <view class="stat-item">
          <view class="stat-value">2.4k</view>
          <view class="stat-label">粉丝</view>
        </view>
        <view class="stat-item">
          <view class="stat-value">86</view>
          <view class="stat-label">收藏</view>
        </view> -->
      </view>
    </view>

    <!-- 快捷操作 -->
    <!-- <view class="quick-actions">
      <view class="action-item" id="wallet-action">
        <view class="action-icon bg-purple">
          <i class="fas fa-wallet"></i>
        </view>
        <view class="action-title">钱包</view>
      </view>
      <view class="action-item" id="vip-action">
        <view class="action-icon bg-orange">
          <i class="fas fa-crown"></i>
        </view>
        <view class="action-title">会员</view>
      </view>
      <view class="action-item" id="collection-action">
        <view class="action-icon bg-pink">
          <i class="fas fa-heart"></i>
        </view>
        <view class="action-title">收藏</view>
      </view>
      <view class="action-item" id="history-action">
        <view class="action-icon bg-blue">
          <i class="fas fa-history"></i>
        </view>
        <view class="action-title">足迹</view>
      </view>
    </view> -->

    <!-- 功能列表 -->
    <view class="section-title">我的服务</view>
    <view class="menu-list">
      <view
        class="menu-item"
        id="order-item"
        @click="itemClick2('order-item', 0)"
      >
        <view class="menu-icon bg-green">
          <i class="fas fa-clipboard-list"></i>
        </view>
        <view class="menu-content">
          <view class="menu-title">
            {{ list2[0].title }}
          </view>
          <!-- <view class="menu-desc">查看所有订单，待付款、待收货</view> -->
        </view>
        <view class="menu-arrow">
          <i class="fas fa-chevron-right"></i>
        </view>
      </view>

      <view
        class="menu-item"
        id="address-item"
        @click="itemClick2('address-item', 1)"
      >
        <view class="menu-icon bg-teal">
          <i class="fas fa-map-marker-alt"></i>
        </view>
        <view class="menu-content">
          <view class="menu-title">
            {{ list2[1].title }}
          </view>
          <!-- <view class="menu-desc">管理我的收货地址</view> -->
        </view>
        <view class="menu-arrow">
          <i class="fas fa-chevron-right"></i>
        </view>
      </view>

      <view
        class="menu-item"
        id="coupon-item"
        @click="itemClick2('coupon-item', 2)"
      >
        <view class="menu-icon bg-orange">
          <i class="fas fa-tags"></i>
        </view>
        <view class="menu-content">
          <view class="menu-title">
            {{ list2[2].title }}
          </view>
          <!-- <view class="menu-desc">可用优惠券3张，即将过期2张</view> -->
        </view>
        <view class="menu-arrow">
          <i class="fas fa-chevron-right"></i>
        </view>
      </view>

      <!-- <view class="menu-item" id="service-item">
        <view class="menu-icon bg-cyan">
          <i class="fas fa-headset"></i>
        </view>
        <view class="menu-content">
          <view class="menu-title">客服中心</view>
          <view class="menu-desc">24小时在线客服，解答您的疑问</view>
        </view>
        <view class="menu-arrow">
          <i class="fas fa-chevron-right"></i>
        </view>
      </view> -->
    </view>

    <view class="section-title">系统设置</view>
    <view class="menu-list">
      <view class="menu-item" id="settings-item">
        <view class="menu-icon bg-blue">
          <i class="fas fa-cog"></i>
        </view>
        <view class="menu-content">
          <view class="menu-title">退出登录</view>
          <!-- <view class="menu-desc">账号、通知、隐私设置</view> -->
        </view>
        <view class="menu-arrow">
          <i class="fas fa-chevron-right"></i>
        </view>
      </view>

      <!-- <view class="menu-item" id="theme-item">
        <view class="menu-icon bg-deep-purple">
          <i class="fas fa-palette"></i>
        </view>
        <view class="menu-content">
          <view class="menu-title">主题与外观</view>
          <view class="menu-desc">切换日间/夜间模式，调整主题色</view>
        </view>
        <view class="menu-arrow">
          <i class="fas fa-chevron-right"></i>
        </view>
      </view> -->
      <!-- 
      <view class="menu-item" id="about-item">
        <view class="menu-icon bg-purple">
          <i class="fas fa-info-circle"></i>
        </view>
        <view class="menu-content">
          <view class="menu-title">关于我们</view>
          <view class="menu-desc">版本信息、用户协议、隐私政策</view>
        </view>
        <view class="menu-arrow">
          <i class="fas fa-chevron-right"></i>
        </view>
      </view> -->
    </view>

    <!-- 底部导航栏 -->
    <!-- <view class="bottom-nav">
      <view class="nav-item">
        <view class="nav-icon">
          <i class="fas fa-home"></i>
        </view>
        <view class="nav-label">首页</view>
      </view>

      <view class="nav-item">
        <view class="nav-icon">
          <i class="fas fa-compass"></i>
        </view>
        <view class="nav-label">发现</view>
      </view>

      <view class="nav-item">
        <view class="nav-icon">
          <i class="fas fa-comment"></i>
        </view>
        <view class="nav-label">消息</view>
      </view>

      <view class="nav-item active">
        <view class="nav-icon">
          <i class="fas fa-user"></i>
        </view>
        <view class="nav-label">我的</view>
      </view>
    </view> -->

    <!-- 弹窗 -->
    <view class="modal" id="detailModal">
      <view class="modal-content">
        <view class="modal-header">
          <view class="modal-title" id="modalTitle">功能详情</view>
          <view class="modal-close" id="modalClose">
            <i class="fas fa-times"></i>
          </view>
        </view>
        <view class="modal-body" id="modalBody">
          <p>这里是功能详情内容。</p>
        </view>
      </view>
    </view>
    <!-- <tool-list-wx :list="list"></tool-list-wx>
    <tool-list-wx :list="list3"></tool-list-wx>
    <tool-list-wx :list="list2" @itemClick="itemClick2"></tool-list-wx>
    <tool-list-wx :list="list4"></tool-list-wx>
    <tool-list-wx :list="list6"></tool-list-wx>
    <top-right-tool-wx ref="trtw"></top-right-tool-wx> -->
  </view>
</template>

<script>
export default {
  data() {
    return {
      list3: [
        // 	{
        // 	title: '视频号(未开通)',
        // 	path: '',
        // 	icon: '../../static/wx/t03.png',
        // 	else: [{
        // 		type: 'dotimg',
        // 		content: '../../static/img/avatar/avatar2.jpg'
        // 	}, {
        // 		type: 'text',
        // 		content: '两个朋友赞过'
        // 	}]
        // }, {
        // 	title: '直播(未开通)',
        // 	path: '',
        // 	icon: '../../static/wx/t11.png',
        // 	else: [{
        // 		type: 'dotimg',
        // 		content: '../../static/img/avatar/avatar2.jpg'
        // 	}, {
        // 		type: 'text',
        // 		content: '直播中'
        // 	}]
        // }
      ],
      list2: [
        {
          title: '我的笔记',
          path: '#',
          icon: '../../static/wx/t03.png',
          else: []
        },
        {
          title: '扫一扫',
          path: '#',
          icon: '../../static/wx/t02.png',
          else: []
        },
        {
          title: '我的圈子',
          path: '#',
          icon: '../../static/wx/t03.png',
          else: []
        }
        // {
        // 	title: '摇一摇',
        // 	path: '../../wx/shake/index',
        // 	icon: '../../static/wx/t12.png',
        // 	else: []
        // }, {
        // 	title: '附近',
        // 	path: '../../wx/nearby/index',
        // 	icon: '../../static/wx/t15.png',
        // 	else: []
        // }
      ],
      list4: [
        // 	{
        // 	title: '看一看(未开通)',
        // 	path: '',
        // 	icon: '../../static/wx/t13.png',
        // 	else: []
        // }, {
        // 	title: '搜一搜(未开通)',
        // 	path: '',
        // 	icon: '../../static/wx/t14.png',
        // 	else: []
        // }],
        // list6: [{
        // 	title: '购物(未开通)',
        // 	path: '',
        // 	icon: '../../static/wx/t16.png',
        // 	else: []
        // }, {
        // 	title: '游戏(未开通)',
        // 	path: '',
        // 	icon: '../../static/wx/t17.png',
        // 	else: []
        // }],
        // list7: [{
        // 	title: '小程序(未开通)',
        // 	path: '',
        // 	icon: '../../static/wx/t18.png',
        // 	else: []
        // }
      ],
      data: {}
    }
  },
  onShow() {
    this.$store.dispatch('tabBarpull')
    this.getUserInfo()
  },
  computed: {
    list() {
      return [
        {
          title: '朋友圈',
          type: this.$store.state.topicReply.count ? 'dottext' : '',
          path: '../../wx/friendsCircle/index',
          icon: '../../static/wx/t01.png',
          else: [
            {
              type: this.$store.state.topicRed.portrait ? 'dotimg' : '',
              content: this.$store.state.topicRed.portrait
                ? this.$store.state.topicRed.portrait
                : ''
            }
          ]
        }
      ]
    },
    topicRed() {
      return this.$store.state.topicRed
    }
  },
  onLoad() {},
  methods: {
    getUserInfo() {
      const userInfo = localStorage.getItem('userInfo')
      const userId = JSON.parse(userInfo)?.data?.id
      this.$http.request({
        url: `/chat_im/user/${userId}/detail`,
        method: 'GET',
        success: res => {
          if (res.data.code == 200) {
            this.data = res.data.data.detail
          } else {
          }
        },
        fail: () => {
          uni.showToast({
            title: '获取笔记详情失败，请检查网络',
            icon: 'none'
          })
        }
      })
    },
    itemClick2(e, i) {
      switch (i) {
        case 0:
          uni.navigateTo({
            url: '../../wx/notes/index'
          })
          break
        case 1:
          this.$fc.saoyisao()
          break
        case 2:
          uni.navigateTo({
            url: '../../wx/circles/index'
          })
          break
        default:
          break
      }
    }
  },
  onNavigationBarButtonTap(e) {
    switch (e.index) {
      case 0: //更多
        this.$refs['trtw'].showTab()
        break
      case 1: //搜索
        uni.navigateTo({
          url: '../search/index'
        })
        break
      default:
        break
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  font-family: 'Roboto', 'Noto Sans SC', sans-serif;
}

body {
  background-color: #f5f5f5;
  color: #333333;
  font-size: 14px;
  line-height: 1.5;
  overflow-x: hidden;
  padding-bottom: 70px; /* 为底部导航栏留出空间 */
}

/* 状态栏 */
.status-bar {
  height: 24px;
  background-color: #6200ee;
  color: white;
  padding: 0 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
}

.status-left {
  display: flex;
  align-items: center;
  gap: 5px;
}

.status-right {
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 应用栏 */
.app-bar {
  background-color: #6200ee;
  color: white;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.app-bar-title {
  font-size: 20px;
  font-weight: 500;
}

.app-bar-actions {
  display: flex;
  gap: 20px;
}

/* 用户信息卡片 */
.user-card {
  background: linear-gradient(135deg, #7c4dff 0%, #6200ee 100%);
  color: white;
  margin: 16px;
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: '';
  position: absolute;
  width: 200px;
  height: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: -100px;
  right: -50px;
}

.user-card::after {
  content: '';
  position: absolute;
  width: 150px;
  height: 150px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 50%;
  bottom: -80px;
  left: -50px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.user-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.3);
  overflow: hidden;
  margin-right: 16px;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 4px;
}

.user-id {
  font-size: 14px;
  opacity: 0.9;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  position: relative;
  z-index: 1;
  margin-top: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
}

/* 功能列表 */
.section-title {
  font-size: 16px;
  font-weight: 500;
  color: #666;
  padding: 16px 16px 8px;
}

.menu-list {
  background-color: white;
  margin: 0 16px 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:active {
  background-color: #f5f5f5;
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 18px;
  color: white;
  flex-shrink: 0;
}

.menu-content {
  flex: 1;
}

.menu-title {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 4px;
}

.menu-desc {
  font-size: 12px;
  color: #888;
}

.menu-arrow {
  color: #bbb;
  font-size: 16px;
}

/* 特殊功能卡片 */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding: 16px;
  background-color: white;
  margin: 0 16px 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-item:active {
  background-color: #f5f5f5;
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 18px;
  color: white;
}

.action-title {
  font-size: 12px;
  text-align: center;
}

/* 底部导航栏 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;
  max-width: 80px;
}

.nav-item:active {
  background-color: #f0f0f0;
}

.nav-item.active {
  color: #6200ee;
}

.nav-icon {
  font-size: 20px;
  margin-bottom: 4px;
}

.nav-label {
  font-size: 12px;
  font-weight: 500;
}

/* 颜色类 */
.bg-purple {
  background-color: #7c4dff;
}
.bg-blue {
  background-color: #2196f3;
}
.bg-teal {
  background-color: #009688;
}
.bg-orange {
  background-color: #ff9800;
}
.bg-pink {
  background-color: #e91e63;
}
.bg-green {
  background-color: #4caf50;
}
.bg-cyan {
  background-color: #00bcd4;
}
.bg-deep-purple {
  background-color: #673ab7;
}

/* 弹窗样式 */
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal.active {
  display: flex;
}

.modal-content {
  background-color: white;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  font-size: 18px;
  font-weight: 500;
}

.modal-close {
  font-size: 20px;
  color: #888;
  cursor: pointer;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.modal-close:active {
  background-color: #f5f5f5;
}

.modal-body {
  padding: 20px;
}

/* 响应式调整 */
@media (min-width: 768px) {
  body {
    max-width: 480px;
    margin: 0 auto;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    min-height: 100vh;
    position: relative;
  }

  .bottom-nav {
    max-width: 480px;
    margin: 0 auto;
    left: 50%;
    transform: translateX(-50%);
  }
}
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
</style>
