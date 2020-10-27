<template>
    <el-dialog
        class="use-coupon-limt-dialog"
        title="用券限制"
        width="560px"
        :visible="dialogVisible"
        @close="handleClose"
    >
        <el-form
            label-position="right"
            :rules="rules"
            label-width="130px"
            ref="useCouponLimitForm"
            :model="param"
        >
            <el-form-item label="选择国家：" class="is-required">
                <el-select v-model="param.countryCode" placeholder="请选择" size="small" :disabled="isEdit">
                    <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameCn" :value="item.shortCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品ID：" prop="productId">
                <el-input v-model="param.productId" placeholder="多个商品ID请用英文,逗号隔开" :disabled="isEdit"></el-input>
            </el-form-item>
            <el-form-item label="限制类型：" prop="type">
                <el-radio-group v-model="param.type">
                    <el-radio v-for="item in typeList" :key="item.key" :label="item.key">{{ item.name }}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="优惠券ID：" v-if="param.type != 3" prop="couponId">
                <el-input v-model="param.couponId" placeholder="仅支持单个优惠券ID"></el-input>
            </el-form-item>
        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleConfirm" size="small">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { splitData } from '@/utils/index'
export default {
    props: {
        dialogVisible: Boolean,
        countryList: Array,
        dialog: Object,
        isEdit: Boolean
    },
    data () {
        return {
            param: {
                id: '',
                productId: '',
                type: 3,
                countryCode: 'MY',
                couponId: ''
            },
            rules: {
                productId: [{required: true, message: '商品ID必填', trigger: 'blur'}],
                couponId: [{required: true, message: '优惠券ID必填', trigger: 'blur'}],
                type: [{required: true, message: '限制类型必选', trigger: 'change'}]
            },
            typeList: [{
                key: 3,
                name: '全部禁用'
            }, {
                key: 2,
                name: '部分禁用'
            }, {
                key: 1,
                name: '只可用'
            }]
        }
    },
    created () {
        Object.assign(this.param, JSON.parse(JSON.stringify(this.dialog)))
    },
    methods: {
        reset () {
            this.$refs['useCouponLimitForm'].clearValidate()
        },
        handleClose () {
            this.reset()
            this.$emit('close')
        },
        normalizeParam (data) {
            let res = { ...data }
            if (res.type == 3) {
                res.couponId = ''
            }
            if (!this.isEdit) {
                res.productId = res.productId ? splitData(res.productId) : []

                if (!res.productId.length) {
                    this.$message.error('商品ID必填')
                }
                for (let i = 0; i < res.productId.length; i++) {
                    let item = res.productId[i]
                    if (!/^\d+$/.test(item)) {
                        this.$message.error('请填写正确的商品ID')
                        return false
                    }
                }
            } else {
                delete res.productId
            }

            return res
        },
        handleConfirm () {
            this.$refs['useCouponLimitForm'].validate((valid) => {
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