<template>
    <el-dialog 
        class="before-success-config-dialog" title="提前拉新成功概率配置"
        :visible="beforeSuccessShow"
        @close="handleClose"
        width="640px"
    >
        <p class="tip">* 参数更改完后次日0点生效，且仅针对新用户的配置</p>
        <el-form :model="param" label-position="right" label-width="190px"
            ref="beforeSuccessForm"
            :rules="rules"
            size="medium"
        >
            <el-form-item label="拉新指标：" prop="inviteNumber">
                <el-input-number :controls="false" v-model="param.inviteNumber" :min="0" :precision="0"></el-input-number>（人）
            </el-form-item>
            <el-form-item label="拆成功比例：" prop="rate">
                <el-input-number v-model="param.rate" :precision="2" :controls="false" :min="0" :max="100"></el-input-number>（%）
            </el-form-item>
            <el-form-item label="当日提前拆成功人数上限：" prop="maxSuccessNumber">
                <el-input-number :min="0" v-model="param.maxSuccessNumber" :precision="0" :controls="false"></el-input-number>（人）
            </el-form-item>
        </el-form>
        <div class="dialog-footer" slot="footer">
            <el-button size="small" @click="handleClose">取消</el-button>
            <el-button size="small" @click="handleConfirm" type="primary">确定</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        beforeSuccessShow: Boolean,
        successDialog: Object
    },
    data () {
        return {
            param: {
                inviteNumber: 0, // 指标
                rate: 0, // 比率
                maxSuccessNumber: 0 // 成功上限人数
            },
            rules: {
                inviteNumber: [{ required: true, message: '必填', trigger: 'blur' }],
                rate: [{ required: true, message: '必填', trigger: 'blur' }],
                maxSuccessNumber: [{ required: true, message: '必填', trigger: 'blur' }]
            }
        }
    },
    created () {
        this.param = Object.assign({
            inviteNumber: 0,
            rate: 0,
            maxSuccessNumber: 0
        }, this.successDialog)
    },
    methods: {
        handleClose () {
            this.$emit('close')
        },
        handleConfirm () {
            this.$refs['beforeSuccessForm'].validate(valid => {
                if (valid) {
                    let res = Object.assign(this.param)
                    res.rate += ''
                    delete res.show
                    this.$emit('confirm', res)
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.before-success-config-dialog {
    .tip {
        font-size: 14px;
        color: #999;
        margin-bottom: 10px;
    }
}
</style>