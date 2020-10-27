<template>
    <el-dialog
        title="添加角色"
        :visible="showDialog"
        :close-on-click-modal="false"
        @close="handleClose">
        <el-form ref="addDialog" :rules="rules" :model="param" label-width="82px">
            <el-form-item label="头像：" prop="roleCover">
                <c-upload ref="cUpload" @setData="setCoverImg"></c-upload>
            </el-form-item>
            <el-form-item label="昵称：" prop="roleName">
                <el-input v-model="param.roleName"  type="text" size="medium" show-word-limit placeholder="请输入" maxlength="16"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer">
            <el-button :loading="loading"  @click="handleConfirm(1)">仅保存</el-button>
            <el-button type="primary" :loading="loading" @click="handleConfirm(2)">保存并添加</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { AddRole } from '@/request/manage.js'
    import cUpload from '@/components/fileUpload/index'
    export default {
        props: {
            showDialog: Boolean
        },
        data () {
            return {
                param: {
                    roleCover: '',
                    roleName: ''
                },
                loading: false,
                rules: {
                    roleCover: [{ required: true, message: '不能为空', trigger: 'blur' }],
                    roleName: [{ required: true, message: '不能为空', trigger: 'blur' }]
                }
            }
        },
        components: {
            cUpload
        },
        methods: {
            handleClose () {
                this.$emit('close')
            },
            setCoverImg (res) {
                this.param.roleCover = res.data
            },
            handleConfirm (type) {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        AddRole({
                            role: this.param
                        }).then((res) => {
                            this.loading = false
                            if (res.ret.errcode === 1) {
                                if (type == 2) {
                                    this.$emit('confirm', this.param)
                                } else {
                                    this.$emit('close')
                                }
                            }
                        }).catch(() => {
                            this.loading = true
                        })
                    }
                })
            }
        }
    }
</script>
