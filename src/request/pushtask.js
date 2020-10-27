import request from './request'

/**
 * 取消定时推送
 * @export
 * @param {*} params
 * @returns
 */
export function cancelTimingTask(params) {
    const req = request.create('CancelTimingTaskReq', params)
    return request('chat', 'PushTaskService.CancelTimingTask', req, 'pushtask.CancelTimingTaskResp')
};

/**
 * 创建推送任务
 * @export
 * @param {*} params
 * @returns
 */
export function createPushTask(params) {
    const req = request.create('CreatePushTaskReq', params)
    return request('chat', 'PushTaskService.CreatePushTask', req, 'pushtask.CreatePushTaskResp')
};

/**
 * 删除推送任务
 * @export
 * @param {*} params
 * @returns
 */
export function deletePushTask(params) {
    const req = request.create('DeletePushTaskReq', params)
    return request('chat', 'PushTaskService.DeletePushTask', req, 'pushtask.DeletePushTaskResp')
};

/**
 * 编辑推送任务
 * @export
 * @param {*} params
 * @returns
 */
export function editPushTask(params) {
    const req = request.create('EditPushTaskReq', params)
    return request('chat', 'PushTaskService.EditPushTask', req, 'pushtask.EditPushTaskResp')
};

/**
 * 编辑推送目标人群
 * @export
 * @param {*} params
 * @returns
 */
export function editUserGroup(params) {
    const req = request.create('EditUserGroupReq', params)
    return request('chat', 'PushTaskService.EditUserGroup', req, 'pushtask.EditUserGroupResp')
};

/**
 * 发送推送任务
 * @export
 * @param {*} params
 * @returns
 */
export function sendPush(params) {
    const req = request.create('SendPushReq', params)
    return request('chat', 'PushTaskService.SendPush', req, 'pushtask.SendPushResp')
};

/**
 * 马上发送定时推送
 * @export
 * @param {*} params
 * @returns
 */
export function sendTimingTaskNow(params) {
    const req = request.create('SendTimingTaskNowReq', params)
    return request('chat', 'PushTaskService.SendTimingTaskNow', req, 'pushtask.SendTimingTaskNowResp')
};

/**
 * 搜索推送任务/记录
 * @export
 * @param {*} params
 * @returns
 */
export function searchPushTaskOrRecord(params) {
    const req = request.create('SearchPushTaskOrRecordReq', params)
    return request('chat', 'PushTaskService.SearchPushTaskOrRecord', req, 'pushtask.SearchPushTaskOrRecordResp')
};

/**
 * 新增特定用户组
 * @export
 * @param {*} params
 * @returns
 */
export function AddUserGroupBySpe(params) {
    const req = request.create('AddUserGroupBySpeRep', params)
    return request('datahouse', 'PushTaskUserGroupService.AddUserGroupBySpe', req, 'datahouse.AddUserGroupBySpeResp')
};

/**
 * 新增分群用户组
 * @export
 * @param {*} params
 * @returns
 */
export function AddUserGroupByGroup(params) {
    const req = request.create('AddUserGroupByGroupReq', params)
    return request('datahouse', 'PushTaskUserGroupService.AddUserGroupByGroup', req, 'datahouse.AddUserGroupByGroupResp')
};

/**
 * 查询用户组
 * @export
 * @param {*} params
 * @returns
 */
export function GetUserGroupInfo(params) {
    const req = request.create('GetUserGroupInfoReq', params)
    return request('datahouse', 'PushTaskUserGroupService.GetUserGroupInfo', req, 'datahouse.GetUserGroupInfoResp')
};

/**
 * 查詢用戶組詳情
 * @export
 * @param {*} params
 * @returns
 */
export function GetUserGroupDetailInfo(params) {
    const req = request.create('GetUserGroupDetailInfoReq', params)
    return request('datahouse', 'PushTaskUserGroupService.GetUserGroupDetailInfo', req, 'datahouse.GetUserGroupDetailInfoResp')
};

/**
 * 编辑用户组
 * @export
 * @param {*} params
 * @returns
 */
export function EditUserGroupInfo(params) {
    const req = request.create('EditUserGroupInfoReq', params)
    return request('datahouse', 'PushTaskUserGroupService.EditUserGroupInfo', req, 'datahouse.EditUserGroupInfoResp')
};

/**
 * 删除用户组
 * @export
 * @param {*} params
 * @returns
 */
export function DeleteUserGroupInfo(params) {
    const req = request.create('DeleteUserGroupInfoReq', params)
    return request('datahouse', 'PushTaskUserGroupService.DeleteUserGroupInfo', req, 'datahouse.DeleteUserGroupInfoResp')
};

