<template>
    <el-dialog :title="dialog.curEditId ? '修改角色' : '新增角色'"
                width="800px"
                :visible="dialog.show"
                @close="handleClose">
        <el-form autoComplete="off"
            :model="param"
            :rules="rules"
            ref="roleForm"
            label-position="right"
            label-width="80px">
            <el-form-item prop="roleName" label="角色名：" class="filter-item">
                <el-input placeholder="请输入角色名"
                            clearable size="medium"
                            v-model="param.roleName"
                            class="edit__input"
                            autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="permissionKeyList" label="角色权限：" class="filter-item">
                <permission :permissionKeyList="param.permissionKeyList"
                            ref="permission"
                            @permissionChange="setPermissionKeyList"
                ></permission>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose" size="small">取 消</el-button>
            <el-button type="primary" @click="handleConfirm" size="small">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import permission from './permission'
import { addSysRole, updateSysRole } from '@/request/staff.js'
export default {
    components: {
        permission
    },
    props: {
        dialog: Object
    },
    data () {
        return {
            rules: {
                roleName: [{ required: true, trigger: 'blur', validator: (rule, value, callback) => {
                    if (value.length === 0) {
                        callback(new Error('不能为空'))
                    } else if (value.length > 20) {
                        callback(new Error('角色名最多20个字符'))
                    } else {
                        callback()
                    }
                }}]
            },
            param: {
                roleName: '',
                permissionKeyList: []
            }
        }
    },
    created () {
        const { roleName, permissionKeyList } = this.dialog
        Object.assign(this.param, {
            roleName,
            permissionKeyList
        })
    },
    methods: {
        setPermissionKeyList (keyList) {
            this.param.permissionKeyList = keyList
        },

        reset () {
            this.$refs['roleForm'].resetFields()
        },

        handleClose () {
            this.reset()
            this.$emit('close')
        },

        handleConfirm () {
            this.$refs['roleForm'].validate((valid) => {
                if (valid) {
                    let curEditId = this.dialog.curEditId
                    let temp = JSON.parse(JSON.stringify(this.param))
                    temp.permissionKey = temp.permissionKeyList.filter(item => item)
                    delete temp.permissionKeyList

                    if (curEditId) {
                        updateSysRole({ roleId: curEditId, ...this.filterData(temp)}).then((res) => {
                            if (res.ret.errcode === 1) {
                                this.$message.success('修改成功!')
                                this.$emit('confirm')
                            }
                        })
                    } else {
                        addSysRole(this.filterData(temp)).then((res) => {
                            if (res.ret.errcode === 1) {
                                this.$message.success('新增成功!')
                                this.$emit('confirm')
                            } 
                        })
                    }
                }
            })
        }
    }
}
</script>
<style></style>