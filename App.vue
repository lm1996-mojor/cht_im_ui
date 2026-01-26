<script>
	// 简单的使用示例
	// 'use strict';
	// const uniPush = uniCloud.getPushManager({appId:"__UNI__B90E958"}) //注意这里需要传入你的应用appId，用于指定接收消息的客户端
	// exports.main = async (event, context) => {
	// 	return await uniPush.sendMessage({
	// 		"push_clientid": "xxx", 	//填写上一步在uni-app客户端获取到的客户端推送标识push_clientid
	// 		"title": "通知栏显示的标题",	
	// 		"content": "通知栏显示的内容",
	// 		"payload": {
	// 			"text":"体验一下uni-push2.0"
	// 		}
	// 	})
	// };
	import {
		version,
		name
	} from './package.json'
	import {
		versionName
	} from '@/manifest.json'
	import consoleImgs from '@/common/consoleImgs.js'
	// #ifdef APP-PLUS
	import appUpgrade from '@/common/appUpgrade.js';
	const TUICalling = uni.requireNativePlugin("TUICallingUniPlugin-TUICallingModule");
	
	// #endif
	export default {
		onLaunch: function() {
			

			// uni-app客户端获取push客户端标记
			uni.getPushClientId({
				success: (res) => {
					let push_clientid = res.cid
					console.log('客户端推送标识:', push_clientid)
				},
				fail(err) {
					console.log(err)
				}
			})
			uni.onPushMessage((res) => {
				console.log("收到推送消息push：", res) //监听推送消息
			});
			// #ifdef H5
			// console.log(
			// 	`%c 考拉Team ${name} %c v${version} `,
			// 	'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
			// 	'background:#007aff ;padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; font-weight: bold;'
			// )
			// console.log(consoleImgs.fz)
			// todo 下列两行
			uni.setStorageSync('device', 'H5');
			uni.setStorageSync('version', versionName);
			// this.$http.request({
			// 	url: '/common/getVersion',
			// 	success: (res) => {
			// 		if(res.data.data.upgrade=='Y'){
			// 			console.log(
			// 				`%c 有新版本 `+res.data.data.version,
			// 				'background:#007aff ;padding: 1px; border-radius: 0 3px 3px 0;  color: #fff; font-weight: bold;'
			// 			)
			// 		}
			// 	}
			// });
			// #endif
			console.log('App Launch')
			let token = uni.getStorageSync('Authorization');
			if (!token) {
				//不存在则跳转至登录页
				// #ifdef APP-PLUS
				plus.navigator.closeSplashscreen();
				// #endif
			} else {
				this.$store.dispatch('get_UserInfo').then(res => {
					// #ifdef APP-PLUS
					var nickName = res.nickName
					var portrait = res.portrait
					this.$http.request({
						url: '/trtc/getSign',
						success: (res) => {
							var sdkAppID = res.data.data.appId
							var userID = res.data.data.userId
							var userSig = res.data.data.sign
							TUICalling.login({ //登录音视频
								sdkAppID: sdkAppID,
								userID: userID,
								userSig: userSig
							}, (res) => {
								console.log('音视频登录成功')
								TUICalling.setUserNickname({
									nickName: nickName
								})
								TUICalling.setUserAvatar({
									avatar: portrait
								})
								plus.io.requestFileSystem(plus.io.PRIVATE_WWW, function(
									fs) {
									fs.root.getFile('/static/longcall.mp3', {
										create: false
									}, function(fileEntry) {
										fileEntry.file(function(file) {
											TUICalling
												.setCallingBell({
													ringtone: file
														.fullPath
												}, (res) => {
													console
														.log(
															JSON
															.stringify(
																res
															)
														)
												})
										});
									});
								});

							})
						}
					});
					this.$http.request({
						url: '/my/refresh',
						success: (res) => {}
					});
					// #endif
					// this.$ws.connectSocket()
				})
				uni.reLaunch({
					url: "wx/tabbar1/index",
				}).then(res => {
					// #ifdef APP-PLUS
					plus.navigator.closeSplashscreen();
					// #endif
				})
			}
			// #ifdef APP-PLUS
			//升级检测
			uni.getSystemInfo({
				success: (res) => {
					uni.setStorageSync('device', res.platform);
					plus.runtime.getProperty(plus.runtime.appid, (widgetInfo) => {
						uni.setStorageSync('version', widgetInfo.version);
						// this.$http.request({
						// 	url: '/common/getVersion',
						// 	success: (res) => {
						// 		if(res.data.data.upgrade=='Y'){
						// 			appUpgrade.init({
						// 				titleText: '版本更新'+res.data.data.version,
						// 				packageUrl:res.data.data.url,
						// 				content: res.data.data.content,
						// 				forceUpgrade:res.data.data.forceUpgrade=='Y' ? true : false
						// 			});
						// 			appUpgrade.show();
						// 		}
						// 	}
						// });
					});
				}
			});
			uni.onNetworkStatusChange((res) => {
				if (res.isConnected) {
					this.$store.dispatch('get_UserInfo')
				}
			});
			// #endif
		},
		onShow: function() {
			console.log('App Show')
			uni.getStorage({
				key: 'call',
				success: (res) => {
					var callx = res.data
					if (callx) {
						var call = JSON.parse(callx)

						function getInervalHour(startDate) { //获取两个时间之间的小时
							if (!startDate) {
								return '0秒'
							}
							var ms = new Date().getTime() - startDate;
							if (ms < 0) return '0秒';
							if ((ms / 1000) < 60) {
								return Math.floor(ms / 1000) + '秒';
							} else {
								return Math.floor(ms / 1000 / 60) + '分';
							}
						}
						var msgType = ''
						if (call.type == 'audio') {
							msgType = 'TRTC_VOICE_END'
						}
						if (call.type == 'video') {
							msgType = 'TRTC_VIDEO_END'
						}
						this.$fc.pushOutMsg({
							msgContent: getInervalHour(call.startTime),
							msgType: msgType,
							windowType: 'SINGLE',
							userId: call.userId,
						})
						uni.removeStorageSync('call')
					}
				}
			});
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>
<template>
	<VconsoleUni />
</template>
<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	@import "@/static/styles/animation.css";
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';

	// 设置整个项目的背景色
	page {
		box-sizing: border-box;
	}

	/* #endif */

	// 以下内容最好转移到单页
</style>