<template>
    <el-card class="basic-info-card">
        <div slot="header" class="clearfix">
            <span>手动绑定（已经绑定的用户需要先断绑）</span>
        </div>
        <el-form label-width="120px" ref="bindForm" :model="bindModel" :rules="ruleValidate">
            <el-form-item label="用户ID：" prop="userId">
                <el-input style="width: 200px" v-model="bindModel.userId" clearable></el-input>
            </el-form-item>
            <el-form-item label="上级邀请码：" prop="parentCode">
                <el-input style="width: 200px" v-model="bindModel.parentCode" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" :disabled="loading" @click="bind">确认</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
export default {
    name: 'bindCard',
    data() {
        return {
            loading: false,
            bindModel: {
                userId: '',
                parentCode: ''
            },
            ruleValidate: {
                userId: [{
                    required: true,
                    message: '用户ID不能为空',
                    trigger: 'blur'
                }],
                parentCode: [{
                    required: true,
                    message: '上级邀请码不能为空',
                    trigger: 'blur'
                }]
            },
        }
    },
    methods: {
        bind() {
            this.$refs.bindForm.validate((valid) => {
                if (valid) {
                    this.loading = true
                    this.$emit('on-submit', this.bindModel)
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


