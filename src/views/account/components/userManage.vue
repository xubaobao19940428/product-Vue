<template>
    <div class="app-container">
        <div class="operator-container">
            <el-button
                icon="el-icon-plus"
                type="primary"
                v-if="hasPermission('BTN_ACCOUNT_MANAGE_ADD_USER')"
                @click="handleOptAccount"
                class="operator-item"
                size="small">新增用户</el-button>
        </div>
        <el-form inline>
            <el-form-item label="用户搜索：">
                <el-input
                    placeholder="请输入真实姓名/昵称/用户名"
                    size="medium"
                    v-model="searchParam.nickName"
                    style="width: 240px"
                    clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="部门组织：">
                <el-cascader
                    style="width: 100%"
                    :clearable="false"
                    filterable
                    :props="{label: 'groupName', checkStrictly: true, value: 'groupId', lazy: true, lazyLoad: loadGroupData}"
                    :options="groupOptions"
                    v-model="searchParam.groupId"
                    @change="handleSelectGroup($event, 1)"
                    size="medium"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="对应角色：">
                <el-select v-model="searchParam.roleIds"
                    multiple
                    filterable
                    value-key="roleId"
                    style="min-width: 240px"
                    placeholder="可输入搜索"
                    clearable
                    size="medium">
                    <el-option
                        v-for="item in roleList"
                        :key="item.roleId"
                        :label="item.roleName"
                        :value="item.roleId"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button type="primary"
                    @click="getList(1)"
                    icon="el-icon-search"
                    size="medium"
                >搜索</el-button>
                <el-button
                    @click="resetSearchParam"
                    icon="el-icon-refresh-left"
                    size="medium"
                >重置</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList"
            border
            v-loading="load"
            style="width: 100%"
        >
            <el-table-column fixed="left" label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="用户名" align="center" prop="account"></el-table-column>
            <el-table-column label="昵称" align="center" prop="nickName"></el-table-column>
            <el-table-column label="真实姓名" align="center" prop="realName"></el-table-column>
            <el-table-column label="部门组织" align="center" prop="groupName"></el-table-column>
            <el-table-column label="对应角色" align="center" min-width="160px">
                <template slot-scope="scope">
                    <el-tag v-for="item in scope.row.roleName" :key="item"
                        size="small"
                        type="warning"
                    >
                        {{ item }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center">
                <template slot-scope="scope">
                    {{ scope.row.createTime | formatTime }}
                </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center">
                <template slot-scope="scope">
                    {{ scope.row.updateTime | formatTime }}
                </template>
            </el-table-column>
            <el-table-column fixed="right"
                            width="240px"
                            label="操作" align="center">
                <template slot-scope="scope">
                    <el-button plain type="primary" size="mini"
                            v-if="hasPermission('BTN_ACCOUNT_MANAGE_EDIT_USER')"
                            @click="handleOptAccount(scope.row)">编辑</el-button>
                    <el-button plain type="success" size="mini"
                            v-if="hasPermission('BTN_ACCOUNT_MANAGE_EDIT_USER')"
                            @click="handleResetPassword(scope.row)">重置密码</el-button>
                    <el-button plain type="danger" size="mini"
                            v-if="scope.row.account != 'admin' && hasPermission('BTN_ACCOUNT_MANAGE_DELETE_USER')"
                            @click="handleDeleteAccount(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page-wrapper">
            <el-pagination
                @current-change="getList"
                @size-change="handleSizeChange"
                :current-page="searchParam.page.pageNum"
                :page-size="searchParam.page.pageSize"
                layout="sizes, total, prev, pager, next, jumper"
                :page-sizes="[5, 10, 15, 20]"
                :total="totals">
            </el-pagination>
        </div>
        <user-opt-dialog
            v-if="dialog.show"
            :dialog="dialog"
            @close="handleCloseOpt"
            @confirm="handleConfirmOpt"
        ></user-opt-dialog>
    </div>
</template>

<script>
import { deleteSysUser, listSysUserByPage, listAllSysRole, resetPassword, listGroupSimpleByFid  } from '@/request/staff.js'
import userOptDialog from './userOptDialog'
export default {
    components: {
        userOptDialog
    },
    data () {
        return {
            searchParam: {
                nickName: '',
                groupId: -1,
                roleIds: [],
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            },
            load: false,
            totals: 0,
            dataList: [],
            roleList: [],
            dialog: {
                show: false,
                curEditId: '',
                realName: '',
                nickName: '',
                groupId: '',
                account: '',
                email: '',
                mobile: '',

            },
            groupOptions: [{
                groupId: -1,
                groupName: '全部',
                children: []
            }]
        }
    },
    created () {
        this.getList()
        this.getAllRoleList()
    },
    methods: {
        handleSizeChange (value) {
            this.searchParam.page.pageSize = value
            this.getList(1)
        },
        resetSearchParam () {
            this.searchParam = {
                nickName: '',
                groupId: '',
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            }
        },
        getAllRoleList () {
            listAllSysRole({}).then(res => {
                if (res.ret.errcode === 1) {
                    this.roleList = res.sysRoleSimplePb
                }
            })
        },

        getList (page) {
            this.load = true
            this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
            listSysUserByPage(this.filterData(this.searchParam)).then(res => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.sysUserPb
                    this.totals = res.total
                }
                this.load = false
            }).catch(err => {
                console.error(err)
                this.load = false
            })
        },
        handleSelectGroup (select) {
            let len = select.length
            this.searchParam.groupId = select[len - 1] // 取最后一个值
        },
        handleResetPassword ({ account }) {
            this.$confirm('此操作将初始化密码, 是否继续?', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                resetPassword({ account }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('重置密码成功!')
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消重置'
                })
            })
        },

        handleOptAccount (data = {}) {
            Object.assign(this.dialog, {
                realName: data.realName || '',
                nickName: data.nickName || '',
                account: data.account || '',
                curEditId: data.id || '',
                groupId: data.groupId || '',
                show: true,
                email: data.email || '',
                mobile: data.mobile || '',
                groupName: data.groupName || ''
            })
        },

        handleCloseOpt () {
            Object.assign(this.dialog, {
                show: false,
                realName: '',
                account: '',
                nickName: '',
                curEditId: '',
                groupId: '',
                email: '',
                mobile: '',
                groupName: ''
            })
        },
        handleConfirmOpt () {
            this.handleCloseOpt()
            this.getList()
        },
        loadGroupData (node, resolve) {
            listGroupSimpleByFid({ fid: node.value }).then((res) => {
                if (res.ret.errcode === 1) {
                    let temp = res.groupSimple || []
                    if (temp.length) {
                        temp.map(item => {
                            item.children = []
                        })
                    }
                    resolve(temp)
                }
            }).catch(err => {
                console.error(err)
            })
        },
        handleDeleteAccount ({ account }) {
            this.$confirm('此操作将永久删除该账户, 是否继续?', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteSysUser({ account }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message({
                            type: 'success',
                            message: '删除用户成功!'
                        })
                        this.getList()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        }
    }
}
</script>

<style lang="scss">

</style>
