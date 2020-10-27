<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="workOrderFilterForm" inline label-width="100px" :model="params">
                <el-form-item label="关键字：">
                    <el-input placeholder="请输入关键字" size="medium" v-model="params.selectParam"></el-input>
                </el-form-item>
                <el-form-item label="创建日期：">
                    <el-date-picker type="daterange" value-format="timestamp"
                                    start-placeholder="时间起" end-placeholder="时间止"
                                    v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <span v-show="drop">
                    <el-form-item label="用户ID：">
                        <el-input placeholder="请输入用户ID" size="medium" v-model="params.userId"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：">
                        <el-input placeholder="请输入用户手机号" size="medium" v-model="params.userMobile"></el-input>
                    </el-form-item>
                    <el-form-item label="订单号：">
                        <el-input placeholder="请输入订单号" size="medium" v-model="params.orderNo"></el-input>
                    </el-form-item>
                    <el-form-item label="是否分派：">
                        <el-select v-model="params.doDispatch" clearable placeholder="请选择" size="medium">
                            <el-option v-for="(item, index) in dispatchMap"
                                       :key="index"
                                       :label="item.name"
                                       :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="创建人：">
                        <el-select v-model="params.createManagerId"
                                   :remote-method="getAdminUserList"
                                   placeholder="请选择" size="medium" clearable filterable remote>
                            <el-option v-for="(item, index) in adminUserList"
                                       :key="index"
                                       :label="item.realName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="当前处理人：">
                        <el-select v-model="params.currentDealManagerId"
                                   :remote-method="getAdminUserList"
                                   placeholder="请选择" size="medium" clearable filterable remote>
                            <el-option v-for="(item, index) in adminUserList"
                                       :key="index"
                                       :label="item.realName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="工单来源：">
                        <el-select v-model="params.workOrderSource" clearable filterable placeholder="请选择" size="medium">
                            <el-option v-for="(val, key) in sourceList"
                                       :key="key"
                                       :label="val"
                                       :value="key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="紧急程度：">
                        <el-select v-model="params.emergencyLevel" clearable placeholder="请选择" size="medium">
                            <el-option v-for="(item, index) in emergencyLevel"
                                       :key="index"
                                       :label="item.name"
                                       :value="item.key"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="历史处理人：">
                        <el-select v-model="params.historyDealManagerId"
                                   :remote-method="getAdminUserList"
                                   placeholder="请选择" size="medium" clearable filterable remote>
                            <el-option v-for="(item, index) in adminUserList"
                                       :key="index"
                                       :label="item.realName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="标签：">
                        <el-cascader v-model="params.tagId"
                                     @change="setTagId"
                                     :props="{ value: 'id', label: 'tagName', children: 'subTags'}"
                                     :options="tagList"></el-cascader>
                    </el-form-item>
                    <el-form-item label="工单状态：">
                        <el-select v-model="params.workOrderStatus" filterable clearable placeholder="请选择" size="medium">
                            <el-option v-for="(val, key) in WorkOrderStatusEnum"
                                       :key="key"
                                       :label="val"
                                       :value="key"></el-option>
                        </el-select>
                    </el-form-item>
                </span>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" size="medium" @click="getList(1)">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" size="medium" @click="resetSearch">重置</el-button>
                    <el-button icon="el-icon-download" type="primary" plain size="medium" @click="clickToExport">导出</el-button>
                    <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-table border height="100%" :data="dataList">
                <el-table-column prop="workOrderNo" label="工单ID" fixed="left" align="center" width="150px"></el-table-column>
                <el-table-column prop="createDate" align="center" label="创建时间" width="160px">
                    <template slot-scope="scope">
                        {{ scope.row.createDate | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column prop="userId" label="用户ID" align="center"></el-table-column>
                <el-table-column prop="userNickName" label="客户姓名" align="center"></el-table-column>
                <el-table-column prop="tagName" label="标签" align="center"></el-table-column>
                <el-table-column label="紧急程度" align="center">
                    <template slot-scope="scope">
                        {{ getNameByKey(scope.row.emergencyLevel, 'emergencyLevel') }}
                    </template>
                </el-table-column>
                <el-table-column prop="createManagerName" label="创建人" align="center"></el-table-column>
                <el-table-column prop="currentDealManagerName" label="当前处理人" align="center" min-width="100"></el-table-column>
                <el-table-column prop="" label="分配处理" align="center">
                    <template slot-scope="scope">
                        {{ getNameByKey(scope.row.doDispatch, 'dispatchMap') }}
                    </template>
                </el-table-column>
                <el-table-column label="工单状态" align="center">
                    <template slot-scope="scope">
                        {{ WorkOrderStatusEnum[scope.row.workOrderStatus] }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" min-width="100px">
                    <template slot-scope="scope">
                        <div class="table-action-btn-box">
                            <el-button plain type="success" size="mini"
                                       v-if="hasPermission('BTN_CREATED_WORD_ORDER_DEAL') && scope.row.workOrderStatus == 1 &&
                                        (scope.row.currentDealManagerId == userInfo.id || userInfo.account == 'admin')"
                                       @click="showWorkOrderDialog('dealDialog', scope.row)">处理工单
                            </el-button>
                            <el-button plain type="danger" size="mini"
                                       v-if="hasPermission('BTN_CREATED_WORD_ORDER_CLOSE') && scope.row.workOrderStatus == 2 &&
                                        (scope.row.currentDealManagerId == userInfo.id || userInfo.account == 'admin')"
                                       @click="showWorkOrderDialog('closeDialog', scope.row)">关闭工单
                            </el-button>
                            <el-button plain type="primary" size="mini"
                                       v-if="hasPermission('BTN_CREATED_WORD_ORDER_DETAIL')"
                                       @click="showWorkOrderDialog('detailDialog', scope.row)">查看详情
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="getList"
                           :current-page="params.page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="params.page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
        <!--关闭工单-->
        <close-work-order :showDialog="closeDialog.show"
                          :collapseArray="['2', '4']"
                          :workOrderNo="closeDialog.workOrderNo"
                          @close="closeWorkOrderDialog('closeDialog')"></close-work-order>
        <!--处理工单-->
        <deal-work-order :showDialog="dealDialog.show"
                         :collapseArray="['2', '4']"
                         :workOrderNo="dealDialog.workOrderNo"
                         @close="closeWorkOrderDialog('dealDialog')"></deal-work-order>
        <!--工单详情-->
        <work-order-detail :showDialog="detailDialog.show"
                           :collapseArray="['1', '2', '3']"
                           :workOrderNo="detailDialog.workOrderNo"
                           @close="closeWorkOrderDialog('detailDialog')"></work-order-detail>
    </div>
</template>
<script>
    import dealWorkOrder from '../components/dealWorkOrder'
    import workOrderDetail from '../components/workOrderDetail'
    import closeWorkOrder from '../components/closeWorkOrder'
    import {
        globalSearch,
        ValidTagList,
        exportByTimeSection
    } from '@/request/workOrder.js'
    import common from '../components/common'

    export default {
        mixins: [common],
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                totals: 0,
                timeList: [],
                params: {
                    selectParam: '',
                    userId: '',
                    userMobile: '',
                    emergencyLevel: '',
                    doDispatch: 1,
                    createManagerId: '',
                    currentDealManagerId: '',
                    ccManagerId: '',
                    workOrderSource: '',
                    historyDealManagerId: '',
                    tagId: '',
                    workOrderStatus: '',
                    orderNo: '',
                    page: {
                        pageSize: 10,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                },
                tagList: [],
                dataList: [],
                closeDialog: {
                    show: false,
                    workOrderNo: ''
                },
                detailDialog: {
                    show: false,
                    workOrderNo: ''
                },
                dealDialog: {
                    show: false,
                    workOrderNo: ''
                },
                userInfo: {
                    id: null,
                    account: ''
                }
            }
        },
        components: {
            dealWorkOrder,
            workOrderDetail,
            closeWorkOrder
        },
        computed: {
            nowEnd () {
                return this.$store.state.globalNum.nowEnd
            },
            lastMonth () {
                return this.$store.state.globalNum.lastMonth
            }
        },
        created () {
            this.timeList = [this.lastMonth, this.nowEnd]
            this.getList()
            this.getTagList()
            if (localStorage.adminUserInfo) {
                this.userInfo = JSON.parse(localStorage.adminUserInfo)
            }
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
            handleSizeChange (value) {
                this.params.page.pageSize = value
                this.getList(1)
            },
            getTagList () {
                ValidTagList({}).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.tagList = []
                        for (let i = 0; i < res.data.length; i++) {
                            let item = {
                                groupId: res.data[i].groupId,
                                id: res.data[i].id,
                                tagName: res.data[i].tagName,
                                subTags: []
                            }
                            for (let j = 0; j < res.data[i].subTags.length; j++) {
                                item.subTags.push({
                                    groupId: res.data[i].subTags[j].groupId,
                                    id: res.data[i].subTags[j].id,
                                    tagName: res.data[i].subTags[j].tagName
                                })
                            }
                            this.tagList.push(item)
                        }
                    }
                })
            },
            setTagId (idList) {
                if (idList.length > 0) {
                    this.params.tagId = parseInt(idList[1])
                }
            },
            getList (page) {
                this.params.page.pageNum = page ? page : this.params.page.pageNum
                this.timeList = this.timeList ? this.timeList : []
                globalSearch(this.filterData(Object.assign(this.params, {
                    startDate: !this.timeList[0] ? null : this.timeList[0],
                    endDate: !this.timeList[1] ? null : this.timeList[1]
                }))).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.dataList = res.data
                        this.totals = res.total
                    }
                })
            },
            closeWorkOrderDialog (type) {
                this[type].show = false
                this[type].workOrderNo = ''
                this.getList()
            },
            showWorkOrderDialog (type, data) {
                this[type].show = true
                this[type].workOrderNo = data.workOrderNo
            },
            resetSearch () {
                this.params = {
                    selectParam: '',
                    userId: '',
                    userMobile: '',
                    emergencyLevel: '',
                    doDispatch: '',
                    createManagerId: '',
                    currentDealManagerId: '',
                    ccManagerId: '',
                    workOrderSource: '',
                    historyDealManagerId: '',
                    tagId: '',
                    workOrderStatus: '',
                    orderNo: '',
                    page: {
                        pageSize: 10,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                }
                this.timeList = []
            },
            clickToExport () {
                if (!this.timeList || this.timeList.length !== 2) {
                    this.$message({
                        type: 'warning',
                        message: '请选择导出日期范围'
                    })
                    return
                }
                exportByTimeSection(this.filterData(Object.assign(this.params, {
                    startDate: !this.timeList[0] ? null : this.timeList[0],
                    endDate: !this.timeList[1] ? null : this.timeList[1]
                }))).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        let a = document.createElement('a')
                        a.src = this.dealShowFileSrc(res.fileUrl)
                        a.href = this.dealShowFileSrc(res.fileUrl)
                        a.click()
                    }
                })
            }
        }
    }
</script>
