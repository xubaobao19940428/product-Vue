import request from './request'

/**
 * 运费模板
 * @export
 * @param {*} params
 * @returns
 */
// 列表
export function freightTemplateListPage (params) {
    console.log(params)
    const req = request.create('FreightTemplateListPageReq', params)
    return request('product', 'FreightTemplateService.FreightTemplateListPage', req, 'freight.FreightTemplateListPageResp')
}
// 添加运费模板
export function addTemplate (params) {
    console.log(params)
    const req = request.create('FreightTemplateAddReq', params)
    return request('product', 'FreightTemplateService.FreightTemplateAdd', req, 'freight.FreightTemplateAddResp')
}
// 修改运费模板
export function updateTemplate (params) {
    console.log(params)
    const req = request.create('FreightTemplateUpdateReq', params)
    return request('product', 'FreightTemplateService.FreightTemplateUpdate', req, 'freight.FreightTemplateUpdateResp')
}
// 获取单个运费模板详情
export function getTemplate (params) {
    console.log(params)
    const req = request.create('FreightTemplateGetReq', params)
    return request('product', 'FreightTemplateService.FreightTemplateGet', req, 'freight.FreightTemplateGetResp')
}
