<template>
    <el-dialog title="同步物流公司地址"
               :visible="dialogVisible"
               width="800px"
               @close="handleClose">
        <div style="height: 100%; width: 100%">
            <el-form
                :rules="adDialogRules"
                ref="addDialog"
                :model="param"
                label-position="right"
                label-width="150px"
                class="demo-ruleForm">
                <el-form-item label="物流公司：" prop="companyCode">
                    <el-select v-model="param.companyCode" filterable @change="setLogiCountryCode">
                        <el-option v-for="item in companyList" :key="item.id" :label="item.companyName" :value="item.logiCompany"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="国家：" prop="countryCode" >
                    {{ getCountryName() }}
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleClose" >取 消</el-button>
          <el-button size="small" :loading="loading" type="primary" @click="conformAddItem()">同 步</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { syncAddressLogi, getLogiCompanyList } from '@/request/logi'
    export default {
        props: {
            dialogVisible: Boolean,
            countryList: Array,
            propParam: Object
        },
        data () {
            return {
                param: {
                    countryCode: '',
                    companyCode: ''
                },
                loading: false,
                companyList: [],
                adDialogRules: {
                    countryCode: [{ required: true, message: '国家不能为空', trigger: 'change' }],
                    companyCode: [{ required: true, message: '物流公司不能为空', trigger: 'change' }]
                }
            }
        },
        watch: {
            propParam: {
                handler (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(val)))
                },
                deep: true
            },
            dialogVisible (val) {
                if (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                }
            }
        },
        mounted () {
            this.getCompanyList()
        },
        methods: {
            getCompanyList () {
                getLogiCompanyList({
                    type: 1,
                    cooperateStatus: 1,
                    page: {
                        pageNum: 1,
                        pageSize: 1000,
                        pagingSwitch: false
                    }
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.companyList = res.logiCompany
                    }
                })
            },
            getCountryName () {
                let item = this.countryList.find((val) => {
                    return val.shortCode == this.param.countryCode
                })
                return item ? item.nameCn : ''
            },
            setLogiCountryCode () {
                let item = this.companyList.find((val) => {
                    return val.logiCompany == this.param.companyCode
                })
                if (item) {
                    this.param.logiCountryCode = item.logiCountryCode
                    this.param.countryCode = item.countryCode
                }
            },
            reset () {
                this.param = {
                    countryCode: '',
                    companyCode: ''
                }
                this.$refs['addDialog'].resetFields()
            },
            handleClose () {
                this.reset()
                this.$emit('close')
            },
            conformAddItem () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        syncAddressLogi(this.filterData(this.param)).then((res) => {
                            this.loading = false
                            if (res.ret.errcode === 1) {
                                this.reset()
                                this.$emit('confirm')
                                this.$message.success('同步成功')
                            }
                        }).catch(() => {
                            this.loading = false
                        })
                    }
                })
            }
        }
    }
</script>
