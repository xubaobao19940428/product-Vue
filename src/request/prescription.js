import request from './request'

/**
 * 获取物流时效配置列表
 * @export
 * @param {*} params
 * @returns
 */
export function QueryLogiAgingPage (params) {
    console.log(params)
    const req = request.create('QueryLogiAgingPageReq', params)
    return request('erp', 'LogiConfigBossService.QueryLogiAgingPage', req, 'QueryLogiAgingPageResp')
};

/**
 * 新增物流时效配置
 * @export
 * @param {*} params
 * @returns
 */
export function LogiAgingAdd (params) {
    console.log(params)
    const req = request.create('LogiAgingAddReq', params)
    return request('erp', 'LogiConfigBossService.LogiAgingAdd', req, 'LogiAgingAddResp')
};

/**
 * 编辑物流时效配置
 * @export
 * @param {*} params
 * @returns
 */
export function LogiAgingUpdate (params) {
    console.log(params)
    const req = request.create('LogiAgingUpdateReq', params)
    return request('erp', 'LogiConfigBossService.LogiAgingUpdate', req, 'LogiAgingUpdateResp')
};

/**
 * 物流编辑-获取编辑前信息
 * @export
 * @param {*} params
 * @returns
 */
export function QueryLogiUpdateInfo (params) {
    console.log(params)
    const req = request.create('QueryLogiUpdateInfoReq', params)
    return request('erp', 'LogiConfigBossService.QueryLogiUpdateInfo', req, 'QueryLogiUpdateInfoResp')
};

/**
 * 超时时效获取
 * @export
 * @param {*} params
 * @returns
 */
export function QueryTimeoutInfo (params) {
    console.log(params)
    const req = request.create('QueryTimeoutInfoReq', params)
    return request('erp', 'LogiConfigBossService.QueryTimeoutInfo', req, 'QueryTimeoutInfoResp')
};

/**
 * /超时时效更新
 * @export
 * @param {*} params
 * @returns
 */
export function TimeoutUpdate (params) {
    console.log(params)
    const req = request.create('TimeoutUpdateReq', params)
    return request('erp', 'LogiConfigBossService.TimeoutUpdate', req, 'TimeoutUpdateResp')
};