import request from './request'

/**
 * 实时客服在线状态
 */
export function RealTimeCsStaffOnLineInfo (params) {
    const req = request.create('RealTimeCsStaffOnLineInfoReq', params)
    return request('datahouse', 'CustomerServiceDataService.RealTimeCsStaffOnLineInfo', req, 'RealTimeCsStaffOnLineInfoResp')
}

/**
 * 用户实时在线数据
 */
export function UserRealTimeOnLineInfo (params) {
    const req = request.create('UserRealTimeOnLineInfoReq', params)
    return request('datahouse', 'CustomerServiceDataService.UserRealTimeOnLineInfo', req, 'UserRealTimeOnLineInfoResp')
}

/**
 * 客服个人数据
 */
export function CsStaffPersonalData (params) {
    const req = request.create('CsStaffPersonalDataReq', params)
    return request('datahouse', 'CustomerServiceDataService.CsStaffPersonalData', req, 'CsStaffPersonalDataResp')
}

/**
 * 获取客服列表数据
 */
export function CsStaffList (params) {
    const req = request.create('CsStaffListReq', params)
    return request('datahouse', 'CustomerServiceDataService.CsStaffList', req, 'CsStaffListResp')
}

/**
 * 每日咨询量趋势
 */
export function DayConsultationVolume (params) {
    const req = request.create('DayConsultationVolumeReq', params)
    return request('datahouse', 'CustomerServiceDataService.DayConsultationVolume', req, 'DayConsultationVolumeResp')
}

/**
 * 用户在线报表
 */
export function CustomerServiceUserOnLineData (params) {
    const req = request.create('CustomerServiceUserOnLineDataReq', params)
    return request('datahouse', 'CustomerServiceDataService.CustomerServiceUserOnLineData', req, 'CustomerServiceUserOnLineDataResp')
}

/**
 * 客服数据报表
 */
export function CustomerServiceEachDetailData (params) {
    const req = request.create('CustomerServiceEachDetailDataReq', params)
    return request('datahouse', 'CustomerServiceDataService.CustomerServiceEachDetailData', req, 'CustomerServiceEachDetailDataResp')
}

/**
 * 客户聊天详情报表
 */
export function CustomerServiceChatDetailData (params) {
    const req = request.create('CustomerServiceChatDetailDataReq', params)
    return request('datahouse', 'CustomerServiceDataService.CustomerServiceChatDetailData', req, 'CustomerServiceChatDetailDataResp')
}

/**
 * 未接起聊天详情报表
 */
export function CustomerServiceUnPickDetailData (params) {
    const req = request.create('CustomerServiceUnPickDetailDataReq', params)
    return request('datahouse', 'CustomerServiceDataService.CustomerServiceUnPickDetailData', req, 'CustomerServiceUnPickDetailDataResp')
}

/**
 * 导出excel数据
 */
export function CustomerServiceAllDataDetailToExcel (params) {
    const req = request.create('CustomerServiceAllDataDetailToExcelReq', params)
    return request('datahouse', 'CustomerServiceDataService.CustomerServiceAllDataDetailToExcel', req, 'CustomerServiceAllDataDetailToExcelResp')
}

/**
 * 所有数据中心枚举返回
 */
export function GetDataCenterTypeData (params) {
    const req = request.create('GetDataCenterTypeDataReq', params)
    return request('datahouse', 'DataCenterTypeService.GetDataCenterTypeData', req, 'GetDataCenterTypeDataResp')
}

/**
 * 客户聊天详情报表
 */
export function CustomerChatDetailData (params) {
    const req = request.create('CustomerChatDetailDataReq', params)
    return request('datahouse', 'CustomerServiceDataService.CustomerChatDetailData', req, 'CustomerChatDetailDataResp')
}