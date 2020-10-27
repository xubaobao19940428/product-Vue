import request from './request'

/**
 * 活动
 */
// 添加活动
export function insertActive (params) {
    const req = request.create('ActiveAddReq', params)
    return request('marketing', 'ActiveService.InsertActive', req, 'ActiveAddResp')
}
// 修改活动
export function updateActive (params) {
    const req = request.create('ActiveUpdateReq', params)
    return request('marketing', 'ActiveService.UpdateActive', req, 'ActiveUpdateResp')
}
// 复制活动
export function copyInsertActive (params) {
    const req = request.create('ActiveCopyInsertReq', params)
    return request('marketing', 'ActiveService.CopyInsertActive', req, 'ActiveCopyInsertResp')
}
// 活动列表查询
export function listActive (params) {
    const req = request.create('ActiveListReq', params)
    return request('marketing', 'ActiveService.ListActive', req, 'ActiveListResp')
}
// select下拉框活动查询
export function selectActive (params) {
    const req = request.create('ActiveSelectReq', params)
    return request('marketing', 'ActiveService.SelectActive', req, 'ActiveSelectResp')
}
// 活动分组更改
export function insertOrUpdateGroup (params) {
    const req = request.create('ActiveAddOrUpdateGroupReq', params)
    return request('marketing', 'ActiveGroupBossService.InsertOrUpdateGroup', req, 'ActiveAddOrUpdateGroupResp')
}
// 活动分组列表
export function listActiveGroup (params) {
    const req = request.create('ActiveGroupListReq', params)
    return request('marketing', 'ActiveGroupBossService.ListActiveGroup', req, 'ActiveGroupListResp')
}
// 活动分组列表
export function listAllActiveGroup (params) {
    const req = request.create('ActiveGroupListReq', params)
    return request('marketing', 'ActiveGroupBossService.ListAllActiveGroup', req, 'ActiveGroupListResp')
}
// 活动商品
export function listActiveAllProduct (params) {
    const req = request.create('ActiveAllProductListReq', params)
    return request('marketing', 'ActiveProductService.ListActiveAllProduct', req, 'ActiveAllProductListResp')
}
// 活动商品排序
export function changeActiveAllProductSort (params) {
    const req = request.create('ChangeActiveAllProductSortReq', params)
    return request('marketing', 'ActiveProductService.ChangeActiveAllProductSort', req, 'ChangeActiveAllProductSortResp')
}

/**
 * 活动商品
 */
// 添加活动商品
export function insertActiveProduct (params) {
    const req = request.create('ActiveProductAddReq', params)
    return request('marketing', 'ActiveProductService.InsertActiveProduct', req, 'ActiveProductAddResp')
}
// 修改活动商品
export function updateActiveProduct (params) {
    const req = request.create('ActiveProductUpdateReq', params)
    return request('marketing', 'ActiveProductService.UpdateActiveProduct', req, 'ActiveProductUpdateResp')
}
// 获取活动商品SKU
export function getActiveProductSku (params) {
    const req = request.create('ActiveProductSkuReq', params)
    return request('marketing', 'ActiveProductService.ListActiveProductSku', req, 'ActiveProductSkuResp')
}
// 活动商品列表查询
export function listActiveProduct (params) {
    console.log(params)
    const req = request.create('ActiveProductListReq', params)
    return request('marketing', 'ActiveProductService.ListActiveProduct', req, 'ActiveProductListResp')
}

// 批量上传活动商品
export function UploadActiveProduct (params) {
    const req = request.create('UploadActiveProductReq', params)
    return request('marketing', 'ActiveProductService.UploadActiveProduct', req, 'UploadActiveProductResp')
}

// 活动商品上传模板下载
export function downloadActiveProductTemplate (params) {
    const req = request.create('ActiveProductTemplateReq', params)
    return request('marketing', 'ActiveProductService.DownloadActiveProductTemplate', req, 'ActiveProductTemplateResp')
}
/**
 * 促销管理
 */
