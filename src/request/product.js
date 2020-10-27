import request from './request'

/**
 * 属性管理列表
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrGet(params) {
    console.log(params)
    const req = request.create('ProductAttrGetReq', params)
    return request('product', 'ProductAttrService.ProductAttrGet', req, 'attribute.ProductAttrGetResp')
};

/**
 * 添加商品属性
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrAdd(params) {
    console.log(params)
    const req = request.create('ProductAttrAddReq', params)
    return request('product', 'ProductAttrService.ProductAttrAdd', req, 'attribute.ProductAttrAddResp')
};

/**
 * 失效商品属性
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrDisable(params) {
    console.log(params)
    const req = request.create('ProductAttrDisableReq', params)
    return request('product', 'ProductAttrService.ProductAttrDisable', req, 'attribute.ProductAttrDisableResp')
};

/**
 * 失效商品属性值
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrValueDisable(params) {
    console.log(params)
    const req = request.create('ProductAttrValueDisableReq', params)
    return request('product', 'ProductAttrService.ProductAttrValueDisable', req, 'attribute.ProductAttrValueDisableResp')
};

/**
 * 根据id获取属性信息
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrGetById(params) {
    const req = request.create('ProductAttrGetByIdReq', params)
    return request('product', 'ProductAttrService.ProductAttrGetById', req, 'attribute.ProductAttrGetByIdResp')
};

/**
 * 修改商品属性
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrModify(params) {
    console.log(params)
    const req = request.create('ProductAttrModifyReq', params)
    return request('product', 'ProductAttrService.ProductAttrModify', req, 'attribute.ProductAttrModifyResp')
};

/**
 * 批量获取类目商品属性
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrGetByIdBatch(params) {
    console.log(params)
    const req = request.create('ProductAttrGetByIdBatchReq', params)
    return request('product', 'ProductAttrService.ProductAttrGetByIdBatch', req, 'attribute.ProductAttrGetByIdBatchResp')
};

/**
 * 向属性下添加一个自定义属性值, 并返回添加后的属性信息及属性值列表信息
 * @export
 * @param {*} params
 * @returns
 */
export function addCustomizeAttrValue(params) {
    console.log(params)
    const req = request.create('AddCustomizeAttrValueReq', params)
    return request('product', 'ProductAttrService.AddCustomizeAttrValue', req, 'attribute.AddCustomizeAttrValueResp')
};

// /**
//  * 修改商品属性
//  * @export
//  * @param {*} params
//  * @returns
//  */
// export function brandInfoGet(params) {
//     console.log(params)
//     const req = request.create('BrandInfoGetReq', params)
//     return request('product', 'ProductBrandService.BrandInfoGet', req, 'brand.BrandInfoGetResp')
// };

/**
 * 下载搜索到的属性数据
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrDownload(params) {
    const req = request.create('ProductAttrDownloadReq', params)
    return request('product', 'ProductAttrService.ProductAttrDownload', req, 'attribute.ProductAttrDownloadResp')
};

/**
 * 一键翻译选择的属性/属性值
 * @export
 * @param {*} params
 * @returns
 */
export function translateSelectedAttr(params) {
    const req = request.create('TranslateSelectedAttrReq', params)
    return request('product', 'ProductAttrService.TranslateSelectedAttr', req, 'attribute.TranslateSelectedAttrResp')
};


/**
 * 属性值分页获取
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrValueGet(params) {
    const req = request.create('ProductAttrValueGetReq', params)
    return request('product', 'ProductAttrService.ProductAttrValueGet', req, 'attribute.ProductAttrValueGetResp')
};

/**
 * 属性值更新翻译信息
 * @export
 * @param {*} params
 * @returns
 */
export function updateAttrTranslateById(params) {
    const req = request.create('UpdateAttrTranslateByIdReq', params)
    return request('product', 'ProductAttrService.UpdateAttrTranslateById', req, 'attribute.UpdateAttrTranslateByIdResp')
};

/**
 * 属性值下载
 * @export
 * @param {*} params
 * @returns
 */
export function productAttrValueDownload(params) {
    const req = request.create('ProductAttrValueDownloadReq', params)
    return request('product', 'ProductAttrService.ProductAttrValueDownload', req, 'attribute.ProductAttrValueDownloadResp')
};

/**
 * 上传文件方式更新属性翻译信息
 * @export
 * @param {*} params
 * @returns
 */
export function uploadAttrTranslate(params) {
    const req = request.create('UploadAttrTranslateReq', params)
    return request('product', 'ProductAttrService.UploadAttrTranslate', req, 'attribute.UploadAttrTranslateResp')
};

