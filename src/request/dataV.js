import request from './request'

/**
 * 大屏数据
 * @export
 * @param {*} params
 * @returns
 */
// GMV看板，今日交易數據
export function BigScreenGmvStats (params) {
    const req = request.create('BigScreenGmvStatsReq', params)
    return request('datahouse', 'BigScreenStatisticsService.BigScreenGmvStats', req, 'datahouse.BigScreenGmvStatsResp', true)
}
// 用戶活躍數據
export function BigScreenDauStats (params) {
    const req = request.create('BigScreenDauStatsReq', params)
    return request('datahouse', 'BigScreenStatisticsService.BigScreenDauStats', req, 'datahouse.BigScreenDauStatsResp', true)
}
// 转化率接口
export function BigScreenConversion (params) {
    const req = request.create('BigScreenConversionFunnelReq', params)
    return request('datahouse', 'BigScreenStatisticsService.BigScreenConversionFunnel', req, 'datahouse.BigScreenConversionFunnelResp', true)
}
// 拉取产品接口
export function BigScreenAcquisition (params) {
    const req = request.create('BigScreenAcquisitionStatsReq', params)
    return request('datahouse', 'BigScreenStatisticsService.BigScreenAcquisitionStats', req, 'datahouse.BigScreenAcquisitionStatsResp', true)
}
// Gam今日数据
export function BigScreenModuleStats (params) {
    const req = request.create('BigScreenModuleStatsReq', params)
    return request('datahouse', 'BigScreenStatisticsService.BigScreenModuleStats', req, 'datahouse.BigScreenModuleStatsResp', true)
}
// top5商品
export function BigScreenProductSale (params) {
    const req = request.create('BigScreenProductSaleReq', params)
    return request('datahouse', 'BigScreenStatisticsService.BigScreenProductSale', req, 'datahouse.BigScreenProductSaleResp', true)
}
// 今日注册数及ps数
export function BigScreenMemberStats (params) {
    const req = request.create('BigScreenMemberStatsReq', params)
    return request('datahouse', 'BigScreenStatisticsService.BigScreenMemberStats', req, 'datahouse.BigScreenMemberStatsResp', true)
}

/**
 * 数据概览部分接口
 * @export
 * @param {*} params
 * @returns
 */
//头部四个card数据
export function OverviewTodayWatch(params){
    const req = request.create('OverviewTodayWatchBoardReq',params)
    return request('datahouse','DataOverviewPageService.OverviewTodayWatchBoard',req,'datahouse.OverviewTodayWatchBoardResp')
}
//今日数据
export function OverviewTodayTable(params){
    const req = request.create('OverviewTodayTableReq',params)
    return request('datahouse','DataOverviewPageService.OverviewTodayTable',req,'datahouse.OverviewTodayTableResp')
}
//小时增长订单
export function OverviewHourlyIncrease(params){
    const req = request.create('OverviewHourlyIncreaseReq',params)
    return request('datahouse','DataOverviewPageService.OverviewHourlyIncrease',req,'datahouse.OverviewHourlyIncreaseResp')
}
//普货商品Top30榜
export function OverviewOrdinaryGoods(params){
    const req = request.create('OverviewOrdinaryGoodsReq',params)
    return request('datahouse','DataOverviewPageService.OverviewOrdinaryGoodsRank',req,'datahouse.OverviewOrdinaryGoodsResp')
}
//增长趋势
export function OverviewTrendGrap(params){
    const req = request.create('OverviewTrendGraphReq',params)
    return request('datahouse','DataOverviewPageService.OverviewTrendGraph',req,'datahouse.OverviewTrendGraphResp')
}
//销售统计
export function OverviewYearlySales(params){
    const req = request.create('OverviewYearlySalesReq',params)
    return request('datahouse','DataOverviewPageService.OverviewYearlySales',req,'datahouse.OverviewYearlySalesResp')
}
//平台数据总揽
export function OverviewPlatformWide(params){
    const req = request.create('OverviewPlatformWideDataReq',params)
    return request('datahouse','DataOverviewPageService.OverviewPlatformWideData',req,'datahouse.OverviewPlatformWideDataResp')
}

/**
 * 商品分析接口
 * @export
 * @param {*} params
 * @returns
 */
//普货分析接口
export function OrdinaryProductAnalysis(params){
    const req = request.create('OrdinaryProductAnalysisReq',params)
    return request('datahouse','ProductAnalysisService.OrdinaryProductAnalysis',req,'datahouse.OrdinaryProductAnalysisResp')
}
//获取商品一级类目
export function GetBackendLevelOneCategory(params){
    const req = request.create('GetBackendLevelOneCategoryReq',params)
    return request('datahouse','ProductAnalysisService.GetBackendLevelOneCategory',req,'datahouse.GetBackendLevelOneCategoryResp')
}
//商品趋势分析
export function ProductTrendAnalysis(params){
    const req = request.create('ProductTrendAnalysisReq',params)
    return request('datahouse','ProductAnalysisService.ProductTrendAnalysis',req,'datahouse.ProductTrendAnalysisResp')
}
//商品销售详情
export function ProductSalesDetail(params){
    const req = request.create('ProductSalesDetailReq',params)
    return request('datahouse','ProductAnalysisService.ProductSalesDetail',req,'datahouse.ProductSalesDetailResp')
}
//商品价格带
export function PriceBrandAnalysis(params){
    const req = request.create('PriceBrandAnalysisReq',params)
    return request('datahouse','ProductAnalysisService.PriceBrandAnalysis',req,'datahouse.PriceBrandAnalysisResp')
}
//消息接口
export function ProductAnalysisBroadcast(params){
    const req = request.create('ProductAnalysisBroadcastReq',params)
    return request('datahouse','ProductAnalysisService.ProductAnalysisBroadcast',req,'datahouse.ProductAnalysisBroadcastResp')
}
/**
 * 履约全流程监控
 * @export
 * @param {*} params
 * @returns
 */
//so指标
export function ErpSoCriticalIndicator(params){
    const req = request.create('ErpSoCriticalIndicatorReq',params)
    return request('datahouse','ErpTimelinessService.ErpSoCriticalIndicator',req,'datahouse.ErpSoCriticalIndicatorResp')
}
//so异常数据指标
export function ErpSoAbnormalDataGraph(params){
    const req = request.create('ErpSoAbnormalDataGraphReq',params)
    return request('datahouse','ErpTimelinessService.ErpSoAbnormalDataGraph',req,'datahouse.ErpSoAbnormalDataGraphResp')
}
//宅配实效监控
export function ErpDeliveryTimeliness(params){
    const req = request.create('ErpDeliveryTimelinessReq',params)
    return request('datahouse','ErpTimelinessService.ErpDeliveryTimeliness',req,'datahouse.ErpDeliveryTimelinessResp')
}
//po指标
export function ErpPoCriticalIndicator(params){
    const req = request.create('ErpPoCriticalIndicatorReq',params)
    return request('datahouse','ErpTimelinessService.ErpPoCriticalIndicator',req,'datahouse.ErpPoCriticalIndicatorResp')
}
//PO异常数据图表
export function ErpPoAbnormalDataGraph(params){
    const req = request.create('ErpPoAbnormalDataGraphReq',params)
    return request('datahouse','ErpTimelinessService.ErpPoAbnormalDataGraph',req,'datahouse.ErpPoAbnormalDataGraphResp')
}