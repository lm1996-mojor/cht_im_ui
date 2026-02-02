<template>
  <view class="wx-login">
    <view class="xw-login-form">
      <form @submit="sublogin">
        <view class="xw-login-form-item">
          <view class="xw-login-form-label">头像</view>
          <image
            class="uni-list-chat__header-image"
            :style="{ width: 40 + 'px', height: 40 + 'px' }"
            :src="`../../static/img/avatar/avatar${avatar}.jpg`"
            mode="aspectFill"
            @click="openImgs"
          ></image>
        </view>
        <view class="xw-login-form-item">
          <view class="xw-login-form-label">昵称</view>
          <input
            class="xw-login-form-input"
            placeholder="请输入你的昵称"
            type="text"
            name="nickname"
            v-model="nickname"
          />
        </view>
        <view class="xw-login-form-item">
          <view class="xw-login-form-label">生日</view>
          <picker mode="date" :value="selectDate" @change="dateChange">
            <view class="picker-text">{{
              selectDate || '请选择你的生日'
            }}</view>
          </picker>
        </view>
        <view class="xw-login-form-item">
          <view class="xw-login-form-label">性别</view>
          <view class="radio-wrap">
            <radio-group name="gender" @change="radioChange">
              <radio value="1" :checked="gender === 1" /> 男
              <radio value="2" :checked="gender === 2" /> 女
            </radio-group>
          </view>
        </view>
        <view class="xw-login-form-item">
          <view class="xw-login-form-label">账号</view>
          <input
            class="xw-login-form-input"
            maxlength="11"
            placeholder="请填写账号"
            type="text"
            name="account"
            v-model="account"
          />
          <view
            class="login-form-icon login-form-seepass"
            @click="account = ''"
          >
            <uni-icons type="clear" size="26" color="#B9CCE0"></uni-icons>
          </view>
        </view>
        <view class="xw-login-form-item">
          <view class="xw-login-form-label">密码</view>
          <input
            class="xw-login-form-input"
            placeholder="请输入密码"
            name="password"
            :password="showPassword"
            type="text"
            v-model="password"
          />
          <view
            class="login-form-icon login-form-seepass"
            @click="changePassword"
          >
            <image
              src="../../static/img/l03.png"
              mode="aspectFill"
              v-if="showPassword"
            ></image>
            <image
              src="../../static/img/l04.png"
              mode="aspectFill"
              v-else
            ></image>
          </view>
        </view>
        <view class="xw-login-form-item">
          <view class="xw-login-form-label">确认密码</view>
          <input
            class="xw-login-form-input"
            placeholder="请输入确认密码"
            name="confirmPassword"
            :password="showConfirmPwd"
            type="text"
            v-model="confirmPassword"
          />
          <view
            class="login-form-icon login-form-seepass"
            @click="changeConfirmPassword"
          >
            <image
              src="../../static/img/l03.png"
              mode="aspectFill"
              v-if="showConfirmPwd"
            ></image>
            <image
              src="../../static/img/l04.png"
              mode="aspectFill"
              v-else
            ></image>
          </view>
        </view>

        <text class="xw-login-form-code" @click="goLogin">已注册，去登录</text>
        <button class="wx-btn wx-btn-info xw-login-form-btn" form-type="submit">
          注册
        </button>
        <view class="login-agree">
          <view class="login-agree-checkd">
            <checkbox
              @click="agree = !agree"
              style="transform: scale(0.7)"
              :checked="agree"
            />
            <text class="login-agree-btn" @click="agree = !agree"
              >已阅读并同意</text
            >
          </view>
          <view class="login-agree-text" @click="goagreement()"
            >《隐私及服务协议》</view
          >
        </view>
      </form>
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
        <image
          v-for="item in 45"
          :key="item"
          @click="selectImg(item)"
          class="uni-list-chat__header-image"
          :style="{ width: 60 + 'px', height: 60 + 'px' }"
          :src="`../../static/img/avatar/avatar${item}.jpg`"
          mode="aspectFill"
        ></image>
      </view>
    </uni-drawer>
  </view>
