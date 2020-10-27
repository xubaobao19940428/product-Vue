import request from './request'

//直邮订单

/**
 * jit订单分页查询
 * @export
 * @param {*} params
 * @returns
 */
export function JitOrderPage(params) {
    console.log(params)
    const req = request.create('JitOrderPageReq', params)
    return request('erp', 'JitOrderBossService.JitOrderPage', req, 'JitOrderPageResp')
}

/**
 * 导入发货
 * @export
 * @param {*} params
 * @returns
 */
export function ImportShip(params) {
    console.log(params)
    const req = request.create('ImportJitShipReq', params)
    return request('erp', 'JitOrderBossService.ImportShip', req, 'ImportJitShipResp')
}

/**
 * 导出
 * @export
 * @param {*} params
 * @returns
 */
export function ExportJitOrder(params) {
    console.log(params)
    const req = request.create('JitOrderPageReq', params)
    return request('erp', 'JitOrderBossService.ExportJitOrder', req, 'ExportJitOrderResp')
}

/**
 * 查询订单物流信息
 * @export
 * @param {*} params
 * @returns
 */
export function QueryJitLogi(params) {
    console.log(params)
    const req = request.create('QueryJitLogiReq', params)
    return request('erp', 'JitOrderBossService.QueryJitLogi', req, 'QueryJitLogiResp')
}

/**
 * 查询订单物流信息及物流跟踪信息
 * @export
 * @param {*} params
 * @returns
 */
export function QueryLogiTracking(params) {
    console.log(params)
    const req = request.create('QueryLogiTrackingReq', params)
    return request('erp', 'JitOrderBossService.QueryLogiTracking', req, 'QueryLogiTrackingResp')
}

/**
 * 修改物流单号
 * @export
 * @param {*} params
 * @returns
 */
export function ModifyLogi(params) {
    console.log(params)
    const req = request.create('ModifyJitOrderLogiReq', params)
    return request('erp', 'JitOrderBossService.ModifyLogi', req, 'ModifyJitOrderLogiResp')
}

/**
 * jit订单发货
 * @export
 * @param {*} params
 * @returns
 */
export function Ship(params) {
    console.log(params)
    const req = request.create('JitOrderShipReq', params)
    return request('erp', 'JitOrderBossService.Ship', req, 'JitOrderShipResp')
}

/**
 * 物流公司列表查询
 * @export
 * @param {*} params
 * @returns
 */
export function QueryLogiCompanyList(params) {
    console.log(params)
    const req = request.create('QueryLogiCompanyListReq', params)
    return request('erp', 'SupplierOrderBusinessService.QueryLogiCompanyList', req, 'QueryLogiCompanyListResp')
};

/**
 * 直邮物流公司列表查询
 * @export
 * @param {*} params
 * @returns
 */
export function GetLogiCompanyList(params) {
    console.log(params)
    const req = request.create('LogiCompanyListReq', params)
    return request('erp', 'LogiCompanyBossService.GetLogiCompanyList', req, 'LogiCompanyListResp')
}

/**
 * 导出模板
 * @export
 * @param {*} params
 * @returns
 */
export function ExportTemplate(params) {
    console.log(params)
    const req = request.create('ExportTemplateReq', params)
    return request('erp', 'JitOrderBossService.ExportTemplate', req, 'ExportJitOrderResp')
}

/**
 * 取消jit订单
 * @export
 * @param {*} params
 * @returns
 */
export function CancelOrder(params) {
    console.log(params)
    const req = request.create('CancelJitOrderReq', params)
    return request('erp', 'JitOrderBossService.CancelOrder', req, 'CancelJitOrderResp')
}