// 添加营销活动
export function insertPromotion (params) {
    const req = request.create('PromotionInsertReq', params)
    return request('promotion', 'PromotionService.InsertPromotion', req, 'PromotionInsertResp')
}
// 修改营销活动
export function updatePromotion (params) {
    const req = request.create('PromotionUpdateReq', params)
    return request('promotion', 'PromotionService.UpdatePromotion', req, 'PromotionUpdateResp')
}
// 查询营销活动列表
export function listPromotion (params) {
    const req = request.create('PromotionListReq', params)
    return request('promotion', 'PromotionService.ListPromotion', req, 'PromotionListResp')
}
// 营销活动详情
export function getPromotionById (params) {
    const req = request.create('GetPromotionInfoReq', params)
    return request('promotion', 'PromotionService.GetPromotionById', req, 'GetPromotionInfoResp')
}

/**
 * 品质优选
 */
// 查询品质优选分类列表
export function listOperate (params) {
    const req = request.create('CategoryQueryParam', params)
    return request('product', 'MarketingCategoryService.FindQualityPageList', req, 'CategoryListResp')
}
// 添加
export function saveQuality (params) {
    const req = request.create('CategorySaveOrUpdateParam', params)
    return request('product', 'MarketingCategoryService.SaveQuality', req, 'SuccessResp')
}
// 修改
export function updateQuality (params) {
    const req = request.create('CategorySaveOrUpdateParam', params)
    return request('product', 'MarketingCategoryService.UpdateQuality', req, 'SuccessResp')
}
// 删除接口
export function deleteQuality (params) {
    const req = request.create('QulityDelReq', params)
    return request('product', 'MarketingCategoryService.DeleteQuality', req, 'SuccessResp')
}
// 隐藏接口
export function marketingCategoryHideShow (params) {
    const req = request.create('MarketingCategoryHideShowReq', params)
    return request('product', 'MarketingCategoryService.MarketingCategoryHideShow', req, 'MarketingCategoryHideShowResp')
}
// 排序
export function marketingCategorySetSort (params) {
    const req = request.create('MarketingCategorySetSortReq', params)
    return request('product', 'MarketingCategoryService.MarketingCategorySetSort', req, 'MarketingCategorySetSortResp')
}
// 查询列表
export function FindPageList (params) {
    const req = request.create('CategoryProductListReq', params)
    return request('product', 'MarketingCategoryProductService.FindPageList', req, 'CategoryProductListResp')
}
// 批量添加
export function BatchSave (params) {
    const req = request.create('CategoryProductParam', params)
    return request('product', 'MarketingCategoryProductService.BatchSave', req, 'SuccessResp')
}
// 批量删除接口
export function BatchDel (params) {
    const req = request.create('BatchDelReq', params)
    return request('product', 'MarketingCategoryProductService.BatchDel', req, 'SuccessResp')
}
// 排序
export function SaveSort (params) {
    const req = request.create('SaveSortReq', params)
    return request('product', 'MarketingCategoryProductService.SaveSort', req, 'SuccessResp')
}

/**
 * 插入主题
 * @export
 * @param {*} params
 * @returns
 */
export function insertSubject (params) {
    const req = request.create('GroupActivitySubject', params)
    return request('marketing', 'GroupActivitySubjectBossService.Insert', req, 'market.SuccessResp')
};

/**
 * 更新主题
 * @export
 * @param {*} params
 * @returns
 */
export function updateSubject (params) {
    const req = request.create('GroupActivitySubject', params)
    return request('marketing', 'GroupActivitySubjectBossService.Update', req, 'market.SuccessResp')
};

/**
 * 删除主题
 * @export
 * @param {*} params
 * @returns
 */
export function deleteSubject (params) {
    const req = request.create('GroupActivitySubject', params)
    return request('marketing', 'GroupActivitySubjectBossService.Delete', req, 'market.SuccessResp')
};

/**
 * 获取主题列表
 * @export
 * @param {*} params
 * @returns
 */
export function findAllSubjects (params) {
    const req = request.create('CountryCode', params)
    return request('marketing', 'GroupActivitySubjectBossService.FindAllSubjects', req, 'market.GroupActivitySubjectsListResp')
};

/**
 * 根据serialId查询主题
 * @export
 * @param {*} params
 * @returns
 */
export function findOneBySerialId (params) {
    const req = request.create('SerialId', params)
    return request('marketing', 'GroupActivitySubjectBossService.FindOneBySerialId', req, 'market.GroupActivitySubjectsListResp')
};

