import request from './request'

/**
 * 大奖订单
 * @param {*} params 
 */

// 查询订单
export function findOrder(params) {
    console.log(params)
    const req = request.create('FindOrderReq', params)
    return request('marketing', 'SuperLuckyOrderBossService.FindOrder', req, 'FindOrderResp')
};

/**
 * 抽大奖
 */
// 获取大奖的设置内容
export function findBigPrizeSetting(params) {
    console.log(params)
    const req = request.create('FindBigPrizeSettingReq', params)
    return request('marketing', 'SuperLuckyBigPrizeSettingBossService.FindBigPrizeSetting', req, 'FindBigPrizeSettingResp')
};
// 保存大奖的设置内容
export function saveBigPrizeSetting(params) {
    console.log(params)
    const req = request.create('SaveBigPrizeSettingReq', params)
    return request('marketing', 'SuperLuckyBigPrizeSettingBossService.SaveBigPrizeSetting', req, 'SaveBigPrizeSettingResp')
};
// 查询设置的指定用户中奖列表
export function findBigPrizeUser(params) {
    console.log(params)
    const req = request.create('FindBigPrizeUserReq', params)
    return request('marketing', 'SuperLuckyBigPrizeSettingBossService.FindBigPrizeUser', req, 'FindBigPrizeUserResp')
};
// 添加大奖中奖用户
export function addBigPrizeUser(params) {
    console.log(params)
    const req = request.create('AddBigPrizeUserReq', params)
    return request('marketing', 'SuperLuckyBigPrizeSettingBossService.AddBigPrizeUser', req, 'AddBigPrizeUserResp')
};
// 失效大奖中奖用户
export function disableBigPrizeUser(params) {
    console.log(params)
    const req = request.create('DisableBigPrizeUserReq', params)
    return request('marketing', 'SuperLuckyBigPrizeSettingBossService.DisableBigPrizeUser', req, 'DisableBigPrizeUserResp')
};


/**
 * 商品设置
 * @param {} params 
 */
// 模板商品设置
export function addProductCommonSet(params) {
    console.log(params)
    const req = request.create('AddProductCommonSetReq', params)
    return request('marketing', 'SuperLuckyProductBossService.AddProductCommonSet', req, 'AddProductCommonSetResp')
};
// 获取模板商品设置内容
export function queryProductCommonSet(params) {
    console.log(params)
    const req = request.create('ProductCommonSetReq', params)
    return request('marketing', 'SuperLuckyProductBossService.QueryProductCommonSet', req, 'ProductCommonSetResp')
};

/**
 * 大奖商品信息
 * @param {*} params 
 */
// 大奖商品列表
export function listSuperLuckProductWithPage(params) {
    console.log(params)
    const req = request.create('ListSuperLuckProductWithPageReq', params)
    return request('marketing', 'SuperLuckyProductBossService.ListSuperLuckProductWithPage', req, 'ListSuperLuckProductWithPageResp')
};
// 获取商品SKU信息
export function listSuperLuckProductSkuRule(params) {
    console.log(params)
    const req = request.create('ListSuperLuckProductSkuRuleReq', params)
    return request('marketing', 'SuperLuckyProductBossService.ListSuperLuckProductSkuRule', req, 'ListSuperLuckProductSkuRuleResp')
};
// 编辑商品SKU信息
export function updateSuperLuckProductSkuRule(params) {
    console.log(params)
    const req = request.create('UpdateSuperLuckProductSkuRuleReq', params)
    return request('marketing', 'SuperLuckyProductBossService.UpdateSuperLuckProductSkuRule', req, 'UpdateSuperLuckProductSkuRuleResp')
};
// 删除夺宝商品
export function deleteSuperLuckProduct(params) {
    console.log(params)
    const req = request.create('DeleteSuperLuckProductReq', params)
    return request('marketing', 'SuperLuckyProductBossService.DeleteSuperLuckProduct', req, 'DeleteSuperLuckProductResp')
};
// 添加夺宝商品
export function addSuperLuckProduct(params) {
    console.log(params)
    const req = request.create('AddSuperLuckProductReq', params)
    return request('marketing', 'SuperLuckyProductBossService.AddSuperLuckProduct', req, 'AddSuperLuckProductResp')
};
// 批量添加夺宝商品
export function batchAddSuperLuckProduct(params) {
    console.log(params)
    const req = request.create('BatchAddSuperLuckProductReq', params)
    return request('marketing', 'SuperLuckyProductBossService.BatchAddSuperLuckProduct', req, 'BatchAddSuperLuckProductResp')
};
// 排序
export function changeSuperLuckProductSort(params) {
    console.log(params)
    const req = request.create('ChangeSuperLuckProductSortReq', params)
    return request('marketing', 'SuperLuckyProductBossService.ChangeSuperLuckProductSort', req, 'ChangeSuperLuckProductSortResp')
};