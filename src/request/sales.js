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
    return request('polypay', 'WithdrawalBossService.ListBanksOfCountry', req, 'polypay.ListBanksByCountryResp')
};


/**
 * 分页获取销量信息
 * @export
 * @param {*} params
 * @returns
 */
export function getProductSales(params) {
    console.log(params)
    const req = request.create('GetProductSalesReq', params)
    return request('product', 'SalesService.GetProductSales', req, 'sales.GetProductSalesResp')
};

/**
 * 分页获取销量信息
 * @export
 * @param {*} params
 * @returns
 */
export function setProductSalesConfig(params) {
    console.log(params)
    const req = request.create('SetProductSalesConfigReq', params)
    return request('product', 'SalesService.SetProductSalesConfig', req, 'sales.SetProductSalesConfigResp')
};
