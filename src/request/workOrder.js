import request from './request'

/**
 * 小组相关
 */
// 添加小组
export function AddWorkOrderGroup (params) {
    const req = request.create('WorkOrderAddGroupReq', params)
    return request('workorder', 'WorkOrderGroupService.AddWorkOrderGroup', req, 'WorkOrderAddGroupResp')
}
// 编辑小组
export function UpdateWorkOrderGroup (params) {
    const req = request.create('WorkOrderUpdateGroupReq', params)
    return request('workorder', 'WorkOrderGroupService.UpdateWorkOrderGroup', req, 'WorkOrderUpdateGroupResp')
}
// 小组获取
export function WorkOrderGroupPageList (params) {
    const req = request.create('WorkOrderPageGroupReq', params)
    return request('workorder', 'WorkOrderGroupService.WorkOrderGroupPageList', req, 'WorkOrderPageGroupResp')
}
// 小组模糊查询
export function ProcessTeamList (params) {
    const req = request.create('WorkOrderListGroupReq', params)
    return request('workorder', 'WorkOrderGroupService.ProcessTeamList', req, 'WorkOrderListGroupResp')
}

/**
 * 标签相关
 */
// 添加标签
export function AddWorkOrderTag (params) {
    const req = request.create('WorkOrderAddTagReq', params)
    return request('workorder', 'WorkOrderTagService.AddWorkOrderTag', req, 'WorkOrderAddTagResp')
}
// 修改标签
export function UpdateTag (params) {
    const req = request.create('WorkOrderUpdateTagReq', params)
    return request('workorder', 'WorkOrderTagService.UpdateTag', req, 'WorkOrderUpdateTagResp')
}
// 有效标签列表查询
export function ValidTagList (params) {
    const req = request.create('WorkOrderValidTagListReq', params)
    return request('workorder', 'WorkOrderTagService.ValidTagList', req, 'WorkOrderValidTagListResp')
}
// 分页查询标签
export function WorkOrderTagPageList (params) {
    const req = request.create('WorkOrderTagPageReq', params)
    return request('workorder', 'WorkOrderTagService.WorkOrderTagPageList', req, 'WorkOrderTagPageResp')
}
// 标签状态修改
export function ChangeTagStatus (params) {
    const req = request.create('WorkOrderChangeTagStatusReq', params)
    return request('workorder', 'WorkOrderTagService.ChangeTagStatus', req, 'WorkOrderChangeTagStatusResp')
}
/**
 * 工单相关
 */
// 创建工单
export function AddWorkOrder (params) {
    const req = request.create('WorkOrderCreateReq', params)
    return request('workorder', 'WorkOrderService.AddWorkOrder', req, 'WorkOrderCreateResp')
}
// 工单详情
export function ViewWorkOrder (params) {
    const req = request.create('WorkOrderViewReq', params)
    return request('workorder', 'WorkOrderService.ViewWorkOrder', req, 'WorkOrderViewResp')
}
// 工单处理
export function DealWorkOrder (params) {
    const req = request.create('WorkOrderDealReq', params)
    return request('workorder', 'WorkOrderService.DealWorkOrder', req, 'WorkOrderDealResp')
}
// 工单处理
export function FllowUpWorkOrder (params) {
    const req = request.create('WorkOrderFllowUpReq', params)
    return request('workorder', 'WorkOrderService.FllowUpWorkOrder', req, 'WorkOrderFllowUpResp')
}
// 工单关闭
export function CloseWorkOrder (params) {
    const req = request.create('WorkOrderCloseReq', params)
    return request('workorder', 'WorkOrderService.CloseWorkOrder', req, 'WorkOrderCloseResp')
}
// 工单搜索
export function globalSearch (params) {
    console.log(params)
    const req = request.create('WorkOrderGlobalSearchReq', params)
    return request('workorder', 'WorkOrderService.GlobalSearch', req, 'WorkOrderGlobalSearchResp')
}
// 工单导出
export function exportByTimeSection (params) {
    console.log(params)
    const req = request.create('ExportByTimeSectionReq', params)
    return request('workorder', 'WorkOrderService.ExportByTimeSection', req, 'ExportByTimeSectionResp')
}
