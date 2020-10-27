import request from './request'
/**
 * 热词服务
 */
// 添加热词
export function addHotWord (params) {
    const req = request.create('AddHotWordReq', params)
    return request('promotion', 'HotWordService.AddHotWord', req, 'AddHotWordResp')
}
// 编辑热词
export function updateHotWord (params) {
    const req = request.create('UpdateHotWordReq', params)
    return request('promotion', 'HotWordService.UpdateHotWord', req, 'UpdateHotWordResp')
}
// 删除热词
export function deleteHotWord (params) {
    const req = request.create('DeleteHotWordReq', params)
    return request('promotion', 'HotWordService.DeleteHotWord', req, 'DeleteHotWordResp')
}
// 热词设置排序
export function resortHotWord (params) {
    const req = request.create('SetHotWordSortReq', params)
    return request('promotion', 'HotWordService.SetHotWordSort', req, 'SetHotWordSortResp')
}
// 获取热词列表
export function getList (params) {
    const req = request.create('GetHotWordListReq', params)
    return request('promotion', 'HotWordService.GetHotWordList', req, 'GetHotWordListResp')
}

/**
 * 获取商品限购
 * @export
 * @param {*} params
 * @returns
 */
export function listPurchaseLimitConfig(params) {
    console.log(params)
    const req = request.create('ListPurchaseLimitConfigReq', params)
    return request('promotion', 'PurchaseLimitService.ListPurchaseLimitConfig', req, 'promotion.ListPurchaseLimitConfigResp')
}

/**
 * 添加商品限购
 * @export
 * @param {*} params
 * @returns
 */
export function addPurchaseLimitConfig(params) {
    console.log(params)
    const req = request.create('AddPurchaseLimitConfigReq', params)
    return request('promotion', 'PurchaseLimitService.AddPurchaseLimitConfig', req, 'promotion.AddPurchaseLimitConfigResp')
}


/**
 * 更新商品限购
 * @export
 * @param {*} params
 * @returns
 */
export function updatePurchaseLimitConfig(params) {
    console.log(params)
    const req = request.create('UpdatePurchaseLimitConfigReq', params)
    return request('promotion', 'PurchaseLimitService.UpdatePurchaseLimitConfig', req, 'promotion.UpdatePurchaseLimitConfigResp')
}

/**
 * 删除商品限购
 * @export
 * @param {*} params
 * @returns
 */
export function deletePurchaseLimitConfig(params) {
    console.log(params)
    const req = request.create('DeletePurchaseLimitConfigReq', params)
    return request('promotion', 'PurchaseLimitService.DeletePurchaseLimitConfig', req, 'promotion.DeletePurchaseLimitConfigResp')
}



/**
 * 获取商品限购
 * @export
 * @param {*} params
 * @returns
 */
export function listProductLiveConfigReq(params) {
    console.log(params)
    const req = request.create('ListProductLiveConfigReq', params)
    return request('promotion', 'ProductLiveService.ListProductLiveConfig', req, 'promotion.ListProductLiveConfigResp')
}

/**
 * 添加商品直播配置
 * @export
 * @param {*} params
 * @returns
 */
export function addProductLiveConfig(params) {
    console.log(params)
    const req = request.create('AddProductLiveConfigReq', params)
    return request('promotion', 'ProductLiveService.AddProductLiveConfig', req, 'promotion.AddProductLiveConfigResp')
}


/**
 * 更新商品限购
 * @export
 * @param {*} params
 * @returns
 */
export function updateProductLiveConfig(params) {
    console.log(params)
    const req = request.create('UpdateProductLiveConfigReq', params)
    return request('promotion', 'ProductLiveService.UpdateProductLiveConfig', req, 'promotion.UpdateProductLiveConfigResp')
}

/**
 * 删除商品限购
 * @export
 * @param {*} params
 * @returns
 */
export function deleteProductLiveConfig(params) {
    console.log(params)
    const req = request.create('DeleteProductLiveConfigReq', params)
    return request('promotion', 'ProductLiveService.DeleteProductLiveConfig', req, 'promotion.DeleteProductLiveConfigResp')
}

/**
 * 闪屏广告,banner
 */

