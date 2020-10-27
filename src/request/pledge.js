import request from './request'
/**
 * 售后政策
 */
// 增加售后策略
export function addAfterSale (params) {
    console.log(params)
    const req = request.create('AddAfterSaleReq', params)
    return request('product', 'AfterSalePledgeService.AddAfterSale', req, 'AddAfterSaleResp')
}
// 更新售后策略
export function updateAfterSale (params) {
    console.log(params)
    const req = request.create('UpdateAfterSaleReq', params)
    return request('product', 'AfterSalePledgeService.UpdateAfterSale', req, 'UpdateAfterSaleResp')
}
// 获取售后策略
export function getAfterSale (params) {
    console.log(params)
    const req = request.create('GetAfterSaleReq', params)
    return request('product', 'AfterSalePledgeService.GetAfterSale', req, 'GetAfterSaleResp')
}
// 启用售后策略
export function startAfterSale (params) {
    console.log(params)
    const req = request.create('StartAfterSaleReq', params)
    return request('product', 'AfterSalePledgeService.StartAfterSale', req, 'StartAfterSaleResp')
}
// 停用售后策略
export function stopAfterSale (params) {
    console.log(params)
    const req = request.create('StopAfterSaleReq', params)
    return request('product', 'AfterSalePledgeService.StopAfterSale', req, 'StopAfterSaleResp')
}
// 分页查询售后策略
export function listAfterSale (params) {
    console.log(params)
    const req = request.create('ListAfterSaleReq', params)
    return request('product', 'AfterSalePledgeService.ListAfterSale', req, 'ListAfterSaleResp')
}
/**
 * 到货承诺
 */
// 增加到货承诺
export function addArrival (params) {
    console.log(params)
    const req = request.create('AddArrivalReq', params)
    return request('product', 'ArrivalPledgeService.AddArrival', req, 'AddArrivalResp')
}
// 编辑到货承诺
export function updateArrival (params) {
    console.log(params)
    const req = request.create('UpdateArrivalReq', params)
    return request('product', 'ArrivalPledgeService.UpdateArrival', req, 'UpdateArrivalResp')
}
// 获得到货承诺
export function getArrival (params) {
    console.log(params)
    const req = request.create('GetArrivalReq', params)
    return request('product', 'ArrivalPledgeService.GetArrival', req, 'GetArrivalResp')
}
// 启用到货承诺
export function startArrival (params) {
    console.log(params)
    const req = request.create('StartArrivalReq', params)
    return request('product', 'ArrivalPledgeService.StartArrival', req, 'StartArrivalResp')
}
// 停用到货承诺
export function stopArrival (params) {
    console.log(params)
    const req = request.create('StopArrivalReq', params)
    return request('product', 'ArrivalPledgeService.StopArrival', req, 'StopArrivalResp')
}
// 分页查询到货承诺
export function listArrival (params) {
    console.log(params)
    const req = request.create('ListArrivalReq', params)
    return request('product', 'ArrivalPledgeService.ListArrival', req, 'ListArrivalResp')
}
