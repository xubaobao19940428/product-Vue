<template>
    <el-dialog :title="param.title"
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
                    <el-select v-model="param.companyCode" filterable  :disabled="disableding" @change="setLogiCountryCode">
                        <el-option v-for="item in companyList" :key="item.id" :label="item.companyName" :value="item.logiCompany"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="国家名称：" prop="countryCode" >
                   {{ getCountryName() }}
                </el-form-item>
                <el-form-item label="国家代码：" prop="logiCountryCode">
                    <span>{{ param.logiCountryCode }}</span>
                </el-form-item>
                <el-form-item label="省份（State）：" prop="state">
                    <el-input v-model="param.state" size="medium" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="城市（City）：" prop="city">
                    <el-input v-model="param.city" size="medium" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="地区（Area）：" prop="area">
                    <el-input v-model="param.area" size="medium" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="邮编（PostCode）：" prop="postcode">
                    <el-input v-model="param.postcode" size="medium" placeholder="请输入内容" ></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleClose" >取 消</el-button>
          <el-button size="small" :loading="loading" type="primary" @click="conformAddItem()">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { updateAddressLogi, getLogiCompanyList } from '@/request/logi'
    export default {
        props: {
            dialogVisible: Boolean,
            countryList: Array,
            propParam: Object,
            disableding: Boolean
        },
        data () {
            return {
                param: {
                    countryCode: '',
                    companyCode: '',
                    state: '',
                    city: '',
                    area: '',
                    postcode: '',
                    logiCountryCode: ''
                },
                loading: false,
                companyList: [],
                adDialogRules: {
                    countryCode: [{ required: true, message: '国家不能为空', trigger: 'change' }],
                    logiCountryCode: [{ required: true, message: '国家代码不能为空', trigger: 'change' }],
                    companyCode: [{ required: true, message: '物流公司不能为空', trigger: 'change' }],
                    state: [{ required: true, message: '省份不能为空', trigger: 'change' }],
                    city: [{ required: true, message: '城市不能为空', trigger: 'change' }],
                    area: [{ required: true, message: '地区不能为空', trigger: 'change' }],
                    postcode: [{ required: true, message: '邮编不能为空', trigger: 'change' }]
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
                    type: '',
                    countryCode: '',
                    title: '',
                    companyCode: '',
                    state: '',
                    city: '',
                    area: '',
                    postcode: ''
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
                        console.log(this.filterData(JSON.parse(JSON.stringify(this.param))))
                        updateAddressLogi({ addressInfo: this.filterData(JSON.parse(JSON.stringify(this.param))) }).then((res) => {
                            this.loading = false
                            if (res.ret.errcode === 1) {
                                this.$message.success('成功')
                                this.reset()
                                this.$emit('confirm')
                            } else {
                                this.$message.error('添加失败')
                            }
                        }).catch((err) => {
                            this.loading = false
                            console.log(err)
                        })
                    }
                })
            }
        }
    }
</script>
