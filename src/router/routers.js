import product from './product'
import purchaseManage from './purchaseManage'
import order from './order'
import logisticsManage from './logisticsManage'
import user from './user'
import marketingCenter from './marketingCenter'
import fileCenter from './fileCenter'
import pushManage from './pushManage'
import account from './account'
import langManage from './langManage'
import customer from './customer'
import warehouseManage from './warehouseManage'
import customerManage from './customerManage'
import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/

export const constantRouterMap = [
    {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true,
        name: 'login',
        meta: {
            key: 'MENU_LOGIN',
            title: '登录',
            noPermission: true
        }
    },
    {
        path: '/noPermission',
        component: () => import('@/views/noPermission'),
        hidden: true,
        meta: {
            key: 'MENU_NO_PERMISSION',
            title: '无权限',
            noPermission: true
        }
    },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true,
        meta: {
            key: 'MENU_404',
            title: '404',
            noPermission: true
        }
    },
    // {
    //     path: '/dataView',
    //     component: () => import('@/views/dashboard/dataView'),
    //     name: 'dataView',
    //     hidden: true,
    //     meta: {
    //         title: '数据大屏页面',
    //         key: 'MENU_DATA_VIEW'
    //     }
    // },
    {
        path: '/dataV',
        component: () => import('@/views/dashboard/DataV'),
        name: 'dataV',
        hidden: true,
        meta: {
            title: '新数据大屏页面',
            key: 'MENU_DATA_VIEW'
        }
    },

    {
        path: '/printPage',
        component: () => import('@/views/warehouseManage/printModule/index'),
        name: 'printPage',
        hidden: true,
        meta: {
            title: '打印',
            noPermission: true,
            key: 'MENU_TRANS_PRINT'
        }
    },
    {
        path: '/',
        redirect: '/dashboard/welcome'
    },
    {
        path: '/dashboard',
        components: {
            default: layout,
            cHeader: cHeader,
            cNav: cNav
        },
        name: 'dashboard',
        // notShowChildren: true,
        meta: { title: '数据中心', icon: '&#xe603;', key: 'MENU_DASHBOARD' },
        children: [
            {
                path: 'welcome',
                component: () => import('@/views/welcome/index'),
                name: 'welcome',
                hidden: true,
                meta: {
                    title: '欢迎',
                    noPermission: true
                }
            },
            {
                path: 'dataOverview',
                component: () => import('@/views/dashboard/indextest'),
                name: 'DataOverview',
                meta: {
                    title: '数据概览New',
                    key: 'MENU_DATAOVERVIEW'

                }
            },
            {
                path: 'index',
                component: () => import('@/views/dashboard/index'),
                meta: {
                    key: 'MENU_DASHBOARD',
                    title: '数据概览'
                }
            },
            // {
            //     path: 'coreTarget',
            //     component: () => import('@/views/dashboard/CoreTarget'),
            //     meta: {
            //         key: 'MENU_CORE_TARGET',
            //         title: '核心指标'
            //     }
            // },
            {
                path: 'hourGrowth',
                component: () => import('@/views/dashboard/hourGrowth'),
                meta: {
                    key: 'MENU_HOURGROWTH',
                    title: '小时增长'
                }
            },
            {
                path: 'thReport',
                component: () => import('@/views/dashboard/reportTh'),
                meta: {
                    key: 'TH_REPORT',
                    title: '泰国专题'
                }
            },
            {
                path: 'productAnalysis',
                component: () => import('@/views/dashboard/productAnalysis'),
                meta: {
                    key: 'MENU_PRODUCT_ANALYSIS',
                    title: '商品分析New'
                }
            },
            {
                path: 'pullNew',
                component: () => import('@/views/dashboard/pullNew/index'),
                meta: {
                    key: 'MENU_PULL_NEW',
                    title: '拉新产品'
                }
            },
            {
                path: 'groupData',
                component: () => import('@/views/dashboard/groupData'),
                meta: {
                    key: 'MENU_GROUPDATA',
                    title: '拼团数据'
                }
            },
            {
                path: 'customerService',
                component: () => import('@/views/dashboard/customerService'),
                meta: {
                    key: 'MENU_CUSTOMER_SERVICE',
                    title: '客服看板'
                }
            },
            // {
            //     path: 'logisticReport',
            //     component: () => import('@/views/dashboard/logisticReport'),
            //     meta: {
            //         key: 'LOGISTIC_REPORT',
            //         title: '物流分析'
            //     }
            // },
            {
                path: 'performanceMonitoring',
                component: () => import('@/views/dashboard/performanceMonitoring/index'),
                meta: {
                    key: 'MENU_PERFORMANCEMONITORING',
                    title: '履约监控'
                }
            },
            {
                path: 'performanceContract',
                component: () => import('@/views/dashboard/performanceContract/index'),
                meta: {
                    key: 'MENU_PERFORMANCE_Contract',
                    title: '履约全流程监控'
                }
            },
            {
                path: 'poCompletion',
                component: () => import('@/views/dashboard/poCompletion/index'),
                meta: {
                    key: 'MENU_PO_COMPLETION',
                    title: 'PO完成率监控'
                }
            },
            {
                path: 'commdityCategory',
                component: () => import('@/views/dashboard/commdityCategory/index'),
                meta: {
                    key: 'MENU_COMMDITYCATEGORY',
                    title: '商品品类'
                }
            },
            {
                path: 'agingConfiguration',
                component: () => import('@/views/dashboard/agingConfiguration/index'),
                meta: {
                    key: 'MENU_AGINGCONFIGURATION',
                    title: '时效配置'
                }
            },


            // {
            //     path: 'orderDataView',
            //     component: () => import('@/views/dashboard/OrderDataView'),
            //     meta: {
            //         key: 'MENU_ORDER_DATA_VIEW',
            //         title: '订单销售'
            //     }
            // },
            {
                path: 'memberTeam',
                component: () => import('@/views/dashboard/memberTeam/index'),
                meta: {
                    key: 'MENU_MEMBERTEAM',
                    title: '会员团队'
                }
            },

            // {
            //     path: 'productTrafficFlow',
            //     component: () => import('@/views/dashboard/ProductTrafficFlow'),
            //     meta: {
            //         key: 'MENU_PRODUCT_TRAFFIC_FLOW',
            //         title: '商品流量漏斗'
            //     }
            // },
            {
                path: 'DataIndexManage',
                component: () => import('@/views/dashboard/DataIndexManage'),
                meta: {
                    key: 'MENU_DATAINDEXMANAGE',
                    title: '指标管理'
                }
            },

            //  {
            //     path: 'userAcquisition',
            //     component: () => import('@/views/dashboard/userAcquisition'),
            //     meta: {
            //         key: 'MENU_USERACQUISITION',
            //         title: '用户获客'
            //     }
            // },
             {
                path: 'pointSearch',
                component: () => import('@/views/dashboard/pointSearch'),
                meta: {
                    key: 'MENU_ORDER_DATA_VIEW',
                    title: '埋点查询'
                }
            }
        ]
    },
    marketingCenter,
    user,
    product,
    order,
    purchaseManage,
    warehouseManage,
    logisticsManage,
    pushManage,
    langManage,
    customer,
    customerManage,
    account,
    fileCenter
]
