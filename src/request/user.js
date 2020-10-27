import request from './request'

/**
 * 用户信息管理列表分页查询
 * @export
 * @param {*} params
 * @returns
 */
export function listUserByPage (params) {
    console.log(params)
    const req = request.create('ListUserByPageReq', params)
    return request('member', 'UserBossService.ListUserByPage', req, 'member.ListUserByPageResp')
};

/**
 * 获取用户基本信息
 * @export
 * @param {*} params
 * @returns
 */
export function getUserManageInfo (params) {
    console.log(params)
    const req = request.create('UserIdReq', params)
    return request('member', 'UserBossService.GetUserManageInfo', req, 'member.UserManageInfoResp')
};

/**
 * 查询用户收货地址信息
 * @export
 * @param {*} params
 * @returns
 */
export function listAddress (params) {
    console.log(params)
    const req = request.create('UserIdReq', params)
    return request('member', 'UserBossService.ListAddress', req, 'member.ListAddressResp')
}

/**
 * 获取用户上级链路
 * @export
 * @param {*} params
 * @returns
 */
export function getFatherChain (params) {
    console.log(params)
    const req = request.create('UserIdReq', params)
    return request('member', 'UserBossService.GetFatherChain', req, 'member.GetFatherChainResp')
}

/**
 * 手动发送验证码
 * @export
 * @param {*} params
 * @returns
 */
export function setMsgCode (params) {
    console.log(params)
    const req = request.create('SetMsgCodeReq', params)
    return request('member', 'UserBossService.SetMsgCode', req, 'member.StringResp')
}

/**
 * 查询用户订单列表
 * @export
 * @param {*} params
 * @returns
 */
export function listUserOrderByPage (params) {
    console.log(params)
    const req = request.create('ListUserOrderByPageReq', params)
    return request('member', 'UserBossService.ListUserOrderByPage', req, 'member.ListUserOrderByPageResp')
}

/**
 * 查询用户反馈问题列表
 * @export
 * @param {*} params
 * @returns
 */
export function listQuestionByPage (params) {
    console.log(params)
    const req = request.create('ListQuestionByPageReq', params)
    return request('member', 'UserBossService.ListQuestionByPage', req, 'member.ListQuestionByPageResp')
}

/**
 * 获取用户本团队信息
 * @export
 * @param {*} params
 * @returns
 */
export function teamMemberInfo (params) {
    console.log(params)
    const req = request.create('UserIdReq', params)
    return request('member', 'UserBossService.TeamMemberInfo', req, 'member.TeamMemberInfoResp')
}

/**
 * 根据订单号，手动触发返佣
 * @export
 * @param {*} params
 * @returns
 */
export function testCreateOrderCommission (params) {
    console.log(params)
    const req = request.create('TestCreateOrderCommissionReq', params)
    return request('member', 'UserExtendBossService.TestCreateOrderCommission', req, 'member.TestCreateOrderCommissionResp')
}

/**
 * 根据订单佣金记录打钱
 * @export
 * @param {*} params
 * @returns
 */
export function addMoneyByOrderNo (params) {
    console.log(params)
    const req = request.create('AddMoneyByOrderNoReq', params)
    return request('member', 'UserExtendBossService.AddMoneyByOrderNo', req, 'member.BooleanResp')
}

/**
 * 订单分佣记录查询
 * @export
 * @param {*} params
 * @returns
 */
export function listOrderCommissionByPage (params) {
    console.log(params)
    const req = request.create('ListOrderCommissionByPageReq', params)
    return request('member', 'UserExtendBossService.ListOrderCommissionByPage', req, 'member.ListOrderCommissionByPageResp')
}

/**
 * 用户收支记录查询
 * @export
 * @param {*} params
 * @returns
 */
export function listAccountDetailByPage (params) {
    console.log(params)
    const req = request.create('ListAccountDetailByPageReq', params)
    return request('member', 'UserExtendBossService.ListAccountDetailByPage', req, 'member.ListAccountDetailByPageResp')
}

/**
 * 注销手机号
 * @export
 * @param {*} params
 * @returns
 */
export function removeUserMobile (params) {
    console.log(params)
    const req = request.create('RemoveUserMobileReq', params)
    return request('member', 'UserExtendBossService.RemoveUserMobile', req, 'member.BooleanResp')
}

