<template>
  <view class="note-page-wrap">
    <!-- 唯一滚动区域 -->
    <view class="note-create-page">
      <!-- 内容块列表 - 支持拖拽排序 -->
      <view
        class="content-block"
        v-for="(item, index) in contentList"
        :key="item.id"
        :style="{ marginBottom: '30rpx' }"
      >
        <!-- 排序拖拽按钮 -->
        <view
          class="drag-handle"
          @touchstart="e => handleDragStart(e, index)"
          @touchmove="e => handleDragMove(e, index)"
        >
          <text class="drag-icon">☰</text>
        </view>

        <!-- 标题块 - 新增删除按钮 -->
        <view
          v-if="item.dataType === 'title'"
          class="block-content title-block"
        >
          <input
            v-model="item.content"
            class="title-input"
            placeholder="请输入标题"
          />
          <view class="delete-btn" @click="deleteBlock(index)">删除</view>
        </view>

        <!-- 文本块 - 新增删除按钮 -->
        <view v-if="item.dataType === 'text'" class="block-content text-block">
          <textarea
            v-model="item.content"
            class="text-input"
            placeholder="请输入文本内容"
            auto-height
          />
          <view class="delete-btn" @click="deleteBlock(index)">删除</view>
        </view>

        <!-- 图片块 - 原有逻辑 -->
        <view v-if="item.dataType === 'image'" class="block-content">
          <view class="preview-wrap">
            <image :src="item.content" mode="aspectFill" class="preview-img" />
            <view class="delete-btn" @click="deleteBlock(index)">删除</view>
          </view>
        </view>

        <!-- 视频块 - 原有逻辑 -->
        <view v-if="item.dataType === 'video'" class="block-content">
          <view class="preview-wrap">
            <video :src="item.content" class="preview-video" controls />
            <view class="delete-btn" @click="deleteBlock(index)">删除</view>
          </view>
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
            <view class="delete-btn" @click="deleteBlock(index)">删除</view>
          </view>
        </view>
        <!-- 群名片 -->
        <view v-if="item.dataType === 'group'" class="block-content">
          <view class="preview-wrap">
            <view class="user">
              <group-avatar :modelValue="item.data.avatar"></group-avatar>
              <view>
                <view>{{ item.data.name }}</view>
                <!-- <view>{{ item.data.id }}</view> -->
              </view>
            </view>
            <view class="delete-btn" @click="deleteBlock(index)">删除</view>
          </view>
        </view>
      </view>

      <!-- 空状态提示 -->
      <view v-if="contentList.length === 0" class="empty-tips">
        点击底部按钮添加内容
      </view>
    </view>

    <!-- 底部固定操作栏 -->
    <view class="operate-bar">
      <view class="tool">
        <view class="tool-item" @click="addBlock('title')">
          <uni-icons type="font" size="30"></uni-icons>
          <text>标题</text>
        </view>
        <view class="tool-item" @click="addBlock('text')">
          <uni-icons type="font" size="30"></uni-icons>
          <text>文本</text>
        </view>
        <view class="tool-item" @click="chooseImageDirectly">
          <uni-icons type="image-filled" size="30"></uni-icons>
          <text>图片</text>
        </view>
        <view class="tool-item" @click="chooseVideoDirectly">
          <uni-icons type="videocam-filled" size="30"></uni-icons>
          <text>视频</text>
        </view>
        <view class="tool-item" @click="chooseVideoDirectly">
          <uni-icons type="location-filled" size="30"></uni-icons>
          <text>位置</text>
        </view>
        <view class="tool-item" @click="choosePerson">
          <uni-icons type="person-filled" size="30"></uni-icons>
          <text>名片</text>
        </view>
        <view class="tool-item" @click="chooseGroup">
          <uni-icons type="staff-filled" size="30"></uni-icons>
          <text>群名片</text>
        </view>
      </view>
      <view class="btn">
        <button class="preview-btn" flex="1" @click="showPreview">预览</button>
        <button class="submit-btn" flex="1" @click="submitNote">提交</button>
      </view>
    </view>
  </view>
  <uni-drawer
    ref="circleDrawer"
    mode="right"
    :mask-click="true"
    :show="false"
    :width="windowWidth"
    class="circle-drawer"
  >
    <view class="drawer-content">
      <uni-nav-bar
        :fixed="true"
        shadow
        status-bar
        left-icon="left"
        left-text="返回"
        title=""
        @click="closeCircleDrawer"
      />
      <scroll-view scroll-y style="flex: 1">
        <friend-list
          ref="circleListRef"
          :default-selected-id="noteForm.circleId"
          @select="handleCircleSelect"
        ></friend-list>
      </scroll-view>
      <!-- ✅ 确认按钮 现在正常显示了 -->
      <view class="circle-confirm-btn-wrap" style="margin: 20rpx">
        <button class="preview-btn" @click="confirmCircleSelect">
          确认选择
        </button>
      </view>
    </view>
  </uni-drawer>
  <uni-drawer
    ref="circleGroupDrawer"
    mode="right"
    :mask-click="true"
    :show="false"
    :width="windowWidth"
    class="circle-drawer"
  >
    <view class="drawer-content">
      <uni-nav-bar
        :fixed="true"
        shadow
        status-bar
        left-icon="left"
        left-text="返回"
        title=""
        @click="closeCircleGroupDrawer"
      />
      <scroll-view scroll-y style="flex: 1">
        <group-list
          ref="circleGroupListRef"
          :default-selected-id="noteForm.circleGroupId"
          @select="handleCircleGroupSelect"
        ></group-list>
      </scroll-view>
      <view class="circle-confirm-btn-wrap" style="margin: 20rpx">
        <button class="preview-btn" @click="confirmCircleGroupSelect">
          确认选择
        </button>
      </view>
    </view>
  </uni-drawer>
  <uni-drawer
    ref="noteDrawer"
    mode="right"
    :mask-click="true"
    :show="false"
    :width="windowWidth"
  >
    <view
      style="
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      "
    >
      <view style="flex: 1; height: 100%; overflow: auto">
        <note-preview
          ref="noteListRef"
          :contentList="contentList"
        ></note-preview>
      </view>
      <view style="padding: 20rpx">
        <button class="preview-btn" @click="closeNoteDrawer">返回编辑</button>
      </view>
    </view>
  </uni-drawer>
