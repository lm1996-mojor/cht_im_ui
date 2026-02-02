<template>
  <view class="bgColor">
    <!-- 好友信息展示区 -->
    <view class="person-wx" v-if="detail">
      <view class="person-wx-user">
        <image
          class="person-wx-avatar"
          @click="$fc.previewImagesolo(detail.portrait)"
          :src="
            detail?.friendInfo?.avatar > 0
              ? `../../static/img/avatar/avatar${detail?.friendInfo?.avatar}.jpg`
              : detail?.friendInfo?.avatar
          "
          mode="aspectFill"
        ></image>
        <view class="person-wx-user-detail">
          <view class="person-wx-nikename">
            <text class="text">{{ detail?.friendInfo?.nickname }}</text>
            <view
              class="wxfont person-wx-nikename-icon nan"
              v-if="detail.gender == '1'"
            ></view>
            <view
              class="wxfont person-wx-nikename-icon nv"
              v-if="detail.gender == '0'"
            ></view>
          </view>
          <text class="person-wx-name"
            >ID：{{ detail?.friendInfo?.account }}</text
          >
          <text class="person-wx-name" v-if="detail.provinces"
            >地区：{{ detail.provinces }} {{ detail.city }}</text
          >
          <view style="display: flex; gap: 10rpx; align-items: center">
            <text class="person-wx-name"
              >积分：{{ detail?.friendInfo?.integralBalance || 0 }}</text
            >
            <button
              style="margin: 0 10rpx; border-radius: 50rpx"
              type="default"
              size="mini"
              @click="inputDialogToggle"
            >
              赠送
            </button>
          </view>
        </view>
      </view>
    </view>
    <!-- 功能列表区 -->
    <tool-list-wx :list="list2" @itemClick="itemClick2"></tool-list-wx>
    <tool-list-wx
      :list="list3"
      type="btns"
      @itemClick="itemClick"
    ></tool-list-wx>
    <tool-list-wx
      :list="list4"
      v-if="detail.isFriend == 'N'"
      type="btns"
      @itemClick="itemClick4"
    ></tool-list-wx>
  </view>
  <!-- 输入框示例 -->
  <uni-popup ref="inputDialog" type="dialog">
    <uni-popup-dialog
      ref="inputClose"
      title="赠送积分"
      @confirm="dialogInputConfirm"
    >
      <input
        v-model="inputScoreValue"
        type="digit"
        class="uni-input"
        focus
        placeholder="请输入赠送积分"
      />
    </uni-popup-dialog>
  </uni-popup>
</template>