/**
 * 查询拼团活动列表
 * @export
 * @param {*} params
 * @returns
 */
export function findPageList (params) {
    const req = request.create('QueryListReq', params)
    return request('marketing', 'GroupActivityBossService.FindPageList', req, 'market.QueryListResp')
};

/**
 * 批量添加关联商品
 * @export
 * @param {*} params
 * @returns
 */
export function batchSave (params) {
    const req = request.create('GroupActivityParam', params)
    return request('marketing', 'GroupActivityBossService.BatchSave', req, 'market.SuccessResp')
};

/**
 * 批量删除
 * @export
 * @param {*} params
 * @returns
 */
export function batchDelete (params) {
    const req = request.create('GroupActivityDeleteParam', params)
    return request('marketing', 'GroupActivityBossService.BatchDelete', req, 'market.SuccessResp')
};

/**
 * 保存排序
 * @export
 * @param {*} params
 * @returns
 */
export function saveSort (params) {
    const req = request.create('SaveSortParam', params)
    return request('marketing', 'GroupActivityBossService.SaveSort', req, 'market.SuccessResp')
};

/**
 * 推荐
 * @export
 * @param {*} params
 * @returns
 */
export function recommend (params) {
    const req = request.create('SerialIdParam', params)
    return request('marketing', 'GroupActivityBossService.Recommend', req, 'market.SuccessResp')
};

/**
 * 编辑页数据查询
 * @export
 * @param {*} params
 * @returns
 */
export function viewById (params) {
    const req = request.create('SerialIdParam', params)
    return request('marketing', 'GroupActivityBossService.ViewById', req, 'market.GroupActivityResp')
};

/**
 * 修改活动
 * @export
 * @param {*} params
 * @returns
 */
export function updateGroup (params) {
    const req = request.create('GroupActivityUpdateParam', params)
    return request('marketing', 'GroupActivityBossService.Update', req, 'market.SuccessResp')
};

/**
 * 查询状态
 * @export
 * @param {*} params
 * @returns
 */
export function checkGroupStatus (params) {
    const req = request.create('CountryCode', params)
    return request('marketing', 'GroupActivitySubjectStatusService.Check', req, 'market.StatusResp')
};

/**
 * 更新状态
 * @export
 * @param {*} params
 * @returns
 */
export function updateGroupStatus (params) {
    const req = request.create('CountryCode', params)
    return request('marketing', 'GroupActivitySubjectStatusService.Update', req, 'market.StatusResp')
}

/**
 * 拆红包
 */
// 获取拆红包列表
export function listManageBack (params) {
    console.log(params)
    const req = request.create('ListBackManageReq', params)
    return request('marketing', 'OpenRedbagBossService.ListManageBack', req, 'ListBackManageResp')
}
// 查询助力详情
export function findOpenRedbagInfoList (params) {
    const req = request.create('FindOpenRedbagInfoReq', params)
    return request('marketing', 'OpenRedbagBossService.FindOpenRedbagInfoList', req, 'market.FindOpenRedbagInfoResp')
}
// 获取今日红包数
export function getRedbagAmount (params) {
    const req = request.create('RedbagAmountReq', params)
    return request('marketing', 'OpenRedbagBossService.GetRedbagAmount', req, 'market.RedbagAmountResp')
}
// 获取其他统计数据
export function getRedbagStatistics (params) {
    const req = request.create('RedbagAmountReq', params)
    return request('marketing', 'OpenRedbagBossService.GetRedbagStatistics', req, 'market.GetRedbagStatisticsResp')
}
// 根据国家码查询资金配置列表
export function queryByCountryCode (params) {
    const req = request.create('QueryByCountryCodeReq', params)
    return request('marketing', 'OpenRedbagBossService.QueryByCountryCode', req, 'market.ConfigResp')
}
// 保存资金配置
export function saveConfig (params) {
    const req = request.create('ConfigReq', params)
    return request('marketing', 'OpenRedbagBossService.SaveConfig', req, 'market.SuccessResp')
}
// 下载
export function download (params) {
    const req = request.create('ListBackManageReq', params)
    return request('marketing', 'OpenRedbagBossService.Download', req, 'market.DownloadResp')
}
// 统计拆红包数据
export function getRedbagStatisticsList (params) {
    const req = request.create('GetRedbagStatisticsListReq', params)
    return request('marketing', 'OpenRedbagBossService.GetRedbagStatisticsList', req, 'market.GetRedbagStatisticsListResp')
}
// 获取拆红包提前成功设置内容
export function getAheadSuccessConfig (params) {
    const req = request.create('GetAheadSuccessConfigReq', params)
    return request('marketing', 'OpenRedbagBossService.GetAheadSuccessConfig', req, 'market.GetAheadSuccessConfigResp')
}
// 保存拆红包提前成功设置
export function saveAheadSuccessConfig (params) {
    const req = request.create('SaveAheadSuccessConfigReq', params)
    return request('marketing', 'OpenRedbagBossService.SaveAheadSuccessConfig', req, 'market.SaveAheadSuccessConfigResp')
}
// 获取拆红包系统设置
export function getRedBagSystemConfig (params) {
    const req = request.create('GetRedBagSystemConfigReq', params)
    return request('marketing', 'OpenRedbagBossService.GetRedBagSystemConfig', req, 'market.GetRedBagSystemConfigResp')
}
// 保存拆红包系统设置
export function saveRedBagSystemConfig (params) {
    const req = request.create('SaveRedBagSystemConfigReq', params)
    return request('marketing', 'OpenRedbagBossService.SaveRedBagSystemConfig', req, 'market.SaveRedBagSystemConfigResp')
}
/**
 * 悬浮开关设置
 * @export
 * @param {*} params
 * @returns
 */
