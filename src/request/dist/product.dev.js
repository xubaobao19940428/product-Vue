"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.productAttrGet = productAttrGet;
exports.productAttrAdd = productAttrAdd;
exports.productAttrDisable = productAttrDisable;
exports.productAttrValueDisable = productAttrValueDisable;
exports.productAttrGetById = productAttrGetById;
exports.productAttrModify = productAttrModify;
exports.productAttrGetByIdBatch = productAttrGetByIdBatch;
exports.addCustomizeAttrValue = addCustomizeAttrValue;
exports.productAttrDownload = productAttrDownload;
exports.translateSelectedAttr = translateSelectedAttr;
exports.productAttrValueGet = productAttrValueGet;
exports.updateAttrTranslateById = updateAttrTranslateById;
exports.productAttrValueDownload = productAttrValueDownload;
exports.uploadAttrTranslate = uploadAttrTranslate;
exports.uploadAttrValueTranslate = uploadAttrValueTranslate;
exports.categoryListGet = categoryListGet;
exports.CategoryGroupListGet = CategoryGroupListGet;
exports.CategoryGroupAddOrUpdate = CategoryGroupAddOrUpdate;
exports.CategoryGroupGet = CategoryGroupGet;
exports.CategoryGroupSort = CategoryGroupSort;
exports.CategoryGroupDelete = CategoryGroupDelete;
exports.categoryAdd = categoryAdd;
exports.categoryDelete = categoryDelete;
exports.categoryChangeToSort = categoryChangeToSort;
exports.categoryUpdate = categoryUpdate;
exports.categoryQueryByName = categoryQueryByName;
exports.categoryHiddenOrShow = categoryHiddenOrShow;
exports.categoryChangSort = categoryChangSort;
exports.getUpperRelatedCategoryById = getUpperRelatedCategoryById;
exports.getProductTypeList = getProductTypeList;
exports.get1688Pic = get1688Pic;
exports.getProductEnumInfo = getProductEnumInfo;
exports.insertProduct = insertProduct;
exports.updateProduct = updateProduct;
exports.disableProduct = disableProduct;
exports.listProduct = listProduct;
exports.viewProductInfo = viewProductInfo;
exports.compositeSlaveSkuInfoQuery = compositeSlaveSkuInfoQuery;
exports.productExport = productExport;
exports.listCategoryProduct = listCategoryProduct;
exports.changeCategoryProductSort = changeCategoryProductSort;
exports.setCategoryProductTop = setCategoryProductTop;
exports.copyFrontCategory = copyFrontCategory;
exports.getProductSkuInfoBySkuCode = getProductSkuInfoBySkuCode;
exports.listAllProductPriceTemplate = listAllProductPriceTemplate;
exports.addNewProductPriceTemplate = addNewProductPriceTemplate;
exports.updateProductPriceTemplate = updateProductPriceTemplate;
exports.changePriceTemplateEffectStatus = changePriceTemplateEffectStatus;
exports.getTemplateByCategoryId = getTemplateByCategoryId;
exports.brandInfoAdd = brandInfoAdd;
exports.brandInfoModify = brandInfoModify;
exports.brandInfoGet = brandInfoGet;
exports.brandChangeStatus = brandChangeStatus;
exports.brandDelete = brandDelete;
exports.brandPage = brandPage;
exports.exchangeGetRecentRateTemplate = exchangeGetRecentRateTemplate;
exports.ExchangeGetReadyConfigTemplate = ExchangeGetReadyConfigTemplate;
exports.exchangeSaveRate = exchangeSaveRate;
exports.exchangeReview = exchangeReview;
exports.exchangeGetRateSaveHistory = exchangeGetRateSaveHistory;
exports.exchangeGetRate = exchangeGetRate;
exports.exchangeConvert = exchangeConvert;
exports.getProductSpu = getProductSpu;
exports.getProductSku = getProductSku;
exports.oneKeyUploadProduct = oneKeyUploadProduct;
exports.checkToBeConfirm = checkToBeConfirm;
exports.deleteDrafts = deleteDrafts;
exports.listDrafts = listDrafts;
exports.updateDraft = updateDraft;
exports.getDraftById = getDraftById;
exports.getDraftOperatorList = getDraftOperatorList;
exports.advanceSaleSkuInfoGet = advanceSaleSkuInfoGet;
exports.advanceSaleAdd = advanceSaleAdd;
exports.advanceSaleList = advanceSaleList;
exports.advanceSaleGet = advanceSaleGet;
exports.advanceSaleUpload = advanceSaleUpload;
exports.advanceSaleUpdate = advanceSaleUpdate;
exports.advanceSaleDownload = advanceSaleDownload;
exports.manualPushAdvancePurchase = manualPushAdvancePurchase;
exports.createUploadTask = createUploadTask;
exports.getShelveList = getShelveList;
exports.batchAcceptShelveAdviceCheck = batchAcceptShelveAdviceCheck;
exports.batchAcceptShelveAdvice = batchAcceptShelveAdvice;
exports.batchOnShelveCheck = batchOnShelveCheck;
exports.batchOnShelve = batchOnShelve;
exports.batchOffShelve = batchOffShelve;
exports.changeSaleStatus = changeSaleStatus;
exports.getTaskList = getTaskList;
exports.stopTask = stopTask;
exports.getChilindoImages = getChilindoImages;
exports.tagChilindoImage = tagChilindoImage;
exports.batchAddTask = batchAddTask;
exports.synonymWordsList = synonymWordsList;
exports.synonymWordsAddOrEdit = synonymWordsAddOrEdit;
exports.synonymWordsDelete = synonymWordsDelete;
exports.sensitiveWordsList = sensitiveWordsList;
exports.sensitiveWordsAddOrEdit = sensitiveWordsAddOrEdit;
exports.sensitiveWordsDelete = sensitiveWordsDelete;
exports.createSameKindTask = createSameKindTask;
exports.sameKindTaskList = sameKindTaskList;
exports.sameKindResult = sameKindResult;
exports.supplierAuditList = supplierAuditList;
exports.getSupplierDraftById = getSupplierDraftById;
exports.refuseSupplierDraft = refuseSupplierDraft;
exports.LiveProductList = LiveProductList;
exports.DeleteLiveProduct = DeleteLiveProduct;
exports.UpdateOrInsertLiveProduct = UpdateOrInsertLiveProduct;
exports.CategoryStar = CategoryStar;
exports.getSpuInfoBySku = getSpuInfoBySku;

