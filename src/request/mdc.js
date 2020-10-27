import request from './request'
/**
 *  首页统计
 * @export
 * @param {*} params
 * @returns
 */
// 订单交易数统计-首页表格
export function OrderTrade (params) {
    console.log(params)
    const req = request.create('OrderTradeReq', params)
    return request('datacenter', 'SummaryBossService.OrderTrade', req, 'summary.OrderTradeResp')
};
//  订单交易数统计-首页表格 下面的四块
export function OrderTradeCount (params) {
    console.log(params)
    const req = request.create('OrderTradeCountReq', params)
    return request('datacenter', 'SummaryBossService.OrderTradeCount', req, 'summary.OrderTradeCountResp')
};
//  平台订单状态 统计
export function PlatformOrderStatus (params) {
    console.log(params)
    const req = request.create('PlatformOrderStatusReq', params)
    return request('datacenter', 'SummaryBossService.PlatformOrderStatus', req, 'summary.PlatformOrderStatusResp')
};
//  订单交易数统计-统计折线图 上面的四块
export function OrderTradeChartCount (params) {
    console.log(params)
    const req = request.create('OrderTradeChartCountReq', params)
    return request('datacenter', 'SummaryBossService.OrderTradeChartCount', req, 'summary.OrderTradeChartCountResp')
};
//  订单交易数统计-统计折线图
export function OrderTradeChart (params) {
    console.log(params)
    const req = request.create('OrderTradeChartReq', params)
    return request('datacenter', 'SummaryBossService.OrderTradeChart', req, 'summary.OrderTradeChartResp')
};
// 商品信息统计
export function ProductInfo (params) {
    console.log(params)
    const req = request.create('ProductInfoReq', params)
    return request('datacenter', 'SummaryBossService.ProductInfo', req, 'summary.ProductInfoResp')
};
// 用户动态 折线图
export function userRegistLine (params) {
    console.log(params)
    const req = request.create('UserRegistLineReq', params)
    return request('datacenter', 'SummaryBossService.UserRegistLine', req, 'summary.UserRegistLineResp')
};
// 用户动态 折线图 左右侧数据
export function userRegistData (params) {
    console.log(params)
    const req = request.create('UserRegistDataReq', params)
    return request('datacenter', 'SummaryBossService.UserRegistData', req, 'summary.UserRegistDataResp')
};