</template>

<script>
export default {
  name: 'NoteCreate',
  data() {
    return {
      // 内容块列表 - 只包含已选择/已添加的有效块
      contentList: [],
      // 排序相关
      dragStartIndex: -1,
      dragOverIndex: -1,
      // 存储所有内容块的位置信息
      blockRects: [],
      previewShow: false,
      windowWidth: 0,
      searchKeyword: '',
      circleId: '',
      noteId: '',
      circleName: '',
      content: '',
      files: null,
      address: '',
      noteForm: {},
      filteredAddressList: [],
      selectedCircleId: '',
      selectedCircle: {}
    }
  },
  onLoad(e) {
    this.noteId = e?.id
    if (this.noteId) {
      this.$http.request({
        url: `/chat_im/notes/detail/${this.noteId}`,
        method: 'GET',
        success: res => {
          if (res.data.code == 200) {
            this.contentList = JSON.parse(res?.data?.data?.content || '[]')

            this.noteForm = res.data.data
            this.circleId = res.data.data.circleId
            this.circleName = res.data.data.circleName
            this.content = res.data.data.content
            this.address = res.data.data.address
          } else {
            uni.showToast({
              title: res.data.msg || '获取笔记详情失败',
              icon: 'none'
            })
          }
        },
        fail: () => {
          uni.showToast({
            title: '获取笔记详情失败，请检查网络',
            icon: 'none'
          })
        }
      })
    }
    // #ifdef H5
    this.windowWidth = document.documentElement.clientWidth
    // #endif

    // #ifndef H5
    uni.getSystemInfo({
      success: function (res) {
        this.windowWidth = res.windowWidth
      }
    })
    // #endif
  },
  methods: {
    closeNoteDrawer(item) {
      this.$refs.noteDrawer.close()
    },
    handleCircleSelect(item) {
      this.selectedCircleId = item.friendInfo.id
      this.selectedCircle = item.friendInfo
      console.log('选中的圈子', item)
    },
    handleCircleGroupSelect(item) {
      this.selectedCircleGroupId = item.id
      this.selectedCircleGroup = item
      console.log('选中的圈子', item)
    },
    closeCircleDrawer() {
      this.$refs.circleDrawer.close()
    },
    closeCircleGroupDrawer() {
      this.$refs.circleGroupDrawer.close()
    },
    confirmCircleSelect() {
      if (!this.selectedCircleId) {
        return uni.showToast({
          title: '请选择一个圈子',
          icon: 'none'
        })
      }
      const newBlock = {
        id: Date.now() + Math.random(), // 唯一ID
        type: 'user',
        content: this.selectedCircleId, // 标题/文本先添加空块
        // "content": "内容",
        dataType: 'user',
        order: 1,
        data: {
          ...this.selectedCircle
          // id: this.selectedCircle.id,
          // avatar:this.selectedCircle.avatar
        }
      }
      this.contentList.push(newBlock)
      this.updateBlockRects()
      // const selectItem = {
      // 	id: this.selectedCircleId,
      // 	name: this.$refs.circleListRef.content.find(item => item.id == this.selectedCircleId)?.name
      // }
      // this.noteForm.circleId = selectItem.id
      // this.noteForm.circleName = selectItem.name
      this.closeCircleDrawer()
    },
    confirmCircleGroupSelect() {
      if (!this.selectedCircleGroupId) {
        return uni.showToast({
          title: '请选择一个',
          icon: 'none'
        })
      }
      const newBlock = {
        id: Date.now() + Math.random(), // 唯一ID
        type: 'user',
        content: this.selectedCircleGroupId, // 标题/文本先添加空块
        // "content": "内容",
        dataType: 'group',
        order: 1,
        data: {
          ...this.selectedCircleGroup
          // id: this.selectedCircle.id,
          // avatar:this.selectedCircle.avatar
        }
      }
      this.contentList.push(newBlock)
      this.updateBlockRects()
      // const selectItem = {
      // 	id: this.selectedCircleId,
      // 	name: this.$refs.circleListRef.content.find(item => item.id == this.selectedCircleId)?.name
      // }
      // this.noteForm.circleId = selectItem.id
      // this.noteForm.circleName = selectItem.name
      this.closeCircleGroupDrawer()
    },
    choosePerson() {
      this.$refs.circleDrawer.open()
      this.$nextTick(() => {
        this.$refs.circleListRef.initLoad()
      })
    },
    chooseGroup() {
      this.$refs.circleGroupDrawer.open()
      this.$nextTick(() => {
        this.$refs.circleGroupListRef.initLoad()
      })
    },
    // 显示预览弹窗
    showPreview() {
      this.$refs.noteDrawer.open()
      // 禁止页面滚动
      // uni.setStyle({
      //   selector: 'page',
      //   style: {
      //     overflow: 'hidden'
      //   }
      // });
    },
    // 新增标题/文本块（原有逻辑不变）
    addBlock(type) {
      const newBlock = {
        content: '',
        dataType: type,
        order: 1,
        data: {}
      }
      this.contentList.push(newBlock)
      this.updateBlockRects()
    },

    // 更新所有内容块的位置信息（拖拽用）
    updateBlockRects() {
      uni
        .createSelectorQuery()
        .in(this)
        .selectAll('.content-block')
        .boundingClientRect(rects => {
          this.blockRects = rects
        })
        .exec()
    },

    // 直接选择图片 - 选完才加块
    chooseImageDirectly() {
      var _self = this
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: e => {
          var imagePathArr = e.tempFilePaths
          var filePath = imagePathArr[0]
          uni.getFileInfo({
            filePath: filePath,
            success: function (infoRes) {
              _self.$http.uploadFile({
                url: '/chat_im/file/small/upload',
                filePath: filePath,
                name: 'file',
                filesType: 'image',
                fileName: '',
                header: {
                  // "Content-type":"multipart/form-data;charset=UTF-8"
                },
                formData: {
                  fileName: 'test',
                  fileType: 'image',
                  totalSize: infoRes.size
                },
                success: res => {
                  const url = JSON.parse(res?.data)?.data?.storagePath
                  // var data=JSON.parse(res.data)
                  // if (data.code == 200) {
                  // 	var formdata={
                  // 		type:'img',
                  // 		name:data.data.fileName,
                  // 		url:data.data.fullPath
                  // 	}
                  // 	this.updateCover(formdata)
                  // }
                  // if (res.tempFilePaths && res.tempFilePaths.length > 0) {
                  const newImageBlock = {
                    id: Date.now() + Math.random(),
                    dataType: 'image',
                    content: url,
                    order: 1
                  }
                  _self.contentList.push(newImageBlock)
                  _self.updateBlockRects()
                  // }
                }
              })
            },
            fail: () => {
              uni.showToast({
                title: '上传失败请检查网络',
                icon: 'none'
              })
            }
          })
        },
        fail: err => {
          if (err.errCode !== 1001) {
            // uni.showToast({
            // 	title: '图片选择失败',
            // 	icon: 'none'
            // });
          }
        }
      })
    },

    // 直接选择视频 - 选完才加块
    chooseVideoDirectly() {
      uni.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: res => {
          if (res.tempFilePath) {
            const newVideoBlock = {
              id: Date.now() + Math.random(),
              type: 'video',
              content: res.tempFilePath
            }
            this.contentList.push(newVideoBlock)
            this.updateBlockRects()
          }
        },
        fail: err => {
          if (err.errCode !== 1001) {
            uni.showToast({
              title: '视频选择失败',
              icon: 'none'
            })
          }
        }
      })
    },

    // 统一删除块方法（所有类型块复用）
    deleteBlock(index) {
      this.contentList.splice(index, 1)
      this.updateBlockRects()
    },

    // 拖拽开始 - 记录初始索引
    handleDragStart(e, startIndex) {
      this.dragStartIndex = startIndex
      this.updateBlockRects()
    },

    // 拖拽移动 - 核心排序逻辑
    handleDragMove(e) {
      if (this.dragStartIndex === -1) return

      const touchY = e.touches[0].clientY
      const overIndex = this.calcOverIndexSync(touchY)

      if (
        overIndex !== -1 &&
        overIndex !== this.dragStartIndex &&
        this.dragOverIndex !== overIndex
      ) {
        const temp = this.contentList[this.dragStartIndex]
        this.contentList.splice(this.dragStartIndex, 1)
        this.contentList.splice(overIndex, 0, temp)

        this.dragOverIndex = overIndex
        this.updateBlockRects()
      }
    },

    // 同步计算触摸位置对应的块索引
    calcOverIndexSync(touchY) {
      if (this.blockRects.length === 0) return -1

      for (let i = 0; i < this.blockRects.length; i++) {
        const rect = this.blockRects[i]
        if (touchY >= rect.top && touchY <= rect.bottom) {
          return i
        }
      }
      return -1
    },

    // 提交笔记
    submitNote() {
      if (this.contentList.length === 0) {
        uni.showToast({
          title: '请添加至少一项内容',
          icon: 'none'
        })
        return
      }

      const submitData = {
        contentList: this.contentList.map(item => ({
          type: item.dataType,
          content: item.content
        }))
      }
      const newFormData = {
        title: '弹围绕着耶熟练棒呆干脆唉',
        content: JSON.stringify(this.contentList),
        category: 'tempor null',
        isPublic: 1,
        sharedUsers: 'aute',
        tag: 'cillum laboris dolore'
      }
      console.log('提交数据：', submitData)

      this.$http.request({
        url: '/chat_im/notes/create',
        method: 'POST',
        data: JSON.stringify(newFormData),
        success: res => {
          if (res.data.code == 200) {
            uni.showToast({
              title: '提交成功',
              icon: 'success'
            })
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              })
            }, 500)
          } else {
            uni.showToast({
              title: res.data.msg || '提交失败',
              icon: 'none'
            })
          }
        },
        fail: () => {
          uni.showToast({
            title: '提交失败，请检查网络',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
page {
  width: 100%;
  height: 100%;
  overflow: hidden !important;
}

.note-page-wrap {
  width: 100%;
  height: 100%;
  background-color: #f8f8f8;
  box-sizing: border-box;
  position: relative;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
}

/* 滚动区域 */
.note-create-page {
  width: 100%;
  height: 100%;
  padding: 30rpx;
  box-sizing: border-box;
  flex: 1;
  overflow: auto !important;
}

/* 空状态提示 */
.empty-tips {
  text-align: center;
  font-size: 28rpx;
  color: #999;
  margin-top: 100rpx;
}

/* 内容块样式 */
.content-block {
  display: flex;
  align-items: flex-start;
  background: #fff;
  border-radius: 10rpx;
  border: 1px solid #eee;
  /* padding: 20rpx; */
  /* position: relative; */
}

/* 拖拽手柄 */
.drag-handle {
  width: 60rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  color: #ccc;
  touch-action: none;
  cursor: move;
}

.drag-icon {
  font-size: 32rpx;
}

/* 内容块主体 */
.block-content {
  flex: 1;
  position: relative;
  /* 给删除按钮做定位父级 */
}

/* 标题块专属样式 - 相对定位承载删除按钮 */
.title-block {
  padding: 10rpx 0;
}

/* 标题输入框 */
.title-input {
  width: 100%;
  font-size: 32rpx;
  font-weight: 600;
  line-height: 48rpx;
  padding: 10rpx 0;
  border: none;
  outline: none;
}

/* 文本块专属样式 - 相对定位承载删除按钮 */
.text-block {
  padding: 10rpx 0;
}

/* 文本输入框 */
.text-input {
  width: 100%;
  font-size: 28rpx;
  line-height: 40rpx;
  padding: 10rpx 0;
  border: none;
  outline: none;
  min-height: 120rpx;
}

/* 图片/视频预览样式 */
.preview-wrap {
  width: 100%;
  position: relative;
  border-radius: 8rpx;
  overflow: hidden;
  .user {
    display: flex;
    gap: 4px;
    padding: 4px;
    align-items: center;
  }
}

.preview-img {
  width: 100%;
  height: 300rpx;
}

.preview-video {
  width: 100%;
  height: 300rpx;
}

/* 通用删除按钮样式 - 所有块共用 */
.delete-btn {
  position: absolute;
  top: 0rpx;
  right: 0rpx;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  font-size: 24rpx;
  padding: 8rpx 16rpx;
  border-radius: 6rpx;
  z-index: 10;
  /* 确保按钮在最上层 */
}

/* 底部操作栏 */
.operate-bar {
  /* position: fixed;
  bottom: 0;
  left: 0;
  right: 0; */
  display: flex;
  padding: 20rpx 30rpx;
  background: #fff;
  border-top: 1px solid #eee;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 10rpx;

  .tool {
    display: flex;
    justify-content: space-between;

    .tool-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 20rpx;
    }
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10rpx;
  }
}
.submit-btn {
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 40rpx;
  width: 100%;
}

.preview-btn {
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 40rpx;
  width: 100%;
}
.circle-confirm-btn-wrap {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
