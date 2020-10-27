<template>
    <div class="app-container">
        <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
            <el-tab-pane label="属性管理" name="attr"></el-tab-pane>
            <el-tab-pane label="属性值管理" name="attrValue"></el-tab-pane>
        </el-tabs>
        <div class="attr-filter-container">
            <el-form ref="attrFilterForm" inline label-width="100px" :model="queryData" v-if="activeTab === 'attr'">
                <el-form-item label="属性ID：" class="filter-item" prop="attrIdKey">
                    <el-input placeholder="多个属性ID用英文逗号,隔开" size="medium" clearable v-model="queryData.attrIdKey" @keyup.enter.native="search" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="属性名：" class="filter-item" prop="attrNameKey">
                    <el-select v-model="queryData.attrNameLanguageCode" filterable clearable style="width: 110px" size="medium" placeholder="选择类型">
                        <el-option v-for="(item, index) in languageList" :key="index" :label="item.desc" :value="item.code"></el-option>
                    </el-select>
                    <el-input v-model="queryData.attrNameKey" style="width: 200px; margin-right: 20px;" size="medium" placeholder="请输入" clearable></el-input>
                </el-form-item>
                <el-form-item label="后台类目：" class="filter-item" prop="categoryNameKey">
                    <el-input placeholder="请输入类目名称" clearable size="medium" v-model="queryData.categoryNameKey" @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="查找空名称：" class="filter-item" prop="emptyLanguage">
                     <el-checkbox-group v-model="queryData.emptyLanguage">
                        <el-checkbox v-for="language in filterLanguageList" :label="language.code" :key="language.code">{{language.desc}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-button icon="el-icon-download"
                        plain type="primary"
                        size="medium"
                        v-if="hasPermission('BTN_PRODUCT_ATTRIBUTE_DOWNLOAD')"
                        @click="downloadAttrList()">导出</el-button>
                    <!-- <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link> -->
                </el-form-item>
            </el-form>
            <el-form ref="attrValueFilterForm" inline label-width="100px" :model="attrValueQueryData" v-if="activeTab === 'attrValue'">
                <el-form-item label="属性值ID：" class="filter-item" prop="valueIdKey">
                    <el-input placeholder="多个属性值ID用英文逗号,隔开" size="medium" clearable v-model="attrValueQueryData.valueIdKey" @keyup.enter.native="search" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="SPUID：" class="filter-item" prop="productIdKey">
                    <el-input placeholder="输入SPUID" size="medium" clearable v-model="attrValueQueryData.productIdKey" @keyup.enter.native="search" style="width: 210px;"></el-input>
                </el-form-item>
                <el-form-item label="查找空名称：" class="filter-item" prop="emptyLanguage">
                    <el-checkbox-group v-model="attrValueQueryData.emptyLanguage">
                        <el-checkbox v-for="language in filterLanguageList" :label="language.code" :key="language.code">{{language.desc}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-button icon="el-icon-download"
                        plain type="primary"
                        size="medium"
                        v-if="hasPermission('BTN_PRODUCT_ATTRIBUTE_VALUE_DOWNLOAD')"
                        @click="downloadAttrValueList()">导出</el-button>
                </el-form-item>
            </el-form>
            <div class="operation">
                <el-button v-if="hasPermission('BTN_PRODUCT_ATTRIBUTE_ADD') && activeTab === 'attr'"
                    icon="el-icon-plus" type="primary" size="medium" @click="addAttr()">
                    新增
                </el-button>
                <el-button v-if="hasPermission('BTN_PRODUCT_UPLOAD_EDIT')"
                    icon="el-icon-upload2" plain type="primary" size="medium" @click="uploadAttrExcel()">
                    导表修改
                </el-button>
                <el-button v-if="hasPermission('BTN_PRODUCT_ATTRIBUTE_TRANSLATE')" type="text" @click="oneKeyTranslate">一键自动翻译</el-button>
                <!-- <el-button icon="el-icon-upload2" plain type="primary" size="medium" @click="uploadAttrExcel()">上传</el-button> -->
            </div>
        </div>
        <div class="main-content-wrapper">
            <el-table v-if="activeTab === 'attr'" border height="100%" :data="dataList" v-loading="loading" @selection-change="handleAttrSelectionChange">
                <el-table-column type="selection" width="50" align="center" fixed="left"></el-table-column>
                <el-table-column key="1" prop="attrId" label="属性ID" align="center" min-width="80px" fixed="left"></el-table-column>
                <el-table-column  v-for="language in languageList" :key="language.code" :prop="'attrName'+language.code" :label="'名称-'+ language.desc" align="center" min-width="180px"></el-table-column>
                <el-table-column key="4" prop="operationName" label="更新人" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <span>{{scope.row.operationName || '-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column key="5" prop="updateTime" label="更新时间" align="center" width="170px">
                    <template slot-scope="scope">
                        <span>{{scope.row.updateTime | secondTimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column key="6" fixed="right" label="操作" align="center" width="130px">
                    <template slot-scope="scope">
                        <el-button type="text"
                            size="mini"
                            v-if="hasPermission('BTN_PRODUCT_ATTRIBUTE_EDIT')"
                            @click="modifyAttr(scope.row.attrId)">编辑</el-button>
                        <el-button :disabled="!scope.row.canBeDelete"
                            type="text"
                            size="mini"
                            v-if="hasPermission('BTN_PRODUCT_ATTRIBUTE_DELETE')"
                            @click="delAttr(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-if="activeTab === 'attrValue'" border height="100%" :data="attrValueList" v-loading="loading" @selection-change="handleAttrValueSelectionChange">
                <el-table-column type="selection" width="50" align="center" fixed="left"></el-table-column>
                <el-table-column key="1" prop="valueId" label="属性值ID" align="center" min-width="80px" fixed="left"></el-table-column>
                <el-table-column  v-for="language in languageList" :key="language.code" :prop="'valueName'+language.code" :label="'名称-'+ language.desc" align="center" min-width="180px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.edit" >
                            <el-input size="mini" v-model="scope.row['valueName'+language.code]"></el-input>
                        </span>
                        <span v-else>{{scope.row['valueName'+language.code] }}</span>
                    </template>
                </el-table-column>
                <el-table-column key="5" prop="updateTime" label="归属属性" align="center" width="170px">
                    <template slot-scope="scope">
                        <span>{{scope.row.attrId}} {{scope.row.attrName}}</span>
                    </template>
                </el-table-column>
                <el-table-column key="6" prop="valueType" label="是否是模板" align="center" width="170px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.valueType === 1">是</span>
                        <span v-if="scope.row.valueType === 2">否</span>
                    </template>
                </el-table-column>
                <el-table-column key="7" fixed="right" label="操作" align="center" width="130px">
                    <template slot-scope="scope">
                        <el-button :disabled="!scope.row.canBeModify"
                            type="text"
                            size="mini"
                            v-if="hasPermission('BTN_PRODUCT_ATTRIBUTE_VAlUE_EDIT') && !scope.row.edit"
                            @click="scope.row.edit=!scope.row.edit">编辑</el-button>
                        <el-button
                            v-if="scope.row.edit"
                            type="text"
                            size="mini"
                            @click="updateAttrValue(scope.row)">保存</el-button>
                        <el-button
                            type="text"
                            size="mini"
                            v-if="hasPermission('BTN_PRODUCT_ATTRIBUTE_VAlUE_DELETE')"
                            @click="delAttrValue(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                v-if="activeTab === 'attr'"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
            <el-pagination
                v-if="activeTab === 'attrValue'"
                @current-change="handleValueCurrentChange"
                @size-change="handleValueSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="attrValueQueryData.page.pageNum"
                :page-size="attrValueQueryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="valueTotal"
                class="pagination">
            </el-pagination>
        </div>
        <product-attribute-edit :dialogVisible="dialogVisible" :editType="editType" :attrDataModel="attrModel" @on-cancle="cancleEdit" @on-confirm="confirmEdit"></product-attribute-edit>
        <upload-excel-dialog :dialogVisible="uploadVisible" :type="activeTab" title="上传" @on-cancle="cancleUpload" @on-confirm="confirmUpload"></upload-excel-dialog>
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText" @on-cancle="cancle" @on-confirm="comfirm"></confirm-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import ProductAttributeEdit from './components/ProductAttributeEdit'
    import ConfirmDialog from '@/components/ConfirmDialog'
    import UploadExcelDialog from './components/UploadExcelDialog'
    import { productAttrGet, productAttrAdd, productAttrDisable, productAttrModify,
        productAttrGetById, productAttrDownload, translateSelectedAttr, productAttrValueGet,
        updateAttrTranslateById, productAttrValueDownload, productAttrValueDisable} from '@/request/product'

    export default {
        // 商品属性管理
        name: 'ProductAttribute',
        data() {
            return {
                activeTab: 'attr',
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                editType: 'add', // 属性编辑弹框类型：add 新增 | edit 编辑
                total: 0,
                valueTotal: 0,
                attrId: '',
                queryData: {
                    attrIdKey: '', //属性id
                    attrNameLanguageCode: 'cn',
                    attrNameKey: '',
                    categoryNameKey: '', //类目名
                    emptyLanguage: [],
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                attrValueQueryData: {
                    valueIdKey: '', //属性值id
                    productIdKey: '',
                    emptyLanguage: [],
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                languageCodeList: [{
                        value: 'cn',
                        label: '中文cn'
                    },
                    {
                        value: 'en',
                        label: '英文en'
                    },
                    {
                        value: 'ms',
                        label: '马来语ms'
                    },
                    {
                        value: 'th',
                        label: '泰语th'
                    },{
                        value: 'id',
                        label: '印尼语id'
                    },
                ],
                dataList: [],
                attrValueList: [],
                dialogVisible: false,
                uploadVisible: false,
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                attrModel: {},
                multipleAttrSelection: [],
                multipleAttrValueSelection: [],
                confirmType: ''
            }
        },
        components: {
            ProductAttributeEdit,
            UploadExcelDialog,
            ConfirmDialog,
        },
        computed: {
            languageList() {
                return this.$store.state.dict.languageList
            },
            filterLanguageList () {
                let list = []
                _.forEach(this.languageList, language => {
                    if (language.code != 'cn' && language.code != 'en') {
                        list.push(language)
                    }
                })
                return list
            }
        },
        mounted() {
            this.getProductAttrList();
        },
        methods: {
            handleTabClick(tab, event) {
                if (tab.name === 'attr') {
                    this.getProductAttrList()
                } else {
                    this.getProductAttrValueList()
                }
            },
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = '展开';
                    this.dropDownIcon = 'el-icon-arrow-down';
                } else {
                    this.dropDownContent = '收起';
                    this.dropDownIcon = 'el-icon-arrow-up';
                }
                this.drop = !this.drop;
            },
            /**
             * 条件搜索
            */
            search() {
                if (this.activeTab === 'attr') {
                    this.queryData.page.pageNum = 1
                    this.getProductAttrList()
                } else {
                    this.attrValueQueryData.page.pageNum = 1
                    this.getProductAttrValueList()
                }
            },
            resetSearch() {
                if (this.activeTab === 'attr') {
                    this.queryData.page.pageNum = 1
                    this.queryData.page.pageSize = 20
                    this.queryData.attrNameLanguageCode = 'cn'
                    this.$refs.attrFilterForm.resetFields()
                    this.getProductAttrList()
                } else {
                    this.attrValueQueryData.page.pageNum = 1
                    this.attrValueQueryData.page.pageSize = 20
                    this.$refs.attrValueFilterForm.resetFields()
                    this.getProductAttrValueList()
                }
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getProductAttrList()
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val
                this.getProductAttrList()
            },
            handleValueCurrentChange(val) {
                this.attrValueQueryData.page.pageNum = val ? val : this.attrValueQueryData.page.pageNum
                this.getProductAttrValueList()
            },
            handleValueSizeChange(val) {
                this.attrValueQueryData.page.pageSize = val
                this.getProductAttrValueList()
            },
            /**
             * 新增属性
            */
            addAttr() {
                this.dialogVisible = true
                this.editType = 'add'
                // 构造table数据结构体
                let tabelItem = {}
                _.forEach(this.languageList, (value) => {
                    let unit = {
                        value: '', editable: false
                    }
                    tabelItem[value.code] = unit
                })

                this.attrModel = {
                    attrNameTableData:[],
                    attrValueTableData: [],
                    customize: 1 // 是否允许自定义
                }
                this.attrModel.attrNameTableData.push(_.cloneDeep(tabelItem))
                this.attrModel.attrValueTableData.push(_.cloneDeep(tabelItem))
            },
            cancleEdit() {
                this.dialogVisible = false
            },
            confirmEdit(data) {
                console.log(data)
                let result = {}
                let attrNames = []
                let attrValue = []
                let productAttrValues = []
                let attrNamesObj = data.attrNameTableData[0]

                _.forEach(attrNamesObj, (value, key) => {
                    let attrItem = {}
                    if (key !== 'attrId') {
                        attrItem.languageCode = key
                        attrItem.name = value.value
                        attrNames.push(attrItem)
                    }
                })

                _.forEach(data.attrValueTableData, (value) => {
                    let productAttrValue = {}
                    let attrValues = []
                    _.forEach(value, (value, key) => {
                        let attrItem = {}
                        if (key !== 'valueId') {
                            attrItem.languageCode = key
                            attrItem.name = value.value
                            attrValues.push(attrItem)
                        }
                    })
                    if (this.editType === 'edit' && value.valueId) {
                        productAttrValue.valueId = value.valueId
                    }
                    productAttrValue.valueName = attrValues
                    productAttrValues.push(productAttrValue)
                })

                result.attrName = attrNames
                result.attrValue = productAttrValues
                result.customize = data.customize

                if (this.editType === 'edit') {
                    result.attrId = attrNamesObj.attrId
                    this.modifyProductAttr(result)
                } else {
                    this.addProductAttr(result)
                }
            },
            /**
             * 新增商品属性
            */
            addProductAttr(result) {
                productAttrAdd(this.filterData(result)).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.$message.success('操作成功！')
                        this.getProductAttrList()
                        this.dialogVisible = false
                    } else if (res.ret.errcode === 4222) {
                        this.$message.warning('属性值不能重复!')
                    } else (
                        this.$message.error('属性值添加失败!')
                    )
                }).catch((err) => {
                    console.error(err)
                })
            },
            /**
             * 编辑商品属性
            */
            modifyProductAttr(result) {
                productAttrModify(this.filterData(result)).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        this.$message.success('操作成功！')
                        this.getProductAttrList()
                        this.dialogVisible = false
                    } else if (res.ret.errcode === 4222) {
                        this.$message.warning('属性值不能重复!')
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            /**
             * 上传属性文件
            */
            uploadAttrExcel() {
                this.uploadVisible = true
            },
            /**
             * 编辑属性
            */
            modifyAttr(attrId) {
                this.dialogVisible = true
                this.editType = 'edit'
                let params = {
                    attrId: attrId,
                    filterHiddenAttrValue: true
                }
                productAttrGetById(params).then((response) => {
                    let res = response
                    let result = this.formatAttrDetailData(res)

                    this.attrModel = result
                }).catch((err) => {
                    console.error(err)
                })
            },
            /**
             * 删除属性
            */
            delAttr(rowData) {
                console.log(rowData)
                this.confirmType = 'attr'
                this.attrId = rowData.attrId
                let attr = rowData.attrName
                this.confirmVisible = true
                this.confirmDialogTitle = '确定删除该属性？'
                this.confirmDialogText = `删除属性："${attr}"不会影响商品，但其与后台类目的绑定关系将解除，且一经删除无法恢复`
            },
            /**
             * 删除属性值
            */
            delAttrValue(rowData) {
                console.log(rowData)
                this.confirmType = 'attrValue'
                this.attrId = rowData.attrId
                this.attrValueId = rowData.valueId
                let valueName = rowData.valueNamecn
                this.confirmVisible = true
                this.confirmDialogTitle = '确定删除该属性值？'
                this.confirmDialogText = `删除属性值："${valueName}"不会影响商品，但其与后台类目的绑定关系将解除，且一经删除无法恢复`
            },
            cancle() {
                this.confirmVisible = false
            },
            comfirm() {
                this.confirmVisible = false
                if (this.confirmType === 'attr') {
                    this.delProductAttr()
                } else {
                    this.delProductAttrValue()
                }
            },
            cancleUpload() {
                this.uploadVisible = false
            },
            confirmUpload() {
                this.uploadVisible = false
                this.search()
            },
            // 获取商品属性列表
            getProductAttrList() {
                this.loading = true
                let params = this.queryData
                params.emptyLanguageCode = params.emptyLanguage.join()
                productAttrGet(this.filterData(params)).then((response) => {
                    if (response.productAttr) {
                        let productAttr = response.productAttr
                        productAttr.forEach(item => {
                            if (item.attrValueName) {
                                item.attrValueName = item.attrValueName.join(' ')
                            }
                        })
                        _.forEach(productAttr, attr => {
                            _.forEach(this.languageList, language => {
                                attr['attrName'+ language.code] = ''
                            })
                            _.forEach(attr.attrNameCode, attrNameItem => {
                               attr['attrName'+ attrNameItem.languageCode] = attrNameItem.name
                            })
                        })
                        this.dataList = productAttr
                        this.total = response.total
                    } else {
                        this.dataList = []
                        this.total = 0
                    }
                    this.loading = false
                }).catch((err) => {
                    this.loading = false
                    console.error(err)
                })
            },
            // 删除商品属性
            delProductAttr() {
                let params = {
                    attrId: this.attrId
                }
                productAttrDisable(params).then((res) => {
                    if (res.ret.errcode === 1) {
                       this.$message.success('操作成功！')
                       this.getProductAttrList()
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            delProductAttrValue() {
                let params = {
                    attrId: this.attrId,
                    valueId: this.attrValueId
                }
                productAttrValueDisable(params).then((res) => {
                    if (res.ret.errcode === 1) {
                       this.$message.success('操作成功！')
                       this.getProductAttrValueList()
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            /**
             * 处理属性具体数据,结构满足编辑table
            */
            formatAttrDetailData(attrData) {
                console.log(attrData)
                let result = {}
                let languageCodeList = [] //语言
                _.forEach(this.languageList, (languageItem) => {
                    languageCodeList.push(languageItem.code)
                })

                let attrNameTableData = [] //属性名表
                let attrNameObj = {}
                attrNameObj.attrId = attrData.attrId
                _.forEach(attrData.attrName, (item) => {
                    let subObj = {
                        value: '',
                        editable: !attrData.canBeModify
                    }
                    subObj.value = item.name
                    // attrNameObj[item.languageCode] = subObj
                    this.$set(attrNameObj, item.languageCode, subObj)
                })

                // 检查缺失哪些语言数据，并填充
                let missingAttrName = _.difference(languageCodeList, Object.keys(attrNameObj))
                _.forEach(missingAttrName, (item) => {
                    let subObj = {
                        value: '',
                        editable: false
                    }
                    attrNameObj[item] = subObj
                })

                // attrNameTableData.push(attrNameObj)
                this.$set(attrNameTableData, 0, attrNameObj)

                let attrValueTableData = [] //属性值表

                _.forEach(attrData.attrValue, (attrValueItem) => {
                    let attrValueObj = {}
                    attrValueObj.valueId = attrValueItem.valueId

                    _.forEach(attrValueItem.valueName, (item) => {
                        let subObj = {
                            value: '',
                            editable: false
                        }
                        subObj.value = item.name
                        subObj.editable = !attrValueItem.canBeModify
                        attrValueObj[item.languageCode] = subObj
                    })

                    // 检查缺失哪些语言数据，并填充
                    let missingAttrValue = _.difference(languageCodeList, Object.keys(attrValueObj))
                    _.forEach(missingAttrValue, (item) => {
                        let subObj = {
                            value: '',
                            editable: false
                        }
                        attrValueObj[item] = subObj
                    })
                    attrValueTableData.push(attrValueObj)
                })

                result.attrNameTableData = attrNameTableData
                result.attrValueTableData = attrValueTableData
                if (attrData.customize) {
                    result.customize = attrData.customize
                } else {
                    result.customize = 0
                }

                return result
            },
            downloadAttrList() {
                let params = _.pick(this.queryData, ['attrIdKey', 'attrNameKey', 'emptyLanguageCode', 'categoryNameKey', 'attrNameLanguageCode'])
                productAttrDownload(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        let fileUrl = res.fileUrl
                         window.open(`${this.dealShowFileSrc(fileUrl)}`)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            downloadAttrValueList() {
                let params = _.pick(this.attrValueQueryData, ['valueIdKey', 'productIdKey', 'emptyLanguageCode'])
                productAttrValueDownload(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        let fileUrl = res.fileUrl
                         window.open(`${this.dealShowFileSrc(fileUrl)}`)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            handleAttrSelectionChange(val) {
                this.multipleAttrSelection = val
                console.log(val)
            },
            handleAttrValueSelectionChange(val) {
                this.multipleAttrValueSelection = val
                console.log(val)
            },
            oneKeyTranslate() {
                let params = {
                    attrId: [],
                    valueId: [],
                    targetLanguageCode: ['en', 'ms', 'th', 'id']
                }
                if (this.activeTab === 'attr') {
                    if (this.multipleAttrSelection.length <= 0) {
                        this.$message.warning('请选择需要翻译的属性')
                        return
                    }
                    let attrIdList = []
                    _.forEach(this.multipleAttrSelection, item => {
                        attrIdList.push(item.attrId)
                    })
                    params.attrId = attrIdList
                } else {
                    if (this.multipleAttrValueSelection.length <= 0) {
                        this.$message.warning('请选择需要翻译的属性值')
                        return
                    }
                    let attrValueIdList = []
                    _.forEach(this.multipleAttrValueSelection, item => {
                        attrValueIdList.push(item.valueId)
                    })
                    params.valueId = attrValueIdList
                }

                translateSelectedAttr(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('一键自动翻译成功！')
                        if (this.activeTab === 'attr') {
                            this.getProductAttrList()
                        } else {
                            this.getProductAttrValueList()
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 获取商品属性列表
            getProductAttrValueList() {
                this.loading = true
                let params = this.attrValueQueryData
                params.emptyLanguageCode = params.emptyLanguage.join()
                productAttrValueGet(this.filterData(params)).then((response) => {
                    this.loading = false
                    if (response.ret.errcode === 1) {
                        this.valueTotal = response.total
                        let productAttrValue = response.productAttrValue
                        _.forEach(productAttrValue, attrValue => {
                            attrValue.edit = false
                            _.forEach(this.languageList, language => {
                                attrValue['valueName'+ language.code] = ''
                            })
                            _.forEach(attrValue.valueName, valueNameItem => {
                               attrValue['valueName'+ valueNameItem.languageCode] = valueNameItem.name
                            })
                        })
                        console.log(productAttrValue)
                        this.attrValueList = productAttrValue
                    }
                }).catch((err) => {
                    this.loading = false
                    console.error(err)
                })
            },
            updateAttrValue(row) {
                let params = {
                    contentId: row.valueId,
                    valueName: []
                }
                let valueNameList = []
                _.forEach(row, (value, key) => {
                    if (key.length > 9 && key.indexOf('valueName') > -1) {
                        let item = {}
                        item.name = value
                        item.languageCode = key.substring(9)
                        valueNameList.push(item)
                    }
                })
                params.valueName = valueNameList
                let flag = 0
                _.forEach(params.valueName, item => {
                    if (item.languageCode === 'cn' || item.languageCode === 'en') {
                        if (item.name === '') {
                            flag ++
                        }
                    }
                })
                if (flag > 0) {
                    this.$message.warning('属性值中文、英文名称不能为空！')
                    return
                }
                updateAttrTranslateById(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('属性值更新成功')
                        this.getProductAttrValueList()
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .attr-filter-container {
        .el-select .el-input {
            width: 110px;
        }
    }
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>

<style lang="scss" scoped>
    .operation {
        margin-bottom: 10px;
    }

</style>

