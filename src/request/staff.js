import request from './request'

// 用户相关
/**
 * 分页查询后台用户
 * @export
 * @param {*} params
 * @returns
 */
export function listSysUserByPage(params) {
    console.log(params)
    const req = request.create('ListSysUserByPageReq', params)
    return request('staff', 'SysUserBossService.ListSysUserByPage', req, 'staff.ListSysUserByPageResp')
};
/**
 * 添加后台用户
 * @export
 * @param {*} params
 * @returns
 */
export function addSysUser(params) {
    console.log(params)
    const req = request.create('SysUserAddOrUpdateReq', params)
    return request('staff', 'SysUserBossService.AddSysUser', req, 'staff.BooleanResp')
};
/**
 * 修改后台用户
 * @export
 * @param {*} params
 * @returns
 */
export function updateSysUser(params) {
    console.log(params)
    const req = request.create('SysUserAddOrUpdateReq', params)
    return request('staff', 'SysUserBossService.UpdateSysUser', req, 'staff.BooleanResp')
};
/**
 * 删除后台用户
 * @export
 * @param {*} params
 * @returns
 */
export function deleteSysUser(params) {
    console.log(params)
    const req = request.create('DeleteSysUserReq', params)
    return request('staff', 'SysUserBossService.DeleteSysUser', req, 'staff.BooleanResp')
};
/**
 * 重置密码
 * @export
 * @param {*} params
 * @returns
 */
export function resetPassword(params) {
    console.log(params)
    const req = request.create('ResetPasswordReq', params)
    return request('staff', 'SysUserBossService.ResetPassword', req, 'staff.ResetPasswordResp')
};
/**
 * 后台用户登录
 * @export
 * @param {*} params
 * @returns
 */
export function sysLogin(params) {
    console.log(params)
    const req = request.create('SysLoginReq', params)
    return request('staff', 'SysUserBossService.SysLogin', req, 'staff.SysLoginResp')
};
/**
 * 修改密码
 * @export
 * @param {*} params
 * @returns
 */
export function updatePassword(params) {
    console.log(params)
    const req = request.create('UpdatePasswordReq', params)
    return request('staff', 'SysUserBossService.UpdatePassword', req, 'staff.UpdatePasswordResp')
};

// 角色相关
/**添加角色
 * 
 * @export
 * @param {*} params
 * @returns
 */
export function addSysRole(params) {
    console.log(params)
    const req = request.create('SysRoleAddOrUpdateReq', params)
    return request('staff', 'SysRoleBossService.AddSysRole', req, 'staff.BooleanResp')
};
/**修改角色
 * 
 * @export
 * @param {*} params
 * @returns
 */
export function updateSysRole(params) {
    console.log(params)
    const req = request.create('SysRoleAddOrUpdateReq', params)
    return request('staff', 'SysRoleBossService.UpdateSysRole', req, 'staff.BooleanResp')
};
/**删除角色
 * 
 * @export
 * @param {*} params
 * @returns
 */
export function deleteSysRole(params) {
    console.log(params)
    const req = request.create('SysRoleIdReq', params)
    return request('staff', 'SysRoleBossService.DeleteSysRole', req, 'staff.BooleanResp')
};
/**分页查询角色
 * 
 * @export
 * @param {*} params
 * @returns
 */
export function listSysRoleByPage(params) {
    console.log(params)
    const req = request.create('ListSysRoleByPageReq', params)
    return request('staff', 'SysRoleBossService.ListSysRoleByPage', req, 'staff.ListSysRoleByPageResp')
};
/**查询所有角色
 * 
 * @export
 * @param {*} params
 * @returns
 */
export function listAllSysRole(params) {
    console.log(params)
    const req = request.create('ListAllSysRoleReq', params)
    return request('staff', 'SysRoleBossService.ListAllSysRole', req, 'staff.ListAllSysRoleResp')
};

// 组织相关
/**
 * 添加组织
 * @export
 * @param {*} params
 * @returns
 */
export function addSysGroup(params) {
    console.log(params)
    const req = request.create('AddSysGroupReq', params)
    return request('staff', 'SysGroupBossService.AddSysGroup', req, 'staff.AddSysGroupResp')
};

/**
 * 修改组织
 * @export
 * @param {*} params
 * @returns
 */
export function updateSysGroup(params) {
    console.log(params)
    const req = request.create('UpdateSysGroupReq', params)
    return request('staff', 'SysGroupBossService.UpdateSysGroup', req, 'staff.BooleanResp')
};

/**
 * 删除组织
 * @export
 * @param {*} params
 * @returns
 */
export function deleteSysGroup(params) {
    console.log(params)
    const req = request.create('SysGroupIdReq', params)
    return request('staff', 'SysGroupBossService.DeleteSysGroup', req, 'staff.BooleanResp')
};

/**
 * 根据上级组织id查找下级组织id（包含角色信息，用户组织管理页数据列表）
 * @export
 * @param {*} params
 * @returns
 */
export function listAllGroupByFid(params) {
    console.log(params)
    const req = request.create('ListAllGroupByFidReq', params)
    return request('staff', 'SysGroupBossService.ListAllGroupByFid', req, 'staff.ListAllGroupByFidResp')
};

/**
 * 根据上级组织id查找下级组织id（用于下拉选择框数据）
 * @export
 * @param {*} params
 * @returns
 */
export function listGroupSimpleByFid(params) {
    console.log(params)
    const req = request.create('ListGroupSimpleByFidReq', params)
    return request('staff', 'SysGroupBossService.ListGroupSimpleByFid', req, 'staff.ListGroupSimpleByFidResp')
};

/**
 * 查询组织所有权限key（用户关联组织id，用户——组织一对一，组织——角色一对多）
 * @export
 * @param {*} params
 * @returns
 */
export function getPermissionKeysByGroupId(params) {
    console.log(params)
    const req = request.create('SysGroupIdReq', params)
    return request('staff', 'SysGroupBossService.GetPermissionKeysByGroupId', req, 'staff.GetPermissionKeysByGroupIdResp')
};

/**
 * 查询用户所有权限key
 * @export
 * @param {*} params
 * @returns
 */
export function getPermissionKeys(params) {
    console.log(params)
    const req = request.create('GetPermissionKeysReq', params)
    return request('staff', 'SysUserBossService.GetPermissionKeys', req, 'staff.GetPermissionKeysResp')
};