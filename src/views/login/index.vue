<template>
  <div class="login-container">
    <el-form autoComplete="on"
             :model="loginForm"
             :rules="loginRules"
             ref="loginForm"
             label-position="left"
             label-width="0px"
             class="card-box login-form">
      <h3 class="title">fingo运营支撑系统</h3>
      <el-form-item prop="account">
        <i class="iconfont">&#xe622;</i>
        <el-input name="username"
                  type="text"
                  v-model="loginForm.account"
                  autoComplete="on"
                  placeholder="username"/>
      </el-form-item>
      <el-form-item prop="password">
        <i class="iconfont">&#xe6ff;</i>
        <el-input name="password"
                  :type="pwdType"
                  @keyup.enter.native="handleLogin"
                  v-model="loginForm.password"
                  autoComplete="on"
                  placeholder="password"></el-input>
        <span class="show-pwd"
              @click="showPwd">
            <template>
              <i v-if="pwdType === 'password'" class="iconfont">&#xe604;</i>
              <i v-else class="el-icon-view"></i>
            </template>
        </span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   style="width:100%;"
                   :loading="loading"
                   @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

    export default {
        name: 'login',
        data () {
            return {
                loginForm: {
                    account: '',
                    password: ''
                },
                loginRules: {
                    account: [{
                        required: true, message: '用户名不能为空', trigger: 'blur'
                    }],
                    password: [{
                        required: true, message: '密码不能为空', trigger: 'blur'
                    }]
                },
                loading: false,
                pwdType: 'password'
            }
        },
        methods: {
            showPwd () {
                if (this.pwdType === 'password') {
                    this.pwdType = ''
                } else {
                    this.pwdType = 'password'
                }
            },
            handleLogin () {
                this.$refs.loginForm.validate(valid => {
                  console.log(valid)
                    if (valid) {
                        this.$store.dispatch('Login', this.filterData(this.loginForm)).then((res) => {
                            this.loading = false
                            this.$router.push({
                                name: 'welcome'
                            })
                        }).catch(() => {
                            this.loading = false
                        })
                    } else {
                        return false
                    }
                })
            }
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;

  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;

    input:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
      -webkit-text-fill-color: #fff !important;
    }
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: 0;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
        padding: 12px 5px 12px 15px;
        color: #fff;
        height: 100%;
      }
    }
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0 auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 500px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }

    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;

      i {
        color: #fff;
        margin-left: 10px;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
