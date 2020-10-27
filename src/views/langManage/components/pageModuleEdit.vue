<template>
    <el-dialog
        :title="title"
        :visible="propShowAlert"
        @close="close"
        width="500px">
        <div>
            <el-form :rules="rules"
                     ref="pageModuleAlert"
                     :model="param"
                     label-position="right"
                     label-width="110px"
                     class="demo-ruleForm">
                <el-form-item label="页面名称："
                              prop="name">
                    <el-input v-model="param.pageName"
                              size="medium"
                              placeholder="请输入名称"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="close">取 消</el-button>
          <el-button size="small" type="primary" @click="confirmUpdatePageModule()">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { modulePageAdd, modulePageUpdate } from '@/request/i18n.js'
    export default {
        props: {
            propShowAlert: Boolean,
            title: String,
            source: String,
            propParam: {
                type: Object,
                default: () => { return {} }
            }
        },
        data () {
            return {
                param: {
                    pageName: '',
                    moduleId: '',
                    pageId: ''
                },
                rules: {
                    pageName: { required: true, trigger: 'blur', message: '请输入' }
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
            confirmUpdatePageModule () {
                this.$refs.pageModuleAlert.validate(valid => {
                    if (valid) {
                        let fetchUrl = modulePageAdd
                        if (this.param.pageId) {
                            fetchUrl = modulePageUpdate
                        }
                        fetchUrl(this.filterData(this.param)).then((res) => {
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
