export default {
    data () {
        return {
            activeTypeEnum: {
                0: '其他活动',
                1: '爆款好物',
                2: '特卖会场',
                3: '限时特价',
                8: '0元购'
            },
            activeTypeArray: [{
                key: 0,
                name: '其他活动'
            }, {
                key: 1,
                name: '爆款好物'
            }, {
                key: 2,
                name: '特卖会场'
            }, {
                key: 3,
                name: '限时特价'
            }, {
                key: 8,
                name: '0元购'
            }],
            activeCrowdTypeArray: [{
                key: 0,
                name: '全部'
            }, {
                key: 1,
                name: '仅新用户'
            }, {
                key: 3,
                name: '仅中奖用户'
            }],
            promotionType: {
                0: '满额减',
                1: '每满额减',
                2: 'M元N件',
                3: 'M件N折',
                // 4: '第M件N元',
                // 5: '第M件N折',
                6: '包邮',
                7: '满件减',
                8: '每满件减',
                9: '满额发券'
            },
            promotionProductType: {
                0: '按商品',
                1: '按活动',
                2: '商品分组标签',
                3: '前台类目',
                4: '后台类目',
                5: '按品牌'
            },
            urlType: {
                1: 'H5',
                2: '应用内'
            },
            appPageEnum: {
                'MEMBER_PAGE': '会员页',
                'BUSINESS_SCHOOL': '商学院',
                'SHOP_CART': '购物车页',
                'USER_CENTER': '个人中心页',
                'MY_INCOME': '我的收益页',
                'MY_TEAM': '我的团队页',
                'MY_COUPON': '优惠券列表页',
                'MY_ORDER': '全部订单页',
                'CUSTOMER_SERVICE': '客服页',
                'ALL_CATEGORY': '全部分类',
                'PRODUCT_DETAILS': '商品详情页',
                'VIRTUAL_RECHARGE': '虚拟充值'
            }
            // pageType:{
            //     1:'功能区',                               //正常+标题色值，不同语言标题（标题，无副标题）
            //     2:'腰封、营销Card,平台广告位，广告Card',     //正常
            //     3:'宫格',                                 //正常+不同语言标题（标题，副标题），展示商品ID
            //     4:'商品列表管理',                          //不同
            //     5:'列表活动',                             //不同
            //     6:'类目运营',                             //不同
            // }
        }
    },
    methods: {}
}
