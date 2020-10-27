import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/customer',
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    meta: { title: '工单系统', icon: '&#xe61a;' },
    children: [
        {
            path: 'createdWorkOrder',
            component: () => import('@/views/customer/workOrder/createdWorkOrder'),
            name: 'createdWorkOrder',
            meta: {
                title: '我创建的工单',
                key: 'MENU_CREATED_WORD_ORDER',
                btnPermission: [{
                    key: 'BTN_CREATED_WORD_ORDER_ADD',
                    title: '新建工单'
                }, {
                    key: 'BTN_CREATED_WORD_ORDER_DETAIL',
                    title: '查看详情'
                }, {
                    key: 'BTN_CREATED_WORD_ORDER_CLOSE',
                    title: '关闭工单'
                }]
            }
        },
        {
            path: 'dealWorkOrder',
            component: () => import('@/views/customer/workOrder/dealWorkOrder'),
            name: 'dealWorkOrder',
            meta: {
                title: '我处理的工单',
                key: 'MENU_DEAL_WORD_ORDER',
                btnPermission: [{
                    key: 'BTN_CREATED_WORD_ORDER_DEAL',
                    title: '处理工单'
                }]
            }
        },
        {
            path: 'workOrderList',
            component: () => import('@/views/customer/workOrder/workOrderList'),
            name: 'workOrderList',
            meta: {
                title: '全局工单搜索',
                key: 'MENU_WORD_ORDER_LIST',
                btnPermission: []
            }
        },
        {
            path: 'faqSopSearch',
            hidden: true,
            component: () => import('@/views/customer/workOrder/faqSopSearch'),
            name: 'faqSopSearch',
            meta: {
                title: '常见问题SOP查询',
                key: 'MENU_SOP_SEARCH',
                btnPermission: []
            }
        },
        {
            path: 'faqSopSet',
            component: () => import('@/views/customer/workOrder/faqSopSet'),
            name: 'faqSopSet',
            hidden: true,
            meta: {
                title: '常见问题SOP设置',
                key: 'MENU_SOP_SET',
                btnPermission: []
            }
        },
        {
            path: 'groupSet',
            component: () => import('@/views/customer/workOrder/groupSet'),
            name: 'groupSet',
            meta: {
                title: '小组设置',
                key: 'MENU_GROUP_SET',
                btnPermission: [{
                    key: 'BTN_GROUP_SET_ADD',
                    title: '新增小组'
                }, {
                    key: 'BTN_GROUP_SET_EDIT',
                    title: '编辑小组'
                }]
            }
        },
        {
            path: 'labelSet',
            component: () => import('@/views/customer/workOrder/labelSet'),
            name: 'labelSet',
            meta: {
                title: '标签配置',
                key: 'MENU_LABEL_SET',
                btnPermission: [{
                    key: 'BTN_LABEL_SET_ADD',
                    title: '新增一级标签'
                }, {
                    key: 'BTN_LABEL_SET_ADD_SUB',
                    title: '新增二级标签'
                }, {
                    key: 'BTN_LABEL_SET_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_LABEL_SET_LOOK_MEMBER',
                    title: '查看成员'
                }, {
                    key: 'BTN_LABEL_SET_STATUS',
                    title: '生效失效'
                }]
            }
        },
        {
            path: 'noticeList',
            hidden: true,
            component: () => import('@/views/customer/IM/index'),
            name: 'noticeList',
            meta: {
                title: 'IM',
                key: 'MENU_IM_SYSTEM',
                btnPermission: [{
                    key: 'BTN_IM_NOTICE_LIST',
                    title: '消息列表'
                }]
            }
        }
    ]
}
