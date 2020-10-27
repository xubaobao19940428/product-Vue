import request from './request'

/**
 * 履约监控统计,订单追踪报表
 * @export
 * @param {*} params
 * @returns
 */
export function UserOrderTraceReport (params) {
    console.log(params)
    const req = request.create('UserOrderTraceReportReq', params)
    return request('datacenter', 'OrderTraceReportService.UserOrderTraceReport', req, 'UserOrderTraceReportResp')
};

/**
 * 履约监控统计,出库单跟踪统计
 * @export
 * @param {*} params
 * @returns
 */
export function OutOrderStat (params) {
    console.log(params)
    const req = request.create('OutOrderStatReq', params)
    return request('datacenter', 'PerformanceBossService.OutOrderStat', req, 'OutOrderStatResp')
};

/**
 * 履约监控统计,入库单跟踪统计
 * @export
 * @param {*} params
 * @returns
 */
export function IncomeOrderStat (params) {
    console.log(params)
    const req = request.create('IncomeOrderStatReq', params)
    return request('datacenter', 'PerformanceBossService.IncomeOrderStat', req, 'IncomeOrderStatResp')
};

/**
 * 履约监控统计,采购单跟踪统计 - 系统单
 * @export
 * @param {*} params
 * @returns
 */
export function SystemPurchaseOrderStat (params) {
    console.log(params)
    const req = request.create('SystemPurchaseOrderStatReq', params)
    return request('datacenter', 'PerformanceBossService.SystemPurchaseOrderStat', req, 'SystemPurchaseOrderStatResp')
};

/**
 * 采购单跟踪统计 - 人工单
 * @export
 * @param {*} params
 * @returns
 */
export function ArtificialPurchaseOrderStat (params) {
    console.log(params)
    const req = request.create('ArtificialPurchaseOrderStatReq', params)
    return request('datacenter', 'PerformanceBossService.ArtificialPurchaseOrderStat', req, 'ArtificialPurchaseOrderStatResp')
};