// 列表
export function fetchList (params) {
    console.log(params)
    const req = request.create('ListBannerReq', params)
    return request('promotion', 'BannerBossService.ListBanner', req, 'ListBannerResp')
}
// 新增编辑
export function fetchSaveData (params) {
    console.log(params)
    const req = request.create('BannerSaveReq', params)
    return request('promotion', 'BannerBossService.SaveBanner', req, 'BannerSaveResp')
}
// 批量删除
export function fetchBatchDelete (params) {
    console.log(params)
    const req = request.create('BatchDeleteBannerReq', params)
    return request('promotion', 'BannerBossService.BatchDeleteBanner', req, 'BatchDeleteBannerResp')
}
// 删除
export function fetchDelete (params) {
    console.log(params)
    const req = request.create('DeleteBannerReq', params)
    return request('promotion', 'BannerBossService.DeleteBanner', req, 'DeleteBannerResp')
}
// 排序
export function fetchChangeSort (params) {
    console.log(params)
    const req = request.create('ChangeBannerSortReq', params)
    return request('promotion', 'BannerBossService.ChangeBannerSort', req, 'ChangeBannerSortResp')
}

/**
 * 腰封，平台广告位
 */
// 保存
export function saveGirdle (params) {
    console.log(params)
    const req = request.create('GirdleSaveReq', params)
    return request('promotion', 'GirdleBossService.SaveGirdle', req, 'GirdleSaveResp')
}
// 分页查询
export function girdleAdList (params) {
    console.log(params)
    const req = request.create('ListGirdleReq', params)
    return request('promotion', 'GirdleBossService.ListGirdle', req, 'ListGirdleResp')
}
// 批量删除
export function batchDeleteGirdle (params) {
    console.log(params)
    const req = request.create('BatchDeleteGirdleReq', params)
    return request('promotion', 'GirdleBossService.BatchDeleteGirdle', req, 'BatchDeleteGirdleResp')
}
// 单个删除
export function deleteGirdle (params) {
    console.log(params)
    const req = request.create('DeleteGirdleReq', params)
    return request('promotion', 'GirdleBossService.DeleteGirdle', req, 'DeleteGirdleResp')
}
// 单个删除
export function girdleAdSort (params) {
    console.log(params)
    const req = request.create('ChangeGirdleSortReq', params)
    return request('promotion', 'GirdleBossService.ChangeGirdleSort', req, 'ChangeGirdleSortResp')
}

/**
 *营销Card，广告Card
 */
// 编辑
export function SaveBoxcard (params) {
    console.log(params)
    const req = request.create('BoxcardSaveReq', params)
    return request('promotion', 'BoxcardBossService.SaveBoxcard', req, 'BoxcardSaveResp')
}
// 删除
export function BatchDeleteBoxcard (params) {
    console.log(params)
    const req = request.create('BatchDeleteBoxcardReq', params)
    return request('promotion', 'BoxcardBossService.BatchDeleteBoxcard', req, 'BatchDeleteBoxcardResp')
}
// 列表
export function ListBoxcard (params) {
    console.log(params)
    const req = request.create('ListBoxcardReq', params)
    return request('promotion', 'BoxcardBossService.ListBoxcard', req, 'ListBoxcardResp')
}
// 卡片商品关系搜索
export function ListProducts (params) {
    console.log(params)
    const req = request.create('ListProductsReq', params)
    return request('promotion', 'BoxcardBossService.ListProducts', req, 'ListProductsResp')
}
// 新增商品关系
export function InsetProducts (params) {
    console.log(params)
    const req = request.create('InsetProductsReq', params)
    return request('promotion', 'BoxcardBossService.InsetProducts', req, 'InsetProductsResp')
}
// 批量删除商品关系
export function BatchDeleteProducts (params) {
    console.log(params)
    const req = request.create('BatchDeleteProductsReq', params)
    return request('promotion', 'BoxcardBossService.BatchDeleteProducts', req, 'BatchDeleteProductsResp')
}
// 改变商品排序
export function ProductsSortChange (params) {
    console.log(params)
    const req = request.create('ProductsSortChangeReq', params)
    return request('promotion', 'BoxcardBossService.ProductsSortChange', req, 'ProductsSortChangeResp')
}
// 排序
export function BoxcardSortChange (params) {
    console.log(params)
    const req = request.create('BoxcardSortChangeReq', params)
    return request('promotion', 'BoxcardBossService.BoxcardSortChange', req, 'BoxcardSortChangeResp')
}

/**
 * 弹屏广告
 */
