import request from './request'

/**
 * 地址查询
 * @export
 * @param {*} params
 * @returns
 */
export function getAddress (params) {
    console.log(params)
    const req = request.create('GetAddressReq', params)
    return request('erp', 'AddressBossService.GetAddress', req, 'GetAddressResp')
}
/**
 * 新增/更新地址
 * @export
 * @param {*} params
 * @returns
 */
export function updateAddress (params) {
    console.log(params)
    const req = request.create('UpdateAddressReq', params)
    return request('erp', 'AddressBossService.UpdateAddress', req, 'UpdateAddressResp')
}
/**
 * 删除地址
 * @export
 * @param {*} params
 * @returns
 */
export function deleteAddress (params) {
    console.log(params)
    const req = request.create('DeleteAddressReq', params)
    return request('erp', 'AddressBossService.DeleteAddress', req, 'DeleteAddressResp')
}
/**
 * 导入地址
 * @export
 * @param {*} params
 * @returns
 */
export function importAddress (params) {
    console.log(params)
    const req = request.create('ImportAddressReq', params)
    return request('erp', 'AddressBossService.ImportAddress', req, 'ImportAddressResp')
}
/**
 * 物流公司地址查询
 * @export
 * @param {*} params
 * @returns
 */
export function getAddressLogi (params) {
    console.log(params)
    const req = request.create('GetAddressLogiReq', params)
    return request('erp', 'AddressLogiBossService.GetAddressLogi', req, 'GetAddressLogiResp')
}
/**
 * 物流公司新增/更新地址
 * @export
 * @param {*} params
 * @returns
 */
export function updateAddressLogi (params) {
    console.log(params)
    const req = request.create('UpdateAddressLogiReq', params)
    return request('erp', 'AddressLogiBossService.UpdateAddressLogi', req, 'UpdateAddressLogiResp')
}
/**
 * 物流公司删除地址
 * @export
 * @param {*} params
 * @returns
 */
export function deleteAddressLogi (params) {
    console.log(params)
    const req = request.create('DeleteAddressLogiReq', params)
    return request('erp', 'AddressLogiBossService.DeleteAddressLogi', req, 'DeleteAddressLogiResp')
}
/**
 * 导入物流公司地址
 * @export
 * @param {*} params
 * @returns
 */
export function importAddressLogi (params) {
    console.log(params)
    const req = request.create('ImportAddressLogiReq', params)
    return request('erp', 'AddressLogiBossService.ImportAddressLogi', req, 'ImportAddressLogiResp')
}

// 物流公司后台接口

/**
 * 物流公司列表查询
 * @export
 * @param {*} params
 * @returns
 */
export function getLogiCompanyList (params) {
    console.log(params)
    const req = request.create('LogiCompanyListReq', params)
    return request('erp', 'LogiCompanyBossService.GetLogiCompanyList', req, 'LogiCompanyListResp')
}
/**
 * 物流公司详情-编辑使用
 * @export
 * @param {*} params
 * @returns
 */
export function getLogiCompanyDetail (params) {
    console.log(params)
    const req = request.create('LogiCompanyDetailReq', params)
    return request('erp', 'LogiCompanyBossService.GetLogiCompanyDetail', req, 'LogiCompanyDetailResp')
}
/**
 * 获取物流公司配送邮编
 * @export
 * @param {*} params
 * @returns
 */
export function getLogiCompanyPostcodes (params) {
    console.log(params)
    const req = request.create('LogiCompanyPostcodesReq', params)
    return request('erp', 'LogiCompanyBossService.GetLogiCompanyPostcodes', req, 'LogiCompanyPostcodesResp')
}
/**
 *  保存物流公司邮编
 * @param {*} params
 * @returns
 */
export function saveLogiCompany (params) {
    console.log(params)
    const req = request.create('SaveLogiCompanyReq', params)
    return request('erp', 'LogiCompanyBossService.SaveLogiCompany', req, 'SaveLogiCompanyResp')
}
// 地址同步
export function syncAddressLogi (params) {
    console.log(params)
    const req = request.create('SyncAddressLogiReq', params)
    return request('erp', 'AddressLogiBossService.SyncAddressLogi', req, 'SyncAddressLogiResp')
}
//货代跟踪
/**
 *  货代跟踪列表信息
 * @param {*} params
 * @returns
 */
