import request from './request'

/**
 * 添加后台客服人员
 */
export function AddCsStaff (params) {
    const req = request.create('CsStaffAddOrUpdateReq', params)
    return request('chat', 'CsStaffBossService.AddCsStaff', req, 'BooleanResp')
}

/**
 * 分页查询后台客服人员
 */
export function ListCsStaffByPage (params) {
    const req = request.create('ListCsStaffByPageReq', params)
    return request('chat', 'CsStaffBossService.ListCsStaffByPage', req, 'ListCsStaffByPageResp')
}

/**
 * 修改客服人员支持语言
 */
export function UpdateCsStaff (params) {
    const req = request.create('CsStaffAddOrUpdateReq', params)
    return request('chat', 'CsStaffBossService.UpdateCsStaff', req, 'BooleanResp')
}

/**
 * 删除客服人员
 */
export function DeleteCsStaff (params) {
    const req = request.create('DeleteCsStaffReq', params)
    return request('chat', 'CsStaffBossService.DeleteCsStaff', req, 'BooleanResp')
}