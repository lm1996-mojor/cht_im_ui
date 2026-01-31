<template>
	<!-- <uni-card> -->
	<uni-card :title="noteData?.titleItem?.content" :sub-title="noteData?.textItem?.content" extra=""
		:thumbnail="noteData?.imgItem?.content" @click="onClick"
		margin="0">
		<!-- <view> -->
			<!-- <text class="uni-body">
				这是一个带头像和双标题的基础卡片，此示例展示了一个完整的卡片
				这是一个带头像和双标题的基础卡片，此示例展示了一个完整的卡片。
				这是一个带头像和双标题的基础卡片，此示例展示了一个完整的卡片。。
			</text> -->
		<!-- </view> -->
		<text class="tag">笔记</text>
	</uni-card>

	<!-- <view class="note-card-title">
      <user-avatar
        v-if="noteData?.imgItem?.content"
        :modelValue="noteData?.imgItem?.content"
      ></user-avatar>
      <view class="note-box">
        <text class="note-title">{{ noteData?.titleItem?.content }}</text>
        <text class="note-content" v-if="noteData?.textItem?.content">{{
          noteData?.textItem?.content
        }}</text>
      </view>
    </view> -->
	<!-- <text class="tag">笔记</text> -->
	<!-- </uni-card> -->
</template>

<script>
	export default {
		props: {
			data: {
				type: Array,
				required: true,
				default: () => []
			}
		},
		methods: {
			// 关闭预览（向父组件发送事件）
			handleClose() {
				this.$emit('close')
			}
		},
		computed: {
			noteData() {
				const imgItem = this?.data?.find(item => item.dataType === 'image')
				const titleItem = this?.data?.find(item => item.dataType === 'title')
				const textItem = this?.data?.find(item => item.dataType === 'text')
				return {
					imgItem,
					titleItem,
					textItem
				}
			}
		}
	}
</script>

<style scoped lang="scss">
	// 外层容器：添加整体内边距，避免内容贴边
	.note-content-wrap {
		padding: 16rpx;
		display: flex;
		flex-direction: column;
		gap: 12rpx;
	}

	// 头像+标题容器：添加内部间距，清理冗余嵌套
	.note-card-title {
		display: flex;
		align-items: flex-start; // 改为顶部对齐，更贴合上下排列的标题+内容布局
		gap: 12rpx;
	}

	// 标题+内容容器：核心！限制最大宽度，触发省略效果
	.note-box {
		flex: 1; // 占满剩余宽度，适配不同屏幕
		max-width: 550rpx; // 移动端合理最大宽度，避免过宽
		display: flex;
		flex-direction: column;
		gap: 8rpx; // 标题与内容之间的间距，避免拥挤
	}

	// 笔记标题：单行超出省略
	.note-title {
		font-size: 32rpx;
		color: #333333;
		line-height: 1.4;
		// 单行省略核心样式
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block; // 转为块元素，更好地触发宽度限制
	}

	// 笔记内容：省略效果（默认单行，可选多行）
	.note-content {
		font-size: 28rpx; // 比标题小，区分层级
		color: #666666; // 比标题浅，视觉更柔和
		line-height: 1.4;
		// 方案1：单行超出省略（默认）
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		display: block;

		// 方案2：多行超出省略（推荐，注释掉方案1，启用此方案即可，可修改-webkit-line-clamp控制行数）
		// display: -webkit-box;
		// -webkit-box-orient: vertical;
		// -webkit-line-clamp: 2; // 最多显示2行，超出省略
		// overflow: hidden;
		// text-overflow: ellipsis;
	}

	// 笔记标签：核心优化（更小、更柔和）
	.tag {
		font-size: 20rpx;
		color: #888888;
		padding: 4rpx 10rpx;
		background-color: #f5f7fa;
		border-radius: 8rpx;
		width: fit-content;
	}
</style>