import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/system',
    meta: { title: '系统管理', icon: '&#xe608;' },
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    children: [
        {
            path: 'versionManage',
            component: () => import('@/views/system/versionManage'),
            name: 'versionManage',
            meta: {
                title: '版本管理',
                key: 'MENU_VERSION_MANAGE',
                btnPermission: [{
                    key: 'BTN_VERSION_MANAGE_ADD',
                    title: '新增'
                }, {
                    key: 'BTN_VERSION_MANAGE_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_VERSION_MANAGE_RELEASE',
                    title: '发布'
                }]
            }
        },
        {
            path: 'conversion',
            component: () => import('@/views/system/conversion'),
            name: 'conversion',
            hidden: true,
            icon: 'version',
            meta: {
                title: '数据转化',
                key: 'MENU_CONVERSION'
            }
        }
    ]
}
