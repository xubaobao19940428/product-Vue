<template>
    <div class="app-container">
        <el-tabs v-model="activeName" @tab-click="switchTab" type="card">
            <el-tab-pane label="未解决" name="1">
                <el-button icon="el-icon-plus" type="primary" size="medium"
                           class="mar-b-10"
                           v-if="hasPermission('BTN_CREATED_WORD_ORDER_ADD')"
                           @click="addDialog.show = true">新建工单
                </el-button>
            </el-tab-pane>
            <el-tab-pane label="待关闭" name="2"></el-tab-pane>
            <el-tab-pane label="已关闭" name="3">
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
                    <span v-show="closeDrop">
                        <el-form-item label="关闭日期：">
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
                        <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown('closeDrop')">
                            {{closeDrop ? '收起' : '展开'}}
                            <i :class="closeDrop ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
                        </el-link>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="不分派任务" name="4">
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
                    <span v-show="drop">
                        <el-form-item label="关闭日期：">
                            <el-date-picker type="daterange" value-format="timestamp"
                                            start-placeholder="时间起" end-placeholder="时间止"
                                            v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                    </span>
                    <el-form-item class="filter-item" style="margin-left: 20px;">
                        <el-button icon="el-icon-search" type="primary" size="medium"
                                    @click="getList(1)">搜索
                        </el-button>
                        <el-button icon="el-icon-refresh-left" size="medium"
                                    @click="resetSearch">重置
                        </el-button>
                        <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown('drop')">
                            {{dropDownContent}}
                            <i :class="dropDownIcon"></i>
                        </el-link>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
        <div class="main-content-wrapper">
            <el-table border height="100%" :data="dataList">
                <el-table-column prop="workOrderNo" label="工单ID" fixed="left" align="center" min-width="150px"></el-table-column>
                <template v-if="activeName == 3">
                    <el-table-column prop="createDate" label="关闭时间" min-width="180px">
                        <template slot-scope="scope">
                            {{ scope.row.createDate | formatTime}}
                        </template>
                    </el-table-column>
                </template>
                <template v-else>
                    <el-table-column prop="createDate" label="创建时间" min-width="180px">
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
                        {{ getNameByKey(scope.row.emergencyLevel, 'emergencyLevel') }}
                    </template>
                </el-table-column>
                <el-table-column prop="createManagerName" label="创建人"></el-table-column>
                <el-table-column label="操作" align="center" fixed="right" min-width="120px">
                    <template slot-scope="scope">
                        <el-button plain type="primary" size="danger"
                                   v-if="hasPermission('BTN_CREATED_WORD_ORDER_CLOSE') && activeName == 2"
                                   @click="showWorkOrderDialog('closeDialog', scope.row)">关闭工单</el-button>
                        <el-button plain type="primary" size="mini"
                                   v-if="hasPermission('BTN_CREATED_WORD_ORDER_DETAIL') && (activeName == 1 || activeName == 3 || activeName == 4)"
                                   @click="showWorkOrderDialog('detailDialog', scope.row)">查看详情</el-button>
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
        <!--新建工单-->
        <work-order-edit :showDialog="addDialog.show"
                         @confirm="confirmAddWorkOrder"
                         @close="addDialog.show = false"></work-order-edit>
        <!--关闭工单-->
        <close-work-order :showDialog="closeDialog.show"
                          :collapseArray="['2', '4']"
                          :workOrderNo="closeDialog.workOrderNo"
                          @close="closeWorkOrderDialog('closeDialog')"></close-work-order>
        <!--工单详情-->
        <work-order-detail :showDialog="detailDialog.show"
                           :collapseArray="['1', '2', '3']"
                           :workOrderNo="detailDialog.workOrderNo"
                           @close="closeWorkOrderDialog('detailDialog')"></work-order-detail>
    </div>
</template>
<script>
    import closeWorkOrder from '../components/closeWorkOrder'
    import workOrderDetail from '../components/workOrderDetail'
    import workOrderEdit from '../components/workOrderEdit'
    import common from '../components/common'
    import { globalSearch } from '@/request/workOrder.js'

    export default {
        data () {
            return {
                drop: false,
                closeDrop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
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
                addDialog: {
                    show: false
                },
                closeDialog: {
                    show: false,
                    workOrderNo: ''
                },
                detailDialog: {
                    show: false,
                    workOrderNo: ''
                }
            }
        },
        mixins: [common],
        components: {
            closeWorkOrder,
            workOrderDetail,
            workOrderEdit
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
                if (type === 'drop') {
                    if (this.drop) {
                        this.dropDownContent = '展开'
                        this.dropDownIcon = 'el-icon-arrow-down'
                    } else {
                        this.dropDownContent = '收起'
                        this.dropDownIcon = 'el-icon-arrow-up'
                    }
                }
                this[type] = !this[type]
            },
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList()
            },
            switchTab () {
                this.getList(1)
            },
            getList (page) {
                this.param.page.pageNum = page ? page : this.param.page.pageNum
                this.timeList = this.timeList ? this.timeList : []
                let userInfo = null
                if (localStorage.adminUserInfo) {
                    userInfo = JSON.parse(localStorage.adminUserInfo)
                }
                globalSearch(this.filterData(Object.assign(this.param, {
                    doDispatch: this.activeName != 4 ? 1 : 2,
                    createManagerId: userInfo ? userInfo.id : null,
                    workOrderStatus: this.activeName == 4 ? null : parseInt(this.activeName),
                    startDate: !this.timeList[0] ? null : this.timeList[0],
                    endDate: !this.timeList[1] ? null : this.timeList[1],
                    orderDateType: 0,
                    selectDateType: this.activeName == 3 ? 3 : 0
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
            confirmAddWorkOrder () {
                this.addDialog.show = false
                this.getList()
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
                this.timeList = []
            }
        }
    }
</script>
