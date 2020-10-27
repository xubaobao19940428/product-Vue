import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'

export default {
    path: '/warehouseManage',
    meta: { title: '仓储中心', icon: '&#xe66d;' },
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    children: [
        {
            path: 'scanCodeReceipt',
            component: () => import('@/views/warehouseManage/ScanCodeReceipt.vue'),
            name: 'scanCodeReceipt',
            meta: {
                title: '扫码收货',
                key: 'MENU_SWEEP_CODE_COLLECTION'
            }
        },
        // {
        //     path: 'sockInOrder',
        //     component: () => import('@/views/warehouseManage/SockInOrder'),
        //     name: 'sockInOrder',
        //     meta: {
        //         title: '入库管理11',
        //         key: 'MENU_WAREHOUSING_MANAGEMENT',
        //         btnPermission: [{
        //             key: 'MENU_WAREHOUSE_CONFIRM_STORAGE',
        //             title: '确认入库'
        //         }]
        //     }
        // },
        {
            path: 'sockInOrderNew',
            component: () => import('@/views/warehouseManage/sockInOrderNew'),
            name: 'sockInOrderNew',
            meta: {
                title: '入库管理',
                key: 'MENU_WAREHOUSING_MANAGEMENT_NEW',
                btnPermission: [{
                    key: 'MENU_WAREHOUSE_CONFIRM_STORAGE_NEW',
                    title: '确认入库'
                }]
            }
        },
        {
            path: 'stockCheck',
            component: () => import('@/views/warehouseManage/stockCheck'),
            name: 'stockCheck',
            meta: {
                title: '库存管理',
                icon: '',
                key: 'MENU_STOCK_CHECK',
                btnPermission: [{
                    key: 'BTN_NEW_SKU_INVENTORY',
                    title: '新建sku库存'
                },
                {
                    key: 'BTN_INVENTORY_MODIFICATION',
                    title: '库存修改'
                },
                {
                    key: 'BTN_INVENTORY_MANAGEMENT',
                    title: '流水记录'
                }]
            }
        },
        {
            path: 'MerchantInventory',
            component: () => import('@/views/warehouseManage/MerchantInventory'),
            name: 'merchantInventory',
            meta: {
                title: '商家库存',
                icon: '',
                key: 'MENU_MERCHANT_INVENTORY',
                btnPermission: []
            } 
        },
        {
            path: 'sockOutOrder',
            component: () => import('@/views/warehouseManage/SockOutOrder'),
            name: 'sockOutOrder',
            meta: {
                title: '出库管理',
                key: 'MENU_AFTER_OUTBOUND_ORDER',
                btnPermission: [
                //     {
                //     key: 'BTN_NEW_OUTBOUND_ORDER',
                //     title: '新建出库单'
                // },
                    {
                        key: 'BTN_SYNCHRONIZATION',
                        title: '同步'
                    },
                    {
                        key: 'BTN_CANCEL',
                        title: '取消'
                    }, {
                        key: 'BTN_ADJUSTMENT',
                        title: '异常调仓'
                    }, {
                        key: 'BTN_SPILT_ORDER',
                        title: '拆单'
                    }, {
                        key: 'BTN_BARTER',
                        title: '换货'
                    }, {
                        key: 'BTN_REISSUE',
                        title: '补发'
                    },
                    {
                        key: 'BTN_BARTER_EDIT',
                        title: '换货编辑'
                    }, {
                        key: 'BTN_REISSUE_EDIT',
                        title: '补发编辑'
                    }]
            }
        },
        {
            path: 'directMail',
            component: () => import('@/views/warehouseManage/DirectMail'),
            name: 'directMail',
            meta: {
                title: '直邮发货',
                icon: '',
                key: 'MENU_DIRECT_MAIL',
                btnPermission: []
            } 
        },
        {
            path: 'inventoryFlow',
            component: () => import('@/views/warehouseManage/ReserveFlow'),
            name: 'inventoryFlow',
            meta: {
                title: '库存流水',
                icon: '',
                key: 'MENU_STOCK_CHECK',
                btnPermission: []
            }
        },
        {
            path: 'warningOrder',
            component: () => import('@/views/warehouseManage/warningOrder/index'),
            name: 'warningOrder',
            meta: {
                title: '预警订单',
                key: 'MENU_WARNING_ORDER'
            }
        },
        {
            path: 'abnormalPage',
            component: () => import('@/views/warehouseManage/abnormal/index'),
            name: 'abnormalPage',
            meta: {
                title: '异常列表',
                key: 'MENU_WAREHOUSE_TRANS_ABNORMAL',
                btnPermission: [{
                    key: 'BTN_ABNORMAL_ORDER_OVER_PACKAGE',
                    title: '完结异常包裹'
                }, {
                    key: 'BTN_WAREHOUSE_TRANS_PACKAGE',
                    title: '处理异常包裹'
                }, {
                    key: 'BTN_WAREHOUSE_TRANS_PRODUCT',
                    title: '处理异常商品'
                }, {
                    key: 'BTN_ABNORMAL_ORDER_OVER_PRODUCT',
                    title: '完结异常商品'
                }, {
                    key: 'BTN_WAREHOUSE_EXPORT_ABNORMAL_PACKAGE',
                    title: '导出异常包裹'
                }, {
                    key: 'BTN_WAREHOUSE_EXPORT_ABNORMAL_SKU',
                    title: '导出异常SKU'
                }]
            }
        },
        {
            path: 'inStockManage',
            component: () => import('@/views/warehouseManage/inStockManage'),
            name: 'inStockManage',
            meta: {
                title: '异常库存管理',
                key: 'MENU_INSTOCK_MANAGE'
            }
        },
        {
            path: 'taskWarehouseList',
            component: () => import('@/views/warehouseManage/taskWarehouseList/index'),
            name: 'taskWarehouseList',
            meta: {
                title: '任务列表',
                key: 'MENU_TASK_WAREHOUSE_LIST'
            }
        },
    ]
}
