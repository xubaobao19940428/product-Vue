<template>
    <el-dialog :title="dialog.curEditId ? '修改用户' : '新增用户'"
                :visible="dialog.show"
                @close="handleClose"
                width="540px">
        <el-form autoComplete="off"
               :model="param"
               :rules="rules"
               ref="accountForm"
               label-position="right"
               label-width="100px">
            <el-form-item prop="account" label="用户名：">
                <el-input placeholder="请输入用户名"
                            v-if="!dialog.curEditId"
                            clearable
                            size="medium"
                            v-model="param.account"
                            class="edit__input"
                            autocomplete="off"></el-input>
                <span v-else class="account-item">{{ param.account }}</span>
            </el-form-item>

            <el-form-item prop="groupId" label="部门组织：" class="is-required">
                <span v-if="groupName">上一次设置的部门：<el-tag>{{ this.groupName }}</el-tag></span>
                <el-cascader
                    style="width: 100%"
                    filterable
                    :props="{label: 'groupName', checkStrictly: true, value: 'groupId', lazy: true, lazyLoad: loadGroupData}"
                    :options="groupList"
                    v-model="param.groupId"
                    @change="handleSelectGroup($event, 1)"
                    size="medium"
                ></el-cascader>
            </el-form-item>
            <!-- <el-form-item label="真实姓名：" prop="dingUserId">
                <el-select v-model="accountForm.dingUserId" placeholder="请选择" size="medium" filterable remote
                        style="width: 100%"
                        @change="setDingUserInfo"
                        :remote-method="getDingUserInfo">
                    <el-option v-for="(val, key) in dingUserList"
                            :key="key"
                            :label="(val.dept ? (val.dept + '-' + val.position +  '-') : '' ) +  val.realName"
                            :value="val.dingUserId"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item prop="realName" label="真实姓名：">
                <el-input v-model="param.realName" clearable
                    size="medium"
                />
            </el-form-item>
            <el-form-item prop="nickName" label="用户昵称：">
                <el-input placeholder="请输入用户昵称"
                            clearable
                            size="medium"
                            v-model="param.nickName"
                            class="edit__input"
                            autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="mobile" label="手机号：">
                <el-input placeholder="请输入手机号"
                            clearable
                            size="medium"
                            v-model="param.mobile"
                            class="edit__input"
                            autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item prop="email" label="邮箱：">
                <el-input placeholder="请输入邮箱"
                    clearable
                    size="medium"
                    v-model="param.email"
                    class="edit__input"
                    autocomplete="off"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="handleClose" size="small">取 消</el-button>
            <el-button type="primary" @click="handleConfirm" size="small">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
    import { addSysUser, updateSysUser, listGroupSimpleByFid } from '@/request/staff.js'
    export default {
        props: {
            dialog: Object
        },
        created () {
            let temp = { ...this.dialog }
            if (temp.curEditId) {
                Object.assign(this.param, {
                    account: temp.account,
                    email: temp.email,
                    mobile: temp.mobile,
                    nickName: temp.nickName,
                    realName: temp.realName,
                    groupId: temp.groupId
                })
                this.groupName = temp.groupName
            }

            this.loadGroupData({
                value: -1
            }, (data) => {
                this.groupList = data
            })
        },
        data () {
            return {
                groupList: [{groupId: -1}],
                groupName: '',
                param: {
                    account: '',
                    email: '',
                    mobile: '',
                    nickName: '',
                    realName: '',
                    groupId: ''
                },
                rules: {
                    account: [
                        {
                            required: true,
                            trigger: 'blur',
                            validator: (rule, value, callback) => {
                                if (value.length === 0) {
                                    callback(new Error('不能为空'))
                                } else if (value.length > 100) {
                                    callback(new Error('用户名最多100个字符'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ],
                    nickName: [{ required: true, message: '必填', trigger: 'blur' }],
                    groupId: [{ required: true, message: '必选', trigger: 'change'}]
                },
                dingUserList: []
            }
        },
        methods: {
            reset () {
                this.groupName = ''
                this.$refs['accountForm'].resetFields()
            },
            setDingUserInfo () {
                let user = this.dingUserList.find((val) => {
                    return val.dingUserId == this.param.dingUserId
                })
                if (user) {
                    this.param.realName = user.realName
                    this.param.nickName = user.realName + '(' + user.position + '-' + user.dept + ')'
                }
            },

            handleClose () {
                this.reset()
                this.$emit('close')
            },

            handleSelectGroup (select) {
                let len = select.length
                this.param.groupId = select[len - 1] // 取最后一个值
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

            handleConfirm () {
                this.$refs['accountForm'].validate((valid) => {
                    if (valid) {
                        if (this.dialog.curEditId) {
                            updateSysUser({ selfUpdate: false, ...this.filterData(this.param)}).then((res) => {
                                if (res.ret.errcode === 1) {
                                    this.$message.success('编辑用户成功！')
                                    this.$emit('confirm')
                                }
                            })
                        } else {
                            addSysUser(this.filterData(this.param)).then((res) => {
                                if (res.ret.errcode === 1) {
                                    this.$message.success('新建用户成功！')
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
