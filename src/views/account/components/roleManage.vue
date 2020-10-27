<template>
    <div class="app-container">
        <div class="operator-container">
            <el-button icon="el-icon-plus"
                    type="primary"
                    @click="handleOpt"
                    v-if="hasPermission('BTN_ACCOUNT_MANAGE_ADD_ROLE')"
                    class="operator-item"  size="small">新增角色</el-button>
        </div>
        <el-form inline>
            <el-form-item label="角色搜索：">
                <el-input v-model="searchParam.roleName" 
                    @keydown.enter.native="getList(1)"
                    size="medium"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                    @click="getList(1)"
                    icon="el-icon-search"
                    plain
                    placeholder="请输入角色名"
                    size="medium">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList"
            border
            v-loading="load"
            style="width: 100%">
            <el-table-column fixed="left" label="ID" align="center" prop="id"></el-table-column>
            <el-table-column label="角色名" align="center" prop="roleName"></el-table-column>
            <el-table-column label="创建时间" align="center" min-width="100px">
                <template slot-scope="scope">
                    {{ scope.row.createTime | formatTime }}
                </template>
            </el-table-column>
            <el-table-column label="更新时间" align="center" min-width="100px">
                <template slot-scope="scope">
                    {{ scope.row.updateTime | formatTime }}
                </template>
            </el-table-column>
            <el-table-column label="对应组织" align="center" min-width="200px">
                <template slot-scope="scope">
                    <el-tag v-for="item in scope.row.groupName" :key="item" type="warning" size="small">
                        {{ item }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center">
                <template slot-scope="scope">
                    <el-button plain type="primary" size="mini"
                            v-if="hasPermission('BTN_ACCOUNT_MANAGE_EDIT_ROLE')"
                            @click="handleOpt(scope.row)">编辑</el-button>
                    <el-button plain type="danger" size="mini"
                            v-if="hasPermission('BTN_ACCOUNT_MANAGE_DELETE_ROLE')"
                            @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
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
        <role-opt-dialog 
            v-if="dialog.show"
            @close="handleCloseOpt" 
            @confirm="handleConfirmOpt" 
            :dialog="dialog"
        ></role-opt-dialog>
    </div>
</template>

<script>
import { listSysRoleByPage, deleteSysRole, listAllGroupByFid } from '@/request/staff.js'
import roleOptDialog from './roleOptDialog.vue'
export default {
    components: {
        roleOptDialog
    },
    data () {
        return {
            load: false,
            dataList: [],
            totals: 0,
            searchParam: {
                roleName: '',
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            },
            groupList: [],
            dialog: {
                show: false,
                curEditId: '',
                permissionKeyList: [],
                roleName: ''
            }
        }
    },
    created () {
        this.getList()
    },
    methods: {
        handleSizeChange (value) {
            this.searchParam.page.pageSize = value
            this.getList(1)
        },
        getList (page) {
            this.load = true
            this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
            listSysRoleByPage(this.filterData(this.searchParam)).then(res => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.sysRolePb
                    this.totals = res.total
                }
                this.load = false
            }).catch(err => {
                console.error(err)
                this.load = false
            })
        },
        // 对于角色的操作，可以是修改和新建
        handleOpt (data = {}) { 
            Object.assign(this.dialog, {
                curEditId: data.id || '',
                show: true,
                roleName: data.roleName || '',
                permissionKeyList: data.permissionKey || []
            })
        },
        handleDelete ({ id }) {
            this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteSysRole({ roleId: id }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message({
                            type: 'success',
                            message: '删除角色成功!'
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
        },
        handleCloseOpt () {
            Object.assign(this.dialog, {
                show: false,
                curEditId: '',
                roleName: '',
                permissionKeyList: []
            })
        },
        handleConfirmOpt () {
            this.handleCloseOpt()
            this.getList()
        }
    }
}
</script>