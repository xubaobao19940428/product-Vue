<template>
    <div class="add-coupon-dialog">
        <el-dialog title="添加优惠券"
            :visible="showAddCoupon"
            :close-on-click-modal="false"
            @close="handleClose"
        >
            <el-form ref="addCouponDialog" :model="param" label-width="120px">
                <el-form-item label="选择优惠券：" class="is-required">
                    <el-select v-model="selectType" style="width: 22%">
                        <el-option :value="0" label="优惠券名"></el-option>
                        <el-option :value="1" label="优惠券ID"></el-option>
                    </el-select>
                    <el-select
                        v-model="param.encryptionCouponId"
                        :remote-method="getCouponList"
                        clearable
                        filterable
                        remote
                        placeholder="请选择"
                        class="name-input mar-l-10"
                    >
                        <el-option
                            v-for="(item, index) in selectCouponList"
                            :key="index"
                            :label="`${item.couponId}（${item.couponName}）`"
                            :value="item.encryptionCouponId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开抢时间：" prop="startTime">
                    <el-time-select
                        v-model="param.startTime"
                        value-format="HH:mm"
                        :picker-options="{
                            start: '00:00',
                            step: '00:01',
                            end: '23:00'
                        }"
                    ></el-time-select>
                </el-form-item>
                <el-form-item label="说明文案：">
                    <el-select v-model="text3Lang" style="width: 22%">
                        <el-option v-for="(item, index) in languageList"
                            :key="index"
                            :label="item.desc"
                            :value="item.code"
                        ></el-option>
                    </el-select>
                    <div v-for="(item, index) in param.text3List" v-show="text3Lang === item.languageCode" :key="index" class="name-input mar-l-10">
                        <el-input v-model="item.name"
                            type="text"
                            placeholder="请输入"/>
                    </div>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button type="primary" @click="handleConfirm">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { listCouponByName } from '@/request/coupon'
import { mapState } from 'vuex'
export default {
    props: {
        showAddCoupon: Boolean,
        langList: Array,
        editParam: {
            type: Object
        },
        languageList: Array
    },
    data () {
        return {
            param: {
                encryptionCouponId: '',
                startTime: '',
                text3List: []
            },
            text3Lang: 'cn',
            selectType: 0,
            selectCouponList: []
        }
    },
    computed: {
        ...mapState({
            pageData: state => state.pageEdit.pageData,
        })
    },
    created () {
        let temp = JSON.parse(JSON.stringify(this.editParam))
        if (Object.keys(temp).length) {
            temp.text3List = this.onFillList(temp.text3List)
        } else {
            temp.text3List = JSON.parse(JSON.stringify(this.langList))
        }
        Object.assign(this.param, temp)
    },
    watch: {
        editParam: {
            handler (newVal, oldVal) {
                let temp = JSON.parse(JSON.stringify(newVal))
                if (Object.keys(newVal).length) {
                    temp.text3List = this.onFillList(temp.text3List)
                } else {
                    temp.text3List = JSON.parse(JSON.stringify(this.langList))
                }
                Object.assign(this.param, temp)
            },
            deep: true
        }
    },
    methods: {
        getCouponList (query, calback) {
            if (query != '') {
                let param = {
                    countryCode: this.pageData.countryCode
                }
                if (this.selectType) {
                    param.couponId = query
                } else {
                    param.couponName = query
                }
                listCouponByName({...param}).then(res => {
                    if (res.ret.errcode === 1) {
                        this.selectCouponList = res.couponOnPagePB
                    }
                })
            }
        },
        reset () {
            this.text3Lang = 'cn'
            this.$refs['addCouponDialog'].clearValidate()
        },
        handleClose () {
            this.reset()
            this.$emit('close')
        },
        checkData () {
            let temp = { ...this.param }
            let res = true
            if (!temp.encryptionCouponId) {
                this.$message.error('优惠券ID必选')
                res = false
            } else {
                const existText3 = temp.text3List.find(item => item.name) // 文案三是否填写文案
                for (let i = 0; i < this.langList.length; i++) {
                    if (existText3) {
                        if (temp.text3List[i].languageCode == 'cn' || temp.text3List[i].languageCode == 'en') {
                            if (!temp.text3List[i].name) {
                                this.$message.error('文案三的中英文文案须填写')
                                res = false
                                break
                            }
                        }
                    }
                }
            }

            return res
        },
        handleConfirm () {
            let res = this.checkData()
            if (res) {
                this.$emit('confirm', this.param)
                this.reset()
            }
        },
        onFillList (data) {
            const len = this.langList.length
            if (data.length === len) return data

            let tempData = JSON.parse(JSON.stringify(data))
            for (let i = 0; i < len; i++) {
                let temp = this.langList[i]
                let index = tempData.findIndex(item => item.languageCode === temp.code)
                if (index === -1) {
                    tempData.push({
                        languageCode: temp.code,
                        name: ''
                    })
                }
            }

            return tempData
        }
    }
}
</script>

<style scoped lang="scss">
.add-coupon-dialog {
    .name-input {
        width: 58%;
        display: inline-block;
    }
}
</style>
