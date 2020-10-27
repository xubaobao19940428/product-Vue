import request from './request'

/**
 * 售后列表
 * @export
 * @param {*} params
 * @returns
 */
export function AfterSalePage(params) {
    console.log(params)
    const req = request.create('AfterSalePageRequest', params)
    return request('order', 'AfterService.AfterSalePage', req, 'AfterSalePageResponse')
};

/**
 * 售后详情
 * @export
 * @param {*} params
 * @returns
 */
export function AfterSaleInfo(params) {
    console.log(params)
    const req = request.create('AfterSaleInfoRequest', params)
    return request('order', 'AfterService.AfterSaleInfo', req, 'AfterSaleInfoResponse')
};

/**
 * 修改售后信息
 * @export
 * @param {*} params
 * @returns
 */
export function ModifyAfterSale(params) {
    console.log(params)
    const req = request.create('ModifyAfterSaleRequest', params)
    return request('order', 'AfterService.ModifyAfterSale', req, 'ModifyAfterSaleResponse')
};

/**
 * 标记退款成功
 * @export
 * @param {*} params
 * @returns
 */
export function RefundSuccess(params) {
    console.log(params)
    const req = request.create('RefundSuccessRequest', params)
    return request('order', 'AfterService.RefundSuccess', req, 'RefundSuccessResponse')
};

/**
 * 同意申请
 * @export
 * @param {*} params
 * @returns
 */
export function AuditPass(params) {
    console.log(params)
    const req = request.create('AuditPassRequest', params)
    return request('order', 'AfterService.AuditPass', req, 'AuditPassResponse')
};

/**
 * 批量通过
 * @export
 * @param {*} params
 * @returns
 */
export function BatchApproved(params) {
    console.log(params)
    const req = request.create('BatchApprovedRequest', params)
    return request('order', 'AfterService.BatchApproved', req, 'BatchApprovedResponse')
};

/**
 * 批量标记退款
 * @export
 * @param {*} params
 * @returns
 */
export function BatchRefundSuccess(params) {
    console.log(params)
    const req = request.create('BatchRefundSuccessRequest', params)
    return request('order', 'AfterService.BatchRefundSuccess', req, 'BatchRefundSuccessResponse')
};

/**
 * 延迟处理
 * @export
 * @param {*} params
 * @returns
 */
export function DelayProcessing(params) {
    console.log(params)
    const req = request.create('DelayProcessingRequest', params)
    return request('order', 'AfterService.DelayProcessing', req, 'DelayProcessingResponse')
};

/**
 * 拒绝申请
 * @export
 * @param {*} params
 * @returns
 */
export function RejectApply(params) {
    console.log(params)
    const req = request.create('RejectApplyRequest', params)
    return request('order', 'AfterService.RejectApply', req, 'RejectApplyResponse')
};

/**
 * 申请售后提示
 * @export
 * @param {*} params
 * @returns
 */
export function ApplyAfterSaleTips(params) {
    console.log(params)
    const req = request.create('ApplyAfterSaleTipsRequest', params)
    return request('order', 'AfterService.ApplyAfterSaleTips', req, 'ApplyAfterSaleTipsResponse')
};

/**
 * 通过售后提示
 * @export
 * @param {*} params
 * @returns
 */
export function PassAfterSaleTips(params) {
    console.log(params)
    const req = request.create('PassAfterSaleTipsRequest', params)
    return request('order', 'AfterService.PassAfterSaleTips', req, 'PassAfterSaleTipsResponse')
};

/**
 * 查询可售后订单商品
 * @export
 * @param {*} params
 * @returns
 */
export function GetAfterSaleProduct(params) {
    console.log(params)
    const req = request.create('GetAfterSaleProductRequest', params)
    return request('order', 'AfterService.GetAfterSaleProduct', req, 'GetAfterSaleProductResponse')
};

/**
 * 客服申请售后（除了cod有条件外,其它都可以申请售后）
 * @export
 * @param {*} params
 * @returns
 */
export function ApplyForRefundV1(params) {
    console.log(params)
    const req = request.create('ApplyForRefundV1Req', params)
    return request('order', 'AfterService.ApplyForRefundV1', req, 'ApplyForRefundV1Resp')
};

/**
 * 后操作校验接口（主要用于发起售后和售后审核）
 * @export
 * @param {*} params
 * @returns
 */
export function ReturnOperValid(params) {
    console.log(params)
    const req = request.create('ReturnOperValidReq', params)
    return request('order', 'AfterService.ReturnOperValid', req, 'ReturnOperValidResp')
};

/**
 * 获取用户银行账户-列表，一个用户有多个银行账户
 * @export
 * @param {*} params
 * @returns
 */
export function GetUserBankList(params) {
    console.log(params)
    const req = request.create('GetUserBankListReq', params)
    return request('polypay', 'WithdrawalBossService.GetUserBankList', req, 'polypay.GetUserBankListResp')
}

/**
 * 计算售后价格
 * @export
 * @param {*} params
 * @returns
 */
export function ComputeReturnAmount(params) {
    console.log(params)
    const req = request.create('ComputeReturnAmountReq', params)
    return request('order', 'AfterService.ComputeReturnAmount', req, 'ComputeReturnAmountResp')
}

/**
 * 下载售后列表
 * @export
 * @param {*} params
 * @returns
 */
export function DownloadAfterSalePage(params) {
    console.log(params)
    const req = request.create('AfterSalePageRequest', params)
    return request('order', 'AfterService.DownloadAfterSalePage', req, 'DownloadAfterSalePageResponse')
}

/**
 * 获取所有退款原因
 * @export
 * @param {*} params
 * @returns
 */
export function AllReturnReason(params) {
    console.log(params)
    const req = request.create('ReturnReasonReq', params)
    return request('order', 'AfterService.AllReturnReason', req, 'ReturnReasonResp')
}