const VC_POS_STORAGE_KEY = 'vc_pos';

type VCPos = {
  x: number;
  y: number;
};

export function setVCPosStorage(pos: VCPos | null) {
  uni.setStorageSync(VC_POS_STORAGE_KEY, pos);
}

export function getVCPosStorage(): VCPos | null {
  const value = uni.getStorageSync(VC_POS_STORAGE_KEY);

  if (typeof value === 'string') {
    return null;
  }

  return value;
}
