import { warehousePage } from '@/request/warehouse'
import { supplierBasePage } from '@/request/supplier'
import logisticsCompany from '@/data/company.js'
export default {
    data() {
        return {
            logisticsCompany: logisticsCompany,
            FingoSystem: {
                '1': '使用',
                '2': '不使用'
            },
            incomeStatus: {
                '0': '未入库',
                '1': '部分入库'
            },
            purchaseOrderStatus: {
                'WAIT_PURCHASE': '未采购',
                'PURCHASED': '已采购',
                'STOCKOUT': '缺货',
                'PART_SHIPPED': '部分发货',
                'SHIPPED': '已发货',
                'STORAGED': '已入库',
                'CANCLE': '取消'
                // 'PART_ARRIVED': '部分到货',
                // 'ARRIVED': '已到货',
                // 'UNARRIVED': '未到货',
                // 'PART_STORAGE': '部分入库',
                // 'STORAGED_ABNORMAL': '入库异常',
            },
            purchaseOrderSource: {
                'SYSTEM': '系统',
                'SUPPLEMENT': '补充单',
                'ARTIFICIAL': '人工单'
            },
            logisticsType: {
                'DOMESTIC': '国内',
                'INTERNATIONAL': '国际',
                'LOCAL': '当地'
            },
            wmsWarehouseList: [],
            supplierList: [],
            wayList: {
                1: '海运',
                2: '空运',
            },
            way1List: {
                '6': '广州海运仓（中转仓）'
            }
        }
    },
    created () {
        // this.wmsWarehouse()
        // this.getProductSupplierOption()
    },
    methods: {
        // 获取供应商
        getProductSupplierOption () {
            if (this.supplierList.length > 0) {
                return
            }
            // TODO 分页获取
            let params = {
                page: {
                    pageNum: 1,
                    pageSize: 100000
                }
            }
            supplierBasePage(params).then((response) => {
                if (response.ret.errcode === 1) {
                    this.supplierList = response.list
                }
            }).catch((err) => {
                console.error(err)
            })
        },
        // 获取所有仓库
        wmsWarehouse (callBack) {
            if (this.wmsWarehouseList.length > 0) {
                callBack && callBack()
                return
            }
            let params = {
                page: {
                    pageNum: 1,
                    pageSize: 10000
                }
            }
            warehousePage(params).then((response) => {
                if (response.ret.errcode === 1) {
                    this.wmsWarehouseList = response.list
                    callBack && callBack()
                }
            }).catch((err) => {
                console.error(err)
            })
        }
    }
}
