import request from './request'

/**
 * 订单页面 - 顶部简单数据显示
 * @export
 * @param {*} params
 * @returns
 */
export function simpleDataDisplay(params) {
    const req = request.create('SimpleDataDisplayReq', params)
    return request('datahouse', 'OrderSalesBossService.SimpleDataDisplay', req, 'datahouse.SimpleDataDisplayResp')
};

/**
 * 订单页面 - 数据折线图
 * @export
 * @param {*} params
 * @returns
 */
export function orderBrokenLineGraph(params) {
    const req = request.create('OrderBrokenLineGraphReq', params)
    return request('datahouse', 'OrderSalesBossService.OrderBrokenLineGraph', req, 'datahouse.OrderBrokenLineGraphResp')
};

/**
 * 订单页面 - 订单数量商品占比
 * @export
 * @param {*} params
 * @returns
 */
export function orderProductTypeProportion(params) {
    const req = request.create('OrderProductTypeProportionReq', params)
    return request('datahouse', 'OrderSalesBossService.OrderProductTypeProportion', req, 'datahouse.OrderProductTypeProportionResp')
};

/**
 * 订单页面 - 购买频次分布
 * @export
 * @param {*} params
 * @returns
 */
export function orderFrequency(params) {
    const req = request.create('OrderProductTypeProportionReq', params)
    return request('datahouse', 'OrderSalesBossService.OrderFrequency', req, 'datahouse.OrderFrequencyResp')
};

/**
 * 订单页面 - 下单金额分布
 * @export
 * @param {*} params
 * @returns
 */
export function orderAmountDistribution(params) {
    const req = request.create('OrderAmountDistributionReq', params)
    return request('datahouse', 'OrderSalesBossService.OrderAmountDistribution', req, 'datahouse.OrderAmountDistributionResp')
};


/**
 * 订单页面 - 商品GMV占比
 * @export
 * @param {*} params
 * @returns
 */
export function productGMVPercentGraph(params) {
    const req = request.create('ProductGMVPercentGraphReq', params)
    return request('datahouse', 'OrderSalesBossService.ProductGMVPercentGraph', req, 'datahouse.ProductGMVPercentGraphResp')
};

/**
 * 订单页面 - 站点GMV占比
 * @export
 * @param {*} params
 * @returns
 */
export function siteGMVPercentGraph(params) {
    const req = request.create('SiteGMVPercentGraphReq', params)
    return request('datahouse', 'OrderSalesBossService.SiteGMVPercentGraph', req, 'datahouse.SiteGMVPercentGraphResp')
};

/**
 * 订单页面 - 爆款商品统计
 * @export
 * @param {*} params
 * @returns
 */
export function orderActivityProductData(params) {
    const req = request.create('OrderActivityProductDataReq', params)
    return request('datahouse', 'OrderSalesBossService.OrderActivityProductData', req, 'datahouse.OrderActivityProductDataResp')
};

/**
 * 商品漏斗 - 平台商品漏斗
 * @export
 * @param {*} params
 * @returns
 */
export function getProductFunnelViewData(params) {
    const req = request.create('GetProductFunnelViewDataReq', params)
    return request('datahouse', 'DataCenterFunnelService.GetProductFunnelViewData', req, 'datahouse.GetProductFunnelViewDataResp')
};

/**
 * 商品漏斗 - 转化率趋势
 * @export
 * @param {*} params
 * @returns
 */
export function getProductFunnelViewTradeData(params) {
    const req = request.create('GetProductFunnelViewTradeDataReq', params)
    return request('datahouse', 'DataCenterFunnelService.GetProductFunnelViewTradeData', req, 'datahouse.GetProductFunnelViewTradeDataResp')
};

/**
 * 商品漏斗 - 单品详细漏斗
 * @export
 * @param {*} params
 * @returns
 */
export function getProductViewDataDetail(params) {
    const req = request.create('GetProductViewDataDetailReq', params)
    return request('datahouse', 'DataCenterFunnelService.GetProductViewDataDetail', req, 'datahouse.GetProductViewDataDetailResp')
};

/**
 * 所有数据中心枚举返回
 * @export
 * @param {*} params
 * @returns
 */
export function getDataCenterTypeData(params) {
    const req = request.create('GetDataCenterTypeDataReq', params)
    return request('datahouse', 'DataCenterTypeService.GetDataCenterTypeData', req, 'datahouse.GetDataCenterTypeDataResp')
};

/**
 * 核心指標列表
 * @export
 * @param {*} params
 * @returns
 */
export function coreIndicatorDataList(params) {
    const req = request.create('CoreIndicatorDataListReq', params)
    return request('datahouse', 'CoreIndicatorBossService.CoreIndicatorDataList', req, 'datahouse.CoreIndicatorDataListResp')
};

/**
 * 全平台GMV饼图
 * @export
 * @param {*} params
 * @returns
 */
export function coreIndicatorPlatformGMVPieChart(params) {
    const req = request.create('CoreIndicatorPlatformGMVPieChartReq', params)
    return request('datahouse', 'CoreIndicatorBossService.CoreIndicatorPlatformGMVPieChart', req, 'datahouse.CoreIndicatorPlatformGMVPieChartResp')
};

/**
 * 普货GMV饼图
 * @export
 * @param {*} params
 * @returns
 */
export function coreIndicatorNormalGMVPieChart(params) {
    const req = request.create('CoreIndicatorNormalGMVPieChartReq', params)
    return request('datahouse', 'CoreIndicatorBossService.CoreIndicatorNormalGMVPieChart', req, 'datahouse.CoreIndicatorNormalGMVPieChartResp')
};
// 获取埋点统计信息
export function getBuryingPointInfo (params) {
    const req = request.create('GetBuryingPointInfoReq', params)
    return request('datahouse', 'BuryingPointSearchService.GetBuryingPointInfo', req, 'datahouse.GetBuryingPointInfoResp')
}
// 获取埋点字段统计信息
export function getBuryingPointParamInfo (params) {
    const req = request.create('GetBuryingPointParamInfoReq', params)
    return request('datahouse', 'BuryingPointSearchService.GetBuryingPointParamInfo', req, 'datahouse.GetBuryingPointParamInfoResp')
}
// 获取埋点字段统计信息
export function getBuryingPointParamValueInfo (params) {
    const req = request.create('GetBuryingPointParamValueInfoReq', params)
    return request('datahouse', 'BuryingPointSearchService.GetBuryingPointParamValueInfo', req, 'datahouse.GetBuryingPointParamValueInfoResp')
}