/**
 * 上传文件方式更新属性值翻译信息
 * @export
 * @param {*} params
 * @returns
 */
export function uploadAttrValueTranslate(params) {
    const req = request.create('UploadAttrValueTranslateReq', params)
    return request('product', 'ProductAttrService.UploadAttrValueTranslate', req, 'attribute.UploadAttrValueTranslateResp')
};

/**
 * 获取类目列表
 * @export
 * @param {*} params
 * @returns
 */
export function categoryListGet(params) {
    console.log(params)
    const req = request.create('CategoryListGetReq', params)
    return request('product', 'ProductCategoryService.CategoryListGet', req, 'category.CategoryListGetResp')
};
/**
 * 获取分组
 * @export
 * @param {*} params
 * @returns
 */
export function CategoryGroupListGet(params) {
    console.log(params)
    const req = request.create('CategoryGroupListGetReq', params)
    return request('product', 'ProductCategoryService.CategoryGroupListGet', req, 'category.CategoryGroupListGetResp')
};

/**
 * 新增编辑分组管理
 * @export
 * @param {*} params
 * @returns
 */
export function CategoryGroupAddOrUpdate(params) {
    console.log(params)
    const req = request.create('CategoryGroupAddOrUpdateReq', params)
    return request('product', 'ProductCategoryService.CategoryGroupAddOrUpdate', req, 'category.CategoryGroupAddOrUpdateResp')
};
/**
 * 类目分组详情
 * @export
 * @param {*} params
 * @returns
 */
export function CategoryGroupGet(params) {
    console.log(params)
    const req = request.create('CategoryGroupGetReq', params)
    return request('product', 'ProductCategoryService.CategoryGroupGet', req, 'category.CategoryGroupGetResp')
};
/**
 * 类目分组排序
 * @export
 * @param {*} params
 * @returns
 */
export function CategoryGroupSort(params) {
    console.log(params)
    const req = request.create('CategoryGroupSortReq', params)
    return request('product', 'ProductCategoryService.CategoryGroupSort', req, 'category.CategoryGroupSortResp')
};
/**
 * 类目分组删除
 * @export
 * @param {*} params
 * @returns
 */
export function CategoryGroupDelete(params) {
    console.log(params)
    const req = request.create('CategoryGroupDeleteReq', params)
    return request('product', 'ProductCategoryService.CategoryGroupDelete', req, 'category.CategoryGroupDeleteResp')
};
/**
 * 增加类目
 * @export
 * @param {*} params
 * @returns
 */
export function categoryAdd(params) {
    console.log(params)
    const req = request.create('CategoryAddReq', params)
    return request('product', 'ProductCategoryService.CategoryAdd', req, 'category.CategoryAddResp')
};

/**
 * 删除类目
 * @export
 * @param {*} params
 * @returns
 */
export function categoryDelete(params) {
    console.log(params)
    const req = request.create('CategoryDeleteReq', params)
    return request('product', 'ProductCategoryService.CategoryDelete', req, 'category.CategoryDeleteResp')
};

/**
 * 类目排序
 * @export
 * @param {*} params
 * @returns
 */
export function categoryChangeToSort(params) {
    console.log(params)
    const req = request.create('CategoryChangeToSortReq', params)
    return request('product', 'ProductCategoryService.CategoryChangeToSort', req, 'category.CategoryChangeToSortResp')
};

/**
 * 编辑类目
 * @export
 * @param {*} params
 * @returns
 */
export function categoryUpdate(params) {
    console.log(params)
    const req = request.create('CategoryUpdateReq', params)
    return request('product', 'ProductCategoryService.CategoryUpdate', req, 'category.CategoryUpdateResp')
};

/**
 * 模糊查询类目
 * @export
 * @param {*} params
 * @returns
 */
export function categoryQueryByName(params) {
    console.log(params)
    const req = request.create('CategoryQueryByNameReq', params)
    return request('product', 'ProductCategoryService.CategoryQueryByName', req, 'CategoryQueryByNameResp')
};

/**
 * 隐藏或显示类目 status: 1显示/0隐藏
 * @export
 * @param {*} params
 * @returns
 */
export function categoryHiddenOrShow (params) {
    console.log(params)
    const req = request.create('CategoryHiddenOrShowReq', params)
    return request('product', 'ProductCategoryService.CategoryHiddenOrShow', req, 'CategoryHiddenOrShowResp')
}

/**
 * 类目拖拽排序
 * @export
 * @param {*} params
 * @returns
 */
export function categoryChangSort(params) {
    console.log(params)
    const req = request.create('CategoryChangSortReq', params)
    return request('product', 'ProductCategoryService.CategoryChangSort', req, 'CategoryChangSortResp')
};