<script>
// #ifdef APP-PLUS
const TUICalling = uni.requireNativePlugin(
  'TUICallingUniPlugin-TUICallingModule'
)
// #endif
export default {
  data() {
    return {
      detail: '',
      userId: '',
      source: '',
      inputScoreValue: null,
      showtitleNViewBtns: false,
      // 功能列表1：来源/朋友圈
      list2: [
        {
          title: '来源',
          path: '#',
          else: [{ type: 'text', content: '' }],
          hideRight: true
        },
        { title: '朋友圈', path: '#' }
      ],
      // 功能列表2：发消息/音视频通话
      list3: [
        {
          title: '发消息',
          path: '#',
          icon: 'faxiaoxi'
        },
        {
          title: '音视频通话',
          path: '#',
          icon: 'shipin'
        }
      ],
      // 功能列表3：非好友时-添加到通讯录
      list4: [{ title: '添加到通讯录', path: '#' }]
    }
  },
  onLoad(e) {
    this.userId = e.userId
    this.source = e.source
  },
  onShow() {
    this.getUserInfo(this.userId)
  },
  mounted() {
    this.$fc.setTitleNViewBtns(0, '')
  },
  methods: {
    dialogInputConfirm() {
      if (!this.inputScoreValue) {
        uni.showToast({
          title: '请输入积分',
          icon: 'none'
        })
        this.inputScoreValue = null
        return
      }
      const integral = Number(this.inputScoreValue)
      if (integral <= 0) {
        uni.showToast({
          title: '请输入大于0的积分',
          icon: 'none'
        })
        this.inputScoreValue = null
        return
      }
      uni.showLoading({
        title: '正在赠送积分'
      })
      this.$http.request({
        url: `/chat_im/user/bonus/integral`,
        method: 'PUT',
        data: JSON.stringify({
          recipientUserId: this.userId,
          num: integral
        }),
        success: res => {
          uni.hideLoading()
          // this.value = val
          // 关闭窗口后，恢复默认内容
          this.$refs.inputDialog.close()
          uni.showToast({
            title: `成功赠送`,
            icon: 'none'
          })
          this.getUserInfo(this.userId)
        },
        fail: () => {
          uni.hideLoading()
          uni.showToast({
            title: '赠送失败，请检查网络',
            icon: 'none'
          })
        }
      })
      this.inputScoreValue = null
    },
    inputDialogToggle() {
      this.inputScoreValue = null
      this.$refs.inputDialog.open()
    },
    // 获取好友详情接口
    getUserInfo(friendId) {
      this.$http.request({
        url: `/chat_im/friend/detail?friendId=${friendId}`,
        success: res => {
          if (res.data.code == 200) {
            this.detail = res.data.data
            const { isFriend, userType } = this.detail
            // 非好友/非普通用户：隐藏 朋友圈+音视频通话
            if (userType !== 'normal' || isFriend == 'N') {
              this.showtitleNViewBtns = false
              this.list3.splice(1, 1)
              this.list2.splice(1, 1)
            } else {
              this.showtitleNViewBtns = true
              this.$fc.setTitleNViewBtns(0, '\ue623')
            }
            // 自己的资料页：显示朋友圈
            if (userType == 'self') {
              this.list2.push({ title: '朋友圈', path: '#' })
            }
            // 处理来源展示文案
            this.setSourceText()
          }
        }
      })
    },
    // 处理好友来源文案
    setSourceText() {
      let sourceText = ''
      if (this.detail.sourceLabel) {
        sourceText = this.detail.sourceLabel
      } else if (this.source) {
        const sourceMap = {
          1: '扫一扫',
          2: '名片',
          3: '微聊号',
          4: '手机号',
          5: '摇一摇',
          6: '系统',
          7: '群聊',
          8: '附近的人'
        }
        sourceText = sourceMap[this.source] || '无'
      } else {
        sourceText = '无'
      }
      this.list2[0].else[0].content = sourceText
    },
    // 来源/朋友圈 点击事件
    itemClick2(e, i) {
      if (i === 1) {
        uni.navigateTo({
          url: `../../wx/friendsCircle/person?userId=${this.userId}`
        })
      }
    },
    // 添加到通讯录 点击事件
    itemClick4(e, i) {
      if (i === 0) {
        uni.navigateTo({
          url: `../search-friends/add?userId=${this.detail.userId}&source=${this.source}`
        })
      }
    },
    // 发消息/音视频通话 点击事件
    itemClick(e, i) {
      const userInfo = uni.getStorageSync('userInfo')
      switch (i) {
        // 发消息-创建会话并跳转聊天页
        case 0:
          this.$http.request({
            url: '/chat_im/conversations/add',
            method: 'POST',
            data: JSON.stringify({
              participantIds: [this.userId, userInfo.id],
              title: this.detail.friendInfo.nickname,
              avatar: this.detail.friendInfo.avatar,
              type: 1
            }),
            success: res => {
              const conversationsId =
                res?.data?.data?.id || res?.data?.data?.conversationId
              uni.navigateTo({
                url: `../chatWindow/index?userId=${this.userId}&conversationsId=${conversationsId}`
              })
            }
          })
          break
        // 音视频通话-选择弹窗
        case 1:
          uni.showActionSheet({
            itemList: ['视频通话', '语音通话'],
            success: res => {
              res.tapIndex === 0 ? this.sendVideoCall() : this.sendVoiceCall()
            }
          })
          break
      }
    },
    // 发起语音通话
    sendVoiceCall() {
      uni.showLoading({ title: '发起语音通话' })
      const formdata = {
        userId: this.detail.userId,
        msgType: 'TRTC_VOICE_START',
        content: 'TRTC_VOICE_START'
      }
      this.callApi(formdata, 1)
    },
    // 发起视频通话
    sendVideoCall() {
      uni.showLoading({ title: '发起视频通话' })
      const formdata = {
        userId: this.detail.userId,
        msgType: 'TRTC_VIDEO_START',
        content: 'TRTC_VIDEO_START'
      }
      this.callApi(formdata, 2)
    },
    // 抽离音视频通话公共请求方法
    callApi(formdata, callType) {
      const userInfo = uni.getStorageSync('userInfo')
      this.$http.request({
        url: '/chat/sendMsg',
        method: 'POST',
        data: JSON.stringify(formdata),
        success: res => {
          uni.hideLoading()
          if (res.data.code == '200') {
            if (res.data.data.status !== '0') {
              return uni.showToast({
                title: res.data.data.statusLabel,
                icon: 'none'
              })
            }
            const uInfo = res.data.data.userInfo
            uni.setStorage({
              key: 'call',
              data: JSON.stringify({
                userId: uInfo.userId,
                trtcId: uInfo.trtcId,
                nickName: uInfo.nickName,
                portrait: uInfo.portrait,
                startTime: new Date().getTime(),
                type: callType == 1 ? 'audio' : 'video'
              }),
              success: () => {
                TUICalling.call({ userID: uInfo.trtcId, type: callType })
              }
            })
          }
        }
      })
    }
  },
  // 导航栏右侧编辑按钮点击事件
  onNavigationBarButtonTap(e) {
    if (this.showtitleNViewBtns && e.index === 0) {
      uni.navigateTo({
        url: `edit?data=${encodeURIComponent(JSON.stringify(this.detail))}`
      })
    }
  }
}
</script>

<style scoped>
/* #ifdef APP-PLUS */
.bgColor {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #ededed;
  overflow: auto;
}
/* #endif */
/* #ifdef H5 */
page {
  background: #ededed;
}
/* #endif */

.person-wx {
  background-color: #fff;
  padding: 44rpx 24rpx;
  border-bottom: 1px #eee solid;
}
.person-wx-user {
  display: flex;
  flex-direction: row;
  align-items: center;
}
.person-wx-avatar {
  width: 120rpx;
  min-width: 120rpx;
  height: 120rpx;
  margin-right: 42rpx;
  border-radius: 16rpx;
}
.person-wx-user-detail {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 540rpx;
}
.person-wx-nikename {
  font-size: 36rpx;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.person-wx-nikename .text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 480rpx;
}
.person-wx-name {
  color: #666;
  font-size: 28rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 12rpx;
}
.person-wx-nikename-icon.nan {
  color: #007aff;
}
.person-wx-nikename-icon.nv {
  color: #ff5a5f;
}
.person-wx-nikename-icon {
  margin-left: 10rpx;
}
</style>
