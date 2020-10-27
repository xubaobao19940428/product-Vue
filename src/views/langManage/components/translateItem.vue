<template>
    <el-dialog
        :title="title"
        :visible="propShowAlert"
        @close="close"
        width="500px">
        <div>
            <el-form :rules="rules"
                     ref="translateItemAlert"
                     :model="param">
                <el-form-item label="中文：">
                    <span>{{ param.nameCn }}</span>
                </el-form-item>
                <el-form-item label="英文：">
                    <span>{{ param.nameEn }}</span>
                </el-form-item>
                <el-form-item :label="'字符限制：' + param.variableLength"
                              prop="translation">
                    <el-input v-model="param.translation"
                              :maxlength="param.variableLength"
                              size="medium" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="close">取 消</el-button>
          <el-button size="small" type="primary" @click="updateTranslateItem()">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { languageTranslationAdd } from '@/request/i18n.js'
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
                    nameCn: '',
                    nameEn: '',
                    variableId: '',
                    translation: '',
                    languageCode: '',
                    variableRefId: '',
                    variableLength: 500,
                },
                rules: {
                    translation: { required: true, trigger: 'blur', message: '请输入' }
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
            updateTranslateItem () {
                this.$refs.translateItemAlert.validate(valid => {
                    if (valid) {
                        this.param = Object.assign(this.param,{platform:this.platform})
                        languageTranslationAdd(this.filterData(this.param)).then((res) => {
                            if (res.ret.errcode === 1) {
                                this.$message.success('操作成功')
                                this.close()
                            }
                        })
                    }
                })
            }
        }
    }
</script>
