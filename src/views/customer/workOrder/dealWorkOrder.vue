<template>
    <div class="app-container">
        <el-tabs v-model="activeName" type="card" @tab-click="getList(1)">
            <el-tab-pane label="待处理" name="1"></el-tab-pane>
            <el-tab-pane label="已处理" name="2">
                <el-form inline label-width="90px">
                    <el-form-item label="关键字：">
                        <el-input placeholder="请输入关键字" size="medium" v-model="param.selectParam"></el-input>
                    </el-form-item>
                    <el-form-item label="用户ID：">
                        <el-input placeholder="请输入用户ID" size="medium" v-model="param.userId"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：">
                        <el-input placeholder="请输入用户手机号" size="medium" v-model="param.userMobile"></el-input>
                    </el-form-item>
                    <span v-show="drop2">
                        <el-form-item label="处理日期：">
                            <el-date-picker type="daterange" value-format="timestamp"
                                            start-placeholder="时间起" end-placeholder="时间止"
                                            v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                    </span>
                    <el-form-item class="filter-item" style="margin-left: 20px">
                        <el-button icon="el-icon-search" type="primary" size="medium"
                                    @click="getList(1)">搜索
                        </el-button>
                        <el-button icon="el-icon-refresh-left" size="medium"
                                    @click="resetSearch">重置
                        </el-button>
                        <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown('drop2')">
                            {{drop2 ? '收起' : '展开'}}
                            <i :class="drop2 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                        </el-link>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="被抄送" name="3">
                <el-form inline label-width="90px">
                    <el-form-item label="关键字：">
                        <el-input placeholder="请输入关键字" size="medium" v-model="param.selectParam"></el-input>
                    </el-form-item>
                    <el-form-item label="用户ID：">
                        <el-input placeholder="请输入用户ID" size="medium" v-model="param.userId"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：">
                        <el-input placeholder="请输入用户手机号" size="medium" v-model="param.userMobile"></el-input>
                    </el-form-item>
                    <span v-show="drop3">
                        <el-form-item label="抄送日期：">
                            <el-date-picker type="daterange" value-format="timestamp"
                                            start-placeholder="时间起" end-placeholder="时间止"
                                            v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                    </span>
                    <el-form-item class="filter-item" style="margin-left: 20px">
                        <el-button icon="el-icon-search" type="primary" size="medium"
                                    @click="getList(1)">搜索
                        </el-button>
                        <el-button icon="el-icon-refresh-left" size="medium"
                                    @click="resetSearch">重置
                        </el-button>
                        <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown('drop3')">
                            {{drop3 ? '收起' : '展开'}}
                            <i :class="drop3 ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                        </el-link>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <div class="main-content-wrapper">
            <el-table border height="100%" :data="dataList">
                <el-table-column prop="workOrderNo" label="工单ID" fixed="left" align="center" min-width="180px"></el-table-column>
                <template v-if="activeName == 1">
                    <el-table-column prop="createDate" label="收到时间" min-width="180px">
                        <template slot-scope="scope">
                            {{ scope.row.createDate | formatTime}}
                        </template>
                    </el-table-column>
                </template>
                <template v-else>
                    <el-table-column prop="createDate" label="处理时间" min-width="180px">
                        <template slot-scope="scope">
                            {{ scope.row.createDate | formatTime}}
                        </template>
                    </el-table-column>
                </template>
                <el-table-column prop="userId" label="用户ID"></el-table-column>
                <el-table-column prop="userNickName" label="客户姓名"></el-table-column>
                <el-table-column prop="tagName" min-width="120px" label="标签"></el-table-column>
                <el-table-column label="紧急程度">
                    <template slot-scope="scope">
                        {{ emergencyLevel[scope.row.emergencyLevel] }}
                    </template>
                </el-table-column>
                <el-table-column prop="createManagerName" label="创建人"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right" min-width="100px">
                    <template slot-scope="scope">
                        <el-button plain type="success" size="mini"
                                   v-if="hasPermission('BTN_CREATED_WORD_ORDER_DEAL') && activeName == 1"
                                   @click="showWorkOrderDialog('dealDialog', scope.row)">处理工单
                        </el-button>
                        <el-button plain type="primary" size="mini"
                                   v-if="hasPermission('BTN_CREATED_WORD_ORDER_DETAIL') && activeName != 1"
                                   @click="showWorkOrderDialog('detailDialog', scope.row)">查看详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="getList"
                           :current-page="param.page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="param.page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
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
    import { globalSearch } from '@/request/workOrder.js'

    export default {
        data () {
            return {
                drop2: false,
                drop3: false,
                activeName: '1',
                totals: 0,
                param: {
                    selectParam: '',
                    userId: '',
                    userMobile: '',
                    page: {
                        pageSize: 10,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                },
                timeList: [],
                dataList: [],
                emergencyLevel: {
                    1: '紧急',
                    2: '一般'
                },
                dispatchMap: {
                    1: '分派',
                    2: '不分派'
                },
                dealDialog: {
                    show: false,
                    workOrderNo: ''
                },
                detailDialog: {
                    show: false,
                    workOrderNo: ''
                }
            }
        },
        components: {
            dealWorkOrder,
            workOrderDetail
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
        },
        methods: {
            dropDown (type) {
                this[type] = !this[type]
            },
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList()
            },
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                this.timeList = this.timeList ? this.timeList : []
                let userInfo = null
                if (localStorage.adminUserInfo) {
                    userInfo = JSON.parse(localStorage.adminUserInfo)
                }
                globalSearch(this.filterData(Object.assign(this.param, {
                    currentDealManagerId: (userInfo && this.activeName == 1) ? userInfo.id : null,
                    historyDealManagerId: (userInfo && this.activeName == 2) ? userInfo.id : null,
                    ccManagerId: (userInfo && this.activeName == 3) ? userInfo.id : null,
                    workOrderStatus: this.activeName == 1 ? parseInt(this.activeName) : null,
                    startDate: !this.timeList[0] ? null : this.timeList[0],
                    endDate: !this.timeList[1] ? null : this.timeList[1],
                    orderDateType: 2,
                    selectDataType: 0
                }))).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
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
                this.param = {
                    selectParam: '',
                    userId: '',
                    userMobile: '',
                    page: {
                        pageSize: 10,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                }
            }
        }
    }
</script>
