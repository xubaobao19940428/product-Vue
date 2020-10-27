import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/order',
    meta: { title: '订单中心', icon: '&#xe60c;' },
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    children: [
        {
            path: 'orderList',
            component: () => import('@/views/order/orderList/index'),
            name: 'orderList',
            meta: {
                title: '订单管理',
                key: 'MENU_ORDER_LIST',
                btnPermission: [{
                    key: 'BTN_ORDER_LIST_EXPORT',
                    title: '导出订单'
                }, {
                    key: 'BTN_ORDER_LIST_EXPORT_NNLIMITED',
                    title: '导出时间无限制'
                }, {
                    key: 'BTN_ORDER_LIST_ODO_EXPORT',
                    title: '导出出库单'
                }, {
                    key: 'BTN_ORDER_LIST_CHANGE_ADDRESS',
                    title: '修改收货信息'
                }, {
                    key: 'BTN_ORDER_LIST_CHANGE_DELIVERY',
                    title: '自提'
                }, {
                    key: 'BTN_ORDER_LIST_MARKS',
                    title: '备注'
                }, {
                    key: 'BTN_ORDER_LIST_SEE_USER',
                    title: '查看用户信息'
                }, {
                    key: 'BTN_ORDER_LIST_DETAIL',
                    title: '订单详情'
                }, {
                    key: 'BTN_ORDER_LIST_PURCHASE_DETAIL',
                    title: '采购追踪'
                }, {
                    key: 'BTN_ORDER_LIST_AFTER_SALE',
                    title: '发起售后'
                }]
            }
        },
        {
            path: 'orderDetail',
            component: () => import('@/views/order/orderDetail/index'),
            name: 'orderDetail',
            hidden: true,
            meta: {
                title: '订单详情页面',
                key: 'MENU_ORDER_DETAIL',
                btnPermission: []
            }
        },{
            path: 'orderAfterSale',
            component: () => import('@/views/order/orderAfterSale/index'),
            name: 'orderAfterSale',
            hidden: true,
            meta: {
                title: '发起售后',
                key: 'MENU_ORDER_AFTER_SALE',
                btnPermission: []
            }
        },
        {
            path: 'storeGroupOrder',
            component: () => import('@/views/order/storeGroupOrder/index'),
            name: 'storeGroupOrder',
            meta: {
                title: '店群订单管理',
                key: 'MENU_STORE_GROUP_ORDER',
                btnPermission: []
            }
        },
        {
            path: 'customerOrder',
            component: () => import('@/views/order/customerOrder/index'),
            name: 'customerOrder',
            meta: {
                title: '客服订单',
                key: 'MENU_CUSTOMER_ORDER',
                btnPermission: [{
                    key: 'BTN_CUSTOMER_ORDER_REFUND',
                    title: '退款'
                }, {
                    key: 'BTN_CUSTOMER_ORDER_ABNORMAL',
                    title: '异常处理'
                }]
            }
        },
        {
            path: 'prizeOrder',
            component: () => import('@/views/order/prizeOrder/index'),
            name: 'prizeOrder',
            meta: {
                title: '大奖订单',
                key: 'MENU_PRIZE_ORDER'
            }
        },
        {
            path: 'groupOrder',
            component: () => import('@/views/order/groupOrder'),
            name: 'groupOrder',
            meta: {
                title: '拼团订单',
                key: 'MENU_GROUP_ORDER'
            }
        },
        {
            path: 'splitOrder',
            component: () => import('@/views/order/splitOrder/SplitOrder'),
            name: 'splitOrder',
            meta: {
                title: '发货管理',
                key: 'MENU_SPLIT_ORDER',
                btnPermission: [{
                    key: 'BTN_SPLIT_ORDER_LOGISTICS_IMPORT',
                    title: '物流单号导入'
                }, {
                    key: 'BTN_SPLIT_ORDER_LOGISTICS_EDIT',
                    title: '填写物流'
                }, {
                    key: 'BTN_SPLIT_ORDER_LOGISTICS_SEE',
                    title: '查看物流'
                },{
                    key: 'BTN_SPLITORDER_EXPORT',
                    title: '导出订单'
                }]
            }
        },
        {
            path: 'afterSaleOrderList',
            component: () => import('@/views/order/afterSaleOrder/index'),
            name: 'afterSaleOrderList',
            meta: {
                title: '售后订单',
                key: 'MENU_AFTER_SALE_ORDER_LIST',
                btnPermission: [{
                    key: 'BTN_AFTER_SALE_ORDER_EXPORT',
                    title: '导出'
                }, {
                    key: 'BTN_AFTER_SALE_ORDER_REFUND_FAIL',
                    title: '退款失败'
                }, {
                    key: 'BTN_AFTER_SALE_ORDER_REFUND_COMPLETED',
                    title: '完成退款'
                }, {
                    key: 'BTN_AFTER_SALE_ORDER_REFUND_REFUSED',
                    title: '拒绝售后'
                }, {
                    key: 'BTN_AFTER_SALE_ORDER_REFUND_REJECT',
                    title: '驳回售后'
                }]
            }
        },
        {
            path: 'afterSale',
            component: () => import('@/views/order/afterSale/index'),
            name: 'afterSale',
            meta: {
                title: '售后管理',
                key: 'MENU_AFTER_SALE'
            }   
        },
        {
            path: 'reviewOperation',
            component: () => import('@/views/order/afterSale/components/reviewOperation'),
            name: 'reviewOperation',
            hidden: true,
            meta: {
                title: '审核操作',
                key: 'MENU_PREVIEW_IFRAME'
            }
        },
        {
            path: 'rechargeManage',
            component: () => import('@/views/order/rechargeManage'),
            name: 'rechargeManage',
            meta: {
                title: '充值管理',
                key: 'MENU_RECHARGE_MANAGE'
            }
        }
    ]
}
