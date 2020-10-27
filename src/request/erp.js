import request from './request'
/**
 *  库存后台接口
 * @export
 * @param {*} params
 * @returns
 */
// 库存列表，分页
export function inventory(params) {
    console.log(params)
    const req = request.create('InventoryPageReq', params)
    return request('erp', 'InventoryBossService.inventoryPage', req, 'inventory.InventoryPageResp')
};
 //  库存日志分页
export function inventoryRecordPage(params) {
    console.log(params)
    const req = request.create('InventoryRecordPageReq', params)
    return request('erp', 'InventoryBossService.inventoryRecordPage', req, 'inventory.InventoryRecordPageResp')
};
 //  后台修改库存
export function inventoryModify(params) {
    console.log(params)
    const req = request.create('AdminUpdateInventoryReq', params)
    return request('erp', 'InventoryBossService.adminUpdateInventory', req, 'inventory.AdminUpdateInventoryResp')
};

/**
 *  供应链 - 采购
 * @export
 * @param {*} params
 * @returns
 */
//分页查询功能
export function purchaseOrderPage(params) {
    console.log(params)
    const req = request.create('PurchaseOrderReq', params)
    return request('erp', 'PurchaseOrderService.purchaseOrderPage', req, 'purchase.PurchaseOrderResp')
};
//单个详情查询
export function getPurchaseOrder(params) {
    console.log(params)
    const req = request.create('PoDetailReq', params)
    return request('erp', 'PurchaseOrderService.getPurchaseOrder', req, 'purchase.PoDetailResp')
};
//导出列表功能
export function exportoPos(params) {
    console.log(params)
    const req = request.create('PurchaseOrderReq', params)
    return request('erp', 'PurchaseOrderService.exportoPos', req, 'purchase.ExportPoResp')
};
//导出单个功能
export function exportoPo(params) {
    console.log(params)
    const req = request.create('PoDetailReq', params)
    return request('erp', 'PurchaseOrderService.exportoPo', req, 'purchase.ExportPoResp')
};
//导出发货单，状态和分页数据不取
export function exportShipOrder(params) {
    console.log(params)
    const req = request.create('PurchaseOrderShipReq', params)
    return request('erp', 'PurchaseOrderService.exportShipOrder', req, 'purchase.ExportPoResp')
};



// 保存采购单和编辑采购单
export function savePo(params) {
    console.log(params)
    const req = request.create('PurchaseOrderSavePbReq', params)
    return request('erp', 'PurchaseOrderHandleService.savePo', req, 'purchase.PurchaseOrderSavePbResp')
};
//编辑单个采购单详情
export function SinglePoEdit(params) {
    console.log(params)
    const req = request.create('PoSingleEditReq', params)
    return request('erp', 'PurchaseOrderHandleService.SinglePoEdit', req, 'purchase.PoSingleEditResp')
};
//单个详情补单
export function singleMakeup(params) {
    console.log(params)
    const req = request.create('PurchaseOrderSingleMakeupReq', params)
    return request('erp', 'PurchaseOrderHandleService.singleMakeup', req, 'purchase.PurchaseOrderSingleMakeupResp')
};
//整单取消
export function allCancel(params) {
    console.log(params)
    const req = request.create('PurchaseOrderCancelReq', params)
    return request('erp', 'PurchaseOrderHandleService.allCancel', req, 'purchase.PurchaseOrderCancelResp')
};
//部分取消
export function partCancel(params) {
    console.log(params)
    const req = request.create('PurchasePartCancelReq', params)
    return request('erp', 'PurchaseOrderHandleService.partCancel', req, 'purchase.PurchasePartCancelResp')
};
//确认采购
export function ensurePurchase(params) {
    console.log(params)
    const req = request.create('EnsurePurchaseReq', params)
    return request('erp', 'PurchaseOrderHandleService.ensurePurchase', req, 'purchase.EnsurePurchaseResp')
};
//缺货
export function stockout(params) {
    console.log(params)
    const req = request.create('StockOutReq', params)
    return request('erp', 'PurchaseOrderHandleService.stockout', req, 'purchase.StockOutResp')
};
//发货
export function deliver(params) {
    console.log(params)
    const req = request.create('DeliverReq', params)
    return request('erp', 'PurchaseOrderHandleService.deliver', req, 'purchase.DeliverResp')
};
//导入发货
export function importShip(params) {
    console.log(params)
    const req = request.create('ImportShipReq', params)
    return request('erp', 'PurchaseOrderHandleService.importShip', req, 'purchase.ImportShipResp')
};

/**
 *  供应商订单
 * @export
 * @param {*} params
 * @returns
 */
// 供应商后台接口

// 供应商列表，分页
export function supplierPage(params) {
    console.log(params)
    const req = request.create('SupplierPageReq', params)
    return request('erp', 'SupplierBossService.supplierPage', req, 'supplier.SupplierPageResp')
};

// 保存修改|新增
export function saveSupplier(params) {
    console.log(params)
    const req = request.create('SupplierSaveReq', params)
    return request('erp', 'SupplierBossService.saveSupplier', req, 'supplier.SupplierSaveResp')
};

// 获取供应商详情
export function getSupplierDetail(params) {
    console.log(params)
    const req = request.create('SupplierDetailReq', params)
    return request('erp', 'SupplierBossService.getSupplierDetail', req, 'supplier.SupplierDetailResp')
};

// 禁用供应商
export function disableSupplier(params) {
    console.log(params)
    const req = request.create('SupplierDisableReq', params)
    return request('erp', 'SupplierBossService.disableSupplier', req, 'supplier.DisableSupplierResp')
};

