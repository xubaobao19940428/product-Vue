import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/customerService',
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    meta: { title: '客服中心', icon: '&#xe69f;' },
    children: [
        {
            path: 'customerManage',
            component: () => import('@/views/customerService/customerManage/index'),
            name: 'customerManage',
            meta: {
                title: '客服人员管理',
                key: 'MENU_CUSTOMER_MANAGE'
            }
        }
    ]
}