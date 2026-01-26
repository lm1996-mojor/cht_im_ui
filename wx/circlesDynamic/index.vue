<template>
	<view class="note-list-page">
		<watermark></watermark>
		<!-- 笔记列表容器 -->
		<view class="note-list-wrap">
			<!-- 循环渲染笔记列表，保留原点击事件/key/循环源 完全不变 -->
			<view class="note-item" v-for="item in content" :key="item.id" @click="gomsglist">
				<!-- 笔记卡片主体 -->
				<view class="note-card">
					<!-- 顶部信息：头像 + 圈子动态名称 -->
					<view class="card-header">
						<image class="avatar" :src="item.avatar || 'https://cdn.svipaigc.com/bizi/2024/07/61b9.jpg'"
							mode="aspectFill"></image>
						<view class="header-info">
							<text class="note-title">{{ item.name || '未命名圈子动态' }}</text>
							<text class="member-count">成员数：{{ item.memberCount || 0 }}</text>
						</view>
						<!-- 加入类型标识 -->
						<view class="join-tag" v-if="item.joinType">
							{{ item.joinType == 1 ? '公开加入' : '审核加入' }}
						</view>
					</view>

					<!-- 圈子动态描述 -->
					<text class="note-content">{{ item.description || '暂无圈子动态介绍' }}</text>

					<!-- 笔记标签+分类 行 - 补充回原有标签模块 -->
					<view class="note-tag-category">
						<text class="note-tag" v-if="item.tag">{{ item.tag }}</text>
						<text class="note-category" v-if="item.category">
							{{ item.category == 'work' ? '工作圈子动态' : item.category == 'life' ? '生活圈子动态' : item.category == 'study' ? '学习圈子动态' : '其他圈子动态' }}
						</text>
					</view>

					<!-- 底部信息行 -->
					<view class="card-footer">
						<!-- 创建时间 -->
						<text class="create-time">{{ formatTime(item.createdAt) }}</text>
						<!-- 是否公开标识 - 补充回公开私密标识 -->
						<text class="public-text" :class="item.isPublic ? 'public' : 'private'"
							v-if="item.isPublic !== null">
							{{ item.isPublic ? '公开圈子动态' : '私密圈子动态' }}
						</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 加载更多组件 保留原v-show逻辑 位置不变 -->
		<uni-load-more v-show="content.length>9" :status="queryParams.status" class="load-more"></uni-load-more>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				queryParams: {
					refreshing: false,
					status: 'more', // more=可加载 loading=加载中 noMore=无更多
					page: 1,
					pageSize: 10,
					userId: '',
					searchType: 0,
					keyword: '',
					circleId: '' // 保留circleId参数
				},
				content: [],
				isLoading: false // ✅ 新增：防重复请求锁 核心！
			};
		},
		computed: {
			cover() {
				var cover = {
					type: 'img',
					url: 'https://cdn.svipaigc.com/bizi/2024/07/61b9.jpg'
				}
				return cover;
			},
			userInfo() {
				return this.$store.state.userInfo;
			},
			topicReply() {
				return this.$store.state.topicReply;
			}
		},
		onLoad(e) {
			// ✅ 修复参数赋值方式 简洁正确 保留circleId接收
			this.queryParams = {
				...this.queryParams,
				userId: this.userInfo?.userId || '',
				extraParams:{
					circleId: e.circleId || ''
				}
			}
			this.handleRefresh(); // 初始化加载第一页
		},
		onShow(e) {
			// ✅ 优化：防止重复请求，只有加载完成状态才刷新
			// if (!this.isLoading && this.queryParams.status !== 'loading') {
			// 	this.handleRefresh();
			// }
		},
		methods: {
			// 格式化时间 完全保留不变
			formatTime(timeStr) {
				if (!timeStr) return '未知时间';
				const date = new Date(timeStr);
				if (date.toString() === 'Invalid Date') return '未知时间'; // ✅ 新增兼容异常时间格式
				const year = date.getFullYear();
				const month = (date.getMonth() + 1).toString().padStart(2, '0');
				const day = date.getDate().toString().padStart(2, '0');
				const hour = date.getHours().toString().padStart(2, '0');
				const minute = date.getMinutes().toString().padStart(2, '0');
				return `${year}-${month}-${day} ${hour}:${minute}`;
			},
			// ✅ 下拉刷新重置方法 完整移植 核心方法
			handleRefresh() {
				if (this.isLoading) return; // 加载中禁止刷新
				this.queryParams.page = 1;
				this.queryParams.status = 'more';
				this.queryParams.refreshing = true;
				this.content = []; // 清空列表
				this.getlist();
			},
			// ✅ 核心列表请求方法 完整移植分页+锁+状态逻辑 接口地址不变！
			getlist() {
				if (this.isLoading) return; // 上锁：防止重复请求
				this.isLoading = true;
				this.queryParams.status = 'loading'; // 显示加载中动画

				this.$fc.loadMore({
					url: '/chat_im/circles/dynamic/page?', // ✅ 保留你的原接口地址 不修改
					queryParams: this.queryParams
				}).then(res => {
					const list = res?.list || []; // 兜底：防止接口无返回list字段
					console.log('接口返回数据', res)

					// ✅ 分页核心规则：第一页赋值，后续页数追加数据 不覆盖
					this.content = this.queryParams.page === 1 ? list : [...this.content, ...list];

					// ✅ 无更多判断：返回条数 < 每页条数 → 无更多，反之页码+1可继续加载
					if (list.length < this.queryParams.pageSize) {
						this.queryParams.status = 'noMore';
					} else {
						this.queryParams.page += 1;
						this.queryParams.status = 'more';
					}
				}).catch(err => {
					console.error('列表请求失败', err)
					this.queryParams.status = 'more'; // 失败后恢复可加载状态
				}).finally(() => {
					this.isLoading = false; // 解锁：允许下次请求
					// 下拉刷新结束后，停止下拉动画
					if (this.queryParams.refreshing) {
						uni.stopPullDownRefresh();
						this.queryParams.refreshing = false;
					}
				});
			},
			// 保留原方法不变
			userClick(cover, user) {
				uni.navigateTo({
					url: '../../wx/friendsCircle/person'
				});
			},
			// 保留原跳转逻辑不变
			gomsglist() {
				uni.navigateTo({
					url: './msglist'
				});
			}
		},
		// 保留原方法不变
		onPageScroll(e) {
			if (this.$refs['fcli']) this.$refs['fcli'].hidenTool();
		},
		// 保留原按钮跳转逻辑不变 带circleId传参
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0:
					uni.navigateTo({
						url: './create?circleId=' + this.queryParams.circleId
					});
					break;
				default:
					break;
			}
		},
		// ✅ 下拉刷新生命周期 完整移植
		onPullDownRefresh() {
			this.handleRefresh();
		},
		// ✅ 上拉触底加载生命周期 完整移植 防重复+无更多判断
		onReachBottom() {
			if (this.isLoading || this.queryParams.status === 'noMore') return;
			this.getlist();
		}
	};
