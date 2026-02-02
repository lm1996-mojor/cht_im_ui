<template>
  <view class="note-list-page">
    <!-- 无内容组件自闭合，避免标签报错 -->

    <!-- 笔记列表容器 -->
    <view class="note-list-wrap">
      <view style="display: flex; justify-content: space-between; width: 100%">
        <label
          @click="selectFirstTen"
          class="radio"
          style="margin-bottom: 10rpx; margin-top: 20rpx"
        >
          <radio
            style="transform: scale(0.7); margin-bottom: 10rpx"
            value="r1"
            :checked="radioTenSelected"
            @click.stop="selectFirstTen"
          />
          选前10条
        </label>
        <!-- //绿色按钮 -->
        <view
          style="margin-bottom: 10rpx; margin-top: 20rpx; color: #09c160"
          @click="sendSelectedNotes"
          >发送</view
        >
      </view>
      <!-- 循环渲染笔记列表 -->
      <view
        class="note-item"
        v-for="(item, index) in content"
        :key="item.id"
        @click="gomsglist(item)"
        style="display: flex; align-items: center; margin-right: 10rpx"
      >
        <!-- 单个笔记radio：阻止冒泡 + 切换选中状态 + 动态绑定选中视觉 -->
        <label class="radio" @click.stop="toggleNoteSelect(item)">
          <radio
            style="transform: scale(0.7)"
            value="r1"
            @click.stop="toggleNoteSelect(item)"
            :checked="isSelected(item.id)"
          />
        </label>

        <!-- 移除未定义的 @click="onClick"，避免组件异常 -->
        <uni-card margin="0" spacing="0">
          <view class="card-box">
            <!-- 自定义头像组件：自闭合（无额外子内容） -->
            <user-avatar
              v-if="item?.imgItem?.content"
              :modelValue="item.imgItem.content || ''"
            />

            <!-- 笔记标题和描述 -->
            <view class="box-content">
              <text class="box-title">{{
                item?.titleItem?.content ||
                item?.textItem?.content ||
                '无标题笔记'
              }}</text>
              <text class="box-desc">{{
                item?.textItem?.content || '无详细内容'
              }}</text>
            </view>

            <!-- 公开/私有切换 -->
            <view class="box-icon" @click.stop="togglePublic(item)">
              <uni-icons v-if="item.isPublic !== 1" type="star" size="30" />
              <uni-icons v-else type="star-filled" size="30" color="orange" />
            </view>
          </view>

          <view class="box-footer">
            <text>{{ item.updatedAt || '暂无更新时间' }}</text>
            <view @click.stop="toggleMore(item)">
              <uni-icons type="more-filled" size="30" color="gray" />
            </view>
          </view>
        </uni-card>
      </view>
    </view>

    <!-- 加载更多组件：自闭合 -->
    <uni-load-more :status="queryParams.status" class="load-more" />

    <!-- 抽屉组件 -->
    <uni-drawer
      ref="circleDrawer"
      mode="right"
      :mask-click="true"
      :show="false"
      :width="windowWidth"
      class="circle-drawer"
    >
      <view
        class="drawer-content"
        style="display: flex; flex-direction: column"
      >
        <uni-nav-bar
          :fixed="true"
          shadow
          status-bar
          left-icon="left"
          left-text="返回"
          title=""
          @clickLeft="closeCircleDrawer"
        />
        <!-- <view class="drawer-header">
          <text class="drawer-title">选择好友</text>
          <text class="iconfont icon-close" @click="closeCircleDrawer"></text>
        </view> -->
        <scroll-view scroll-y style="flex: 1">
          <conversation-list
            ref="circleListRef"
            :default-selected-id="noteForm.circleId"
            @select="handleCircleSelect"
          />
        </scroll-view>
      </view>
    </uni-drawer>

    <!-- 弹窗组件 -->
    <uni-popup ref="popup" background-color="#fff" @change="change">
      <view class="popup-content">
        <view
          v-for="(option, index) in moreOptions"
          :key="index"
          class="popup-item"
          @click="handleMoreOptionClick(option)"
        >
          <uni-icons :type="option.icon" size="30" color="gray" />
          <text>{{ option.label }}</text>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      radioTenSelected: false,
      queryParams: {
        refreshing: false,
        status: 'more',
        page: 1,
        pageSize: 10,
        userId: '',
        searchType: 0,
        keyword: ''
      },
      noteForm: {
        circleId: ''
      },
      content: [],
      isLoading: false,
      selectedNotes: [], // 存储完整的笔记对象数组（核心：维护选中状态）
      moreOptions: [
        {
          label: '编辑',
          icon: 'compose'
        },
        {
          label: '删除',
          icon: 'trash-filled'
        }
      ],
      currentRow: {},
      windowWidth: 0 // 移到data根级，修复赋值无效问题
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
    sendSelectedNotes() {
      if (this.selectedNotes.length == 0) {
        uni.showToast({ title: '请选择笔记', icon: 'none' })
        return
      }
      if (this.$refs.circleDrawer) {
        this.$refs.circleDrawer.open()
        this.$nextTick(() => {
          if (this.$refs.circleListRef) {
            this.$refs.circleListRef.initLoad()
          }
        })
      } else {
        this.$refs.circleDrawer.open()
        this.$nextTick(() => {
          if (this.$refs.circleListRef) {
            this.$refs.circleListRef.initLoad()
          }
        })
      }
    },
    handleMoreOptionClick(option) {
      if (!this.$refs.popup) return
      this.$refs.popup.close()

      if (option.label === '编辑') {
        uni.navigateTo({
          url: '../notes/create?id=' + this.currentRow.id
        })
      } else if (option.label === '删除') {
        this.deleteNote()
      }
    },
    deleteNote() {
      uni.showModal({
        title: '提示',
        content: '你确定要删除这篇笔记吗？',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#666',
        confirmText: '确认',
        confirmColor: '#007aff',
        success: res => {
          if (res.confirm) {
            this.$http.request({
              url: `/chat_im/notes/delete/${this.currentRow.id}`,
              method: 'DELETE',
              success: res => {
                if (res.data.code == 200) {
                  this.handleRefresh()
                  uni.showToast({ title: '删除成功', icon: 'success' })
                } else {
                  uni.showToast({
                    title: res.data.msg || '删除失败',
                    icon: 'none'
                  })
                }
              },
              fail: () => {
                uni.showToast({
                  title: '删除失败，请检查网络',
                  icon: 'none'
                })
              }
            })
          } else if (res.cancel) {
            console.log('用户点击了取消')
            uni.showToast({ title: '操作已取消', icon: 'none' })
          }
        }
      })
    },
    toggleMore(item) {
      this.currentRow = item
      if (this.$refs.popup) {
        this.$refs.popup.open('bottom')
      }
    },
    togglePublic(item) {
      const isPublic = item.isPublic !== 1 ? 1 : 2
      this.$http.request({
        url: '/chat_im/notes/update',
        method: 'PUT',
        data: JSON.stringify({
          id: item.id,
          isPublic: isPublic
        }),
        success: res => {
          item.isPublic = isPublic
        },
        fail: () => {
          uni.showToast({
            title: '提交失败，请检查网络',
            icon: 'none'
          })
        }
      })
    },
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
      // this.selectedNotes = [] // 刷新时清空选中状态
      this.getlist()
    },
    closeCircleDrawer() {
      if (this.$refs.circleDrawer) {
        this.$refs.circleDrawer.close()
      }
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

    // ===== 多选功能核心方法（确保两个功能正常生效） =====
    /**
     * 判断单条笔记是否被选中（支撑单个radio的视觉绑定）
     * @param {String} noteId 笔记id
     * @returns {Boolean} 是否选中
     */
    isSelected(noteId) {
      return this.selectedNotes.some(note => note.id === noteId)
    },

    /**
     * 切换单个笔记的选中状态（单个radio点击核心）
     * @param {Object} item 完整笔记对象
     */
    toggleNoteSelect(item) {
      const noteId = item.id
      const index = this.selectedNotes.findIndex(note => note.id === noteId)
      if (index > -1) {
        // 已选中：从数组中移除，取消选中
        this.selectedNotes.splice(index, 1)
      } else {
        // 未选中：添加到数组，完成选中
        this.selectedNotes.push(item)
      }
    },

    /**
     * 选中前十条笔记（上方radio点击核心）
     */
    selectFirstTen(e) {
      if (!this.radioTenSelected) {
        const firstTenCount = Math.min(10, this.content.length)
        const firstTenNotes = this.content.slice(0, firstTenCount)
        this.selectedNotes = [...firstTenNotes]
      } else {
        this.selectedNotes = []
      }
      this.radioTenSelected = !this.radioTenSelected
    },

    /**
     * 辅助方法：判断是否已选中前十条（支撑上方radio的视觉同步）
     */
    isFirstTenSelected() {
      if (this.content.length === 0 || this.selectedNotes.length === 0)
        return false
      // 处理笔记不足10条的边界情况
      const actualFirstTenCount = Math.min(10, this.content.length)
      if (this.selectedNotes.length !== actualFirstTenCount) return false

      const firstTenIds = this.content
        .slice(0, actualFirstTenCount)
        .map(item => item.id)
      return this.selectedNotes.every(note => firstTenIds.includes(note.id))
    },

    /**
     * 清空所有选中状态（辅助功能，可选保留）
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
        if (this.$refs.circleDrawer) {
          this.$refs.circleDrawer.open()
          this.$nextTick(() => {
            if (this.$refs.circleListRef) {
              this.$refs.circleListRef.initLoad()
            }
          })
        }
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
.popup-content {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
  .popup-item {
    border-bottom: 1rpx solid #eeeeee;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8rpx;
    font-size: 28rpx;
    font-weight: 500;
    color: #333333;
    height: 88rpx;
  }
}
.card-box {
  display: flex;
  gap: 16rpx;
  .box-content {
    font-size: 28rpx;
    font-weight: 500;
    color: #333333;
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .box-title {
      font-size: 28rpx;
      font-weight: 500;
      color: #333333;
    }
    .box-desc {
      font-size: 24rpx;
      font-weight: 400;
      color: #666666;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .box-icon {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }
}
.box-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16rpx;
}
.note-list-page {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  box-sizing: border-box;
}
.multi-select-bar {
  width: 100%;
  padding: 16rpx 24rpx;
  box-sizing: border-box;
  display: flex;
  gap: 16rpx;
  background-color: #fafafa;
  border-bottom: 1rpx solid #eeeeee;
  .select-btn,
  .clear-btn {
    padding: 14rpx 28rpx;
    border-radius: 6rpx;
    font-size: 28rpx;
    border: none;
    color: #ffffff;
  }
  .select-btn {
    background-color: #007aff;
  }
  .clear-btn {
    background-color: #999999;
  }
}
.note-list-wrap {
  width: 100%;
  padding: 24rpx 24rpx;
  box-sizing: border-box;
}
.note-item {
  width: 100%;
  margin-bottom: 16rpx;
}
.note-card {
  width: 100%;
  background-color: #fafafa;
  border-radius: 6rpx;
  padding: 24rpx;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  .note-radio {
    position: static;
    margin-right: 20rpx;
    z-index: 10;
    .radio-wrap {
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%;
      border: 2rpx solid #cccccc;
      background-color: #ffffff;
      transition: background-color 0.2s ease;
      &.radio-checked {
        background-color: #007aff;
        border-color: #007aff;
      }
    }
  }
  .note-content-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8rpx;
  }
  .note-card-title {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }
}
.note-item-selected .note-card {
  background-color: #e6f0ff;
  border: 1rpx solid #007aff;
}
.note-title {
  font-size: 32rpx;
  font-weight: 400;
  color: #333333;
  line-height: 1.4;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
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
  background-color: #f0f7ff;
}
.private {
  color: #999999;
  background-color: #f5f5f5;
}
.load-more {
  width: 100%;
  margin-top: 16rpx;
  margin-bottom: 32rpx;
}
</style>
