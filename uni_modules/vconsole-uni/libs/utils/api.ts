export function setClipboardData(text: string): void {
  uni.setClipboardData({
    data: text,
    success: () => {
      uni.showToast({ title: '已复制', icon: 'none' });
    },
    fail: () => {
      uni.showToast({ title: '复制失败', icon: 'none' });
    },
  });
}