/**
 * 获取关联上级类目信息
 * @export
 * @param {*} params
 * @returns
 */

export function getUpperRelatedCategoryById(params) {
    console.log(params)
    const req = request.create('GetUpperRelatedCategoryByIdReq', params)
    return request('product', 'ProductCategoryService.GetUpperRelatedCategoryById', req, 'category.GetUpperRelatedCategoryByIdResp')
};

/**
 * 获取商品类型列表
 * @export
 * @param {*} params
 * @returns
 */
export function getProductTypeList(params) {
    console.log(params)
    const req = request.create('GetProductTypeListReq', params)
    return request('product', 'ProductService.GetProductTypeList', req, 'product.GetProductTypeListResp')
};

/**
 * 获取1688详情图和主图
 * @export
 * @param {*} params
 * @returns
 */
export function get1688Pic(params) {
    console.log(params)
    const req = request.create('Get1688PicReq', params)
    return request('product', 'ProductService.Get1688Pic', req, 'product.Get1688PicResp')
};

/**
 * 获取后台支持的枚举信息
 * @export
 * @param {*} params
 * @returns
 */
export function getProductEnumInfo(params) {
    console.log(params)
    const req = request.create('GetProductEnumInfoReq', params)
    return request('product', 'ProductService.GetProductEnumInfo', req, 'product.GetProductEnumInfoResp')
};


/**
 * 新增商品
 * @export
 * @param {*} params
 * @returns
 */
export function insertProduct(params) {
    console.log(params)
    const req = request.create('InsertProductReq', params)
    return request('product', 'ProductService.InsertProduct', req, 'product.InsertProductResp')
};

/**
 * 编辑商品
 * @export
 * @param {*} params
 * @returns
 */
export function updateProduct(params) {
    console.log(params)
    const req = request.create('UpdateProductReq', params)
    return request('product', 'ProductService.UpdateProduct', req, 'product.UpdateProductResp')
};

/**
 * 删除商品
 * @export
 * @param {*} params
 * @returns
 */
export function disableProduct(params) {
    console.log(params)
    const req = request.create('DisableProductReq', params)
    return request('product', 'ProductService.DisableProduct', req, 'product.DisableProductResp')
};

/**
 * 商品列表
 * @export
 * @param {*} params
 * @returns
 */
export function listProduct(params) {
    console.log(params)
    const req = request.create('ListProductReq', params)
    return request('product', 'ProductService.ListProduct', req, 'product.ListProductResp')
};

/**
 * 根据商品ID查看商品详情
 * @export
 * @param {*} params
 * @returns
 */
export function viewProductInfo(params) {
    console.log(params)
    const req = request.create('ViewProductInfoReq', params)
    return request('product', 'ProductService.ViewProductInfo', req, 'product.ViewProductInfoResp')
};

/**
 * 添加组合商品时 根据 sku_id 查询组合商品
 * @export
 * @param {*} params
 * @returns
 */
export function compositeSlaveSkuInfoQuery(params) {
    console.log(params)
    const req = request.create('CompositeSlaveSkuInfoQueryReq', params)
    return request('product', 'ProductService.CompositeSlaveSkuInfoQuery', req, 'product.CompositeSlaveSkuInfoQueryResp')
};

/**
 * 商品导出
 * @export
 * @param {*} params
 * @returns
 */
export function productExport(params) {
    const req = request.create('ProductExportReq', params)
    return request('product', 'ProductService.ProductExport', req, 'product.ProductExportResp')
};

// 类目商品排序列表
export function listCategoryProduct (params) {
    console.log(params)
    const req = request.create('ListCategoryProductReq', params)
    return request('product', 'ProductCategoryService.ListCategoryProduct', req, 'ListCategoryProductResp')
}
// 修改商品的后台类目排序值
export function changeCategoryProductSort (params) {
    console.log(params)
    const req = request.create('ChangeCategoryProductSortReq', params)
    return request('product', 'ProductCategoryService.ChangeCategoryProductSort', req, 'ChangeCategoryProductSortResp')
}
// 置顶
export function setCategoryProductTop (params) {
    console.log(params)
    const req = request.create('SetCategoryProductTopReq', params)
    return request('product', 'ProductCategoryService.SetCategoryProductTop', req, 'SetCategoryProductTopResp')
}

/**
 * 复制前台类目
 * @export
 * @param {*} params
 * @returns
 */
export function copyFrontCategory(params) {
    const req = request.create('CopyFrontCategoryReq', params)
    return request('product', 'ProductCategoryService.CopyFrontCategory', req, 'category.CopyFrontCategoryResp')
};

