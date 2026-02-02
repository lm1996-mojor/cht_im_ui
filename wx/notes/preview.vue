<template>
  <view class="note-page-wrap">
    <!-- 引入预览组件 -->
    <note-preview
      :content-list="contentList"
      :visible="true"
      @close="previewShow = false"
      @clickUser="handleClick"
    />
  </view>
</template>

<script>
export default {
  data() {
    return {
      // 内容块列表 - 只包含已选择/已添加的有效块
      contentList: [],
      windowWidth: 0,
      noteId: ''
    }
  },
  onLoad(e) {
    this.noteId = e.noteId
    this.getData()
  },
  methods: {
    getData() {
      this.$http.request({
        url: `/chat_im/notes/detail/${this.noteId}`,
        method: 'GET',
        success: res => {
          if (res.data.code == 200) {
            this.contentList = JSON.parse(res?.data?.data?.content || '[]')
          }
        }
      })
    },
    handleClick(e, type) {
      if (type === 'user') {
        uni.navigateTo({
          url: `../personInfo/detail?userId=${e.data.id}&source=${e.source}`
        })
      } else if (type === 'group') {
        uni.navigateTo({
          url: `../groupInfo/detail?groupId=${e.data.id}&source=${e.source}`
        })
      }
    }
  }
}
</script>

<style scoped>
/* 全局样式 */
/* page {
  width: 100%;
  height: 100%;
  overflow: hidden !important;
} */

.note-page-wrap {
  padding: 5px;
  width: 100%;
  /* height: 100vh; */
  background-color: #f8f8f8;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  margin-bottom: 20rpx;
}
</style>
