import request from './request'

/**
 * 通过类目id获取商品价格模版
 * @export
 * @param {*} params
 * @returns
 */
export function getTemplateByCategoryId(params) {
    console.log(params)
    const req = request.create('GetTemplateByCategoryIdReq', params)
    return request('product', 'ProductPriceTemplateService.GetTemplateByCategoryId', req, 'price.GetTemplateByCategoryIdResp')
};
