<template>
    <div class="app-container">
        <el-tabs v-model="activeName"
                 @tab-click="switchTab()"
                 type="card">
            <el-tab-pane v-for="(item, i) in groupTypeEnum"
                         :key="i"
                         :label="item.name"
                         :name="item.key"></el-tab-pane>
        </el-tabs>
        <el-form>
            <el-form-item>
                <el-button icon="el-icon-plus" type="primary"
                           v-if="hasPermission('BTN_GROUP_SET_ADD')"
                           @click="groupAction('add')"
                           class="operator-item"
                           size="small">添加小组
                </el-button>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-table border height="100%" :data="dataList">
                <el-table-column type="index" width="50"></el-table-column>
                <el-table-column prop="groupName" label="小组名称"></el-table-column>
                <el-table-column label="成员数" align="center">
                    <template slot-scope="scope">{{ scope.row.managerUsers.length }}</template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 0">
                            <span class="mar-r-10">失效</span>
                            <i class="el-icon-warning warning"></i>
                        </div>
                        <div v-else>
                            <span class="mar-r-10">生效</span>
                            <i class="el-icon-success security"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <el-button plain type="primary"
                                   size="small"
                                   v-if="hasPermission('BTN_GROUP_SET_EDIT')"
                                   @click="groupAction('edit', scope.row)">编辑
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="处理标签"
                                 min-width="400px"
                                 v-if="activeName == 2">
                    <template slot-scope="scope">
                        <el-tag v-for="(item, i) in scope.row.tags"
                                :key="i">{{ item.tagName }}</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="getList"
                           :current-page="param.page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="param.page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
        <!--小组设置-->
        <el-dialog :title="addDialog.title" width="500px"
                   :visible="addDialog.show"
                   @close="addDialog.show = false">
            <div>
                <el-form ref="addDialog" label-position="right" label-width="110px" label-suffix="："
                         :rules="addDialog.rules"
                         :model="addDialog.param">
                    <el-form-item label="小组名称" prop="groupName">
                        <el-input v-model="addDialog.param.groupName" size="medium" placeholder="请输入小组名称"></el-input>
                    </el-form-item>
                    <el-form-item label="配置成员" prop="managerIds">
                        <el-select v-model="addDialog.param.managerIds" multiple filterable placeholder="请选择" size="medium">
                            <el-option v-for="(item, index) in adminUserList"
                                       :key="item.id + '_' + index"
                                       :label="item.nickName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                        <el-radio-group v-model="addDialog.param.status">
                            <el-radio v-for="(item, i) in statusList" :key="i" :label="item.key">{{ item.name }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog.show = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import { listSysUserByPage } from '@/request/staff'
    import {
        WorkOrderGroupPageList,
        AddWorkOrderGroup,
        UpdateWorkOrderGroup
    } from '@/request/workOrder.js'

    export default {
        data () {
            return {
                activeName: '1',
                totals: 0,
                dataList: [],
                param: {
                    page: {
                        pageSize: 10,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                },
                groupTypeEnum: [{
                    name: '创建小组',
                    key: '1'
                }, {
                    name: '处理小组',
                    key: '2'
                }],
                statusList: [{
                    name: '生效',
                    key: 1
                }, {
                    name: '失效',
                    key: 0
                }],
                addDialog: {
                    title: '',
                    show: false,
                    param: {
                        id: null,
                        groupName: null,
                        status: 1,
                        groupType: 0,
                        managerIds: []
                    },
                    rules: {
                        groupName: [{ required: true, message: '不能为空', trigger: 'change' }],
                        managerIds: [{ required: true, message: '请选择', trigger: 'change' }],
                        status: [{ required: true, message: '请勾选', trigger: 'change' }]
                    }
                },
                adminUserList: []
            }
        },
        created () {
            this.getList()
        },
        methods: {
            handleSizeChange (val) {
                this.param.page.pageSize = val
                this.getList()
            },
            getAdminUserList () {
                listSysUserByPage({
                    groupId: -1,
                    page: {
                        pageNum: 1,
                        pageSize: 1000
                    }
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.adminUserList = res.sysUserPb
                    }
                })
            },
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                WorkOrderGroupPageList(Object.assign(this.param, {
                    groupType: this.activeName
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.data
                        this.totals = res.total
                    }
                    console.log(res)
                })
            },
            switchTab () {
                this.param.page.pageNum = 1
                this.totals = 0
                this.getList()
            },
            groupAction (type, data) {
                if (this.adminUserList.length == 0) {
                    this.getAdminUserList()
                }
                if (type == 'add') {
                    this.addDialog.title = this.activeName == 1 ? '添加创建小组' : '添加处理小组'
                    Object.assign(this.addDialog.param, {
                        id: null,
                        groupName: null,
                        groupType: this.activeName,
                        status: 1,
                        managerIds: []
                    })
                } else {
                    this.addDialog.title = this.activeName == 1 ? '编辑创建小组' : '编辑处理小组'
                    Object.assign(this.addDialog.param, data)
                    this.addDialog.param.managerIds = []
                    for (let i = 0; i < data.managerUsers.length; i++) {
                        this.addDialog.param.managerIds.push(parseInt(data.managerUsers[i].managerId))
                    }
                }
                this.addDialog.show = true
            },
            confirm () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        console.log(this.addDialog.param)
                        if (this.addDialog.param.id) {
                            UpdateWorkOrderGroup(this.filterData(this.addDialog.param)).then((res) => {
                                console.log(res)
                                if (res.ret.errcode === 1) {
                                    this.getList()
                                    this.addDialog.show = false
                                }
                            })
                        } else {
                            AddWorkOrderGroup(this.filterData(this.addDialog.param)).then((res) => {
                                console.log(res)
                                if (res.ret.errcode === 1) {
                                    this.getList()
                                    this.addDialog.show = false
                                }
                            })
                        }
                    }
                })
            }
        }
    }
</script>