// 根据sku code获取sku 信息
export function getProductSkuInfoBySkuCode (params) {
    console.log(params)
    const req = request.create('GetProductSkuInfoBySkuCodeReq', params)
    return request('product', 'ProductService.GetProductSkuInfoBySkuCode', req, 'GetProductSkuInfoBySkuCodeResp')
}
/**
 * 定价模板
 */
// 获取所有商品价格模版
export function listAllProductPriceTemplate (params) {
    const req = request.create('ListProductPriceTemplateReq', params)
    return request('product', 'ProductPriceTemplateService.ListProductPriceTemplate', req, 'ListProductPriceTemplateResp')
}

// 新增商品价格模版
export function addNewProductPriceTemplate (params) {
    const req = request.create('AddNewProductPriceTemplateReq', params)
    return request('product', 'ProductPriceTemplateService.AddNewProductPriceTemplate', req, 'AddNewProductPriceTemplateResp')
}

// 更新商品价格模版
export function updateProductPriceTemplate (params) {
    console.log(params)
    const req = request.create('UpdateProductPriceTemplateReq', params)
    return request('product', 'ProductPriceTemplateService.UpdateProductPriceTemplate', req, 'UpdateProductPriceTemplateResp')
}

// 停用定价模板
export function changePriceTemplateEffectStatus (params) {
    const req = request.create('ChangePriceTemplateEffectStatusReq', params)
    return request('product', 'ProductPriceTemplateService.ChangePriceTemplateEffectStatus', req, 'ChangePriceTemplateEffectStatusResp')
}

/**
 * 通过类目id获取商品价格模版
 * @export
 * @param {*} params
 * @returns
 */
export function getTemplateByCategoryId(params) {
    console.log(params)
    const req = request.create('GetTemplateByCategoryIdReq', params)
    return request('product', 'ProductPriceTemplateService.GetTemplateByCategoryId', req, 'price.GetTemplateByCategoryIdResp')
};

/**
 * 添加品牌
 * @export
 * @param {*} params
 * @returns
 */
export function brandInfoAdd(params) {
    console.log(params)
    const req = request.create('BrandInfoAddReq', params)
    return request('product', 'ProductBrandService.BrandInfoAdd', req, 'brand.BrandInfoAddResp')
};

/**
 * 编辑品牌
 * @export
 * @param {*} params
 * @returns
 */
export function brandInfoModify(params) {
    console.log(params)
    const req = request.create('BrandInfoModifyReq', params)
    return request('product', 'ProductBrandService.BrandInfoModify', req, 'brand.BrandInfoModifyResp')
};

/**
 * 获取品牌列表
 * @export
 * @param {*} params
 * @returns
 */
export function brandInfoGet(params) {
    console.log(params)
    const req = request.create('BrandInfoGetReq', params)
    return request('product', 'ProductBrandService.BrandInfoGet', req, 'brand.BrandInfoGetResp')
};

/**
 * 启用, 禁用品牌
 * @export
 * @param {*} params
 * @returns
 */
export function brandChangeStatus(params) {
    console.log(params)
    const req = request.create('BrandChangeStatusReq', params)
    return request('product', 'ProductBrandService.BrandChangeStatus', req, 'brand.BrandChangeStatusResp')
};

/**
 * 删除品牌
 * @export
 * @param {*} params
 * @returns
 */
export function brandDelete(params) {
    console.log(params)
    const req = request.create('BrandDeleteReq', params)
    return request('product', 'ProductBrandService.BrandDelete', req, 'brand.BrandDeleteResp')
};

/**
 * 品牌分页
 * @export
 * @param {*} params
 * @returns
 */
export function brandPage(params) {
    console.log(params)
    const req = request.create('BrandPageReq', params)
    return request('product', 'ProductBrandService.BrandPage', req, 'brand.BrandPageResp')
};

/**
 * 汇率模板
 */
