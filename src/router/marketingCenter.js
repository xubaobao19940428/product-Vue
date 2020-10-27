import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/marketingCenter',
    meta: { title: '运营中心', icon: '&#xe609;' },
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    children: [
        {
            path: 'newAppSet',
            component: () => import('@/views/marketingCenter/newAppSet/index.vue'),
            name: 'newAppSet',
            meta: {
                title: 'APP配置',
                key: 'MENU_APP_SET',
                btnPermission: [{
                    key: 'BTN_SCREEN_ADLIST_ADD',
                    title: '闪屏广告新增'
                }, {
                    key: 'BTN_SCREEN_ADLIST_EDIT',
                    title: '闪屏广告编辑'
                }, {
                    key: 'BTN_SCREEN_ADLIST_DELETE',
                    title: '闪屏广告删除'
                }, {
                    key: 'BTN_BOMB_SCREEN_ADD',
                    title: '弹屏广告新增'
                }, {
                    key: 'BTN_BOMB_SCREEN_EDIT',
                    title: '弹屏广告编辑'
                }, {
                    key: 'BTN_BOMB_SCREEN_DELETE',
                    title: '弹屏广告删除'
                }, {
                    key: 'BTN_BOMB_SCREEN_HIDDEN',
                    title: '弹屏广告显示隐藏'
                }, {
                    key: 'BTN_QY_OPTIMIZATION_ADD',
                    title: '品质优选新增'
                }, {
                    key: 'BTN_QY_OPTIMIZATION_EDIT',
                    title: '品质优选编辑'
                }, {
                    key: 'BTN_QY_OPTIMIZATION_PRODUCT_MANAGE',
                    title: '品质优选商品管理'
                }, {
                    key: 'BTN_QY_OPTIMIZATION_SORT',
                    title: '品质优选排序'
                }, {
                    key: 'BTN_QY_OPTIMIZATION_HIDDEN',
                    title: '品质优选开关'
                }, {
                    key: 'BTN_SWITCH_LIST_ADD',
                    title: '营销浮窗开关新增'
                }, {
                    key: 'BTN_SWITCH_LIST_EDIT',
                    title: '营销浮窗开关编辑'
                }, {
                    key: 'BTN_SWITCH_LIST_SHOW',
                    title: '营销浮窗开关查看'
                }, {
                    key: 'BTN_BANNER_LIST_ADD',
                    title: 'banner新增'
                }, {
                    key: 'BTN_BANNER_LIST_BATCH_DELETE',
                    title: 'banner删除'
                }, {
                    key: 'BTN_BANNER_LIST_SORT',
                    title: 'banner排序'
                }, {
                    key: 'BTN_BANNER_LIST_EDIT',
                    title: 'banner编辑'
                }, {
                    key: 'BTN_SERVICE_COPY_ADD',
                    title: '服务文案新增'
                }, {
                    key: 'BTN_SERVICE_COPY_EDIT',
                    title: '服务文案编辑'
                }, {
                    key: 'BTN_SERVICE_COPY_COPY',
                    title: '服务文案复制'
                }, {
                    key: 'BTN_SERVICE_COPY_DELETE',
                    title: '服务文案删除'
                }, {
                    key: 'BTN_FUNCTION_AREA_ADD',
                    title: '功能区新增'
                }, {
                    key: 'BTN_FUNCTION_AREA_DELETE',
                    title: '功能区删除'
                }, {
                    key: 'BTN_FUNCTION_AREA_EDIT',
                    title: '功能区编辑'
                }, {
                    key: 'BTN_FUNCTION_AREA_COPY',
                    title: '功能区复制'
                }, {
                    key: 'BTN_FUNCTION_AREA_SORT',
                    title: '功能区排序'
                }, {
                    key: 'BTN_BG_SET_LIST_EDIT',
                    title: '背景设置'
                }, {
                    key: 'BTN_GIRDLE_LIST_ADD',
                    title: '腰封新增'
                }, {
                    key: 'BTN_GIRDLE_LIST_DELETE',
                    title: '腰封删除'
                }, {
                    key: 'BTN_GIRDLE_LIST_EDIT',
                    title: '腰封编辑'
                }, {
                    key: 'BTN_GIRDLE_LIST_COPY',
                    title: '腰封复制'
                }, {
                    key: 'BTN_GIRDLE_LIST_SORT',
                    title: '腰封排序'
                }, {
                    key: 'BTN_PLATFORM_AD_ADD',
                    title: '平台广告位新增'
                }, {
                    key: 'BTN_PLATFORM_AD_DELETE',
                    title: '平台广告位删除'
                }, {
                    key: 'BTN_PLATFORM_AD_EDIT',
                    title: '平台广告位编辑'
                }, {
                    key: 'BTN_PLATFORM_AD_COPY',
                    title: '平台广告位复制'
                }, {
                    key: 'BTN_PLATFORM_AD_SORT',
                    title: '平台广告位排序'
                }, {
                    key: 'BTN_PRODUCT_LIST_AD_ADD',
                    title: '列表活动新增'
                }, {
                    key: 'BTN_PRODUCT_LIST_AD_BATCH_DELETE',
                    title: '列表活动删除'
                }, {
                    key: 'BTN_PRODUCT_LIST_AD_SORT',
                    title: '列表活动穿插排序'
                }, {
                    key: 'BTN_PRODUCT_LIST_AD_EDIT',
                    title: '列表活动编辑'
                }, {
                    key: 'BTN_PRODUCT_LIST_AD_COPY',
                    title: '列表活动复制'
                }, {
                    key: 'BTN_MARKET_CARD_ADD',
                    title: '营销Card新增'
                }, {
                    key: 'BTN_MARKET_CARD_EDIT',
                    title: '营销Card编辑'
                }, {
                    key: 'BTN_MARKET_CARD_COPY',
                    title: '营销Card复制'
                }, {
                    key: 'BTN_MARKET_CARD_DELETE',
                    title: '营销Card删除'
                }, {
                    key: 'BTN_MARKET_CARD_PRODUCT',
                    title: '营销Card商品管理'
                }, {
                    key: 'BTN_MARKET_CARD_SORT',
                    title: '营销Card排序'
                }, {
                    key: 'BTN_AD_CARD_ADD',
                    title: '广告Card新增'
                }, {
                    key: 'BTN_AD_CARD_EDIT',
                    title: '广告Card编辑'
                }, {
                    key: 'BTN_AD_CARD_COPY',
                    title: '广告Card复制'
                }, {
                    key: 'BTN_AD_CARD_DELETE',
                    title: '广告Card删除'
                }, {
                    key: 'BTN_AD_CARD_SORT',
                    title: '广告Card排序'
                }, {
                    key: 'BTN_AD_CARD_PRODUCT',
                    title: '广告Card商品管理'
                }, {
                    key: 'BTN_GONG_GE_ADD',
                    title: '宫格新增'
                }, {
                    key: 'BTN_GONG_GE_EDIT',
                    title: '宫格编辑'
                }, {
                    key: 'BTN_GONG_GE_COPY',
                    title: '宫格复制'
                }, {
                    key: 'BTN_GONG_GE_DELETE',
                    title: '宫格删除'
                }, {
                    key: 'BTN_GONG_GE_SORT',
                    title: '宫格排序'
                }, {
                    key: 'BTN_CATEGORY_ADD',
                    title: '类目运营新增'
                }, {
                    key: 'BTN_CATEGORY_EDIT',
                    title: '类目运营编辑'
                }, {
                    key: 'BTN_CATEGORY_COPY',
                    title: '类目运营复制'
                }, {
                    key: 'BTN_CATEGORY_DELETE',
                    title: '类目运营删除'
                }, {
                    key: 'BTN_BOTTOM_ICON_ADD',
                    title: '底部图标新增'
                }, {
                    key: 'BTN_BOTTOM_ICON_EDIT',
                    title: '底部图标编辑'
                }, {
                    key: 'BTN_BOTTOM_ICON_COPY',
                    title: '底部图标复制'
                }, {
                    key: 'BTN_BOTTOM_ICON_DELETE',
                    title: '底部图标删除'
                }, {
                    key: 'BTN_BOTTOM_ICON_SYNC',
                    title: '底部图标同步'
                }, {
                    key: 'BTN_HOME_SORT',
                    title: '首页排序'
                }]
            }
        },
        // {
        //     path: 'homeSet',
        //     component: () => import('@/views/marketingCenter/homeSet/index.vue'),
        //     name: 'homeSet',
        //     meta: {
        //         title: '首页设置',
        //         key: 'MENU_HOME_SET',
        //         btnPermission: []
        //     }
        // },
        {
            path: 'categoryAdProduct',
            component: () => import('@/views/marketingCenter/categoryAdProduct/index.vue'),
            name: 'categoryAdProduct',
            hidden: true,
            meta: {
                title: '运营分类商品管理',
                key: 'MENU_CATEGORY_AD_PRODUCT',
                btnPermission: []
            }
        },
        {
            path: 'qyOptimizationProduct',
            component: () => import('@/views/marketingCenter/qyOptimizationProduct/index.vue'),
            name: 'qyOptimizationProduct',
            hidden: true,
            meta: {
                title: '品质优选商品管理',
                key: 'MENU_QY_OPTIMIZATION_PRODUCT',
                btnPermission: []
            }
        },
        {
            path: 'promotionList',
            component: () => import('@/views/marketingCenter/promotionTools/promotionList.vue'),
            name: 'promotionList',
            meta: {
                title: '促销工具',
                key: 'MENU_PROMOTION_TOOLS',
                btnPermission: [{
                    key: 'BTN_PROMOTION_TOOLS_ADD',
                    title: '新增'
                }, {
                    key: 'BTN_PROMOTION_TOOLS_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_PROMOTION_TOOLS_COPY',
                    title: '复制'
                }]
            }
        },
        {
            path: 'activityManage',
            component: () => import('@/views/marketingCenter/activityManage/index.vue'),
            name: 'activityManage',
            meta: {
                title: '活动管理',
                key: 'MENU_ACTIVITY_MANAGE',
                btnPermission: [{
                    key: 'BTN_ACTIVITY_MANAGE_ADD',
                    title: '活动新增'
                }, {
                    key: 'BTN_ACTIVITY_MANAGE_COPY',
                    title: '活动复制'
                }, {
                    key: 'BTN_ACTIVITY_MANAGE_EDIT',
                    title: '活动编辑'
                }, {
                    key: 'BTN_TO_ACTIVITY_PRODUCT',
                    title: '活商品'
                }, {
                    key: 'BTN_ACTIVITY_LABEL',
                    title: '活动分组'
                }, {
                    key: 'BTN_ACTIVITY_REPORT',
                    title: '活动报名'
                }]
            }
        },
        {
            path: 'activityProduct',
            component: () => import('@/views/marketingCenter/activityProduct/index.vue'),
            name: 'activityProduct',
            meta: {
                title: '活动商品',
                key: 'MENU_ACTIVITY_PRODUCT',
                btnPermission: [{
                    key: 'BTN_ACTIVITY_PRODUCT_ADD',
                    title: '活动商品新增'
                }, {
                    key: 'BTN_ACTIVITY_PRODUCT_DOWNLOAD',
                    title: '活动商品批量上传'
                }, {
                    key: 'BTN_ACTIVITY_PRODUCT_EDIT',
                    title: '活动商品编辑'
                }, {
                    key: 'BTN_ACTIVITY_PRODUCT_SKU_DETAIL',
                    title: '规格详情'
                }]
            }
        },
        {
            path: 'shake',
            component: () => import('@/views/marketingCenter/shake/index'),
            name: 'shake',
            meta: {
                title: '摇一摇',
                key: 'MENU_SHAKE',
                btnPermission: [{
                    key: 'BTN_ADD_SHOW_PRODUCT',
                    title: '新增展示商品'
                }]
            }
        },
        {
            path: 'signIn',
            component: () => import('@/views/marketingCenter/signIn/index'),
            name: 'signIn',
            meta: {
                title: '现金签到',
                key: 'MENU_SIGN_IN',
                btnPermission: []
            }
        },
        {
            path: 'shakePrize',
            component: () => import('@/views/marketingCenter/shake/components/editPrize'),
            name: 'shakePrize',
            hidden: true,
            meta: {
                title: '编辑抽奖',
                key: 'MENU_SHAKE_PRIZE'
            }
        },
        {
            path: 'redBag',
            component: () => import('@/views/marketingCenter/redBag/index'),
            name: 'redBag',
            meta: {
                title: '拆红包',
                key: 'MENU_RED_BAG',
                btnPermission: [
                    {
                        key: 'BTN_RED_BAG_DOWNLOAD',
                        title: '拆红包数据下载'
                    },
                    {
                        key: 'BTN_RED_BAG_CONFIG',
                        title: '资金配置'
                    },
                    {
                        key: 'BTN_RED_BAG_DETAIL',
                        title: '查看助力详情'
                    },
                    {
                        key: 'BTN_RED_BAG_BEFORE_SUCCESS',
                        title: '提前拆成功概率配置'
                    },
                    {
                        key: 'BTN_RED_BAG_SYSTEM_CONFIG',
                        title: '动态算法配置'
                    }
                ]
            }
        },
        {
            path: 'redBagConfig',
            component: () => import('@/views/marketingCenter/redBag/algoConfig'),
            name: 'redBagConfig',
            hidden: true,
            meta: {
                title: '拆红包算法配置',
                key: 'BTN_RED_BAG_SYSTEM_CONFIG',
            }
        },
        {
            path: 'activityReport',
            component: () => import('@/views/marketingCenter/activityReport'),
            name: 'activityReport',
            hidden: true,
            meta: {
                title: '活动提报',
                key: 'MENU_ACTIVITY_REPORT',
                btnPermission: [
                    {
                        key: 'BTN_SEIZE_PEND',
                        title: '待报名'
                    },
                    {
                        key: 'BTN_SEIZE_RESLOVE',
                        title: '已报名待录用'
                    },
                ]
            }
        },
        {
            path: 'seizePrize',
            component: () => import('@/views/marketingCenter/seizePrize/index'),
            name: 'seizePrize',
            meta: {
                title: '夺大奖',
                key: 'MENU_SEIZE_PRIZE',
                btnPermission: [
                    {
                        key: 'BTN_SEIZE_PRIZE_SORT',
                        title: '排序'
                    },
                    {
                        key: 'BTN_SEIZE_PRIZE_PRODUCT_EDIT',
                        title: '编辑大奖商品'
                    },
                    {
                        key: 'BTN_SEIZE_PRIZE_PRODUCT_ADD',
                        title: '添加大奖商品'
                    },
                    {
                        key: 'BTN_SEIZE_PRIZE_EDIT',
                        title: '大奖设置'
                    },
                    {
                        key: 'BTN_SEIZE_PRIZE_PRODUCT_SET',
                        title: '商品设置'
                    },
                    {
                        key: 'BTN_SEIZE_PRIZE_DELETE',
                        title: '删除大奖商品'
                    }
                ]
            }
        },
        {
            path: 'promotionEdit',
            component: () => import('@/views/marketingCenter/promotionTools/promotionEdit.vue'),
            name: 'promotionEdit',
            hidden: true,
            meta: {
                title: '新建促销',
                key: 'MENU_PROMOTION_TOOLS_EDIT',
                btnPermission: []
            }
        },
        {
            path: 'ProductLive',
            component: () => import('@/views/marketingCenter/productLive/index'),
            name: 'ProductLive',
            meta: {
                title: '直播商品',
                key: 'MENU_PRODUCT_LIVE',
                btnPermission: [{
                    key: 'BTN_PRODUCT_LIVE_ADD',
                    title: '新增'
                }, {
                    key: 'BTN_PRODUCT_LIVE_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_PRODUCT_LIVE_DEL',
                    title: '删除'
                }]
            }
        },
        {
            path: 'purchaseLimit',
            component: () => import('@/views/marketingCenter/purchaseLimit/index'),
            name: 'PurchaseLimit',
            meta: {
                title: '商品限购',
                icon: '',
                key: 'MENU_PURCHASE_LIMIT',
                btnPermission: [{
                    key: 'BTN_PURCHASE_LIMIT_ADD',
                    title: '新增'
                }, {
                    key: 'BTN_PURCHASE_LIMIT_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_PURCHASE_LIMIT_DEL',
                    title: '删除'
                }]
            }
        },
        {
            path: 'groupActivity',
            component: () => import('@/views/marketingCenter/groupActivity/GroupActivity'),
            name: 'GroupActivity',
            meta: {
                title: '拼团活动',
                icon: '',
                key: 'MENU_GROUP_ACTIVITY'
            }
        },
        {
            path: 'groupActivityEdit',
            component: () => import('@/views/marketingCenter/groupActivity/GroupActivityEdit'),
            name: 'groupActivityEdit',
            hidden: true,
            meta: {
                title: '拼团商品编辑',
                key: 'MENU_GROUP_ACTIVITY_EDIT'
            }
        },
        {
            path: 'coupon',
            component: () => import('@/views/marketingCenter/coupon/index.vue'),
            name: 'mcoupon',
            meta: {
                title: '优惠券',
                key: 'MENU_COUPON',
                btnPermission: [{
                    key: 'BTN_COUPON_ADD',
                    title: '新增优惠券'
                }, {
                    key: 'BTN_COUPON_SEND',
                    title: '发券'
                }, {
                    key: 'BTN_COUPON_DETAIL',
                    title: '优惠券详情'
                }, {
                    key: 'BTN_COUPON_COPY',
                    title: '优惠券复制'
                }, {
                    key: 'BTN_COUPON_PACKAGE_ADD',
                    title: '新增优惠券包'
                }, {
                    key: 'BTN_COUPON_PACKAGE_SEND',
                    title: '分发优惠券包'
                }, {
                    key: 'BTN_COUPON_PACKAGE_DETAIL',
                    title: '优惠券包详情'
                }, {
                    key: 'BTN_COUPON_RETURN_ADD',
                    title: '新增商品返券'
                }, {
                    key: 'BTN_COUPON_RETURN_ALL_DELETE',
                    title: '批量删除商品返券'
                }, {
                    key: 'BTN_COUPON_RETURN_EDIT',
                    title: '编辑商品返券'
                }, {
                    key: 'BTN_COUPON_RETURN_DELETE',
                    title: '删除商品返券'
                }, {
                    key: 'BTN_COUPON_LIMIT_ADD',
                    title: '新增用券限制'
                }, {
                    key: 'BTN_COUPON_LIMIT_ALL_DELETE',
                    title: '批量删除用券限制'
                }, {
                    key: 'BTN_COUPON_LIMIT_EDIT',
                    title: '编辑用券限制'
                }, {
                    key: 'BTN_COUPON_LIMIT_DELETE',
                    title: '删除用券限制'
                }, {
                    key: 'BTN_COUPON_SEARCH_WITHDRAW',
                    title: '撤回'
                }]
            }
        },
        {
            path: 'couponEdit',
            component: () => import('@/views/marketingCenter/coupon/components/couponEdit.vue'),
            name: 'mcouponEdit',
            hidden: true,
            meta: {
                title: '新增优惠券页面',
                key: 'MENU_COUPON_EDIT'
            }
        },
        {
            path: 'couponDetail',
            component: () => import('@/views/marketingCenter/coupon/couponDetail.vue'),
            name: 'mcouponDetail',
            hidden: true,
            meta: {
                title: '优惠券详情页面',
                key: 'MENU_COUPON_DETAIL'
            }
        },
        {
            path: 'couponPackageDetail',
            component: () => import('@/views/marketingCenter/coupon/couponPackageDetail.vue'),
            name: 'mcouponPackageDetail',
            hidden: true,
            meta: {
                title: '优惠券包详情',
                key: 'MENU_COUPON_PACKAGE_DETAIL'
            }
        },
        {
            path: 'promotionManage',
            component: () => import('@/views/marketingCenter/promotionManage/index.vue'),
            name: 'promotionManage',
            meta: {
                title: '买赠管理',
                key: 'MENU_GIVEAWAY_LIST'
            }
        },
        {
            path: 'promotionManageEdit',
            component: () => import('@/views/marketingCenter/promotionManage/manage.vue'),
            name: 'promotionManageEdit',
            hidden: true,
            meta: {
                title: '赠品管理',
                key: 'MENU_GIVEAWAY_MANAGE'
            },
        },
        {
            path: 'hotSearch',
            component: () => import('@/views/marketingCenter/hotSearch/index'),
            name: 'hotSearch',
            meta: {
                title: '热搜词',
                icon: '',
                key: 'MENU_HOT_SEARCH',
                btnPermission: [{
                    key: 'BTN_HOT_SEARCH_ADD_KEYWORDS',
                    title: '新增热搜词'
                }, {
                    key: 'BTN_HOT_SEARCH_EDIT_KEYWORDS',
                    title: '编辑热搜词'
                }, {
                    key: 'BTN_HOT_SEARCH_SORT_KEYWORDS',
                    title: '热搜词排序'
                }, {
                    key: 'BTN_HOT_SEARCH_HIDDEN_KEYWORDS',
                    title: '删除热搜词'
                }]
            }
        },
        {
            path: 'contentManage',
            component: () => import('@/views/marketingCenter/contentManage/contentList'),
            name: 'contentManage',
            meta: {
                title: '内容管理',
                icon: '',
                key: 'MENU_CONTENT_MANAGE',
                btnPermission: [{
                    key: 'BTN_CONTENT_MANAGE_SEARCH',
                    title: '搜索'
                }, {
                    key: 'BTN_CONTENT_MANAGE_RESET',
                    title: '重置'
                }, {
                    key: 'BTN_CONTENT_MANAGE_ADD',
                    title: '添加专题'
                }]
            }
        },
        {
            path: 'contentEdit',
            component: () => import('@/views/marketingCenter/contentManage/contentEdit'),
            name: 'contentEdit',
            hidden: true,
            meta: {
                title: '内容编辑',
                icon: '',
                key: 'MENU_CONTENT_MANAGE'
            }
        },
        {
            path: 'tagManage',
            component: () => import('@/views/marketingCenter/tagManage/index'),
            name: 'tagManage',
            meta: {
                title: '标签管理',
                icon: '',
                key: 'MENU_TAG_MANAGE'
            }
        },
        {
            path: 'pageEdit',
            component: () => import('@/views/marketingCenter/pageModule/pageEdit.vue'),
            name: 'pageEdit',
            hidden: true,
            meta: {
                title: '工作台',
                key: 'MENU_PAGE_MODULE'
            }
        },
        {
            path: 'pageList',
            component: () => import('@/views/marketingCenter/pageModule/pageList.vue'),
            name: 'pageList',
            meta: {
                title: '页面搭建',
                key: 'MENU_PAGE_LIST'
            }
        },
        {
            path: 'previewIframe',
            component: () => import('@/views/marketingCenter/pageModule/components/previewIframe.vue'),
            name: 'previewIframe',
            hidden: true,
            meta: {
                title: '页面预览',
                key: 'MENU_PREVIEW_IFRAME'
            }
        },
        {
            path: 'raffleAssistant',
            component: () => import('@/views/marketingCenter/raffleAssistant/index'),
            name: 'raffleAssistant',
            meta: {
                title: '抽奖助手',
                key: 'MENU_RAFFLE_ASSISTANT',
                btnPermission: [{
                    key: 'BTN_RAFFLE_ASSISTANT_POOL',
                    title: '奖池'
                }, {
                    key: 'BTN_RAFFLE_ASSISTANT_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_RAFFLE_ASSISTANT_ADD',
                    title: '新增'
                }]
            }
        },
        {
            path: 'raffleOperator',
            component: () => import('@/views/marketingCenter/raffleAssistant/raffleOperator'),
            name: 'raffleOperator',
            hidden: true,
            meta: {
                title: '抽奖编辑',
                key: 'MENU_RAFF_OPERATOR'
            }
        }
    ]
}
