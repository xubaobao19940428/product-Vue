<template>
    <el-dialog
        title="服务文案"
        :visible="dialogVisible"
        width="800px"
        @close="handleClose">
        <div style="height: 100%; width: 100%">
            <el-form :rules="adDialogRules"
                     ref="addDialog"
                     :model="param"
                     label-width="160px"
                     class="demo-ruleForm">
                <el-form-item label="国家：" prop="countryCode">
                    <el-select v-model="param.countryCode" :disabled="param.id ? true : false" filterable clearable>
                        <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameCn" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文案色值" prop="color">
                    <el-color-picker v-model="param.color" size="small"></el-color-picker>
                </el-form-item>
                <el-form-item label="服务文案：" prop="serviceDesc">
                    <div class="flex form-content">
                        <el-select v-model="serviceDescLang" placeholder="请选择">
                            <el-option v-for="(item, i) in langList" :key="i" :label="item.desc" :value="item.code"></el-option>
                        </el-select>
                        <el-form-item v-for="(item, i) in param.serviceDesc" :key="i"
                                      :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '中英文必填', trigger: 'blur' }"
                                      ref="hotWordForm"
                                      :prop="`serviceDesc[${i}].name`"
                                      v-show="serviceDescLang == item.languageCode" class="flex1 mar-l-10">
                            <el-input v-model="item.name" show-word-limit maxlength="500" type="text" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleClose">取 消</el-button>
                <el-button size="small" :loading="loading" type="primary" @click="conformAddItem()">确 定</el-button>
            </span>
    </el-dialog>
</template>
<script>
    import { insertCopyWrite, updateCopyWrite } from '@/request/promotion.js'
    export default {
        props: {
            dialogVisible: Boolean,
            countryList: Array,
            langList: Array,
            propParam: Object
        },
        data () {
            return {
                param: {
                    id: null,
                    color: '',
                    countryCode: '',
                    serviceDesc: []
                },
                serviceDescLang: 'cn',
                loading: false,
                adDialogRules: {
                    color: [{ required: true, message: '不能为空', trigger: 'change' }],
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }],
                    serviceDesc: [{ required: true, message: '不能为空', trigger: 'change' }]
                }
            }
        },
        watch: {
            propParam: {
                handler (val) {
                    if (val) {
                        Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                        this.initLangData()
                    }
                },
                deep: true
            },
            dialogVisible (val) {
                if (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                    this.initLangData()
                }
            }
        },
        methods: {
            initLangData () {
                for (let i = 0; i < this.langList.length; i++) {
                    let lang = this.langList[i].code
                    let item = this.param.serviceDesc.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!item) {
                        this.param.serviceDesc.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                }
            },
            reset () {
                this.param = {
                    id: null,
                    color: '',
                    countryCode: '',
                    serviceDesc: []
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
                        let fetchUrl = insertCopyWrite
                        if (this.param.id) {
                            fetchUrl = updateCopyWrite
                        }
                        fetchUrl(this.filterData(this.param)).then((res) => {
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