export function FreightForwarderList (params) {
    const req = request.create('FreightForwarderListReq', params)
    return request('erp', 'B2BFreightForwarderService.GetB2BFreightForwarderList', req, 'FreightForwarderListResp')
}
//货代跟踪导出
export function ExportCostGoFreight (params) {
    const req = request.create('FreightForwarderListReq', params)
    return request('erp', 'B2BFreightForwarderService.ExportCostGoFreightForwarder', req, 'ImportB2BFreightForwarderResp')
}
//采购单货代导入
export function ImportPurchaseFreight (params) {
    const req = request.create('ImportB2BFreightForwarderReq', params)
    return request('erp', 'B2BFreightForwarderService.ImportPurchaseFreightForwarder', req, 'ImportB2BFreightForwarderResp')
}
//costgo货代导入
export function ImportCostGoFreight (params) {
    const req = request.create('ImportB2BFreightForwarderReq', params)
    return request('erp', 'B2BFreightForwarderService.ImportCostGoFreightForwarder', req, 'ImportB2BFreightForwarderResp')
}
//货代查询导入
export function QueryFreightForwarderInfo (params) {
    const req = request.create('QueryFreightForwarderInfoReq', params)
    return request('erp', 'B2BFreightForwarderService.QueryFreightForwarderInfo', req, 'FreightForwarderInfoResp')
}
//编辑货代查询
export function EditFreightForwarder (params) {
    const req = request.create('EditFreightForwarderReq', params)
    return request('erp', 'B2BFreightForwarderService.EditFreightForwarderInfo', req, 'FreightForwarderInfoResp')
}
//查看costgo详情
export function B2BOutOrderInfo (params) {
    const req = request.create('B2BOutOrderInfoReq', params)
    return request('erp', 'B2BFreightForwarderService.B2BFreightForwarderSkuInfo', req, 'B2BOutOrderInfoResp')
}
//导入模版获取
export function B2BImportTemplate (params) {
    const req = request.create('B2BImportTemplateReq', params)
    return request('erp', 'B2BFreightForwarderService.B2BImportTemplates', req, 'B2BImportTemplateResp')
}
//B2B出库单
export function EditOutNoFreight (params) {
    const req = request.create('EditFreightForwarderReq', params)
    return request('erp', 'B2BFreightForwarderService.EditOutNoFreightForwarder', req, 'FreightForwarderInfoResp')
}
/**
 * B2C跨境订单
 * @param
 */
//B2C跨境订单列表
export function CrossBorderList (params) {
    const req = request.create('CrossBorderListReq', params)
    return request('erp', 'CrossBorderService.CrossBorderList', req, 'CrossBorderListResp')
}
//B2C跨境订单导出
export function CrossBorderExport (params) {
    const req = request.create('CrossBorderListReq', params)
    return request('erp', 'CrossBorderService.ExportCrossBorderData', req, 'CrossBorderExportResp')
}
//单比订单同步物流信息
export function SyncCrossBorderLogisticsInfo (params) {
    const req = request.create('SingleCrossBorderReq', params)
    return request('erp', 'CrossBorderService.SyncCrossBorderLogisticsInfo', req, 'SingleCrossBorderResp')
}
//取消物流单比
export function CancelCrossBorder (params) {
    const req = request.create('SingleCrossBorderReq', params)
    return request('erp', 'CrossBorderService.CancelCrossBorder', req, 'SingleCrossBorderResp')
}
//确认到达
export function ConfirmArrive (params) {
    const req = request.create('SingleCrossBorderReq', params)
    return request('erp', 'CrossBorderService.ConfirmArrive', req, 'SingleCrossBorderResp')
}
//手动下单
export function ManualOrder (params) {
    const req = request.create('SingleCrossBorderReq', params)
    return request('erp', 'CrossBorderService.ManualOrder', req, 'SingleCrossBorderResp')
}
//搜索条件枚举
export function EnumConfig (params) {
    const req = request.create('EnumConfigReq', params)
    return request('erp', 'CrossBorderService.GetSelectEnum', req, 'EnumConfigResp')
}
//批量确认到达
export function ConfirmArriveBatch (params) {
    const req = request.create('ConfirmArriveBatchReq', params)
    return request('erp', 'CrossBorderService.ConfirmArriveBatch', req, 'ConfirmArriveBatchResp')
}