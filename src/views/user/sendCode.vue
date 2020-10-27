<template>
    <div class="app-container">
        <el-card class="box-card">
            <el-form ref="form" label-width="120px">
                <el-form-item label="用户手机号：">
                    <el-select v-model="param.countryAreaCode" filterable clearable style="width: 120px" size="medium" placeholder="区号选择">
                        <el-option v-for="(val, key) in areaCodeList" :key="key" :label="val" :value="key"></el-option>
                    </el-select>
                    <el-input v-model="param.mobile" style="width: 200px" size="medium" clearable></el-input>
                </el-form-item>
                <!--<el-form-item label="用户类型：">-->
                    <!--<el-select v-model="param.type" filterable clearable size="medium">-->
                        <!--<el-option v-for="(val, key) in typeList" :key="key" :label="val" :value="key"></el-option>-->
                    <!--</el-select>-->
                <!--</el-form-item>-->
                <el-form-item v-show="userCode" label="验证码：">
                    <div class="flex">
                        <input class="copy-content" v-model="userCode" />
                        <el-button type="primary" @click="copyData">复制</el-button>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :disabled="loading">发送</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import { setMsgCode } from '@/request/user'
    export default {
        data () {
            return {
                loading: false,
                param: {
                    mobile: ''
                },
                areaCodeList: {
                    '6': '+6',
                    '62': '+62',
                    '65': '+65',
                    '66': '+66'
                },
                typeList: {
                    1: '老用户',
                    2: '新用户'
                },
                userCode: ''
            }
        },
        methods: {
            onSubmit () {
                this.loading = true
                setMsgCode(this.param).then((response) => {
                    let res = response
                    let msg = ''
                    switch (res.ret.errcode) {
                        case 1:
                            this.userCode = res.str
                            break
                        case 1049:
                            msg = '手机号不能为空#Please enter a mobile number'
                            this.$message.error(msg)
                            break
                        case 1105:
                            msg = '手机号格式不正确#Please enter a valid mobile number'
                            this.$message.error(msg)
                            break
                        default:
                            msg = '未知错误'
                            break
                    }
                    this.loading = false
                }).catch((err) => {
                    console.error(err)
                    this.loading = false
                })
            },
            copyData () {
                let content = document.querySelector('.copy-content')
                content.select() // 选择对象
                document.execCommand('Copy') // 执行浏览器复制命令
                this.$message.success('复制成功')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .copy-content {
        margin-right: 10px;
        box-sizing: border-box;
        padding: 0 10px;
    }
</style>
