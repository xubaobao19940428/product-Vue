<template>
    <div class="app-container">
        <div class="main-content-tab-box">
            <div class="tab-l">
                <el-tabs v-model="activeName" @tab-click="getList(1)">
                    <el-tab-pane label="全部订单" name="-1"></el-tab-pane>
                    <el-tab-pane v-for="(item, key) in orderStatusEnum" :key="key" :label="item" :name="key"></el-tab-pane>
                </el-tabs>
                <!-- <el-button :class="['search-btn', 'mar-l-10', showSearchParam ? 'active' : '']" icon="el-icon-search" size="small"
                           @click="showSearchParam = !showSearchParam">搜索</el-button> -->
            </div>
        </div>
        <el-collapse-transition>
            <!-- <div class="order-search-param" v-if="showSearchParam" style="margin-bottom: 16px"> -->
                <el-form inline label-width="100px">
                    <el-form-item label="订单编号：">
                        <el-input placeholder="支持查询父订单和子订单编号" size="medium" v-model="param.id" style="width: 220px"></el-input>
                    </el-form-item>
                    <el-form-item label="时间查询：">
                        <div class="flex">
                            <el-select v-model="param.timeType" clearable placeholder="请选择" size="medium" style="width: 110px">
                                <el-option v-for="(val, key) in timeTypeEnum"
                                           :key="key"
                                           :label="val"
                                           :value="key"></el-option>
                            </el-select>
                            <el-date-picker type="daterange" value-format="timestamp"
                                            style="width: 252px"
                                            start-placeholder="开始时间" end-placeholder="结束时间"
                                            v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </div>
                    </el-form-item>
                    <span v-show="drop">
                        <el-form-item label="订单类型：">
                            <el-select v-model="param.orderType" multiple clearable placeholder="请选择" size="medium">
                                <el-option v-for="(item, key) in orderTypeEnum"
                                        :key="key"
                                        :label="item"
                                        :value="key"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发货方式：">
                            <el-select v-model="param.deliveryWay" clearable placeholder="发货方式" size="medium">
                                <el-option v-for="item in deliveryWayOption" :key="item.deliveryWay" :label="item.name" :value="item.deliveryWay"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商品：">
                            <div class="flex">
                                <el-select v-model="selectProductType" clearable placeholder="请选择" size="medium" style="width: 150px">
                                    <el-option v-for="(val, key) in selectProductTypeEnum"
                                            :key="key"
                                            :label="val"
                                            :value="key"></el-option>
                                </el-select>
                                <el-input v-if="selectProductType == 0" placeholder="请输入" size="medium" v-model="param.productName"></el-input>
                                <el-input v-if="selectProductType == 1" placeholder="请输入" size="medium" v-model="param.productId"></el-input>
                                <el-input v-if="selectProductType == 2" placeholder="请输入" size="medium" v-model="param.skuId"></el-input>
                            </div>
                        </el-form-item>

                        <el-form-item label="销售国家：">
                            <el-select v-model="param.countryCode" clearable placeholder="请选择" size="medium">
                                <el-option v-for="(item, index) in countryList"
                                        :key="index"
                                        :label="item.nameEn + '/' + item.nameCn "
                                        :value="item.shortCode"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="用户：">
                            <div class="flex">
                                <el-select v-model="selectUserType" clearable placeholder="请选择" size="medium" style="width: 140px">
                                    <el-option v-for="(val, key) in selectUserTypeEnum"
                                            :key="key"
                                            :label="val"
                                            :value="key"></el-option>
                                </el-select>
                                <el-input v-if="selectUserType == 0" placeholder="请输入" size="medium" v-model="param.userId"></el-input>
                                <el-input v-if="selectUserType == 1" placeholder="请输入" size="medium" v-model="param.parentId"></el-input>
                            </div>
                        </el-form-item>
                    </span>
                    <el-form-item class="filter-item" style="margin-left: 20px">
                        <el-button type="primary" size="medium"
                                    icon="el-icon-search"
                                @click="getList(1)">搜索
                        </el-button>
                        <el-button size="medium"
                                    icon="el-icon-refresh-left"
                                @click="resetSearch">重置
                        </el-button>
                        <el-button plain type="primary" size="medium"
                                    icon="el-icon-download"
                                v-if="hasPermission('BTN_ORDER_LIST_EXPORT')"
                                @click="exportOrder">下载
                        </el-button>
                        <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                            {{dropDownContent}}
                            <i :class="dropDownIcon"></i>
                        </el-link>
                    </el-form-item>
                </el-form>
            <!-- </div> -->
        </el-collapse-transition>
        <order-list :countryList="countryList" :userLevel="userLevel" :propData="dataList"></order-list>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="getList"
                           :current-page="page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import orderList from './components/orderList'
    import { viewOrderList, exportOrder } from '@/request/order.js'
    import { getProductEnumInfo } from '@/request/product'
    import { formatTime } from '@/js/common/filter'

    export default {
        components: { orderList },
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                param: {
                    timeType: '0',
                    orderType: [],
                    id: '',
                    productName: '',
                    productId: '',
                    countryCode: '',
                    orderStatus: [],
                    userId: '',
                    parentId: '',
                    deliveryWay: null //发货方式
                },
                deliveryWayOption: [],
                page: {
                    pageNum: 1,
                    pageSize: 5,
                    pagingSwitch: true
                },
                showSearchParam: false,
                activeName: '-1',
                totals: 0,
                orderStatusEnum: {
                    0: '待支付',
                    1: '待发货',
                    2: '待收货',
                    3: '交易成功',
                    4: '交易关闭'
                },
                timeTypeEnum: {
                    0: '创建时间',
                    1: '支付时间'
                },
                selectProductTypeEnum: {
                    0: '商品名称',
                    1: '商品ID',
                    2: '规格ID'
                },
                orderTypeEnum: {
                    0: '普通商品订单',
                    1: '小礼包商品订单',
                    2: '大礼包商品订单',
                    4: '拼团订单',
                    5: '直播订单',
                    8: '虚拟商品订单',
                    9: '批发商品订单',
                    10: '微商商品订单'
                },
                selectUserTypeEnum: {
                    0: '买家ID',
                    1: '邀请人ID'
                },
                selectProductType: '0',
                selectUserType: '0',
                dataList: [],
                timeList: [],
                beginTime: '',
                endTime: ''
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            userLevel () {
                return this.$store.state.user.userLevel
            },
            nowEnd () {
                return this.$store.state.globalNum.nowEnd
            },
            lastPartMonth () {
                return this.$store.state.globalNum.lastPartMonth
            }
        },
        created () {
            this.param.countryCode = this.$route.query.countryCode
            this.param.deliveryWay = this.$route.query.deliveryWay
            this.param.orderStatus = this.$route.query.orderStatus
            if (this.$route.query.orderStatus) {
                for (const iterator of this.$route.query.orderStatus) {
                    this.activeName = iterator[0]
                }
            }
            console.log(this.param.orderStatus)
            this.beginTime = this.$route.query.lastMonthDate===undefined?'':this.$route.query.lastMonthDate
            this.endTime = this.$route.query.nowEndDate===undefined?'':this.$route.query.nowEndDate
            if (this.beginTime !== '' || this.endTime !== '') {
                this.timeList = [this.beginTime, this.endTime]
            } else {
                this.timeList = [this.lastPartMonth, this.nowEnd]
            }
            console.log(formatTime(this.$route.query.lastMonthDate),formatTime(this.$route.query.lastMonthDate))
            // this.timeList = [this.lastPartMonth, this.nowEnd]
            if (this.$route.query.orderNo) {
                this.param.id = this.$route.query.orderNo
            }
            this.getList()
            this.getProductEnumInfo()
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
                this.page.pageSize = value
                this.getList(1)
            },
            getProductEnumInfo () {
                let params = {}
                getProductEnumInfo(this.filterData(params)).then((response) => {
                    console.log(response)
                    if (response.ret.errcode === 1) {
                        this.deliveryWayOption = response.deliveryWay
                    }
                })
            },
            getList (page) {
                this.page.pageNum = page || this.page.pageNum
                this.timeList = this.timeList ? this.timeList : []
                this.param.orderStatus = this.activeName == '-1' ? [] : [parseInt(this.activeName)]
                viewOrderList({
                    cond: this.filterData(Object.assign(this.param, {
                        startTime: !this.timeList[0] ? null : this.timeList[0],
                        endTime: !this.timeList[1] ? null : this.timeList[1]
                    })),
                    page: this.page
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        for (let i = 0; i < res.item.length; i++) {
                            res.item[i].editFlg = false
                            res.item[i].remarkBack = res.item[i].remarkBack ? res.item[i].remarkBack : ''
                        }
                        this.dataList = res.item
                        this.totals = res.total
                    }
                })
            },
            resetSearch () {
                this.param = {
                    timeType: '0',
                    id: '',
                    productName: '',
                    productId: '',
                    countryCode: '',
                    orderStatus: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
                this.timeList = [this.lastPartMonth, this.nowEnd]
            },
            // 导出
            exportOrder () {
                if (!this.timeList || this.timeList.length !== 2) {
                    this.$message({
                        type: 'warning',
                        message: '请选择导出日期范围'
                    })
                    return
                }
                let time = new Date(this.timeList[1]) - new Date(this.timeList[0])
                let days = Math.floor(time / (24 * 3600 * 1000))
                if (!this.hasPermission('BTN_ORDER_LIST_EXPORT_NNLIMITED')) {
                    if (days > 7) {
                        this.$message({
                            type: 'warning',
                            message: '导出日期范围最多7天'
                        })
                        return
                    }
                }
                exportOrder({
                    cond: this.filterData(Object.assign(this.param, {
                        startTime: !this.timeList[0] ? null : this.timeList[0],
                        endTime: !this.timeList[1] ? null : this.timeList[1]
                    }))
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        let a = document.createElement('a')
                        a.href = res.url
                        a.download = res.url
                        a.click()
                    }
                })
            }
        }
    }
</script>
