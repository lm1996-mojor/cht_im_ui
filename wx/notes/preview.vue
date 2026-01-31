<template>
	<view class="note-page-wrap">
		<!-- 引入预览组件 -->
		<note-preview  :content-list="contentList" :visible="true"
			@close="previewShow = false" 
			@clickUser="handleClick" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 内容块列表 - 只包含已选择/已添加的有效块
				contentList: [],
				windowWidth: 0,
				noteId: ''
			}
		},
		onLoad(e) {
			this.noteId = e.noteId;
			this.getData()
		},
		methods: {
			getData() {
				this.$http.request({
					url: `/chat_im/notes/detail/${this.noteId}`,
					method: 'GET',
					success: (res) => {
						if (res.data.code == 200) {
							this.contentList = JSON.parse(res?.data?.data?.content||'[]')
						}
					}
				});

			},
			handleClick(e){
				uni.navigateTo({ url: `../personInfo/detail?userId=${e.data.id}&source=${e.source}` });
			}
		}
	}
</script>

<style scoped>
	/* 全局样式 */
	page {
		width: 100%;
		height: 100%;
		overflow: hidden !important;
	}

	.note-page-wrap {
		padding:5px;
		width: 100%;
		height: 100vh;
		background-color: #f8f8f8;
		box-sizing: border-box;
		position: relative;
		overflow: auto !important;
	}

	/* 滚动区域 */
	.note-create-page {
		width: 100%;
		height: 100%;
		padding: 30rpx;
		padding-bottom: 150rpx;
		box-sizing: border-box;
	}

	/* 空状态提示 */
	.empty-tips {
		text-align: center;
		font-size: 28rpx;
		color: #999;
		margin-top: 100rpx;
	}

	/* 内容块样式 */
	.content-block {
		display: flex;
		align-items: flex-start;
		background: #fff;
		border-radius: 10rpx;
		border: 1px solid #eee;
		/* padding: 20rpx; */
		position: relative;
	}

	/* 拖拽手柄 */
	.drag-handle {
		width: 60rpx;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
		color: #ccc;
		touch-action: none;
		cursor: move;
	}

	.drag-icon {
		font-size: 32rpx;
	}

	/* 内容块主体 */
	.block-content {
		flex: 1;
		position: relative;
		/* 给删除按钮做定位父级 */
	}

	/* 标题块专属样式 - 相对定位承载删除按钮 */
	.title-block {
		padding: 10rpx 0;
	}

	/* 标题输入框 */
	.title-input {
		width: 100%;
		font-size: 32rpx;
		font-weight: 600;
		line-height: 48rpx;
		padding: 10rpx 0;
		border: none;
		outline: none;
	}

	/* 文本块专属样式 - 相对定位承载删除按钮 */
	.text-block {
		padding: 10rpx 0;
	}

	/* 文本输入框 */
	.text-input {
		width: 100%;
		font-size: 28rpx;
		line-height: 40rpx;
		padding: 10rpx 0;
		border: none;
		outline: none;
		min-height: 120rpx;
	}

	/* 图片/视频预览样式 */
	.preview-wrap {
		width: 100%;
		position: relative;
		border-radius: 8rpx;
		overflow: hidden;

		.user {
			display: flex;
			gap: 4px;
			padding: 4px;
			align-items: center;
		}
	}

	.preview-img {
		width: 100%;
		height: 300rpx;
	}

	.preview-video {
		width: 100%;
		height: 300rpx;
	}

	/* 通用删除按钮样式 - 所有块共用 */
	.delete-btn {
		position: absolute;
		top: 0rpx;
		right: 0rpx;
		background: rgba(0, 0, 0, 0.5);
		color: #fff;
		font-size: 24rpx;
		padding: 8rpx 16rpx;
		border-radius: 6rpx;
		z-index: 10;
		/* 确保按钮在最上层 */
	}

	/* 底部操作栏 */
	.operate-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		padding: 20rpx 30rpx;
		background: #fff;
		border-top: 1px solid #eee;
		z-index: 999;
		display: flex;
		flex-direction: column;
		gap: 10rpx;

		.tool {
			display: flex;
			justify-content: space-between;

			.tool-item {
				display: flex;
				flex-direction: column;
				align-items: center;
				font-size: 20rpx;
			}
		}

		.btn {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 10rpx;

			.submit-btn {
				/* height: 80rpx; */
				/* line-height: 80rpx; */
				background: #007aff;
				color: #fff;
				border: none;
				border-radius: 40rpx;
				/* font-size: 28rpx; */
			}

			.preview-btn {
				/* height: 80rpx; */
				/* line-height: 80rpx; */
				background: #007aff;
				color: #fff;
				border: none;
				border-radius: 40rpx;
				/* font-size: 28rpx; */
			}
		}
	}

	.operate-btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		background: #f7f8fa;
		color: #333;
		border: none;
		border-radius: 8rpx;
		font-size: 28rpx;
		margin-right: 15rpx;
	}
</style>