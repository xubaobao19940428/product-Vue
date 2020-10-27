<template>
    <el-dialog
        title="编辑商品分组"
        :visible="dialogVisible"
        width="700px"
        @close="handleClose">
        <el-form :rules="dialogRules"
                 ref="dialogForm"
                 :model="param"
                 label-position="right"
                 label-width="100px"
                 class="demo-ruleForm"
                 style='width: 100%;'>
            <el-form-item label="国家：" prop="countryCode">
                <el-select v-model="param.countryCode" :disabled="param.id ? true : false" clearable placeholder="请选择" size="medium">
                    <el-option v-for="(item, index) in countryList"
                               :key="index"
                               :label="item.nameEn + '/' + item.nameCn "
                               :value="item.shortCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="名称：" prop="languageInfo">
                <div class="flex form-content">
                    <el-select v-model="titleLang" placeholder="请选择">
                        <el-option v-for="(item, i) in langList"
                                   :key="i"
                                   :label="item.desc"
                                   :value="item.code">
                        </el-option>
                    </el-select>
                    <el-form-item v-for="(item, i) in param.languageInfo" :key="i"
                                  :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '中英文必填', trigger: 'blur' }"
                                  ref="hotWordForm"
                                  :prop="`languageInfo[${i}].name`"
                                  v-show="titleLang == item.languageCode" class="flex1 mar-l-10">
                        <el-input v-model="item.name" show-word-limit maxlength="100" type="text" placeholder="请输入"></el-input>
                    </el-form-item>
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="handleClose">取 消</el-button>
            <el-button size="small" type="primary" @click="confirmAddItem()">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { saveQuality, updateQuality } from '@/request/marketing'
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
                    countryCode: '',
                    languageInfo: [],
                    id: null
                },
                dialogRules: {
                    languageInfo: [{ required: true, message: '标题不能为空', trigger: 'change' }],
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }]
                },
                titleLang: 'cn'
            }
        },
        watch: {
            propParam: {
                handler (val) {
                    Object.assign(this.param, val)
                    this.initLangData()
                },
                deep: true
            },
            dialogVisible (val) {
                if (val) {
                    this.initLangData()
                }
            }
        },
        methods: {
            handleClose () {
                this.reset()
                this.$emit('close')
            },
            initLangData () {
                for (let i = 0; i < this.langList.length; i++) {
                    let lang = this.langList[i].code
                    let productCorner = this.param.languageInfo.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!productCorner) {
                        this.param.languageInfo.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                }
            },
            reset () {
                this.param = {
                    countryCode: '',
                    languageInfo: []
                }
                this.$refs['dialogForm'] && this.$refs['dialogForm'].clearValidate()
            },
            confirmAddItem () {
                this.$refs['dialogForm'].validate((valid) => {
                    if (valid) {
                        let fetchUrl = saveQuality
                        if (this.param.id) {
                            fetchUrl = updateQuality
                        }
                        fetchUrl(this.filterData(this.param)).then((res) => {
                            if (res.success == 1) {
                                this.reset()
                                this.$emit('confirm')
                                this.$message.success('成功')
                            }
                        })
                    }
                })
            }
        }
    }
</script>
