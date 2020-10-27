import request from './request'

/**
 * 大屏数据统计（双12当日）
 * @export
 * @param {*} params
 * @returns
 */
export function BigScreenData (params) {
    console.log(params)
    const req = request.create('BigScreenDataReq', params)
    return request('datacenter', 'ScreendataBossService.BigScreenData', req, 'BigScreenDataResp')
};
