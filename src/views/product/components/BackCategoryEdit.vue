<template>
    <div class="edit-category-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="950px" top="5vh" :close-on-click-modal="false" @close="cancle">
            <el-form ref="categoryEditForm" :model="categoryModel" :rules="ruleValidate" label-width="120px">
                <el-form-item label="类目名：" prop="name">
                    <!-- <el-input v-model="categoryModel.name" clearable size="medium" maxlength="30" show-word-limit placeholder="请输入类目名"></el-input> -->
                    <table class="table table-bordered table-info">
                        <tbody>
                            <tr v-for="(item, index) in languageList" :key="index">
                                <th><span class="required" v-if="(item.code === 'cn' || item.code === 'en') && type != 'check'">*</span> {{item.desc}}{{item.code}} </th>
                                <td>
                                    <el-input v-model="categoryModel.nameList[item.code]" clearable size="medium" placeholder="请输入类目名" maxlength="30" @blur="changeValue"></el-input>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </el-form-item>
                <el-form-item label="父类目：" prop="pid" v-if="parentInfo.level !== 1">
                    <el-select v-model="parentInfo.pid" :disabled="editType==='add'" filterable size="medium" placeholder="请选择">
                        <el-option v-for="item in parentOptions" :key="item.cateId" :label="item.cateName" :value="item.cateId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="类目级别：" prop="level">
                    <span v-if="parentInfo.level === 1">一级类目</span>
                    <span v-if="parentInfo.level === 2">二级类目</span>
                    <span v-if="parentInfo.level === 3">三级类目</span>
                </el-form-item>
                <el-form-item label="类目图：">
                    <c-upload v-if="toggle" :fileList="categoryModel.cover" @setData="setCoverImg"></c-upload>
                    <div>尺寸800*800像素以上，大小2M以下，支持jpg/jpeg/png格式</div>
                </el-form-item>
                <el-form-item label="分类描述：" prop="desc">
                    <el-input v-model="categoryModel.desc" type="textarea" clearable maxlength="50" show-word-limit :autosize="{ minRows: 2, maxRows: 3}" placeholder="可输入50字以内的文案描述本类目">
                    </el-input>
                </el-form-item>
                <el-form-item label="参数属性：" prop="parameter">
                    <el-select v-model="categoryModel.parameter" clearable filterable remote size="medium"
                        :remote-method="getProductAttrForParam" @change="onSelectChangeForParam" @clear="getProductAttrForParam"
                        placeholder="请选择">
                        <el-option v-for="item in paramAttrOptions" :key="item.attrId" :label="item.attrName" :value="item.attrId">
                        </el-option>
                    </el-select>
                    <attr-sortable-table :listData="paramAttrList" @on-remove="removeParamAttr"></attr-sortable-table>
                </el-form-item>
                <el-form-item label="规格属性：" prop="specification">
                    <el-select v-model="categoryModel.paramAttr" clearable filterable remote size="medium"
                        :remote-method="getProductAttrForStandard" @change="onSelectChangeForStandard" @clear="getProductAttrForStandard"
                        placeholder="请选择">
                        <el-option v-for="item in standardAttrOptions" :key="item.value" :label="item.attrName" :value="item.attrId">
                        </el-option>
                    </el-select>
                    <attr-sortable-table :listData="standardAttrList" @on-remove="removeStandardAttr"></attr-sortable-table>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import Sortable from 'sortablejs'
    import cUpload from '@/components/fileUpload/index'
    import {
        productAttrGet,
        productAttrGetById,
        categoryListGet,
        productAttrGetByIdBatch
    } from '@/request/product'
    import AttrSortableTable from './AttrSortableTable'

    export default {
        // 后台类目编辑
        name: 'BackCategoryEdit',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            editType: {
                type: String,
                default: 'add'
            },
            level: {
                type: Number,
                default: 1
            },
            parentInfo: {
               type: Object,
                default: function() {
                    return {}
                }
            },
            categoryData: {
                type: Object,
                default: function() {
                    return {}
                }
            }
        },
        data() {
            const languageValidator =(rule, value, callback) => {
                    if (!this.hasFmt) {
                    callback(new Error('类目名不能为空'));
                    } else {
                    callback();
                }
            }
            return {
                ruleValidate: {
                    name: [{
                        required: true,
                        validator:languageValidator,
                        trigger: 'blur'
                    }],
                    pid: [{
                        required: true
                    }]
                },
                hasFmt:false,
                parentOptions: [],
                paramAttrOptions: [],
                standardAttrOptions: [],
                sortable: null,
                oldList: [],
                newList: [],
                paramAttrList: [], //参数属性
                standardAttrList: [], //规格属性
                categoryListLevelOne: [],
                categoryListLevelTwo: [],
                categoryListLevelThree: [],
                categoryLinkStr: '',
                languageList: []
            }
        },
        components: {
            AttrSortableTable,
            cUpload
        },
        computed: {
            toggle: {
                get: function() {
                    if (this.dialogVisible) {
                        this.languageList = JSON.parse(this.getStore('languageList'))
                    }
                    return this.dialogVisible;
                },
                set: function() {}
            },
            dialogTitle: {
                get: function() {
                    if (this.editType === 'add') {
                        return '新增后台类目'
                    } else {
                        return '编辑后台类目'
                    }
                },
                set: function() {}
            },
            categoryModel: function() {
                console.log(this.categoryData)
                return this.categoryData
            }
        },
        mounted() {
            this.getProductAttrForParam()
            this.getProductAttrForStandard()

        },
        methods: {
            changeValue(value){
                if(this.categoryModel.nameList['cn']&&this.categoryModel.nameList['en']){
                    this.hasFmt = true
                    this.$refs['categoryEditForm'].validateField('name')
                }else{
                   this.hasFmt = false
                    this.$refs['categoryEditForm'].validateField('name')
                }
            },
            setCoverImg (res) {
                this.parentInfo.cover = res.data
            },
            cancle() {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm() {
                this.$refs.categoryEditForm.validate((valid) => {
                    if (valid) {
                        //校验中文和英文类目名称不能为空
                        if (this.categoryModel.nameList['cn'].trim() === '' || this.categoryModel.nameList['en'].trim() === '') {
                            this.$message.warning('类目名称中文、英文不能为空')
                            return
                        }
                        // 参数属性、规格属性
                        let paramAttr = []
                        let standardAttr = []
                        _.forEach(this.paramAttrList, (item) => {
                            paramAttr.push(item.attrId)
                        })
                        _.forEach(this.standardAttrList, (item) => {
                            standardAttr.push(item.attrId)
                        })
                        this.categoryModel.paramAttrId = paramAttr.toString()
                        this.categoryModel.standardAttrId = standardAttr.toString()

                        let result = _.pick(this.categoryModel, ['desc', 'paramAttrId', 'standardAttrId'])

                        let cateNameValue = []
                        _.forEach(this.categoryModel.nameList, (value, key) => {
                            let nameObj = {
                                languageCode: key,
                                name: value
                            }
                            cateNameValue.push(nameObj)
                        })
                        result.cateType = 2
                        result.level = this.parentInfo.level
                        result.pid = this.parentInfo.pid
                        result.cover =  this.parentInfo.cover
                        result.cateNameValue = cateNameValue
                        if (this.editType === 'edit') {
                           result.cateId = this.categoryModel.cateId
                        }
                        this.$emit('on-confirm', result)
                        this.reset()
                    }
                })
            },
            reset() {
                this.$refs.categoryEditForm.resetFields()
                this.paramAttrList = []
                this.standardAttrList = []
            },
            // 翻译
            translate() {},
            delAttrValue() {
                let attrValue = '黑色'
                this.confirmVisible = true
                this.confirmDialogTitle = '确定删除该属性值？'
                this.confirmDialogText = `删除属性值“${attrValue}”不影响现有类目和商品，但一经删除无法恢复`
            },
            /**
             * 获取类目列表
             */
            getCategoryList(pid = 0, level = 1) {
                if (this.parentInfo.level === 1) {
                    return
                }
                let params = {
                    cateType: 2, //类目类型 1 前台类目 2 后台类目
                    page: {
                        pageNum: 1,
                        pageSize: 1000
                    }
                }
                params.pid = pid
                categoryListGet(params).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        let categoryUnitList = []
                        _.forEach(res.categoryUnit, (item) => {
                            item.cateName = item.cateNameValue[0].name
                            item.value = item.cateId
                            item.label = item.cateNameValue[0].name
                            item.children = []
                            categoryUnitList.push(item)
                        })
                        this.parentOptions = categoryUnitList

                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            getProductAttrForParam(query) {
                let params = {
                    attrNameKey: query,
                    attrNameLanguageCode: 'cn',
                    page: {
                        pageNum: 1,
                        pageSize: 1000
                    }
                }
                productAttrGet(this.filterData(params)).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.paramAttrOptions = res.productAttr
                    }
                })
            },
            onSelectChangeForParam(attrId) {
                let params = {
                    attrId: attrId
                }
                productAttrGetById(params).then((response) => {
                    let res = response
                    let attrObj = {}
                    _.forEach(res.attrName, (item) => {
                        attrObj[item.languageCode] = item.name
                    })
                    attrObj.attrId = res.attrId
                    attrObj.customize = res.customize === 1 ? '允许' : '禁止'

                    if (!this.attrExist(this.paramAttrList, attrObj) && attrId) {
                        this.paramAttrList.push(attrObj)
                    }
                })
            },
            getProductAttrForStandard(query) {
                let params = {
                    attrNameKey: query,
                    attrNameLanguageCode: 'cn',
                    page: {
                        pageNum: 1,
                        pageSize: 1000
                    }
                }
                productAttrGet(this.filterData(params)).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.standardAttrOptions = res.productAttr
                    }
                })
            },
            onSelectChangeForStandard(attrId) {
                let params = {
                    attrId: attrId
                }
                productAttrGetById(params).then((response) => {
                    let res = response
                    let attrObj = {}
                    _.forEach(res.attrName, (item) => {
                        attrObj[item.languageCode] = item.name
                    })
                    attrObj.attrId = res.attrId
                    attrObj.customize = res.customize === 1 ? '允许' : '禁止'

                    if (!this.attrExist(this.standardAttrList, attrObj) && attrId) {
                        this.standardAttrList.push(attrObj)
                    }
                })
            },
            removeParamAttr(attrId) {
                let index = -1
                _.forEach(this.paramAttrList, (item, i) => {
                    if (item.attrId === attrId) {
                        index = i
                    }
                })
                this.paramAttrList.splice(index, 1)
            },
            removeStandardAttr(attrId) {
                let index = -1
                _.forEach(this.standardAttrList, (item, i) => {
                    if (item.attrId === attrId) {
                        index = i
                    }
                })
                this.standardAttrList.splice(index, 1)
            },
            /**
             * 校验属性值是否已存在
             */
            attrExist(list, obj) {
                let isExist = false
                _.forEach(list, (item) => {
                    if (item.attrId === obj.attrId) {
                        isExist = true
                    }
                })
                return isExist
            },
            handleChange(data) {
                console.log(data)
            },
            getBatchProductAttr() {
                let paramAttrId = null
                let standardAttrId = null
                if (this.categoryModel.paramAttrId != '') {
                    paramAttrId = this.categoryModel.paramAttrId.split(',')
                }
                if (this.categoryModel.standardAttrId != '') {
                    standardAttrId = this.categoryModel.standardAttrId.split(',')
                }

                let params = {
                    paramAttrId: paramAttrId,
                    standardAttrId: standardAttrId,
                    filterHiddenAttrValue: true
                }
                productAttrGetByIdBatch(this.filterData(params)).then((response) => {
                    if (response.ret.errcode === 1) {
                        let paramAttr = response.paramAttr
                        let standardAttr = response.standardAttr
                        let paramAttrList = []
                        let standardAttrList = []
                        _.forEach(paramAttr, (item) => {
                            let attrItem = {}
                            attrItem.attrId = item.attrId
                            attrItem.customize = item.customize === 1 ? '允许' : '禁止'
                            _.forEach(item.attrName, (subItem, key) => {
                                attrItem[subItem.languageCode] = subItem.name
                            })
                            paramAttrList.push(attrItem)
                        })
                        this.paramAttrList = paramAttrList

                        _.forEach(standardAttr, (item) => {
                            let attrItem = {}
                            attrItem.attrId = item.attrId
                            attrItem.customize = item.customize === 1 ? '允许' : '禁止'
                            _.forEach(item.attrName, (subItem, key) => {
                                attrItem[subItem.languageCode] = subItem.name
                            })
                            standardAttrList.push(attrItem)
                        })
                        this.standardAttrList = standardAttrList
                    }

                })
            }

        }
    }
</script>

<style lang="scss">
    .edit-category-dialog {
        .el-select .el-input {
            width: 400px;
        }
        .el-input,
        .el-textarea {
            width: 400px;
        }
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

    .sortable-ghost {
        opacity: .8;
        color: #fff!important;
        background: #409EFF!important;
    }
    .table {
        width: 72%;
        border: 1px solid #DCDFE6;
        border-radius: 4px;
        th {
            background: #f2f2f2;
            width: 120px;
            border: 1px solid #DCDFE6;
        }
        tr td {
            border: 1px solid #DCDFE6;
        }
        td {
            padding: 0 10px;
        }
        .limit {
            width: 120px;
            text-align: center;
        }
        .required {
            font-size: 16px;
            color: red;
            vertical-align: middle;
        }
    }
</style>
