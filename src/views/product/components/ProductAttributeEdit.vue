<template>
    <div class="edit-attribute-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="1150px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="attrEditForm" :rules="ruleValidate" :model="attrModel" inline >
                <el-form-item label="属性名：" class="filter-item">
                    <el-table border :data="attrModel.attrNameTableData" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                        <el-table-column v-if="editType === 'edit'" prop="attrId" width="100px" label="属性ID" align="center">
                        </el-table-column>
                        <el-table-column min-width="150px" label="*中文cn" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'attrNameTableData.' + scope.$index + '.cn.value'" :rules='ruleValidate.attrName'>
                                    <el-input v-model="scope.row.cn.value" :disabled="scope.row.cn.editable" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150px" label="*英文en" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'attrNameTableData.' + scope.$index + '.en.value'" :rules='ruleValidate.attrName'>
                                    <el-input v-model="scope.row.en.value" :disabled="scope.row.en.editable" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150px" label="马来语ms" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="attrModel.attrNameTableData[0].ms.value">
                                    <el-input v-model="scope.row.ms.value" :disabled="scope.row.ms.editable" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150px" label="泰语th" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="attrModel.attrNameTableData[0].th.value">
                                    <el-input v-model="scope.row.th.value" :disabled="scope.row.th.editable" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150px" label="印尼语id" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="attrModel.attrNameTableData[0].id.value">
                                    <el-input v-model="scope.row.id.value" :disabled="scope.row.id.editable" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>

                <el-form-item label="属性值：" class="filter-item">
                    <el-table border :data="attrModel.attrValueTableData" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                        <el-table-column  v-if="editType === 'edit'" prop="valueId" width="100px" label="属性值ID" align="center">
                        </el-table-column>
                        <el-table-column min-width="150px" label="*中文cn" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'attrValueTableData.' + scope.$index + '.cn.value'" :rules='ruleValidate.attrName'>
                                    <el-input v-model="scope.row.cn.value" :disabled="scope.row.cn.editable" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150px" label="*英文en" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'attrValueTableData.' + scope.$index + '.en.value'" :rules='ruleValidate.attrName'>
                                    <el-input v-model="scope.row.en.value" :disabled="scope.row.en.editable" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150px" label="马来语ms" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'attrValueTableData.' + scope.$index + '.ms.value'">
                                    <el-input v-model="scope.row.ms.value" :disabled="scope.row.ms.editable" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150px" label="泰语th" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'attrValueTableData.' + scope.$index + '.th.value'">
                                    <el-input v-model="scope.row.th.value" :disabled="scope.row.th.editable" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150px" label="印尼语id" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="'attrValueTableData.' + scope.$index + '.id.value'">
                                    <el-input v-model="scope.row.id.value" :disabled="scope.row.id.editable" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column width="100px" label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" @click="addAttrValue(scope.$index)">新增</el-button>
                                <el-button type="text" @click="delAttrValue(scope.row, scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="自定义：" class="filter-item" prop="customize">
                    <el-radio-group v-model="attrModel.customize">
                        <el-radio :label="1">允许自定义</el-radio>
                        <el-radio :label="0">禁止自定义</el-radio>
                     </el-radio-group>
                    <p class="tips">在编辑商品的该属性时，可以从属性值表中选取，也可以自定义属性值</p>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="small" plain style="float: left;" @click="batchTranslate" :loading="translateLoading">一键填充翻译</el-button>
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText" @on-cancle="cancleDel" @on-confirm="confirmDel"></confirm-dialog>
    </div>
</template>

