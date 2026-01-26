<template>
	<view class="bgColor">
		<watermark></watermark>
		<view class="search-friends">
			<!-- <form @submit="subform">
				<input class="search-friends-input" placeholder="请填写微聊号-" v-model="form.param" type="text" />
			</form> -->
			<!-- <view class="search-friends-list-title" v-if="list?.length>0">历史</view> -->
			<view class="search-friends-list">
				<view class="search-friends-list-item" v-for="(v,i) in list" :key="i">
					<user-avatar class="search-friends-list-img" :modelValue="v.senderInfo.avatar" @click="godetail(v)"></user-avatar> 
					<view class="search-friends-list-user" @click="godetail(v)">
						<view class="search-friends-list-username">{{v.senderInfo.nickname}}</view>
						<view class="search-friends-list-remark">{{v.message||'对方没有说话'}}</view>
					</view>
					<view class="search-friends-list-btns">
						<view class="search-friends-list-btn-text">
							<view v-if="v.status=='1'" class="search-friends-list-btn btn1" @click="agreeApply(v)">接受</view>
							<text v-if="v.status=='2'">已同意</text>
							<text v-if="v.status=='3'">已拒绝</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-load-more v-show="list?.length>9" :status="queryParams.status"></uni-load-more>
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
					pageNumber: 1,
					pageSize: 10,
					status:0
				},
				form:{
					param:''
				},
				list:[]
			};
		},
		computed: {},
		onLoad() {
		},
		onShow() {
			this.queryParams.refreshing=true
			this.applyList()
		},
		methods: {
			godetail(e){
				// 申请id,申请状态,申请人id
				
				uni.navigateTo({
					url:'../personInfo/addFriendsDetail?applyId='+e.id+'&applyerId='+e.senderInfo.id+'&status='+e.status
				})
			},
			agreeApply(e){
				this.$http.request({
					url: '/chat_im/friend/handle/request',
					method: 'PUT',
					data:JSON.stringify({requestId:e.id,action:'accept'}),
					success: (res) => {
						console.log('接受',res);
						if (res?.data?.code == 200) {
							uni.showToast({
								title:'已同意',
								icon:'none'
							})
							this.queryParams.refreshing=true
						}
						this.applyList()
					}
				});
			},
			handleRefresh() {
				if (this.isLoading) return;
				this.queryParams.page = 1;
				this.queryParams.status = 'more';
				this.queryParams.refreshing = true;
				this.list = [];
				this.getlist();
			},
			applyList(){
				// this.queryParams.status='loading'
				// this.$fc.loadMore({
				// 	url: '/chat_im/friend/request/page?',
				// 	queryParams: this.queryParams
				// }).then(res => {
				// 	this.$store.commit('update_friendApply',{})
				// 	uni.removeStorageSync('friendApply');
				// 	this.queryParams = res.queryParams;
				// 	if (res.status=='3') {
				// 		this.list=[]
				// 		return
				// 	}
				// 	if (res.status=='0') {
				// 		return
				// 	}
				// 	var rows = res.list;
				// 	var list = [];
				// 	for (var i = 0; i < rows.length; i++) {
				// 		var item = rows[i];
				// 		list.push(item);
				// 	}
				// 	if (res.status=='2') {
				// 		this.list = list;
				// 	}
				// 	if (res.status=='1') {
				// 		this.list = this.list.concat(list);
				// 	}
				// 	this.list = res?.list;
				// 	console.log('list',this.list);
				// });
				if (this.isLoading) return;
				this.isLoading = true;
				this.queryParams.status = 'loading';
				
				this.$fc.loadMore({
					url: '/chat_im/friend/request/page?',
					queryParams: this.queryParams
				}).then(res => {
					const list = res?.list || [];
					const formatList = list.map(item => ({
						...item,
						// files: item.files ? item.files.split(',').filter(img => img) : []
					}));
					console.log('接口返回数据', res)
					this.list = this.queryParams.page === 1 ? formatList : [...this.list, ...formatList];
				}).catch(err => {
					console.error('列表请求失败', err)
					this.queryParams.status = 'more';
				}).finally(() => {
					this.isLoading = false;
					if (this.queryParams.refreshing) {
						uni.stopPullDownRefresh();
						this.queryParams.refreshing = false;
					}
				});
			},
			subform(e) {
				var rules = {
					param: {
						rules: [{
							checkType: "required",
							errorMsg: "请填写微聊号/手机号"
						}]
					}
				};
				var formData = this.form;
				var checkRes = this.$zmmFormCheck.check(formData, rules);
				if (checkRes) {
					uni.navigateTo({
						url:'../personInfo/addFriendsDetail?param='+this.form.param+'&type=1'
					})
				} else {
					uni.showToast({
						title: this.$zmmFormCheck.error,
						icon: "none",
						position: 'bottom'
					});
				}
			},
		},
		onPullDownRefresh() {
			this.queryParams.refreshing=true
			this.applyList();
		},
		onReachBottom() {
			this.applyList();
		},
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0:
					this.subform()
					break;
				default:
					break;
			}
		},
	}
</script>

<style scoped>
	/* #ifdef APP-PLUS */
	.bgColor{
	    position: fixed;
	    top: 0;
	    left: 0;
	    right: 0;
	    bottom: 0;
	    background: #EDEDED;
		overflow: auto;
	  }
	/* #endif */
	/* #ifdef H5 */
	page{
		background: #EDEDED;
	}
	/* #endif */
	.search-friends{
		display: flex;
		flex-direction: column;
	}
	.search-friends-input{
		margin:20rpx 24rpx;
		margin-bottom: 0;
		height: 70rpx;
		line-height: 70rpx;
		text-align: center;
		background-color: #fff;
		border-radius: 24rpx;
	}
	.search-friends-list{
		background-color: #fff;
		display: flex;flex-direction: column;
	}
	.search-friends-list-item{
		padding:0 24rpx;
		display: flex;flex-direction: row;align-items: center;
	}
	.search-friends-list-user{
		flex: 1;
		padding: 24rpx;
		border-bottom: 1px #eee solid;
		max-width: 470rpx;
	}
	.search-friends-list-username{
		font-size: 32rpx;
		color: #333;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.search-friends-list-title{
		font-size: 28rpx;
		color: #666;
		margin: 24rpx;
	}
	.search-friends-list-remark{
		font-size: 27rpx;
		color: #999;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 12rpx;
	}
	.search-friends-list-item:nth-last-child(1) .search-friends-list-user{
		border: none;
	}
	.search-friends-list-img{
		min-width: 90rpx;
		width: 90rpx;
		height: 90rpx;
		border-radius: 10rpx;
	}
	.search-friends-list-btns{
		margin-left: auto;
	}
	.search-friends-list-btn{
		text-align: center;
		border-radius: 12rpx;
		padding:  8rpx 12rpx;
	}
	.search-friends-list-btn-text{
		color: #999;
		font-size: 28rpx;
	}
	.search-friends-list-btn.btn1{
		background-color: #1BC418;
		color: #fff;
	}
	.search-friends-list-btn.btn2{
		background-color: #c4c4c4;
		color: #fff;
	}
	.search-friends-list-btn.btn3{
		background-color: #ff6767;
		color: #fff;
	}
</style>
