<template>
    <el-card class="basic-info-card">
        <div slot="header" class="clearfix">
            <span>为用户重新设置手机号</span>
        </div>
        <el-form label-width="100px" ref="resetMobileForm" :model="removeModel" :rules="ruleValidate">
            <el-form-item label="用户ID：" prop="userId">
                <el-input style="width: 200px" v-model="removeModel.userId" size="medium" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号：" prop="mobile">
                <el-select v-model="removeModel.countryAreaCode" filterable style="width: 120px" size="medium" placeholder="区号选择">
                    <el-option v-for="(val, key) in areaCodeList" :key="key" :label="val" :value="key"></el-option>
                </el-select>
                <el-input v-model="removeModel.mobile" style="width: 200px" size="medium"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="reset" :loading="confirmLoading">确认</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    name: 'resetMobile',
    data() {
        return {
            confirmLoading: false,
            removeModel: {
                userId: '',
                mobile: '',
                countryAreaCode: '6'
            },
            ruleValidate: {
                userId: [{
                    required: true,
                    message: '用户ID不能为空',
                    trigger: 'blur'
                }],
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
        reset() {
            this.$refs.resetMobileForm.validate((valid) => {
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