<script>
    import _ from 'lodash';
    import ConfirmDialog from '@/components/ConfirmDialog'
    import { getOneKeyTranslation } from '@/request/i18n'

    export default {
        data() {
            return {
                ruleValidate: {
                    attrName: [{
                        required: true,
                        trigger: 'blur',
                        message: '不能为空'
                    }],
                    customize: [{
                        required: true
                    }]
                },
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                attrValueIndex: 0,
                translateLoading: false
            }
        },
        props: {
            editType: {
                type: String,
                default: 'add'
            },
            dialogVisible: {
                type: Boolean,
                default: false
            },
            attrDataModel: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        components: {
            ConfirmDialog
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {
                }
            },
            dialogTitle: {
                get: function () {
                    if (this.editType === 'add') {
                        return '新增属性'
                    } else {
                        return '编辑属性'
                    }
                },
                set: function () {
                }
            },
            attrModel: function () {
                return this.attrData
            },
            languageList() {
                return this.$store.state.dict.languageList
            },
            attrData() {
                return this.attrDataModel
            }
        },
        methods: {
            cancle() {
                this.$refs.attrEditForm.resetFields()
                this.$emit('on-cancle')
            },
            confirm() {
                console.log(this.attrModel)
                this.$refs.attrEditForm.validate((valid) => {
                    if (valid) {
                        if (this.verifyRepetValueName()) {
                            this.$message.warning('属性值不能重复')
                        } else {
                            this.$emit('on-confirm', this.attrModel)
                            this.$refs.attrEditForm.resetFields()
                        }
                    } else {
                        this.$message.warning('必填字段不能为空')
                    }
                })
            },
            batchTranslate() {
                let attrName = this.attrModel.attrNameTableData[0].cn.value
                console.log(this.attrModel.attrValueTableData)
                let originContent = []
                originContent.push(attrName)
                _.forEach(this.attrModel.attrValueTableData, item => {
                    if (item.cn.value === '') {
                        this.$message.warning('中文不能为空')
                        return
                    }
                    if (item.cn && item.cn.value) {
                        originContent.push(item.cn.value)
                    }
                })
                console.log(originContent)
                this.translate(originContent, 'name', 0)
            },
            cancleDel() {
                this.confirmVisible = false
            },
            confirmDel() {
                this.confirmVisible = false
                this.confirmDelAttrValue()
            },
            addAttrValue(index) {
                let attrValue = {cn: {value: '', editable: false}, en: {editable: false, value: ''}, ms: {editable: false, value: ''}, th: {editable: false, value: ''}, id: {editable: false, value: ''}}
                this.attrModel.attrValueTableData.splice(index + 1, 0, attrValue)
            },
            /**
             * 删除属性值
             * 新增属性时，删除属性值无需校验， 编辑时需要二次校验
            */
            delAttrValue(row, index) {
                console.log(index)
                let attrValue = row.cn.value
                this.confirmVisible = true
                this.confirmDialogTitle = '确定删除该属性值？'
                this.confirmDialogText = `删除属性值“${attrValue}”不影响现有类目和商品，但一经删除无法恢复`
                this.attrValueIndex = index
            },
            confirmDelAttrValue() {
                if (this.attrModel.attrValueTableData.length <= 1) {
                    this.$message.warning('至少有一条属性值')
                    return
                }
                this.attrModel.attrValueTableData.splice(this.attrValueIndex, 1)
            },
            /**
             * 一键翻译
             */
            translate(originContent, type, index) {
                this.translateLoading = true
                let self = this
                if (_.isEmpty(originContent)) {
                    this.$message.warning('请先填写中文内容')
                    return
                }
                let result = {}
                let params = this.formatTranslateParam('cn', originContent)
                getOneKeyTranslation(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        let oneKeyTranslationUnit = res.oneKeyTranslationUnit
                        this.fillEmptyName(oneKeyTranslationUnit, index)
                    }
                })
            },
            formatTranslateParam1(fromLanguageCode, originContent) {
                let result = {}
                let oneKeyTranslationUnitList = []
                let languageCodeList = []
                _.forEach(this.languageList, (item) => {
                    if (item.code !== 'cn') {
                        languageCodeList.push(item.code)
                    }
                })
                _.forEach(languageCodeList, (item) => {
                    let unit = {}
                    unit.fromLanguageCode = fromLanguageCode
                    unit.originContent = originContent
                    unit.toLanguageCode = item
                    oneKeyTranslationUnitList.push(unit)
                })
                result.oneKeyTranslationUnit = oneKeyTranslationUnitList
                console.log(result)
                return result
            },
            formatTranslateParam(fromLanguageCode, originContentList) {
                let result = {}
                let oneKeyTranslationUnitList = []
                _.forEach(originContentList, originContent => {
                    _.forEach(this.languageList, (item) => {
                        let unit = {}
                        if (item.code !== 'cn') {
                            unit.fromLanguageCode = fromLanguageCode
                            unit.originContent = originContent
                            unit.toLanguageCode = item.code
                            oneKeyTranslationUnitList.push(unit)
                        }
                    })
                })
                result.oneKeyTranslationUnit = oneKeyTranslationUnitList
                console.log(result)
                return result
            },
            formatTranslateResult(result) {
                let translate = {}
                _.forEach(result, (item) => {
                    translate[item.toLanguageCode] = item.translation
                })
                return translate
            },
            fillEmptyName(result, index) {
                let resultList = _.chunk(result, this.languageList.length - 1)
                _.forEach(this.formatTranslateResult(resultList[0]), (value, key) => {
                   _.forEach(this.attrData.attrNameTableData[0], (titleValue, titleKey) => {
                       if(key === titleKey && _.isEmpty(titleValue.value)) {
                           this.$set(this.attrData.attrNameTableData[0][titleKey], 'value', value)
                       }
                   })
                })
                for (let index = 1; index < resultList.length; index++) {
                    _.forEach(this.formatTranslateResult(resultList[index]), (value, key) => {
                        _.forEach(this.attrData.attrValueTableData[index-1], (titleValue, titleKey) => {
                            if(key === titleKey && _.isEmpty(titleValue.value)) {
                                this.$set(this.attrData.attrValueTableData[index-1][titleKey], 'value', value)
                            }
                        })
                    })
                }
                this.translateLoading = false
            },
            verifyRepetValueName() {
                let valueNames = []
                _.forEach(this.attrModel.attrValueTableData, item => {
                    valueNames.push(item.cn.value)
                })
                let temp = Array.from(new Set(valueNames))
                if (valueNames.length > temp.length) {
                    return true
                } else {
                    return false
                }
            }
        }
    }
</script>

<style lang="scss">
.edit-attribute-dialog {
    .el-dialog__header {
        border-bottom: 1px solid #ebeef5;
    }
    .el-dialog__body {
        padding: 50px 40px;
    }
    .el-dialog__footer {
        border-top: 1px solid #ebeef5;
    }
    .el-form--inline .el-form-item {
        margin-right: 0;
    }
}
.tips {
    color: #aaa;
    line-height: 20px;
}
</style>