// 当前正在使用汇率模板
export function exchangeGetRecentRateTemplate (params) {
    const req = request.create('ExchangeGetRecentRateTemplateReq', params)
    return request('i18n', 'ExchangeService.ExchangeGetRecentRateTemplate', req, 'ExchangeGetRecentRateTemplateResp')
}
// 汇率列表
export function ExchangeGetReadyConfigTemplate (params) {
    const req = request.create('ExchangeGetReadyConfigTemplateReq', params)
    return request('i18n', 'ExchangeService.ExchangeGetReadyConfigTemplate', req, 'ExchangeGetReadyConfigTemplateResp')
}
// 保存汇率模板
export function exchangeSaveRate (params) {
    const req = request.create('ExchangeSaveRateReq', params)
    return request('i18n', 'ExchangeService.ExchangeSaveRate', req, 'ExchangeSaveRateResp')
}
// 审核
export function exchangeReview (params) {
    const req = request.create('ExchangeReviewReq', params)
    return request('i18n', 'ExchangeService.ExchangeReview', req, 'ExchangeReviewResp')
}
// 汇率模板编辑记录
export function exchangeGetRateSaveHistory (params) {
    console.log(params)
    const req = request.create('ExchangeGetRateSaveHistoryReq', params)
    return request('i18n', 'ExchangeService.ExchangeGetRateSaveHistory', req, 'ExchangeGetRateSaveHistoryResp')
}
// 获取货币间转换汇率
export function exchangeGetRate (params) {
    const req = request.create('ExchangeGetRateReq', params)
    return request('i18n', 'ExchangeService.ExchangeGetRate', req, 'ExchangeGetRateResp')
}
// 根据当前配置汇率获得转换后价格
export function exchangeConvert (params) {
    const req = request.create('ExchangeConvertReq', params)
    return request('i18n', 'ExchangeService.ExchangeConvert', req, 'ExchangeConvertResp')
}

// 查询有效商品
export function getProductSpu (params) {
    const req = request.create('GetProductSpuReq', params)
    return request('product', 'ProductService.GetProductSpu', req, 'GetProductSpuResp')
}
// 查询商品sku
export function getProductSku (params) {
    const req = request.create('GetProductSkuReq', params)
    return request('product', 'ProductService.GetProductSku', req, 'GetProductSkuResp')
}

/**
 * 根据外源商品id一键上货
 * @export
 * @param {*} params
 * @returns
 */
export function oneKeyUploadProduct(params) {
    const req = request.create('OneKeyUploadProductReq', params)
    return request('product', 'ProductService.OneKeyUploadProduct', req, 'product.OneKeyUploadProductResp')
};

/**
 * 确认上传
 * @export
 * @param {*} params
 * @returns
 */
export function checkToBeConfirm(params) {
    const req = request.create('CheckToBeConfirmReq', params)
    return request('product', 'ProductService.CheckToBeConfirm', req, 'product.CheckToBeConfirmResp')
};

/**
 * 草稿箱批量删除记录
 * @export
 * @param {*} params
 * @returns
 */
export function deleteDrafts(params) {
    const req = request.create('DeleteDraftsReq', params)
    return request('product', 'ProductService.DeleteDrafts', req, 'product.DeleteDraftsResp')
};

/**
 * 列表展示草稿箱记录
 * @export
 * @param {*} params
 * @returns
 */
export function listDrafts(params) {
    const req = request.create('ListDraftsReq', params)
    return request('product', 'ProductService.ListDrafts', req, 'product.ListDraftsResp')
};

/**
 * 暂存草稿箱记录
 * @export
 * @param {*} params
 * @returns
 */
export function updateDraft(params) {
    const req = request.create('UpdateDraftReq', params)
    return request('product', 'ProductService.UpdateDraft', req, 'product.UpdateDraftResp')
};

/**
 * 获取一条草稿箱记录
 * @export
 * @param {*} params
 * @returns
 */
export function getDraftById(params) {
    const req = request.create('GetDraftByIdReq', params)
    return request('product', 'ProductService.GetDraftById', req, 'product.GetDraftByIdResp')
};


/**
 * 获取草稿箱记录创建者id列表
 * @export
 * @param {*} params
 * @returns
 */
export function getDraftOperatorList(params) {
    const req = request.create('GetDraftOperatorListReq', params)
    return request('product', 'ProductService.GetDraftOperatorList', req, 'product.GetDraftOperatorListResp')
};


/**
 * 预售输入商品id后点击确定时调用
 * @export
 * @param {*} params
 * @returns
 */
export function advanceSaleSkuInfoGet(params) {
    const req = request.create('AdvanceSaleSkuInfoGetReq', params)
    return request('product', 'ProductService.AdvanceSaleSkuInfoGet', req, 'product.AdvanceSaleSkuInfoGetResp')
};

/**
 * 预售输入商品id后点击确定时调用
 * @export
 * @param {*} params
 * @returns
 */
export function advanceSaleAdd(params) {
    const req = request.create('AdvanceSaleAddReq', params)
    return request('product', 'ProductService.AdvanceSaleAdd', req, 'product.AdvanceSaleAddResp')
};

/**
 * 预售信息列表
 * @export
 * @param {*} params
 * @returns
 */
export function advanceSaleList(params) {
    const req = request.create('AdvanceSaleListReq', params)
    return request('product', 'ProductService.AdvanceSaleList', req, 'product.AdvanceSaleListResp')
};

