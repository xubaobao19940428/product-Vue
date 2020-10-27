import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/logisticsManage',
    meta: { title: '物流中心', icon: '&#xe61c;' },
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    children: [
        {
            path: 'loanTracking',
            component: () => import('@/views/logisticsManage/loanTrack'),
            name: 'loanTracking',
            meta: {
                title: '货代跟踪',
                icon: '',
                key: 'MENU_LOAN_TRACKING',
                btnPermission:[
                    {
                        key:'BTN_IMPORT_LOGISTICS',
                        title:'导入货代工作号'
                    },
                    {
                        key:'BTN_EXPORT_LOGISTICS',
                        title:'导出清单'
                    },
                    {
                        key:'BTN_SET_TABLELIST',
                        title:'列表设置'
                    },
                    {
                        key:'BTN_EDIT_COSTGO',
                        title:'编辑costgo订单'
                    },
                    {
                        key:'BTN_WATCH_COSTGO',
                        title:'查看costgo订单'
                    },
                    {
                        key:'BTN_LOANTRSCK_SEARCH_ORDER',
                        title:'查询订单'
                    }
                ]
            }
        },
        {
            path: 'logisticsB2C',
            component: () => import('@/views/logisticsManage/crossBorderB2C'),
            name: 'crossBorderB2C',
            meta: {
                title: 'B2C跨境订单',
                icon: '',
                key: 'MENU_B2CABNORMAL_ORDER',
                btnPermission: []
            }
        },
        {
            path: 'logisticsSheet',
            component: () => import('@/views/logisticsManage/logisticsSheet'),
            name: 'logisticsSheet',
            meta: {
                title: '采购物流',
                icon: '',
                key: 'MENU_ABNORMAL_SHEET',
                btnPermission: [{
                    key: 'BTN_CHANGE_NUM',
                    title: '修改快递单号'
                }]
            }
        },
        {
            path: 'freightTemplate',
            component: () => import('@/views/logisticsManage/freightTemplate'),
            name: 'freightTemplate',
            meta: {
                title: '运费模板',
                key: 'MENU_FREIGHT_TEMPLATE',
                btnPermission: [{
                    key: 'BTN_FREIGHT_TEMPLATE_ADD',
                    title: '新增'
                }, {
                    key: 'BTN_FREIGHT_TEMPLATE_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_FREIGHT_TEMPLATE_DELETE',
                    title: '删除'
                }, {
                    key: 'BTN_FREIGHT_TEMPLATE_BATCH_DELETE',
                    title: '批量删除'
                }]
            }
        },
        {
            path: 'freightEdit',
            component: () => import('@/views/logisticsManage/freightEdit'),
            name: 'freightEdit',
            hidden: true,
            meta: {
                title: '运费编辑',
                key: 'MENU_FREIGHT_EDIT'
            }
        },
        {
            path: 'addressLibrary',
            component: () => import('@/views/logisticsManage/addressLibrary'),
            name: 'addressLibrary',
            meta: {
                title: '邮编地址',
                key: 'MENU_ADDRESS_LIBRARY',
                btnPermission: [{
                    key: 'BTN_ADDRESS_ADD_PLATFORM',
                    title: '平台地址修改'
                }, {
                    key: 'BTN_ADDRESS_EDIT_PLATFORM',
                    title: '平台地址修改'
                }, {
                    key: 'BTN_ADDRESS_DELETE_PLATFORM',
                    title: '平台地址删除'
                }, {
                    key: 'BTN_ADDRESS_ADD_LOGISTICS',
                    title: '物流公司地址修改'
                }, {
                    key: 'BTN_ADDRESS_EDIT_LOGISTICS',
                    title: '物流公司地址修改'
                }, {
                    key: 'BTN_ADDRESS_DELETE_LOGISTICS',
                    title: '物流公司地址删除'
                }, {
                    key: 'BTN_ADDRESS_SYNC_LOGISTICS',
                    title: '同步地址'
                }]
            }
        },
        {
            path: 'logisticsCompany',
            component: () => import('@/views/logisticsManage/logisticsCompany'),
            name: 'logisticsCompany',
            meta: {
                title: '物流公司',
                key: 'MENU_LOGISTICSCOMPANY',
                btnPermission: [{
                    key: 'BTN_ADDRESS_ADD_DOCKINGSHIPMENT',
                    title: '对接发货新增'
                }, {
                    key: 'BTN_ADDRESS_EDIT_DOCKINGSHIPMENT',
                    title: '对接发货修改'
                }, {
                    key: 'BTN_ADDRESS_ADD_ORDINARYDELIVERY',
                    title: '普通发货修改'
                }, {
                    key: 'BTN_ADDRESS_EDIT_ORDINARYDELIVERY',
                    title: '普通发货修改'
                }]
            }
        },
        {
            path: 'logisticsSearch',
            component: () => import('@/views/logisticsManage/logisticsSearch'),
            name: 'logisticsSearch',
            hidden: true,
            meta: {
                title: '物流查询',
                key: 'MENU_LOGISTICS_SEARCH'
            }
        }
    ]
}
