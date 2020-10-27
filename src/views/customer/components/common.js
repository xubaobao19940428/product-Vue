import { listSysUserByPage } from '@/request/staff'
export default {
    data () {
        return {
            sourceList: {
                1: 'Messenger',
                2: 'Whatsapp',
                3: 'WeChat',
                4: 'Email',
                5: 'Appstore',
                6: 'FingoApp',
                7: 'Others'
            },
            adminUserList: [],
            emergencyLevel: [{
                key: 1,
                name: '紧急'
            }, {
                key: 10,
                name: '一般'
            }],
            dispatchMap: [{
                key: 1,
                name: '分派'
            }, {
                key: 2,
                name: '不分派'
            }],
            WorkOrderDealStatus: {
                1: '待处理',
                2: '已处理',
                3: '无需处理'
            },
            WorkOrderStatusEnum: {
                1: '未解决',
                2: '待关闭',
                3: '已关闭'
            },
            WorkOrderDealTypeEnum: {
                1: '创建',
                2: '跟进补充',
                3: '关闭工单',
                4: '转派',
                5: '退单',
                6: '已解决',
                7: '抄送'
            },
            WorkOrderEvaluationEnum: {
                1: '标签有误',
                2: '无需处理',
                3: '非本人处理',
                4: '其他'
            }
        }
    },
    methods: {
        getNameByKey (datKey, listKey) {
            let item = this[listKey].find((val) => {
                return val.key == datKey
            })
            return item ? item.name : ''
        },
        getAdminUserList (query, calback) {
            if (query != '') {
                listSysUserByPage({
                    nickName: query,
                    groupId: -1,
                    page: {
                        pageNum: 1,
                        pageSize: 1000
                    }
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.adminUserList = res.sysUserPb
                        calback && calback(res.sysUserPb)
                    }
                })
            }
        },
        formatImg (imgStr) {
            if (imgStr) {
                return imgStr.split(',')
            }
            return []
        }
    }
}
