<template>
    <div class="copy-category-dialog">
        <el-dialog :title="title" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <p class="copy-tips">复制时若发现已存在中文名相同的类目，系统将覆盖更新该类目</p>
            <el-form ref="autoPricingForm" :model="copyModel" label-width="120px">
                <el-form-item label="复制至：" prop="checkedCountry" v-if="level === 1">
                    <el-checkbox-group v-model="copyModel.checkedCountry" @change="handleCheckedCountryChange">
                        <el-checkbox v-for="country in countryList" :label="country.shortCode" :key="country.shortCode" :disabled="country.shortCode === countryCode">{{country.nameLocal}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="复制对象：" prop="priceType" v-if="level === 1">
                    <el-tree
                    :data="treeData"
                    show-checkbox
                    node-key="id"
                    :check-on-click-node="true"
                    :default-expanded-keys="defaultExpandedKeys"
                    :default-checked-keys="defaultCheckedKeys"
                    :props="defaultProps"
                    @check-change="handleTreeCheckChange">
                    </el-tree>
                </el-form-item>
                <el-form-item label="复制至：" prop="checkedCountry" v-if="level === 2">
                    <el-checkbox-group v-model="copyModel.checkedCountry" @change="handleCheckedCountryChange">
                        <div v-for="(country, index) in countryList" :key="index">
                            <el-checkbox :label="country.shortCode" :key="country.shortCode" :disabled="country.shortCode === countryCode"><span class="country-name">{{country.nameLocal}}</span>
                                <span v-if="country.shortCode === countryCode">不能复制到同一站点</span>
                                <span v-else>
                                     <el-select v-model="selectValue[country.shortCode]" placeholder="请选择" size="medium">
                                        <el-option
                                          v-for="item in cateOptions[country.shortCode]"
                                          :key="item.cateId"
                                          :label="item.cateName"
                                          :value="item.cateId"
                                          :disabled="item.disabled">
                                        </el-option>
                                    </el-select>
                                </span>
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
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
    import { categoryListGet } from '@/request/product'
    export default {
        // 复制前台类目
        name: 'CopyCategoryDialog',
        data() {
            return {
                countryList: [],
                copyModel: {
                    checkedCountry: []
                },
                treeData: [],
                defaultExpandedKeys: [],
                defaultCheckedKeys: [],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                copyUnitList: [],
                selectValue: {},
                cateOptions: {}
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            dialogTitle: {
                type: String,
                default: ''
            },
            categoryLevel: {
                type: Number,
                default: 1
            },
            countryCode: {
                type: String,
                default: ''
            },
            parentNode: {
                type: Object,
                default: () => {}
            }
        },
        computed: {
            toggle: {
                get: function() {
                    if (this.dialogVisible && this.categoryLevel === 1) {
                        this.getCurrentCategoryTree()
                    } else if (this.dialogVisible && this.categoryLevel === 2) {
                        this.getAllLevelOneCateData()
                        setTimeout(() => {
                            this.setSelectValue()
                        }, 1000)
                    }
                    if (this.dialogVisible) {
                        this.defaultCheckedKeys = []
                        let targetCountry = []
                        _.forEach(this.countryList, country => {
                            if (country.shortCode != this.countryCode) {
                                targetCountry.push(country.shortCode)
                            }
                            this.$set(this.selectValue, country.shortCode, '')
                            this.$set(this.copyModel, 'checkedCountry', targetCountry)
                        })
                    }
                    return this.dialogVisible;
                },
                set: function() {}
            },
            title: {
                get: function() {
                    return this.dialogTitle;
                },
                set: function() {}
            },
            level: {
                get: function() {
                    return this.categoryLevel;
                },
                set: function() {}
            },
        },
        created() {
            this.countryList = JSON.parse(this.getStore('countryList'))
        },
        methods: {
            reset() {
                console.log(this.parentNode)
            },
            cancle() {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm() {
                this.handelCopyData()
                if (this.level === 1 && this.defaultCheckedKeys.length === 0 && this.treeData[0].children.length > 0) {
                    this.$message.warning('请选择复制对象')
                    return
                }
                if (this.level === 2) {
                    let flag = 0
                    _.forEach(this.copyUnitList, copyUnit => {
                        if (copyUnit.levelTwo[0].toLevelOneCateId === ''){
                            flag++
                        }
                    })
                    if (flag > 0) {
                        this.$message.warning('请选择复制至的一级类目')
                        return
                    }
                }
                if (this.copyModel.checkedCountry.length === 0) {
                    this.$message.warning('请选择复制目标国家')
                    return
                } else {
                    this.$emit('on-confirm', this.copyUnitList)
                }
            },
            handleCheckedCountryChange(country) {
                console.log(country)
            },
            handleTreeCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate)
                if (checked === false && !data.children) {
                    this.defaultCheckedKeys.splice(_.indexOf(this.defaultCheckedKeys, data.id), 1)
                }
                if (checked && data.id !== this.parentNode.data.cateId) {
                    if (_.indexOf(this.defaultCheckedKeys, data.id) === -1) {
                        this.defaultCheckedKeys.push(data.id)
                    }
                }
                console.log(this.defaultCheckedKeys)
            },
            getCurrentCategoryTree() {
                categoryListGet(this.filterData({
                    pid: this.parentNode.data.cateId,
                    cateType: this.parentNode.data.cateType,
                    page: {
                        pageSize: 1000,
                        pageNum: 1
                    },
                    countryCode: this.parentNode.data.countryCode
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        let subCategory = []
                        this.defaultCheckedKeys = []
                        _.forEach(res.categoryUnit, item => {
                            let subCategoryItem = {
                                id: item.cateId,
                                label: item.cateName
                            }
                            subCategory.push(subCategoryItem)
                            this.defaultCheckedKeys.push(item.cateId)
                        })
                        let category = {
                            id: this.parentNode.data.cateId,
                            label: this.parentNode.data.cateName,
                            children: subCategory
                        }
                        this.defaultExpandedKeys = [this.parentNode.data.cateId]
                        this.treeData = [category]
                        console.log(this.treeData)
                    }
                })
            },
            handelCopyData() {
                this.copyUnitList = []
                _.forEach(this.copyModel.checkedCountry, country => {
                    let copyUnit = {}
                    copyUnit.toCountryCode = country
                    let levelTwoList = []
                    if (this.level === 1) {
                        copyUnit.fromLevelOneCateId = this.parentNode.data.cateId
                        _.forEach(this.defaultCheckedKeys, checkedKey => {
                            let levelTwo = {}
                            levelTwo.fromLevelTwoCateId = checkedKey
                            levelTwoList.push(levelTwo)
                        })
                    } else {
                        let levelTwo = {}
                        levelTwo.fromLevelTwoCateId = this.parentNode.data.cateId
                        levelTwo.toLevelOneCateId = this.selectValue[country]
                        levelTwoList.push(levelTwo)
                    }
                    copyUnit.levelTwo = levelTwoList
                    this.copyUnitList.push(copyUnit)
                })
                console.log(this.copyUnitList)
            },
            getLevelOneCateData(countryCode) {
                categoryListGet(this.filterData({
                    pid: 0,
                    cateType: 1,
                    page: {
                        pageSize: 1000,
                        pageNum: 1
                    },
                    countryCode: countryCode
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.cateOptions[countryCode] = res.categoryUnit
                    }
                })
            },
            getAllLevelOneCateData() {
                _.forEach(this.countryList, country => {
                    this.getLevelOneCateData(country.shortCode)
                })
            },
            setSelectValue() {
                let parentCateName = this.parentNode.parent.data.cateName
                _.forEach(this.countryList, country => {
                    _.forEach(this.cateOptions[country.shortCode], cateOption => {
                        if (parentCateName === cateOption.cateName) {
                            this.$set(this.selectValue, country.shortCode, cateOption.cateId)
                        }
                    })
                })
            }
        }
    }
</script>

<style lang="scss">
    .copy-category-dialog {
        .el-dialog__header {
            border-bottom: 1px solid #ebeef5;
        }
        .el-dialog__body {
            padding: 0 0 50px 0;
        }
        .el-dialog__footer {
            border-top: 1px solid #ebeef5;
        }
        .el-form--inline .el-form-item {
            margin-right: 0;
        }
        .copy-tips {
            margin-bottom: 30px;
            text-align: center;
            color: #666;
            background-color: #f2f2f2;
        }
        .country-name {
            display: inline-block;
            width: 80px;
        }
    }
</style>



