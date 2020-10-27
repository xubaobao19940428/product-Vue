import request from './request'

/**
 * 获取国家列表
 * @export
 * @param {*} params
 * @returns
 */
export function getCountryList (params) {
    console.log(params)
    const req = request.create('GetCountryListReq', params)
    return request('i18n', 'I18nCountryLanguageService.GetCountryList', req, 'i18n.GetCountryListResp')
}

/**
 * 获取国家列表
 * @export
 * @param {*} params
 * @returns
 */
export function getLanguageList (params) {
    console.log(params)
    const req = request.create('GetLanguageListReq', params)
    return request('i18n', 'I18nCountryLanguageService.GetLanguageList', req, 'i18n.GetLanguageListResp')
}

/**
 * 一键翻译
 * @export
 * @param {*} params
 * @returns
 */
export function getOneKeyTranslation (params) {
    console.log(params)
    const req = request.create('GetOneKeyTranslationReq', params)
    return request('i18n', 'I18nTranslationService.GetOneKeyTranslation', req, 'i18n.GetOneKeyTranslationResp')
}
/**
 * 多语言配置
 */
// 添加页面翻译项变量
export function pageVariableAdd (params) {
    console.log(params)
    const req = request.create('PageVariableAddReq', params)
    return request('i18n', 'I18nModulePageService.PageVariableAdd', req, 'PageVariableAddResp')
}
// 更新页面翻译项变量
export function pageVariableUpdate (params) {
    console.log(params)
    const req = request.create('PageVariableUpdateReq', params)
    return request('i18n', 'I18nModulePageService.PageVariableUpdate', req, 'PageVariableUpdateResp')
}
// 获取模块页面列表
export function getModulePages (params) {
    const req = request.create('GetModulePagesReq', params)
    return request('i18n', 'I18nModulePageService.GetModulePages', req, 'GetModulePagesResp')
}
// 获取翻译项列表
export function getVariableListByLanguage (params) {
    const req = request.create('GetVariableListByLanguageReq', params)
    return request('i18n', 'I18nTranslationService.GetVariableListByLanguage', req, 'GetVariableListByLanguageResp')
}
// 添加指定语言的翻译项
export function languageTranslationAdd (params) {
    console.log(params)
    const req = request.create('LanguageTranslationAddReq', params)
    return request('i18n', 'I18nTranslationService.LanguageTranslationAdd', req, 'LanguageTranslationAddResp')
}
// 失效指定语言的翻译项
export function disableTranslation (params) {
    console.log(params)
    const req = request.create('DisableTranslationReq', params)
    return request('i18n', 'I18nTranslationService.DisableTranslation', req, 'DisableTranslationResp')
}
// 获取已经失效翻译项
export function getDisabledTranslationList (params) {
    console.log(params)
    const req = request.create('GetDisabledTranslationListReq', params)
    return request('i18n', 'I18nTranslationService.GetDisabledTranslationList', req, 'GetDisabledTranslationListResp')
}
// 恢复失效翻译项
export function reEnableTranslation (params) {
    console.log(params)
    const req = request.create('ReEnableTranslationReq', params)
    return request('i18n', 'I18nTranslationService.ReEnableTranslation', req, 'ReEnableTranslationResp')
}
// 添加模块
export function moduleAdd (params) {
    console.log(params)
    const req = request.create('ModuleAddReq', params)
    return request('i18n', 'I18nModulePageService.ModuleAdd', req, 'ModuleAddResp')
}
// 更新模块
export function moduleUpdate (params) {
    console.log(params)
    const req = request.create('ModuleUpdateReq', params)
    return request('i18n', 'I18nModulePageService.ModuleUpdate', req, 'ModuleUpdateResp')
}
// 模块下添加页面
export function modulePageAdd (params) {
    console.log(params)
    const req = request.create('ModulePageAddReq', params)
    return request('i18n', 'I18nModulePageService.ModulePageAdd', req, 'ModulePageAddResp')
}
// 更新模块下页面信息
export function modulePageUpdate (params) {
    console.log(params)
    const req = request.create('ModulePageUpdateReq', params)
    return request('i18n', 'I18nModulePageService.ModulePageUpdate', req, 'ModulePageUpdateResp')
}
// 导入模板
export function importVariableTranslationTemplate (params) {
    console.log(params)
    const req = request.create('ImportVariableTranslationTemplateReq', params)
    return request('i18n', 'I18nTranslationService.ImportVariableTranslationTemplate', req, 'ImportVariableTranslationTemplateResp')
}
// 导出翻译模板
export function exportVariableTranslationTemplate (params) {
    console.log(params)
    const req = request.create('ExportVariableTranslationTemplateReq', params)
    return request('i18n', 'I18nTranslationService.ExportVariableTranslationTemplate', req, 'ExportVariableTranslationTemplateResp')
}
// 导出翻译模板
export function exportSelectedVariableTranslationTemplate (params) {
    console.log(params)
    const req = request.create('ExportSelectedVariableTranslationTemplateReq', params)
    return request('i18n', 'I18nTranslationService.ExportSelectedVariableTranslationTemplate', req, 'ExportSelectedVariableTranslationTemplateResp')
}
/**
 * 地址相关
 */
// 获取国家区划信信息,只到state级别
export function getCountryDivision (params) {
    console.log(params)
    const req = request.create('GetCountryDivisionReq', params)
    return request('i18n', 'I18nCountryLanguageService.GetCountryDivision', req, 'GetCountryDivisionResp')
}
// 获取国家区划信息,和app侧一样（后台修改收货地址时用到）
export function getAppCountryDivision (params) {
    console.log(params)
    const req = request.create('GetAppCountryDivisionReq', params)
    return request('i18n', 'I18nCountryLanguageService.GetAppCountryDivision', req, 'GetAppCountryDivisionResp')
}
