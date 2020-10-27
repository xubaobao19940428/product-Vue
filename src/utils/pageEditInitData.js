export default {
    productList: {
        productStatus: [], // 自动更新依据 'unStart' - 未开始 'progress' - 进行中 'end' - 已结束
        colNum: '2', // 列表样式：一行几个（暂时不接入大图平铺），一个则为详细列表，no则为横向滑动
        isShowLimit: false, // 是否开启上限控制
        limitLine: 1, // 上限控制最多展示几行
        cardType: 'no-border', // 卡片样式：'no-border 表示无边，一般用于有背景色的时候。'border' 描边，一般用于背景色为白色。'shadow': 投影，也就是阴影部分'
        background: '#7C0B21', // 背景颜色，是指整个列表的背景色。而单个item则都为白色
        headImg: [], // 头部
        selectedType: '', // 用于提示选择了哪种类型的商品来源
        selectedId: [], // 选中的id数组
        headLink: '', // 头部图片点击链接
        footImg: [], // 尾部
        footLink: '', // 尾部图片点击链接
        stickerImgList: [], // 贴纸图片,数组对象形式，还需要保存对应的商品ID
        isShowTickerImg: false, // 是否显示贴纸图片
        isRadius: false, // 模块倒角，为true则是圆角
        padding: 0, // 页面边距
        topPadding: 0, // 上边距
        bottomPadding: 0, // 下边距
        isShowTitle: false, // 是否展示标题
        isOneLine: false, // 是否是单行，为false则表示双行
        isShowPromotionDesc: false, // 是否显示营销文案
        promotionDescColor: '#333', // 营销文案颜色
        isShowPromotionCover: false, // 是否显示营销主图
        isShowVipPrice: false, // 是否显示商品VIP价
        isShowActivePrice: false, // 是否显示商品活动价
        isShowPoint: false, // 是否显示积分
        isShowPrice: false, // 是否展示划线原价
        isShowBuyBtn: false, // 是否显示购买按钮
        btnType: 0, // 购买按钮
        isShowProductCorner: false, // 是否显示商品角标
        productCornerType: 1, // 商品角标样式

        isShowGroup: false, // 是否显示商品分组
        groupType: 'time',
        isShowBuyTime: false,
        isShowEnd: false,
        isShowSale: false, // 显示销量
        isShowAddCaetNum: false, // 显示商品加购量
        sortColumn: 1, // 选择排序形式
        btnVal: [], // 按钮文字
        pointType: 1, // 锚点样式。锚点样式多处用到，所以放在基础组件中
        pointBackground: '#C8305F', // 锚点默认背景色
        pointColor: '#fff', // 锚点默认字体色
        pointActiveBackground: '#AF1B49', // 锚点选中背景色
        pointActiveColor: '#fff', // 锚点选中字体色
        timePointType: 'time', // 时间锚点选择, 'time' , 'date-time'
        timePoint: [] // 时间锚点,都是时间戳形式
    },
    fingoGroup: {
        prop: {
            productId: 'spuId',
            productName: 'groupSpuTitleCn',
            priceVip: 'groupSpuPriceVip',
            price: 'groupSpuPrice',
            productCover: 'groupSpuCover',
            activePrice: 'groupSpuActivityPrice'
        }, // 用于指定对应字段，左边为写死的，右边则是根据接口来给定
        productStatus: [], // 自动更新依据 'unStart' - 未开始 'progress' - 进行中 'end' - 已结束
        colNum: '2', // 列表样式：一行几个（暂时不接入大图平铺），一个则为详细列表，no则为横向滑动
        isShowLimit: false, // 是否开启上限控制
        limitLine: 1, // 上限控制最多展示几行
        cardType: 'no-border', // 卡片样式：'no-border 表示无边，一般用于有背景色的时候。'border' 描边，一般用于背景色为白色。'shadow': 投影，也就是阴影部分'
        background: '#7C0B21', // 背景颜色，是指整个列表的背景色。而单个item则都为白色
        headImg: [], // 头部
        selectedType: '', // 用于提示选择了哪种类型的商品来源
        selectedId: [], // 选中的id数组
        headLink: '', // 头部图片点击链接
        stickerImgList: [], // 贴纸图片, 数组对象形式，还需要保存对应的商品ID
        isShowTickerImg: false, // 是否显示贴纸图片
        footImg: [], // 尾部
        footLink: '', // 尾部图片点击链接
        isRadius: false, // 模块倒角，为true则是圆角
        padding: 0, // 页面边距
        topPadding: 0, // 上边距
        bottomPadding: 0, // 下边距
        isShowTitle: false, // 是否展示标题
        isOneLine: false, // 是否是单行，为false则表示双行
        isShowVipPrice: false, // 是否显示商品VIP价
        isShowActivePrice: false, // 是否显示商品活动价
        isShowPrice: false, // 是否展示划线原价
        isShowBuyBtn: false, // 是否显示购买按钮
        btnType: 0, // 购买按钮
        isShowGroupNum: false, // 是否显示成团人数
        isChange: false,
        btnVal: [] // 按钮文字
    },
    lottery: {
        type: 1, // 1九宫格
        bgImg1: '', // 背景A
        bgImg2: '', // 背景B
        prizeBgImg: '', // 奖品背景
        prizeActiveBgImg: '', // 奖品选中背景
        btnBg: {}, // 中间按钮背景
        luckDrawId: '', // 抽奖ID
        luckDrawPassword: '', // 抽奖密令
        luckDrawName: '', // 名字
        isChange: false,
        showRecord: false, // 是否显示中奖记录
        showPaoMaDeng: false, // 是否显示跑马灯
        prizeList: [],
        padT: 50, // 上边距
        padB: 35, // 下边距
        padLR: 35, // 左右边距
        borderRadius: 20, // 宫格圆角
        recordBg: {} // 中奖记录查看按钮
    },
    fingoCoupon: {
        type: 0, // 样式
        bgColor: '#FFE18D', // 背景颜色1
        bgColor1: '#FDF2D8', // 背景颜色2
        btnBgColor: '#FF3A5D', // 领取按钮背景
        btnColor: '#fff', // 领取按钮字体颜色
        couponList: [],
        isShowText1: false,
        isShowText2: false,
        isShowText3: false,
        isShowBtn: false,
        text1Color: '#FF3315', // 标题
        text2Color: '#FF3315', // 门槛
        text3Color: '#F63457', // 说明
        isShouldShare: false // 是否启用分享领券
    }
}
