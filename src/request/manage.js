import request from './request'

// 获取标签
export function FindAllSearchTag (params) {
    const req = request.create('CmsSearchTagRequest', params)
    return request('cms', 'CmsTagService.SearchTag', req, 'CmsSearchTagResponse')
}

// 获取专栏
export function FindAllSpecialColumn (params) {
    const req = request.create('SearchSpecialColumnInfoReq', params)
    return request('cms', 'CmsSpecialColumnService.SearchSpecialColumnInfo', req, 'SearchSpecialColumnInfoResp')
}

// 添加专栏
export function AddSpecialColumn (params) {
    const req = request.create('AddSpecialColumnReq', params)
    return request('cms', 'CmsSpecialColumnService.AddSpecialColumn', req, 'EditSpecialColumnResp')
}

// 编辑专栏
export function EditSpecialColumn (params) {
    const req = request.create('EditSpecialColumnReq', params)
    return request('cms', 'CmsSpecialColumnService.EditSpecialColumn', req, 'AddSpecialColumnResp')
}

// 添加专题
export function AddSpecialSubject (params) {
    const req = request.create('AddSpecialSubjectReq', params)
    return request('cms', 'CmsSpecialSubjectService.AddSpecialSubject', req, 'AddSpecialSubjectResp')
}

// 编辑专题
export function EditSpecialSubject (params) {
    const req = request.create('EditSpecialSubjectReq', params)
    return request('cms', 'CmsSpecialSubjectService.EditSpecialSubject', req, 'EditSpecialSubjectResp')
}

// 专题排序
export function SortSpecialSubject (params) {
    const req = request.create('SortSpecialSubjectReq', params)
    return request('cms', 'CmsSpecialSubjectService.SortSpecialSubject', req, 'SortSpecialSubjectResp')
}

// 文章列表搜索
export function searchArticleList (params) {
    const req = request.create('SearchArticleListReq', params)
    return request('cms', 'CmsArticleService.SearchArticleList', req, 'SearchArticleListResp')
}

// 发送文章
export function sendArticle (params) {
    const req = request.create('SendArticleReq', params)
    return request('cms', 'CmsArticleService.SendArticle', req, 'SendArticleResp')
}

// 撤回文章
export function revokeArticle (params) {
    const req = request.create('WithdrawArticleReq', params)
    return request('cms', 'CmsArticleService.WithdrawArticle', req, 'WithdrawArticleResp')
}

// 删除文章
export function deleteArticle (params) {
    const req = request.create('DeleteArticleReq', params)
    return request('cms', 'CmsArticleService.DeleteArticle', req, 'DeleteArticleResp')
}

// // 编辑文章
// export function editArticle (params) {
//     const req = request.create('EditArticleReq', params)
//     return request('cms', 'CmsArticleService.EditArticle', req, 'EditArticleResp')
// }

// 文章排序
export function sortArticle (params) {
    const req = request.create('SortArticleReq', params)
    return request('cms', 'CmsArticleService.SortArticle', req, 'SortArticleResp')
}

// 文章sort排序
export function SearchArticleListBySort (params) {
    const req = request.create('SearchArticleListBySortReq', params)
    return request('cms', 'CmsArticleService.SearchArticleListBySort', req, 'SearchArticleListBySortResp')
}

// 获取商品详情
export function GetProductSpu (params) {
    const req = request.create('GetProductSpuReq', params)
    return request('product', 'ProductService.GetProductSpu', req, 'GetProductSpuResp')
}

// 添加文章
export function AddArticle (params) {
    const req = request.create('AddArticleRequest', params)
    return request('cms', 'CmsArticleService.AddArticle', req, 'AddArticleResponse')
}

// 编辑提交文章
export function EditArticle (params) {
    const req = request.create('EditArticleReq', params)
    return request('cms', 'CmsArticleService.EditArticle', req, 'EditArticleResp')
}

// 文章详情查询
export function ViewArticleDetail (params) {
    const req = request.create('ViewArticleDetailReq', params)
    return request('cms', 'CmsArticleService.ViewArticleDetail', req, 'ViewArticleDetailResp')
}

