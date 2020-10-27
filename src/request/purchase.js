import request from './request'

/**
 * 供应商列表，分页
 * @export
 * @param {*} params
 * @returns
 */
export function savePo(params) {
    console.log(params)
    const req = request.create('PurchaseOrderSavePbReq', params)
    return request('erp', 'PurchaseOrderHandleService.SavePo', req, 'purchase.PurchaseOrderSavePbResp')
};

/**
 * 供应商列表，分页
 * @export
 * @param {*} params
 * @returns
 */
export function purchaseOrderPageList(params) {
    console.log(params)
    const req = request.create('PurchaseOrderReq', params)
    return request('erp', 'PurchaseOrderService.PurchaseOrderPage', req, 'purchase.PurchaseOrderResp')
};

/**
 * 编辑单个采购单详情
 * @export
 * @param {*} params
 * @returns
 */
export function singlePoEdit(params) {
    console.log(params)
    const req = request.create('PoSingleEditReq', params)
    return request('erp', 'PurchaseOrderHandleService.SinglePoEdit', req, 'purchase.PoSingleEditResp')
};

/**
 * 单个详情补单
 * @export
 * @param {*} params
 * @returns
 */
export function singleMakeup(params) {
    console.log(params)
    const req = request.create('PurchaseOrderSingleMakeupReq', params)
    return request('erp', 'PurchaseOrderHandleService.SingleMakeup', req, 'purchase.PurchaseOrderSingleMakeupResp')
};

/**
 * 单个SKU取消采购数量
 * @export
 * @param {*} params
 * @returns
 */
export function partCancel(params) {
    console.log(params)
    const req = request.create('PurchasePartCancelReq', params)
    return request('erp', 'PurchaseOrderHandleService.PartCancel', req, 'purchase.PurchasePartCancelResp')
};

/**
 * 整单取消取消采购数量
 * @export
 * @param {*} params
 * @returns
 */
export function allCancel(params) {
    console.log(params)
    const req = request.create('PurchaseOrderCancelReq', params)
    return request('erp', 'PurchaseOrderHandleService.AllCancel', req, 'purchase.PurchaseOrderCancelResp')
};

/**
 * 确认采购
 * @export
 * @param {*} params
 * @returns
 */
export function ensurePurchase(params) {
    console.log(params)
    const req = request.create('EnsurePurchaseReq', params)
    return request('erp', 'PurchaseOrderHandleService.EnsurePurchase', req, 'purchase.EnsurePurchaseResp')
};

/**
 * 缺货
 * @export
 * @param {*} params
 * @returns
 */
export function stockout(params) {
    console.log(params)
    const req = request.create('StockOutReq', params)
    return request('erp', 'PurchaseOrderHandleService.Stockout', req, 'purchase.StockOutResp')
};

/**
 * 发货
 * @export
 * @param {*} params
 * @returns
 */
export function deliver(params) {
    console.log(params)
    const req = request.create('DeliverReq', params)
    return request('erp', 'PurchaseOrderHandleService.Deliver', req, 'purchase.DeliverResp')
};

/**
 * 导入发货
 * @export
 * @param {*} params
 * @returns
 */
export function importShip(params) {
    console.log(params)
    const req = request.create('ImportShipReq', params)
    return request('erp', 'PurchaseOrderHandleService.ImportShip', req, 'purchase.ImportShipResp')
};

/**
 * 导出整单功能
 * @export
 * @param {*} params
 * @returns
 */
export function exportoPo(params) {
    console.log(params)
    const req = request.create('PoDetailReq', params)
    return request('erp', 'PurchaseOrderService.ExportoPo', req, 'purchase.ExportPoResp')
};

/**
 * 单个详情查询
 * @export
 * @param {*} params
 * @returns
 */
export function getPurchaseOrder(params) {
    console.log(params)
    const req = request.create('PoDetailReq', params)
    return request('erp', 'PurchaseOrderService.GetPurchaseOrder', req, 'purchase.PoDetailResp')
};

/**
 * 采购单详情状态进度
 * @export
 * @param {*} params
 * @returns
 */
export function getPurchaseStatusRate(params) {
    console.log(params)
    const req = request.create('PurchaseStatusRateReq', params)
    return request('erp', 'PurchaseOrderService.PurchaseStatusRate', req, 'purchase.PurchaseStatusRateResp')
};

/**
 * sku级别发货详情
 * @export
 * @param {*} params
 * @returns
 */
export function getSkuDeliveryDetail(params) {
    console.log(params)
    const req = request.create('SkuDeliveryDetailReq', params)
    return request('erp', 'PurchaseOrderService.SkuDeliveryDetail', req, 'purchase.SkuDeliveryDetailResp')
};

/**
 * 采购sku异常详情
 * @export
 * @param {*} params
 * @returns
 */
export function getSkuAbnormalDetail(params) {
    console.log(params)
    const req = request.create('SkuAbnormalDetailReq', params)
    return request('erp', 'PurchaseOrderService.SkuAbnormalDetail', req, 'purchase.SkuAbnormalDetailResp')
};

