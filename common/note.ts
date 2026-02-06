
/**
 * 获取笔记位置信息
 * @param item 笔记数据项
 * @returns 位置信息
 */
export const getNoteLocation = (item: any) => {
    return getItemByType(item, 'location') 
}
/**
 * 获取笔记视频信息
 * @param item 笔记数据项
 * @returns 视频信息
 */
export const getNoteVideo = (item: any) => {
    return getItemByType(item, 'video') 
}
/**
 * 获取笔记名片信息
 * @param item 笔记数据项
 * @returns 名片信息
 */
export const getNoteCard = (item: any) => {
    return getItemByType(item, 'user') 
}
/**
 * 获取笔记图片信息
 * @param item 笔记数据项
 * @returns 图片信息
 */
export const getNoteImage = (item: any) => {
    return getItemByType(item, 'image') 
}
/**
 * 获取指定类型的项
 * @param data 笔记数据项
 * @param type 项类型
 * @returns 指定类型的项
 */
export const getItemByType = (data: any, type: string) => {
    return data?.find(item => item.dataType === type)
}