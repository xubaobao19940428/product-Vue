<template>
    <el-card class="basic-info-card">
        <div slot="header" class="clearfix">
            <span>注销手机号</span>
        </div>
        <el-form label-width="80px" ref="removeMobileForm" :model="removeModel" :rules="ruleValidate">
            <el-form-item label="手机号：" prop="mobile">
                <el-select v-model="removeModel.countryAreaCode" filterable style="width: 120px" size="medium" placeholder="区号选择">
                    <el-option v-for="(val, key) in areaCodeList" :key="key" :label="val" :value="key"></el-option>
                </el-select>
                <el-input style="width: 200px; margin-right:20px;" v-model="removeModel.mobile" size="medium" clearable></el-input>
                <el-button type="primary" size="medium" @click="remove" :loading="confirmLoading">注销</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
    export default {
        name: 'removeMobile',
        data () {
            return {
                removeModel: {
                    mobile: '',
                    countryAreaCode: ''
                },
                confirmLoading: false,
                ruleValidate: {
                    mobile: [{
                        required: true,
                        message: '手机号不能为空',
                        trigger: 'blur'
                    }]
                },
                areaCodeList: {
                    '6': '+6',
                    '62': '+62',
                    '65': '+65',
                    '66': '+66'
                }
            }
        },
        methods: {
            remove () {
                this.$refs.removeMobileForm.validate((valid) => {
                    if (valid) {
                        this.confirmLoading = true
                        this.$emit('on-submit', this.removeModel)
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
