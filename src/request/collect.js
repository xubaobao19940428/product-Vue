import request from './request'

/**
 * 根据用户id查询商品收藏
 * @export
 * @param {*} params
 * @returns
 */
export function listUserProductCollect(params) {
    console.log(params)
    const req = request.create('ListUserProductCollectReq', params)
    return request('cart', 'CollectService.ListUserProductCollect', req, 'collect.ListUserProductCollectResp')
};
