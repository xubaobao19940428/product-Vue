<template>
    <div class="presale-sku-table">
        <div >
            <div class="sync-options">
                <el-button v-if="presaleStatusVal < 3" :disabled="tableDataList.length <= 0" type="primary" size="mini" plain @click="syncColumnData">同步该列</el-button>
            </div>
            <div class="sync-option-wrapper">
                <div class="param-item-wrapper left" style="width: 250px">
                </div>
                <div class="right">
                    <div class="param-item-wrapper" v-for="(item, index) in saleSpecInfoList" :key="index">
                        <el-select v-model="syncTempData['attr'+item.standardInfo.attrId]" clearable placeholder="请选择" size="mini">
                            <el-option v-for="item in item.standardValueList" :key="item.saleWay" :label="item.valueName" :value="item.attrId"></el-option>
                        </el-select>
                    </div>
                    <el-select v-model="syncTempData.advanceType" clearable placeholder="请选择" size="mini" class="param-item-wrapper">
                        <el-option v-for="item in advanceTypeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input v-model="syncTempData.advanceStock" clearable placeholder="预售库存" size="mini" class="param-item-wrapper">
                    </el-input>
                </div>
            </div>
        </div>
        <el-table :data="tableDataList" border :header-cell-style="{background:'#F5F7FA',color:'#606266'}"  :style="{width: tableWidth + 'px'}">
            <el-table-column label="skuCode" width="130" align="center" prop="skuCode">
            </el-table-column>
            <el-table-column label="skuId" width="120" align="center" prop="skuId">
            </el-table-column>
            <el-table-column v-for="(item, index) in saleSpecType" :key="index" :prop="item.attrId" :label="item.attrName" width="120" align="center">
            </el-table-column>
            <el-table-column label="是否预售" width="120" align="center">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.advanceType" :disabled="presaleStatusVal === 3 && editType != 'add'" placeholder="请选择" size="mini">
                        <el-option v-for="item in advanceTypeList" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="预售库存" width="120" align="center">
                <template slot="header">
                    预售库存
                    <el-tooltip class="item" effect="dark" content="预售商品在预售期间的可售库存完全由预售库存决定（与虚拟库存、仓库库存均无关），当预售库存售完，商品呈现无货状态不可再被购买" placement="top">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </template>
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.advanceStock" :disabled="presaleStatusVal === 3 && editType != 'add'" :controls="false" :min="0" size="mini" style="width: 90%">
                    </el-input-number>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        // 预售库存
        name: 'PresaleStockTable',
        props: {
            tableData: {
                type: Array,
                default: () => []
            },
            presaleStatus: {
                type: Number,
                default: 1
            },
            editType: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                tableWidth: 480,
                advanceTypeList: [
                    {
                        value: 1,
                        label: '预售'
                    }, {
                        value: 2,
                        label: '不预售'
                    }
                ],
                saleSpecType: [],
                syncTempData: {
                    advanceType: '',
                    advanceStock: null
                },
                saleSpecInfoList: []
            }
        },
        computed: {
            tableDataList: {
                get: function() {
                    this.saleSpecType = []
                    this.saleSpecInfoList = []
                    this.syncTempData = {
                        advanceType: '',
                        advanceStock: null
                    }
                    if (this.tableData[0]) {
                        _.forEach(this.tableData[0].skuValue, item => {
                            this.saleSpecType.push(item)
                            let saleSpecInfoItem = {
                                standardInfo: null,
                                standardValueList: []
                            }
                            saleSpecInfoItem.standardInfo = {
                                attrId: item.attrId,
                                attrName: item.attrName
                            }
                            this.saleSpecInfoList.push(saleSpecInfoItem)
                        })
                        if (this.tableData[0].skuValue.length === 1) {
                            this.tableWidth = 610
                        } else if (this.tableData[0].skuValue.length > 1) {
                            this.tableWidth = 730
                        } else {
                            this.tableWidth = 480
                        }
                    }
                    _.forEach(this.tableData, rowItem => {
                        _.forEach(rowItem.skuValue, (skuValueItem, index)=> {
                            rowItem[skuValueItem.attrId] = skuValueItem.valueName
                            rowItem[skuValueItem.attrId+ '_value'] = skuValueItem.valueId
                            let standardValueItem = {
                                attrId: skuValueItem.valueId,
                                valueName: skuValueItem.valueName
                            }
                            // 判断是否已存在规格值
                            let flag = false
                            _.forEach(this.saleSpecInfoList[index]['standardValueList'], item => {
                                if (skuValueItem.valueId === item.attrId) {
                                    flag = true
                                }
                            })
                            if (!flag) {
                                this.saleSpecInfoList[index]['standardValueList'].push(standardValueItem)
                            }
                        })
                    })
                    console.log(this.saleSpecInfoList)
                    return this.tableData;
                },
                set: function() {}
            },
            presaleStatusVal() {
                return this.presaleStatus
            }
        },
        methods: {
            getTableDataList() {
                return this.tableDataList
            },
            syncColumnData() {
                console.log(this.syncTempData)
                console.log(this.tableDataList)

                let filterCondition = {} // 过滤条件
                let filterList = []
                _.forEach(this.syncTempData , (value, key) => {
                    if (key.indexOf('attr') != -1) {
                        filterCondition[key.substring(4)+'_value'] = value
                    }
                })

                let commonData = this.filterData(this.syncTempData)
                commonData = _.pick(commonData, ['advanceType', 'advanceStock'])
                _.forEach(commonData, (value, key) => {
                    _.forEach(this.tableDataList, row => {
                        if (this.isSameSku(row, this.filterData(filterCondition))) {
                            this.$set(row, key, value)
                        }
                    })
                })
                let partCommonData = _.pick(commonData, ['advanceType', 'advanceStock'])
                _.forEach(this.filterData(partCommonData), (value, key) => {
                    _.forEach(this.tableDataList, row => {
                        if (this.isSameSku(row, this.filterData(filterCondition))) {
                            this.$set(row, key, value)
                        }
                    })
                })
                this.$message.success('一键同步完成！')
            },
            isSameSku (row, filterCondition) {
                let flag  = true
                _.forEach(filterCondition, (value, key) => {
                    if (row[key]) {
                        if (row[key] != value) {
                            flag = false
                        }
                    } else {
                        flag  = false
                    }
                })
                return flag
            },
            reset() {
                this.tableWidth = 480
            }
        }
    }
</script>

<style lang="scss" scoped>
    .presale-sku-table {
        .sync-option-wrapper {
            display: flex;
            .left {
                width: 250px;
            }
            .right {
                flex: 1;
                white-space: nowrap;
                overflow-x: auto;
            }
        }
        .sync-options {
            display: flex;
            justify-content: flex-end;
        }
        .param-item-wrapper {
            display: inline-block;
            padding: 0 10px;
            width: 120px;
        }
    }

</style>
