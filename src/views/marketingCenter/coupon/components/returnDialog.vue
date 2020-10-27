<template>
    <el-dialog
        class="return-coupon-dialog"
        title="商品返券"
        width="560px"
        :visible="dialogVisible"
        @close="handleClose"
    >
        <el-form
            label-position="right"
            :rules="rules"
            label-width="130px"
            ref="returnCouponForm"
            :model="param"
        >
            <el-form-item label="选择国家：" class="is-required">
                <el-select v-model="param.countryCode" placeholder="请选择" size="medium" :disabled="isEdit">
                    <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameCn" :value="item.shortCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品ID：" prop="productId">
                <el-input v-model="param.productId" placeholder="多个商品ID请用英文,逗号隔开" size="medium" :disabled="isEdit"></el-input>
            </el-form-item>
            <el-form-item label="优惠券包ID：" prop="couponPackageId">
                <el-input v-model="param.couponPackageId" placeholder="仅支持填写1个优惠券包ID" size="medium"></el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleConfirm" size="small">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { splitData } from '@/utils/index'

export default {
    props: {
        countryList: Array,
        dialog: Object,
        dialogVisible: Boolean,
        isEdit: Boolean
    },
    data () {
        return {
            param: {
                id: '',
                countryCode: 'MY',
                productId: '',
                couponPackageId: ''
            },
            rules: {
                couponPackageId: [{ required: true, message: '券包ID必填', trigger: 'blur' }],
                productId: [{ required: true, message: '商品ID必填', trigger: 'blur'}]
            }
        }
    },
    created () {
        Object.assign(this.param, JSON.parse(JSON.stringify(this.dialog)))
    },
    methods: {
        reset () {
            this.$refs['returnCouponForm'].clearValidate()
        },
        handleClose () {
            this.reset()
            this.$emit('close')
        },
        normalizeParam (data) {
            let res = { ...data }
            if (!this.isEdit) {
                res.productSn = res.productId ? splitData(res.productId) : []
                for (let i = 0; i < res.productSn.length; i++) {
                    let item = res.productSn[i]
                    if (!/^\d+$/.test(item)) {
                        this.$message.error('请填写正确的商品ID')
                        return false
                    }
                }
            }
            delete res.productId

            return res
        },
        handleConfirm () {
            this.$refs['returnCouponForm'].validate((valid) => {
                if (valid) {
                    let res = this.normalizeParam(JSON.parse(JSON.stringify(this.param)))
                    if (!res) return
                    this.$emit('confirm', res)
                    this.reset()
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">

</style>