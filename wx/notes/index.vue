<template>
  <view class="note-list-page">
    <watermark></watermark>
    
    <!-- 新增：多选操作栏 -->
    <view class="multi-select-bar">
      <button class="select-btn" @click="selectFirstTen">一键选前十</button>
      <button class="clear-btn" @click="clearAllSelect" v-if="selectedNotes.length > 0">清空选中</button>
    </view>

    <!-- 笔记列表容器 -->
    <view class="note-list-wrap">
      <!-- 循环渲染笔记列表，保留原点击事件/key/循环源 完全不变 -->
      <view
        class="note-item"
        v-for="(item, index) in content"
        :key="item.id"
        @click="gomsglist(item)"
        :class="{ 'note-item-selected': isSelected(item.id) }" <!-- 新增：选中高亮样式 -->
      >
        <!-- 笔记卡片主体 -->
        <view class="note-card">
          <!-- 新增：复选框（阻止冒泡，避免触发跳转） -->
          <view class="note-checkbox" @click.stop="toggleNoteSelect(item)">
            <view class="checkbox-wrap" :class="{ 'checkbox-checked': isSelected(item.id) }">
              <uni-icons type="checkmark" size="20" color="#fff" v-if="isSelected(item.id)"></uni-icons>
            </view>
          </view>

          <view class="note-card-title">
            <user-avatar
              v-if="item?.imgItem?.content"
              :modelValue="item.imgItem.content"
            ></user-avatar>
            <!-- 笔记标题 -->
            <text class="note-title">{{
              item?.titleItem?.content || item?.textItem?.content
            }}</text>
          </view>

          <!-- 是否公开标识 -->
          <view class="note-public" v-if="item.isPublic !== null">
            <text
              class="public-text"
              :class="item.isPublic ? 'public' : 'private'"
            >
              {{ item.isPublic ? '公开笔记' : '私密笔记' }}
            </text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 加载更多组件 保留原逻辑 位置不变 -->
    <uni-load-more
      :status="queryParams.status"
      class="load-more"
    ></uni-load-more>
  </view>
</template>

<script>
export default {
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
      isLoading: false,
      // 新增：多选功能相关状态
      selectedNotes: [] // 存储选中的笔记id（核心：记录选中状态）
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
    this.handleRefresh()
  },
  onShow() {
    this.handleRefresh()
  },
  methods: {
    handleRefresh() {
      if (this.isLoading) return
      this.queryParams.page = 1
      this.queryParams.status = 'more'
      this.queryParams.refreshing = true
      this.content = []
      // 新增：下拉刷新清空选中状态
      this.selectedNotes = []
      this.getlist()
    },
    getlist() {
      if (this.isLoading) return
      this.isLoading = true
      this.queryParams.status = 'loading'
      this.$fc
        .loadMore({
          url: '/chat_im/notes/page?',
          queryParams: this.queryParams
        })
        .then(res => {
          const formatList = (res.list || []).map(item => {
            const contentItem = JSON.parse(item.content)
            // 找图片
            const imgItem = contentItem.find(item => item.dataType === 'image')
            // 找标题
            const titleItem = contentItem.find(
              item => item.dataType === 'title'
            )
            // 找文本
            const textItem = contentItem.find(item => item.dataType === 'text')
            return {
              ...item,
              imgItem,
              titleItem,
              textItem
            }
          })
          this.content =
            this.queryParams.page === 1
              ? formatList
              : [...this.content, ...formatList]
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
      uni.navigateTo({
        url: '../../wx/friendsCircle/person'
      })
    },
    gomsglist(e) {
      uni.navigateTo({
        url: './preview?noteId=' + e.id
      })
    },

    // ===== 新增：多选功能核心方法 =====
    /**
     * 判断笔记是否被选中
     * @param {String} noteId 笔记id
     * @returns {Boolean} 是否选中
     */
    isSelected(noteId) {
      return this.selectedNotes.includes(noteId)
    },

    /**
     * 切换单个笔记的选中状态
     * @param {Object} item 笔记对象
     */
    toggleNoteSelect(item) {
      const noteId = item.id
      if (this.isSelected(noteId)) {
        // 已选中：移除选中
        this.selectedNotes = this.selectedNotes.filter(id => id !== noteId)
      } else {
        // 未选中：添加选中
        this.selectedNotes.push(noteId)
      }
    },

    /**
     * 一键选前十条笔记
     */
    selectFirstTen() {
      if (this.content.length === 0) {
        uni.showToast({ title: '暂无笔记可选中', icon: 'none' })
        return
      }
      // 1. 取前10条笔记的id（不足10条则取全部）
      const firstTenIds = this.content.slice(0, 10).map(item => item.id)
      // 2. 去重并更新选中列表（避免重复选中）
      this.selectedNotes = [...new Set([...this.selectedNotes, ...firstTenIds])]
      // 3. 提示用户选中结果
      uni.showToast({
        title: `已选中前${firstTenIds.length}条笔记`,
        icon: 'success'
      })
    },

    /**
     * 清空所有选中状态（配套提升体验）
     */
    clearAllSelect() {
      this.selectedNotes = []
      uni.showToast({ title: '已清空所有选中', icon: 'success' })
    }
  },
  onPageScroll(e) {
    if (this.$refs['fcli']) this.$refs['fcli'].hidenTool()
  },
  onNavigationBarButtonTap(e) {
    switch (e.index) {
      case 0:
        uni.navigateTo({
          url: '../notes/create'
        })
        break
      default:
        break
    }
  },
  onPullDownRefresh() {
    this.handleRefresh()
  },
  onReachBottom() {
    this.getlist()
  }
}
</script>

<style scoped lang="scss">
// 页面全局容器
.note-list-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f5f7;
  box-sizing: border-box;
}

