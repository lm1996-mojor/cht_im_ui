<template>
	<view>
		<view v-if="loaded || list.length < 15" class="xw-book-wrapper">
			<view v-if="list && list.length > 0" class="xw-book-sort">{{ list.key }}</view>
		</view>
		<view v-if="(loaded || list.length < 15) && list.length && list.length > 0" class="xw-book-userlist">
			<view v-for="(item, index) in list" :key="index">
				<view class="xw-book-user" @click="onClick(item)">
					<view v-if="showSelect" class="xw-book-user-checked">
						<uni-icons :type="item.checked ? 'checkbox-filled' : 'circle'" :color="item.checked ? '#09C160' : '#C0C0C0'" size="28" />
					</view>
					<image class="xw-book-user-avatar" :src="item.avatar>0?`../../static/img/avatar/avatar${item.avatar}.jpg`:item.avatar" mode="aspectFill"></image>
					<view class="xw-book-user-name">{{item.nickname}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'UniIndexedListWX',
		emits: ['itemClick'],
		props: {
			loaded: {
				type: Boolean,
				default: false
			},
			idx: {
				type: Number,
				default: 0
			},
			list: {
				type: Object,
				default () {
					return {}
				}
			},
			showSelect: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			onClick(data) {
				this.$emit("itemClick",data)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.xw-book-wrapper {
		/* #ifndef APP-NVUE */
		display: flex;
		width: 100%;
		/* #endif */
	}
	.xw-book-sort {
		padding: 0 24rpx;
		flex: 1;
		line-height: 60rpx;
		background-color: #fafafa;
		font-size: 26rpx;
	}
	.xw-book-userlist {
		padding: 0 24rpx;
		padding-right: 0;
		border-radius: 24rpx;
		box-shadow: 0px 0px 10rpx rgba(0, 0, 0, 0.05);
	}

	.xw-book-user {
		display: flex;
		flex-direction: row;
		align-items: center;
		width: 100%;
	}

	.xw-book-user-avatar {
		width: 90rpx;
		height: 90rpx;
		border-radius: 10rpx;
	}

	.xw-book-user-name {
		font-size: 32rpx;
		margin-left: 26rpx;
		height: 90rpx;
		line-height: 90rpx;
		padding-bottom: 13rpx;
		padding-top: 13rpx;
		border-bottom: 1px #f8f8f8 solid;
		max-width: 560rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.xw-book-user-checked{
		margin-right: 20rpx;
	}
</style>