</script>

<style scoped lang="scss">
	// 页面全局容器
	.note-list-page {
		width: 100%;
		min-height: 100vh;
		background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
		box-sizing: border-box;
	}

	// 笔记列表外层容器 ✅ 新增底部内边距 防止最后一条被遮挡
	.note-list-wrap {
		width: 100%;
		padding: 20rpx 16rpx;
		box-sizing: border-box;
		padding-bottom: 80rpx;
	}

	// 单个笔记项 - 核心样式
	.note-item {
		width: 100%;
		margin-bottom: 20rpx;

		// 卡片点击反馈
		&:active {
			opacity: 0.95;
		}
	}

	// 笔记卡片样式 - 升级质感
	.note-card {
		width: 100%;
		background-color: #fff;
		border-radius: 20rpx;
		padding: 24rpx;
		box-sizing: border-box;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.06);
		border: 1px solid #f0f0f0;
		transition: all 0.2s ease;

		&:hover {
			transform: translateY(-2rpx);
			box-shadow: 0 6rpx 24rpx rgba(0, 0, 0, 0.08);
		}
	}

	// 卡片头部：头像+名称
	.card-header {
		display: flex;
		align-items: center;
		margin-bottom: 16rpx;

		.avatar {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			margin-right: 16rpx;
			border: 2px solid #f5f5f5;
		}

		.header-info {
			flex: 1;

			.note-title {
				font-size: 32rpx;
				font-weight: 600;
				color: #212529;
				line-height: 1.4;
				display: block;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				margin-bottom: 4rpx;
			}

			.member-count {
				font-size: 22rpx;
				color: #6c757d;
				line-height: 1;
			}
		}

		.join-tag {
			font-size: 20rpx;
			color: #409eff;
			background-color: #e8f4ff;
			padding: 6rpx 12rpx;
			border-radius: 12rpx;
		}
	}

	// 圈子动态描述
	.note-content {
		font-size: 26rpx;
		color: #495057;
		line-height: 1.6;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		margin-bottom: 16rpx;
	}

	// 标签+分类 容器
	.note-tag-category {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
		margin-bottom: 16rpx;
		padding-bottom: 16rpx;
		border-bottom: 1px dashed #e9ecef;

		.note-tag {
			font-size: 22rpx;
			color: #007aff;
			background-color: #e6f0ff;
			padding: 6rpx 12rpx;
			border-radius: 20rpx;
		}

		.note-category {
			font-size: 22rpx;
			color: #58c096;
			background-color: #e8f8f2;
			padding: 6rpx 12rpx;
			border-radius: 20rpx;
		}
	}

	// 卡片底部 ✅ 修复样式笔误 10r → 10rpx
	.card-footer {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.create-time {
			font-size: 22rpx;
			color: #adb5bd;
		}

		.public-text {
			font-size: 20rpx;
			padding: 4rpx 10rpx;
			border-radius: 8rpx;
		}

		.public {
			color: #67c23a;
			background-color: #f0f9ff;
		}

		.private {
			color: #909399;
			background-color: #f5f5f5;
		}
	}

	// 加载更多组件间距
	.load-more {
		width: 100%;
		margin-top: 30rpx;
		margin-bottom: 50rpx;
		text-align: center;
	}
</style>