/**
 * 获取某个预售的信息
 * @export
 * @param {*} params
 * @returns
 */
export function advanceSaleGet(params) {
    const req = request.create('AdvanceSaleGetReq', params)
    return request('product', 'ProductService.AdvanceSaleGet', req, 'product.AdvanceSaleGetResp')
};

/**
 * 上传文件新建预售
 * @export
 * @param {*} params
 * @returns
 */
export function advanceSaleUpload(params) {
    const req = request.create('AdvanceSaleUploadReq', params)
    return request('product', 'ProductService.AdvanceSaleUpload', req, 'product.AdvanceSaleUploadResp')
};

/**
 * 更新预售信息
 * @export
 * @param {*} params
 * @returns
 */
export function advanceSaleUpdate(params) {
    const req = request.create('AdvanceSaleUpdateReq', params)
    return request('product', 'ProductService.AdvanceSaleUpdate', req, 'product.AdvanceSaleUpdateResp')
};

/**
 * 下载指定预售记录
 * @export
 * @param {*} params
 * @returns
 */
export function advanceSaleDownload(params) {
    const req = request.create('AdvanceSaleDownloadReq', params)
    return request('product', 'ProductService.AdvanceSaleDownload', req, 'product.AdvanceSaleDownloadResp')
};

/**
 * 手动推送采购单
 * @export
 * @param {*} params
 * @returns
 */
export function manualPushAdvancePurchase(params) {
    const req = request.create('ManualPushAdvancePurchaseReq', params)
    return request('product', 'ProductService.ManualPushAdvancePurchase', req, 'product.ManualPushAdvancePurchaseResp')
};

/**
 * 电子化铺货
 * @export
 * @param {*} params
 * @returns
 */
export function createUploadTask(params) {
    const req = request.create('CreateUploadTaskRequest', params)
    return request('carrier', 'CarrierService.CreateUploadTask', req, 'carrier.CreateUploadTaskResponse')
};

/**
 * 获取上下架管理列表
 * @export
 * @param {*} params
 * @returns
 */
export function getShelveList(params) {
    const req = request.create('GetShelveListReq', params)
    return request('product', 'ProductBatchOperationService.GetShelveList', req, 'product.GetShelveListResp')
};


/**
 * 批量采纳建议检查
*/
export function batchAcceptShelveAdviceCheck(params) {
    const req = request.create('BatchAcceptShelveAdviceCheckReq', params)
    return request('product', 'ProductBatchOperationService.BatchAcceptShelveAdviceCheck', req, 'product.BatchAcceptShelveAdviceCheckResp')
};

/**
 * 批量采纳检查
 * @export
 * @param {*} params
 * @returns
 */
export function batchAcceptShelveAdvice(params) {
    const req = request.create('BatchAcceptShelveAdviceReq', params)
    return request('product', 'ProductBatchOperationService.BatchAcceptShelveAdvice', req, 'product.BatchAcceptShelveAdviceResp')
};

/**
 * 批量上架检查
 * @export
 * @param {*} params
 * @returns
 */
export function batchOnShelveCheck(params) {
    const req = request.create('BatchOnShelveCheckReq', params)
    return request('product', 'ProductBatchOperationService.BatchOnShelveCheck', req, 'product.BatchOnShelveCheckResp')
};

/**
 * 批量上架确认
 * @export
 * @param {*} params
 * @returns
 */
export function batchOnShelve(params) {
    const req = request.create('BatchOnShelveReq', params)
    return request('product', 'ProductBatchOperationService.BatchOnShelve', req, 'product.BatchOnShelveResp')
};

/**
 * 批量下架
 * @export
 * @param {*} params
 * @returns
 */
export function batchOffShelve(params) {
    const req = request.create('BatchOffShelveReq', params)
    return request('product', 'ProductBatchOperationService.BatchOffShelve', req, 'product.BatchOffShelveResp')
};

/**
 * 改变sku在售状态
 * @export
 * @param {*} params
 * @returns
 */
export function changeSaleStatus(params) {
    const req = request.create('ChangeSaleStatusReq', params)
    return request('product', 'ProductBatchOperationService.ChangeSaleStatus', req, 'product.ChangeSaleStatusResp')
};
/**
 * 获取任务列表
 * @export
 * @param {*} params
 * @returns
 */
export function getTaskList(params) {
    const req = request.create('GetTaskListRequest', params)
    return request('carrier', 'CarrierService.GetTaskList', req, 'carrier.GetTaskListResponse')
};

/**
 * 停止任务
 * @export
 * @param {*} params
 * @returns
 */
