<template>
    <div class="app-container system-manage">
        <div class="operator-container">
            <el-button 
                icon="el-icon-plus"
                type="primary"
                @click="handleOpt()"
                v-if="hasPermission('BTN_SYSTEM_MANAGE_ADD_GROUP')"
                class="operator-item"  
                size="small"
            >新增一级组织</el-button>
        </div>
        <div class="main-content-wrapper">
            <el-tree
                v-loading="load"
                :data="groupList"
                style="height: 100%"
                :props="props"
                node-key="groupId"
                ref="groupTree"
                :load="loadData"
                lazy
            >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div class="name-box">{{ data.groupName }}</div>
                    <div class="action-btn-box">
                        <el-button
                            plain
                            size="mini"
                            v-if="hasPermission('BTN_SYSTEM_MANAGE_ADD_GROUP')"
                            @click.stop="handleOpt(node, 'create')"
                            type="primary"
                        >新建下级组织
                        </el-button>
                        <el-button
                            plain
                            size="mini"
                            type="primary"
                            v-if="hasPermission('BTN_SYSTEM_MANAGE_EDIT_GROUP')"
                            @click.stop="handleOpt(node, 'edit')"
                        >编辑
                        </el-button>
                        <el-button 
                            plain 
                            size="mini" 
                            type="danger"
                            v-if="hasPermission('BTN_SYSTEM_MANAGE_DELETE_GROUP')"
                            @click.stop="handleDelete(node)">删除</el-button>
                    </div>
                </div>
            </el-tree>
        </div>
        <system-opt-dialog 
            v-if="dialog.show"
            :dialog="dialog"
            :roleList="roleList"
            @close="handleCloseOpt"
            @confirm="handleConfirmOpt"
        ></system-opt-dialog>
    </div>
</template>
<script>
import systemOptDialog from './systemOptDialog'
import { listAllGroupByFid, listAllSysRole, deleteSysGroup } from '@/request/staff.js'
export default {
    components: {
        systemOptDialog
    },
    data () {
        return {
            load: false,
            props: {
                label: 'groupName',
                value: 'groupId',
                isLeaf: 'leaf'
            },
            roleList: [],
            groupList: [],
            dialog: {
                show: false,
                groupId: '',
                groupName: '',
                roleIds: [],
                fid: -1
            },
            currentNode: null
        }
    },
    created () {
        this.getAllRoleList()
        this.loadData({
            key: -1
        }, (data) => {
            this.groupList = data
        })
    },
    methods: {
        handleOpt (node = {data: {}}, type = 'create') {
            this.currentNode = node
            Object.assign(this.dialog, {
                show: true,
                groupName: node.data.groupName || '',
                roleIds: node.data.roleIds || [],
                fid: node.data.groupId || -1,
                groupId: ''
            })
            if (type === 'edit') { // 只有编辑的时候才传groupId过去。用于区分
                this.dialog.groupId = node.data.groupId
            }
        },
        handleCloseOpt () {
            Object.assign(this.dialog, {
                show: false,
                groupId: '',
                groupName: '',
                fid: -1,
                roleIds: []
            })
        },

        getAllRoleList () {
            listAllSysRole({}).then(res => {
                if (res.ret.errcode === 1) {
                    this.roleList = res.sysRoleSimplePb
                }
            })
        },
        handleConfirmOpt (data) {
            let tempId = this.dialog.groupId
            if (tempId) { // 表示是修改
                let curIndex = this.currentNode.parent.childNodes.findIndex((val) => {
                  return val.data.groupId == tempId
                }) // 在修改节点的父节点中找到对应的下标
                if (curIndex != -1) {
                    Object.assign(this.currentNode.parent.childNodes[curIndex].data, data)
                    this.$refs['groupTree'].updateKeyChildren(this.currentNode.parent.id, this.currentNode.parent.childNodes)
                }
            } else {
                if (!this.currentNode.data.groupId) { // 新建的是一级组织
                    this.loadData({
                        key: -1
                    }, (data) => {
                        this.groupList = data
                    })
                } else {
                    this.$refs['groupTree'].append(data, this.currentNode)
                }

            }
            this.handleCloseOpt() //此时加入成功了
        },
        handleDelete (node) {
            this.$confirm('将永久删除此组织，确定删除？', '提示', {
                type: 'warning'
            }).then(() => {
                deleteSysGroup({
                    groupId: node.data.groupId
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$refs['groupTree'].remove(node)
                        this.$message.success('删除组织成功！')
                    }
                })
            }).catch(() => {
                this.$message.info('已取消删除')
            })
        },
        loadData (node, resolve) {
            if (node.level == 0) {
                return
            }
            
            this.load = true
            listAllGroupByFid({ fid: node.key }).then((res) => {
                if (res.ret.errcode === 1) {
                    let temp = res.groupPb || []
                    if (temp.length) {
                        temp.map(item => {
                            item.children = []
                            item.roleIds = item.roleSimplePb.map(item => item.roleId)
                        })
                    }
                    resolve(temp)
                }
                this.load = false
            }).catch(err => {
                console.error(err)
                this.load = false
            })
        }
    }
}
</script>
<style lang="scss">
    .system-manage {
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
        .name-box {
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            min-width: 100px;
        }
    }
</style>