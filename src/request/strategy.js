import http from './req';

/**
 * 查询策略列表
 */
export function queryStrategyList(params) {
    return http('/strategy/findByName', {
        data: params
    });
};

/**
 * 创建策略
 */
export function addStrategy(params) {
    return http('/strategy/add', {
        data: params
    });
};

/**
 * 编辑策略
 */
export function updateStrategy(params) {
    return http('/strategy/edit', {
        data: params
    });
};

/**
 * 删除策略
 */
export function deleteStrategy(params) {
    //rest 风格接口，后期需优化
    return http(`/strategy/delete/${params}`, {
        method: 'delete'
    });
};

//任务列表
export function queryTaskList(params) {
    return http('/strategytask/search', {
        data: params
    });
};

//添加任务
export function addTask(params) {
    return http('/strategytask/add', {
        data: params
    });
};

//编辑任务
export function updateTask(params) {
    return http('/strategytask/edit', {
        data: params
    });
};

//查询任务详情
export function queryTaskDetail(params) {
    return http('/strategytask/detail', {
        data: params
    });
};

//开启、关闭任务
export function triggerTask(params) {
    //rest 风格接口，后期需优化
    return http(`/strategytask/trigger/${params}`);
};

//测试模版
export function emailTest(params) {
    return http('/strategytask/emailTest', {
        data: params
    });
};