import request from './request'

// 登录
export function login (params) {
    const req = request.create('SysLoginReq', params)
    return request('member', 'SysUserBossService.SysLogin', req, 'SysLoginResp')
}
