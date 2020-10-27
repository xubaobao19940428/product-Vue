// 锚点
export const POINT_LIST = [{
    type: 1,
    name: '样式一',
    // 横向滚动的效果
}, {
    type: 2,
    name: '样式二',
}]
export const COUPON_LIST = [{
    key: 0,
    name: '样式一',
    initData: {
        bgColor: '#FFE18D', // 背景颜色1
        bgColor1: '#FDF2D8', // 背景颜色2
        btnBgColor: '#FF3A5D', // 领取按钮背景
        btnColor: '#fff', // 领取按钮字体颜色
        text1Color: '#FF3315', // 标题
        text2Color: '#FF3315', // 门槛
        text3Color: '#F63457' // 说明
    }
}, {
    key: 1,
    name: '样式2',
    initData: {
        bgColor: '#FDDE9E', // 背景颜色1
        bgColor1: '#FDDE9E', // 背景颜色2
        btnBgColor: '#FF3A5D', // 领取按钮背景
        btnColor: '#fff', // 领取按钮字体颜色
        text1Color: '#FF3315', // 标题
        text2Color: '#FF3315', // 门槛
        text3Color: '#9F3524' // 说明
    }
}]
export default {
    POINT_LIST,
    COUPON_LIST
}
