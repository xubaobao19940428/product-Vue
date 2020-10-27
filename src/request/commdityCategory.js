import request from './request'

// 页面顶部四块品类数据
export function StatisticsTodayCategory (params) {
    const req = request.create('StatisticsTodayCategoryReq', params)
    return request('datahouse', 'StatisticsCategoryProductBossService.StatisticsTodayCategory', req, 'StatisticsTodayCategoryResp')
}

// 同步基础表
export function StatisticsCategoryProductBase (params) {
    const req = request.create('StatisticsCategoryProductBaseReq', params)
    return request('datahouse', 'StatisticsCategoryProductBossService.StatisticsCategoryProductBase', req, 'StatisticsCategoryProductBaseResp')
}

// 各品类销售详情
export function ShowCategorySaleDetail (params) {
    const req = request.create('ShowCategorySaleDetailReq', params)
    return request('datahouse', 'StatisticsCategoryProductBossService.ShowCategorySaleDetail', req, 'ShowCategorySaleDetailResp')
}

// 动销商品数据
export function GetMovableCategoryDetail (params) {
    const req = request.create('GetMovableCategoryDetailReq', params)
    return request('datahouse', 'StatisticsCategoryProductBossService.GetMovableCategoryDetail', req, 'GetMovableCategoryDetailResp')
}

// 动销商品用户数据
export function GetMovableUserDetail (params) {
    const req = request.create('GetMovableUserDetailReq', params)
    return request('datahouse', 'StatisticsCategoryProductBossService.GetMovableUserDetail', req, 'GetMovableUserDetailResp')
}

// 各品类访购情况
export function GetCateVisitDetail (params) {
    const req = request.create('GetCateVisitDetailReq', params)
    return request('datahouse', 'StatisticsCategoryProductBossService.GetCateVisitDetail', req, 'GetCateVisitDetailResp')
}

// 各品类复购情况
export function GetRepeatedBuyCateDetail (params) {
    const req = request.create('GetRepeatedBuyCateDetailReq', params)
    return request('datahouse', 'StatisticsCategoryProductBossService.GetRepeatedBuyCateDetail', req, 'GetRepeatedBuyCateDetailResp')
}

// 取消订单品类占比
export function GetCancelCategoryRate (params) {
    const req = request.create('GetCancelCategoryRateReq', params)
    return request('datahouse', 'StatisticsCategoryProductBossService.GetCancelCategoryRate', req, 'GetCancelCategoryRateResp')
}

// 退货品类占比
export function GetReturnCategoryRate (params) {
    const req = request.create('GetReturnCategoryRateReq', params)
    return request('datahouse', 'StatisticsCategoryProductBossService.GetReturnCategoryRate', req, 'GetReturnCategoryRateResp')
}

// 导出四个接口的数据生成excel
export function GetAllCategoryDetailToExcel (params) {
    const req = request.create('GetAllCategoryDetailToExcelReq', params)
    return request('datahouse', 'StatisticsCategoryProductBossService.GetAllCategoryDetailToExcel', req, 'GetAllCategoryDetailToExcelResp')
}