import request from './request'

/**
 * 供应商列表，分页
 * @export
 * @param {*} params
 * @returns
 */
export function supplierPage(params) {
    console.log(params)
    const req = request.create('SupplierPageReq', params)
    return request('erp', 'SupplierBossService.SupplierPage', req, 'supplier.SupplierPageResp')
};

/**
 * 供应商简要信息列表，分页
 * @export
 * @param {*} params
 * @returns
 */
export function supplierBasePage(params) {
    console.log(params)
    const req = request.create('SupplierBasePageReq', params)
    return request('erp', 'SupplierBossService.SupplierBasePage', req, 'supplier.SupplierBasePageResp')
};

/**
 * 保存修改|新增
 * @export
 * @param {*} params
 * @returns
 */
export function saveSupplier(params) {
    console.log(params)
    const req = request.create('SupplierSaveReq', params)
    return request('erp', 'SupplierBossService.SaveSupplier', req, 'supplier.SupplierSaveResp')
};

/**
 * 获取供应商详情
 * @export
 * @param {*} params
 * @returns
 */
export function getSupplierDetail(params) {
    console.log(params)
    const req = request.create('SupplierDetailReq', params)
    return request('erp', 'SupplierBossService.GetSupplierDetail', req, 'supplier.SupplierDetailResp')
};

/**
 * 禁用供应商
 * @export
 * @param {*} params
 * @returns
 */
export function disableSupplier(params) {
    console.log(params)
    const req = request.create('SupplierDisableReq', params)
    return request('erp', 'SupplierBossService.DisableSupplier', req, 'supplier.DisableSupplierResp')
};

/**
 * 启用供应商
 * @export
 * @param {*} params
 * @returns
 */
export function enableSupplier(params) {
    console.log(params)
    const req = request.create('SupplierEnableReq', params)
    return request('erp', 'SupplierBossService.EnableSupplier', req, 'supplier.SupplierEnableResp')
};

/**
 * 删除供应商
 * @export
 * @param {*} params
 * @returns
 */
export function deleteSupplier(params) {
    console.log(params)
    const req = request.create('SupplierDeleteReq', params)
    return request('erp', 'SupplierBossService.DeleteSupplier', req, 'supplier.DeleteSupplierResp')
};

/**
 * 供应商列表，分页
 * @export
 * @param {*} params
 * @returns
 */
export function supplierOrderPage(params) {
    console.log(params)
    const req = request.create('SupplierOrderPageReq', params)
    return request('erp', 'SupplierOrderBossService.SupplierOrderPage', req, 'supplier.SupplierOrderPageResp')
};

/**
 * 订单缺货 - 供应商
 * @export
 * @param {*} params
 * @returns
 */
export function orderStockout(params) {
    console.log(params)
    const req = request.create('SupplierOrderStockoutReq', params)
    return request('erp', 'SupplierOrderBossService.OrderStockout', req, 'supplier.SupplierOrderStockoutResp')
};

/**
 * 订单发货 - 供应商
 * @export
 * @param {*} params
 * @returns
 */
export function orderDeliver(params) {
    console.log(params)
    const req = request.create('SupplierOrderDeliverReq', params)
    return request('erp', 'SupplierOrderBossService.OrderDeliver', req, 'supplier.SupplierOrderDeliverResp')
};

/**
 * 导出订单
 * @export
 * @param {*} params
 * @returns
 */
export function exportOrder(params) {
    console.log(params)
    const req = request.create('SupplierOrderPageReq', params)
    return request('erp', 'SupplierOrderBossService.ExportOrder', req, 'supplier.ExportSupplierOrderResp')
};
