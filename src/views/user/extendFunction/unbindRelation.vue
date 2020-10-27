<template>
    <el-card class="basic-info-card">
        <div slot="header" class="clearfix">
            <span>手动断绑</span>
        </div>
        <el-form label-width="80px" ref="unbindForm" :model="unbindModel" :rules="ruleValidate">
            <el-form-item label="用户ID：" prop="userId">
                <el-input style="width: 200px; margin-right: 20px" v-model="unbindModel.userId" clearable></el-input>
                <el-button type="primary" size="medium" @click="unbind" :disabled="loading">确认</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    name: 'unbind',
    data() {
        return {
            loading: false,
            unbindModel: {
                userId: ''
            },
            ruleValidate: {
                userId: [{
                    required: true,
                    message: '用户ID不能为空',
                    trigger: 'blur'
                }]
            },
        }
    },
    methods: {
        unbind() {
            this.$refs.unbindForm.validate((valid) => {
                if (valid) {
                    this.loading = true
                    this.$emit('on-submit', this.unbindModel)
                }
            })
        },
        setEnable() {
            this.loading = false
        }
    }
}
</script>

<style lang="scss" scoped>

</style>


