import request from './request'

// 待报名
/**
 * list查询
 * @export
 * @param {*} params
 * @returns
 */
export function ListActiveProductEnter(params) {
    const req = request.create('ListActiveProductEnterReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.ListActiveProductEnter', req, 'ListActiveProductEnterResp')
};

/**
 * 查询提报人
 * @export
 * @param {*} params
 * @returns
 */
export function ListOperationUser(params) {
    const req = request.create('GetListOperationUserReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.ListOperationUser', req, 'GetListOperationUserResp')
};

/**
 * 查询操作人(采集人)信息
 * @export
 * @param {*} params
 * @returns
 */
export function ListGatherUser(params) {
    const req = request.create('ListGatherUserReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.ListGatherUser', req, 'ListGatherUserResp')
};

/**
 * 批量删除
 * @export
 * @param {*} params
 * @returns
 */
export function DeleteProduct(params) {
    const req = request.create('DeleteProductReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.DeleteProduct', req, 'DeleteProductResp')
};

/**
 * 新增商品(防重复提交、合理性校验*)
 * @export
 * @param {*} params
 * @returns
 */
export function InsertNoSignedProduct(params) {
    console.log(params)
    const req = request.create('InsertNoSignedProductReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.InsertNoSignedProduct', req, 'InsertNoSignedProductResp')
};
/**
 * 提交报名（防重复提交、合理性校验*、价格安全校验）
 * @export
 * @param {*} params
 * @returns
 */
export function SubmitNoSignedProduct(params) {
    const req = request.create('SubmitNoSignedProductReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.SubmitNoSignedProduct', req, 'SubmitNoSignedProductResp')
};

/**
 * 单个查询
 * @export
 * @param {*} params
 * @returns
 */
export function GetActiveProductEnterSkuDetail(params) {
    const req = request.create('GetActiveProductEnterSkuDetailReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.GetActiveProductEnterSkuDetail', req, 'GetActiveProductEnterSkuDetailResp')
};

/**
 * 编辑时，保存待报名的商品
 * @export
 * @param {*} params
 * @returns
 */
export function SaveActiveProductEnterDetail(params) {
    const req = request.create('SaveActiveProductEnterDetailReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.SaveActiveProductEnterDetail', req, 'SaveActiveProductEnterDetailResp')
};

/**
 * 批量编辑
 * @export
 * @param {*} params
 * @returns
 */
export function BatchUpdateNoSignedProduct(params) {
    const req = request.create('BatchUpdateNoSignedProductReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.BatchUpdateNoSignedProduct', req, 'BatchUpdateNoSignedProductResp')
};

// 已报名待录用
/**
 * list查询
 * @export
 * @param {*} params
 * @returns
 */
export function ListSignedProduct(params) {
    const req = request.create('ListSignedProductReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.ListSignedProduct', req, 'ListSignedProductResp')
};

/**
 * 单个查询
 * @export
 * @param {*} params
 * @returns
 */
export function GetSignedProduct(params) {
    const req = request.create('GetSignedProductReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.GetSignedProduct', req, 'GetSignedProductResp')
};

/**
 * 编辑时，保存待报名的商品
 * @export
 * @param {*} params
 * @returns
 */
export function SaveSignedProduct(params) {
    const req = request.create('SaveSignedProductReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.SaveSignedProduct', req, 'SaveSignedProductResp')
};

/**
 * 批量编辑
 * @export
 * @param {*} params
 * @returns
 */
export function BatchUpdateSignedProduct(params) {
    const req = request.create('BatchUpdateSignedProductReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.BatchUpdateSignedProduct', req, 'BatchUpdateSignedProductResp')
};

/**
 * 录用（合理性校验*、价格安全校验、活动冲突校验）
 * @export
 * @param {*} params
 * @returns
 */
export function AcceptSignedProduct(params) {
    const req = request.create('AcceptSignedProductReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.AcceptSignedProduct', req, 'AcceptSignedProductResp')
};



//已录用
/**
 * @export
 * @param {*} params
 * @returns
 */
export function ListActiveProductForSignUp(params) {
    const req = request.create('ListActiveProductForSignUpReq', params)
    return request('marketing', 'ActiveProductService.ListActiveProductForSignUp', req, 'ListActiveProductForSignUpResp')
};

//重新校准活动冲突
/**
 * @export
 * @param {*} params
 * @returns
 */
export function RecheckForTimeConflict(params) {
    const req = request.create('RecheckForTimeConflictReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.RecheckForTimeConflict', req, 'RecheckForTimeConflictResp')
};

//重新校准价格冲突
/**
 * @export
 * @param {*} params
 * @returns
 */
export function RecheckForPriceConflict(params) {
    const req = request.create('RecheckForPriceConflictReq', params)
    return request('marketing', 'ActiveProductSignUpBossService.RecheckForPriceConflict', req, 'RecheckForPriceConflictResp')
};
