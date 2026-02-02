<template>
  <view class="bgColor">
    <form @submit="submitForm" class="remarkForm">
      <!-- 昵称 -->
      <view class="remarkForm-item">
        <view class="remarkForm-label">昵称</view>
        <input
          class="remarkForm-input"
          v-model="form.nickname"
          placeholder="请输入昵称"
        />
      </view>

      <!-- 头像上传 -->
      <view class="remarkForm-item">
        <view class="remarkForm-label">头像</view>
        <view class="avatar-upload">
          <image
            :src="form.avatar || '/static/img/default-avatar.png'"
            class="avatar-preview"
          ></image>
          <button class="upload-btn" @click="chooseAvatar">选择图片</button>
        </view>
      </view>

      <!-- 出生日期 -->
      <view class="remarkForm-item">
        <view class="remarkForm-label">出生日期</view>
        <uni-datetime-picker
          class="remarkForm-input"
          v-model="form.birthday"
          type="date"
          placeholder="请选择出生日期"
        ></uni-datetime-picker>
      </view>

      <!-- 性别 -->
      <view class="remarkForm-item">
        <view class="remarkForm-label">性别</view>
        <zmm-radio-group
          :range="genderList"
          v-model="form.gender"
        ></zmm-radio-group>
      </view>

      <!-- 提交按钮 -->
      <button form-type="submit" class="submit-btn">注册</button>
    </form>
  </view>
</template>

<script>
import uniDatetimePicker from '@/uni_modules/uni-datetime-picker/components/uni-datetime-picker/uni-datetime-picker.vue'

export default {
  components: {
    uniDatetimePicker
  },
  data() {
    return {
      form: {
        nickname: '', // 昵称
        avatar: '', // 头像URL
        birthday: '', // 出生日期（yyyy-MM-dd）
        gender: '' // 性别（1-男，2-女）
      },
      genderList: [
        { label: '男', value: '1' },
        { label: '女', value: '2' }
      ]
    }
  },
  methods: {
    // 选择头像
    chooseAvatar() {
      uni.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: res => {
          const tempFilePath = res.tempFilePaths[0]
          // 这里需要调用阿里OSS上传接口（参考项目现有OSS上传逻辑）
          this.uploadToOSS(tempFilePath).then(ossUrl => {
            this.form.avatar = ossUrl
          })
        }
      })
    },

    // 上传到阿里OSS（需结合项目现有OSS配置）
    uploadToOSS(tempPath) {
      return new Promise(resolve => {
        // 项目中已有阿里OSS上传逻辑，可参考现有文件上传代码
        // 示例：this.$oss.upload(tempPath).then(url => resolve(url))
        resolve(tempPath) // 临时使用本地路径，实际需替换为OSS上传逻辑
      })
    },

    // 表单提交
    submitForm() {
      // 表单验证
      const rules = {
        nickname: {
          rules: [{ checkType: 'required', errorMsg: '请输入昵称' }]
        },
        avatar: {
          rules: [{ checkType: 'required', errorMsg: '请上传头像' }]
        },
        birthday: {
          rules: [{ checkType: 'required', errorMsg: '请选择出生日期' }]
        },
        gender: {
          rules: [{ checkType: 'required', errorMsg: '请选择性别' }]
        }
      }

      const checkRes = this.$zmmFormCheck.check(this.form, rules)
      if (checkRes) {
        // 调用注册接口（传递新增字段）
        this.$http.request({
          url: '/user/register',
          method: 'POST',
          data: JSON.stringify(this.form),
          success: res => {
            if (res.data.code === 200) {
              uni.showToast({ title: '注册成功', icon: 'success' })
              setTimeout(() => {
                uni.navigateTo({ url: '/pages/login' })
              }, 1500)
            }
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
  }
}
</script>

<style scoped lang="scss">
/* 复用现有样式，保持一致性 */
.bgColor {
  /* 继承项目全局背景样式 */
  @extend .bgColor;
}

.remarkForm {
  @extend .remarkForm;
}

.remarkForm-item {
  @extend .remarkForm-item;
}

.remarkForm-label {
  @extend .remarkForm-label;
}

.remarkForm-input {
  @extend .remarkForm-input;
}

/* 头像上传样式 */
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 20rpx;
  padding: 20rpx 34rpx;
  background-color: #f7f7f7;
  border-radius: 12rpx;
}

.avatar-preview {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  object-fit: cover;
}

.upload-btn {
  padding: 20rpx 40rpx;
  background-color: #007aff;
  color: white;
  border-radius: 8rpx;
  font-size: 26rpx;
}

.submit-btn {
  width: 90%;
  margin: 40rpx auto;
  height: 100rpx;
  line-height: 100rpx;
  background-color: #007aff;
  color: white;
  border-radius: 12rpx;
  font-size: 32rpx;
}
</style>
