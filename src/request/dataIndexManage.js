import request from './request'

/**
 * 分页模糊查询
 * @export
 * @param {*} params
 * @returns
 */
export function GetTargetPageByParam(params) {
    const req = request.create('GetTargetPageByParamReq', params)
    return request('datahouse', 'DataHouseTargetService.GetTargetPageByParam', req, 'GetTargetPageByParamResp')
};

/**
 * 新增指标
 * @export
 * @param {*} params
 * @returns
 */
export function AddTargetData(params) {
    const req = request.create('AddTargetDataReq', params)
    return request('datahouse', 'DataHouseTargetService.AddTargetData', req, 'AddTargetDataResp')
};

/**
 * 编辑指标
 * @export
 * @param {*} params
 * @returns
 */
export function EditTargetData(params) {
    const req = request.create('EditTargetDataReq', params)
    return request('datahouse', 'DataHouseTargetService.EditTargetData', req, 'EditTargetDataResp')
};

/**
 * 删除指标
 * @export
 * @param {*} params
 * @returns
 */
export function DeleteTargetData(params) {
    const req = request.create('DeleteTargetDataReq', params)
    return request('datahouse', 'DataHouseTargetService.DeleteTargetData', req, 'DeleteTargetDataResp')
};

/**
 * 批量导入
 * @export
 * @param {*} params
 * @returns
 */
export function AddTargetDataByExcel(params) {
    const req = request.create('AddTargetDataByExcelReq', params)
    return request('datahouse', 'DataHouseTargetService.AddTargetDataByExcel', req, 'AddTargetDataByExcelResp')
};