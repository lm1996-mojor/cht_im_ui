<template>
  <view class="note-list-page">
    <!-- TAB栏固定在原生导航下方 + 绝对不滚动 -->
    <view class="tab-nav">
      <view
        class="tab-item"
        :class="
          queryParams.extraParams.searchType === item.type ? 'active' : ''
        "
        v-for="item in tabList"
        :key="item.type"
        @click="changeTab(item.type)"
      >
        {{ item.name }}
      </view>
    </view>

    <!-- 列表容器避开固定TAB栏，无间距 -->
    <view class="note-list-wrap">
      <view
        class="note-item"
        v-for="item in content"
        :key="item.id"
        @click="gomsglist(item.id)"
      >
        <view class="note-card">
          <!-- 核心：头像 + 圈子名称 + 加入方式 一行展示 -->
          <view class="card-header">
            <!-- 方形头像 -->
            <image
              class="avatar"
              :src="
                item.avatar || 'https://cdn.svipaigc.com/bizi/2024/07/61b9.jpg'
              "
              mode="aspectFill"
            />
            <!-- 圈子名称 + 公开/私密标签 -->
            <view class="header-info">
              <view class="title-box">
                <text class="note-title">{{ item.name || '未命名圈子' }}</text>
                <text
                  class="public-text"
                  :class="{
                    public: item.circleType == 1,
                    private: item.circleType == 2,
                    custom: item.circleType == 3
                  }"
                  v-if="item.circleType !== null"
                >
                  {{
                    circleTypeEnum.find(t => t.value == item.circleType)
                      ?.label || ''
                  }}
                </text>
              </view>
            </view>
          </view>

          <!-- 圈子描述 -->
          <view
            class="note-content"
            v-html="item.description || '暂无圈子介绍'"
          ></view>
        </view>
      </view>
    </view>
    <!-- 加载更多组件 -->
    <uni-load-more :status="queryParams.status" class="load-more" />
  </view>
</template>

