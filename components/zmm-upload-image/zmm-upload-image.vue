<template>
	<view class="zmm-upload-image" v-if="show">
		<zmm-upload-image-drag :key="key" :rowNum="rows" :imgRadius="imgRadius" :imgSize="imgSize"
			:imgPadding="imgPadding" :imgList="fileList" @deleteImage="deleteImage" @itemclick="itemclick">
			<view v-if="showAdd && fileList.length < limit" @tap="chooseTap"
				:style="{ width: imgSize + 'rpx', height: imgSize + 'rpx',padding:imgPadding+'rpx' }"
				class="zmm-upload-image-item-slot">
				<view class="zmm-upload-image-item-slotIcon">
					<uni-icons type="plusempty" color="#6E6E6E" size="24" />
				</view>
			</view>
		</zmm-upload-image-drag>
	</view>
</template>

<script>
	import zmmUploadImageDrag from './zmm-upload-image-drag.vue';
	import http from '@/common/request.js';
	export default {
		components: {
			zmmUploadImageDrag
		},
		name: 'zmm-upload-image',
		emits: ['update:modelValue', 'deleteImage', 'allComplete', 'oneComplete'],
		props: {
			modelValue: { type: Array, default: () => [] },
			chooseType: { type: String, default: 'chooseImage' },
			imgSize: { type: Number, default: 214 },
			imgPadding: { type: Number, default: 6 },
			imgRadius: { type: Number, default: 4 },
			rowNumber: { type: Number, default: 3 },
			showAdd: { type: Boolean, default: true },
			show: { type: Boolean, default: true },
			fileAction: { type: String, default: http.baseUrl + '/chat_im/file/small/upload' },
			videoAction: { type: String, default: http.baseUrl + '/file/uploadVideo' },
			formData: { type: Object, default: () => ({}) },
			header: { type: Object, default () { return { Authorization: uni.getStorageSync('Authorization'), device: uni.getStorageSync('device'), version: uni.getStorageSync('version') }; } },
			limit: { type: Number, default: 9 },
			fileKey: { type: String, default: 'file' }
		},
		data() {
			return {
				key: 0,
				isDestroyed: false,
				showUploadProgress: true,
                // ✅✅✅【核心新增】子组件本地独立数组，作为唯一的渲染数据源，彻底脱离父组件依赖
                localFileList: []
			};
		},
		watch: {
            // ✅✅✅ 监听本地数组，数据变化就更新key，强制子组件渲染
            localFileList: {
                deep: true,
                immediate: true,
                handler() {
                    this.key++;
                    console.log('✅本地数据更新了：', this.localFileList);
                }
            }
		},
		mounted: function() {},
		destroyed: function() {
			this.isDestroyed = true;
		},
		computed: {
			rows() {
				var buzhu = this.showAdd && this.fileList.length < this.limit ? 1 : 0;
				var rows = Math.ceil((this.fileList.length + buzhu) / this.rowNumber);
				return rows
			},
            // ✅✅✅【核心修改】fileList指向本地数组，页面渲染/拖拽组件都用这个，永远有值
			fileList() {
				return this.localFileList;
			}
		},
		methods: {
			itemclick(e, i) {
				if (!e.videoUrl) {
					var imgs = []
					for (var i = 0; i < this.fileList.length; i++) {
						var item = this.fileList[i]
						if (!item.videoUrl) {
							imgs.push(item.url)
						}
					}
					this.previewImage(imgs, i)
				} else {
					this.$fc.plusDownload({ onlinePath: e.videoUrl }).then(res => {
						this.$fc.plusOpenFile({ filePath: res })
					})
				}
			},
			chooseTap() {
				switch (this.chooseType) {
					case 'chooseImage': this.selectImage(); break;
					case 'chooseVideo': this.selectVideo(); break;
					case 'chooseMedia':
						uni.showActionSheet({
							itemList: ['图片', '视频'],
							success: (res) => { res.tapIndex==0?this.selectImage():this.selectVideo() }
						}); break;
				}
			},
			selectImage: function() {
				var _self = this;
                // ✅ 直接用本地数组，无需拷贝父组件数据
				if (_self.localFileList.length >= _self.limit) {
					uni.showToast({title:`最多只能上传${_self.limit}张图片`,icon:'none'});
					return;
				}
				uni.chooseImage({
					count: _self.limit - _self.localFileList.length,
					sourceType: ['album', 'camera'],
					sizeType: ['original', 'compressed'],
					success: function(e) {
						var imagePathArr = e.tempFilePaths;
						if (_self.fileAction) {
							uni.showToast({ title: '开始上传...', icon: 'none' });
							var promiseWorkList = [];
							var keyname = _self.fileKey;
							var completeImages = 0;

							for (let i = 0; i < imagePathArr.length; i++) {
                                // ✅✅✅【核心修复】异步BUG：把getFileInfo封装进Promise内部，保证Promise能被正确收集
								promiseWorkList.push(new Promise((resolve, reject) => {
									let filePath = imagePathArr[i];
									uni.getFileInfo({
										filePath: filePath,
										success: function(infoRes) {
											uni.uploadFile({
												url: _self.fileAction,
												fileType: 'image',
												header: _self.header,
												filePath: filePath,
												name: keyname,
												formData: { ..._self.formData, fileName: 'test', fileType: 'image', totalSize: infoRes.size },
												success: function(res) {
													if (res.statusCode === 200 && !_self.isDestroyed) {
														completeImages++;
														uni.showToast({ title: `已上传${completeImages}/${imagePathArr.length}`, icon: 'none' });
														var resItem = JSON.parse(res.data)
														const fileItem = {name: resItem.data.fileName,url: resItem.data.storagePath,type: 'IMAGE'}
														_self.$emit('oneComplete', fileItem, _self.chooseType);
														resolve(fileItem); // ✅ 返回数据给Promise.all
													} else { reject('上传失败'); }
												},
												fail: () => { uni.showToast({title: '上传失败请检查网络',icon: 'none'}); reject('上传失败'); }
											});
										},
										fail: () => { reject('获取文件信息失败'); }
									});
								}));
							}
							// ✅ 所有上传完成后，直接赋值给本地数组，页面立刻渲染！！！
							Promise.all(promiseWorkList).then(result => {
								if (_self.isDestroyed) return;
								_self.localFileList = [..._self.localFileList, ...result];
								_self.$emit('allComplete', result, _self.chooseType);
								_self.$emit('input', _self.localFileList); // Vue2兼容
								_self.$emit('update:modelValue', _self.localFileList); // Vue3兼容
							});
						} else {
							// 本地预览模式，直接赋值本地数组
							let addList = imagePathArr.map((path,i)=>({name: 'avatar' + i + '.jpg',url: path}));
							_self.localFileList = [..._self.localFileList, ...addList];
							_self.$emit('update:modelValue', _self.localFileList);
						}
					}
				});
			},
			selectVideo: function() {
				var _self = this;
				if (_self.localFileList.length >= _self.limit) {
					uni.showToast({title:`最多只能上传${_self.limit}个视频`,icon:'none'});
					return;
				}
				uni.chooseVideo({
					count: _self.limit - _self.localFileList.length,
					sourceType: ['album', 'camera'],
					compressed: true,
					// success: function(e) {
					// 	if (_self.showUploadProgress) uni.showLoading({ title: '上传中...' })
					// 	uploadVideo(e).then(res => {
					// 		uni.hideLoading()
					// 		_self.localFileList.push(res); // ✅ 直接push本地数组，立刻显示
					// 		_self.$emit('allComplete', res, _self.chooseType);
					// 		_self.$emit('input', _self.localFileList);
					// 		_self.$emit('update:modelValue', _self.localFileList);
					// 	})
					// 	function uploadVideo(e) {
					// 		return new Promise((resolve, reject) => {
					// 			uni.uploadFile({
					// 				url: _self.videoAction,
					// 				fileType: 'video',
					// 				header: _self.header,
					// 				filePath: e.tempFilePath,
					// 				name: _self.fileKey,
					// 				formData: {..._self.formData,fileType: 'video'},
					// 				success: function(res) {
					// 					if (res.statusCode === 200 && !_self.isDestroyed) {
					// 						var resItem = JSON.parse(res.data)
					// 						var fresult = {name: resItem.data.fileName,videoUrl: resItem.data.fullPath,url: resItem.data.screenShot,type: 'VIDEO'}
					// 						_self.$emit('oneComplete', fresult, _self.chooseType);
					// 						resolve(fresult)
					// 					} else { reject(res) }
					// 				},
					// 				fail: () => { uni.showToast({title: '上传失败请检查网络',icon: 'none'}); reject(res) }
					// 			});
					// 		})
					// 	}
					// }
					success: function(e) {
						var imagePathArr = [e.tempFilePath];
						if (_self.fileAction) {
							uni.showToast({ title: '开始上传...', icon: 'none' });
							var promiseWorkList = [];
							var keyname = _self.fileKey;
							var completeImages = 0;
					
							for (let i = 0; i < imagePathArr.length; i++) {
					            // ✅✅✅【核心修复】异步BUG：把getFileInfo封装进Promise内部，保证Promise能被正确收集
								promiseWorkList.push(new Promise((resolve, reject) => {
									let filePath = imagePathArr[i];
									uni.getFileInfo({
										filePath: filePath,
										success: function(infoRes) {
											uni.uploadFile({
												url: _self.fileAction,
												fileType: 'video',
												header: _self.header,
												filePath: filePath,
												name: keyname,
												formData: { ..._self.formData, fileName: 'test', fileType: 'video', totalSize: infoRes.size },
												success: function(res) {
													if (res.statusCode === 200 && !_self.isDestroyed) {
														completeImages++;
														uni.showToast({ title: `已上传${completeImages}/${imagePathArr.length}`, icon: 'none' });
														var resItem = JSON.parse(res.data)
														const fileItem = {name: resItem.data.fileName,url: resItem.data.storagePath,type: 'video'}
														_self.$emit('oneComplete', fileItem, _self.chooseType,'video');
														resolve(fileItem); // ✅ 返回数据给Promise.all
													} else { reject('上传失败'); }
												},
												fail: () => { uni.showToast({title: '上传失败请检查网络',icon: 'none'}); reject('上传失败'); }
											});
										},
										fail: () => { reject('获取文件信息失败'); }
									});
								}));
							}
							// ✅ 所有上传完成后，直接赋值给本地数组，页面立刻渲染！！！
							Promise.all(promiseWorkList).then(result => {
								if (_self.isDestroyed) return;
								_self.localFileList = [..._self.localFileList, ...result];
								_self.$emit('allComplete', result, _self.chooseType);
								_self.$emit('input', _self.localFileList); // Vue2兼容
								_self.$emit('update:modelValue', _self.localFileList); // Vue3兼容
							});
						} else {
							// 本地预览模式，直接赋值本地数组
							let addList = imagePathArr.map((path,i)=>({name: 'avatar' + i + '.jpg',url: path}));
							_self.localFileList = [..._self.localFileList, ...addList];
							_self.$emit('update:modelValue', _self.localFileList);
						}
					}
				});
			},
			deleteImage: function(e) {
                // ✅ 删除直接操作本地数组，立刻生效
				const newList = this.localFileList.filter(item => item.url !== e.url && item.videoUrl !== e.videoUrl);
				this.localFileList = newList;
				this.$emit('update:modelValue', newList);
				this.$emit('deleteImage', e);
			},
			previewImage: function(arr, index) {
				uni.previewImage({ current: index, indicator: 'number', loop: true, urls: arr });
			},
		}
	};
</script>

<style scoped>
	.zmm-upload-image { width: 100%; position: relative; }
	.zmm-upload-image-item-slot { box-sizing: border-box; }
	.zmm-upload-image-item-slotIcon { box-sizing: border-box;width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;background-color: #f7f7f7;border-radius: calc(var(--imgRadius, 4) * 1rpx); }
</style>