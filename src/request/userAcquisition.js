import request from './request'

/**
 * 頂部簡單數據顯示
 * @export
 * @param {*} params
 * @returns
 */
export function UserActivityDataDisplay (params) {
    console.log(params)
    const req = request.create('UserActivityDataDisplayReq', params)
    return request('datahouse', 'UserAcquisitionBossService.UserActivityDataDisplay', req, 'UserActivityDataDisplayResp')
};

/**
 * 折線圖
 * @export
 * @param {*} params
 * @returns
 */
export function UaBrokenLineGraph (params) {
    console.log(params)
    const req = request.create('UaBrokenLineGraphReq', params)
    return request('datahouse', 'UserAcquisitionBossService.UaBrokenLineGraph', req, 'UaBrokenLineGraphResp')
};

/**
 * 獲客渠道圓型圖
 * @export
 * @param {*} params
 * @returns
 */
export function UaSourceProportionPieChart (params) {
    console.log(params)
    const req = request.create('UaSourceProportionPieChartReq', params)
    return request('datahouse', 'UserAcquisitionBossService.UaSourceProportionPieChart', req, 'UaSourceProportionPieChartResp')
};

/**
 * 獲客終端圓型圖
 * @export
 * @param {*} params
 * @returns
 */
export function UaSiteProportionPieChart (params) {
    console.log(params)
    const req = request.create('UaSiteProportionPieChartReq', params)
    return request('datahouse', 'UserAcquisitionBossService.UaSiteProportionPieChart', req, 'UaSiteProportionPieChartResp')
};