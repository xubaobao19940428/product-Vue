import request from './request'

// 会员团队 - 新增会员数/累计会员数
export function MemberIncreaseNumber (params) {
    const req = request.create('MemberIncreaseNumberReq', params)
    return request('datahouse', 'MemberTeamBossService.MemberIncreaseNumber', req, 'MemberIncreaseNumberResp')
}

// 会员团队 - 顶部看版最后6个数据
export function MemberMiscellaneousData (params) {
    const req = request.create('MemberMiscellaneousDataReq', params)
    return request('datahouse', 'MemberTeamBossService.MemberMiscellaneousData', req, 'MemberMiscellaneousDataResp')
}

// 会员团队 - 数据折线图
export function MemberBrokenLineGraph (params) {
    const req = request.create('MemberBrokenLineGraphReq', params)
    return request('datahouse', 'MemberTeamBossService.MemberBrokenLineGraph', req, 'MemberBrokenLineGraphResp')
}

// 会员团队 - 用戶新增PS數Top50列表
export function MemberPsIncreaseRankingList (params) {
    const req = request.create('MemberPsIncreaseRankingListReq', params)
    return request('datahouse', 'MemberTeamBossService.MemberPsIncreaseRankingList', req, 'MemberPsIncreaseRankingListResp')
}

// 会员团队 - 用戶新增PS數環比上漲Top50列表
export function MemberPsIncreaseRiseRankingList (params) {
    const req = request.create('MemberPsIncreaseRiseRankingListReq', params)
    return request('datahouse', 'MemberTeamBossService.MemberPsIncreaseRiseRankingList', req, 'MemberPsIncreaseRiseRankingListResp')
}

// 会员团队 - 用戶新增PS數環比下降Top50列表
export function MemberPsIncreaseDropRankingList (params) {
    const req = request.create('MemberPsIncreaseDropRankingListReq', params)
    return request('datahouse', 'MemberTeamBossService.MemberPsIncreaseDropRankingList', req, 'MemberPsIncreaseDropRankingListResp')
}