// 添加浮窗
export function AddActiveFloating (params) {
    const req = request.create('AddActiveFloatingReq', params)
    return request('marketing', 'ActiveFloatingBossService.AddActiveFloating', req, 'market.AddActiveFloatingResp')
};
// 修改浮窗
export function UpdateActiveFloating (params) {
    const req = request.create('UpdateActiveFloatingReq', params)
    return request('marketing', 'ActiveFloatingBossService.UpdateActiveFloating', req, 'market.UpdateActiveFloatingResp')
};
// 查询浮窗
export function ListActiveFloating (params) {
    const req = request.create('ListActiveFloatingReq', params)
    return request('marketing', 'ActiveFloatingBossService.ListActiveFloating', req, 'market.ListActiveFloatingResp')
};
// 更改浮窗状态
export function ChangeActiveFloatingStatus (params) {
    const req = request.create('ChangeActiveFloatingStatusReq', params)
    return request('marketing', 'ActiveFloatingBossService.ChangeActiveFloatingStatus', req, 'market.ChangeActiveFloatingStatusResp')
};

/**
 * 页面搭建
 */

// 列表展示
export function listPage (params) {
    console.log(params)
    const req = request.create('ListPageReq', params)
    return request('marketing', 'MarketingPageBossService.ListPage', req, 'ListPageResp')
}
// 根据页面序列号查询历史数据
export function getPageHistoryBySerialId (params) {
    console.log(params)
    const req = request.create('GetPageHistoryBySerialIdReq', params)
    return request('marketing', 'MarketingPageBossService.GetPageHistoryBySerialId', req, 'GetPageHistoryBySerialIdResp')
}
// 删除历史版本
export function deletePageHistory (params) {
    console.log(params)
    const req = request.create('DeletePageHistoryReq', params)
    return request('marketing', 'MarketingPageBossService.DeletePageHistory', req, 'DeletePageHistoryResp')
}
// 立即生效
export function activating (params) {
    console.log(params)
    const req = request.create('HistorySerialIdReq', params)
    return request('marketing', 'MarketingPageBossService.Activating', req, 'PageSuccessResp')
}
// 设置或删除某页面版本的生效时间
export function updateVersionPageTime (params) {
    console.log(params)
    const req = request.create('UpdateVersionPageTimeReq', params)
    return request('marketing', 'MarketingPageBossService.UpdateVersionPageTime', req, 'UpdateVersionPageTimeResp')
}
// 编辑
export function getPageAndLayouts (params) {
    console.log(params)
    const req = request.create('HistorySerialIdReq', params)
    return request('marketing', 'MarketingPageBossService.GetPageAndLayouts', req, 'ViewInfoResp')
}
// 保存
export function insertPageLayout (params) {
    console.log(params)
    const req = request.create('InsertPageLayoutReq', params)
    return request('marketing', 'MarketingPageBossService.InsertPageLayout', req, 'InsertPageLayoutResp')
}
// 根据活动和活动分组查询
export function selectActiveAndGroupLabel (params) {
    console.log(params)
    const req = request.create('SelectActiveAndGroupLabelReq', params)
    return request('marketing', 'ActiveService.SelectActiveAndGroupLabel', req, 'SelectActiveAndGroupLabelResp')
}
// 根据活动id或分组id获取商品
export function getActiveByIdOrLabelId (params) {
    console.log(params)
    const req = request.create('GetActiveByIdOrLabelIdReq', params)
    return request('marketing', 'ActiveProductBossSimulationMallService.GetActiveByIdOrLabelId', req, 'GetActiveByIdOrLabelIdResp')
}
// 根据活动商品id获取商品信息
export function getActiveProductByProductId (params) {
    console.log(params)
    const req = request.create('GetActiveProductByProductIdReq', params)
    return request('marketing', 'ActiveProductBossSimulationMallService.GetActiveProductByProductId', req, 'GetActiveProductByProductIdResp')
}
/**
 * 列表活动
 */
