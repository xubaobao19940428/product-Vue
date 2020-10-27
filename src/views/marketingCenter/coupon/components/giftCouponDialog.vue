<template>
    <el-dialog title="新增优惠券包"
               :visible="dialogVisible"
               width="650px"
               class="gift-coupon-dialog"
               @close="handleClose">
      <el-form label-position="right"
               label-width="130px"
               :rules="rules"
               :model="param"
               ref="giftCouponForm">
        <el-form-item label="中文名："
                      prop="nameCn">
          <el-input v-model="param.nameCn"
                    placeholder="请输入中文名"
                    size="medium"/>
        </el-form-item>
        <el-form-item label="英文名："
                      prop="nameEn">
          <el-input v-model="param.nameEn"
                    placeholder="请输入英文名"
                    size="medium"/>
        </el-form-item>
        <el-form-item label="国家：" prop="countryCode">
            <el-select v-model="param.countryCode" filterable>
                <el-option v-for="item in countryList"
                            :key="item.shortCode"
                            :label="item.nameLocal"
                            :value="item.shortCode">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="优惠券类型："
                        class="is-required"
                      prop="couponType">
         <div v-for="(item, i) in couponList"
              :key="i"
              class="coupon-list">
           <span>ID：</span>
           <el-input v-model="item.id"
                     placeholder="请输入优惠券ID"
                     size="medium"/>
           <span>数量：</span>
           <el-input v-model="item.count"
                     placeholder="请输入优惠券数量"
                     size="medium"/>
           <i @click="couponAction('del', i)"
              class="el-icon-delete"
              :style="{cursor: 'pointer'}"
              ></i>
         </div>
          <el-button @click="couponAction('add')"
                     icon="el-icon-plus"
                     size="small">新 增</el-button>
        </el-form-item>
        <el-form-item label="中文详情："
                      prop="despcriptionCn">
          <el-input type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="param.despcriptionCn"></el-input>
        </el-form-item>
        <el-form-item label="英文详情："
                      prop="despcriptionEn">
          <el-input type="textarea"
                    :autosize="{ minRows: 2, maxRows: 4}"
                    placeholder="请输入内容"
                    v-model="param.despcriptionEn"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleClose"
                   size="small">取 消</el-button>
        <el-button type="primary"
                   @click="confitmInsertCoupon"
                   :loading="saving"
                   size="small">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
import { addCouponPackage } from '@/request/coupon.js'
import { mapState } from 'vuex'

export default {
    props: {
        dialogVisible: Boolean
    },
    data () {
        return {
            couponList: [],
            rules: {
                nameCn: [{ required: true, message: '请输入优惠券中文名称', trigger: 'change' }],
                nameEn: [{ required: true, message: '请输入优惠券英文名称', trigger: 'change' }],
                countryCode: [{ required: true, message: '请选择国家', trigger: 'change' }],
                despcriptionCn: [{ required: true, message: '中文详情必填', trigger: 'change' }],
                despcriptionEn: [{ required: true, message: '英文详情必填', trigger: 'change' }]
            },
            param: {
                countryCode: 'MY',
                nameCn: '',
                nameEn: '',
                despcriptionCn: '',
                despcriptionEn: ''
            },
            saving: false
        }
    },
    computed: {
        ...mapState({
            countryList: state => state.dict.countryList
        }),
    },
    methods: {
        reset () {
            this.couponList = []
            this.$refs['giftCouponForm'].resetFields()
        },
        handleClose () {
            this.reset()
            this.$emit('close')
        },
        couponAction (type, index) {
            switch (type) {
                case 'del':
                    this.couponList.splice(index, 1)
                    break
                case 'add':
                    this.couponList.push({
                        id: '',
                        count: ''
                    })
                    break
            }
        },
        normalizeParam (data) {
            let temp = JSON.parse(JSON.stringify(this.param))
            let res = {couponPackageReqPb: {}}
            temp.description = []

            temp.name = [{
                languageCode: 'cn',
                name: temp.nameCn
            }, {
                languageCode: 'en',
                name: temp.nameEn
            }]

            if (temp.despcriptionCn) {
                temp.description.push({
                    languageCode: 'cn',
                    name: temp.despcriptionCn
                })
            }

            if (temp.despcriptionEn) {
                temp.description.push({
                    languageCode: 'en',
                    name: temp.despcriptionEn
                })
            }
            delete temp.nameEn
            delete temp.nameCn
            delete temp.despcriptionCn
            delete temp.despcriptionEn

            res.couponPackageReqPb = Object.assign({}, temp, data)

            return res
        },
        confitmInsertCoupon () {
            this.$refs['giftCouponForm'].validate((valid) => {
                if (valid) {
                    if (this.couponList.length <= 0) {
                        return this.$message.error('优惠券类型不能为空')
                    }
                    let ids = ''
                    let counts = ''
                    let i = 0

                    for (let item of this.couponList) {
                        if (!item.id || !item.count) {
                            return this.$message.error('优惠券id或者数量不能为空')
                        } else {
                            ids += item.id.trim()
                            counts += item.count.trim()
                        }
                        if (i != (this.couponList.length - 1)) {
                            ids += '|'
                            counts += '|'
                        }
                        i++
                    }

                    this.saving = true
                    let resParam = this.normalizeParam({ couponId: ids, couponCount: counts })

                    addCouponPackage(this.filterData(resParam)).then((res) => {
                        this.saving = false
                        if (res.ret.errcode === 1) {
                            this.$message.success('添加成功')
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
<style lang="scss">
    .gift-coupon-dialog {
        .coupon-list {
            .el-input {
                width: 150px;
                margin-right: 10px;
            }
        }
    }
</style>
