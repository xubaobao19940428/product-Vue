<template>
    <el-dialog :title="dialog.groupId ? '编辑组织' : '新增组织'"
        :visible="dialog.show"
        @close="handleClose"
        width="650px">
        <el-form
            :model="param"
            :rules="rules"
            ref="systemManageForm"
            label-position="right"
            label-width="100px"
        >
            <el-form-item prop="groupName" label="组织名称：">
                <el-input v-model="param.groupName"></el-input>
            </el-form-item>
            <el-form-item prop="roleIds" label="对应角色：" class="is-required">
                <el-checkbox 
                    v-model="selectedAll" 
                    @change="handleSelectedAll"
                    :indeterminate="isIndeterminate"
                >全选</el-checkbox>
                <div>
                    <el-checkbox-group v-model="param.roleIds" 
                        @change="handleSimpleSelected"
                    >
                        <el-checkbox v-for="item in roleList" :key="item.roleId"
                            :label="item.roleId"
                        >{{ item.roleName }}</el-checkbox>
                    </el-checkbox-group>
                </div>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose" size="small">取 消</el-button>
            <el-button type="primary" @click="handleConfirm" size="small">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { addSysGroup, updateSysGroup } from '@/request/staff.js'
export default {
    props: {
        dialog: Object,
        roleList: Array
    },
    created () {
        let temp = { ...this.dialog }
        if (temp.groupId) {
            Object.assign(this.param, {
                roleIds: temp.roleIds,
                groupName: temp.groupName
            })
        }
    },
    data () {
        return {
            rules: {
                groupName: [{ required: true, message: '必填', trigger: 'change' }],
                roleIds: [{ validator: (rule, value, callback) => {
                    if (!this.param.roleIds.length) {
                        callback(new Error('必选'))
                    } else {
                        callback()
                    }
                }}]
            },
            param: {
                groupName: '',
                roleIds: []
            },
            isIndeterminate: false,
            selectedAll: false
        }
    },
    methods: {
        reset () {
            this.$refs['systemManageForm'].resetFields()
        },
        handleClose () {
            this.reset()
            this.$emit('close')
        },
        handleConfirm () {
            this.$refs['systemManageForm'].validate(valid => {
                if (valid) {
                    if (this.dialog.groupId) {
                        updateSysGroup({ groupId: this.dialog.groupId, ...this.param }).then(res => {
                            if (res.ret.errcode === 1) {
                                this.$message.success('修改组织成功！')
                                this.$emit('confirm', this.param)
                            }
                        })
                    } else {
                        addSysGroup({ fid: this.dialog.fid, ...this.param}).then(res => {
                            if (res.ret.errcode === 1) {
                                let item = {
                                    groupId: res.groupId,
                                    groupName: res.groupName,
                                    roleIds: res.roleIds,
                                    leaf: true
                                }
                                this.$message.success('新建组织成功')
                                this.$emit('confirm', item)
                            }
                        })
                    }
                }
            })
        },
        handleSimpleSelected (value) {
            let checkedCount = value.length
            this.selectedAll = checkedCount === this.roleList.length
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleList.length
        },
        handleSelectedAll (val) {
            this.param.roleIds = val ? this.roleList.map(item => item.roleId) : []
            this.isIndeterminate = false
        }
    }
}
</script>