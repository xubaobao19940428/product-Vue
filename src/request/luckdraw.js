import request from './request'
/**
 * 抽奖助手
 */
// 添加活动
export function insertLuckDrawTemplate (params) {
    const req = request.create('LuckDrawTemplateAddReq', params)
    return request('promotion', 'LuckDrawTemplateBossService.InsertLuckDrawTemplate', req, 'LuckDrawTemplateAddResp')
}
// 修改活动
export function updateLuckDrawTemplate (params) {
    const req = request.create('LuckDrawTemplateUpdateReq', params)
    return request('promotion', 'LuckDrawTemplateBossService.UpdateLuckDrawTemplate', req, 'LuckDrawTemplateUpdateResp')
}
// 管理后台条件查询接口（分页）
export function listLuckDrawTemplate (params) {
    const req = request.create('LuckDrawTemplateListReq', params)
    return request('promotion', 'LuckDrawTemplateBossService.ListLuckDrawTemplate', req, 'LuckDrawTemplateListResp')
}
// 管理后台通过抽奖ID获取抽奖信息
export function getLuckDrawTemplate (params) {
    const req = request.create('GetLuckDrawTemplateReq', params)
    return request('promotion', 'LuckDrawTemplateBossService.GetLuckDrawTemplate', req, 'GetLuckDrawTemplateResp')
}
// 修改奖池奖品数量
export function updateLuckPrizeQuantity (params) {
    const req = request.create('UpdateLuckPrizeQuantityReq', params)
    return request('promotion', 'LuckDrawTemplateBossService.UpdateLuckPrizeQuantity', req, 'UpdateLuckPrizeQuantityResp')
}
// 查询奖池数据
export function queryLuckPrizeInfo (params) {
    const req = request.create('QueryLuckPrizeInfoReq', params)
    return request('promotion', 'LuckDrawTemplateBossService.QueryLuckPrizeInfo', req, 'QueryLuckPrizeInfoResp')
}
// 下载中奖者信息
export function downloadWinningUserInfo (params) {
    const req = request.create('DownloadWinningUserInfoReq', params)
    return request('promotion', 'LuckDrawTemplateBossService.DownloadWinningUserInfo', req, 'DownloadWinningUserInfoResp')
}