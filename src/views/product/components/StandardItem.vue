<template>
    <div class="app-container">
        <el-form-item :label="standardInfo.cn + '：'">
            <multiple-select :value="attrValue" :standardInfo="standardInfo" :optionList="optionList"
                @change-selected="changeSelect" @update-option="handleUpdateOption" :disabled="!(editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT')))">
            </multiple-select>

            <!-- <el-select v-model="attrValue" :allow-create="allowCreate" :placeholder="placeholderText" @change="handleSelectChange"
                multiple :multiple-limit="30" filterable default-first-option size="medium" style="width: 400px">
                <el-option v-for="item in options" :key="item.attrId" :label="item.cn" :value="item.attrId">
                </el-option>
            </el-select> -->
            <el-table ref="dragTable" :data="tableDataList" row-key="attrId" fit highlight-current-row empty-text="未选择属性值"
                style="width: 100%; margin-top:16px;" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                <el-table-column label="属性ID" align="center"  width="70">
                    <template slot-scope="scope">
                        <span>{{ scope.row.attrId }}</span>
                    </template>
                </el-table-column>
                <el-table-column v-for="(item, index) in languageList" :key="index" :label="item.desc + item.code" width="150px" align="center" >
                   <template slot-scope="scope">
                        <span>{{ scope.row[item.code] || '-' }}</span>
                   </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="90">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="editType != 'edit' || (editType == 'edit' && hasPermission('BTN_OPERATION_EDIT'))"><i class="el-icon-s-operation"></i></el-button>
                        <el-button type="text" v-if="editType === 'check'" @click="removeItem(scope.$index, scope.row)"><i class="el-icon-close"></i></el-button>
                        <el-button type="text" v-if="editType != 'check' && scope.row.allowDel === true" @click="removeItem(scope.$index, scope.row)"><i class="el-icon-close"></i></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <!-- <el-button type="text" @click="handleClick"><i class="el-icon-s-operation"></i></el-button> -->
    </div>
</template>

