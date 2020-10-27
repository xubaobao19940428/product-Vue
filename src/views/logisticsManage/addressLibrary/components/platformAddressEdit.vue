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
                label-width="130px"
                class="demo-ruleForm">
                <el-form-item label="国家名称：" prop="countryCode" >
                    <el-select v-model="param.countryCode" filterable clearable :disabled="disableding" @change="showMessage">
                        <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="国家代码：" prop="countryCode">
                    <el-input v-model="param.countryCode" size="medium" placeholder="请输入内容" :disabled="disableding"></el-input>
                </el-form-item>
                <el-form-item label="主要语言State：" prop="state">
                    <el-input v-model="param.state" size="medium" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="辅助语言State：" prop="stateEn">
                    <el-input v-model="param.stateEn" size="medium" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="主要语言City：" prop="city">
                    <el-input v-model="param.city" size="medium" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="辅助语言City：" prop="cityEn">
                    <el-input v-model="param.cityEn" size="medium" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="地区（Area）：" prop="area">
                    <el-input v-model="param.area" size="medium" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="邮编（PostCode）" prop="postcode">
                    <el-input v-model="param.postcode" size="medium" placeholder="请输入内容" ></el-input>
                </el-form-item>
                <el-form-item label="上级邮编：" prop="superiorPostcode">
                    <el-input v-model="param.superiorPostcode" size="medium" placeholder="请输入内容" ></el-input>
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
    import {  updateAddress} from '@/request/logi'
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
                    state: '',
                    stateEn: '',
                    city: '',
                    cityEn: '',
                    area: '',
                    postcode: '',
                    superiorPostcode: ''
                },
                loading: false,
                adDialogRules: {
                    countryCode: [{ required: true, message: '标题不能为空', trigger: 'change' }],
                    state: [{ required: true, message: '主要语言State不能为空', trigger: 'change' }],
                    stateEn: [{ required: true, message: '辅助语言State不能为空', trigger: 'change' }],
                    city: [{ required: true, message: '主要语言City不能为空', trigger: 'change' }],
                    cityEn: [{ required: true, message: '辅助语言City不能为空', trigger: 'change' }],
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
        created () {},
        methods: {
            showMessage (val) {
                let resItem = this.countryList.find(item => (item.nameLocal == val))
                if (resItem) {
                    Object.assign(this.param, {
                        shortCode: resItem.shortCode
                    })
                }
            },
            reset () {
                this.param = {
                    title: '',
                    type: '',
                    countryCode: '',
                    state: '',
                    stateEn: '',
                    city: '',
                    cityEn: '',
                    area: '',
                    postcode: '',
                    superiorPostcode: ''
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
                        updateAddress({ addressInfo: this.filterData(JSON.parse(JSON.stringify(this.param))) }).then((res) => {
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