</template>

<script>
import http from '../../common/request'

export default {
  data() {
    return {
      code: '',
      loading: false,
      timer: null,
      time: 60,
      logintype: 0,
      showPassword: true, // 密码密文控制-布尔值
      showConfirmPwd: true, // 确认密码密文控制-独立变量
      agree: false,
      sexList: ['男', '女'],
      gender: 1, // 性别默认选中男
      account: '', // 账号绑定
      nickname: '', // 昵称绑定
      password: '', // 密码绑定
      confirmPassword: '', // 确认密码绑定
      selectDate: '', // 生日绑定变量 修复：新增
      cid: '',
      avatar: '1',
      type: 'IMAGE',
      windowWidth: 0
    }
  },
  onLoad() {
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
    openImgs(i) {
      this.$refs.circleDrawer.open()
    },
    selectImg(i) {
      this.avatar = i + ''
      this.$refs.circleDrawer.close()
    },
    // 密码显示/隐藏切换
    changePassword() {
      this.showPassword = !this.showPassword
    },
    // 确认密码显示/隐藏切换 修复：新增独立方法
    changeConfirmPassword() {
      this.showConfirmPwd = !this.showConfirmPwd
    },
    // 生日选择事件 修复：新增核心方法
    dateChange(e) {
      this.selectDate = e.detail.value
    },
    // 性别选择事件 修复：新增核心方法
    radioChange(e) {
      this.gender = e.detail.value
    },
    // 跳转登录页
    goLogin() {
      uni.navigateTo({
        url: '../login/index'
      })
    },
    // 打开协议
    goagreement() {
      this.$http.request({
        url: '/common/getAgreement',
        success: res => {
          if (res.data.code == 200) {
            // #ifdef H5
            window.open(res.data.data)
            // #endif
            // #ifdef APP-PLUS
            this.$fc.openWebView(res.data.data)
            // #endif
          }
        }
      })
    },
    // 获取验证码
    getMsgCode() {
      var reg = /^1[0-9]{10,10}$/
      if (!this.account || !reg.test(this.account)) {
        uni.showToast({
          title: '请输入正确的账号',
          icon: 'none'
        })
        return
      }
      this.loading = true
      this.timer = setInterval(() => {
        this.time--
        if (this.time <= 0) {
          clearInterval(this.timer)
          this.loading = false
          this.time = 60
        }
      }, 1000)
      var formData = {
        phone: this.account,
        type: '1' //注册
      }
      uni.request({
        url: '/sso/register',
        method: 'POST',
        data: JSON.stringify(formData),
        success: res => {
          if (res.data.code == 200) {
            this.code = res.data.data.code
            uni.showToast({
              title: '验证码已发送至你的账号',
              icon: 'none'
            })
          }
        }
      })
    },
    // 随机数工具
    rMathfloor(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    // 注册提交核心方法
    sublogin(e) {
      // 整合表单所有数据：原生表单值 + 绑定的性别/生日
      var formData = {
        ...e.detail.value,
        gender: this.gender,
        birthdayStr: this.selectDate,
        nickname: this.nickname,
        account: this.account,
        password: this.password,
        confirmPassword: this.confirmPassword,
        avatar: this.avatar
      }

      // 校验规则 修复：删除重复的nickName，保留nickname
      var rules = {
        nickname: {
          rules: [
            {
              checkType: 'required',
              errorMsg: '请填写昵称'
            },
            {
              checkType: 'string',
              checkRule: '1,20',
              errorMsg: '昵称请输入1-20位'
            }
          ]
        },
        account: {
          rules: [
            {
              checkType: 'required',
              errorMsg: '请填写账号'
            },
            {
              checkType: 'string',
              checkRule: '6,20',
              errorMsg: '账号请输入6-20位'
            }
          ]
        },
        password: {
          rules: [
            {
              checkType: 'required',
              errorMsg: '请输入密码'
            },
            {
              checkType: 'string',
              checkRule: '6,20',
              errorMsg: '密码请输入6-20位'
            }
          ]
        },
        confirmPassword: {
          rules: [
            {
              checkType: 'required',
              errorMsg: '请输入确认密码'
            },
            {
              checkType: 'string',
              checkRule: '6,20',
              errorMsg: '密码请输入6-20位'
            }
          ]
        }
      }

      // 自定义校验：生日必选
      if (!formData.birthdayStr) {
        uni.showToast({
          title: '请选择你的生日',
          icon: 'none'
        })
        return
      }
      // 自定义校验：两次密码一致
      if (formData.password !== formData.confirmPassword) {
        uni.showToast({
          title: '两次输入的密码不一致',
          icon: 'none'
        })
        return
      }
      console.log('ffffff', formData)
      var checkRes = this.$zmmFormCheck.check(formData, rules)
      if (checkRes) {
        if (!this.agree) {
          uni.showToast({
            title: '请先同意《隐私及服务协议》',
            icon: 'none'
          })
          return
        }
        uni.showLoading({
          title: '注册中..',
          mask: true
        })
        this.$http.request({
          url: '/chat_im/sso/register',
          method: 'POST',
          // header: { 'content-type': 'application/json' }, // 修复：新增请求头，后端必收
          data: JSON.stringify(formData),
          success: res => {
            uni.hideLoading()
            if (res.data.code == 200) {
              uni.showToast({
                title: '注册成功',
                icon: 'success',
                complete() {
                  setTimeout(() => {
                    uni.redirectTo({
                      url: '/wx/login/index'
                    })
                  }, 1500)
                }
              })
            } else {
              uni.showToast({
                title: res.data.msg || '注册失败',
                icon: 'none'
              })
            }
          },
          fail: e => {
            console.log('err', e)
            uni.hideLoading()
            console.log('register_err_log_show')
            uni.showToast({
              title: '网络异常，请重试',
              icon: 'none'
            })
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

<style lang="scss" scoped>
.wx-login-title {
  text-align: center;
  padding-top: 120rpx;
  font-size: 42rpx;
  padding-bottom: 24rpx;
}

.xw-login-form {
  padding: 34rpx;
}

.xw-login-form-item {
  position: relative;
  padding: 0 12rpx;
  border-bottom: 1px #eee solid;
  display: flex;
  flex-direction: row;
  align-items: center;
  line-height: 100rpx;
  height: 100rpx;
}

.xw-login-form-label {
  width: 160rpx;
  min-width: 160rpx;
}

.xw-login-form-input {
  flex: 1;
  font-size: 28rpx;
}

// 修复：生日选择器样式统一
.picker-text {
  flex: 1;
  font-size: 28rpx;
  color: #666;
}

.login-agree {
  margin-top: 34rpx;
  justify-content: center;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.login-agree-text,
.login-agree-btn {
  font-size: 24rpx;
  color: #222;
}

.login-agree-text {
  color: #8295a5;
}

.login-form-icon {
  width: 50rpx;
  height: 50rpx;
}

.login-form-seepass {
  position: absolute;
  right: 20rpx;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.login-form-icon image {
  float: left;
  width: 50rpx;
  height: 50rpx;
}

.xw-login-form-code {
  padding: 0 12rpx;
  height: 100rpx;
  line-height: 100rpx;
  color: #8295a5;
  display: block;
  text-align: right;
}

.wx-btn {
  min-width: 200rpx;
  height: 75rpx;
  line-height: 75rpx;
  text-align: center;
  border-radius: 12rpx;
  background-color: #007aff;
  color: #fff;
  font-size: 32rpx;
}

.wx-btn-info {
  background-color: #05c160;
}

// 修复：注册按钮居中显示
.xw-login-form-btn {
  width: 300rpx;
  margin: 120rpx auto 0;
  display: block;
}
.drawer-content {
  display: flex;
  gap: 20rpx;
  align-items: center;
  padding: 30rpx;
  flex-wrap: wrap;
  justify-content: space-evenly;
}
</style>
