import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/langManage',
    meta: { title: '多国家管理', icon: '&#xe601;' },
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    children: [
        {
            path: 'translate',
            component: () => import('@/views/langManage/translate.vue'),
            name: 'translate',
            meta: {
                title: '多语种翻译',
                key: 'MENU_LANG_MANAGE_TRANSLATE',
                btnPermission: [{
                    key: 'BTN_LANG_MANAGE_TO_MODULE_PAGE',
                    title: '跳转到编辑语言模板页面'
                }, {
                    key: 'BTN_LANG_MANAGE_TO_DEL_PAGE',
                    title: '跳转到编辑已删除项页面'
                }, {
                    key: 'I18nModulePageService.PageVariableAdd',
                    title: '新增翻译项模板'
                }, {
                    key: 'I18nModulePageService.PageVariableUpdate',
                    title: '编辑翻译项模板'
                }, {
                    key: 'I18nTranslationService.DisableTranslation',
                    title: '删除翻译项模板'
                }, {
                    key: 'BTN_LANG_MANAGE_EDIT_TRANSLATE_ITEM',
                    title: '翻译'
                }, {
                    key: 'BTN_LANG_MANAGE_EXPORT_SELECT',
                    title: '导出所选'
                }, {
                    key: 'BTN_LANG_MANAGE_EXPORT_ALL',
                    title: '导出全部'
                }]
            }
        },
        {
            path: 'rateTemplate',
            component: () => import('@/views/langManage/rateTemplate/index'),
            name: 'rateTemplate',
            meta: {
                key: 'MENU_RATE_TEMPLATE',
                title: '汇率模板',
                icon: '',
                btnPermission: [{
                    key: 'BTN_RATE_TEMPLATE_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_RATE_TEMPLATE_REVIEW_PASS',
                    title: '审核通过'
                }, {
                    key: 'BTN_RATE_TEMPLATE_NO_PASS',
                    title: '审核不通过'
                }]
            }
        },
        {
            path: 'langModule',
            hidden: true,
            component: () => import('@/views/langManage/langModule.vue'),
            name: 'langModule',
            meta: {
                title: '语言模板',
                key: 'MENU_LANG_MANAGE_MODULE_PAGE',
                btnPermission: [{
                    key: 'I18nModulePageService.ModuleAdd',
                    title: '添加模块'
                }, {
                    key: 'I18nModulePageService.ModuleUpdate',
                    title: '编辑模块'
                }, {
                    key: 'I18nModulePageService.ModulePageAdd',
                    title: '添加页面'
                }, {
                    key: 'I18nModulePageService.ModulePageUpdate',
                    title: '编辑页面'
                }, {
                    key: 'I18nTranslationService.ImportVariableTranslationTemplate',
                    title: '导入模板'
                }]
            }
        },
        {
            path: 'deletedItemList',
            component: () => import('@/views/langManage/deletedItemList.vue'),
            name: 'deletedItemList',
            hidden: true,
            meta: {
                title: '已删除项',
                key: 'MENU_LANG_MANAGE_DELETED_ITEM',
                btnPermission: [{
                    key: 'I18nTranslationService.ReEnableTranslation',
                    title: '恢复'
                }]
            }
        }
    ]
}
