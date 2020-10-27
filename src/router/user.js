import layout from '@/views/layoutModule'
import cHeader from '@/views/headerModule'
import cNav from '@/views/navModule'
export default {
    path: '/user',
    meta: { title: '用户中心', icon: '&#xe607;' },
    components: {
        default: layout,
        cHeader: cHeader,
        cNav: cNav
    },
    children: [
        {
            path: 'userGradeOperation',
            component: () => import('@/views/user/userGradeOperation'),
            name: 'userGradeOperation',
            meta: {
                title: '会员等级',
                key: 'MENU_USER_GRADE_OPERATION'
            }
        }, {
            path: 'userMegOperation',
            component: () => import('@/views/user/userMegOperation'),
            name: 'userMegOperation',
            meta: {
                title: '用户信息',
                key: 'MENU_USER_MEG_OPERATION',
                btnPermission: [{
                    key: 'BTN_USER_MEG_OPERATION_SEE_DETAIL',
                    title: '支付同步'
                }, {
                    key: 'BTN_USER_MEG_OPERATION_SYNC_PAY_RESULT',
                    title: '手动触发支付成功'
                }]
            }
        }, {
            path: 'memberInfo',
            component: () => import('@/views/user/memberInfo'),
            name: 'memberInfo',
            hidden: true,
            meta: {
                title: '会员详细信息',
                icon: '',
                key: 'MENU_MEMBER_INFO'
            }
        },
        {
            path: 'advisorManage',
            component: () => import('@/views/user/advisorManage'),
            name: 'advisorManage',
            meta: {
                title: '导师管理',
                key: 'MENU_ADVISOR_MANAGE',
                btnPermission: [{
                    key: 'BTN_ADVISOR_MANAGE_ADD',
                    title: '添加导师'
                }, {
                    key: 'BTN_ADVISOR_MANAGE_EDIT',
                    title: '编辑'
                }, {
                    key: 'BTN_ADVISOR_MANAGE_COPY',
                    title: '复制'
                }]
            }
        },
        {
            path: 'userWithdrawals',
            component: () => import('@/views/user/userWithdrawals'),
            name: 'userWithdrawals',
            meta: {
                title: '用户提现',
                key: 'MENU_USER_WITHDRAWALS',
                btnPermission: [{
                    key: 'BTN_USER_WITHDRAWALS',
                    title: '提现'
                }, {
                    key: 'BTN_USER_WITHDRAWALS_DOWNLOAD',
                    title: '用户提现信息导出'
                }]
            }
        },
        {
            path: 'feedback',
            component: () => import('@/views/user/feedback'),
            name: 'feedback',
            meta: {
                title: '问题反馈',
                key: 'MENU_FEEDBACK'
            }
        },
        {
            path: 'commissionRecord',
            component: () => import('@/views/user/extendFunction/commissionRecord'),
            name: 'commissionRecord',
            meta: {
                title: '分佣查询',
                key: 'MENU_USER_COMMISSION_RECORD',
                btnPermission: []
            }
        },
        {
            path: 'userIncomeRecord',
            component: () => import('@/views/user/extendFunction/userIncomeRecord'),
            name: 'userIncomeRecord',
            meta: {
                title: '收支记录',
                key: 'MENU_USER_INCOME_RECORD',
                btnPermission: [
                    {
                        key: 'MENU_USER_INCOME_RECORD_ROLL_BACK',
                        title: '解绑'
                    }
                ]
            }
        },
        {
            path: 'payInfoSearch',
            component: () => import('@/views/user/extendFunction/payInfoSearch'),
            name: 'payInfoSearch',
            meta: {
                title: '支付信息',
                key: 'MENU_USER_PAY_INFO_SEARCH',
                btnPermission: [{
                    key: 'BTN_USER_PAY_INFO_COUNT',
                    title: '审单统计'
                }]
            }
        },
        {
            path: 'userManage',
            component: () => import('@/views/user/userManage'),
            name: 'userManage',
            meta: {
                title: '扩展功能',
                key: 'MENU_USER_MANAGE',
                keepAlive: true,
                btnPermission: [{
                    key: 'TAB_USER_MANAGE_RAKE_BACK',
                    title: '返佣页面展示'
                },
                {
                    key: 'BTN_USER_MANAGE_ADD_MONEY',
                    title: '根据订单号手动触发返佣'
                },
                {
                    key: 'BTN_USER_CHANGE_COUNTRY',
                    title: '修改用户国家'
                },
                {
                    key: 'BTN_USER_MANAGE_BIND_BEATMONEY',
                    title: '根据订单佣金记录打钱'
                },

                // {
                //     key: 'TAB_USER_MANAGE_SUB_COMMISSION',
                //     title: '分佣查询页面展示'
                // },
                // {
                //     key: 'TAB_USER_MANAGE_SUB_USER_INCOME',
                //     title: '收支记录页面展示'
                // },
                // {
                //     key: 'TAB_USER_MANAGE_PAY_INFO',
                //     title: '支付信息页面展示'
                // },
                {
                    key: 'BTN_USER_MANAGE_REMOVE_MOBILE',
                    title: '注销手机号'
                },
                {
                    key: 'BTN_USER_MANAGE_RESET_MOBILE',
                    title: '重新设置手机号'
                },
                {
                    key: 'TAB_USER_MANAGE_UPLEVEL',
                    title: '触发升级页面展示'
                }, {
                    key: 'BTN_USER_MANAGE_DISCONNECT',
                    title: '断绑'
                }, {
                    key: 'BTN_USER_MANAGE_BIND',
                    title: '绑定'
                }, {
                    key: 'TAB_USER_MANAGE_ADD_POINT',
                    title: '补积分'
                }, {
                    key: 'TAB_USER_MANAGE_BATCH_REGISTER',
                    title: '批量注册'
                }, {
                    key: 'TAB_USER_MANAGE_SEND_CODE',
                    title: '发送验证码'
                }, {
                    key: 'BTN_USER_MANAGE_SET_USER_LEVEL',
                    title: '预设等级'
                }, {
                    key: 'BTN_USER_MANAGE_UPDATE_FINGO_INFO',
                    title: '修改Fingo导师微信信息'
                },
                {
                    key: 'BTN_DOWNLOAD_TEAM_STATISTICS',
                    title: '下载团队统计'
                }]
            }
        },
        {
            path: 'brandInfoSearch',
            component: () => import('@/views/user/brandInfoSearch/index'),
            name: 'brandInfoSearch',
            meta: {
                title: '品牌馆用户指标',
                key: 'MENU_USER_MEG_OPERATION'
            }
        }
    ]
}
