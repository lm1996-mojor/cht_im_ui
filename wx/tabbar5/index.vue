<template>
	<view class="note-list-page">
		<watermark />
		<view class="note-list-wrap">
			<view class="note-item" v-for="item in content" :key="item.id" @click="gomsglist(item.id)">
				<view class="note-card">
					<view class="card-header">
						<image class="avatar"
							:src="item.userInfo?.avatar || 'https://cdn.svipaigc.com/bizi/2024/07/61b9.jpg'"
							mode="aspectFill" />
						<view class="header-info">
							<text class="note-title">{{ item?.userInfo?.nickname }}</text>
							<view class="member-info">
								<text class="member-count"
									@click.stop="toCircleDetail(item.circleId)">({{ item.circleName }})</text>
								<text class="time-text">
									
									<uni-icons type="location-filled" size="20" color="#909399" ></uni-icons>
								{{ item.address }}
								</text>
								<text class="time-text">{{ formatTime(item.createdAt) }}</text>
							</view>
						</view>
					</view>
					<view class="note-content" v-html="item.content"></view>

					<!-- 图片区域 - 点击任意一张可放大+左右滑动切换 -->
					<view class="img-box" v-if="item.files && item.files.length > 0">
						<image class="img-item" v-for="(imgUrl, imgIndex) in item.files" :key="imgIndex" :src="imgUrl"
							mode="aspectFill" @click.stop="previewImg(item.files, imgIndex)" />
					</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="queryParams.status" class="load-more" />

		<!-- ✅ 新增 右侧底部固定发布按钮 -->
		<view class="publish-btn" @click="openDrawer">
			<text class="publish-icon">+</text>
		</view>

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
					pageSize: 10,
					userId: '',
					searchType: 0,
					keyword: ''
				},
				content: [],
				isLoading: false,
				// ✅ 新增 控制抽屉显示隐藏的开关
				showDrawer: false
			};
		},
		computed: {
			cover() {
				var cover = {
					type: 'img',
					url: 'https://cdn.svipaigc.com/bizi/2024/07/61b9.jpg'
				};
				return cover;
			},
			userInfo() {
				return this.$store.state.userInfo;
			},
			topicReply() {
				return this.$store.state.topicReply;
			}
		},
		onLoad() {
			this.queryParams.userId = this.userInfo?.userId || '';
			this.handleRefresh();
		},
		onShow() {
			this.handleRefresh();
		},
		methods: {
			// 时间格式化 只返回【时:分】
			formatTime(timeStr) {
				if (!timeStr) return '未知时间';
				const date = new Date(timeStr);
				if (date.toString() === 'Invalid Date') return '未知时间';
				const hour = date.getHours().toString().padStart(2, '0');
				const minute = date.getMinutes().toString().padStart(2, '0');
				return `${hour}:${minute}`;
			},
			handleRefresh() {
				if (this.isLoading) return;
				this.queryParams.page = 1;
				this.queryParams.status = 'more';
				this.queryParams.refreshing = true;
				this.content = [];
				this.getlist();
			},
			getlist() {
				if (this.isLoading) return;
				this.isLoading = true;
				this.queryParams.status = 'loading';

				this.$fc.loadMore({
					url: '/chat_im/circles/dynamic/page?',
					queryParams: this.queryParams
				}).then(res => {
					const list = res?.list || [];
					const formatList = list.map(item => ({
						...item,
						files: item.files ? item.files.split(',').filter(img => img) : []
					}));
					console.log('接口返回数据', res)
					this.content = this.queryParams.page === 1 ? formatList : [...this.content, ...formatList];
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
			// 图片预览：点击放大+左右滑动切换
			previewImg(imgArr, currentIndex) {
				if (!imgArr || imgArr.length === 0 || currentIndex >= imgArr.length) return;
				uni.previewImage({
					urls: imgArr,
					current: imgArr[currentIndex],
					loop: true,
					showmenu: true,
					animationType: 'fadeIn',
					fail: (err) => {
						console.error('图片预览失败', err);
						uni.showToast({
							title: '图片预览失败',
							icon: 'none',
							duration: 1500
						});
					}
				});
			},
			// 圈子名称点击跳转页面方法
			toCircleDetail(circleId) {
				if (!circleId) return uni.showToast({
					title: '圈子ID为空',
					icon: 'none'
				});
				uni.navigateTo({
					url: `/pages/circles/circleDetail?circleId=${circleId}`
				})
			},
			userClick(cover, user) {
				uni.navigateTo({
					url: '../../wx/friendsCircle/person'
				});
			},
			gomsglist(circleId) {
				// uni.navigateTo({url: '../circlesDynamic/index?circleId=' + circleId});
			},
			// ✅ 新增 打开抽屉方法
			openDrawer() {
				uni.navigateTo({
					url: '../circlesDynamic/create'
				});
			},
			// ✅ 新增 关闭抽屉方法
			closeDrawer() {
				this.showDrawer = false;
				// 恢复页面滚动
				document.body.style.overflow = 'auto';
			}
		},
		onPageScroll(e) {
			if (this.$refs['fcli']) this.$refs['fcli'].hidenTool();
		},
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0: //搜索
					uni.navigateTo({
						url: '../circles/index'
					});
					break;
				default:
					break;
			}
		},
		onPullDownRefresh() {
			this.handleRefresh();
		},
		onReachBottom() {
			if (this.isLoading || this.queryParams.status === 'noMore') return;
			this.getlist();
		}
	};
