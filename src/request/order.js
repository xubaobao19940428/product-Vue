import request from './request'

/**
 * 订单列表
 */
// 订单列表
export function viewOrderList (params) {
    const req = request.create('GetOrderListRequest', params)
    return request('order', 'OrderService.GetOrderList', req, 'GetOrderListResponse')
}
// 订单详情
export function viewOrderDetail (params) {
    const req = request.create('GetOrderDetailRequest', params)
    return request('order', 'OrderService.GetOrderDetail', req, 'GetOrderDetailResponse')
}
// 添加订单后台备注
export function addOrderRemark (params) {
    const req = request.create('AddOrderRemarkRequest', params)
    return request('order', 'OrderService.AddOrderRemark', req, 'AddOrderRemarkRespone')
}
// 修改收货信息
export function updateReceiverAddress (params) {
    const req = request.create('UpdateReceiverAddressReq', params)
    return request('order', 'OrderService.UpdateReceiverAddress', req, 'UpdateReceiverAddressResp')
}
// 订单导出
export function exportOrder (params) {
    const req = request.create('ExportOrderRequest', params)
    return request('order', 'OrderService.ExportOrder', req, 'ExportOrderResponse')
}
// 自提
export function changeToBuyers (params) {
    const req = request.create('ChangeToBuyersReq', params)
    return request('order', 'OrderService.ChangeToBuyers', req, 'order.ChangeToBuyersResp')
}
// 查看物流信息
export function GetLogisticsInfo (params) {
    const req = request.create('GetLogisticsInfoReq', params)
    return request('order', 'OrderService.GetLogisticsInfo', req, 'order.GetLogisticsInfoResp')
}
// 采购追踪
export function getPurchaseOrder (params) {
    const req = request.create('PoTrackReq', params)
    return request('erp', 'PurchaseOrderTrackService.GetPoTrackByOrderNo', req, 'purchase.PoTrackResp')
}
// 根据子订单配置主订单和用户信息
export function queryOrderInfoBySub (params) {
    const req = request.create('QueryOrderInfoBySubReq', params)
    return request('order', 'OrderService.QueryOrderInfoBySub', req, 'order.QueryOrderInfoBySubResp')
}
/**
 * 分页查询用户订单详情
 * @export
 * @param {*} params
 * @returns
 */
export function memberOrderList(params) {
    console.log(params)
    const req = request.create('MemberOrderListReq', params)
    return request('order', 'OrderService.MemberOrderList', req, 'order.MemberOrderListResp')
}

/**
 * 会员订单详情
 * @export
 * @param {*} params
 * @returns
 */
export function memberOrderDetail(params) {
    console.log(params)
    const req = request.create('MemberOrderDetailReq', params)
    return request('order', 'OrderService.MemberOrderDetail', req, 'order.MemberOrderDetailResp')
}


/**
 * 发货订单查询
 * @export
 * @param {*} params
 * @returns
 */
export function shipOrderList(params) {
    const req = request.create('ShipOrderListReq', params)
    return request('order', 'OrderService.ShipOrderList', req, 'order.ShipOrderListResp')
}
/**
 * 发货订单导出
 * @export
 * @param {*} params
 * @returns
 */
export function exportShipOrderList(params) {
    const req = request.create('ExportShipOrderReq', params)
    return request('order', 'OrderService.ExportShipOrderList', req, 'order.ExportShipOrderResp')
}

/**
 * 添加物流单信息
 * @export
 * @param {*} params
 * @returns
 */
export function addExpressNo(params) {
    const req = request.create('AddExpressNoRequest', params)
    return request('order', 'OrderService.AddExpressNo', req, 'order.AddExpressNoResponse')
}

/**
 * 上传物流单信息
 * @export
 * @param {*} params
 * @returns
 */
export function uploadExpressNo(params) {
    const req = request.create('UploadExpressNoRequest', params)
    return request('order', 'OrderService.UploadExpressNo', req, 'order.UploadExpressNoResponse')
}

/**
 * 客服订单查询
 * @export
 * @param {*} params
 * @returns
 */
export function customerOrderList(params) {
    const req = request.create('CustomerOrderListReq', params)
    return request('order', 'OrderService.CustomerOrderList', req, 'order.CustomerOrderListResp')
}

/**
 * 售后列表
 * @export
 * @param {*} params
 * @returns
 */
export function viewAfterList(params) {
    const req = request.create('ViewAfterListRequest', params)
    return request('order', 'AfterService.ViewAfterList', req, 'order.ViewAfterListResponse')
}


/**
 * 售后处理
 * @export
 * @param {*} params
 * @returns
 */
export function handlerAfter(params) {
    const req = request.create('HandlerAfterRequest', params)
    return request('order', 'AfterService.HandlerAfter', req, 'order.HandlerAfterResponse')
}

/**
 * 售后处理
 * @export
 * @param {*} params
 * @returns
 */
export function createAfter(params) {
    const req = request.create('CreateAfterRequest', params)
    return request('order', 'AfterService.CreateAfter', req, 'order.CreateAfterResponse')
}

/**
 * 拼团订单
 */
// 拼团订单列表
export function groupOrderList (params) {
    const req = request.create('GroupListRequest', params)
    return request('order', 'GroupService.GroupList', req, 'GroupListResponse')
}

 /** 售后原因查询(字典)
 * @export
 * @param {*} params
 * @returns
 */
export function afterReason(params) {
    const req = request.create('AfterReasonReq', params)
    return request('order', 'OrderService.AfterReason', req, 'order.AfterReasonResp')
}


/**
 * 出库单查询
 * @export
 * @param {*} params
 * @returns
 */
export function outOrderList(params) {
    const req = request.create('OutOrderListReq', params)
    return request('order', 'OrderService.OutOrderList', req, 'order.OutOrderListResp')
}


/**
 * 根据订单号获取其状态流
 * @export
 * @param {*} params
 * @returns
 */
export function OrderStatusFlow(params) {
    const req = request.create('OrderStatusFlowReq', params)
    return request('order', 'OrderService.OrderStatusFlow', req, 'order.OrderStatusFlowResp')
}

/**
 * 获取子单对应的信息，若是组合商品，展示组合信息
 * @export
 * @param {*} params
 * @returns
 */
export function SubOrders(params) {
    const req = request.create('SubOrdersReq', params)
    return request('order', 'OrderService.SubOrders', req, 'order.SubOrdersResp')
}

/**
 * 获取子单对应的信息，若是组合商品，展示组合信息
 * @export
 * @param {*} params
 * @returns
 */
export function DownloadAfterSalePage(params) {
    const req = request.create('AfterSalePageRequest', params)
    return request('order', 'AfterService.DownloadAfterSalePage', req, 'order.DownloadAfterSalePageResponse')
}