<script>
export default {
  navigationBarTitleText: '我的圈子',
  data() {
    return {
      // 圈子类型（1 公开圈 2 私密圈 3 定制圈）
      circleTypeEnum: [
        {
          value: 1,
          label: '公开圈'
        },
        {
          value: 2,
          label: '私密圈'
        },
        {
          value: 3,
          label: '定制圈'
        }
      ],
      tabList: [
        { type: 1, name: '我创建的' },
        { type: 2, name: '我加入的' },
        { type: 3, name: '我申请的' }
      ],
      queryParams: {
        refreshing: false,
        status: 'more',
        page: 1,
        pageSize: 10,
        userId: '',
        keyword: '',
        extraParams: {
          searchType: 1
        }
      },
      content: [],
      isLoading: false
    }
  },
  computed: {
    cover() {
      var cover = {
        type: 'img',
        url: 'https://cdn.svipaigc.com/bizi/2024/07/61b9.jpg'
      }
      return cover
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    topicReply() {
      return this.$store.state.topicReply
    }
  },
  onLoad() {
    this.queryParams.userId = this.userInfo?.userId || ''
    this.handleRefresh()
  },
  onShow() {
    this.handleRefresh()
  },
  methods: {
    formatTime(timeStr) {
      if (!timeStr) return '未知时间'
      const date = new Date(timeStr)
      if (date.toString() === 'Invalid Date') return '未知时间'
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hour = date.getHours().toString().padStart(2, '0')
      const minute = date.getMinutes().toString().padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    },
    changeTab(tabType) {
      if (this.queryParams.extraParams.searchType === tabType || this.isLoading)
        return
      this.queryParams.extraParams.searchType = tabType
      this.handleRefresh()
    },
    handleRefresh() {
      if (this.isLoading) return
      this.queryParams.page = 1
      this.queryParams.status = 'more'
      this.queryParams.refreshing = true

      this.content = []
      this.getlist()
    },
    getlist() {
      if (this.isLoading) return
      this.isLoading = true
      this.queryParams.status = 'loading'

      this.$fc
        .loadMore({
          url: '/chat_im/circles/page?',
          queryParams: this.queryParams
        })
        .then(res => {
          const list = res?.list || []
          this.content =
            this.queryParams.page === 1 ? list : [...this.content, ...list]
          if (list.length < this.queryParams.pageSize) {
            this.queryParams.status = 'noMore'
          } else {
            this.queryParams.status = 'more'
          }
        })
        .catch(err => {
          console.error('列表请求失败', err)
          this.queryParams.status = 'more'
        })
        .finally(() => {
          this.isLoading = false
          if (this.queryParams.refreshing) {
            uni.stopPullDownRefresh()
            this.queryParams.refreshing = false
          }
        })
    },
    userClick(cover, user) {
      uni.navigateTo({ url: '../../wx/friendsCircle/person' })
    },
    gomsglist(circleId) {
      uni.navigateTo({ url: '../circlesDynamic/index?circleId=' + circleId })
    }
  },
  onNavigationBarButtonTap(e) {
    switch (e.index) {
      case 0:
        uni.navigateTo({ url: '../circles/create' })
        break
      default:
        break
    }
  },
  onPullDownRefresh() {
    this.handleRefresh()
  },
  onReachBottom() {
    if (this.isLoading || this.queryParams.status === 'noMore') return
    this.queryParams.page += 1
    this.getlist()
  }
}
</script>

<style scoped lang="scss">
// 页面整体 - 纯白背景 无间距
.note-list-page {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  position: relative;
}

// TAB栏固定在原生导航下方 + 不滚动 + 层级置顶
.tab-nav {
  position: fixed;
  top: var(--status-bar-height) + 44rpx;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 88rpx;
  background: #ffffff;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #f5f5f5;
  overflow: hidden !important;
  white-space: nowrap !important;
  flex-wrap: nowrap !important;
  & > * {
    flex: 0 0 calc(100% / 3) !important;
    max-width: calc(100% / 3) !important;
    min-width: calc(100% / 3) !important;
  }
  .tab-item {
    height: 100%;
    line-height: 88rpx;
    text-align: center;
    font-size: 30rpx;
    color: #999999;
    transition: all 0.2s ease;
    padding: 0 !important;
    &.active {
      background: #f8f5ff; // 紫色浅背景
      color: #7B61FF; // 紫色主色
      font-weight: 700;
    }
  }
}

// 列表容器 - 无左右间距 完美避开TAB栏
.note-list-wrap {
  width: 100%;
  padding: calc(var(--status-bar-height) + 44rpx + 88rpx) 0 0 0 !important;
  margin: 0 !important;
  box-sizing: border-box;
}

// 列表项 - 彻底无间距 无缝衔接 无外边距
.note-item {
  width: 100%;
  padding: 0;
  margin: 0 !important;
  box-sizing: border-box;
  &:active {
    opacity: 0.95;
  }
}

// 移除所有卡片样式 - 无阴影/无圆角/无外边距 仅保留底部分割线
.note-card {
  background: #ffffff;
  padding: 24rpx;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  box-shadow: none !important;
  border-radius: 0 !important;
  border-bottom: 1px solid #f5f5f5;
}

// 核心：一行显示【方形头像 + 名称 + 加入方式】 无多余间距
.card-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 20rpx;
  gap: 16rpx;
  // 方形头像 - 核心修改：border-radius: 0
  .avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 0 !important; // 纯方形
    flex-shrink: 0; // 不压缩 保持方形
  }
  // 名称+公开私密标签 区域
  .header-info {
    flex: 1;
    height: 100%;
    display: flex;
    align-items: center;
    .title-box {
      display: flex;
      align-items: center;
      gap: 12rpx;
      .note-title {
        font-size: 30rpx;
        font-weight: 600;
        color: #1a1a1a;
        line-height: 1;
        max-width: 350rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .public-text {
        font-size: 22rpx;
        padding: 4rpx 10rpx;
        border-radius: 10rpx;
        line-height: 1;
        &.public {
          color: #10b981;
          background: #f0fdf4;
        }
        &.private {
          color: #ef4444;
          background: #fef2f2;
        }
        &.custom {
          color: #f59e0b;
          background: #fffbeb;
        }
      }
    }
  }
  // 加入方式标签 靠右侧 单行不换行
  .join-tag {
    font-size: 22rpx;
    padding: 6rpx 12rpx;
    border-radius: 12rpx;
    background: #f8f5ff; // 紫色浅背景
    color: #7B61FF; // 紫色主色
    flex-shrink: 0;
    white-space: nowrap;
  }
}

// 圈子描述 - 保留原有样式 阅读舒适
.note-content {
  font-size: 26rpx;
  color: #333333;
  line-height: 40rpx;
  width: 100%;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// 加载更多 - 居中展示
.load-more {
  margin-top: 30rpx;
  margin-bottom: 50rpx;
  width: 100%;
  text-align: center;
}
</style>