import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/fileCenter',
    meta: { title: '文件中心', icon: '&#xe638;' },
    name: 'fileCenter',
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    children: [
        {
            path: 'exportList',
            component: () => import('@/views/fileCenter/index'),
            meta: {
                title: '导出任务列表',
                icon: '',
                key: 'MENU_FILE_EXPORT_LIST',
            }
        }
    ]
}