// banner详情查询
export function PageBanner (params) {
    const req = request.create('PageSearchBannerReq', params)
    return request('cms', 'BannerService.PageBanner', req, 'PageSearchBannerResp')
}

// banner新增
export function SaveBanner (params) {
    const req = request.create('AddBannerReq', params)
    return request('cms', 'BannerService.SaveBanner', req, 'AddBannerResp')
}

// banner删除
export function DeleteBannerByBannerCode (params) {
    console.log(params)
    const req = request.create('DeleteBannerByBannerCodeReq', params)
    return request('cms', 'BannerService.DeleteBannerByBannerCode', req, 'DeleteBannerByBannerCodeResp')
}

// banner编辑
export function EditBanner (params) {
    const req = request.create('EditBannerReq', params)
    return request('cms', 'BannerService.EditBanner', req, 'EditBannerResp')
}

// banner上报浏览次数
export function GetBannerWatched (params) {
    const req = request.create('GetBannerWatchedReq', params)
    return request('cms', 'BannerService.GetBannerWatched', req, 'GetBannerWatchedResp')
}

// banner复制
export function CopyBannerByBannerCode (params) {
    const req = request.create('CopyBannerByBannerCodeReq', params)
    return request('cms', 'BannerService.CopyBannerByBannerCode', req, 'CopyBannerByBannerCodeResp')
}

// 同步文章
export function CopyArticleToOther (params) {
    const req = request.create('CopyArticleToOtherReq', params)
    return request('cms', 'CmsSpecialColumnService.CopyArticleToOther', req, 'CopyArticleToOtherResp')
}

// 同步banner
export function CopyBannerToOther (params) {
    const req = request.create('CopyBannerToOtherReq', params)
    return request('cms', 'CmsSpecialColumnService.CopyBannerToOther', req, 'CopyBannerToOtherResp')
}

// 复制专栏内的一篇文章到数据库
export function copyArticleByArticleCode (params) {
    const req = request.create('CopyArticleByArticleCodeReq', params)
    return request('cms', 'CmsSpecialColumnService.CopyArticleByArticleCode', req, 'CopyArticleByArticleCodeResp')
}

// 添加话题
export function AddTopic (params) {
    const req = request.create('AddTopicReq', params)
    return request('cms', 'TopicService.AddTopic', req, 'AddTopicResp')
}

// 修改话题
export function EditTopic (params) {
    const req = request.create('EditTopicReq', params)
    return request('cms', 'TopicService.EditTopic', req, 'EditTopicResp')
}

// 添加角色
export function AddRole (params) {
    const req = request.create('AddRoleReq', params)
    return request('cms', 'CmsRoleService.AddRole', req, 'AddRoleResp')
}
// 获取角色
export function ShowRole (params) {
    const req = request.create('ShowRoleReq', params)
    return request('cms', 'CmsRoleService.ShowRole', req, 'ShowRoleResp')
}

// 标签列表搜索
export function SearchTagList (params) {
    const req = request.create('SearchTagListReq', params)
    return request('cms', 'CmsTagService.SearchTagList', req, 'SearchTagListResp')
}

// 删除标签
export function DelTag (params) {
    const req = request.create('DelTagReq', params)
    return request('cms', 'CmsTagService.DelTag', req, 'DelTagResp')
}

// 保存标签
export function SaveTag (params) {
    const req = request.create('SaveTagReq', params)
    return request('cms', 'CmsTagService.SaveTag', req, 'SaveTagResp')
}

// 专栏排序
export function SortSpecialColumn (params) {
    const req = request.create('SortSpecialColumnReq', params)
    return request('cms', 'CmsSpecialColumnService.SortSpecialColumn', req, 'SortSpecialColumnResp')
}

// 修改标签
export function EditArticleTag (params) {
    const req = request.create('EditArticleTagReq', params)
    return request('cms', 'CmsArticleService.EditArticleTag', req, 'EditArticleTagResp')
}
