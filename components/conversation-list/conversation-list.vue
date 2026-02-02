<template>
  <view class="circle-list-page">
    <!-- 搜索框区域 - 去掉fixed定位，适配抽屉布局 -->
    <view class="search-wrap">
      <input
        v-model="searchKeyword"
        class="search-input"
        placeholder="搜索好友名称/描述"
        @input="handleSearch"
      />
    </view>
    <!-- 好友列表区域 -->
    <view v-for="(v, i) in content" :key="i" class="friend-list">
      <uni-list-chat-wx
        color="#fff"
        :itemKey="i"
        :item="v"
        @longpressItem="longpressItem"
        :longTapItemKey="longTapItemKey"
        @click="clickChat(v)"
        clickable
        :title="v.nickname"
        :note="v.content"
        :time="v.time"
        badge-positon="left"
        :badge-text="v.unreadCount"
      ></uni-list-chat-wx>
    </view>
    <uni-load-more
      :status="queryParams.status"
      class="load-more"
      v-if="filteredContent.length > 0"
    />
  </view>
</template>

<script>
export default {
  // name: 'CircleList', // 你注释的保留不动
  props: {
    defaultSelectedId: {
      type: [String, Number],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      queryParams: {
        refreshing: false,
        status: 'more',
        page: 1,
        pageSize: 10,
        userId: '',
        searchType: 0,
        keyword: ''
      },
      content: [],
      filteredContent: [],
      isLoading: false,
      searchKeyword: '',
      selectedCircleId: ''
    }
  },
  computed: {
    cover() {
      return {
        type: 'img',
        url: 'https://cdn.svipaigc.com/bizi/2024/07/61b9.jpg'
      }
    },
    userInfo() {
      return this.$store.state.userInfo
    },
    topicReply() {
      return this.$store.state.topicReply
    }
  },
  watch: {
    defaultSelectedId: {
      immediate: true,
      handler(val) {
        this.selectedCircleId = val
      }
    }
  },
  mounted() {
    this.queryParams.userId = this.userInfo?.userId || ''
  },
  methods: {
    clickChat(item) {
      this.$emit('select', item)
    },
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
          url: '/chat_im/conversations/page?',
          queryParams: this.queryParams
        })
        .then(res => {
          const list = res?.list || []
          this.content =
            this.queryParams.page === 1 ? list : [...this.content, ...list]
          this.handleSearch()
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
    handleSearch() {
      if (!this.searchKeyword) {
        this.filteredContent = [...this.content]
        return
      }
      const keyword = this.searchKeyword.trim().toLowerCase()
      this.filteredContent = this.content.filter(item => {
        const nameMatch = item.name?.toLowerCase().includes(keyword) || false
        const descMatch =
          item.description?.toLowerCase().includes(keyword) || false
        return nameMatch || descMatch
      })
    },
    handleSelectItem(item) {
      if (this.disabled) return
      this.selectedCircleId = item.id
      this.$emit('select', item)
    },
    userClick(cover, user) {
      uni.navigateTo({ url: '../../wx/friendsCircle/person' })
    },
    initLoad() {
      this.handleRefresh()
    }
  }
}
</script>

<style scoped lang="scss">
// ✅✅✅ 仅修改这1行：把min-height:100vh 改成 height:auto 【按钮显示的核心原因】
.circle-list-page {
  height: auto; /* 原代码是min-height:100vh，仅此一行修改 */
  background-color: #ffffff;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  position: relative;
}
// ✅ 以下所有样式 完全和你原代码一致，一行未改
.search-wrap {
  padding: 20rpx 30rpx;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
  z-index: 99;
}
.search-input {
  height: 70rpx;
  line-height: 70rpx;
  padding: 0 20rpx;
  background-color: #f5f5f5;
  border-radius: 35rpx;
  font-size: 28rpx;
  width: 100%;
  box-sizing: border-box;
}
.note-list-wrap {
  width: 100%;
  padding: 0 !important;
  margin: 0 !important;
  box-sizing: border-box;
}
.note-item {
  width: 100%;
  padding: 0;
  margin: 0 !important;
  box-sizing: border-box;
  &:active {
    opacity: 0.95;
  }
  &.active {
    background-color: #f0f7ff;
  }
}
.note-card {
  background: #ffffff;
  padding: 24rpx;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  box-shadow: none !important;
  border-radius: 0 !important;
  border-bottom: 1px solid #f5f5f5;
  display: flex;
  align-items: flex-start;
  gap: 16rpx;
}
.radio-btn {
  width: 30rpx;
  height: 30rpx;
  flex-shrink: 0;
  margin-top: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
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
.card-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  margin-bottom: 20rpx;
  gap: 16rpx;
  position: relative;
  flex-shrink: 0;
  .avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 0 !important;
    flex-shrink: 0;
  }
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
      }
    }
  }
  .iconfont {
    font-family: 'iconfont' !important;
    font-size: 28rpx;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .icon-check:before {
    content: '\e602';
    color: #007aff;
    margin-left: 10rpx;
  }
}
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
.empty-tip {
  text-align: center;
  padding: 50rpx 0;
  font-size: 28rpx;
  color: #999;
}
.load-more {
  margin-top: 30rpx;
  margin-bottom: 50rpx;
  width: 100%;
  text-align: center;
}
</style>
