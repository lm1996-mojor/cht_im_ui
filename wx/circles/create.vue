<template>
  <view class="note-page-wrap">
    <!-- 唯一滚动区域 -->
    <scroll-view scroll-y class="note-create-page">
      <!-- 1. 圈子头像上传 - 左对齐调整 -->
      <view class="form-item avatar-item">
        <view class="form-label avatar-label">
          <text>上传圈子头像</text>
        </view>
        <view class="avatar-upload-wrap">
          <zmm-upload-image
            chooseType="chooseMedia"
            @oneComplete="upLoadoneComplete"
            ref="upup"
            v-model="noteForm.avatar"
            :limit="1"
            class="avatar-upload"
          >
            <!-- 自定义上传占位样式 -->
            <view class="avatar-placeholder" v-if="!noteForm.avatar.length">
              <text class="iconfont icon-camera"></text>
              <text class="placeholder-text">点击上传</text>
            </view>
            <image
              class="avatar-preview"
              v-else
              :src="noteForm.avatar[0].url || noteForm.avatar[0]"
              mode="aspectFill"
            ></image>
          </zmm-upload-image>
        </view>
      </view>

      <!-- 2. 圈子标题 -->
      <view class="form-item">
        <view class="form-label">
          <text>圈子标题</text>
          <text class="required-tag">*</text>
        </view>
        <input
          v-model="noteForm.name"
          class="form-input"
          placeholder="请输入圈子标题（2-20个字）"
          maxlength="20"
        />
      </view>

      <!-- 3. 圈子描述 - 字符计数移到输入框右下方 -->
      <view class="form-item">
        <view class="form-label">
          <text>圈子描述</text>
          <text class="required-tag">*</text>
        </view>
        <!-- 新增容器包裹文本域和字符计数 -->
        <view class="textarea-wrap">
          <textarea
            v-model="noteForm.description"
            class="form-textarea"
            placeholder="请输入圈子描述（最多200字符）"
            maxlength="200"
            :auto-height="true"
            :show-confirm-bar="false"
          ></textarea>
          <!-- 字符计数移到此处 -->
          <text class="char-count">{{ noteForm.description.length }}/200</text>
        </view>
      </view>

      <!-- 4. 加入方式 - 改为左右布局 -->
      <view class="form-item flex-row">
        <view class="form-label flex-nowrap">
          <text>圈子类型</text>
          <text class="required-tag">*</text>
        </view>
        <view class="select-box" @click="openCircleTypeDrawer">
          <text class="select-text">{{ circleTypeText }}</text>
          <uni-icons type="right" size="25" color="#999"></uni-icons>
        </view>
      </view>
    </scroll-view>

    <!-- 底部固定按钮区 -->
    <view class="btn-box">
      <button type="primary" class="btn submit-btn" @click="submitNote">
        创建
      </button>
    </view>

    <!-- 加入方式选择抽屉 - 改为底部弹出 -->
    <uni-drawer
      ref="circleTypeDrawer"
      mode="bottom"
      :mask-click="true"
      :show="false"
      :height="220"
      class="join-type-drawer"
    >
      <view class="drawer-content">
        <view class="drawer-header">
          <text class="drawer-title">选择加入方式</text>
          <text
            class="iconfont icon-close"
            @click="closeCircleTypeDrawer"
          ></text>
        </view>
        <view class="drawer-body">
          <view
            class="drawer-item"
            :class="{ active: noteForm.circleType === 1 }"
            @click="selectCircleType(1)"
          >
            <text class="item-text">仅邀请</text>
            <text
              class="iconfont icon-check"
              v-if="noteForm.circleType === 1"
            ></text>
          </view>
          <!-- <view
            class="drawer-item"
            :class="{ active: noteForm.circleType === 2 }"
            @click="selectCircleType(2)"
          >
            <text class="item-text">申请审核</text>
            <text
              class="iconfont icon-check"
              v-if="noteForm.circleType === 2"
            ></text>
          </view> -->
        </view>
      </view>
    </uni-drawer>
    <!-- 普通弹窗 -->
    <uni-popup ref="popup" background-color="#fff" @change="change">
      <view class="drawer-content">
        <!-- <view class="drawer-header">
          <text class="iconfont icon-close" @click="closeCircleTypeDrawer"></text>
        </view> -->
        <view class="drawer-body">
          <view
            v-for="item in circleTypeEnum"
            :key="item.value"
            class="drawer-item"
            :class="{ active: noteForm.circleType === item.value }"
            @click="selectCircleType(item.value)"
          >
            <text class="item-text">{{ item.label }}</text>
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<script>
export default {
  name: 'NoteCreate',
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
      // 核心表单字段
      noteForm: {
        name: '', // 圈名称
        avatar: [], // 头像【数组临时存储】
        description: '', // 圈简介
        circleType: 1 // 加入方式 默认值：1=仅邀请
      },
      // 上传相关变量
      limit: 9,
      type: 'IMAGE'
    }
  },
  computed: {
    // 加入方式文本显示
    circleTypeText() {
      return (
        this.circleTypeEnum.find(
          item => item.value === this.noteForm.circleType
        )?.label || ''
      )
    }
  },
  methods: {
    // 头像上传回调
    upLoadoneComplete(e, type) {
      if (e.type == 'VIDEO') {
        this.limit = 1
        this.type = 'VIDEO'
        var vlist = []
        for (var i = 0; i < this.noteForm.avatar.length; i++) {
          var item = this.noteForm.avatar[i]
          if (item.type == 'VIDEO') {
            vlist.push(item)
          }
        }
        this.noteForm.avatar = vlist
      } else {
        this.limit = 9
        this.type = 'IMAGE'
      }
    },

    // 打开加入方式选择抽屉
    openCircleTypeDrawer() {
      //   this.$refs.circleTypeDrawer.open()
      this.$refs.popup.open('bottom')
    },

    // 关闭加入方式选择抽屉
    closeCircleTypeDrawer() {
      this.$refs.circleTypeDrawer.close()
    },

    // 选择加入方式
    selectCircleType(type) {
      this.noteForm.circleType = type
      //   this.closeCircleTypeDrawer()
      this.$refs.popup.close()
    },

    // 重置表单
    resetForm() {
      this.noteForm = {
        name: '',
        avatar: [],
        description: '',
        circleType: 1
      }
      uni.showToast({
        title: '表单已重置',
        icon: 'success',
        duration: 1500
      })
    },

    // 提交表单
    submitNote() {
      // 表单验证
      if (!this.noteForm.name) {
        uni.showToast({
          title: '请输入圈子标题',
          icon: 'none'
        })
        return
      }
      if (this.noteForm.name.length < 2 || this.noteForm.name.length > 20) {
        uni.showToast({
          title: '圈子标题需2-20个字',
          icon: 'none'
        })
        return
      }
      if (!this.noteForm.description) {
        uni.showToast({
          title: '请填写圈子描述',
          icon: 'none'
        })
        return
      }
      if (!this.noteForm.avatar.length) {
        uni.showToast({
          title: '请上传圈子头像',
          icon: 'none'
        })
        return
      }

      // 构造提交数据
      const submitData = {
        name: this.noteForm.name,
        description: this.noteForm.description,
        circleType: this.noteForm.circleType,
        avatar: this.noteForm.avatar[0].url || this.noteForm.avatar[0]
      }

      // 提交请求
      this.$http.request({
        url: '/chat_im/circles/create',
        method: 'POST',
        data: JSON.stringify(submitData),
        success: res => {
          if (res.data.code == 200) {
            uni.showToast({
              title: '圈子创建成功',
              icon: 'success'
            })
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              })
            }, 500)
          } else {
            uni.showToast({
              title: res.data.msg || '创建失败，请重试',
              icon: 'none'
            })
          }
        },
        fail: () => {
          uni.showToast({
            title: '网络异常，请重试',
            icon: 'none'
          })
        }
      })
    }
  }
}
</script>

