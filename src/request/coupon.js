import request from './request'


/**
 * 后台查询用户优惠券
 * @export
 * @param {*} params
 * @returns
 */
export function queryUserCouponManage(params) {
    console.log(params)
    const req = request.create('QueryUserCouponManageReq', params)
    return request('promotion', 'CouponService.QueryUserCouponManage', req, 'QueryUserCouponManageResp')
};

// 撤回用户的优惠券
export function withDrawUserCoupon(params) {
    console.log(params)
    const req = request.create('WithDrawUserCouponReq', params)
    return request('promotion', 'CouponService.WithDrawUserCoupon', req, 'WithDrawUserCouponResp')
};

/**
 * 后台按条件分页查询优惠券
 * @export 
 * @param {*} params
 * @returns
 */
export function listByQueryCouponWithPage(params) {
    console.log(params)
    const req = request.create('ListByQueryCouponWithPageReq', params)
    return request('promotion', 'CouponService.ListByQueryCouponWithPage', req, 'ListByQueryCouponWithPageResp')
};

/**
 * 后台按条件分页查询优惠券礼包
 * @export 
 * @param {*} params
 * @returns
 */
export function listByQueryCouponPackageWithPage(params) {
    console.log(params)
    const req = request.create('ListByQueryCouponPackageWithPageReq', params)
    return request('promotion', 'CouponService.ListByQueryCouponPackageWithPage', req, 'ListByQueryCouponPackageWithPageResp')
};

/**
 * 修改优惠券
 * @export 
 * @param {*} params
 * @returns
 */
export function updateCoupon(params) {
    console.log(params)
    const req = request.create('UpdateCouponReq', params)
    return request('promotion', 'CouponService.UpdateCoupon', req, 'UpdateCouponResp')
};

/**
 * 添加优惠券
 * @export 
 * @param {*} params
 * @returns
 */
export function addCoupon(params) {
    console.log(params)
    const req = request.create('AddCouponReq', params)
    return request('promotion', 'CouponService.AddCoupon', req, 'AddCouponResp')
};

/**
 * 导表发券
 * @param {*} params 
 */
export function uploadCoupon(params) {
    console.log(params)
    const req = request.create('UploadCouponReq', params)
    return request('promotion', 'CouponBossService.UploadCoupon', req, 'UploadCouponResp')
};

/**
 * 获取优惠券类型
 * @export 
 * @param {*} params
 * @returns
 */
export function queryCouponType(params) {
    console.log(params)
    const req = request.create('QueryCouponTypeReq', params)
    return request('promotion', 'CouponService.QueryCouponType', req, 'QueryCouponTypeResp')
};

/**
 * 增加优惠口令
 * @export 
 * @param {*} params
 * @returns
 */
export function addCouponPassword(params) {
    console.log(params)
    const req = request.create('AddCouponPasswordReq', params)
    return request('promotion', 'CouponService.AddCouponPassword', req, 'AddCouponPasswordResp')
};

/**
 * 添加优惠券礼包
 * @export 
 * @param {*} params
 * @returns
 */
export function addCouponPackage(params) {
    console.log(params)
    const req = request.create('AddCouponPackageReq', params)
    return request('promotion', 'CouponService.AddCouponPackage', req, 'AddCouponPackageResp')
};

/**
 * 绑定商品与优惠券礼包
 * @export 
 * @param {*} params
 * @returns
 */
export function addProductCoupon(params) {
    console.log(params)
    const req = request.create('AddProductCouponReq', params)
    return request('promotion', 'CouponService.AddProductCoupon', req, 'AddProductCouponResp')
};

/**
 * 老会员优惠券补发
 * @export 
 * @param {*} params
 * @returns
 */
export function addOldUserCoupon(params) {
    console.log(params)
    const req = request.create('AddOldUserCouponReq', params)
    return request('promotion', 'CouponService.AddOldUserCoupon', req, 'AddOldUserCouponResp')
};

/**
 * 后台通过优惠券ID查询优惠券详情
 * @export 
 * @param {*} params
 * @returns
 */
