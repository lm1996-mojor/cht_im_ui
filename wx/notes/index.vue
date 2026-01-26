<template>
	<view class="note-list-page">
		<watermark></watermark>
		<!-- 笔记列表容器 -->
		<view class="note-list-wrap">
			<!-- 循环渲染笔记列表，保留原点击事件/key/循环源 完全不变 -->
			<view class="note-item" v-for="item in content" :key="item.id" @click="gomsglist">
				<!-- 笔记卡片主体 -->
				<view class="note-card">
					<view class="note-card-title">
						<user-avatar v-if="item?.imgItem?.content" :modelValue="item.imgItem.content"></user-avatar>
						<!-- 笔记标题 -->
						<text class="note-title">{{ item?.titleItem?.content||item?.textItem?.content }}</text>
					</view>
					<!-- 笔记内容简介 (富文本自动过滤标签，截取长度，避免过长) -->
					<!-- <text class="note-content">{{ item.content || '无内容' }}</text> -->

					<!-- 笔记标签+分类 行 -->
					<!-- <view class="note-tag-category">
						<text class="note-tag" v-if="item.tag">{{ item.tag }}</text>
						<text class="note-category" v-if="item.category">
							{{ item.category == 'work' ? '工作笔记' : item.category == 'life' ? '生活随笔' : item.category == 'study' ? '学习记录' : '其他' }}
						</text>
					</view> -->

					<!-- 是否公开标识 -->
					<view class="note-public" v-if="item.isPublic !== null">
						<text class="public-text" :class="item.isPublic ? 'public' : 'private'">
							{{ item.isPublic ? '公开笔记' : '私密笔记' }}
						</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 加载更多组件 保留原逻辑 位置不变 -->
		<uni-load-more :status="queryParams.status" class="load-more"></uni-load-more>
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
			};
		},
		computed: {
			cover() {
				var cover = {
					type: 'img',
					url: 'https://cdn.svipaigc.com/bizi/2024/07/61b9.jpg'
				} //this.$store.state.userInfo.cover ? JSON.parse(this.$store.state.userInfo.cover) : { type: 'img', name: '', url: '' };
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
			this.handleRefresh();
		},
		onShow() {
			this.handleRefresh();
		},
		methods: {
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
				this.queryParams.status = 'loading'
				this.$fc.loadMore({
					url: '/chat_im/notes/page?',
					queryParams: this.queryParams
				}).then(res => {
					const formatList = (res.list || []).map((item) => {
						const contentItem = JSON.parse(item.content)
						// 找图片
						const imgItem = contentItem.find((item) => item.dataType === 'image')
						// 找标题
						const titleItem = contentItem.find((item) => item.dataType === 'title')
						// 找文本
						const textItem = contentItem.find((item) => item.dataType === 'text')
						return {
							...item,
							imgItem,
							titleItem,
							textItem
						}
					});
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
			userClick(cover, user) {
				uni.navigateTo({
					url: '../../wx/friendsCircle/person'
				});
			},
			gomsglist() {
				uni.navigateTo({
					url: './msglist'
				});
			}
		},
		onPageScroll(e) {
			if (this.$refs['fcli']) this.$refs['fcli'].hidenTool();
		},
		onNavigationBarButtonTap(e) {
			switch (e.index) {
				case 0:
					uni.navigateTo({
						url: '../notes/create'
					});
					break;
				default:
					break;
			}
		},
		onPullDownRefresh() {
			// this.queryParams.refreshing = true
			this.handleRefresh();
		},
		onReachBottom() {
			this.getlist();
		}
	};
</script>

<style scoped lang="scss">
	// 页面全局容器
	.note-list-page {
		width: 100%;
		min-height: 100vh;
		background-color: #f5f5f7;
		box-sizing: border-box;
	}

	// 笔记列表外层容器
	.note-list-wrap {
		width: 100%;
		padding: 30rpx 24rpx;
		box-sizing: border-box;
	}

	// 单个笔记项 - 核心样式
	.note-item {
		width: 100%;
		margin-bottom: 24rpx;
	}

	// 笔记卡片样式 - 美观的卡片效果
	.note-card {
		width: 100%;
		background-color: #fff;
		border-radius: 16rpx;
		padding: 30rpx 28rpx;
		box-sizing: border-box;
		box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
		.note-card-title{
			display: flex;gap:4px;
		}
	}

	// 笔记标题
	.note-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #1a1a1a;
		line-height: 1.5;
		display: block;
		margin-bottom: 16rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	// 笔记内容简介
	.note-content {
		font-size: 26rpx;
		color: #666;
		line-height: 1.6;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 3;
		overflow: hidden;
		margin-bottom: 20rpx;
	}

	// 标签+分类 容器
	.note-tag-category {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
		margin-bottom: 16rpx;
	}

	// 笔记标签样式
	.note-tag {
		font-size: 22rpx;
		color: #007aff;
		background-color: #e6f0ff;
		padding: 6rpx 12rpx;
		border-radius: 20rpx;
	}

	// 笔记分类样式
	.note-category {
		font-size: 22rpx;
		color: #58c096;
		background-color: #e8f8f2;
		padding: 6rpx 12rpx;
		border-radius: 20rpx;
	}

	// 是否公开标识
	.note-public {
		width: 100%;
		text-align: right;
	}

	.public-text {
		font-size: 22rpx;
		padding: 4rpx 10rpx;
		border-radius: 12rpx;
	}

	// 公开笔记标识
	.public {
		color: #007aff;
		background-color: #e6f0ff;
	}

	// 私密笔记标识
	.private {
		color: #999;
		background-color: #f5f5f5;
	}

	// 加载更多组件间距
	.load-more {
		width: 100%;
		margin-top: 20rpx;
		margin-bottom: 40rpx;
	}
</style>