<style scoped>
/* ============ 全局样式 ============ */
page {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}

.note-page-wrap {
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  position: relative;
  background-color: #ffffff;
}

/* 页面头部 */
.page-header {
  height: 44px;
  line-height: 44px;
  background-color: #f8f8f8;
  text-align: center;
  border-bottom: 1px solid #eeeeee;
  position: sticky;
  top: 0;
  z-index: 99;
}

.header-title {
  font-size: 18px;
  font-weight: 500;
  color: #333333;
}

/* 滚动区域 */
.note-create-page {
  width: 100%;
  height: calc(100% - 44px);
  padding: 16px;
  box-sizing: border-box;
  background-color: #ffffff;
}

/* ============ 表单通用样式 ============ */
.form-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

/* 加入方式专用横向布局 */
.flex-row {
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

/* 防止标题换行 */
.flex-nowrap {
  flex: 0 0 auto;
  margin-bottom: 0;
}

.form-label {
  font-size: 15px;
  color: #333333;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

/* 必填标识 */
.required-tag {
  color: #ff4d4f;
  font-size: 14px;
  margin-left: 4px;
}

/* 标签提示文字 */
.label-tip {
  font-size: 12px;
  color: #999999;
  margin-left: 8px;
}

/* 弹性布局 */
.flex-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 输入框样式 */
.form-input {
  height: 44px;
  line-height: 44px;
  padding: 0 16px;
  background-color: #f8f8f8;
  border-radius: 6px;
  font-size: 15px;
  color: #333333;
  border: none;
  box-sizing: border-box;
}

/* 文本域容器 - 用于包裹文本域和字符计数 */
.textarea-wrap {
  position: relative;
  width: 100%;
}

/* 文本域样式 */
.form-textarea {
  width: 100%;
  min-height: 100px;
  padding: 16px;
  background-color: #f8f8f8;
  border-radius: 6px;
  font-size: 15px;
  color: #333333;
  border: none;
  line-height: 1.6;
  box-sizing: border-box;
  resize: none;
}

/* 字符计数 - 移到输入框右下方 */
.char-count {
  position: absolute;
  right: 16px;
  bottom: 10px;
  font-size: 12px;
  color: #999999;
  z-index: 1;
}

/* ============ 头像上传样式 ============ */
.avatar-item {
  margin-bottom: 24px;
}

.avatar-label {
  margin-bottom: 12px;
}

/* 头像上传左对齐 - 移除居中样式 */
.avatar-upload-wrap {
  display: flex;
  justify-content: flex-start; /* 左对齐 */
}

.avatar-upload {
  width: 120px;
  height: 120px;
}

/* 头像占位样式 */
.avatar-placeholder {
  width: 120px;
  height: 120px;
  background-color: #f8f8f8;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px dashed #dddddd;
}

.avatar-placeholder .iconfont {
  font-size: 24px;
  color: #999999;
  margin-bottom: 8px;
}

.placeholder-text {
  font-size: 12px;
  color: #999999;
}

/* 头像预览样式 */
.avatar-preview {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}

/* ============ 选择框样式 ============ */
.select-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  padding: 0 16px;
  background-color: #f8f8f8;
  border-radius: 6px;
  box-sizing: border-box;
  min-width: 120px; /* 保证选择框最小宽度 */
}

.select-text {
  font-size: 15px;
  color: #333333;
}

/* ============ 底部按钮样式 ============ */
.btn-box {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  background-color: #ffffff;
  border-top: 1px solid #eeeeee;
  z-index: 99;
}

.btn {
  width: 100%;
  height: 48px;
  line-height: 48px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  border: none;
}

.submit-btn {
  background-color: #007aff;
  color: #ffffff;
}

/* ============ 抽屉样式 ============ */
.join-type-drawer {
  --mask-background-color: rgba(0, 0, 0, 0.3);
}

.drawer-content {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
  border-radius: 12px 12px 0 0;
  overflow: hidden;
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eeeeee;
}

.drawer-title {
  font-size: 16px;
  font-weight: 500;
  color: #333333;
}

.drawer-body {
  padding: 8px 0;
}

.drawer-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px 20px;
  font-size: 15px;
  color: #333333;
}

.drawer-item.active {
  color: #007aff;
}

.item-text {
  font-size: 15px;
}

/* ============ 图标样式 ============ */
.iconfont {
  font-family: 'iconfont' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 图标定义 */
.icon-arrow-right:before {
  content: '\e600';
}

.icon-close:before {
  content: '\e601';
}

.icon-check:before {
  content: '\e602';
}

.icon-camera:before {
  content: '\e603';
}
</style>
