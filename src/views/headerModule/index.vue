<template>
  <div class="main-header-box">
    <div class="header-l">
        <div @click="triggerCollapse" class="collapse-wrapper">
          <i class="iconfont" v-if="isCollapse">&#xe6b3;</i>
          <i class="iconfont" v-else>&#xe6ee;</i>
        </div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item v-for="(item, i) in levelList"
                              :to="{ name: item.name }"
                              :key="i">{{ item.meta.title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
    </div>
    <div class="header-r">
        <el-dropdown class="avatar-container" trigger="click">
            <div class="avatar-wrapper">
                <img src="../../assets/img/user-header.png">
                <span>{{ userInfo.nickName || userInfo.mobile ||  'fingo' }}</span>
                <i class="iconfont">&#xe659;</i>
            </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
              <router-link to="/dashboard">
                <el-dropdown-item>首页</el-dropdown-item>
              </router-link>
              <el-dropdown-item @click.native="passwordDialogVisible = true">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="accountDialogVisible = true">设置</el-dropdown-item>
              <el-dropdown-item><span @click="logout">退出</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
    </div>
    <!-- 修改密码 -->
    <el-dialog title="修改密码"
        :visible="passwordDialogVisible"
        width="400px"
        @close="handleCancelPassword"
    >
        <el-form :model="passwordForm"
            :rules="passwordRules"
            label-position="right"
            label-width="100px"
            ref="passwordForm"
            inline
        >
            <el-form-item label="原密码：" prop="oldPassword">
                <el-input
                    v-model="passwordForm.oldPassword"
                    autocomplete="off"
                    size="medium"
                    type="password"
                ></el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="newPassword">
                <el-input v-model="passwordForm.newPassword" size="medium" type="password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码：" prop="confirmPassword">
                <el-input v-model="passwordForm.confirmPassword" size="medium" type="password" autocomplete="off"></el-input>
            </el-form-item>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="handleCancelPassword" size="small">取 消</el-button>
            <el-button type="primary" @click="handleConfirmPassword" size="small">确 定</el-button>
        </div>
    </el-dialog>

    <!-- 编辑个人信息 -->
    <el-dialog title="编辑信息"
               :visible="accountDialogVisible"
               width="400px"
               @close="handleCancelAccount">
      <el-form autoComplete="off"
               :model="accountForm"
               :rules="accountRules"
               ref="accountForm"
               label-position="right"
               label-width="80px">
        <el-form-item label="用户名：" class="filter-item">
          <span class="account-item">{{ account }}</span>
        </el-form-item>
        <el-form-item prop="nickName" label="用户昵称：" class="filter-item">
          <el-input placeholder="请输入用户昵称"
                    clearable size="medium"
                    v-model="accountForm.nickName"
                    class="edit__input"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号：">
            <el-input placeholder="请输入手机号"
                        clearable
                        size="medium"
                        v-model="accountForm.mobile"
                        class="edit__input"
                        autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱：">
            <el-input placeholder="请输入邮箱"
                clearable
                size="medium"
                v-model="accountForm.email"
                class="edit__input"
                autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelAccount" size="small">取 消</el-button>
        <el-button type="primary" @click="clickSaveAccount" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    import { mapState } from 'vuex'
    import { updatePassword, updateSysUser } from '@/request/staff.js'

    export default {
        data () {
            return {
                userInfo: {
                    nickName: '',
                    mobile: ''
                },
                accountDialogVisible: false,
                passwordDialogVisible: false,
                passwordForm: {
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                },
                passwordRules: {
                    oldPassword: [{ required: true, message: '必填', trigger: 'blur' }],
                    newPassword: [
                        {
                            required: true,
                            trigger: 'blur',
                            validator: (rule, value, callback) => {
                                if (value.length === 0) {
                                    callback(new Error('必填'))
                                } else if (value.length > 20) {
                                    callback(new Error('密码最多20个字符'))
                                } else if (value.length < 5) {
                                    callback(new Error('密码不能小于5位'))
                                } else if (value === this.passwordForm.oldPassword){
                                    callback(new Error('不能与老密码一致'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ],
                    confirmPassword: [{
                        required: true,
                        trigger: 'blur',
                        validator: (rule, value, callback) => {
                            if (!value) {
                                callback(new Error('必填'))
                            } else if (value !== this.passwordForm.newPassword) {
                                callback(new Error('两次密码输入不一致'))
                            } else {
                                callback()
                            }
                        }
                    }]
                },
                accountForm: {
                    id: '',
                    nickName: '',
                    mobile: '',
                    email: '',
                },
                accountRules: {
                    nickName: [{ required: true, message: '必填', trigger: 'change' }]
                }
            }
        },
        computed: {
            levelList () {
                return this.$route.matched
            },
            ...mapState({
                isCollapse: state => state.app.isCollapse,
                account: state => state.user.username,
                groupId: state => state.user.groupId
            })
        },
        created () {
            this.$store.dispatch('GetUserInfo')
            if (localStorage.adminUserInfo) {
                this.userInfo = JSON.parse(localStorage.adminUserInfo)
            }
        },
        methods: {
            triggerCollapse () {
                this.$store.dispatch('ToggleSideBar', !this.isCollapse)
            },
            handleCancelAccount () {
                Object.assign(this.accountForm, {
                    id: '',
                    nickName: '',
                    mobile: '',
                    email: '',
                    roleId: ''
                })
                this.accountDialogVisible = false
            },
            clickSaveAccount () {
                this.$refs.accountForm.validate(async valid => {
                    if (valid) {
                        updateSysUser({ selfUpdate: true, groupId: this.groupId, account: this.account, ...this.filterData(this.accountForm)}).then(res => {
                            if (res.ret.errcode === 1) {
                                this.$message({
                                    type: 'success',
                                    message: '修改账户成功!'
                                })
                                this.accountDialogVisible = false
                            }
                        })
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                })
            },
            handleCancelPassword () {
                this.passwordForm = {
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }

                this.$refs['passwordForm'].resetFields()
                this.passwordDialogVisible = false
            },
            handleConfirmPassword () {
                this.$refs.passwordForm.validate(valid => {
                    if (valid) {
                        let temp = { account: this.account, ...this.passwordForm }
                        delete temp.confirmPassword
                        updatePassword(temp).then(res => {
                            if (res.ret.errcode === 1) {
                                this.$message.success('修改密码成功！')
                                this.passwordDialogVisible = false
                            }
                        }).catch(err => {
                            console.error(err)
                        })
                    }
                })
            },
            logout () {
                this.$store.dispatch('LogOut', {}).then(() => {
                    this.$router.push({ path: '/login' })
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
  .main-header-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 20px;
    height: 50px;
    border-bottom: 1px solid #e6e6e6;

    .header-l {
      display: flex;
      align-items: center;
        justify-content: flex-start;
        .collapse-wrapper{
            display: flex;
        }

      i {
        margin-right: 20px;
        cursor: pointer;
      }
    }

    .header-r {
        display: flex;
      .avatar-wrapper {
        display: flex;
        align-items: center;
        cursor: pointer;

        img {
          width: 40px;
          margin-right: 10px;
        }
      }
    }
  }
</style>
