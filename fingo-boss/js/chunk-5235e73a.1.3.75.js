(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5235e73a"],{5406:function(e,t,r){"use strict";r.r(t);var c=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"app-container"},[r("div",{staticClass:"filter-container"},[r("el-form",{attrs:{inline:""}},[r("el-form-item",{staticClass:"filter-item",attrs:{label:"商品前台分组："}},[r("el-cascader",{staticClass:"normalOperatorBox",staticStyle:{width:"100%"},attrs:{clearable:"",filterable:"",props:{label:"cateName",children:"levelValue",value:"prop",lazy:!0,lazyLoad:e.getSubCategory},placeholder:"请选择商品前台分组",options:e.frontCategoryOptions,size:"medium"},on:{change:e.getCategoryList},model:{value:e.frontCategoryId,callback:function(t){e.frontCategoryId=t},expression:"frontCategoryId"}})],1),r("el-form-item",[r("el-input",{attrs:{clearable:"",size:"medium",placeholder:"商品ID,多个之间用,号隔开"},model:{value:e.param.productId,callback:function(t){e.$set(e.param,"productId",t)},expression:"param.productId"}})],1),r("el-form-item",[r("el-button",{attrs:{icon:"el-icon-search",type:"primary",size:"medium"},on:{click:function(t){return e.getList(1)}}},[e._v("搜索")])],1)],1)],1),r("el-table",{staticStyle:{width:"100%"},attrs:{data:e.productList,border:"",height:"100%"}},[r("el-table-column",{attrs:{label:"商品ID",prop:"productId",fixed:"left","min-width":"120px"}}),r("el-table-column",{attrs:{fixed:"left",label:"商品信息",align:"center","min-width":"200px"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("div",{staticClass:"flex flex-item--center"},[r("el-popover",{attrs:{placement:"top-start",trigger:"hover"}},[r("img",{staticClass:"previewImage",attrs:{src:e.dealShowFileSrc(t.row.spuCover)}}),r("img",{directives:[{name:"popover",rawName:"v-popover:popover",arg:"popover"}],staticClass:"thumbnail",attrs:{slot:"reference",src:e.dealShowFileSrc(t.row.spuCover)},slot:"reference"})]),r("span",{staticStyle:{"margin-left":"10px"}},[e._v(e._s(t.row.title))])],1)]}}])}),r("el-table-column",{attrs:{label:"前台商品类目",align:"center","min-width":"120px"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n                "+e._s(t.row.frontCate?t.row.frontCate.join("/"):"")+"\n            ")]}}])}),r("el-table-column",{attrs:{label:"总排序分",prop:"totalSort",align:"center"}}),r("el-table-column",{attrs:{label:"人工权重分",align:"center","min-width":"180px"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-input-number",{attrs:{"controls-position":"right",size:"small",precision:0},model:{value:t.row.sort,callback:function(r){e.$set(t.row,"sort",r)},expression:"scope.row.sort"}})]}}])}),e.hasPermission("BTN_PRODUCT_CATEGORY_SORT")?r("el-table-column",{attrs:{fixed:"right",label:"操作",align:"center",width:"200px"},scopedSlots:e._u([{key:"default",fn:function(t){return[r("el-button",{attrs:{plain:"",type:"primary",size:"mini"},on:{click:function(r){return e.clickToSort(t.row)}}},[e._v("保存")]),r("el-button",{attrs:{plain:"",type:"primary",size:"mini"},on:{click:function(r){return e.placeTop(t.row)}}},[e._v("\n                    "+e._s(0==t.row.top?"置顶":"取消置顶")+"\n                ")])]}}],null,!1,2591959555)}):e._e()],1),r("div",{staticClass:"pagination-box"},[r("el-pagination",{attrs:{"current-page":e.param.page.pageNum,"page-sizes":[5,10,20,50],"page-size":e.param.page.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.totals},on:{"size-change":e.handleSizeChange,"current-change":e.getList}})],1)],1)},a=[],o=(r("55dd"),r("28a5"),r("c11f")),n=r("9576"),u={name:"productSort",mixins:[o["a"]],data:function(){return{frontCategoryId:[],frontCategoryList:[],frontCategoryOptions:[],productList:[],totals:0,cateType:1,param:{frontCateId:"",productId:"",page:{pageNum:1,pageSize:10,pagingSwitch:!0}}}},created:function(){var e=this;this.fetchCategory({level:1,cateType:this.cateType,resolve:function(t){e.frontCategoryOptions=t}})},methods:{placeTop:function(e){var t=this;Object(n["Yb"])(this.filterData({productId:e.productId,type:0==e.top?1:0})).then((function(e){1===e.ret.errcode&&t.getList()}))},getCategoryList:function(){this.param.frontCateId=JSON.parse(this.frontCategoryId[1]).cateId,this.productList=[],this.totals=0,this.getList(1)},handleSizeChange:function(e){this.param.page.pageSize=e,this.getList()},splitData:function(e){for(var t=e.split(","),r=0;r<t.length;r++)t[r]=t[r].trim();return e?t:[]},getList:function(e){var t=this;this.param.page.pageNum=e||this.param.page.pageNum;var r=JSON.parse(JSON.stringify(this.param));r.productId=this.splitData(r.productId),Object(n["Cb"])(this.filterData(r)).then((function(e){1===e.ret.errcode&&(t.productList=e.categoryProductUnit,t.totals=e.total)}))},clickToSort:function(e){var t=this,r=e.sort,c=e.productId;Object(n["Y"])({sort:r,productId:c}).then((function(e){1===e.ret.errcode&&t.getList()}))}}},i=u,d=r("2877"),p=Object(d["a"])(i,c,a,!1,null,"080656ab",null);t["default"]=p.exports},9576:function(e,t,r){"use strict";r.d(t,"Kb",(function(){return a})),r.d(t,"Hb",(function(){return o})),r.d(t,"Ib",(function(){return n})),r.d(t,"Ob",(function(){return u})),r.d(t,"Lb",(function(){return i})),r.d(t,"Nb",(function(){return d})),r.d(t,"Mb",(function(){return p})),r.d(t,"w",(function(){return s})),r.d(t,"Jb",(function(){return l})),r.d(t,"fc",(function(){return f})),r.d(t,"Qb",(function(){return v})),r.d(t,"gc",(function(){return S})),r.d(t,"Pb",(function(){return g})),r.d(t,"kc",(function(){return R})),r.d(t,"lc",(function(){return P})),r.d(t,"V",(function(){return b})),r.d(t,"d",(function(){return y})),r.d(t,"a",(function(){return C})),r.d(t,"c",(function(){return h})),r.d(t,"e",(function(){return O})),r.d(t,"b",(function(){return m})),r.d(t,"Q",(function(){return A})),r.d(t,"T",(function(){return j})),r.d(t,"S",(function(){return q})),r.d(t,"X",(function(){return G})),r.d(t,"W",(function(){return I})),r.d(t,"U",(function(){return B})),r.d(t,"R",(function(){return L})),r.d(t,"zb",(function(){return T})),r.d(t,"nb",(function(){return D})),r.d(t,"rb",(function(){return k})),r.d(t,"Ab",(function(){return U})),r.d(t,"ic",(function(){return w})),r.d(t,"hb",(function(){return x})),r.d(t,"Eb",(function(){return E})),r.d(t,"mc",(function(){return z})),r.d(t,"cb",(function(){return V})),r.d(t,"Rb",(function(){return N})),r.d(t,"Cb",(function(){return M})),r.d(t,"Y",(function(){return W})),r.d(t,"Yb",(function(){return _})),r.d(t,"db",(function(){return K})),r.d(t,"tb",(function(){return Q})),r.d(t,"Bb",(function(){return J})),r.d(t,"x",(function(){return H})),r.d(t,"jc",(function(){return F})),r.d(t,"Z",(function(){return Y})),r.d(t,"N",(function(){return $})),r.d(t,"P",(function(){return X})),r.d(t,"O",(function(){return Z})),r.d(t,"L",(function(){return ee})),r.d(t,"M",(function(){return te})),r.d(t,"kb",(function(){return re})),r.d(t,"l",(function(){return ce})),r.d(t,"mb",(function(){return ae})),r.d(t,"lb",(function(){return oe})),r.d(t,"jb",(function(){return ne})),r.d(t,"ib",(function(){return ue})),r.d(t,"ub",(function(){return ie})),r.d(t,"sb",(function(){return de})),r.d(t,"Gb",(function(){return pe})),r.d(t,"bb",(function(){return se})),r.d(t,"gb",(function(){return le})),r.d(t,"Db",(function(){return fe})),r.d(t,"hc",(function(){return ve})),r.d(t,"pb",(function(){return Se})),r.d(t,"qb",(function(){return ge})),r.d(t,"C",(function(){return Re})),r.d(t,"y",(function(){return Pe})),r.d(t,"B",(function(){return be})),r.d(t,"A",(function(){return ye})),r.d(t,"E",(function(){return Ce})),r.d(t,"D",(function(){return he})),r.d(t,"z",(function(){return Oe})),r.d(t,"Fb",(function(){return me})),r.d(t,"fb",(function(){return Ae})),r.d(t,"vb",(function(){return je})),r.d(t,"G",(function(){return qe})),r.d(t,"F",(function(){return Ge})),r.d(t,"K",(function(){return Ie})),r.d(t,"J",(function(){return Be})),r.d(t,"I",(function(){return Le})),r.d(t,"ab",(function(){return Te})),r.d(t,"yb",(function(){return De})),r.d(t,"Zb",(function(){return ke})),r.d(t,"ob",(function(){return Ue})),r.d(t,"ec",(function(){return we})),r.d(t,"H",(function(){return xe})),r.d(t,"dc",(function(){return Ee})),r.d(t,"bc",(function(){return ze})),r.d(t,"cc",(function(){return Ve})),r.d(t,"Xb",(function(){return Ne})),r.d(t,"Vb",(function(){return Me})),r.d(t,"Wb",(function(){return We})),r.d(t,"eb",(function(){return _e})),r.d(t,"Ub",(function(){return Ke})),r.d(t,"Tb",(function(){return Qe})),r.d(t,"ac",(function(){return Je})),r.d(t,"xb",(function(){return He})),r.d(t,"Sb",(function(){return Fe})),r.d(t,"r",(function(){return Ye})),r.d(t,"j",(function(){return $e})),r.d(t,"v",(function(){return Xe})),r.d(t,"h",(function(){return Ze})),r.d(t,"wb",(function(){return et})),r.d(t,"q",(function(){return tt})),r.d(t,"t",(function(){return rt})),r.d(t,"i",(function(){return ct})),r.d(t,"k",(function(){return at})),r.d(t,"p",(function(){return ot})),r.d(t,"g",(function(){return nt})),r.d(t,"f",(function(){return ut})),r.d(t,"m",(function(){return it})),r.d(t,"u",(function(){return dt})),r.d(t,"o",(function(){return pt})),r.d(t,"n",(function(){return st})),r.d(t,"s",(function(){return lt}));var c=r("284b");function a(e){console.log(e);var t=c["a"].create("ProductAttrGetReq",e);return Object(c["a"])("product","ProductAttrService.ProductAttrGet",t,"attribute.ProductAttrGetResp")}function o(e){console.log(e);var t=c["a"].create("ProductAttrAddReq",e);return Object(c["a"])("product","ProductAttrService.ProductAttrAdd",t,"attribute.ProductAttrAddResp")}function n(e){console.log(e);var t=c["a"].create("ProductAttrDisableReq",e);return Object(c["a"])("product","ProductAttrService.ProductAttrDisable",t,"attribute.ProductAttrDisableResp")}function u(e){console.log(e);var t=c["a"].create("ProductAttrValueDisableReq",e);return Object(c["a"])("product","ProductAttrService.ProductAttrValueDisable",t,"attribute.ProductAttrValueDisableResp")}function i(e){var t=c["a"].create("ProductAttrGetByIdReq",e);return Object(c["a"])("product","ProductAttrService.ProductAttrGetById",t,"attribute.ProductAttrGetByIdResp")}function d(e){console.log(e);var t=c["a"].create("ProductAttrModifyReq",e);return Object(c["a"])("product","ProductAttrService.ProductAttrModify",t,"attribute.ProductAttrModifyResp")}function p(e){console.log(e);var t=c["a"].create("ProductAttrGetByIdBatchReq",e);return Object(c["a"])("product","ProductAttrService.ProductAttrGetByIdBatch",t,"attribute.ProductAttrGetByIdBatchResp")}function s(e){console.log(e);var t=c["a"].create("AddCustomizeAttrValueReq",e);return Object(c["a"])("product","ProductAttrService.AddCustomizeAttrValue",t,"attribute.AddCustomizeAttrValueResp")}function l(e){var t=c["a"].create("ProductAttrDownloadReq",e);return Object(c["a"])("product","ProductAttrService.ProductAttrDownload",t,"attribute.ProductAttrDownloadResp")}function f(e){var t=c["a"].create("TranslateSelectedAttrReq",e);return Object(c["a"])("product","ProductAttrService.TranslateSelectedAttr",t,"attribute.TranslateSelectedAttrResp")}function v(e){var t=c["a"].create("ProductAttrValueGetReq",e);return Object(c["a"])("product","ProductAttrService.ProductAttrValueGet",t,"attribute.ProductAttrValueGetResp")}function S(e){var t=c["a"].create("UpdateAttrTranslateByIdReq",e);return Object(c["a"])("product","ProductAttrService.UpdateAttrTranslateById",t,"attribute.UpdateAttrTranslateByIdResp")}function g(e){var t=c["a"].create("ProductAttrValueDownloadReq",e);return Object(c["a"])("product","ProductAttrService.ProductAttrValueDownload",t,"attribute.ProductAttrValueDownloadResp")}function R(e){var t=c["a"].create("UploadAttrTranslateReq",e);return Object(c["a"])("product","ProductAttrService.UploadAttrTranslate",t,"attribute.UploadAttrTranslateResp")}function P(e){var t=c["a"].create("UploadAttrValueTranslateReq",e);return Object(c["a"])("product","ProductAttrService.UploadAttrValueTranslate",t,"attribute.UploadAttrValueTranslateResp")}function b(e){console.log(e);var t=c["a"].create("CategoryListGetReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryListGet",t,"category.CategoryListGetResp")}function y(e){console.log(e);var t=c["a"].create("CategoryGroupListGetReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryGroupListGet",t,"category.CategoryGroupListGetResp")}function C(e){console.log(e);var t=c["a"].create("CategoryGroupAddOrUpdateReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryGroupAddOrUpdate",t,"category.CategoryGroupAddOrUpdateResp")}function h(e){console.log(e);var t=c["a"].create("CategoryGroupGetReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryGroupGet",t,"category.CategoryGroupGetResp")}function O(e){console.log(e);var t=c["a"].create("CategoryGroupSortReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryGroupSort",t,"category.CategoryGroupSortResp")}function m(e){console.log(e);var t=c["a"].create("CategoryGroupDeleteReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryGroupDelete",t,"category.CategoryGroupDeleteResp")}function A(e){console.log(e);var t=c["a"].create("CategoryAddReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryAdd",t,"category.CategoryAddResp")}function j(e){console.log(e);var t=c["a"].create("CategoryDeleteReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryDelete",t,"category.CategoryDeleteResp")}function q(e){console.log(e);var t=c["a"].create("CategoryChangeToSortReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryChangeToSort",t,"category.CategoryChangeToSortResp")}function G(e){console.log(e);var t=c["a"].create("CategoryUpdateReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryUpdate",t,"category.CategoryUpdateResp")}function I(e){console.log(e);var t=c["a"].create("CategoryQueryByNameReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryQueryByName",t,"CategoryQueryByNameResp")}function B(e){console.log(e);var t=c["a"].create("CategoryHiddenOrShowReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryHiddenOrShow",t,"CategoryHiddenOrShowResp")}function L(e){console.log(e);var t=c["a"].create("CategoryChangSortReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryChangSort",t,"CategoryChangSortResp")}function T(e){console.log(e);var t=c["a"].create("GetUpperRelatedCategoryByIdReq",e);return Object(c["a"])("product","ProductCategoryService.GetUpperRelatedCategoryById",t,"category.GetUpperRelatedCategoryByIdResp")}function D(e){console.log(e);var t=c["a"].create("Get1688PicReq",e);return Object(c["a"])("product","ProductService.Get1688Pic",t,"product.Get1688PicResp")}function k(e){console.log(e);var t=c["a"].create("GetProductEnumInfoReq",e);return Object(c["a"])("product","ProductService.GetProductEnumInfo",t,"product.GetProductEnumInfoResp")}function U(e){console.log(e);var t=c["a"].create("InsertProductReq",e);return Object(c["a"])("product","ProductService.InsertProduct",t,"product.InsertProductResp")}function w(e){console.log(e);var t=c["a"].create("UpdateProductReq",e);return Object(c["a"])("product","ProductService.UpdateProduct",t,"product.UpdateProductResp")}function x(e){console.log(e);var t=c["a"].create("DisableProductReq",e);return Object(c["a"])("product","ProductService.DisableProduct",t,"product.DisableProductResp")}function E(e){console.log(e);var t=c["a"].create("ListProductReq",e);return Object(c["a"])("product","ProductService.ListProduct",t,"product.ListProductResp")}function z(e){console.log(e);var t=c["a"].create("ViewProductInfoReq",e);return Object(c["a"])("product","ProductService.ViewProductInfo",t,"product.ViewProductInfoResp")}function V(e){console.log(e);var t=c["a"].create("CompositeSlaveSkuInfoQueryReq",e);return Object(c["a"])("product","ProductService.CompositeSlaveSkuInfoQuery",t,"product.CompositeSlaveSkuInfoQueryResp")}function N(e){var t=c["a"].create("ProductExportReq",e);return Object(c["a"])("product","ProductService.ProductExport",t,"product.ProductExportResp")}function M(e){console.log(e);var t=c["a"].create("ListCategoryProductReq",e);return Object(c["a"])("product","ProductCategoryService.ListCategoryProduct",t,"ListCategoryProductResp")}function W(e){console.log(e);var t=c["a"].create("ChangeCategoryProductSortReq",e);return Object(c["a"])("product","ProductCategoryService.ChangeCategoryProductSort",t,"ChangeCategoryProductSortResp")}function _(e){console.log(e);var t=c["a"].create("SetCategoryProductTopReq",e);return Object(c["a"])("product","ProductCategoryService.SetCategoryProductTop",t,"SetCategoryProductTopResp")}function K(e){var t=c["a"].create("CopyFrontCategoryReq",e);return Object(c["a"])("product","ProductCategoryService.CopyFrontCategory",t,"category.CopyFrontCategoryResp")}function Q(e){console.log(e);var t=c["a"].create("GetProductSkuInfoBySkuCodeReq",e);return Object(c["a"])("product","ProductService.GetProductSkuInfoBySkuCode",t,"GetProductSkuInfoBySkuCodeResp")}function J(e){var t=c["a"].create("ListProductPriceTemplateReq",e);return Object(c["a"])("product","ProductPriceTemplateService.ListProductPriceTemplate",t,"ListProductPriceTemplateResp")}function H(e){var t=c["a"].create("AddNewProductPriceTemplateReq",e);return Object(c["a"])("product","ProductPriceTemplateService.AddNewProductPriceTemplate",t,"AddNewProductPriceTemplateResp")}function F(e){console.log(e);var t=c["a"].create("UpdateProductPriceTemplateReq",e);return Object(c["a"])("product","ProductPriceTemplateService.UpdateProductPriceTemplate",t,"UpdateProductPriceTemplateResp")}function Y(e){var t=c["a"].create("ChangePriceTemplateEffectStatusReq",e);return Object(c["a"])("product","ProductPriceTemplateService.ChangePriceTemplateEffectStatus",t,"ChangePriceTemplateEffectStatusResp")}function $(e){console.log(e);var t=c["a"].create("BrandInfoAddReq",e);return Object(c["a"])("product","ProductBrandService.BrandInfoAdd",t,"brand.BrandInfoAddResp")}function X(e){console.log(e);var t=c["a"].create("BrandInfoModifyReq",e);return Object(c["a"])("product","ProductBrandService.BrandInfoModify",t,"brand.BrandInfoModifyResp")}function Z(e){console.log(e);var t=c["a"].create("BrandInfoGetReq",e);return Object(c["a"])("product","ProductBrandService.BrandInfoGet",t,"brand.BrandInfoGetResp")}function ee(e){console.log(e);var t=c["a"].create("BrandChangeStatusReq",e);return Object(c["a"])("product","ProductBrandService.BrandChangeStatus",t,"brand.BrandChangeStatusResp")}function te(e){console.log(e);var t=c["a"].create("BrandDeleteReq",e);return Object(c["a"])("product","ProductBrandService.BrandDelete",t,"brand.BrandDeleteResp")}function re(e){var t=c["a"].create("ExchangeGetRecentRateTemplateReq",e);return Object(c["a"])("i18n","ExchangeService.ExchangeGetRecentRateTemplate",t,"ExchangeGetRecentRateTemplateResp")}function ce(e){var t=c["a"].create("ExchangeGetReadyConfigTemplateReq",e);return Object(c["a"])("i18n","ExchangeService.ExchangeGetReadyConfigTemplate",t,"ExchangeGetReadyConfigTemplateResp")}function ae(e){var t=c["a"].create("ExchangeSaveRateReq",e);return Object(c["a"])("i18n","ExchangeService.ExchangeSaveRate",t,"ExchangeSaveRateResp")}function oe(e){var t=c["a"].create("ExchangeReviewReq",e);return Object(c["a"])("i18n","ExchangeService.ExchangeReview",t,"ExchangeReviewResp")}function ne(e){console.log(e);var t=c["a"].create("ExchangeGetRateSaveHistoryReq",e);return Object(c["a"])("i18n","ExchangeService.ExchangeGetRateSaveHistory",t,"ExchangeGetRateSaveHistoryResp")}function ue(e){var t=c["a"].create("ExchangeGetRateReq",e);return Object(c["a"])("i18n","ExchangeService.ExchangeGetRate",t,"ExchangeGetRateResp")}function ie(e){var t=c["a"].create("GetProductSpuReq",e);return Object(c["a"])("product","ProductService.GetProductSpu",t,"GetProductSpuResp")}function de(e){var t=c["a"].create("GetProductSkuReq",e);return Object(c["a"])("product","ProductService.GetProductSku",t,"GetProductSkuResp")}function pe(e){var t=c["a"].create("OneKeyUploadProductReq",e);return Object(c["a"])("product","ProductService.OneKeyUploadProduct",t,"product.OneKeyUploadProductResp")}function se(e){var t=c["a"].create("CheckToBeConfirmReq",e);return Object(c["a"])("product","ProductService.CheckToBeConfirm",t,"product.CheckToBeConfirmResp")}function le(e){var t=c["a"].create("DeleteDraftsReq",e);return Object(c["a"])("product","ProductService.DeleteDrafts",t,"product.DeleteDraftsResp")}function fe(e){var t=c["a"].create("ListDraftsReq",e);return Object(c["a"])("product","ProductService.ListDrafts",t,"product.ListDraftsResp")}function ve(e){var t=c["a"].create("UpdateDraftReq",e);return Object(c["a"])("product","ProductService.UpdateDraft",t,"product.UpdateDraftResp")}function Se(e){var t=c["a"].create("GetDraftByIdReq",e);return Object(c["a"])("product","ProductService.GetDraftById",t,"product.GetDraftByIdResp")}function ge(e){var t=c["a"].create("GetDraftOperatorListReq",e);return Object(c["a"])("product","ProductService.GetDraftOperatorList",t,"product.GetDraftOperatorListResp")}function Re(e){var t=c["a"].create("AdvanceSaleSkuInfoGetReq",e);return Object(c["a"])("product","ProductService.AdvanceSaleSkuInfoGet",t,"product.AdvanceSaleSkuInfoGetResp")}function Pe(e){var t=c["a"].create("AdvanceSaleAddReq",e);return Object(c["a"])("product","ProductService.AdvanceSaleAdd",t,"product.AdvanceSaleAddResp")}function be(e){var t=c["a"].create("AdvanceSaleListReq",e);return Object(c["a"])("product","ProductService.AdvanceSaleList",t,"product.AdvanceSaleListResp")}function ye(e){var t=c["a"].create("AdvanceSaleGetReq",e);return Object(c["a"])("product","ProductService.AdvanceSaleGet",t,"product.AdvanceSaleGetResp")}function Ce(e){var t=c["a"].create("AdvanceSaleUploadReq",e);return Object(c["a"])("product","ProductService.AdvanceSaleUpload",t,"product.AdvanceSaleUploadResp")}function he(e){var t=c["a"].create("AdvanceSaleUpdateReq",e);return Object(c["a"])("product","ProductService.AdvanceSaleUpdate",t,"product.AdvanceSaleUpdateResp")}function Oe(e){var t=c["a"].create("AdvanceSaleDownloadReq",e);return Object(c["a"])("product","ProductService.AdvanceSaleDownload",t,"product.AdvanceSaleDownloadResp")}function me(e){var t=c["a"].create("ManualPushAdvancePurchaseReq",e);return Object(c["a"])("product","ProductService.ManualPushAdvancePurchase",t,"product.ManualPushAdvancePurchaseResp")}function Ae(e){var t=c["a"].create("CreateUploadTaskRequest",e);return Object(c["a"])("carrier","CarrierService.CreateUploadTask",t,"carrier.CreateUploadTaskResponse")}function je(e){var t=c["a"].create("GetShelveListReq",e);return Object(c["a"])("product","ProductBatchOperationService.GetShelveList",t,"product.GetShelveListResp")}function qe(e){var t=c["a"].create("BatchAcceptShelveAdviceCheckReq",e);return Object(c["a"])("product","ProductBatchOperationService.BatchAcceptShelveAdviceCheck",t,"product.BatchAcceptShelveAdviceCheckResp")}function Ge(e){var t=c["a"].create("BatchAcceptShelveAdviceReq",e);return Object(c["a"])("product","ProductBatchOperationService.BatchAcceptShelveAdvice",t,"product.BatchAcceptShelveAdviceResp")}function Ie(e){var t=c["a"].create("BatchOnShelveCheckReq",e);return Object(c["a"])("product","ProductBatchOperationService.BatchOnShelveCheck",t,"product.BatchOnShelveCheckResp")}function Be(e){var t=c["a"].create("BatchOnShelveReq",e);return Object(c["a"])("product","ProductBatchOperationService.BatchOnShelve",t,"product.BatchOnShelveResp")}function Le(e){var t=c["a"].create("BatchOffShelveReq",e);return Object(c["a"])("product","ProductBatchOperationService.BatchOffShelve",t,"product.BatchOffShelveResp")}function Te(e){var t=c["a"].create("ChangeSaleStatusReq",e);return Object(c["a"])("product","ProductBatchOperationService.ChangeSaleStatus",t,"product.ChangeSaleStatusResp")}function De(e){var t=c["a"].create("GetTaskListRequest",e);return Object(c["a"])("carrier","CarrierService.GetTaskList",t,"carrier.GetTaskListResponse")}function ke(e){var t=c["a"].create("StopTaskRequest",e);return Object(c["a"])("carrier","CarrierService.StopTask",t,"carrier.StopTaskResponse")}function Ue(e){var t=c["a"].create("GetChilindoImagesReq",e);return Object(c["a"])("carrier","CarrierService.GetChilindoImages",t,"carrier.GetChilindoImagesResp")}function we(e){var t=c["a"].create("TagChilindoImageReq",e);return Object(c["a"])("carrier","CarrierService.TagChilindoImage",t,"carrier.TagChilindoImageResp")}function xe(e){var t=c["a"].create("BatchAddTaskReq",e);return Object(c["a"])("carrier","CarrierService.BatchAddTask",t,"carrier.BatchAddTaskResp")}function Ee(e){var t=c["a"].create("SynonymWordsListReq",e);return Object(c["a"])("product","ProductSearchBossService.SynonymWordsList",t,"product.SynonymWordsListResp")}function ze(e){var t=c["a"].create("SynonymWordsAddOrEditReq",e);return Object(c["a"])("product","ProductSearchBossService.SynonymWordsAddOrEdit",t,"product.SynonymWordsAddOrEditResp")}function Ve(e){var t=c["a"].create("SynonymWordsDeleteReq",e);return Object(c["a"])("product","ProductSearchBossService.SynonymWordsDelete",t,"product.SynonymWordsDeleteResp")}function Ne(e){var t=c["a"].create("SensitiveWordsListReq",e);return Object(c["a"])("product","ProductSearchBossService.SensitiveWordsList",t,"product.SensitiveWordsListResp")}function Me(e){var t=c["a"].create("SensitiveWordsAddOrEditReq",e);return Object(c["a"])("product","ProductSearchBossService.SensitiveWordsAddOrEdit",t,"product.SensitiveWordsAddOrEditResp")}function We(e){var t=c["a"].create("SensitiveWordsDeleteReq",e);return Object(c["a"])("product","ProductSearchBossService.SensitiveWordsDelete",t,"product.SensitiveWordsDeleteResp")}function _e(e){var t=c["a"].create("CreateSameKindTaskReq",e);return Object(c["a"])("carrier","CarrierService.CreateSameKindTask",t,"carrier.CreateSameKindTaskResp")}function Ke(e){var t=c["a"].create("SameKindTaskListReq",e);return Object(c["a"])("carrier","CarrierService.SameKindTaskList",t,"carrier.SameKindTaskListResp")}function Qe(e){var t=c["a"].create("SameKindResultReq",e);return Object(c["a"])("carrier","CarrierService.SameKindResult",t,"carrier.SameKindResultResp")}function Je(e){var t=c["a"].create("SupplierProductAuditListReq",e);return Object(c["a"])("product","SupplierProductService.SupplierAuditList",t,"SupplierProductAuditListResp")}function He(e){var t=c["a"].create("GetDraftByIdReq",e);return Object(c["a"])("product","ProductService.GetSupplierDraftById",t,"GetDraftByIdResp")}function Fe(e){var t=c["a"].create("RefuseSupplierDraftReq",e);return Object(c["a"])("product","ProductService.RefuseSupplierDraft",t,"RecommendConfigResp")}function Ye(e){var t=c["a"].create("LiveProductListReq",e);return Object(c["a"])("product","LiveProductService.LiveProductList",t,"LiveProductListResp")}function $e(e){var t=c["a"].create("DeleteLiveProductReq",e);return Object(c["a"])("product","LiveProductService.DeleteLiveProduct",t,"DeleteLiveProductResp")}function Xe(e){var t=c["a"].create("UpdateOrInsertLiveProductReq",e);return Object(c["a"])("product","LiveProductService.UpdateOrInsertLiveProduct",t,"UpdateOrInsertLiveProductResp")}function Ze(e){var t=c["a"].create("CategoryStarReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryStar",t,"CategoryStarResp")}function et(e){var t=c["a"].create("GetSkuInfoBySkuIdReq",e);return Object(c["a"])("product","ProductService.GetSkuInfoBySkuId",t,"GetSkuInfoBySkuIdResp")}function tt(e){var t=c["a"].create("ListProductSelectReq",e);return Object(c["a"])("product","ProductSelectService.ListProductSelectPage",t,"ListProductSelectResp")}function rt(e){var t=c["a"].create("SearchSupplierByImageReq",e);return Object(c["a"])("product","ProductSelectService.SearchSupplierByImage",t,"SearchSupplierByImageResp")}function ct(e){var t=c["a"].create("ConfirmProductReq",e);return Object(c["a"])("product","ProductSelectService.ConfirmProduct",t,"ConfirmProductResp")}function at(e){var t=c["a"].create("product.DeleteProductReq",e);return Object(c["a"])("product","ProductSelectService.DeleteProduct",t,"product.DeleteProductResp")}function ot(e){var t=c["a"].create("ListProductSelectReq",e);return Object(c["a"])("product","ProductSelectService.ListProductSelectExport",t,"ListProductSelectExportResp")}function nt(e){var t=c["a"].create("CategoryMappingQueryReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryMappingList",t,"category.CategoryMappingQueryResp")}function ut(e){var t=c["a"].create("CategoryLazadaQueryReq",e);return Object(c["a"])("product","ProductCategoryService.CategoryLazadaList",t,"category.CategoryLazadaQueryResp")}function it(e){var t=c["a"].create("GetCateMappingDetailReq",e);return Object(c["a"])("product","ProductCategoryService.GetCateMappingDetail",t,"GetCateMappingDetailResp")}function dt(e){var t=c["a"].create("UpdateCategoryMappingReq",e);return Object(c["a"])("product","ProductCategoryService.UpdateCategoryMapping",t,"category.UpdateCategoryMappingResp")}function pt(e){var t=c["a"].create("ListProductReq",e);return Object(c["a"])("product","LazadaProductService.ListProduct",t,"lazada.ListProductResp")}function st(e){var t=c["a"].create("GetPublishInfoReq",e);return Object(c["a"])("product","LazadaProductService.GetPublishInfo",t,"lazada.GetPublishInfoResp")}function lt(e){var t=c["a"].create("PublishProductReq",e);return Object(c["a"])("product","LazadaProductService.PublishProduct",t,"lazada.PublishProductResp")}},c11f:function(e,t,r){"use strict";r("7f7f"),r("7514");var c=r("9576");t["a"]={data:function(){return{}},methods:{getSubCategory:function(e,t){if(0!=e.level){var r=JSON.parse(e.value);this.fetchCategory({pid:parseInt(r.cateId),cateType:this.cateType?this.cateType:2,level:e.level+1,resolve:t})}},fetchCategory:function(e){var t=e.id,r=e.cateType,a=e.level,o=e.pid,n=e.page,u=e.countryCode,i=e.resolve;Object(c["V"])(this.filterData({pid:o,id:t,level:a,cateType:r,page:n,countryCode:u})).then((function(e){if(1===e.ret.errcode){for(var t=0;t<e.categoryUnit.length;t++){e.categoryUnit[t]["levelValue"]=[];var c=e.categoryUnit[t].cateNameValue.find((function(e){return"cn"==e.languageCode}));e.categoryUnit[t]["cateName"]=c?c.name:"",e.categoryUnit[t]["prop"]=JSON.stringify({cateId:String(e.categoryUnit[t].cateId),cateName:c?c.name:""}),e.categoryUnit[t]["leaf"]=2==r?a>2:a>1}i&&i(e.categoryUnit,e)}}))}}}}}]);