import request from './request'

/**
 * 客服设置服务状态
 */
export function GetDataCenterTypeData (params) {
    const req = request.create('GetDataCenterTypeDataReq', params)
    return request('datahouse', 'DataCenterTypeService.GetDataCenterTypeData', req, 'GetDataCenterTypeDataResp')
}

/**
 * 拼团商品数据
 */
export function GetGroupProductData (params) {
    const req = request.create('GetGroupBuyProductInfoReq', params)
    return request('datahouse', 'DataHouseGroupDataService.GetGroupBuyProductInfo', req, 'GetGroupBuyProductInfoResp')
}

/**
 * 拼团关键数据
 */
export function GetGroupImportantData (params) {
    const req = request.create('GetGroupImportantDataReq', params)
    return request('datahouse', 'DataHouseGroupDataService.GetGroupImportantData', req, 'GetGroupImportantDataResp')
}

/**
 * PO完成率監控
 */
export function PoCompletionRate (params) {
    const req = request.create('PoCompletionRateReq', params)
    return request('datahouse', 'ErpPoCompletionRateService.PoCompletionRate', req, 'PoCompletionRateResp')
}

/**
 * PO未完成采購單列表
 */
export function PoIncompleteOrderDetail (params) {
    const req = request.create('PoIncompleteOrderDetailReq', params)
    return request('datahouse', 'ErpPoCompletionRateService.PoIncompleteOrderDetail', req, 'PoIncompleteOrderDetailResp')
}