var _request = _interopRequireDefault(require("./request"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * 属性管理列表
 * @export
 * @param {*} params
 * @returns
 */
function productAttrGet(params) {
  console.log(params);

  var req = _request["default"].create('ProductAttrGetReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.ProductAttrGet', req, 'attribute.ProductAttrGetResp');
}

;
/**
 * 添加商品属性
 * @export
 * @param {*} params
 * @returns
 */

function productAttrAdd(params) {
  console.log(params);

  var req = _request["default"].create('ProductAttrAddReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.ProductAttrAdd', req, 'attribute.ProductAttrAddResp');
}

;
/**
 * 失效商品属性
 * @export
 * @param {*} params
 * @returns
 */

function productAttrDisable(params) {
  console.log(params);

  var req = _request["default"].create('ProductAttrDisableReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.ProductAttrDisable', req, 'attribute.ProductAttrDisableResp');
}

;
/**
 * 失效商品属性值
 * @export
 * @param {*} params
 * @returns
 */

function productAttrValueDisable(params) {
  console.log(params);

  var req = _request["default"].create('ProductAttrValueDisableReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.ProductAttrValueDisable', req, 'attribute.ProductAttrValueDisableResp');
}

;
/**
 * 根据id获取属性信息
 * @export
 * @param {*} params
 * @returns
 */

function productAttrGetById(params) {
  var req = _request["default"].create('ProductAttrGetByIdReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.ProductAttrGetById', req, 'attribute.ProductAttrGetByIdResp');
}

;
/**
 * 修改商品属性
 * @export
 * @param {*} params
 * @returns
 */

function productAttrModify(params) {
  console.log(params);

  var req = _request["default"].create('ProductAttrModifyReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.ProductAttrModify', req, 'attribute.ProductAttrModifyResp');
}

;
/**
 * 批量获取类目商品属性
 * @export
 * @param {*} params
 * @returns
 */

function productAttrGetByIdBatch(params) {
  console.log(params);

  var req = _request["default"].create('ProductAttrGetByIdBatchReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.ProductAttrGetByIdBatch', req, 'attribute.ProductAttrGetByIdBatchResp');
}

;
/**
 * 向属性下添加一个自定义属性值, 并返回添加后的属性信息及属性值列表信息
 * @export
 * @param {*} params
 * @returns
 */

function addCustomizeAttrValue(params) {
  console.log(params);

  var req = _request["default"].create('AddCustomizeAttrValueReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.AddCustomizeAttrValue', req, 'attribute.AddCustomizeAttrValueResp');
}

; // /**
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

function productAttrDownload(params) {
  var req = _request["default"].create('ProductAttrDownloadReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.ProductAttrDownload', req, 'attribute.ProductAttrDownloadResp');
}

;
/**
 * 一键翻译选择的属性/属性值
 * @export
 * @param {*} params
 * @returns
 */

function translateSelectedAttr(params) {
  var req = _request["default"].create('TranslateSelectedAttrReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.TranslateSelectedAttr', req, 'attribute.TranslateSelectedAttrResp');
}

;
/**
 * 属性值分页获取
 * @export
 * @param {*} params
 * @returns
 */

function productAttrValueGet(params) {
  var req = _request["default"].create('ProductAttrValueGetReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.ProductAttrValueGet', req, 'attribute.ProductAttrValueGetResp');
}

;
/**
 * 属性值更新翻译信息
 * @export
 * @param {*} params
 * @returns
 */

function updateAttrTranslateById(params) {
  var req = _request["default"].create('UpdateAttrTranslateByIdReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.UpdateAttrTranslateById', req, 'attribute.UpdateAttrTranslateByIdResp');
}

;
/**
 * 属性值下载
 * @export
 * @param {*} params
 * @returns
 */

function productAttrValueDownload(params) {
  var req = _request["default"].create('ProductAttrValueDownloadReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.ProductAttrValueDownload', req, 'attribute.ProductAttrValueDownloadResp');
}

;
/**
 * 上传文件方式更新属性翻译信息
 * @export
 * @param {*} params
 * @returns
 */

function uploadAttrTranslate(params) {
  var req = _request["default"].create('UploadAttrTranslateReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.UploadAttrTranslate', req, 'attribute.UploadAttrTranslateResp');
}

;
/**
 * 上传文件方式更新属性值翻译信息
 * @export
 * @param {*} params
 * @returns
 */

function uploadAttrValueTranslate(params) {
  var req = _request["default"].create('UploadAttrValueTranslateReq', params);

  return (0, _request["default"])('product', 'ProductAttrService.UploadAttrValueTranslate', req, 'attribute.UploadAttrValueTranslateResp');
}

;
/**
 * 获取类目列表
 * @export
 * @param {*} params
 * @returns
 */

function categoryListGet(params) {
  console.log(params);

  var req = _request["default"].create('CategoryListGetReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryListGet', req, 'category.CategoryListGetResp');
}

;
/**
 * 获取分组
 * @export
 * @param {*} params
 * @returns
 */

function CategoryGroupListGet(params) {
  console.log(params);

  var req = _request["default"].create('CategoryGroupListGetReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryGroupListGet', req, 'category.CategoryGroupListGetResp');
}

;
/**
 * 新增编辑分组管理
 * @export
 * @param {*} params
 * @returns
 */

function CategoryGroupAddOrUpdate(params) {
  console.log(params);

  var req = _request["default"].create('CategoryGroupAddOrUpdateReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryGroupAddOrUpdate', req, 'category.CategoryGroupAddOrUpdateResp');
}

;
/**
 * 类目分组详情
 * @export
 * @param {*} params
 * @returns
 */

function CategoryGroupGet(params) {
  console.log(params);

  var req = _request["default"].create('CategoryGroupGetReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryGroupGet', req, 'category.CategoryGroupGetResp');
}

;
/**
 * 类目分组排序
 * @export
 * @param {*} params
 * @returns
 */

function CategoryGroupSort(params) {
  console.log(params);

  var req = _request["default"].create('CategoryGroupSortReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryGroupSort', req, 'category.CategoryGroupSortResp');
}

;
/**
 * 类目分组删除
 * @export
 * @param {*} params
 * @returns
 */

function CategoryGroupDelete(params) {
  console.log(params);

  var req = _request["default"].create('CategoryGroupDeleteReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryGroupDelete', req, 'category.CategoryGroupDeleteResp');
}

;
/**
 * 增加类目
 * @export
 * @param {*} params
 * @returns
 */

function categoryAdd(params) {
  console.log(params);

  var req = _request["default"].create('CategoryAddReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryAdd', req, 'category.CategoryAddResp');
}

;
/**
 * 删除类目
 * @export
 * @param {*} params
 * @returns
 */

function categoryDelete(params) {
  console.log(params);

  var req = _request["default"].create('CategoryDeleteReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryDelete', req, 'category.CategoryDeleteResp');
}

;
/**
 * 类目排序
 * @export
 * @param {*} params
 * @returns
 */

function categoryChangeToSort(params) {
  console.log(params);

  var req = _request["default"].create('CategoryChangeToSortReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryChangeToSort', req, 'category.CategoryChangeToSortResp');
}

;
/**
 * 编辑类目
 * @export
 * @param {*} params
 * @returns
 */

function categoryUpdate(params) {
  console.log(params);

  var req = _request["default"].create('CategoryUpdateReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryUpdate', req, 'category.CategoryUpdateResp');
}

;
/**
 * 模糊查询类目
 * @export
 * @param {*} params
 * @returns
 */

function categoryQueryByName(params) {
  console.log(params);

  var req = _request["default"].create('CategoryQueryByNameReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryQueryByName', req, 'CategoryQueryByNameResp');
}

;
/**
 * 隐藏或显示类目 status: 1显示/0隐藏
 * @export
 * @param {*} params
 * @returns
 */

function categoryHiddenOrShow(params) {
  console.log(params);

  var req = _request["default"].create('CategoryHiddenOrShowReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryHiddenOrShow', req, 'CategoryHiddenOrShowResp');
}
/**
 * 类目拖拽排序
 * @export
 * @param {*} params
 * @returns
 */


function categoryChangSort(params) {
  console.log(params);

  var req = _request["default"].create('CategoryChangSortReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryChangSort', req, 'CategoryChangSortResp');
}

;
/**
 * 获取关联上级类目信息
 * @export
 * @param {*} params
 * @returns
 */

function getUpperRelatedCategoryById(params) {
  console.log(params);

  var req = _request["default"].create('GetUpperRelatedCategoryByIdReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.GetUpperRelatedCategoryById', req, 'category.GetUpperRelatedCategoryByIdResp');
}

;
/**
 * 获取商品类型列表
 * @export
 * @param {*} params
 * @returns
 */

function getProductTypeList(params) {
  console.log(params);

  var req = _request["default"].create('GetProductTypeListReq', params);

  return (0, _request["default"])('product', 'ProductService.GetProductTypeList', req, 'product.GetProductTypeListResp');
}

;
/**
 * 获取1688详情图和主图
 * @export
 * @param {*} params
 * @returns
 */

function get1688Pic(params) {
  console.log(params);

  var req = _request["default"].create('Get1688PicReq', params);

  return (0, _request["default"])('product', 'ProductService.Get1688Pic', req, 'product.Get1688PicResp');
}

;
/**
 * 获取后台支持的枚举信息
 * @export
 * @param {*} params
 * @returns
 */

function getProductEnumInfo(params) {
  console.log(params);

  var req = _request["default"].create('GetProductEnumInfoReq', params);

  return (0, _request["default"])('product', 'ProductService.GetProductEnumInfo', req, 'product.GetProductEnumInfoResp');
}

;
/**
 * 新增商品
 * @export
 * @param {*} params
 * @returns
 */

function insertProduct(params) {
  console.log(params);

  var req = _request["default"].create('InsertProductReq', params);

  return (0, _request["default"])('product', 'ProductService.InsertProduct', req, 'product.InsertProductResp');
}

;
/**
 * 编辑商品
 * @export
 * @param {*} params
 * @returns
 */

function updateProduct(params) {
  console.log(params);

  var req = _request["default"].create('UpdateProductReq', params);

  return (0, _request["default"])('product', 'ProductService.UpdateProduct', req, 'product.UpdateProductResp');
}

;
/**
 * 删除商品
 * @export
 * @param {*} params
 * @returns
 */

function disableProduct(params) {
  console.log(params);

  var req = _request["default"].create('DisableProductReq', params);

  return (0, _request["default"])('product', 'ProductService.DisableProduct', req, 'product.DisableProductResp');
}

;
/**
 * 商品列表
 * @export
 * @param {*} params
 * @returns
 */

function listProduct(params) {
  console.log(params);

  var req = _request["default"].create('ListProductReq', params);

  return (0, _request["default"])('product', 'ProductService.ListProduct', req, 'product.ListProductResp');
}

;
/**
 * 根据商品ID查看商品详情
 * @export
 * @param {*} params
 * @returns
 */

function viewProductInfo(params) {
  console.log(params);

  var req = _request["default"].create('ViewProductInfoReq', params);

  return (0, _request["default"])('product', 'ProductService.ViewProductInfo', req, 'product.ViewProductInfoResp');
}

;
/**
 * 添加组合商品时 根据 sku_id 查询组合商品
 * @export
 * @param {*} params
 * @returns
 */

function compositeSlaveSkuInfoQuery(params) {
  console.log(params);

  var req = _request["default"].create('CompositeSlaveSkuInfoQueryReq', params);

  return (0, _request["default"])('product', 'ProductService.CompositeSlaveSkuInfoQuery', req, 'product.CompositeSlaveSkuInfoQueryResp');
}

;
/**
 * 商品导出
 * @export
 * @param {*} params
 * @returns
 */

function productExport(params) {
  var req = _request["default"].create('ProductExportReq', params);

  return (0, _request["default"])('product', 'ProductService.ProductExport', req, 'product.ProductExportResp');
}

; // 类目商品排序列表

function listCategoryProduct(params) {
  console.log(params);

  var req = _request["default"].create('ListCategoryProductReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.ListCategoryProduct', req, 'ListCategoryProductResp');
} // 修改商品的后台类目排序值


function changeCategoryProductSort(params) {
  console.log(params);

  var req = _request["default"].create('ChangeCategoryProductSortReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.ChangeCategoryProductSort', req, 'ChangeCategoryProductSortResp');
} // 置顶


function setCategoryProductTop(params) {
  console.log(params);

  var req = _request["default"].create('SetCategoryProductTopReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.SetCategoryProductTop', req, 'SetCategoryProductTopResp');
}
/**
 * 复制前台类目
 * @export
 * @param {*} params
 * @returns
 */


function copyFrontCategory(params) {
  var req = _request["default"].create('CopyFrontCategoryReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CopyFrontCategory', req, 'category.CopyFrontCategoryResp');
}

; // 根据sku code获取sku 信息

function getProductSkuInfoBySkuCode(params) {
  console.log(params);

  var req = _request["default"].create('GetProductSkuInfoBySkuCodeReq', params);

  return (0, _request["default"])('product', 'ProductService.GetProductSkuInfoBySkuCode', req, 'GetProductSkuInfoBySkuCodeResp');
}
/**
 * 定价模板
 */
// 获取所有商品价格模版


function listAllProductPriceTemplate(params) {
  var req = _request["default"].create('ListProductPriceTemplateReq', params);

  return (0, _request["default"])('product', 'ProductPriceTemplateService.ListProductPriceTemplate', req, 'ListProductPriceTemplateResp');
} // 新增商品价格模版


function addNewProductPriceTemplate(params) {
  var req = _request["default"].create('AddNewProductPriceTemplateReq', params);

  return (0, _request["default"])('product', 'ProductPriceTemplateService.AddNewProductPriceTemplate', req, 'AddNewProductPriceTemplateResp');
} // 更新商品价格模版


function updateProductPriceTemplate(params) {
  console.log(params);

  var req = _request["default"].create('UpdateProductPriceTemplateReq', params);

  return (0, _request["default"])('product', 'ProductPriceTemplateService.UpdateProductPriceTemplate', req, 'UpdateProductPriceTemplateResp');
} // 停用定价模板


function changePriceTemplateEffectStatus(params) {
  var req = _request["default"].create('ChangePriceTemplateEffectStatusReq', params);

  return (0, _request["default"])('product', 'ProductPriceTemplateService.ChangePriceTemplateEffectStatus', req, 'ChangePriceTemplateEffectStatusResp');
}
/**
 * 通过类目id获取商品价格模版
 * @export
 * @param {*} params
 * @returns
 */


function getTemplateByCategoryId(params) {
  console.log(params);

  var req = _request["default"].create('GetTemplateByCategoryIdReq', params);

  return (0, _request["default"])('product', 'ProductPriceTemplateService.GetTemplateByCategoryId', req, 'price.GetTemplateByCategoryIdResp');
}

;
/**
 * 添加品牌
 * @export
 * @param {*} params
 * @returns
 */

function brandInfoAdd(params) {
  console.log(params);

  var req = _request["default"].create('BrandInfoAddReq', params);

  return (0, _request["default"])('product', 'ProductBrandService.BrandInfoAdd', req, 'brand.BrandInfoAddResp');
}

;
/**
 * 编辑品牌
 * @export
 * @param {*} params
 * @returns
 */

function brandInfoModify(params) {
  console.log(params);

  var req = _request["default"].create('BrandInfoModifyReq', params);

  return (0, _request["default"])('product', 'ProductBrandService.BrandInfoModify', req, 'brand.BrandInfoModifyResp');
}

;
/**
 * 获取品牌列表
 * @export
 * @param {*} params
 * @returns
 */

function brandInfoGet(params) {
  console.log(params);

  var req = _request["default"].create('BrandInfoGetReq', params);

  return (0, _request["default"])('product', 'ProductBrandService.BrandInfoGet', req, 'brand.BrandInfoGetResp');
}

;
/**
 * 启用, 禁用品牌
 * @export
 * @param {*} params
 * @returns
 */

function brandChangeStatus(params) {
  console.log(params);

  var req = _request["default"].create('BrandChangeStatusReq', params);

  return (0, _request["default"])('product', 'ProductBrandService.BrandChangeStatus', req, 'brand.BrandChangeStatusResp');
}

;
/**
 * 删除品牌
 * @export
 * @param {*} params
 * @returns
 */

function brandDelete(params) {
  console.log(params);

  var req = _request["default"].create('BrandDeleteReq', params);

  return (0, _request["default"])('product', 'ProductBrandService.BrandDelete', req, 'brand.BrandDeleteResp');
}

;
/**
 * 品牌分页
 * @export
 * @param {*} params
 * @returns
 */

function brandPage(params) {
  console.log(params);

  var req = _request["default"].create('BrandPageReq', params);

  return (0, _request["default"])('product', 'ProductBrandService.BrandPage', req, 'brand.BrandPageResp');
}

;
/**
 * 汇率模板
 */
// 当前正在使用汇率模板

function exchangeGetRecentRateTemplate(params) {
  var req = _request["default"].create('ExchangeGetRecentRateTemplateReq', params);

  return (0, _request["default"])('i18n', 'ExchangeService.ExchangeGetRecentRateTemplate', req, 'ExchangeGetRecentRateTemplateResp');
} // 汇率列表


function ExchangeGetReadyConfigTemplate(params) {
  var req = _request["default"].create('ExchangeGetReadyConfigTemplateReq', params);

  return (0, _request["default"])('i18n', 'ExchangeService.ExchangeGetReadyConfigTemplate', req, 'ExchangeGetReadyConfigTemplateResp');
} // 保存汇率模板


function exchangeSaveRate(params) {
  var req = _request["default"].create('ExchangeSaveRateReq', params);

  return (0, _request["default"])('i18n', 'ExchangeService.ExchangeSaveRate', req, 'ExchangeSaveRateResp');
} // 审核


function exchangeReview(params) {
  var req = _request["default"].create('ExchangeReviewReq', params);

  return (0, _request["default"])('i18n', 'ExchangeService.ExchangeReview', req, 'ExchangeReviewResp');
} // 汇率模板编辑记录


function exchangeGetRateSaveHistory(params) {
  console.log(params);

  var req = _request["default"].create('ExchangeGetRateSaveHistoryReq', params);

  return (0, _request["default"])('i18n', 'ExchangeService.ExchangeGetRateSaveHistory', req, 'ExchangeGetRateSaveHistoryResp');
} // 获取货币间转换汇率


function exchangeGetRate(params) {
  var req = _request["default"].create('ExchangeGetRateReq', params);

  return (0, _request["default"])('i18n', 'ExchangeService.ExchangeGetRate', req, 'ExchangeGetRateResp');
} // 根据当前配置汇率获得转换后价格


function exchangeConvert(params) {
  var req = _request["default"].create('ExchangeConvertReq', params);

  return (0, _request["default"])('i18n', 'ExchangeService.ExchangeConvert', req, 'ExchangeConvertResp');
} // 查询有效商品


function getProductSpu(params) {
  var req = _request["default"].create('GetProductSpuReq', params);

  return (0, _request["default"])('product', 'ProductService.GetProductSpu', req, 'GetProductSpuResp');
} // 查询商品sku


function getProductSku(params) {
  var req = _request["default"].create('GetProductSkuReq', params);

  return (0, _request["default"])('product', 'ProductService.GetProductSku', req, 'GetProductSkuResp');
}
/**
 * 根据外源商品id一键上货
 * @export
 * @param {*} params
 * @returns
 */


function oneKeyUploadProduct(params) {
  var req = _request["default"].create('OneKeyUploadProductReq', params);

  return (0, _request["default"])('product', 'ProductService.OneKeyUploadProduct', req, 'product.OneKeyUploadProductResp');
}

;
/**
 * 确认上传
 * @export
 * @param {*} params
 * @returns
 */

function checkToBeConfirm(params) {
  var req = _request["default"].create('CheckToBeConfirmReq', params);

  return (0, _request["default"])('product', 'ProductService.CheckToBeConfirm', req, 'product.CheckToBeConfirmResp');
}

;
/**
 * 草稿箱批量删除记录
 * @export
 * @param {*} params
 * @returns
 */

function deleteDrafts(params) {
  var req = _request["default"].create('DeleteDraftsReq', params);

  return (0, _request["default"])('product', 'ProductService.DeleteDrafts', req, 'product.DeleteDraftsResp');
}

;
/**
 * 列表展示草稿箱记录
 * @export
 * @param {*} params
 * @returns
 */

function listDrafts(params) {
  var req = _request["default"].create('ListDraftsReq', params);

  return (0, _request["default"])('product', 'ProductService.ListDrafts', req, 'product.ListDraftsResp');
}

;
/**
 * 暂存草稿箱记录
 * @export
 * @param {*} params
 * @returns
 */

function updateDraft(params) {
  var req = _request["default"].create('UpdateDraftReq', params);

  return (0, _request["default"])('product', 'ProductService.UpdateDraft', req, 'product.UpdateDraftResp');
}

;
/**
 * 获取一条草稿箱记录
 * @export
 * @param {*} params
 * @returns
 */

function getDraftById(params) {
  var req = _request["default"].create('GetDraftByIdReq', params);

  return (0, _request["default"])('product', 'ProductService.GetDraftById', req, 'product.GetDraftByIdResp');
}

;
/**
 * 获取草稿箱记录创建者id列表
 * @export
 * @param {*} params
 * @returns
 */

function getDraftOperatorList(params) {
  var req = _request["default"].create('GetDraftOperatorListReq', params);

  return (0, _request["default"])('product', 'ProductService.GetDraftOperatorList', req, 'product.GetDraftOperatorListResp');
}

;
/**
 * 预售输入商品id后点击确定时调用
 * @export
 * @param {*} params
 * @returns
 */

function advanceSaleSkuInfoGet(params) {
  var req = _request["default"].create('AdvanceSaleSkuInfoGetReq', params);

  return (0, _request["default"])('product', 'ProductService.AdvanceSaleSkuInfoGet', req, 'product.AdvanceSaleSkuInfoGetResp');
}

;
/**
 * 预售输入商品id后点击确定时调用
 * @export
 * @param {*} params
 * @returns
 */

function advanceSaleAdd(params) {
  var req = _request["default"].create('AdvanceSaleAddReq', params);

  return (0, _request["default"])('product', 'ProductService.AdvanceSaleAdd', req, 'product.AdvanceSaleAddResp');
}

;
/**
 * 预售信息列表
 * @export
 * @param {*} params
 * @returns
 */

function advanceSaleList(params) {
  var req = _request["default"].create('AdvanceSaleListReq', params);

  return (0, _request["default"])('product', 'ProductService.AdvanceSaleList', req, 'product.AdvanceSaleListResp');
}

;
/**
 * 获取某个预售的信息
 * @export
 * @param {*} params
 * @returns
 */

function advanceSaleGet(params) {
  var req = _request["default"].create('AdvanceSaleGetReq', params);

  return (0, _request["default"])('product', 'ProductService.AdvanceSaleGet', req, 'product.AdvanceSaleGetResp');
}

;
/**
 * 上传文件新建预售
 * @export
 * @param {*} params
 * @returns
 */

function advanceSaleUpload(params) {
  var req = _request["default"].create('AdvanceSaleUploadReq', params);

  return (0, _request["default"])('product', 'ProductService.AdvanceSaleUpload', req, 'product.AdvanceSaleUploadResp');
}

;
/**
 * 更新预售信息
 * @export
 * @param {*} params
 * @returns
 */

function advanceSaleUpdate(params) {
  var req = _request["default"].create('AdvanceSaleUpdateReq', params);

  return (0, _request["default"])('product', 'ProductService.AdvanceSaleUpdate', req, 'product.AdvanceSaleUpdateResp');
}

;
/**
 * 下载指定预售记录
 * @export
 * @param {*} params
 * @returns
 */

function advanceSaleDownload(params) {
  var req = _request["default"].create('AdvanceSaleDownloadReq', params);

  return (0, _request["default"])('product', 'ProductService.AdvanceSaleDownload', req, 'product.AdvanceSaleDownloadResp');
}

;
/**
 * 手动推送采购单
 * @export
 * @param {*} params
 * @returns
 */

function manualPushAdvancePurchase(params) {
  var req = _request["default"].create('ManualPushAdvancePurchaseReq', params);

  return (0, _request["default"])('product', 'ProductService.ManualPushAdvancePurchase', req, 'product.ManualPushAdvancePurchaseResp');
}

;
/**
 * 电子化铺货
 * @export
 * @param {*} params
 * @returns
 */

function createUploadTask(params) {
  var req = _request["default"].create('CreateUploadTaskRequest', params);

  return (0, _request["default"])('carrier', 'CarrierService.CreateUploadTask', req, 'carrier.CreateUploadTaskResponse');
}

;
/**
 * 获取上下架管理列表
 * @export
 * @param {*} params
 * @returns
 */

function getShelveList(params) {
  var req = _request["default"].create('GetShelveListReq', params);

  return (0, _request["default"])('product', 'ProductBatchOperationService.GetShelveList', req, 'product.GetShelveListResp');
}

;
/**
 * 批量采纳建议检查
*/

function batchAcceptShelveAdviceCheck(params) {
  var req = _request["default"].create('BatchAcceptShelveAdviceCheckReq', params);

  return (0, _request["default"])('product', 'ProductBatchOperationService.BatchAcceptShelveAdviceCheck', req, 'product.BatchAcceptShelveAdviceCheckResp');
}

;
/**
 * 批量采纳检查
 * @export
 * @param {*} params
 * @returns
 */

function batchAcceptShelveAdvice(params) {
  var req = _request["default"].create('BatchAcceptShelveAdviceReq', params);

  return (0, _request["default"])('product', 'ProductBatchOperationService.BatchAcceptShelveAdvice', req, 'product.BatchAcceptShelveAdviceResp');
}

;
/**
 * 批量上架检查
 * @export
 * @param {*} params
 * @returns
 */

function batchOnShelveCheck(params) {
  var req = _request["default"].create('BatchOnShelveCheckReq', params);

  return (0, _request["default"])('product', 'ProductBatchOperationService.BatchOnShelveCheck', req, 'product.BatchOnShelveCheckResp');
}

;
/**
 * 批量上架确认
 * @export
 * @param {*} params
 * @returns
 */

function batchOnShelve(params) {
  var req = _request["default"].create('BatchOnShelveReq', params);

  return (0, _request["default"])('product', 'ProductBatchOperationService.BatchOnShelve', req, 'product.BatchOnShelveResp');
}

;
/**
 * 批量下架
 * @export
 * @param {*} params
 * @returns
 */

function batchOffShelve(params) {
  var req = _request["default"].create('BatchOffShelveReq', params);

  return (0, _request["default"])('product', 'ProductBatchOperationService.BatchOffShelve', req, 'product.BatchOffShelveResp');
}

;
/**
 * 改变sku在售状态
 * @export
 * @param {*} params
 * @returns
 */

function changeSaleStatus(params) {
  var req = _request["default"].create('ChangeSaleStatusReq', params);

  return (0, _request["default"])('product', 'ProductBatchOperationService.ChangeSaleStatus', req, 'product.ChangeSaleStatusResp');
}

;
/**
 * 获取任务列表
 * @export
 * @param {*} params
 * @returns
 */

function getTaskList(params) {
  var req = _request["default"].create('GetTaskListRequest', params);

  return (0, _request["default"])('carrier', 'CarrierService.GetTaskList', req, 'carrier.GetTaskListResponse');
}

;
/**
 * 停止任务
 * @export
 * @param {*} params
 * @returns
 */

function stopTask(params) {
  var req = _request["default"].create('StopTaskRequest', params);

  return (0, _request["default"])('carrier', 'CarrierService.StopTask', req, 'carrier.StopTaskResponse');
}

;
/**
 * 获取以图找货列表
 * @export
 * @param {*} params
 * @returns
 */

function getChilindoImages(params) {
  var req = _request["default"].create('GetChilindoImagesReq', params);

  return (0, _request["default"])('carrier', 'CarrierService.GetChilindoImages', req, 'carrier.GetChilindoImagesResp');
}

;
/**
 * 标记一图找货图片
 * @export
 * @param {*} params
 * @returns
 */

function tagChilindoImage(params) {
  var req = _request["default"].create('TagChilindoImageReq', params);

  return (0, _request["default"])('carrier', 'CarrierService.TagChilindoImage', req, 'carrier.TagChilindoImageResp');
}

;
/**
 * 批量添加任务
 * @export
 * @param {*} params
 * @returns
 */

function batchAddTask(params) {
  var req = _request["default"].create('BatchAddTaskReq', params);

  return (0, _request["default"])('carrier', 'CarrierService.BatchAddTask', req, 'carrier.BatchAddTaskResp');
}

;
/**
 * 同义词列表
 * @export
 * @param {*} params
 * @returns
 */

function synonymWordsList(params) {
  var req = _request["default"].create('SynonymWordsListReq', params);

  return (0, _request["default"])('product', 'ProductSearchBossService.SynonymWordsList', req, 'product.SynonymWordsListResp');
}

;
/**
 * 同义词新增或编辑
 * @export
 * @param {*} params
 * @returns
 */

function synonymWordsAddOrEdit(params) {
  var req = _request["default"].create('SynonymWordsAddOrEditReq', params);

  return (0, _request["default"])('product', 'ProductSearchBossService.SynonymWordsAddOrEdit', req, 'product.SynonymWordsAddOrEditResp');
}

;
/**
 * 同义词删除
 * @export
 * @param {*} params
 * @returns
 */

function synonymWordsDelete(params) {
  var req = _request["default"].create('SynonymWordsDeleteReq', params);

  return (0, _request["default"])('product', 'ProductSearchBossService.SynonymWordsDelete', req, 'product.SynonymWordsDeleteResp');
}

;
/**
 * 敏感词列表
 * @export
 * @param {*} params
 * @returns
 */

function sensitiveWordsList(params) {
  var req = _request["default"].create('SensitiveWordsListReq', params);

  return (0, _request["default"])('product', 'ProductSearchBossService.SensitiveWordsList', req, 'product.SensitiveWordsListResp');
}

;
/**
 * 敏感词新增或编辑
 * @export
 * @param {*} params
 * @returns
 */

function sensitiveWordsAddOrEdit(params) {
  var req = _request["default"].create('SensitiveWordsAddOrEditReq', params);

  return (0, _request["default"])('product', 'ProductSearchBossService.SensitiveWordsAddOrEdit', req, 'product.SensitiveWordsAddOrEditResp');
}

;
/**
 * 敏感词删除
 * @export
 * @param {*} params
 * @returns
 */

function sensitiveWordsDelete(params) {
  var req = _request["default"].create('SensitiveWordsDeleteReq', params);

  return (0, _request["default"])('product', 'ProductSearchBossService.SensitiveWordsDelete', req, 'product.SensitiveWordsDeleteResp');
}

;
/**
 * 创建找低价同款任务
 * @export
 * @param {*} params
 * @returns
 */

function createSameKindTask(params) {
  var req = _request["default"].create('CreateSameKindTaskReq', params);

  return (0, _request["default"])('carrier', 'CarrierService.CreateSameKindTask', req, 'carrier.CreateSameKindTaskResp');
}

;
/**
 * 找低价同款任务列表
 * @export
 * @param {*} params
 * @returns
 */

function sameKindTaskList(params) {
  var req = _request["default"].create('SameKindTaskListReq', params);

  return (0, _request["default"])('carrier', 'CarrierService.SameKindTaskList', req, 'carrier.SameKindTaskListResp');
}

;
/**
 * 查看结果
 * @export
 * @param {*} params
 * @returns
 */

function sameKindResult(params) {
  var req = _request["default"].create('SameKindResultReq', params);

  return (0, _request["default"])('carrier', 'CarrierService.SameKindResult', req, 'carrier.SameKindResultResp');
}

;
/**
 * 查看结果
 * @export
 * @param {*} params
 * @returns
 */

function supplierAuditList(params) {
  var req = _request["default"].create('SupplierProductAuditListReq', params);

  return (0, _request["default"])('product', 'SupplierProductService.SupplierAuditList', req, 'SupplierProductAuditListResp');
}

;
/**
 * 获取一条商家平台草稿箱记录
 * @export
 * @param {*} params
 * @returns
 */

function getSupplierDraftById(params) {
  var req = _request["default"].create('GetDraftByIdReq', params);

  return (0, _request["default"])('product', 'ProductService.GetSupplierDraftById', req, 'GetDraftByIdResp');
}

;
/**
 * 商家发布审核不通过
 * @export
 * @param {*} params
 * @returns
 */

function refuseSupplierDraft(params) {
  var req = _request["default"].create('RefuseSupplierDraftReq', params);

  return (0, _request["default"])('product', 'ProductService.RefuseSupplierDraft', req, 'RecommendConfigResp');
}

;
/**
 * 直播商品
 * @export
 */
// 商品直播链接列表

function LiveProductList(params) {
  var req = _request["default"].create('LiveProductListReq', params);

  return (0, _request["default"])('product', 'LiveProductService.LiveProductList', req, 'LiveProductListResp');
} // 商品直播链接删除


function DeleteLiveProduct(params) {
  var req = _request["default"].create('DeleteLiveProductReq', params);

  return (0, _request["default"])('product', 'LiveProductService.DeleteLiveProduct', req, 'DeleteLiveProductResp');
} // 新增或编辑商品直播链接


function UpdateOrInsertLiveProduct(params) {
  var req = _request["default"].create('UpdateOrInsertLiveProductReq', params);

  return (0, _request["default"])('product', 'LiveProductService.UpdateOrInsertLiveProduct', req, 'UpdateOrInsertLiveProductResp');
}
/**
 * 类目
 * @export
 */
// 类目星标


function CategoryStar(params) {
  var req = _request["default"].create('CategoryStarReq', params);

  return (0, _request["default"])('product', 'ProductCategoryService.CategoryStar', req, 'CategoryStarResp');
}
/**
 * 根据sku查询spu信息
 * @export
 */


function getSpuInfoBySku(params) {
  var req = _request["default"].create('GetSkuInfoBySkuIdReq', params);

  return (0, _request["default"])('product', 'ProductService.GetSkuInfoBySkuId', req, 'GetSkuInfoBySkuIdResp');
}