/**
 * 关联订单sku详情
 * @export
 * @param {*} params
 * @returns
 */
export function getPurchaseRelationOrder(params) {
    console.log(params)
    const req = request.create('PurchaseRelationOrderReq', params)
    return request('erp', 'PurchaseOrderService.PurchaseRelationOrder', req, 'purchase.PurchaseRelationOrderResp')
};

/**
 * 导出整单功能
 * @export
 * @param {*} params
 * @returns
 */
export function exportoPos(params) {
    const req = request.create('PurchaseOrderReq', params)
    return request('erp', 'PurchaseOrderService.ExportoPos', req, 'purchase.ExportPoResp')
};
/**
 * 导出整单功能
 * @export
 * @param {*} params
 * @returns
 */
export function exportShipOrder(params) {
    const req = request.create('PurchaseOrderReq', params)
    return request('erp', 'PurchaseOrderService.ExportShipOrder', req, 'purchase.ExportPoResp')
};

// 预警订单相关
/**
 * 未入库追踪预警订单
 * @export
 * @param {*} params
 * @returns
 */
export function getRiskPo(params) {
    const req = request.create('RiskPoReq', params)
    return request('erp', 'PurchaseOrderTrackService.GetRiskPo', req, 'purchase.RiskPoResp')
};
/**
 * 根据订单追踪采购单信息
 * @export
 * @param {*} params
 * @returns
 */
export function getPoTrackByOrderNo(params) {
    const req = request.create('PoTrackReq', params)
    return request('erp', 'PurchaseOrderTrackService.GetPoTrackByOrderNo', req, 'purchase.PoTrackResp')
};


/**
 *  新缺货
 * @export
 * @param {*} params
 * @returns
 */
export function PurchaseStockout (params) {
    const req = request.create('PurchaseStockoutReq', params)
    return request('erp', 'PurchaseOrderHandleService.PurchaseStockout', req, 'purchase.PurchaseStockoutResp')
};
/**
 *  查询缺货数据
 * @export
 * @param {*} params
 * @returns
 */
export function GetStockoutData (params) {
    const req = request.create('GetStockoutDataReq', params)
    return request('erp', 'PurchaseOrderService.GetStockoutData', req, 'purchase.GetStockoutDataResp')
};
/**
 *  新异常补单
 * @export
 * @param {*} params
 * @returns
 */
export function AbnormalMakeup (params) {
    const req = request.create('AbnormalMakeupReq', params)
    return request('erp', 'PurchaseOrderHandleService.AbnormalMakeup', req, 'purchase.AbnormalMakeupResp')
};
/**
 *  采购单的sku-销售订单查询
 * @export
 * @param {*} params
 * @returns
 */
export function PurchaseSkuOrderPage (params) {
    const req = request.create('PurchaseSkuOrderPageReq', params)
    return request('erp', 'PurchaseOrderService.PurchaseSkuOrderPage', req, 'purchase.PurchaseSkuOrderPageResp')
};
/**
 *  采购单的sku-销售订单导出
 * @export
 * @param {*} params
 * @returns
 */
export function PurchaseSkuOrderExport (params) {
    const req = request.create('PurchaseSkuOrderExportReq', params)
    return request('erp', 'PurchaseOrderService.PurchaseSkuOrderExport', req, 'purchase.PurchaseSkuOrderExportResp')
};
/**
 *  采购单批量导入确认采购
 * @export
 * @param {*} params
 * @returns
 */
export function ImportBatchPurchase (params) {
    const req = request.create('ImportBatchPurchaseReq', params)
    return request('erp', 'PurchaseOrderHandleService.ImportBatchPurchase', req, 'purchase.ImportBatchPurchaseResp')
};
/**
 *  导出采购单批量确认采购模板
 * @export
 * @param {*} params
 * @returns
 */
export function ExportPurEnsureTemplate (params) {
    const req = request.create('ExportPurEnsureTemplateReq', params)
    return request('erp', 'PurchaseOrderService.ExportPurEnsureTemplate', req, 'purchase.ExportPurEnsureTemplateResp')
};
/**
 *  导入任务分页列表
 * @export
 * @param {*} params
 * @returns
 */
export function PurEnsureImportPage (params) {
    const req = request.create('PurEnsureImportPageReq', params)
    return request('erp', 'PurchaseOrderService.PurEnsureImportPage', req, 'purchase.PurEnsureImportPageResp')
};
/**
 *  导出任务分页列表
 * @export
 * @param {*} params
 * @returns
 */
export function PurExportTaskPage (params) {
    const req = request.create('PurExportTaskPageReq', params)
    return request('erp', 'PurchaseOrderService.PurExportTaskPage', req, 'purchase.PurExportTaskPageResp')
};
/**
 *  导入详情分页列表
 * @export
 * @param {*} params
 * @returns
 */
