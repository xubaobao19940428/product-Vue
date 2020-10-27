<template>
    <div class="app-container label-set-wrapper">
        <el-form>
            <el-form-item>
                <el-button icon="el-icon-plus"
                           type="primary"
                           v-if="hasPermission('BTN_LABEL_SET_ADD')"
                           @click="addLabel(0, 1)"
                           class="operator-item"
                           size="small">新建一级标签
                </el-button>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-tree
                :data="labelList"
                node-key="id"
                lazy
                :expand-on-click-node="true"
                :load="getSubTab"
                ref="treeNode"
                :props="{label: 'tagName', children: 'subTags'}">
                <div class="custom-tree-node"
                     slot-scope="{ node, data }">
                    <div>{{ data.tagName }}</div>
                    <div v-if="data.status == 0">
                        <span class="mar-r-10">失效</span>
                        <i class="el-icon-warning warning"></i>
                    </div>
                    <div v-else>
                        <span class="mar-r-10">生效</span>
                        <i class="el-icon-success security"></i>
                    </div>
                    <div class="mar-l-10">
                        <el-button
                            v-if="node.level == 1 && hasPermission('BTN_LABEL_SET_ADD_SUB')"
                            plain
                            size="mini"
                            @click.stop="addLabel(data.id, 2, node)"
                        >新建二级标签
                        </el-button>
                        <el-button
                            v-if="node.level == 2 && hasPermission('BTN_LABEL_SET_LOOK_MEMBER')"
                            plain
                            size="mini"
                            @click.stop="lookMember(data)"
                        >查看处理小组成员
                        </el-button>
                        <el-button
                            plain
                            v-if="hasPermission('BTN_LABEL_SET_EDIT')"
                            size="mini"
                            type="primary"
                            @click.stop="updateLabel(data, node)"
                        >编辑
                        </el-button>
                        <el-button
                            plain
                            v-if="hasPermission('BTN_LABEL_SET_STATUS')"
                            size="mini"
                            :type="data.status == 0 ? 'success' : 'info'"
                            @click.stop="updateLabelStatus(data, node)"
                        >{{ data.status == 0 ? '生效' : '失效' }}
                        </el-button>
                    </div>
                </div>
            </el-tree>
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
        <!--标签新增编辑-->
        <el-dialog :title="addDialog.title" width="500px"
                   :visible="addDialog.show"
                   @close="addDialog.show = false">
            <div>
                <el-form ref="addDialog" label-position="right" label-width="110px" label-suffix="："
                         :rules="addDialog.rules"
                         :model="addDialog.param">
                    <el-form-item label="标签名称" prop="tagName">
                        <el-input v-model="addDialog.param.tagName" size="medium" placeholder="请输入标签名称"></el-input>
                    </el-form-item>
                    <el-form-item label="处理小组" prop="superiorTagId" v-if="addDialog.param.tagLevel == 2">
                        <el-select v-model="addDialog.param.groupId" placeholder="请选择" size="medium">
                            <el-option v-for="(val, key) in superiorTagList"
                                       :key="key"
                                       :label="val.groupName"
                                       :value="val.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="addDialog.show = false">取 消</el-button>
                <el-button size="small" type="primary" @click="confirm">确 定</el-button>
            </span>
        </el-dialog>
        <!--查看处理小组成员-->
        <el-dialog title="查看处理小组成员" width="500px"
                   :visible="memberDialog.show"
                   @close="memberDialog.show = false">
            <div>
                <el-form label-position="right" label-width="100px" label-suffix="：">
                    <el-form-item label="小组名称">
                        <el-input disabled v-model="memberDialog.param.groupName" size="medium"></el-input>
                    </el-form-item>
                    <el-form-item label="成员名称">
                        <el-tag v-for="(item, i) in memberDialog.param.managerUsers" :key="i">{{ item.managerName }}</el-tag>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="memberDialog.show = false">取 消</el-button>
                <el-button size="small" type="primary" @click="memberDialog.show = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    import {
        WorkOrderTagPageList,
        AddWorkOrderTag,
        UpdateTag,
        ChangeTagStatus,
        WorkOrderGroupPageList
    } from '@/request/workOrder.js'

    export default {
        data () {
            return {
                labelList: [],
                totals: 0,
                param: {
                    tagLevel: 1,
                    page: {
                        pageSize: 10,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                },
                superiorTagList: [],
                memberDialog: {
                    show: false,
                    param: {
                        groupName: '',
                        managerUsers: []
                    }
                },
                addDialog: {
                    title: '',
                    show: false,
                    type: 'add',
                    param: {
                        id: null,
                        groupId: null,
                        tagName: '',
                        superiorTagId: null,
                        tagLevel: null
                    },
                    rules: {
                        tagName: [{ required: true, message: '不能为空', trigger: 'change' }],
                        superiorTagId: [{ required: true, message: '请选择', trigger: 'change' }]
                    }
                }
            }
        },
        created () {
            this.getList()
            this.getGroupData()
        },
        methods: {
            handleSizeChange (val) {
                this.param.page.pageSize = val
            },
            getSubTab (data, resolve) {
                if (data.level == 0) {
                    return
                }
                this.getTagList({
                    superiorTagId: data.key,
                    level: data.level + 1,
                    resolve
                })
            },
            getTagList ({ page, pageSize, id, superiorTagId, level, resolve }) {
                WorkOrderTagPageList(this.filterData({
                    page: page,
                    id: id,
                    superiorTagId: superiorTagId,
                    tagLevel: level
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        resolve(res.data, res)
                    }
                })
            },
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                this.getTagList({
                    page: this.param.page,
                    superiorTagId: 0,
                    level: 1,
                    resolve: (data, res) => {
                        this.labelList = data
                        this.totals = res.total
                    }
                })
            },
            getGroupData () {
                WorkOrderGroupPageList({
                    page: 1,
                    pageSize: 10000,
                    groupType: '2'
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        console.log(res.data)
                        this.superiorTagList = res.data
                    }
                })
            },
            addLabel (fid, level, node) {
                switch (level) {
                    case 1:
                        this.addDialog.title = '新增一级标签'
                        break
                    case 2:
                        this.addDialog.title = '新增二级标签'
                        if (this.superiorTagList.length <= 0) {
                            this.getGroupData()
                        }
                        break
                }
                Object.assign(this.addDialog.param, {
                    id: null,
                    groupId: null,
                    tagName: '',
                    superiorTagId: fid,
                    tagLevel: level
                })
                this.addDialog.show = true
            },
            updateLabel (data, node) {
                switch (node.level) {
                    case 1:
                        this.addDialog.title = '编辑一级标签'
                        this.addDialog.type = 'add'
                        break
                    case 2:
                        this.addDialog.title = '编辑二级标签'
                        this.addDialog.type = 'edit'
                        break
                }
                Object.assign(this.addDialog.param, data)
                this.addDialog.show = true
            },
            lookMember (data) {
                let item = this.superiorTagList.find((val) => {
                    return val.id == data.groupId
                })
                if (item) {
                    this.memberDialog.param.groupName = item.groupName
                    this.memberDialog.param.managerUsers = item.managerUsers
                }
                this.memberDialog.show = true
            },
            updateLabelStatus (data, node) {
                ChangeTagStatus({
                    id: data.id,
                    status: data.status == 0 ? 1 : 0
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        data.status = data.status == 0 ? 1 : 0
                        this.getList()
                        this.$message.success('更改成功')
                    }
                })
            },
            confirm () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        let fetchUrl = AddWorkOrderTag
                        if (this.addDialog.type == 'edit') {
                            fetchUrl = UpdateTag
                        }
                        fetchUrl(this.filterData(this.addDialog.param)).then((res) => {
                            if (res.ret.errcode === 1) {
                                this.addDialog.show = false
                                this.getList()
                                this.$message.success('成功')
                            }
                        })
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .custom-tree-node {
        display: flex;
        width: 100%;
        align-items: center;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
        padding: 10px 0;
        color: #333;
        font-size: 14px;
        >div{
            flex: 1;
        }
    }
    .label-set-wrapper{
        .el-select{
            width: 100%;
        }
        .el-tree{
            height: 100%;
        }
    }
</style>
