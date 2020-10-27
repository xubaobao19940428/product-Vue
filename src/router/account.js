import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/account',
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    meta: { title: '账号管理', icon: '&#xe6ff;' },
    children: [
        {
            path: 'accountManage',
            component: () => import('@/views/account/index.vue'),
            name: 'accountManage',
            meta: {
                title: '账号管理',
                key: 'MENU_ACCOUNT_MANAGE',
                btnPermission: [{
                    key: 'BTN_ACCOUNT_MANAGE_ADD_USER',
                    title: '新增用户'
                }, {
                    key: 'BTN_ACCOUNT_MANAGE_DELETE_USER',
                    title: '删除用户'
                }, {
                    key: 'BTN_ACCOUNT_MANAGE_EDIT_USER',
                    title: '编辑用户'
                }, {
                    key: 'BTN_ACCOUNT_MANAGE_ADD_ROLE',
                    title: '新增角色'
                }, {
                    key: 'BTN_ACCOUNT_MANAGE_EDIT_ROLE',
                    title: '编辑角色'
                }, {
                    key: 'BTN_ACCOUNT_MANAGE_DELETE_ROLE',
                    title: '删除角色'
                }, {
                    key: 'BTN_SYSTEM_MANAGE_ADD_GROUP',
                    title: '新增组织'
                }, {
                    key: 'BTN_SYSTEM_MANAGE_EDIT_GROUP',
                    title: '编辑组织'
                }, {
                    key: 'BTN_SYSTEM_MANAGE_DELETE_GROUP',
                    title: '删除组织'
                }]
            }
        }
    ]
}
