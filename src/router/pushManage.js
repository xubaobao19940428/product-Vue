import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/pushManage',
    meta: { title: 'CRM运营管理', icon: '&#xe67f;' },
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    children: [
        {
            path: 'messagePush',
            component: () => import('@/views/pushManage/MessagePushNew'),
            name: 'messagePush',
            hidden: true,
            meta: {
                title: '消息推送',
                key: 'MENU_MESSAGE_PUSH',
                btnPermission: [{
                    key: 'BTN_MESSAGE_PUSH_ADD',
                    title: '新增'
                }, {
                    key: 'BTN_MESSAGE_PUSH_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_MESSAGE_PUSH_DELETE',
                    title: '删除'
                }, {
                    key: 'BTN_MESSAGE_PUSH_SEND',
                    title: '发送'
                }, {
                    key: 'BTN_MESSAGE_PUSH_RECEIVER_SET',
                    title: '接收用户'
                }]
            }
        },
        {
            path: 'userGrouping',
            component: () => import('@/views/pushManage/userGrouping'),
            name: 'userGrouping',
            meta: {
                title: '用户分组',
                key: 'MENU_USER_GROUPING'
            }
        },
        {
            path: 'userAttribute',
            component: () => import('@/views/pushManage/userAttribute'),
            name: 'userAttribute',
            meta: {
                title: '用户属性查询',
                key: 'MENU_USER_ATTRIBUTE'
            }
        },
        {
            path: 'strategy',
            component: () => import('@/views/pushManage/strategy'),
            name: 'strategy',
            meta: {
                title: '策略管理',
                key: 'MENU_STRATEGY_MANAGE'
            }
        },
        {
            path: 'strategyTaskList',
            component: () => import('@/views/pushManage/strategy/taskList'),
            name: 'strategyTaskList',
            hidden: true,
            meta: {
                title: '任务列表',
                key: 'MENU_STRATEGY_TASK_LIST'
            }
        },
        {
            path: 'strategyTaskDetail',
            component: () => import('@/views/pushManage/strategy/taskDetail'),
            name: 'strategyTaskDetail',
            hidden: true,
            meta: {
                title: '任务管理',
                key: 'MENU_STRATEGY_TASK_DETAIL'
            }
        },
        {
            path: 'userGroupByGroup',
            component: () => import('@/views/pushManage/userGrouping/components/userGroupByGroup'),
            name: 'userGroupByGroup',
            hidden: true,
            meta: {
                title: '用户分群',
                key: 'MENU_USER_GROUP_BY_GROUP'
            }
        },
        {
            path: 'userGroupBySpe',
            component: () => import('@/views/pushManage/userGrouping/components/userGroupBySpe'),
            name: 'userGroupBySpe',
            hidden: true,
            meta: {
                title: '特定用户组',
                key: 'MENU_USER_GROUP_BY_SPE'
            }
        },
        {
            path: 'versionManage',
            component: () => import('@/views/pushManage/versionManage'),
            name: 'versionManage',
            meta: {
                title: '版本管理',
                key: 'MENU_VERSION_MANAGE'
            }
        }
    ]
}

