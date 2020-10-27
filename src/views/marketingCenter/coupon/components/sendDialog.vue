<template>
    <el-dialog
        title="发送至用户账户"
        width="650px"
        :visible="dialogVisible"
        @close="handleClose"
    >
        <div class="editGoodsGounp">
            <el-form label-position="right"
                label-width="130px"
                :rules="rules"
                :model="param"
                ref="userCouponSetForm">
                <!-- <el-form-item label="优惠券id："
                            v-if="type == 'coupon'"
                            prop="couponId">
                <el-input placeholder="请输入优惠券id"
                            v-model="param.couponId"></el-input>
                </el-form-item> -->
                <el-form-item label="优惠券包ID："
                            prop="couponPackageId">
                <el-input placeholder="请输入优惠券包ID"
                            v-model="param.couponPackageId"></el-input>
                </el-form-item>
                <el-form-item label="用户id："
                            prop="userId">
                <el-input placeholder="请输入用户id,多个用户使用,号隔开" v-model="param.userId"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="handleClose" size="small">取 消</el-button>
            <el-button type="primary" @click="confitmSendUserCoupon" size="small" :loading="saving">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { addOldUserCoupon } from '@/request/coupon.js'
import {
    splitData
} from '@/utils/index'

export default {
    props: {
        title: String,
        dialogVisible: Boolean,
        type: String
    },
    data () {
        return {
            rules: {
                couponId: [{ required: true, message: '必填', trigger: 'change' }],
                couponPackageId: [{ required: true, message: '必填', trigger: 'change'}],
                userId: [{ required: true, message: '必填', trigger: 'change' }]
            },
            param: {
                couponId: '',
                couponPackageId: '',
                userId: ''
            },
            saving: false
        }
    },
    methods: {
        handleClose () {
            this.reset()
            this.$emit('close')
        },
        reset () {
            this.$refs['userCouponSetForm'].resetFields()
        },
        confitmSendUserCoupon () {
            this.$refs['userCouponSetForm'].validate((valid) => {
                if (valid) {
                    this.saving = true
                    let resParam = JSON.parse(JSON.stringify(this.param))
                    resParam.userId = splitData(resParam.userId)

                    let res = this.filterData(resParam)

                    addOldUserCoupon({ oldUserCouponReqPb: res}).then((res) => {
                        this.saving = false
                        if (res.ret.errcode === 1) {
                            this.$message.success('添加成功')
                            this.reset()
                            this.$emit('confirm')
                        }
                    }).catch(() => {
                        this.saving = false
                    })
                }
            })
        }
    }
}
</script>
