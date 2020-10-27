import request from './request'

/**
 * 库存列表，分页
 * @export
 * @param {*} params
 * @returns
 */
export function inventoryPage (params) {
    console.log(params)
    const req = request.create('InventoryPageReq', params)
    return request('erp', 'InventoryBossService.InventoryPage', req, 'inventory.InventoryPageResp')
};

/**
 * 库存日志分页
 * @export
 * @param {*} params
 * @returns
 */
export function inventoryRecordPage (params) {
    console.log(params)
    const req = request.create('InventoryRecordPageReq', params)
    return request('erp', 'InventoryBossService.InventoryRecordPage', req, 'inventory.InventoryRecordPageResp')
};

/**
 * 后台修改库存
 * @export
 * @param {*} params
 * @returns
 */
export function adminUpdateInventory (params) {
    console.log(params)
    const req = request.create('AdminUpdateInventoryReq', params)
    return request('erp', 'InventoryBossService.AdminUpdateInventory', req, 'inventory.AdminUpdateInventoryResp')
};

/**
 * 后台修改库存
 * @export
 * @param {*} params
 * @returns
 */
export function AdminUpdateInventory (params) {
    console.log(params)
    const req = request.create('AdminUpdateInventoryReq', params)
    return request('erp', 'InventoryBossService.AdminUpdateInventory', req, 'inventory.AdminUpdateInventoryResp')
};

/**
 * 获取sku信息
 * @export
 * @param {*} params
 * @returns
 */
export function getSkuInfo (params) {
    const req = request.create('SkuInfoReq', params)
    return request('erp', 'InventoryBossService.GetSkuInfo', req, 'inventory.SkuInfoResp')
};

/**
 * 创建初始库存
 * @export
 * @param {*} params
 * @returns
 */
export function addInventory (params) {
    const req = request.create('AddInventoryReq', params)
    return request('erp', 'InventoryBossService.AddInventory', req, 'inventory.AddInventoryResp')
};
/**
 * 库存变动类型列表
 * @export
 * @param {*} params
 * @returns
 */
export function GetRecordType (params) {
    const req = request.create('GetRecordTypeReq', params)
    return request('erp', 'InventoryBossService.GetRecordType', req, 'inventory.GetRecordTypeResp')
};

/**
 * 商家库存列表
 * @export
 * @param {*} params
 * @returns
 */
export function QuerySupplierInventoryByCondition (params) {
    const req = request.create('SupplierInventoryDataReq', params)
    return request('erp', 'InventoryBossService.QuerySupplierInventoryByCondition', req, 'inventory.SupplierInventoryDataResp')
};

/**
 * 商家库存流水
 * @export
 * @param {*} params
 * @returns
 */
export function QuerySupplierInventoryRecordByCondition (params) {
    const req = request.create('SupplierInventoryRecordReq', params)
    return request('erp', 'InventoryBossService.QuerySupplierInventoryRecordByCondition', req, 'inventory.SupplierInventoryRecordResp')
};

