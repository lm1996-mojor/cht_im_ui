<template>
	<view class="note-page-wrap">
		<scroll-view scroll-y class="note-create-page">
			<view class="content-image-wrap">
				<view class="form-item no-margin">
					<textarea v-model="noteForm.content" class="form-textarea" placeholder="请输入动态内容" maxlength="200"
						auto-height></textarea>
				</view>
				<view class="form-item no-margin upload-box">
					<zmm-upload-image chooseType="chooseMedia" @oneComplete="upLoadoneComplete" ref="upup"
						v-model="noteForm.files" :limit="limit" class="upload-image-wrap"></zmm-upload-image>
				</view>
			</view>
			<view class="select-group-wrap">
				<view class="select-item" @click="openCircleDrawer">
					<view class="select-label">
						<uni-icons type="pyq" size="26"></uni-icons>
						{{ noteForm.circleName || '请选择圈子' }}</view>
					<view class="select-value">
						
						<uni-icons type="right" size="26"></uni-icons>
					</view>
				</view>
				<view class="select-item" @click="openAddressDrawer">
					<view class="select-label">
						<uni-icons type="location-filled" size="26"></uni-icons>

						{{ noteForm.address || '请选择城市' }}</view>
					<view class="select-value">
						
						<uni-icons type="right" size="26"></uni-icons>
						
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="btn-box">
			<button type="primary" class="btn submit-btn" @click="submitNote">提交</button>
		</view>
		<uni-drawer ref="addressDrawer" type="right" :mask-click="true" :show="false" :width="750"
			class="address-drawer">
			<view class="drawer-content">
				<view class="drawer-header">
					<text class="drawer-title">选择城市</text>
					<text class="iconfont icon-close" @click="closeAddressDrawer"></text>
				</view>
				<view class="search-wrap">
					<input v-model="searchKeyword" class="search-input" placeholder="搜索城市" @input="filterAddressList" />
				</view>
				<scroll-view scroll-y class="address-list-wrap">
					<view v-for="(group, index) in filteredAddressList" :key="index" class="address-group">
						<view class="group-letter">{{ group.letter }}</view>
						<view class="address-item" v-for="(item, idx) in group.list" :key="idx"
							@click="selectAddress(item)">
							{{ item.name }}
						</view>
					</view>
					<view class="empty-tip" v-if="filteredAddressList.length === 0">
						未找到匹配的城市
					</view>
				</scroll-view>
			</view>
		</uni-drawer>
		<uni-drawer ref="circleDrawer" mode="right" :mask-click="true" :show="false" :width="windowWidth" class="circle-drawer">
			<view class="drawer-content">
				<view class="drawer-header">
					<text class="drawer-title">选择圈子</text>
					<text class="iconfont icon-close" @click="closeCircleDrawer"></text>
				</view>
				<!-- ✅✅✅ 仅新增这1行包裹层：解决列表滚动，不遮挡按钮，无其他修改 -->
				<scroll-view scroll-y style="flex: 1;">
					<circle-list ref="circleListRef" :default-selected-id="noteForm.circleId"
						@select="handleCircleSelect"></circle-list>
				</scroll-view>
				<!-- ✅ 确认按钮 现在正常显示了 -->
				<view class="circle-confirm-btn-wrap">
					<button class="circle-confirm-btn" @click="confirmCircleSelect">确认选择</button>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noteForm: {
					circleId: '',
					circleName: '',
					content: "",
					files: null,
					address: ""
				},
				limit: 9,
				windowWidth:0,
				type: 'IMAGE',
				searchKeyword: '',
				addressList: [{
						letter: 'A',
						list: [{
							name: '安华里小区'
						}, {
							name: '奥体中心'
						}, {
							name: '阿里中心'
						}]
					},
					{
						letter: 'B',
						list: [{
							name: '百子湾路'
						}, {
							name: '北京饭店'
						}, {
							name: '保利大厦'
						}]
					},
					{
						letter: 'C',
						list: [{
							name: '朝阳公园'
						}, {
							name: '长安街'
						}, {
							name: '可栋2562号'
						}]
					},
					{
						letter: 'D',
						list: [{
							name: '东单'
						}, {
							name: '东直门'
						}, {
							name: '大兴机场'
						}]
					},
					{
						letter: 'F',
						list: [{
							name: '方庄小区'
						}, {
							name: '丰台科技园'
						}]
					},
					{
						letter: 'G',
						list: [{
							name: '国贸中心'
						}, {
							name: '故宫'
						}, {
							name: '中关村'
						}]
					},
					{
						letter: 'H',
						list: [{
							name: '海淀区'
						}, {
							name: '后海'
						}, {
							name: '欢乐谷'
						}]
					},
					{
						letter: 'J',
						list: [{
							name: '建国门'
						}, {
							name: '金融街'
						}, {
							name: '京顺路'
						}]
					},
					{
						letter: 'K',
						list: [{
							name: '可栋2562号'
						}, {
							name: '开阳路'
						}, {
							name: '科技园'
						}]
					},
					{
						letter: 'L',
						list: [{
							name: '亮马桥'
						}, {
							name: '丽泽商务区'
						}, {
							name: '六里桥'
						}]
					},
					{
						letter: 'M',
						list: [{
							name: '王府井'
						}, {
							name: '门头沟'
						}, {
							name: '密云区'
						}]
					},
					{
						letter: 'Q',
						list: [{
							name: '七里庄'
						}, {
							name: '青年路'
						}, {
							name: '清华园'
						}]
					},
					{
						letter: 'S',
						list: [{
							name: '三里屯'
						}, {
							name: '石景山'
						}, {
							name: '顺义区'
						}]
					},
					{
						letter: 'T',
						list: [{
							name: '天坛'
						}, {
							name: '天安门'
						}, {
							name: '通州区'
						}]
					},
					{
						letter: 'W',
						list: [{
							name: '五道口'
						}, {
							name: '望京'
						}, {
							name: '西二旗'
						}]
					},
					{
						letter: 'X',
						list: [{
							name: '西单'
						}, {
							name: '西直门'
						}, {
							name: '霄云路'
						}]
					},
					{
						letter: 'Y',
						list: [{
							name: '亚运村'
						}, {
							name: '亦庄'
						}, {
							name: '雍和宫'
						}]
					},
					{
						letter: 'Z',
						list: [{
							name: '中关村'
						}, {
							name: '朝阳门'
						}, {
							name: '紫竹桥'
						}]
					}
				],
				filteredAddressList: [],
				selectedCircleId: ''
			}
		},
		onLoad(e) {
			console.log('页面参数：', e)
			this.noteForm.circleId = e.circleId || ''
			this.filteredAddressList = [...this.addressList]
			if (this.noteForm.circleId) {}
			// #ifdef H5
			this.windowWidth = document.documentElement.clientWidth;
			// #endif

			// #ifndef H5
			uni.getSystemInfo({
				success: function(res) {
					this.windowWidth = res.windowWidth;
				}
			});
			// #endif
		},
		methods: {
			handleCircleSelect(item) {
				this.selectedCircleId = item.id
				console.log('选中的圈子', item)
			},
			upLoadoneComplete(e, type) {
				if (e.type == 'VIDEO') {
					this.limit = 1
					this.type = 'VIDEO'
					const vlist = []
					for (let i = 0; i < this.noteForm.files.length; i++) {
						const item = this.noteForm.files[i]
						if (item.type == 'VIDEO') {
							vlist.push(item)
						}
					}
					this.noteForm.files = vlist
				} else {
					limit = 9
					type = 'IMAGE'
				}
			},
			openCircleDrawer() {
				this.$refs.circleDrawer.open()
				this.$nextTick(() => {
					this.$refs.circleListRef.initLoad()
				})
			},
			closeCircleDrawer() {
				this.$refs.circleDrawer.close()
			},
			confirmCircleSelect() {
				if (!this.selectedCircleId) {
					return uni.showToast({
						title: '请选择一个圈子',
						icon: 'none'
					})
				}
				const selectItem = {
					id: this.selectedCircleId,
					name: this.$refs.circleListRef.content.find(item => item.id == this.selectedCircleId)?.name
				}
				this.noteForm.circleId = selectItem.id
				this.noteForm.circleName = selectItem.name
				this.closeCircleDrawer()
			},
			openAddressDrawer() {
				this.$refs.addressDrawer.open()
				this.searchKeyword = ''
				this.filteredAddressList = [...this.addressList]
			},
			closeAddressDrawer() {
				this.$refs.addressDrawer.close()
			},
			filterAddressList() {
				if (!this.searchKeyword) {
					this.filteredAddressList = [...this.addressList]
					return
				}
				const keyword = this.searchKeyword.trim().toLowerCase()
				const filtered = []
				this.addressList.forEach(group => {
					const matchList = group.list.filter(item =>
						item.name.toLowerCase().includes(keyword)
					)
					if (matchList.length > 0) {
						filtered.push({
							letter: group.letter,
							list: matchList
						})
					}
				})
				this.filteredAddressList = filtered
			},
			selectAddress(item) {
				this.noteForm.address = item.name
				this.closeAddressDrawer()
			},
			submitNote() {
				if (!this.noteForm.content) {
					uni.showToast({
						title: '请输入动态内容',
						icon: 'none'
					})
					return
				}
				if (!this.noteForm.circleName) {
					uni.showToast({
						title: '请选择圈子',
						icon: 'none'
					})
					return
				}
				const submitData = {
					...this.noteForm,
					files: this.noteForm.files ? this.noteForm.files.map(item => item.url).join(",") : null
				}
				console.log('提交参数：', submitData)
				this.$http.request({
					url: '/chat_im/circles/dynamic/publish',
					method: 'POST',
					data: JSON.stringify(submitData),
					success: (res) => {
						if (res.data.code == 200) {
							uni.showToast({
								title: '提交成功',
								icon: 'success'
							})
							setTimeout(() => {
								uni.navigateBack({
									delta: 1
								})
							}, 1500)
						} else {
							uni.showToast({
								title: res.data.msg || '提交失败',
								icon: 'none'
							})
						}
					},
					fail: () => {
						uni.showToast({
							title: '网络异常',
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
	page {
		width: 100%;
		height: 100%;
		overflow: hidden !important;
	}

	.note-page-wrap {
		width: 100%;
		height: 100vh;
		background-color: #f8f8f8;
		box-sizing: border-box;
		position: relative;
		overflow: hidden !important;
	}

	.note-create-page {
		width: 100%;
		height: 100%;
		padding: 30rpx 0;
		padding-bottom: 200rpx;
		box-sizing: border-box;
	}

	.content-image-wrap {
		background-color: #fff;
		border-radius: 10rpx;
		padding: 20rpx 20rpx 10rpx;
		border: 1px solid #eee;
		margin: 0 0 30rpx 0;
	}

	.form-item {
		display: flex;
		flex-direction: column;
		margin-bottom: 20rpx;
	}

	.no-margin {
		margin-bottom: 0;
	}

	.form-textarea {
		width: 100%;
		min-height: 120rpx;
		padding: 0;
		background: transparent;
		font-size: 28rpx;
		color: #333;
		border: none;
		outline: none;
		line-height: 1.6;
	}

	.form-textarea::placeholder {
		color: #c9cacc;
		font-size: 26rpx;
	}

	.upload-box {
		width: 100%;
	}

	.upload-image-wrap {
		width: 100%;
		height: auto;
	}

	.select-group-wrap {
		background-color: #fff;
		border-radius: 10rpx;
		border: 1px solid #eee;
		margin: 0;
		color:#606266;
	}

	.select-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 20rpx;
		height: 90rpx;
		line-height: 90rpx;
		border-bottom: 1px solid #eee;
	}

	.select-item:last-child {
		border-bottom: none;
	}

	.select-label {
		font-size: 28rpx;
		color: #333;
		font-weight: 500;
		display: flex;
		align-items: center;
		gap:16rpx;
	}

	.select-value {
		display: flex;
		align-items: center;
		font-size: 28rpx;
		color: #666;
	}

	.btn-box {
		position: fixed;
		bottom: 20rpx;
		left: 0;
		right: 0;
		z-index: 999;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 10rpx;
		font-size: 28rpx;
	}

	.submit-btn {
		background-color: #007aff;
		color: #fff;
	}

	.address-drawer {
		--mask-background-color: rgba(0, 0, 0, 0.5);
	}

	.drawer-content {
		width: 100%;
		height: 100%;
		background-color: #fff;
		display: flex;
		flex-direction: column;
	}

	.drawer-header {
		height: 88rpx;
		line-height: 88rpx;
		padding: 0 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #eee;
	}

	.drawer-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #333;
	}

	.search-wrap {
		padding: 20rpx 30rpx;
		border-bottom: 1px solid #eee;
	}

	.search-input {
		height: 70rpx;
		line-height: 70rpx;
		padding: 0 20rpx;
		background-color: #f5f5f5;
		border-radius: 35rpx;
		font-size: 28rpx;
	}

	.address-list-wrap {
		flex: 1;
		overflow-y: auto;
		padding: 10rpx 0;
	}

	.address-group {
		margin-bottom: 20rpx;
	}

	.group-letter {
		font-size: 24rpx;
		color: #999;
		padding: 10rpx 30rpx;
		background-color: #f8f8f8;
		font-weight: 500;
	}

	.address-item {
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333;
		border-bottom: 1px solid #f5f5f5;
	}

	.address-item:active {
		background-color: #f5f5f5;
	}

	.empty-tip {
		text-align: center;
		padding: 50rpx 0;
		font-size: 28rpx;
		color: #999;
	}

	.circle-drawer {
		--mask-background-color: rgba(0, 0, 0, 0.5);
	}

	.circle-list-wrap {
		flex: 1;
		overflow-y: auto;
		padding: 10rpx 0;
	}

	.circle-item {
		height: 90rpx;
		line-height: 90rpx;
		padding: 0 30rpx;
		font-size: 28rpx;
		color: #333;
		border-bottom: 1px solid #f5f5f5;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.circle-item.active {
		background-color: #f0f7ff;
		color: #007aff;
	}

	.circle-confirm-btn-wrap {
		padding: 20rpx 30rpx;
		border-top: 1px solid #eee;
	}

	.circle-confirm-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #007aff;
		color: #fff;
		border-radius: 10rpx;
		font-size: 28rpx;
	}

	.iconfont {
		font-family: "iconfont" !important;
		font-size: 28rpx;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #999;
		margin-left: 10rpx;
	}

	.icon-arrow-right:before {
		content: "\e600";
	}

	.icon-close:before {
		content: "\e601";
	}

	.icon-check:before {
		content: "\e602";
		color: #007aff;
	}
</style>