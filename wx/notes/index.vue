<template>
  <view class="note-list-page">
    <watermark></watermark>

    <!-- 多选操作栏（极简样式） -->
    <view class="multi-select-bar">
      <button class="select-btn" @click="selectFirstTen">选前十</button>
      <button
        class="clear-btn"
        @click="clearAllSelect"
        v-if="selectedNotes.length > 0"
      >
        清空选中
      </button>
    </view>

    <!-- 笔记列表容器（简洁间距） -->
    <view class="note-list-wrap">
      <!-- 循环渲染笔记列表 -->
      <view
        class="note-item"
        v-for="(item, index) in content"
        :key="item.id"
        @click="gomsglist(item)"
        :class="{ 'note-item-selected': isSelected(item.id) }"
      >
        <!-- 笔记卡片主体（极简布局） -->
        <view class="note-card">
          <!-- 选择框（单选视觉，复选功能） -->
          <view class="note-radio" @click.stop="toggleNoteSelect(item)">
            <view
              class="radio-wrap"
              :class="{ 'radio-checked': isSelected(item.id) }"
            ></view>
          </view>

          <!-- 笔记内容容器（简洁排版） -->
          <view class="note-content-wrap">
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

            <!-- 是否公开标识（简洁样式） -->
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
    </view>

    <!-- 加载更多组件（简洁间距） -->
    <uni-load-more
      :status="queryParams.status"
      class="load-more"
    ></uni-load-more>
    <uni-drawer
      ref="circleDrawer"
      mode="right"
      :mask-click="true"
      :show="false"
      :width="windowWidth"
      class="circle-drawer"
    >
      <view class="drawer-content">
        <view class="drawer-header">
          <text class="drawer-title">选择好友</text>
          <text class="iconfont icon-close" @click="closeCircleDrawer"></text>
        </view>
        <scroll-view scroll-y style="flex: 1">
          <conversation-list
            ref="circleListRef"
            :default-selected-id="noteForm.circleId"
            @select="handleCircleSelect"
          ></conversation-list>
        </scroll-view>
      </view>
    </uni-drawer>
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
        windowWidth: 0,
        keyword: ''
      },
      noteForm: {
        circleId: ''
      },
      content: [],
      isLoading: false,
      selectedNotes: [] // 存储完整的笔记对象数组
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
    // #ifdef H5
    this.windowWidth = document.documentElement.clientWidth
    // #endif

    // #ifndef H5
    uni.getSystemInfo({
      success: res => {
        this.windowWidth = res.windowWidth
      }
    })
    // #endif
    this.handleRefresh()
  },
  onShow() {
    this.handleRefresh()
  },
  methods: {
    handleCircleSelect(item) {
      uni.showModal({
        title: '提示',
        content: '你确定要执行这个操作吗？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#666',
        confirmText: '确认',
        confirmColor: '#007aff',
        success: res => {
          if (res.confirm) {
            console.log('用户点击了确认')
            uni.showToast({ title: '操作成功', icon: 'success' })

            const promiseWorkList = []
            for (let i = 0; i < this.selectedNotes.length; i++) {
              promiseWorkList.push(
                new Promise((resolve, reject) => {
                  this.sendMsg(
                    JSON.stringify({
                      noteId: this.selectedNotes[i].id,
                      noteDetail: this.selectedNotes[i].content
                    }),
                    6,
                    item.id
                  )
                  resolve()
                })
              )
            }
            Promise.all(promiseWorkList)
              .then(res => {
                console.log('所有消息发送成功', res)
                uni.showToast({ title: '发送成功', icon: 'success' })
                this.handleRefresh()
              })
              .catch(err => {
                console.error('有消息发送失败', err)
                uni.showToast({ title: '有消息发送失败', icon: 'none' })
              })
          } else if (res.cancel) {
            console.log('用户点击了取消')
            uni.showToast({ title: '已取消操作', icon: 'none' })
          }
          this.closeCircleDrawer()
        },
        fail: err => {
          console.error('弹窗调用失败：', err)
        }
      })
    },
    sendMsg(e, msgType, conversationsId) {
      if (!e) return
      var userInfo = uni.getStorageSync('userInfo')
      var MessageOp = {
        OpHeartbeat: 0,
        OpAuth: 1,
        OpMessage: 2,
        OpMessageAck: 3,
        OpMessageRead: 4,
        OpMessageRecall: 5,
        OpTyping: 6,
        OpOnlineStatus: 7,
        OpGroupOperation: 8,
        OpError: 9
      }
      const token = uni.getStorageSync('Authorization')
      const msgOnlies = {
        op: MessageOp.OpMessage,
        seq: `auth-${Date.now()}`,
        data: {
          Authorization: `${token}`,
          fromUserId: userInfo.id,
          messageType: msgType || 1,
          content: e,
          conversationsId: conversationsId
        }
      }
      this.$ws.sendSocketMsg(msgOnlies)
    },
    handleRefresh() {
      if (this.isLoading) return
      this.queryParams.page = 1
      this.queryParams.status = 'more'
      this.queryParams.refreshing = true
      this.content = []
      this.selectedNotes = []
      this.getlist()
    },
    closeCircleDrawer() {
      this.$refs.circleDrawer.close()
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
            const imgItem = contentItem.find(item => item.dataType === 'image')
            const titleItem = contentItem.find(
              item => item.dataType === 'title'
            )
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

    // ===== 多选功能核心方法（精简，移除取消切换逻辑） =====
    /**
     * 判断笔记是否被选中
     * @param {String} noteId 笔记id
     * @returns {Boolean} 是否选中
     */
    isSelected(noteId) {
      return this.selectedNotes.some(note => note.id === noteId)
    },

    /**
     * 切换单个笔记的选中状态（复选功能保留）
     * @param {Object} item 完整笔记对象
     */
    toggleNoteSelect(item) {
      const noteId = item.id
      const index = this.selectedNotes.findIndex(note => note.id === noteId)

      if (index > -1) {
        this.selectedNotes.splice(index, 1)
      } else {
        this.selectedNotes.push(item)
      }
    },

    /**
     * 仅保留：选中前十条笔记（移除取消切换，恢复单一功能）
     */
    selectFirstTen() {
      if (this.content.length === 0) {
        uni.showToast({ title: '暂无笔记可选中', icon: 'none' })
        return
      }
      // 取前10条完整笔记对象，去重添加
      const firstTenNotes = this.content.slice(0, 10)
      const newSelectedNotes = [...this.selectedNotes]
      firstTenNotes.forEach(note => {
        if (!newSelectedNotes.some(n => n.id === note.id)) {
          newSelectedNotes.push(note)
        }
      })
      this.selectedNotes = newSelectedNotes

      uni.showToast({
        title: `已选中前${firstTenNotes.length}条笔记`,
        icon: 'success'
      })
    },

    /**
     * 清空所有选中状态（保留，功能必要）
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
      case 1:
        this.$refs.circleDrawer.open()
        this.$nextTick(() => {
          this.$refs.circleListRef.initLoad()
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
// 全局页面样式（极简简洁）
.note-list-page {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff; // 纯白背景，极简风格
  box-sizing: border-box;
}

// 多选操作栏（极简扁平）
.multi-select-bar {
  width: 100%;
  padding: 16rpx 24rpx;
  box-sizing: border-box;
  display: flex;
  gap: 16rpx;
  background-color: #fafafa; // 浅灰背景，区分页面
  border-bottom: 1rpx solid #eeeeee; // 细分割线，不突兀

  .select-btn,
  .clear-btn {
    padding: 14rpx 28rpx;
    border-radius: 6rpx; // 轻微圆角，简洁不夸张
    font-size: 28rpx;
    border: none;
    color: #ffffff;
  }

  .select-btn {
    background-color: #007aff; // 主色，简洁明了
  }

  .clear-btn {
    background-color: #999999; // 中性灰，不强调删除感
  }
}

// 笔记列表外层容器（简洁间距）
.note-list-wrap {
  width: 100%;
  padding: 24rpx 24rpx;
  box-sizing: border-box;
}

// 单个笔记项（极简，无多余动画）
.note-item {
  width: 100%;
  margin-bottom: 16rpx; // 紧凑间距，简洁清爽
}

// 笔记卡片样式（核心：极简布局，单选视觉选择框）
.note-card {
  width: 100%;
  background-color: #fafafa;
  border-radius: 6rpx; // 轻微圆角，极简风格
  padding: 24rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center; // 垂直居中

  // 选择框（单选视觉，复选功能）
  .note-radio {
    position: static;
    margin-right: 20rpx;
    z-index: 10;

    .radio-wrap {
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%; // 圆形，单选按钮视觉
      border: 2rpx solid #cccccc; // 浅灰边框，未选中状态
      background-color: #ffffff;
      transition: background-color 0.2s ease; // 仅保留填充过渡，简洁

      &.radio-checked {
        background-color: #007aff; // 填充主色，区分选中状态
        border-color: #007aff;
        // 无额外阴影，保持极简，仅通过填充区分
      }
    }
  }

  // 笔记内容容器（简洁排版）
  .note-content-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx; // 紧凑间距
  }

  .note-card-title {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }
}

// 选中卡片样式（极简高亮，不夸张）
.note-item-selected .note-card {
  background-color: #e6f0ff; // 浅淡主色背景，简洁区分选中
  border: 1rpx solid #007aff; // 细边框，不突兀
}

// 笔记标题（极简样式）
.note-title {
  font-size: 32rpx;
  font-weight: 400; // 常规粗细，极简清爽
  color: #333333; // 深灰文字，护眼简洁
  line-height: 1.4;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

// 是否公开标识（极简样式）
.note-public {
  width: 100%;
  text-align: left;
}

.public-text {
  font-size: 22rpx;
  padding: 4rpx 10rpx;
  border-radius: 12rpx;
  font-weight: 300;
}

.public {
  color: #007aff;
  background-color: #f0f7ff; // 更浅的背景，极简
}

.private {
  color: #999999;
  background-color: #f5f5f5;
}

// 加载更多组件（极简间距）
.load-more {
  width: 100%;
  margin-top: 16rpx;
  margin-bottom: 32rpx;
}
</style>