/**
 * 用户属性查询
 * @export
 * @param {*} params
 * @returns
 */
export function GetUserPropertyList(params) {
    const req = request.create('GetUserPropertyListReq', params)
    return request('datahouse', 'PushTaskUserGroupService.GetUserPropertyList', req, 'datahouse.GetUserPropertyListResp')
};

/**
 * 分组分群userId导出excel
 * @export
 * @param {*} params
 * @returns
 */
export function GetUserGroupIdToExcel(params) {
    const req = request.create('GetUserGroupIdToExcelReq', params)
    return request('datahouse', 'PushTaskUserGroupService.GetUserGroupIdToExcel', req, 'datahouse.GetUserGroupIdToExcelResp')
};

/**
 * 分群统计共多少用户
 * @export
 * @param {*} params
 * @returns
 */
export function GetUserGroupIdTotal(params) {
    const req = request.create('GetUserGroupIdTotalReq', params)
    return request('datahouse', 'PushTaskUserGroupService.GetUserGroupIdTotal', req, 'datahouse.GetUserGroupIdTotalResp')
};

/**
 * 編輯頁面中使用ES導出用戶Id excel
 * @export
 * @param {*} params
 * @returns
 */
export function GetUserIdsExcelOnEditPage(params) {
    const req = request.create('GetUserIdsExcelOnEditPageReq', params)
    return request('datahouse', 'PushTaskUserGroupService.GetUserIdsExcelOnEditPage', req, 'datahouse.GetUserIdsExcelOnEditPageResp')
};

/**
 * 分群统计共多少用户NEW
 * @export
 * @param {*} params
 * @returns
 */
export function GetUserIdsCountOnEditPage(params) {
    const req = request.create('GetUserIdsCountOnEditPageReq', params)
    return request('datahouse', 'PushTaskUserGroupService.GetUserIdsCountOnEditPage', req, 'datahouse.GetUserIdsCountOnEditPageResp')
};

/**
 * 创建app版本
 * @export
 * @param {*} params
 * @returns
 */
export function CreateAppVersion(params) {
    const req = request.create('CreateAppVersionReq', params)
    return request('chat', 'AppVersionBossService.CreateAppVersion', req, 'CreateAppVersionResp')
};

/**
 * 编辑app版本
 * @export
 * @param {*} params
 * @returns
 */
export function EditAppVersion(params) {
    const req = request.create('EditAppVersionReq', params)
    return request('chat', 'AppVersionBossService.EditAppVersion', req, 'EditAppVersionResp')
};

/**
 * 查询当前版本的信息
 * @export
 * @param {*} params
 * @returns
 */
export function SearchCurrentAppVersionInfo(params) {
    const req = request.create('SearchCurrentAppVersionInfoReq', params)
    return request('chat', 'AppVersionBossService.SearchCurrentAppVersionInfo', req, 'SearchCurrentAppVersionInfoResp')
};

/**
 * 查询当前最低版本信息
 * @export
 * @param {*} params
 * @returns
 */
export function SearchLowestAppVersionInfo(params) {
    const req = request.create('SearchLowestAppVersionInfoReq', params)
    return request('chat', 'AppVersionBossService.SearchLowestAppVersionInfo', req, 'SearchLowestAppVersionInfoResp')
};

/**
 * 分页查询所有版本分页
 * @export
 * @param {*} params
 * @returns
 */
export function SearchAppVersionInfoWithPage(params) {
    const req = request.create('SearchAppVersionInfoWithPageReq', params)
    return request('chat', 'AppVersionBossService.SearchAppVersionInfoWithPage', req, 'SearchAppVersionInfoWithPageResp')
};

/**
 * 更新版本
 * @export
 * @param {*} params
 * @returns
 */
export function UpdateAppVersionToCurrentAppVersion(params) {
    const req = request.create('UpdateAppVersionToCurrentAppVersionReq', params)
    return request('chat', 'AppVersionBossService.UpdateAppVersionToCurrentAppVersion', req, 'UpdateAppVersionToCurrentAppVersionResp')
};

/**
 * 发布或撤销版本
 * @export
 * @param {*} params
 * @returns
 */
export function PublishAppVersionOrNot(params) {
    const req = request.create('PublishAppVersionOrNotReq', params)
    return request('chat', 'AppVersionBossService.PublishAppVersionOrNot', req, 'PublishAppVersionOrNotResp')
};

/**
 * 编辑版本详情
 * @export
 * @param {*} params
 * @returns
 */
export function GetAppVersionDetail(params) {
    const req = request.create('GetAppVersionDetailReq', params)
    return request('chat', 'AppVersionBossService.GetAppVersionDetail', req, 'GetAppVersionDetailResp')
};