export function stopTask(params) {
    const req = request.create('StopTaskRequest', params)
    return request('carrier', 'CarrierService.StopTask', req, 'carrier.StopTaskResponse')
};

/**
 * 获取以图找货列表
 * @export
 * @param {*} params
 * @returns
 */
export function getChilindoImages(params) {
    const req = request.create('GetChilindoImagesReq', params)
    return request('carrier', 'CarrierService.GetChilindoImages', req, 'carrier.GetChilindoImagesResp')
};

/**
 * 标记一图找货图片
 * @export
 * @param {*} params
 * @returns
 */
export function tagChilindoImage(params) {
    const req = request.create('TagChilindoImageReq', params)
    return request('carrier', 'CarrierService.TagChilindoImage', req, 'carrier.TagChilindoImageResp')
};

/**
 * 批量添加任务
 * @export
 * @param {*} params
 * @returns
 */
export function batchAddTask(params) {
    const req = request.create('BatchAddTaskReq', params)
    return request('carrier', 'CarrierService.BatchAddTask', req, 'carrier.BatchAddTaskResp')
};

/**
 * 同义词列表
 * @export
 * @param {*} params
 * @returns
 */
export function synonymWordsList(params) {
    const req = request.create('SynonymWordsListReq', params)
    return request('product', 'ProductSearchBossService.SynonymWordsList', req, 'product.SynonymWordsListResp')
};

/**
 * 同义词新增或编辑
 * @export
 * @param {*} params
 * @returns
 */
export function synonymWordsAddOrEdit(params) {
    const req = request.create('SynonymWordsAddOrEditReq', params)
    return request('product', 'ProductSearchBossService.SynonymWordsAddOrEdit', req, 'product.SynonymWordsAddOrEditResp')
};

/**
 * 同义词删除
 * @export
 * @param {*} params
 * @returns
 */
export function synonymWordsDelete(params) {
    const req = request.create('SynonymWordsDeleteReq', params)
    return request('product', 'ProductSearchBossService.SynonymWordsDelete', req, 'product.SynonymWordsDeleteResp')
};

/**
 * 敏感词列表
 * @export
 * @param {*} params
 * @returns
 */
export function sensitiveWordsList(params) {
    const req = request.create('SensitiveWordsListReq', params)
    return request('product', 'ProductSearchBossService.SensitiveWordsList', req, 'product.SensitiveWordsListResp')
};

/**
 * 敏感词新增或编辑
 * @export
 * @param {*} params
 * @returns
 */
export function sensitiveWordsAddOrEdit(params) {
    const req = request.create('SensitiveWordsAddOrEditReq', params)
    return request('product', 'ProductSearchBossService.SensitiveWordsAddOrEdit', req, 'product.SensitiveWordsAddOrEditResp')
};

/**
 * 敏感词删除
 * @export
 * @param {*} params
 * @returns
 */
export function sensitiveWordsDelete(params) {
    const req = request.create('SensitiveWordsDeleteReq', params)
    return request('product', 'ProductSearchBossService.SensitiveWordsDelete', req, 'product.SensitiveWordsDeleteResp')
};

/**
 * 创建找低价同款任务
 * @export
 * @param {*} params
 * @returns
 */
export function createSameKindTask(params) {
    const req = request.create('CreateSameKindTaskReq', params)
    return request('carrier', 'CarrierService.CreateSameKindTask', req, 'carrier.CreateSameKindTaskResp')
};

/**
 * 找低价同款任务列表
 * @export
 * @param {*} params
 * @returns
 */
export function sameKindTaskList(params) {
    const req = request.create('SameKindTaskListReq', params)
    return request('carrier', 'CarrierService.SameKindTaskList', req, 'carrier.SameKindTaskListResp')
};

/**
 * 查看结果
 * @export
 * @param {*} params
 * @returns
 */
export function sameKindResult(params) {
    const req = request.create('SameKindResultReq', params)
    return request('carrier', 'CarrierService.SameKindResult', req, 'carrier.SameKindResultResp')
};


/**
 * 查看结果
 * @export
 * @param {*} params
 * @returns
 */
export function supplierAuditList(params) {
    const req = request.create('SupplierProductAuditListReq', params)
    return request('product', 'SupplierProductService.SupplierAuditList', req, 'SupplierProductAuditListResp')
};


/**
 * 获取一条商家平台草稿箱记录
 * @export
 * @param {*} params
 * @returns
 */
export function getSupplierDraftById(params) {
    const req = request.create('GetDraftByIdReq', params)
    return request('product', 'ProductService.GetSupplierDraftById', req, 'GetDraftByIdResp')
};


