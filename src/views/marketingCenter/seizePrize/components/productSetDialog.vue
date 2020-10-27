<template>
    <el-dialog
        :visible="productSetShow"
        :close-on-click-modal="false"
        @close="handleClose"
    >
        <el-form :model="param" label-position="right" 
            ref="productSetForm"
            :rules="rules"
            label-width="120px">
            <el-form-item label="活动商品时间：">
                <el-date-picker type="datetimerange" value-format="timestamp"
                    start-placeholder="开始时间" end-placeholder="结束时间"
                    v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="活动价格：" prop="activePrice">
                <el-input-number 
                    class="config-common-input"
                    :controls="false"
                    v-model="param.activePrice" :min="0"
                ></el-input-number>
            </el-form-item>
            <el-row :gutter="8">
                <el-col :span="12">
                    <el-form-item label="邀新可获码数：" prop="invitationNew">
                        <el-input-number controls-position="right" style="width: 100px" v-model="param.invitationNew" :precision="0" :min="0"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邀老可获码数：" prop="invitationOld">
                        <el-input-number controls-position="right" style="width: 100px" v-model="param.invitationOld" :precision="0" :min="0"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

        <div class="footer-box" slot="footer">
            <el-button type="primary" size="mini" @click="handleConfirm">确定</el-button>
            <el-button size="mini" @click="handleClose">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        productSetShow: Boolean,
        countryCode: String,
        propParam: Object
    },
    created () {
        let temp = JSON.parse(JSON.stringify(this.propParam))

        this.param = Object.assign(this.param, temp)
        if (temp.startTime && temp.endTime) {
            this.timeList = [temp.startTime, temp.endTime]
        }
    },
    data () {
        return {
            param: {
                startTime: null,
                endTime: null,
                activePrice: 0,
                invitationNew: 0,
                invitationOld: 0
            },
            timeList: [],
            rules: {
                activePrice: [{required: true, message: '必填', trigger: 'blur'}],
                invitationOld: [{required: true, message: '必填', trigger: 'blur'}],
                invitationNew: [{required: true, message: '必填', trigger: 'blur'}]
            }
        }
    }, 
    methods: {
        handleClose () {
            this.$emit('close')
        },
        reset () {
            this.param = {
                startTime: null,
                endTime: null,
                activePrice: 0,
                invitationNew: 0,
                invitationOld: 0
            }
            this.timeList = []
            this.$refs['productSetForm'].clearValidate()
        },
        handleConfirm () {
            this.$refs['productSetForm'].validate(valid => {
                if (valid) {
                    let res = JSON.parse(JSON.stringify(this.param))
                    res.countryCode = this.countryCode
                    if (this.timeList && this.timeList.length == 2) {
                        res.startTime = this.timeList[0] + ''
                        res.endTime = this.timeList[1] + ''
                    } else {
                        res.startTime = ''
                        res.endTime = ''
                    }
                    res.activePrice += ''

                    this.$emit('confirm', res)
                }
            })
        }
    }
}
</script>