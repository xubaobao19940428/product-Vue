import request from './request'

/**
 * 客服设置服务状态
 */
export function setServiceStatus (params) {
    const req = request.create('SetServiceStatusReq', params)
    return request('chat', 'ChatService.SetServiceStatus', req, 'SetServiceStatusResp')
}
/**
 * 客服登录
 */
export function CustomerServiceSignIn (params) {
    const req = request.create('CustomerServiceSignInReq', params)
    return request('chat', 'ChatService.CustomerServiceSignIn', req, 'CustomerServiceSignInResp')
}
/**
 * 客服退出
 */
export function CustomerServiceSingOut (params) {
    const req = request.create('CustomerServiceSignOutReq', params)
    return request('chat', 'ChatService.CustomerServiceSingOut', req, 'CustomerServiceSingOutResp')
}
/**
 * 获取历史记录
 */
export function GetSessionWithPage (params) {
    const req = request.create('GetSessionWithPageReq', params)
    return request('chat', 'ChatService.GetSessionWithPage', req, 'GetSessionWithPageResp')
}
/**
 * 结束服务
 */
export function CSStopService (params) {
    const req = request.create('CSStopServiceReq', params)
    return request('chat', 'ChatService.CSStopService', req, 'CSStopServiceResp')
}
