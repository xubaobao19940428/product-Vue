import request from './config'

/**
 * 个人中心的服务与工具配置
 * @param {*} data 
 */
//  获取模块列表，
export function queryModuleList (data) {
    return request({
        serverName: 'app-center',
        interfaceName: 'IModuleService.Query',
        data: data
    })
}

// 获取列表数据
export function queryList (data) {
    return request({
        serverName: 'app-center',
        interfaceName: 'IComponentService.Query',
        data: data
    })
}

// 新增数据
export function addData (data) {
    return request({
        serverName: 'app-center',
        interfaceName: 'IComponentService.Add',
        data: data
    })
}

// 修改数据
export function updateData (data) {
    return request({
        serverName: 'app-center',
        interfaceName: 'IComponentService.Edit',
        data: data
    })
}

// 删除数据
export function delData (data) {
    return request({
        serverName: 'app-center',
        interfaceName: 'IComponentService.RemoveById',
        data: data
    })
}

// 排序数据
export function setSort (data) {
    return request({
        serverName: 'app-center',
        interfaceName: 'IComponentService.EditSort',
        data: data
    })
}

