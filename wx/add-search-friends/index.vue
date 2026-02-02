<template>
  <view class="bgColor">
    <view class="search-friends">
      <!-- 搜索框+右侧搜索按钮 布局 -->
      <view class="search-input-box">
        <input
          class="search-friends-input"
          placeholder="请搜索微聊号-"
          v-model="form.param"
          type="text"
        />
        <!-- 搜索按钮 -->
        <view class="search-btn" @click="handleSearch">搜索</view>
      </view>

      <!-- ✅ 新增：搜索结果展示区 - 搜索到数据就显示 -->
      <view class="search-friends-list-title" v-if="searchList.length > 0"
        >搜索结果</view
      >
      <view class="search-friends-list" v-if="searchList.length > 0">
        <view
          class="search-friends-list-item"
          v-for="(v, i) in searchList"
          :key="i"
          @click="goSearchDetail(v)"
        >
          <!-- <image class="search-friends-list-img" :src="v.avatar" mode="aspectFill"></image> -->
          <user-avatar
            class="search-friends-list-img"
            :modelValue="v.avatar"
            mode="aspectFill"
          ></user-avatar>
          <view class="search-friends-list-user">
            <view class="search-friends-list-username">{{ v.nickname }}</view>
            <view class="search-friends-list-remark">{{
              v.reason || '可添加为好友'
            }}</view>
          </view>
        </view>
      </view>
      <!-- ✅ 新增：无搜索结果提示 -->
      <view class="no-search-data" v-if="isSearch && searchList.length == 0"
        >未搜索到相关用户</view
      >

      <!-- 原有：好友申请历史列表 -->
      <view class="search-friends-list-title" v-if="list.length > 0"
        >历史申请</view
      >
      <view class="search-friends-list">
        <view class="search-friends-list-item" v-for="(v, i) in list" :key="i">
          <image
            class="search-friends-list-img"
            :src="v.avatar"
            mode="aspectFill"
            @click="godetail(v)"
          ></image>
          <view class="search-friends-list-user" @click="godetail(v)">
            <view class="search-friends-list-username">{{ v.nickName }}</view>
            <view class="search-friends-list-remark">{{ v.reason }}</view>
          </view>
          <view class="search-friends-list-btns">
            <view class="search-friends-list-btn-text">
              <view
                v-if="v.applyStatus == '0'"
                class="search-friends-list-btn btn1"
                @click="agreeApply(v.applyId)"
                >接受</view
              >
              <text v-if="v.applyStatus == '1'">已同意</text>
              <text v-if="v.applyStatus == '2'">已拒绝</text>
              <text v-if="v.applyStatus == '3'">已忽略</text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <uni-load-more
      v-show="list.length > 9"
      :status="queryParams.status"
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
        pageNum: 1,
        pageSize: 10
      },
      form: {
        param: ''
      },
      list: [],
      // ✅ 新增：搜索结果数组
      searchList: [],
      // ✅ 新增：标记是否执行过搜索，用于控制无结果提示显示
      isSearch: false
    }
  },
  computed: {},
  onLoad() {},
  onShow() {
    this.queryParams.refreshing = true
    this.applyList()
  },
  methods: {
    godetail(e) {
      uni.navigateTo({
        url: '../personInfo/addFriendsDetail?param=' + e.applyId + '&type=2'
      })
    },
    goSearchDetail(e) {
      uni.navigateTo({
        url:
          '../add-search-friends/detail?userId=' +
          e.userId +
          '&type=1' +
          '&nickname=' +
          e.nickname
      })
    },
    agreeApply(e) {
      this.$http.request({
        url: '/apply/agree',
        method: 'POST',
        data: JSON.stringify({ applyId: e }),
        success: res => {
          if (res.data.code == 200) {
            uni.showToast({
              title: '已同意',
              icon: 'none'
            })
            this.queryParams.refreshing = true
            this.applyList()
          }
        }
      })
    },
    applyList() {
      // this.queryParams.status='loading'
      // this.$fc.loadMore({
      // 	url: '/apply/list?',
      // 	queryParams: this.queryParams
      // }).then(res => {
      // 	this.$store.commit('update_friendApply',{})
      // 	uni.removeStorageSync('friendApply');
      // 	this.queryParams = res.queryParams;
      // 	if (res.status=='3') {
      // 		this.list=[]
      // 		return
      // 	}
      // 	if (res.status=='0') return
      // 	const list = res.list || []
      // 	if (res.status=='2') {
      // 		this.list = list;
      // 	}
      // 	if (res.status=='1') {
      // 		this.list = this.list.concat(list);
      // 	}
      // });
    },

    // ✅ 核心修改：搜索方法 去掉跳转+数据渲染到当前页+修复请求错误
    handleSearch() {
      var rules = {
        param: {
          rules: [
            {
              checkType: 'required',
              errorMsg: '请填写微聊号/手机号'
            }
          ]
        }
      }
      var formData = this.form
      var checkRes = this.$zmmFormCheck.check(formData, rules)
      if (checkRes) {
        // 每次搜索重置结果 + 标记已搜索
        this.searchList = []
        this.isSearch = true
        // 显示加载中
        uni.showLoading({ title: '搜索中...', mask: true })
        // ✅ 修复：删除async/await 改用uniapp原生回调写法（和你的$http.request匹配，避免混用报错）
        this.$http.request({
          url: '/chat_im/friend/search?keyword=' + this.form.param,
          method: 'GET',
          data: JSON.stringify(this.form.param),
          success: res => {
            if (res.data.code === 200) {
              // ✅ 核心：把搜索结果赋值给searchList，渲染到当前页面
              const data = res.data.data.content || []
              this.searchList = data
              // 无结果提示
              if (data.length == 0) {
                uni.showToast({ title: '未搜索到相关用户', icon: 'none' })
              }
            } else {
              uni.showToast({ title: res.data.msg || '搜索失败', icon: 'none' })
            }
          },
          fail: err => {
            // 请求失败提示
            uni.showToast({ title: '网络异常，搜索失败', icon: 'none' })
          },
          complete: () => {
            // ✅ 无论成败都关闭加载框
            uni.hideLoading()
          }
        })
      } else {
        // 表单校验失败提示
        uni.showToast({
          title: this.$zmmFormCheck.error,
          icon: 'none',
          position: 'bottom'
        })
      }
    }
  },
  onPullDownRefresh() {
    this.queryParams.refreshing = true
    this.applyList()
    uni.stopPullDownRefresh()
  },
  onReachBottom() {
    this.applyList()
  },
  onNavigationBarButtonTap(e) {
    switch (e.index) {
      case 0:
        this.handleSearch()
        break
      default:
        break
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
.search-friends {
  display: flex;
  flex-direction: column;
}
.search-input-box {
  display: flex;
  align-items: center;
  margin: 20rpx 24rpx;
  height: 70rpx;
  border-radius: 24rpx;
  background: #fff;
  overflow: hidden;
}
.search-friends-input {
  flex: 1;
  height: 70rpx;
  line-height: 70rpx;
  text-align: left;
  padding: 0 20rpx;
  background-color: #fff;
}
.search-btn {
  min-width: 120rpx;
  height: 70rpx;
  line-height: 70rpx;
  text-align: center;
  font-size: 28rpx;
  color: #fff;
  background: #1bc418;
  padding: 0 20rpx;
}
/* ✅ 新增：无搜索结果样式 */
.no-search-data {
  font-size: 28rpx;
  color: #999;
  text-align: center;
  padding: 30rpx 0;
}
.search-friends-list {
  background-color: #fff;
  display: flex;
  flex-direction: column;
}
.search-friends-list-item {
  padding: 0 24rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.search-friends-list-user {
  flex: 1;
  padding: 24rpx;
  border-bottom: 1px #eee solid;
  max-width: 470rpx;
}
.search-friends-list-username {
  font-size: 32rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.search-friends-list-title {
  font-size: 28rpx;
  color: #666;
  margin: 24rpx;
}
.search-friends-list-remark {
  font-size: 27rpx;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 12rpx;
}
.search-friends-list-item:nth-last-child(1) .search-friends-list-user {
  border: none;
}
.search-friends-list-img {
  min-width: 90rpx;
  width: 90rpx;
  height: 90rpx;
  border-radius: 10rpx;
}
.search-friends-list-btns {
  margin-left: auto;
}
.search-friends-list-btn {
  text-align: center;
  border-radius: 12rpx;
  padding: 8rpx 12rpx;
}
.search-friends-list-btn-text {
  color: #999;
  font-size: 28rpx;
}
.search-friends-list-btn.btn1 {
  background-color: #1bc418;
  color: #fff;
}
.search-friends-list-btn.btn2 {
  background-color: #c4c4c4;
  color: #fff;
}
.search-friends-list-btn.btn3 {
  background-color: #ff6767;
  color: #fff;
}
</style>