/**
 * 为用户重新设置手机号
 * @export
 * @param {*} params
 * @returns
 */
export function updateUserMobile (params) {
    console.log(params)
    const req = request.create('UpdateUserMobileReq', params)
    return request('member', 'UserExtendBossService.UpdateUserMobile', req, 'member.BooleanResp')
}

/**
 * 手动触发升级事件
 * @export
 * @param {*} params
 * @returns
 */
export function publishUpgradeEvent (params) {
    console.log(params)
    const req = request.create('PublishUpgradeEventReq', params)
    return request('member', 'UserExtendBossService.PublishUpgradeEvent', req, 'member.BooleanResp')
}

/**
 * 手动断绑
 * @export
 * @param {*} params
 * @returns
 */
export function bindDisconnect (params) {
    console.log(params)
    const req = request.create('BindDisconnectReq', params)
    return request('member', 'UserExtendBossService.BindDisconnect', req, 'member.BooleanResp')
}

/**
 * 手动绑定
 * @export
 * @param {*} params
 * @returns
 */
export function bindChange (params) {
    console.log(params)
    const req = request.create('BindChangeReq', params)
    return request('member', 'UserExtendBossService.BindChange', req, 'member.BooleanResp')
}

/**
 * 补积分
 * @export
 * @param {*} params
 * @returns
 */
export function addMoney (params) {
    console.log(params)
    const req = request.create('AddMoneyReq', params)
    return request('member', 'UserExtendBossService.AddMoney', req, 'member.BooleanResp')
}

/**
 * 手动预设用户等级
 * @export
 * @param {*} params
 * @returns
 */
export function uplevel (params) {
    console.log(params)
    const req = request.create('UplevelReq', params)
    return request('member', 'UserExtendBossService.Uplevel', req, 'member.BooleanResp')
}

/**
 * 修改Fingo导师信息
 * @export
 * @param {*} params
 * @returns
 */
export function updateFingoMasterInfo (params) {
    console.log(params)
    const req = request.create('UpdateFingoMasterInfoReq', params)
    return request('member', 'UserExtendBossService.UpdateFingoMasterInfo', req, 'member.BooleanResp')
}

/**
 * 批量打款
 * @export
 * @param {*} params
 * @returns
 */
export function batchAddMoney (params) {
    console.log(params)
    const req = request.create('BatchAddMoneyReq', params)
    return request('member', 'UserExtendBossService.BatchAddMoney', req, 'member.BatchAddMoneyResp')
}

/**
 * 批量注册
 * @export
 * @param {*} params
 * @returns
 */
export function batchRegister (params) {
    console.log(params)
    const req = request.create('BatchRegisterReq', params)
    return request('member', 'UserExtendBossService.BatchRegister', req, 'member.BatchRegisterResp')
}

/**
 * 查询粉丝
 * @export
 * @param {*} params
 * @returns
 */
export function listTeamMemberByPage (params) {
    console.log(params)
    const req = request.create('ListTeamMemberByPageReq', params)
    return request('member', 'UserBossService.ListTeamMemberByPage', req, 'member.ListTeamMemberByPageResp')
}
/**
 * 修改用户国家
 * @export
 * @param {*} params
 * @returns
 */
export function ChangeUserCountry (params) {
    console.log(params)
    const req = request.create('ChangeUserCountryReq', params)
    return request('member', 'UserExtendBossService.ChangeUserCountry', req, 'member.ChangeUserCountryResp')
}

/**
 * 导师管理
 */

//  导师列表
export function listFingoMasterInfo (params) {
    console.log(params)
    const req = request.create('ListFingoMasterInfoReq', params)
    return request('member', 'UserExtendBossService.ListFingoMasterInfo', req, 'member.ListFingoMasterInfoResp')
}
// //  修改Fingo导师信息
// export function updateFingoMasterInfo (params) {
//     console.log(params)
//     const req = request.create('UpdateFingoMasterInfoReq', params)
//     return request('member', 'UserExtendBossService.UpdateFingoMasterInfo', req, 'member.BooleanResp')
// }

// 查品牌馆数据
export function GetBrandSalesInfo (params) {
    const req = request.create('GetBrandSalesInfoReq', params)
    return request('member', 'UserExtendBossService.GetBrandSalesInfo', req, 'GetBrandSalesInfoResp')
}
