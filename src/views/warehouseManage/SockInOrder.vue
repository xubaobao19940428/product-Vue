<template>
    <div class="app-container forward-receive-wrapper">
        <el-tabs v-model="activeName" @tab-click="handleTabClick" type="card">
            <el-tab-pane label="未入库" name="unSockIn"></el-tab-pane>
            <el-tab-pane label="已入库" name="sockIn"></el-tab-pane>
        </el-tabs>
        <el-form ref="sockInFilterForm" inline :model="queryData">
            <el-form-item label="物流单号：" class="filter-item" prop="logiCode">
                <el-input v-model="queryData.logiCode" clearable placeholder="请输入物流单号" size="medium" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="skuCode：" class="filter-item" prop="skuCode">
                <el-input v-model="queryData.skuCode" clearable placeholder="商品skuCode" size="medium" @keyup.enter.native="search" ></el-input>
            </el-form-item>
            <el-form-item label="签收状态：" class="filter-item" prop="signStatus">
                <el-select v-model="queryData.signStatus" clearable size="medium" @change="search">
                    <el-option v-for="item in signStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <span v-show="drop">
                <el-form-item label="创建时间：" class="filter-item" prop="timeList">
                    <el-date-picker
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="queryData.timeList"
                        type="daterange"
                        size="medium"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
              </span>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                    {{dropDownContent}}
                    <i :class="dropDownIcon"></i>
                </el-link>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-table  v-loading="loading" border height="100%" :span-method="arraySpanMethod" :data="dataList" style="width: 100%" >
                <el-table-column prop="logiCode" min-width="150px" align="center" fixed="left" label="物流单号">
                </el-table-column>
                <el-table-column label="签收状态" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.signStatus === 1" type="success" size="mini">已签收</el-tag>
                        <el-tag v-if="scope.row.signStatus === 2" size="mini">未签收</el-tag>
                    </template>
                </el-table-column>
            <el-table-column prop="nameCn" min-width="120px" align="center" label="商品名称">
            </el-table-column>
            <el-table-column label="商品图片" align="center" min-width="120px">
                <template slot-scope="scope">
                    <el-popover placement="top-start" trigger="hover">
                        <img :src="dealShowFileSrc(scope.row.skuCover)" class="previewImage">
                        <img :src="dealShowFileSrc(scope.row.skuCover)" class="thumbnail" slot="reference">
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column prop="skuCode" min-width="180px" align="center" label="skuCode">
                <template slot-scope="scope">
                    <div class="point blue" @click="triggerToPrint(scope.row.skuCode)"> {{ scope.row.skuCode }}</div>
                </template>
            </el-table-column>
            <el-table-column prop="standardAttr" min-width="180px" align="center" label="sku规格">
            </el-table-column>
            <el-table-column prop="totalCount" align="center" label="预期数量">
            </el-table-column>
            <el-table-column prop="incomeCount" align="center" label="实际数量">
            </el-table-column>
            <el-table-column prop="abnormalCount" label="异常数量" align="center">
            </el-table-column>
            <el-table-column prop="remark" label="入库备注" align="center" min-width="120px">
                <template slot-scope="scope">
                    {{ scope.row.remark || '-' }}
                </template>
            </el-table-column>
            <el-table-column prop="createTime" min-width="180px" align="center" label="创建时间">
                <template slot-scope="scope">
                    {{ scope.row.createTime | secondTimeFormat}}
                </template>
            </el-table-column>
            <el-table-column prop="signTime" min-width="180px" align="center" label="签收时间">
                <template slot-scope="scope">
                    {{ scope.row.signTime | secondTimeFormat}}
                </template>
            </el-table-column>
            <el-table-column prop="incomeTime" min-width="180px" align="center" label="入库时间">
                <template slot-scope="scope">
                    {{ scope.row.incomeTime | secondTimeFormat}}
                </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" min-width="150px">
                <template slot-scope="scope">
                    <div class="order-btn-box">
                        <!-- Todo-->
                        <!-- <el-button plain type="primary" size="mini" v-if="hasPermission('BTN_WAREHOUSE_TRANS_FORWARDER_RECEIVE_CONFIRM') && (scope.row.signStatus == '1' && -->
                            <el-button plain type="primary" size="mini" v-if="(scope.row.signStatus == 1 &&
                                scope.row.incomeStatus == 2 && hasPermission('MENU_WAREHOUSE_CONFIRM_STORAGE'))" @click="showConfirmReceiveDialog(scope.row)">确认入库
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination
        @size-change="handleSizeChanges"
        @current-change="handleCurrentChanges"
        :current-page="queryData.page.pageNum"
        :page-size="queryData.page.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        :total="totals">
      </el-pagination>
    </div>
    <!--确认入库-->
    <confirm-sock-in-dialog :dialogVisible="sockInDialogVisible" :sockInData="sockInData"
        @on-cancle="handleCancleSockIn" @on-confirm="handleConfirmSockIn">
    </confirm-sock-in-dialog>