</script>

<style scoped lang="scss">
	page {
		width: 100vw;
		height: 100vh;
		overflow-x: hidden;
	}

	.note-list-page {
		min-height: 100vh;
		background-color: #f5f5f7;
		padding: 20rpx 0;
		box-sizing: border-box;
		width: 100vw;
		position: relative; // ✅ 新增 为固定按钮做定位父级
	}

	.note-list-wrap {
		width: 100%;
		padding: 0;
		box-sizing: border-box;
	}

	.note-item {
		margin-bottom: 20rpx;
		width: 100%;

		&:active {
			opacity: 0.92;
		}
	}

	.note-card {
		background: #ffffff;
		padding: 24rpx;
		box-sizing: border-box;
		width: 100%;
		box-shadow: 0 1rpx 8rpx rgba(0, 0, 0, 0.04);
	}

	.card-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 20rpx;
		width: 100%;

		.avatar {
			width: 72rpx;
			height: 72rpx;
			flex-shrink: 0;
		}

		.header-info {
			flex: 1;
			margin: 0 16rpx;

			.note-title {
				display: block;
				font-size: 34rpx;
				// font-weight: 600;
				color: #1a1a1a;
				line-height: 44rpx;
				margin-bottom: 6rpx;
			}

			.member-info {
				display: flex;
				align-items: center;
				color: #909399;
				gap:15rpx;
			}
		}

	}

	.note-content {
		font-size: 28rpx;
		color: #333333;
		line-height: 46rpx;
		width: 100%;
		word-break: break-all;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		margin-bottom: 20rpx;
	}

	.img-box {
		width: 100%;
		display: flex;
		flex-wrap: wrap;
		gap: 8rpx;
	}

	.img-item {
		width: calc(33.33% - 6rpx);
		height: 210rpx;
		flex-shrink: 0;

		&:active {
			opacity: 0.85;
		}
	}

	.load-more {
		margin-top: 20rpx;
		margin-bottom: 50rpx;
		width: 100%;
		font-size: 26rpx;
	}

	// ✅ 新增 右侧底部固定发布按钮 样式 (核心)
	.publish-btn {
		position: fixed;
		right: 30rpx;
		bottom: 200rpx;
		z-index: 99;
		width: 100rpx;
		height: 100rpx;
		background: #2d79e6;
		border-radius: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8rpx;
		box-shadow: 0 4rpx 20rpx rgba(45, 121, 230, 0.5);

		&:active {
			opacity: 0.9;
			transform: scale(0.96);
		}

		.publish-icon {
			font-size: 40rpx;
			color: #fff;
			font-weight: bold;
			line-height: 1;
		}

		.publish-text {
			font-size: 22rpx;
			color: #fff;
			line-height: 1;
		}
	}

	// ✅ 新增 抽屉遮罩层 样式
	.drawer-mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 998;
		opacity: 0;
		animation: maskFade 0.3s forwards;
	}

	@keyframes maskFade {
		to {
			opacity: 1;
		}
	}

	// ✅ 新增 右侧滑出全屏抽屉 核心样式
	.slide-drawer {
		position: fixed;
		top: 0;
		right: 0;
		width: 100%;
		height: 100vh;
		background: #ffffff;
		z-index: 999;
		transform: translateX(100%); // 默认在右侧屏幕外
		transition: transform 0.3s ease-out; // 平滑滑动动画
		box-sizing: border-box;
		overflow: hidden;
	}

	// 抽屉显示的样式
	.drawer-show {
		transform: translateX(0); // 滑入屏幕内
	}

	// 抽屉头部样式
	.drawer-header {
		width: 100%;
		height: 88rpx;
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #f5f5f5;
		box-sizing: border-box;

		.close-btn {
			font-size: 36rpx;
			color: #666;
			width: 60rpx;
			height: 60rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			&:active {
				background: #f5f5f5;
				border-radius: 50%;
			}
		}

		.drawer-title {
			font-size: 32rpx;
			color: #333;
			font-weight: 600;
		}
	}

	// 抽屉内容滚动区
	.drawer-content {
		width: 100%;
		height: calc(100vh - 88rpx);
		padding: 30rpx;
		box-sizing: border-box;
	}

	// 抽屉内表单样式 (可按需修改)
	.form-item {
		margin-bottom: 40rpx;

		.form-label {
			display: block;
			font-size: 28rpx;
			color: #333;
			margin-bottom: 16rpx;
			font-weight: 500;
		}

		.form-textarea {
			width: 100%;
			min-height: 200rpx;
			padding: 20rpx;
			border: 1px solid #eee;
			border-radius: 10rpx;
			font-size: 28rpx;
			color: #333;
			line-height: 40rpx;
			box-sizing: border-box;
		}

		.upload-box {
			width: 100%;
			height: 120rpx;
			border: 1px dashed #ccc;
			border-radius: 10rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 26rpx;
			color: #999;
		}
	}

	.submit-btn-wrap {
		margin-top: 60rpx;
		width: 100%;
	}

	.publish-submit-btn {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		background: #2d79e6;
		color: #fff;
		border-radius: 10rpx;
		font-size: 28rpx;
	}
</style>