/**
 * 商家发布审核不通过
 * @export
 * @param {*} params
 * @returns
 */
export function refuseSupplierDraft(params) {
    const req = request.create('RefuseSupplierDraftReq', params)
    return request('product', 'ProductService.RefuseSupplierDraft', req, 'RecommendConfigResp')
};
/**
 * 直播商品
 * @export
 */
// 商品直播链接列表
export function LiveProductList (params) {
    const req = request.create('LiveProductListReq', params)
    return request('product', 'LiveProductService.LiveProductList', req, 'LiveProductListResp')
}
// 商品直播链接删除
export function DeleteLiveProduct (params) {
    const req = request.create('DeleteLiveProductReq', params)
    return request('product', 'LiveProductService.DeleteLiveProduct', req, 'DeleteLiveProductResp')
}
// 新增或编辑商品直播链接
export function UpdateOrInsertLiveProduct (params) {
    const req = request.create('UpdateOrInsertLiveProductReq', params)
    return request('product', 'LiveProductService.UpdateOrInsertLiveProduct', req, 'UpdateOrInsertLiveProductResp')
}
/**
 * 类目
 * @export
 */
// 类目星标
export function CategoryStar (params) {
    const req = request.create('CategoryStarReq', params)
    return request('product', 'ProductCategoryService.CategoryStar', req, 'CategoryStarResp')
}

/**
 * 根据sku查询spu信息
 * @export
 */
export function getSpuInfoBySku (params) {
    const req = request.create('GetSkuInfoBySkuIdReq', params)
    return request('product', 'ProductService.GetSkuInfoBySkuId', req, 'GetSkuInfoBySkuIdResp')
}

/**
 * 商品选品服务
 * @export
 */
// 商品选品分类列表
export function ListProductSelectPage (params) {
    const req = request.create('ListProductSelectReq', params)
    return request('product', 'ProductSelectService.ListProductSelectPage', req, 'ListProductSelectResp')
}

// 匹配供应商
export function SearchSupplierByImage (params) {
    const req = request.create('SearchSupplierByImageReq', params)
    return request('product', 'ProductSelectService.SearchSupplierByImage', req, 'SearchSupplierByImageResp')
}

// 确认商品选择
export function ConfirmProduct (params) {
    const req = request.create('ConfirmProductReq', params)
    return request('product', 'ProductSelectService.ConfirmProduct', req, 'ConfirmProductResp')
}

// 弃用商品
export function DeleteProduct (params) {
    const req = request.create('product.DeleteProductReq', params)
    return request('product', 'ProductSelectService.DeleteProduct', req, 'product.DeleteProductResp')
}

// 商品选品分类导出
export function ListProductSelectExport (params) {
    const req = request.create('ListProductSelectReq', params)
    return request('product', 'ProductSelectService.ListProductSelectExport', req, 'ListProductSelectExportResp')
}
/**
 * 店群类目映射
 * @params 类目映射查询条件
 */
export function CategoryMappingQuery (params) {
    const req = request.create('CategoryMappingQueryReq', params)
    return request('product', 'ProductCategoryService.CategoryMappingList', req, 'category.CategoryMappingQueryResp')
}
//查询第三方类目
export function CategoryLazadaList (params) {
    const req = request.create('CategoryLazadaQueryReq', params)
    return request('product', 'ProductCategoryService.CategoryLazadaList', req, 'category.CategoryLazadaQueryResp')
}
//查询类目详情
export function GetCateMappingDetail (params) {
    const req = request.create('GetCateMappingDetailReq', params)
    return request('product', 'ProductCategoryService.GetCateMappingDetail', req, 'GetCateMappingDetailResp')
}
//更新类目
export function UpdateCategoryMapping (params) {
    const req = request.create('UpdateCategoryMappingReq', params)
    return request('product', 'ProductCategoryService.UpdateCategoryMapping', req, 'category.UpdateCategoryMappingResp')
}
/**
 * 店群商品管理
 * @params 店群商品管理查询条件
 */
export function ListProduct (params) {
    const req = request.create('ListProductReq', params)
    return request('product', 'LazadaProductService.ListProduct', req, 'lazada.ListProductResp')
}
//获取国家和店铺信息
export function GetPublishInfo (params) {
    const req = request.create('GetPublishInfoReq', params)
    return request('product', 'LazadaProductService.GetPublishInfo', req, 'lazada.GetPublishInfoResp')
}
//发布商品
export function PublishProduct (params) {
    const req = request.create('PublishProductReq', params)
    return request('product', 'LazadaProductService.PublishProduct', req, 'lazada.PublishProductResp')
}