</div>
</template>

<script>
    import _ from 'lodash'
    import { incomeOrderPage ,orderIncome, signAbnormalType } from '@/request/warehouse'
    import ConfirmSockInDialog from './components/ConfirmSockInDialog'
    import {
        arrayToString,
        stringToArray
    } from '@/js/common/filter'
    export default {
        data() {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                activeName: 'unSockIn',
                signAbnormalTypeList: [],
                incomeStatus: 2,
                queryData: {
                    logiCode: '',
                    skuCode: '',
                    incomeStatus: 2,
                    signStatus: null,
                    timeList: [],
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                totals: 0,
                loading: false,
                sockInDialogVisible: false,
                sockInData: {},
                page: 1,
                pageSize: 10,
                pagingSwitch: true,
                total: 0,
                timeList: [],
                statusListMap: {
                    1: '已入库',
                    2: '未入库'
                },
                signStatusList: [
                    {
                        value: 1,
                        label: '已签收'
                    }, {
                        value: 2,
                        label: '未签收'
                    }
                ],
                dataList: [],
            }
        },
        components: {
            ConfirmSockInDialog
        },
        created() {
            this.getSignAbnormalTypeList()
            this.getIncomeOrderList()
        },
        methods: {
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
            getSignAbnormalTypeList() {
                signAbnormalType().then((res) => {
                    if (res.ret.errcode === 1) {
                        this.signAbnormalTypeList = res.type
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            /**
             *获取入库订单列表
            */
            getIncomeOrderList() {
                this.loading = true
                let params = this.queryData
                this.queryData.timeList = this.queryData.timeList || []
                params.startTime = this.queryData.timeList[0]
                params.endTime = this.queryData.timeList[1]
                incomeOrderPage(this.filterData(params)).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        let incomeList = []
                        incomeList = res.list
                        let data = []
                        for (let i = 0; i < incomeList.length; i++) {
                            let item = incomeList[i]
                            for (let j = 0; j < item.sku.length; j++) {
                                if (j == 0) {
                                    Object.assign(item.sku[j], {
                                        rowspan: item.sku.length
                                    })
                                }
                                Object.assign(item.sku[j], {
                                    incomeTime: item.incomeTime,
                                    logiCode: item.logiCode,
                                    createTime: item.createTime,
                                    signTime: item.signTime,
                                    signStatus: item.signStatus,
                                    incomeStatus: item.incomeStatus,
                                    sourceList: incomeList[i]
                                })
                                data.push(item.sku[j])
                            }
                        }
                        this.dataList = data
                        console.log(this.dataList)
                        this.totals = res.total
                    }
                    console.log(res)
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            search() {
                this.getIncomeOrderList()
            },
            // 分页
            handleSizeChange(val) {
                this.queryData.page.pageSize = val
                this.getIncomeOrderList()
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getIncomeOrderList()
            },
            handleTabClick(tab) {
                if (tab.name === 'unSockIn') {
                    this.incomeStatus = 2
                } else {
                    this.incomeStatus = 1
                }
                this.$refs.sockInFilterForm.resetFields()
                this.queryData.incomeStatus = this.incomeStatus
                this.getIncomeOrderList()
            },
            arraySpanMethod({
                row,
                column,
                rowIndex,
                columnIndex
            }) {
                let activeColumn = [0, 1, 10, 11, 12, 13, 14, 15]
                let item = activeColumn.find((val) => {
                    return val == columnIndex
                })
                if (item || columnIndex == 0) {
                    if (row.rowspan) {
                        return {
                            rowspan: row.rowspan,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            },
            triggerToPrint(productCode) {
                this.$router.push({
                    name: 'printPage',
                    query: {
                        productCode: productCode
                    }
                })
            },
            showConfirmReceiveDialog(data) {
                console.log(data)
                let scokInSkuList = []
                let sourceList = data.sourceList
                _.forEach(sourceList.sku, item => {
                    let skuItem = {}
                    skuItem.skuCode = item.skuCode
                    skuItem.standardAttr = item.standardAttr
                    skuItem.skuCover = item.skuCover
                    skuItem.totalCount = item.totalCount
                    skuItem.count = 0
                    skuItem.nameCn = item.nameCn
                    skuItem.abnormalType = null
                    skuItem.abnormalCount = 0
                    skuItem.remark = item.remark
                    scokInSkuList.push(skuItem)
                })
                this.sockInData = {
                    logiCode: sourceList.logiCode,
                    orderNo: sourceList.orderNo,
                    scokInSkuList: scokInSkuList
                }
                this.sockInDialogVisible = true
            },
            // 确认入库响应函数
            confirmReceive() {
                for (let i = 0; i < this.dialog.param.skuList.length; i++) {
                    if (this.dialog.param.skuList[i].abnormalCount > 0 && !this.dialog.param.skuList[i].abnormalType) {
                        return this.$message.warning('异常类型不能为空')
                    }
                    //对于确认入库商品数量进行限制
                    if (this.dialog.param.skuList[i].abnormalCount == 0) {
                        if (this.dialog.param.skuList[i].count != this.dialog.param.skuList[i].shipCount) {
                            return this.$message.warning('填写异常，若无异常数量，商品实际数量必须等于商品预期数量')
                        }
                    } else {
                        if (this.dialog.param.skuList[i].abnormalCount + this.dialog.param.skuList[i].count < this.dialog.param.skuList[i].shipCount) {
                            return this.$message.warning('填写异常，若有异常数量，异常数量加实际数量必须大于等于商品预期数量')
                        }
                    }
                }
                receiptOrderIncome(this.dialog.param).then((res) => {
                    if (res.code == 200) {
                        this.$message.success('入库成功')
                        this.getIncomeOrderList()
                        this.dialog.show = false
                    }
                })
            },
            handleSizeChanges(val) {
                this.queryData.page.pageSize = val
                this.getIncomeOrderList()
            },
            handleCurrentChanges(val, type) {
                this.queryData.page.pageNum = val
                this.getIncomeOrderList()
            },
            resetSearch() {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.$refs.sockInFilterForm.resetFields()
                this.getIncomeOrderList()
            },
            handleUploaderRemove(file, fileList, key, i) {
                let mappedFileList = fileList.map((mappingfile) => {
                    if (mappingfile.response !== undefined) {
                        mappingfile.url = mappingfile.response.data
                    }
                    return mappingfile
                })
                this.dialog.imgList[i] = mappedFileList
                this.dialog.param.skuList[i][key] = arrayToString(mappedFileList)
            },
            handleUploadSuccess(response, file, fileList, key, i) {
                if (response.data) {
                    console.log(fileList)
                    let mappedFileList = fileList.map((mappingfile) => {
                        if (mappingfile.response !== undefined) {
                            mappingfile.url = mappingfile.response.data
                        }
                        return mappingfile
                    })
                    this.dialog.imgList[i] = mappedFileList
                    this.dialog.param.skuList[i][key] = arrayToString(mappedFileList)
                } else {
                    let itemI = fileList.find((item) => {
                        return item == file
                    })
                    if (itemI != -1) {
                        fileList.splice(itemI, 1)
                    }
                }
            },
            handleCancleSockIn() {
                this.sockInDialogVisible = false
            },
            handleConfirmSockIn(scokInData) {
                let params = {
                    logiCode: scokInData.logiCode,
                    sku: scokInData.scokInSkuList
                }
                orderIncome(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.sockInDialogVisible = false
                        this.$message.success('确认入库成功！')
                        this.getIncomeOrderList()
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss">
    .forward-receive-wrapper {
        .el-form-item {
            margin-bottom: 10px;
        }
    }
    .box-card {
        margin-bottom: 10px;
    }
</style>
