import request from './request'

/**
 * 导出任务列表
 * @export
 * @param {*} params
 * @returns
 */
export function ListExportRecordByPage(params) {
    console.log(params)
    const req = request.create('ListExportRecordByPageReq', params)
    return request('datahouse', 'ExportRecordBossService.ListExportRecordByPage', req, 'ListExportRecordByPageResp')
};
/**
 * 删除文件和记录
 * @export
 * @param {*} params
 * @returns
 */
export function DeleteExportTask(params) {
    console.log(params)
    const req = request.create('DeleteExportByIdReq', params)
    return request('datahouse', 'ExportRecordBossService.DeleteExportTask', req, 'BooleanResp')
};
/**
 * 公共导出接口
 * @export
 * @param {*} params
 * @returns
 */
export function RouteAndExport(params) {
    console.log(params)
    const req = request.create('CommonExportReq', params)
    return request('datahouse', 'CommonExportBossService.RouteAndExport', req, 'ExportResultResp')
}