export function queryCouponDetails(params) {
    console.log(params)
    const req = request.create('QueryCouponDetailsReq', params)
    return request('promotion', 'CouponService.QueryCouponDetails', req, 'QueryCouponDetailsResp')
};

/**
 * 后台通过 优惠券包ID 查询优惠券包 详情
 * @export 
 * @param {*} params
 * @returns
 */
export function queryCouponPackageDetails(params) {
    console.log(params)
    const req = request.create('QueryCouponPackageDetailsReq', params)
    return request('promotion', 'CouponService.QueryCouponPackageDetails', req, 'QueryCouponPackageDetailsResp')
};

/**
 * 后台通过优惠券ID 统计 优惠券使用情况
 * @export 
 * @param {*} params
 * @returns
 */
export function countCouponDetails(params) {
    console.log(params)
    const req = request.create('CountCouponDetailsReq', params)
    return request('promotion', 'CouponService.CountCouponDetails', req, 'CountCouponDetailsResp')
};

/**
 * 根据优惠券id或者优惠券名查询优惠券
 */
export function listCouponByName(params) {
    console.log(params)
    const req = request.create('ListCouponByNameReq', params)
    return request('promotion', 'CouponBossService.ListCouponByName', req, 'ListCouponByNameResp')
};

/**
 * 批量根据优惠券ID查询优惠券信息
 */
export function listUserCouponOnPageBoss(params) {
    console.log(params)
    const req = request.create('ListUserCouponOnPageBossReq', params)
    return request('promotion', 'CouponBossService.ListUserCouponOnPageBoss', req, 'ListUserCouponOnPageBossResp')
};

/**
 * 商品返券
 */
// 后台按条件分页查询商品返券列表
export function listByQueryProductCouponWithPage(params) {
    console.log(params)
    const req = request.create('ListByQueryProductCouponWithPageReq', params)
    return request('promotion', 'CouponBossService.ListByQueryProductCouponWithPage', req, 'ListByQueryProductCouponWithPageResp')
};
// 添加商品优惠券
export function addProductCouponBoss(params) {
    console.log(params)
    const req = request.create('AddProductCouponReq', params)
    return request('promotion', 'CouponBossService.AddProductCoupon', req, 'AddProductCouponResp')
};
// 修改商品优惠券
export function updateProductCoupon(params) {
    console.log(params)
    const req = request.create('UpdateProductCouponReq', params)
    return request('promotion', 'CouponBossService.UpdateProductCoupon', req, 'UpdateProductCouponResp')
};
// 删除商品优惠券
export function deleteProductCoupon(params) {
    console.log(params)
    const req = request.create('DeleteProductCouponReq', params)
    return request('promotion', 'CouponBossService.DeleteProductCoupon', req, 'DeleteProductCouponResp')
};

 /**
  * 用券限制
  */
// 后台按条件分页查询优惠券白名单
export function listByQueryCouponWhiteListWithPage(params) {
    console.log(params)
    const req = request.create('ListByQueryCouponWhiteListWithPageReq', params)
    return request('promotion', 'CouponBossService.ListByQueryCouponWhiteListWithPage', req, 'ListByQueryCouponWhiteListWithPageResp')
};
// 添加优惠券白名单
export function addCouponWhiteList(params) {
    console.log(params)
    const req = request.create('AddCouponWhiteListReq', params)
    return request('promotion', 'CouponBossService.AddCouponWhiteList', req, 'AddCouponWhiteListResp')
};
// 修改优惠券白名单
export function updateCouponWhiteList(params) {
    console.log(params)
    const req = request.create('UpdateCouponWhiteListReq', params)
    return request('promotion', 'CouponBossService.UpdateCouponWhiteList', req, 'UpdateCouponWhiteListResp')
};
// 删除优惠券白名单
export function deleteCouponWhiteList(params) {
    console.log(params)
    const req = request.create('DeleteCouponWhiteListReq', params)
    return request('promotion', 'CouponBossService.DeleteCouponWhiteList', req, 'DeleteCouponWhiteListResp')
};