// 新增：多选操作栏样式
.multi-select-bar {
  width: 100%;
  padding: 20rpx 24rpx;
  box-sizing: border-box;
  display: flex;
  gap: 20rpx;
  background-color: #fff;
  border-bottom: 1rpx solid #f0f0f0;

  .select-btn, .clear-btn {
    padding: 16rpx 32rpx;
    border-radius: 8rpx;
    font-size: 28rpx;
    border: none;
    color: #fff;
  }

  .select-btn {
    background-color: #007aff;
  }

  .clear-btn {
    background-color: #ff3b30;
  }
}

// 笔记列表外层容器
.note-list-wrap {
  width: 100%;
  padding: 30rpx 24rpx;
  box-sizing: border-box;
}

// 单个笔记项 - 核心样式
.note-item {
  width: 100%;
  margin-bottom: 24rpx;
  // 新增：选中状态高亮
  &.note-item-selected {
    transform: scale(0.99);
  }
}

// 笔记卡片样式 - 美观的卡片效果
.note-card {
  width: 100%;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 30rpx 28rpx;
  box-sizing: border-box;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative; // 新增：用于复选框绝对定位

  // 新增：复选框样式
  .note-checkbox {
    position: absolute;
    top: 30rpx;
    right: 28rpx;
    z-index: 10;

    .checkbox-wrap {
      width: 36rpx;
      height: 36rpx;
      border-radius: 50%;
      border: 2rpx solid #ccc;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      transition: all 0.2s ease;

      &.checkbox-checked {
        background-color: #007aff;
        border-color: #007aff;
      }
    }
  }

  .note-card-title {
    display: flex;
    gap: 4px;
  }
}

// 新增：选中卡片的样式强化
.note-item-selected .note-card {
  border: 2rpx solid #007aff;
  box-shadow: 0 2rpx 15rpx rgba(0, 122, 255, 0.15);
}

// 笔记标题
.note-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.5;
  display: block;
  margin-bottom: 16rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 笔记内容简介
.note-content {
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
  margin-bottom: 20rpx;
}

// 标签+分类 容器
.note-tag-category {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
  margin-bottom: 16rpx;
}

// 笔记标签样式
.note-tag {
  font-size: 22rpx;
  color: #007aff;
  background-color: #e6f0ff;
  padding: 6rpx 12rpx;
  border-radius: 20rpx;
}

// 笔记分类样式
.note-category {
  font-size: 22rpx;
  color: #58c096;
  background-color: #e8f8f2;
  padding: 6rpx 12rpx;
  border-radius: 20rpx;
}

// 是否公开标识
.note-public {
  width: 100%;
  text-align: right;
  // 新增：避开复选框
  margin-right: 40rpx;
}

.public-text {
  font-size: 22rpx;
  padding: 4rpx 10rpx;
  border-radius: 12rpx;
}

// 公开笔记标识
.public {
  color: #007aff;
  background-color: #e6f0ff;
}

// 私密笔记标识
.private {
  color: #999;
  background-color: #f5f5f5;
}

// 加载更多组件间距
.load-more {
  width: 100%;
  margin-top: 20rpx;
  margin-bottom: 40rpx;
}
</style>