// 新增
export function addBombScreen (params) {
    console.log(params)
    const req = request.create('AddBombScreenReq', params)
    return request('promotion', 'BombScreenService.AddBombScreen', req, 'AddBombScreenResp')
}
// 编辑
export function updateBombScreen (params) {
    console.log(params)
    const req = request.create('UpdateBombScreenReq', params)
    return request('promotion', 'BombScreenService.UpdateBombScreen', req, 'UpdateBombScreenResp')
}
// 删除
export function deleteBombScreen (params) {
    console.log(params)
    const req = request.create('DeleteBombScreenReq', params)
    return request('promotion', 'BombScreenService.DeleteBombScreen', req, 'DeleteBombScreenResp')
}
// 改变弹屏广告状态
export function changeBombScreenStatus (params) {
    console.log(params)
    const req = request.create('ChangeBombScreenStatusReq', params)
    return request('promotion', 'BombScreenService.ChangeBombScreenStatus', req, 'ChangeBombScreenStatusResp')
}
// 列表
export function getBombScreen (params) {
    console.log(params)
    const req = request.create('GetBombScreenReq', params)
    return request('promotion', 'BombScreenService.GetBombScreen', req, 'GetBombScreenResp')
}

/**
 * 服务文案
 */
// 新增
export function insertCopyWrite (params) {
    console.log(params)
    const req = request.create('InsertCopyWriteReq', params)
    return request('promotion', 'ServiceCopyWriteService.InsertCopyWrite', req, 'InsertCopyWriteResp')
}
// 更新
export function updateCopyWrite (params) {
    console.log(params)
    const req = request.create('UpdateCopyWriteReq', params)
    return request('promotion', 'ServiceCopyWriteService.UpdateCopyWrite', req, 'UpdateCopyWriteResp')
}
// 删除
export function deleteCopyWrite (params) {
    console.log(params)
    const req = request.create('DeleteCopyWriteReq', params)
    return request('promotion', 'ServiceCopyWriteService.DeleteCopyWrite', req, 'DeleteCopyWriteResp')
}
// 列表
export function listCopyWrite (params) {
    console.log(params)
    const req = request.create('ListCopyWriteReq', params)
    return request('promotion', 'ServiceCopyWriteService.ListCopyWrite', req, 'ListCopyWriteResp')
}
// 排序
export function changeCopyWriteSort (params) {
    console.log(params)
    const req = request.create('ChangeCopyWriteSortReq', params)
    return request('promotion', 'ServiceCopyWriteService.ChangeCopyWriteSort', req, 'ChangeCopyWriteSortResp')
}

/**
 * 背景主图设置
 */
// 获取列表
export function getBackGroundInfo (params) {
    console.log(params)
    const req = request.create('GetBackGroundInfoReq', params)
    return request('promotion', 'BackGroundInfoBossService.GetBackGroundInfo', req, 'GetBackGroundInfoResp')
}
// 新增
export function updateBackGroundInfo (params) {
    console.log(params)
    const req = request.create('UpdateBackGroundInfoReq', params)
    return request('promotion', 'BackGroundInfoBossService.UpdateBackGroundInfo', req, 'UpdateBackGroundInfoResp')
}

/**
 * 功能区
 */
// 新增
export function insertFunctionArea (params) {
    console.log(params)
    const req = request.create('InsertFunctionAreaReq', params)
    return request('promotion', 'FunctionAreaBossService.InsertFunctionArea', req, 'InsertFunctionAreaResp')
}
// 编辑
export function updateFunctionArea (params) {
    console.log(params)
    const req = request.create('UpdateFunctionAreaReq', params)
    return request('promotion', 'FunctionAreaBossService.UpdateFunctionArea', req, 'UpdateFunctionAreaResp')
}
// 删除
export function deleteFunctionArea (params) {
    console.log(params)
    const req = request.create('DeleteFunctionAreaReq', params)
    return request('promotion', 'FunctionAreaBossService.DeleteFunctionArea', req, 'DeleteFunctionAreaResp')
}
// 列表
export function listFunctionArea (params) {
    console.log(params)
    const req = request.create('ListFunctionAreaReq', params)
    return request('promotion', 'FunctionAreaBossService.ListFunctionArea', req, 'ListFunctionAreaResp')
}
// 排序功能区
export function sortFunctionArea (params) {
    console.log(params)
    const req = request.create('SortFunctionAreaReq', params)
    return request('promotion', 'FunctionAreaBossService.SortFunctionArea', req, 'SortFunctionAreaResp')
}

