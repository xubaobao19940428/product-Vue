<template>
    <el-dialog :title="param.title"
               :visible="dialogVisible"
               width="600px"
               @close="handleClose">
        <div style="height: 100%; width: 100%">
            <el-form
                :rules="adDialogRules"
                ref="addDialog"
                :model="param"
                label-position="right"
                label-width="130px"
                class="demo-ruleForm">
                <el-form-item label="物流公司名称：" prop="companyName">
                    <el-input v-model="param.companyName" size="medium" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="物流公司代码：" prop="logiCompany">
                    <el-input v-model="param.logiCompany"  :disabled="param.id ? true : false" size="medium" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="国家：" prop="countryCode" >
                    <el-select v-model="param.countryCode" filterable  :disabled="disableding">
                        <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合作状态：" class="filter-item--inline"  prop="cooperateStatus">
                    <el-radio-group v-model="param.cooperateStatus">
                        <el-radio :label="1">正常合作</el-radio>
                        <el-radio :label="2">暂停合作</el-radio>
                    </el-radio-group>
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
    import { saveLogiCompany } from '@/request/logi'
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
                    id: null,
                    type: 2,
                    countryCode: '',
                    logiCompany: '',
                    companyName: '',
                    logiCountryCode: '',
                    priority: '',
                    config: '',
                    cooperateStatus: 1,
                    postcodes: ''
                },
                loading: false,
                adDialogRules: {
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }],
                    logiCompany: [{ required: true, message: '不能为空', trigger: 'change' }],
                    companyName: [{ required: true, message: '不能为空', trigger: 'change' }],
                    cooperateStatus: [{ required: true, message: '不能为空', trigger: 'change' }]
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
        methods: {
            reset () {
                this.param = {
                    id: null,
                    type: 2,
                    countryCode: '',
                    logiCompany: '',
                    companyName: '',
                    logiCountryCode: '',
                    priority: '',
                    config: '',
                    cooperateStatus: 1,
                    postcodes: ''
                }
                this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
            },
            handleClose () {
                this.reset()
                this.$emit('close')
            },
            conformAddItem () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        saveLogiCompany(this.filterData(this.param)).then((res) => {
                            this.loading = false
                            if (res.ret.errcode === 1) {
                                this.$message.success('成功')
                                this.reset()
                                this.$emit('confirm')
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
