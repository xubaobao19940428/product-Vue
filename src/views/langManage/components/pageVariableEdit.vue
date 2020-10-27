<template>
    <!--添加修改翻译模板-->
    <el-dialog
        :title="title"
        :visible="propShowAlert"
        @close="close"
        width="500px">
        <div>
            <el-form :rules="rules"
                     ref="translateModuleAlert"
                     :model="param"
                     label-position="right"
                     label-width="110px"
                     class="demo-ruleForm">
                <el-form-item label="变量名："
                              prop="variableCode">
                    <el-input v-model="param.variableCode"
                              :disabled="param.variableId ? true : false"
                              size="medium"
                              placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="中文："
                              prop="nameCn">
                    <el-input v-model="param.nameCn"
                              :disabled="source == 'English' ? true : false"
                              size="medium"
                              placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="英文："
                              prop="nameEn">
                    <el-input v-model="param.nameEn"
                              size="medium"
                              placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="字符限制："
                              prop="variableLength">
                    <el-input-number v-model="param.variableLength"
                                     :min="10"
                                     :disabled="source == 'English' ? true : false"
                                     :max="999999999"
                                     size="medium"
                                     :precision="0">
                    </el-input-number>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="close">取 消</el-button>
          <el-button size="small" type="primary" @click="updateTranslateModule()">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { pageVariableAdd, pageVariableUpdate } from '@/request/i18n.js'
    export default {
        props: {
            propShowAlert: Boolean,
            title: String,
            source: String,
            platform: String,
            propParam: {
                type: Object,
                default: () => { return {} }
            }
        },
        data () {
            return {
                param: {
                    variableId: '',
                    pageId: '',
                    variableCode: '',
                    nameCn: '',
                    nameEn: '',
                    translate: '',
                    languageCode: '',
                    variableLength: 500
                },
                rules: {
                    nameCn: { required: true, trigger: 'blur', message: '请输入' },
                    nameEn: { required: true, trigger: 'blur', message: '请输入' },
                    variableCode: { required: true, trigger: 'blur', message: '请输入' }
                }
            }
        },
        watch: {
            propParam (val) {
                if (val) {
                    Object.assign(this.param, this.propParam)
                }
            },
            propShowAlert (val) {
                if (val) {
                    Object.assign(this.param, this.propParam)
                }
            }
        },
        methods: {
            close () {
                this.$emit('close')
            },
            updateTranslateModule () {
                this.$refs.translateModuleAlert.validate(valid => {
                    if (valid) {
                        let fetchUrl = pageVariableAdd
                        if (this.param.variableId) {
                            fetchUrl = pageVariableUpdate
                        }
                        this.param = Object.assign(this.param,{platform:this.platform})
                        console.log(this.param)
                        fetchUrl(this.filterData(this.param)).then((res) => {
                            if (res.ret.errcode === 1) {
                                this.$emit('close')
                            }
                        })
                    }
                })
            }
        }
    }
</script>