/**
 * 宫格
 */
// 新增
export function InsertMarketingGrid (params) {
    console.log(params)
    const req = request.create('InsertMarketingGridReq', params)
    return request('promotion', 'MarketingGridBossService.InsertMarketingGrid', req, 'InsertMarketingGridResp')
}
// 新增
export function UpdateMarketingGrid (params) {
    console.log(params)
    const req = request.create('UpdateMarketingGridReq', params)
    return request('promotion', 'MarketingGridBossService.UpdateMarketingGrid', req, 'UpdateMarketingGridResp')
}
// 删除
export function DeleteMarketingGrid (params) {
    console.log(params)
    const req = request.create('DeleteMarketingGridReq', params)
    return request('promotion', 'MarketingGridBossService.DeleteMarketingGrid', req, 'DeleteMarketingGridResp')
}
// 列表
export function ListMarketingGrid (params) {
    console.log(params)
    const req = request.create('ListMarketingGridReq', params)
    return request('promotion', 'MarketingGridBossService.ListMarketingGrid', req, 'ListMarketingGridResp')
}
// 排序
export function SortMarketingGrid (params) {
    console.log(params)
    const req = request.create('SortMarketingGridReq', params)
    return request('promotion', 'MarketingGridBossService.SortMarketingGrid', req, 'SortMarketingGridResp')
}
/**
 * 类目运营
 */
// 新增类目运营
export function insertCategoryBanner (params) {
    console.log(params)
    const req = request.create('InsertCategoryBannerReq', params)
    return request('promotion', 'CategoryBannerBossService.InsertCategoryBanner', req, 'InsertCategoryBannerResp')
}
// 更新类目运营
export function updateCategoryBanner (params) {
    console.log(params)
    const req = request.create('UpdateCategoryBannerReq', params)
    return request('promotion', 'CategoryBannerBossService.UpdateCategoryBanner', req, 'UpdateCategoryBannerResp')
}
// 删除类目运营
export function deleteCategoryBanner (params) {
    console.log(params)
    const req = request.create('DeleteCategoryBannerReq', params)
    return request('promotion', 'CategoryBannerBossService.DeleteCategoryBanner', req, 'DeleteCategoryBannerResp')
}
// 列表类目运营
export function listCategoryBanner (params) {
    console.log(params)
    const req = request.create('ListCategoryBannerReq', params)
    return request('promotion', 'CategoryBannerBossService.ListCategoryBanner', req, 'ListCategoryBannerResp')
}

// 分页展示app icon信息
export function listAppIcon(params) {
    console.log(params)
    const req = request.create('ListAppIconInfoReq', params)
    return request('promotion', 'AppIconBossService.ListAppIcon', req, 'ListAppIconInfoResp')
}

// 新增app icon信息
export function insertAppIcon(params) {
    console.log(params)
    const req = request.create('InsertAppIconInfoReq', params)
    return request('promotion', 'AppIconBossService.InsertAppIcon', req, 'InsertAppIconInfoResp')
}

// 更新app icon信息
export function updateAppIcon(params) {
    console.log(params)
    const req = request.create('UpdateAppIconInfoReq', params)
    return request('promotion', 'AppIconBossService.UpdateAppIcon', req, 'UpdateAppIconInfoResp')
}

// 批量删除app icon信息
export function deleteAppIcon(params) {
    console.log(params)
    const req = request.create('DeleteAppIconInfoReq', params)
    return request('promotion', 'AppIconBossService.DeleteAppIcon', req, 'DeleteAppIconInfoResp')
}

// 批量复制到其他国家
export function batchCopyAppIcon(params) {
    console.log(params)
    const req = request.create('BatchCopyAppIconInfoReq', params)
    return request('promotion', 'AppIconBossService.BatchCopyAppIcon', req, 'BatchCopyAppIconInfoResp')
}

/**
 * 首页排序
 */
// 保存排序
export function saveHomePage(params) {
    console.log(params)
    const req = request.create('SaveHomePageReq', params)
    return request('promotion', 'HomePageBossService.SaveHomePage', req, 'SaveHomePageResp')
}

// 获取排序数据
export function listHomePage(params) {
    console.log(params)
    const req = request.create('ListHomePageReq', params)
    return request('promotion', 'HomePageBossService.ListHomePage', req, 'ListHomePageResp')
}

