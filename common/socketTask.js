// @/common/publicFc.js 完整改造后代码
let timer = null; //心跳计时器
let debug = false; //debug输出log
let retimer = null; //重连计时器
let pingCount = 0; //心跳次数
let pingCountMax = 5; //最大心跳次数超过重连
let pingTimeout = 15000; //心跳间隔时间(毫秒)
let connectTimeout = 2000; //重连时间(毫秒)
let socketTask = null; //ws 全局唯一实例

// ========== 封装成全局单例对象，所有方法都在这里 ==========
export const ws = {
	// 1. 连接WebSocket (你的原有代码，只修复bug+打开注释)
	connectSocket() {
		debug && console.log('当前socket实例：', socketTask);
		var token = uni.getStorageSync('Authorization');
		var userInfo = uni.getStorageSync('userInfo');
		// 修复bug：增加userInfo判断，避免拼接url报错；判断已连接则不重复连接
		if (!token || !userInfo || !userInfo.id || socketTask) {
			console.log('开启socket失败：token/用户信息为空 或 已建立连接');
			return;
		}
		// 创建socket连接 (你的原有地址不变)
		socketTask = uni.connectSocket({
			url: 'ws://129.204.4.150/chat_im/ws/connect?userId=' + userInfo.id + '&device=web',
			complete: () => {}
		});

		// 监听连接成功
		socketTask.onOpen(res => {
			console.log('✅ WebSocket连接已打开！');
			const token = uni.getStorageSync('Authorization');
			// ========== 打开你注释的【心跳保活】核心逻辑 (必须打开) ==========
			socketTask.send({
				data: JSON.stringify({
					op: 1,
					seq: `sender-ping-${Date.now()}`,
					data: {
						"Authorization": `${token}`,
					}
				}),
				success: res => {
					if (res.errMsg == 'sendSocketMessage:ok') {
						debug && console.log('心跳包发送成功');
					}
				}
			})
			// 定时发送心跳
			timer = setInterval(() => {
				pingCount++
				debug && console.log('心跳次数：' + pingCount + '/' + pingCountMax);
				// if (pingCount >= pingCountMax) {
				// 	this.clearSocketTask()
				// 	this.reConnectSocket()
				// 	return
				// }
				socketTask.send({
					data: JSON.stringify({
						op: 0,
						seq: `sender-ping-${Date.now()}`,
						// data: {
						// 	"Authorization": `${token}`,
						// }
					}),
					success: res => {
						if (res.errMsg == 'sendSocketMessage:ok') {
							debug && console.log('心跳包发送成功');
						}
					}
				})
			}, pingTimeout)
		})

		// 监听接收消息【全局统一接收，核心】
		socketTask.onMessage(res => {
			if (socketTask && uni.getStorageSync('Authorization')) {
				// 心跳响应：后端返回ok，重置心跳次数
				if (res.data == 'ok') {
					pingCount = 0;
					return;
				}
				// 业务消息：全局分发推送数据，所有页面都能监听到
				var data = JSON.parse(res.data);
				if(data.op==0) return
				console.log('📥 收到WebSocket推送消息：', data?.data?.content ||data);
				// ========== 全局消息分发核心：uniapp官方全局事件 ==========
				uni.$emit('onSocketPush', data);
			}
		})

		// 监听连接关闭 + 打开你注释的【自动重连】逻辑
		socketTask.onClose((res) => {
			debug && console.log(socketTask);
			console.log('❌ WebSocket连接已关闭！');
			if (socketTask) {
				console.log('准备重新连接WebSocket');
				this.clearSocketTask()
				this.reConnectSocket()
			}
		})

		// 监听连接异常 + 自动重连
		socketTask.onError(res => {
			debug && console.log(socketTask);
			console.log('❌ WebSocket连接异常！');
			if (socketTask && socketTask.readyState !== 1) {
				console.log('准备重新连接WebSocket');
				this.clearSocketTask()
				this.reConnectSocket()
			}
		});
	},

	// 2. 清理WebSocket (你的原有代码，无改动)
	clearSocketTask() {
		clearInterval(timer)
		clearTimeout(retimer)
		pingCount = 0;
		if (socketTask) {
			socketTask.close()
			socketTask = null
			console.log('🔌 主动关闭WebSocket！');
		}
	},

	// 3. 重新连接WebSocket (你的原有代码，无改动)
	reConnectSocket() {
		retimer = setTimeout(() => {
			this.connectSocket()
		}, connectTimeout)
	},

	// 4. 新增：全局发送消息方法 (核心！所有页面直接调用这个方法发消息)
	sendSocketMsg(data) {
		// 校验socket连接状态：1=已连接，0=未连接，2=关闭中，3=已关闭
		if (!socketTask || socketTask.readyState !== 1) {
			console.log('❌ 发送失败：WebSocket未连接');
			uni.showToast({
				title: '连接已断开，正在重连',
				icon: 'none',
				duration: 2000
			});
			this.reConnectSocket(); // 未连接则自动重连
			return false;
		}
		// 发送消息：对象转JSON字符串，字符串直接发送
		const sendData = typeof data === 'object' ? JSON.stringify(data) : data;
		socketTask.send({
			data: sendData,
			success: (res) => {
				if (res.errMsg == 'sendSocketMessage:ok') {
					debug && console.log('📤 消息发送成功：', sendData);
				}
			},
			fail: (err) => {
				console.log('❌ 消息发送失败：', err);
				uni.showToast({
					title: '消息发送失败',
					icon: 'none'
				});
			}
		})
		return true;
	},

	// 暴露socket实例，方便特殊场景使用
	getSocketTask() {
		return socketTask;
	}
}

// 你原来的fc对象保留，不影响你其他业务使用
// export const fc = {
// 	getPush(data) {
// 		// 这里的逻辑可以保留，也可以直接用上面的全局事件分发，二选一即可
// 	}
// }