// 启用供应商
export function enableSupplier(params) {
    console.log(params)
    const req = request.create('SupplierEnableReq', params)
    return request('erp', 'SupplierBossService.enableSupplier', req, 'supplier.SupplierEnableResp')
};

// 删除供应商
export function deleteSupplier(params) {
    console.log(params)
    const req = request.create('SupplierDeleteReq', params)
    return request('erp', 'SupplierBossService.deleteSupplier', req, 'supplier.DeleteSupplierResp')
};






// 供应商列表，分页
export function supplierOrder(params) {
    console.log(params)
    const req = request.create('SupplierOrderPageReq', params)
    return request('erp', 'SupplierOrderBossService.supplierOrderPage', req, 'supplier.SupplierOrderPageResp')
};

// 订单缺货 - 供应商
export function supplierStockout(params) {
    console.log(params)
    const req = request.create('SupplierOrderStockoutReq', params)
    return request('erp', 'SupplierOrderBossService.orderStockout', req, 'supplier.SupplierOrderStockoutResp')
};

// 订单发货 - 供应商
export function supplierShip(params) {
    console.log(params)
    const req = request.create('SupplierOrderDeliverReq', params)
    return request('erp', 'SupplierOrderBossService.orderDeliver', req, 'supplier.SupplierOrderDeliverResp')
};

// 导出订单
export function exportoOrder(params) {
    console.log(params)
    const req = request.create('SupplierOrderPageReq', params)
    return request('erp', 'SupplierOrderBossService.exportoOrder', req, 'supplier.ExportoSupplierOrderResp')
};


/**
 *  入库单
 * @export
 * @param {*} params
 * @returns
 */
// 入库单列表
export function receiptOrderPage(params) {
    console.log(params)
    const req = request.create('IncomeOrderPageReq', params)
    return request('erp', 'IncomeOrderBossService.incomeOrderPage', req, 'warehouse.IncomeOrderPageResp')
};
// 供应商列表，分页
export function incomeOrderSign(params) {
    console.log(params)
    const req = request.create('IncomeOrderSignReq', params)
    return request('erp', 'IncomeOrderBossService.incomeOrderSign', req, 'warehouse.IncomeOrderSignResp')
};
// 入库
export function receiptOrderIncome(params) {
    console.log(params)
    const req = request.create('OrderIncomeReq', params)
    return request('erp', 'IncomeOrderBossService.orderIncome', req, 'warehouse.OrderIncomeResp')
};
// 修改物流单
export function receiptOrderModifyLogistics(params) {
    console.log(params)
    const req = request.create('ModifyIncomeOrderLogiReq', params)
    return request('erp', 'IncomeOrderBossService.modifyIncomeOrderLogi', req, 'warehouse.ModifyIncomeOrderLogiResp')
};
/**
 *  出库单
 * @export
 * @param {*} params
 * @returns
 */
// 供应商列表，分页
export function outOrderPage(params) {
    console.log(params)
    const req = request.create('OutOrderPageReq', params)
    return request('erp', 'OutOrderBossService.outOrderPage', req, 'warehouse.OutOrderPageResp')
};
// 出库单重推
export function repushOutOrder(params) {
    console.log(params)
    const req = request.create('RepushOutOrderReq', params)
    return request('erp', 'OutOrderBossService.repushOutOrder', req, 'warehouse.RepushOutOrderResp')
};
// 取消出库单
export function cannelOutOrder(params) {
    console.log(params)
    const req = request.create('CannelOutOrderReq', params)
    return request('erp', 'OutOrderBossService.cannelOutOrder', req, 'warehouse.CannelOutOrderResp')
};
// 创建出库单
export function createOutOrder(params) {
    console.log(params)
    const req = request.create('CreateOutOrderReq', params)
    return request('erp', 'OutOrderBossService.createOutOrder', req, 'warehouse.CreateOutOrderResp')
};


/**
 *  仓库
 * @export
 * @param {*} params
 * @returns
 */
// 仓库列表分页
export function wmsWarehouse(params) {
    console.log(params)
    const req = request.create('WarehousePageReq', params)
    return request('erp', 'WarehouseBossService.warehousePage', req, 'warehouse.WarehousePageResp')
};



/**
 *  异常
 * @export
 * @param {*} params
 * @returns
 */
// 仓库列表分页
export function abnormalPackagePage(params) {
    console.log(params)
    const req = request.create('AbnormalLogiPageReq', params)
    return request('erp', 'AbnormalBossService.abnormalLogiPage', req, 'warehouse.AbnormalLogiPageResp')
};
export function abnormalProductPage(params) {
    console.log(params)
    const req = request.create('AbnormalSkuPageReq', params)
    return request('erp', 'AbnormalBossService.abnormalSkuPage', req, 'warehouse.AbnormalSkuPageResp')
};
export function purchaseDealAbnormal(params) {
    console.log(params)
    const req = request.create('PurchaseDealAbnormalReq', params)
    return request('erp', 'AbnormalBossService.purchaseDealAbnormal', req, 'warehouse.PurchaseDealAbnormalResp')
};

/**
 *  未入库追踪预警订单(订单状态-未发货)
 * @export
 * @param {*} params
 * @returns
 */
export function GetRiskPo (params) {
    console.log(params)
    const req = request.create('RiskPoReq', params)
    return request('datacenter', 'ErpBossService.GetRiskPo', req, 'RiskPoResp')
};