export function PurEnsureImportDetailPage (params) {
    const req = request.create('PurEnsureImportDetailPageReq', params)
    return request('erp', 'PurchaseOrderService.PurEnsureImportDetailPage', req, 'purchase.PurEnsureImportDetailPageResp')
};
/* 
类目分组系列
*/
//类目分组编辑和新增
export function PurCateGroupAdd (params) {
    const req = request.create('PurCateGroupAddReq', params)
    return request('erp', 'PurCateGroupService.SaveAndUpdate', req, 'purchase.PurCateGroupAddResp')
};
//类目分组列表
export function PurCateGroupList (params) {
    const req = request.create('PurCateGroupQueryReq', params)
    return request('erp', 'PurCateGroupService.GetPurCateGroupList', req, 'purchase.PurCateGroupListResp')
};
//类目分组拉详情
export function PurCateGroupDetail (params) {
    const req = request.create('PurCateGroupDetailReq', params)
    return request('erp', 'PurCateGroupService.PurCateGroupDetail', req, 'purchase.PurCateGroupDetailResp')
};
//类目分组编辑
export function PurCateGroupUpdate (params) {
    const req = request.create('PurCateGroupAddReq', params)
    return request('erp', 'PurCateGroupService.SaveAndUpdate', req, 'purchase.PurCateGroupAddResp')
};
/* 类目权限系列 */
//类目权限分组列表
export function PurCateGroupQuery (params) {
    const req = request.create('PurCateGroupQueryReq', params)
    return request('erp', 'PurCateGroupService.GetPurCateGroupBuyerList', req, 'purchase.PurCateGroupBuyerListResp')
};
//类目权限编辑
export function PurCateGroupEditBuyer (params) {
    const req = request.create('PurCateGroupEditBuyerReq', params)
    return request('erp', 'PurCateGroupService.EditBuyerGroup', req, 'purchase.PurCateGroupEditBuyerResp')
};
//类目权限详情
export function PurCateGroupBuyerDetail (params) {
    const req = request.create('PurCateGroupBuyerDetailReq', params)
    return request('erp', 'PurCateGroupService.PurCateGroupBuyerDetail', req, 'purchase.PurCateGroupBuyerDetailResp')
};
//全部类目分组
export function PurCateGroupSelect (params) {
    const req = request.create('PurCateGroupSelectReq', params)
    return request('erp', 'PurCateGroupService.GetPurCateGroupSelect', req, 'purchase.PurCateGroupSelectResp')
};
//删除类目权限
export function DeletePurCateGroupBuyer (params) {
    const req = request.create('DeletePurCateGroupBuyerReq', params)
    return request('erp', 'PurCateGroupService.DeletePurCateGroupBuyer', req, 'purchase.DeletePurCateGroupBuyerResp')
};




/*
*1688自动采购
*/
//得到初始化列表
export function AutoPurchaseOrderList (params) {
    const req = request.create('AutoPurchaseOrderListReq', params)
    return request('erp', 'PurchaseAutoService.AutoPurchaseList', req, 'purchase.AutoPurchaseOrderListResp')
};
//付款前校验
export function AutoPayCheck (params) {
    const req = request.create('AutoPayCheckReq', params)
    return request('erp', 'PurchaseAutoService.AutoPayCheck', req, 'purchase.AutoPayCheckResp')
};
//批量可付款
export function CanPayBatch (params) {
    const req = request.create('CanPayBatchReq', params)
    return request('erp', 'PurchaseAutoService.CanPayBatch', req, 'purchase.CanPayBatchResp')
};
//生成支付链接
export function GeneratePayUrl (params) {
    const req = request.create('GeneratePayUrlReq', params)
    return request('erp', 'PurchaseAutoService.GeneratePayUrl', req, 'purchase.GeneratePayUrlResp')
};
//SKU取消
export function AutoPurchaseSkuCancel (params) {
    const req = request.create('AutoPurchaseSkuCancelReq', params)
    return request('erp', 'PurchaseAutoService.AutoPurchaseSkuCancel', req, 'purchase.AutoPurchaseSkuCancelResp')
};
//SKU更新单价
export function AutoPurchaseSkuPrice (params) {
    const req = request.create('AutoPurchaseSkuPriceReq', params)
    return request('erp', 'PurchaseAutoService.AutoPurchaseSkuPrice', req, 'purchase.AutoPurchaseSkuPriceResp')
};
//修改1688自动采购
export function AutoPurchaseUpdate (params) {
    const req = request.create('AutoPurchaseUpdateReq', params)
    return request('erp', 'PurchaseAutoService.AutoPurchaseUpdate', req, 'purchase.AutoPurchaseUpdateResp')
};
//SKU详情
export function AutoPurchaseDetail (params) {
    const req = request.create('AutoPurchaseDetailReq', params)
    return request('erp', 'PurchaseAutoService.AutoPurchaseDetail', req, 'purchase.AutoPurchaseDetailResp')
};
//批量自动采购
export function AutoBatchPurchase (params) {
    const req = request.create('AutoBatchPurchaseReq', params)
    return request('erp', 'PurchaseAutoService.AutoBatchPurchase', req, 'purchase.AutoBatchPurchaseResp')
};