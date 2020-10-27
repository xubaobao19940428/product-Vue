import request from './request'

/**
 * 根据国家获取银行列表
 * @export
 * @param {*} params
 * @returns
 */
export function listBanksOfCountry(params) {
    console.log(params)
    const req = request.create('ListBanksByCountryReq', params)
    return request('polypay', 'WithdrawalBossService.ListBanksByCountry', req, 'polypay.ListBanksByCountryResp')
};

/**
 * 查询用户提现申请列表
 * @export
 * @param {*} params
 * @returns
 */
export function listUserWithdrawalByPage(params) {
    console.log(params)
    const req = request.create('ListUserWithdrawalByPageReq', params)
    return request('polypay', 'WithdrawalBossService.ListUserWithdrawalByPage', req, 'polypay.ListUserWithdrawalByPageResp')
}

/**
 * 查询用户提现导出Excel
 * @export
 * @param {*} params
 * @returns
 */
export function listUserWithdrawalExport(params) {
    console.log(params)
    const req = request.create('ListUserWithdrawalExportReq', params)
    return request('polypay', 'WithdrawalBossService.ListUserWithdrawalExport', req, 'polypay.ListUserWithdrawalExportResp')
}


/**
 * 后台确认提现
 * @export
 * @param {*} params
 * @returns
 */
export function confirmUserWithdrawalApply(params) {
    console.log(params)
    const req = request.create('ConfirmUserWithdrawalApplyReq', params)
    return request('polypay', 'WithdrawalBossService.ConfirmUserWithdrawalApply', req, 'polypay.BooleanResp')
}

/**
 * 分页查询用户收支记录
 * @export
 * @param {*} params
 * @returns
 */
export function listAccountDetailByPage(params) {
    console.log(params)
    const req = request.create('ListAccountDetailByPageReq', params)
    return request('polypay', 'UserAccountBossService.ListAccountDetailByPage', req, 'polypay.ListAccountDetailByPageResp')
}

/**
 * 获取用户银行账户
 * @export
 * @param {*} params
 * @returns
 */
export function getUserBankList(params) {
    console.log(params)
    const req = request.create('GetUserBankListReq', params)
    return request('polypay', 'WithdrawalBossService.GetUserBankList', req, 'polypay.GetUserBankListResp')
}

/**
 * 添加银行账户
 * @export
 * @param {*} params
 * @returns
 */
export function addUserBank(params) {
    console.log(params)
    const req = request.create('AddUserBankReq', params)
    return request('polypay', 'WithdrawalBossService.AddUserBank', req, 'polypay.AddUserBankResp')
}

/**
 * 支付信息查询
 * @export
 * @param {*} params
 * @returns
 */
export function searchPayInfo(params) {
    const req = request.create('SearchPayInfoReq', params)
    return request('polypay', 'PayInfoService.SearchPayInfo', req, 'polypay.SearchPayInfoResp')
}

/**
 * 审单统计查询
 * @param {*} params 
 */
export function auditFlowCheckList(params) {
    const req = request.create('AuditFlowCheckListReq', params)
    return request('polypay', 'PayInfoService.AuditFlowCheckList', req, 'polypay.AuditFlowCheckListResp')
}

/**
 * 审单统计信息下载
 * @param {*} params 
 */
export function downloadAuditFlowCheckList(params) {
    const req = request.create('AuditFlowCheckListReq', params)
    return request('polypay', 'PayInfoService.DownloadAuditFlowCheckList', req, 'polypay.DownloadAuditFlowCheckListResp')
}

/**
 * 支付信息同步
 * @export
 * @param {*} params
 * @returns
 */
export function synPayInfo(params) {
    const req = request.create('SynPayInfoReq', params)
    return request('polypay', 'PayInfoService.SynPayInfo', req, 'polypay.SynPayInfoResp')
}
// 手动支付成功
export function manualPaySuccess (params) {
    const req = request.create('ManualPaySuccessReq', params)
    return request('polypay', 'PayInfoService.ManualPaySuccess', req, 'polypay.ManualPaySuccessResp')
}
// 手动支付失败
export function manualPayFail (params) {
    const req = request.create('ManualPayFailReq', params)
    return request('polypay', 'PayInfoService.ManualPayFail', req, 'polypay.ManualPayFailResp')
}
// 支付相关信息接口
export function payRelatedInfo (params) {
    const req = request.create('PayRelatedInfoReq', params)
    return request('polypay', 'PayInfoService.PayRelatedInfo', req, 'polypay.PayRelatedInfoResp')
}
// 数据回滚
export function accountDetailRollBack (params) {
    const req = request.create('AccountDetailRollBackReq', params)
    return request('polypay', 'UserAccountBossService.AccountDetailRollBack', req, 'polypay.AccountDetailRollBackResp')
}

// 充值管理
// 获取充值信息列表
export function GetChargeRecordList (params) {
    const req = request.create('GetChargeListReq', params)
    return request('polypay', 'ChargeService.GetChargeRecordList', req, 'polypay.GetChargeListResp')
}

// 充值失败重试
export function ReChargeForOrder (params) {
    const req = request.create('ReChargeForOrderReq', params)
    return request('polypay', 'ChargeService.ReChargeForOrder', req, 'polypay.BooleanResp')
}

// 充值退款
export function RefundForCharge (params) {
    const req = request.create('RefundForChargeReq', params)
    return request('polypay', 'ChargeService.RefundForCharge', req, 'polypay.BooleanResp')
}