// 新增
export function insertQualityRecommend (params) {
    const req = request.create('InsertQualityRecommendReq', params)
    return request('marketing', 'QualityRecommendBossService.InsertQualityRecommend', req, 'market.InsertQualityRecommendResp')
}
// 编辑
export function updateQualityRecommend (params) {
    const req = request.create('UpdateQualityRecommendReq', params)
    return request('marketing', 'QualityRecommendBossService.UpdateQualityRecommend', req, 'market.UpdateQualityRecommendResp')
}
// 删除
export function deleteQualityRecommend (params) {
    const req = request.create('DeleteQualityRecommendReq', params)
    return request('marketing', 'QualityRecommendBossService.DeleteQualityRecommend', req, 'market.DeleteQualityRecommendResp')
}
// 列表
export function listQualityRecommend (params) {
    const req = request.create('ListQualityRecommendReq', params)
    return request('marketing', 'QualityRecommendBossService.ListQualityRecommend', req, 'market.ListQualityRecommendResp')
}
// 排序
export function sortQualityRecommend (params) {
    const req = request.create('SortQualityRecommendReq', params)
    return request('marketing', 'QualityRecommendBossService.SortQualityRecommend', req, 'market.SortQualityRecommendResp')
}

/**
 * 拼团
 */
// 根据拼团专题名称搜索拼团专题
export function getSubjectsForPage (params) {
    const req = request.create('GetSubjectsForPageReq', params)
    return request('marketing', 'GroupActivityForPageBossService.GetSubjectsForPage', req, 'market.GetSubjectsForPageResp')
}
// 根据拼团商品id搜索拼团商品简单信息
export function getGroupProductForPage (params) {
    const req = request.create('GetGroupProductForPageReq', params)
    return request('marketing', 'GroupActivityForPageBossService.GetGroupProductForPage', req, 'market.GetGroupProductForPageResp')
}
// 根据拼团商品序列号集合或者拼团专题id集合搜索拼团商品详细信息
export function getGroupSpuBoss (params) {
    const req = request.create('GetGroupSpuBossReq', params)
    return request('marketing', 'GroupActivityForPageBossService.GetGroupSpuBoss', req, 'market.GetGroupSpuBossResp')
}

// 买赠管理列表
export function getGiveQuery (params) {
    const req = request.create('GiveQueryReq', params)
    return request('marketing', 'GiveBossService.Query', req, 'GiveQueryResp')
}
// 修改买赠活动状态
export function editGiveStatus (params) {
    const req = request.create('GiveEditStatusReq', params)
    return request('marketing', 'GiveBossService.EditStatus', req, 'GiveResp')
}
// 新增编辑买赠活动
export function updateGive (params) {
    const req = request.create('GiveAddOrEditReq', params)
    return request('marketing', 'GiveBossService.GiveAddOrEdit', req, 'GiveResp')
}
// 查看买赠活动详情
export function getGiveDetail (params) {
    const req = request.create('GiveQueryDetailReq', params)
    return request('marketing', 'GiveBossService.QueryDetail', req, 'GiveQueryDetailResp')
}