import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/purchaseManage',
    meta: { title: '采购中心', icon: '&#xe921;' },
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    children: [
        {
            path: 'purchaseMessage',
            component: () => import('@/views/purchaseManage/purchaseMessage'),
            name: 'purchaseMessage',
            meta: {
                title: '供应商通知',
                key: 'MENU_PURCHASE_Message',
            }
        },
        {
            path: 'purchaseOrder',
            component: () => import('@/views/purchaseManage/purchaseOrder'),
            name: 'purchaseOrder',
            meta: {
                title: '采购订单',
                key: 'MENU_PURCHASE_ORDER',
                btnPermission: [
                    {
                        key: 'BTN_PURCHASE_ORDER_EXPORT_ADD',
                        title: '新增采购单'
                    },
                    {
                        key: 'BTN_PURCHASE_LIST_EXPORT',
                        title: '导出订单'
                    },
                    {
                        key: 'BTN_PURCHASE_SHIP_EXPORT',
                        title: '导出发货单'
                    },
                    {
                        key: 'BTN__IMPORT_SHIPMENT_ORDER',
                        title: '导入发货订单'
                    },
                    {
                        key: 'BTN_SKU_PURCHASE_ORDER_EDIT',
                        title: 'SKU编辑'
                    },
                    {
                        key: 'BTN_SKU_PURCHASE_ORDER_MAKE_UP',
                        title: 'SKU补单'
                    },
                    {
                        key: 'BTN_SKU_PURCHASE_ORDER_CANCEL',
                        title: '取消采购数量'
                    },
                    {
                        key: 'BTN_SKU_SHORTAGE',
                        title: 'SKU缺货'
                    },
                    {
                        key: 'BTN_SKU_DELIVER_GOODS',
                        title: 'SKU发货'
                    },
                    {
                        key: 'BTN_ALL_PURCHASE_ORDER_EDIT',
                        title: '整单编辑'
                    },
                    {
                        key: 'BTN_ALL_PURCHASE_LIST_EXPORT',
                        title: '整单导出'
                    },
                    {
                        key: 'BTN_ALL_VIEW_DETAILS',
                        title: '整单查看详情'
                    },
                    {
                        key: 'BTN_ALL_CONFIRM_PURCHASE',
                        title: '整单确认采购'
                    },
                    {
                        key: 'BTN_ALL_CANCEL',
                        title: '整单取消'
                    },
                    {
                        key: 'BTN_ALL_DELIVER_GOODS',
                        title: '整单发货'
                    }, {
                        key: 'BTN_SKU_ORIGINAL_ORDER',
                        title: '原订单信息'
                    }, {
                        key: 'BTN_IMPORT_COMFIRM_PURCHASE',
                        title: '导入确认采购'
                    }]
            }
        },
        {
            path: 'Supplier1688Order',
            component: () => import('@/views/purchaseManage/supplier1688Order'),
            name: 'Supplier1688Order',
            meta: {
                title: '1688自动采购',
                key: 'MENU_SUPPLIER_1688_ORDER',
                btnPermission: [
                    {
                        key: 'BTN_TRACEABILITY_1688_ORDER_EDIT',
                        title: '供应商溯源'
                    },
                    {
                        key: 'BTN_BATCH_AUTO_PURCHASE_1688',
                        title: '批量自动采购'
                    },
                    {
                        key: 'BTN_BEFORE_PAY_CKECK_1688',
                        title: '付款前校验'
                    },
                    {
                        key: 'BTN_BATCH_PAY_CAN_PURCHASE_1688',
                        title: '批量可付款'
                    },
                    {
                        key: 'BTN_SKU_PURCHASE_1688_ORDER_EDIT',
                        title: '编辑'
                    },
                    {
                        key: 'BTN_PURCHASE_1688_LIST_EXPORT',
                        title: '导出'
                    },
                    {
                        key: 'BTN_ALL__1688_VIEW_DETAILS',
                        title: '查看详情'
                    },
                    {
                        key: 'BTN_ALL_1688_CONFIRM_PURCHASE',
                        title: '确认采购'
                    },
                    {
                        key: 'BTN_ALL__1688_SKU_VIEW_DETAILS',
                        title: 'SKU详情'
                    },
                    {
                        key: 'BTN_ALL_1688_CANCEL',
                        title: '整单取消'
                    }]
            }
        },
        {
            path: 'SupplierOrder',
            component: () => import('@/views/purchaseManage/SupplierOrder'),
            name: 'SupplierOrder',
            meta: {
                title: '供应商订单',
                icon: '',
                key: 'MENU_SUPPLIER_ORDER',
                btnPermission: [
                    {
                        key: 'BTN_SUPPLIER_SHIP',
                        title: '发货'
                    }, {
                        key: 'BTN_SUPPLIER_STOCKOUT',
                        title: '缺货'
                    }, {
                        key: 'BTN_SUPPLIER_MORESTOCKOUT',
                        title: '批量发货'
                    }, {
                        key: 'BTN_ORDER_BATCH_EXPORT',
                        title: '订单批量导出'
                    }, {
                        key: 'BTN_SUPPLIER_ID',
                        title: '供应商ID'
                    }
                ]
            }
        },
        {
            path: 'supplierManage',
            component: () => import('@/views/purchaseManage/supplierManage'),
            name: 'supplierManage',
            meta: {
                title: '供应商管理',
                icon: '',
                key: 'MENU_SUPPLIER_MANAGE',
                btnPermission: [{
                    key: 'BTN_SUPPLIER_MANAGE_ADD',
                    title: '新增供应商'
                }, {
                    key: 'BTN_SUPPLIER_MANAGE_EDIT',
                    title: '编辑'
                },
                //     {
                //     key: 'BTN_SUPPLIER_MANAGE_DELETE',
                //     title: '删除'
                // },
                {
                    key: 'BTN_SUPPLIER_MANAGE_FORBIDDEN',
                    title: '禁用'
                }, {
                    key: 'BTN_SUPPLIER_MANAGE_OPEN',
                    title: '启用'
                }]
            }
        },
        {
            path: 'supplierEdit',
            component: () => import('@/views/purchaseManage/supplierEdit'),
            name: 'supplierEdit',
            hidden: true,
            meta: {
                title: '供应商编辑',
                icon: '',
                key: 'MENU_SUPPLIER_EDIT',
                btnPermission: [{
                    key: 'BTN_SUPPLIER_MANAGE_NAME_EDIT',
                    title: '供应商名称编辑'
                }]
            }
        },
        {
            path: 'abnormalOrder',
            component: () => import('@/views/purchaseManage/abnormal/index'),
            name: 'abnormalOrder',
            meta: {
                title: '异常列表',
                icon: '',
                key: 'MENU_ABNORMAL_ORDER',
                btnPermission: [{
                    key: 'BTN_ABNORMAL_ORDER_PACKAGE',
                    title: '处理异常包裹'
                }, {
                    key: 'BTN_AFTER_SALE_ORDER_PRODUCT',
                    title: '处理异常商品'
                }, {
                    key: 'BTN_ABNORMAL_ORDER_REPAIR',
                    title: '补单'
                }, {
                    key: 'BTN_PURCHASE_EXPORT_ABNORMAL_PACKAGE',
                    title: '导出异常包裹'
                }, {
                    key: 'BTN_PURCHASE_EXPORT_ABNORMAL_SKU',
                    title: '导出异常SKU'
                }]
            }
        },
        {
            path: 'taskList',
            component: () => import('@/views/purchaseManage/taskList/index'),
            name: 'taskList',
            meta: {
                title: '任务列表',
                key: 'MENU_TASK_LIST'
            }
        },
        {
            path: 'taskDetail',
            component: () => import('@/views/purchaseManage/taskList/components/taskDetail'),
            name: 'taskDetail',
            hidden: true,
            meta: {
                title: '任务详情',
                key: 'MENU_TASK_DETAIL'
            }
        }
    ]
}