<script>
    import _ from 'lodash'
    import Sortable from 'sortablejs'
    import { productAttrGetById } from '@/request/product'
    import MultipleSelect from './MultipleSelect'
    export default {
        // 规格属性
        name: 'StandardItem',
        props: {
            editType: {
                type: String,
                default: ''
            },
            standardInfo: {
               type: Object,
                default: function() {
                    return {}
                }
            },
            attrValueModel: {
               type: Array,
                default: function() {
                    return []
                }
            }
        },
        data() {
            return {
                productId: '',
                draftId: '',
                languageList: JSON.parse(this.getStore('languageList')),
                attrValue: this.attrValueModel,
                options: [],
                allowCreate: false,
                placeholderText: '请输入',
                tableDataList: [],
                sortable: null,
                oldList: [],
                newList: [],
                selectValue: [2],
                optionList: []
            }
        },
        components: {
            MultipleSelect
        },
        computed: {
            standardInfoData() {
                return this.standardInfo
            }
        },
        created() {
            if (this.$route.query.productId) {
                this.productId = this.$route.query.productId
            } else {
                this.productId = ''
            }
            if (this.$route.query.draftId) {
                this.draftId = this.$route.query.draftId
            } else {
                this.draftId = ''
            }
        },
        mounted() {
            // 拖动权限
            if (this.editType != 'edit' || (this.editType == 'edit' && this.hasPermission('BTN_OPERATION_EDIT'))) {
                this.setSort()
            }
            this.getProductAttrById(this.standardInfo.attrId)
            this.allowCreate = this.standardInfo.customize === 1 ? true : false
            this.placeholderText = this.standardInfo.customize === 1 ? '请选择或输入' : '请选择'

            if (this.attrValueModel.length > 0) {
                let tableDataListTemp = []
                // 延时渲染
                let deferTime = this.attrValueModel.length * 2500 > 6000 ? this.attrValueModel.length * 2500 : 6000
                // let deferTime = 0
                setTimeout(() => {
                    _.forEach(this.attrValueModel, attrValue => {
                        _.forEach(this.options , option => {
                            if (attrValue === option.attrId) {
                                if (this.editType != 'check') {
                                    option.allowDel = false
                                } else {
                                    option.allowDel = true
                                }
                                tableDataListTemp.push(option)
                            }
                        })
                    })
                    this.tableDataList = tableDataListTemp
                    console.log('standardInfo', this.standardInfo)
                    console.log('tableDataList', this.tableDataList)
                    let saleSpecInfo = {
                        standardInfo: this.standardInfo,
                        standardValueList: this.tableDataList
                    }
                    this.$emit('on-standard-change-index')
                    this.$emit('on-standard-update', saleSpecInfo)
                }, deferTime)
            }
        },
        watch:{
            'standardInfoData.attrId': function (newValue, oldValue) {
                this.getProductAttrById(newValue) // 解决删除任意规格时，重新获取属性值
            }
        },
        methods: {
            setSort() {
                const el = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
                this.sortable = Sortable.create(el, {
                    ghostClass: 'sortable-ghost',
                    setData: function(dataTransfer) {
                        dataTransfer.setData('Text', '')
                    },
                    onEnd: evt => {
                        const targetRow = this.tableDataList.splice(evt.oldIndex, 1)[0]
                        this.tableDataList.splice(evt.newIndex, 0, targetRow)
                        const tempIndex = this.newList.splice(evt.oldIndex, 1)[0]
                        this.newList.splice(evt.newIndex, 0, tempIndex)
                        console.log(this.newList)
                    }
                })
            },
            getProductAttrById(attrId) {
                let params = {
                    attrId: attrId,
                    productId: this.productId,
                    draftId: this.draftId,
                    attrType: 2,
                    filterHiddenAttrValue: false
                }
                productAttrGetById(this.filterData(params)).then((response) => {
                    if (response.ret.errcode === 1) {
                        let optionList = []
                        _.forEach(response.attrValue, (item) => {
                            let optionItem = {}
                            optionItem.attrId = item.valueId
                            _.forEach(item.valueName, (nameItem) => {
                                optionItem[nameItem.languageCode] = nameItem.name
                            })
                            // Todo 语言补全
                            optionList.push(optionItem)
                        })
                        _.forEach(optionList, option => {
                            if (_.indexOf(this.attrValue, option.attrId) != -1 && this.editType != 'check') {
                                option.disabled = true
                            } else {
                                option.disabled = false
                            }
                        })
                        this.options = optionList
                        console.log(optionList)
                        this.optionList = optionList
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            /**
             * 选择规格属性
            */
            handleSelectChange(data) {
                this.tableDataList = []
                _.forEach(data, (item) => {
                    _.forEach(this.options, (option) => {
                        if (item === option.attrId) {
                            if (!option.disabled) {
                                option.allowDel = true
                            }
                            this.tableDataList.push(option)
                        }
                    })
                })
                console.log(this.tableDataList)
                this.$emit('on-standard-change-index')
                this.$emit('on-standard-change', this.tableDataList)
                let saleSpecInfo = {
                    standardInfo: this.standardInfo,
                    standardValueList: this.tableDataList
                }
                this.$emit('on-standard-update', saleSpecInfo)

            },
            removeItem(index, item) {
                this.tableDataList.splice(index, 1)
                if (_.indexOf(this.attrValue, item.attrId) > -1) {
                    let old = _.cloneDeep(this.attrValue)
                    this.$delete(this.attrValue, _.indexOf(this.attrValue, item.attrId))
                    this.handleSelectChange(this.attrValue)
                    let diffItem = this.getArrDifference(old, this.attrValue)
                    this.$emit('on-attr-remove', diffItem)
                }
            },
            handleClick() {
                console.log(this.attrValueModel)
                console.log(this.standardInfo)
                console.log(this.tableDataList)
            },
            changeSelect(data) {
                let old = _.cloneDeep(this.attrValue)
                this.attrValue = data
                this.handleSelectChange(data)
                let diffItem = this.getArrDifference(old, this.attrValue)
                if (old.length > this.attrValue.length) {
                    this.$emit('on-attr-remove', diffItem)
                }
            },
            handleUpdateOption(data) {
                console.log(data)
                this.optionList.push(data)
                console.log(this.optionList)
            },
            // 取出两个数组的不同元素
            getArrDifference(arr1, arr2) {
                return arr1.concat(arr2).filter(function(v, i, arr) {
                  return arr.indexOf(v) === arr.lastIndexOf(v);
                });
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
