<template>
    <div class="dashboard">
        <div class="global-data">
            <el-row :gutter="14">
                <el-col :span="6" v-for="(item, index) in cardList1" :key="index">
                    <data-card :cardData="item.cardData" :cardInfo="item"></data-card>
                </el-col>
            </el-row>
            <el-row :gutter="14" style="margin-top: 14px;">
                <el-col :span="6" v-for="(item, index) in cardList2" :key="index">
                    <data-card :cardData="item.cardData" :cardInfo="item"></data-card>
                </el-col>
            </el-row>
        </div>
        <div class="detail-data">
            <el-row :gutter="14">
                <el-col :span="18">
                    <el-card class="line-chart">
                        <el-tabs v-model="activeName" @tab-click="handleTabClick">
                            <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item.label" :name="item.name" lazy>
                                <div class="line-chart-info">{{tabList[index].label}}趋势
                                    <el-tooltip class="item" effect="dark" :content="tabList[index].desc" placement="top">
                                        <i class="el-icon-warning-outline"></i>
                                    </el-tooltip>
                                </div>
                                <line-chart :ref="item.name" :lineData="lineDataMap[item.name]" :unit="tabList[index].unit" :yMin="tabList[index].yMin"></line-chart>
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                    <el-row :gutter="20" class="chart-row">
                        <el-col :span="12">
                            <el-card class="pie-chart">
                                <div slot="header" class="clearfix">
                                    <span>GMV商品占比</span>
                                </div>
                                <div>
                                    <pie-chart :pieData="productGMVPieData" unit="金额"></pie-chart>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="12">
                            <el-card class="pie-chart">
                                <div slot="header" class="clearfix">
                                    <span>订单数量商品占比</span>
                                </div>
                                <div>
                                    <pie-chart :pieData="productTypeProportionPieData"></pie-chart>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="chart-row">
                        <el-col :span="12">
                            <el-card class="hot-chart">
                                <div slot="header" class="clearfix">
                                    <span>爆款商品统计</span>
                                </div>
                                <div>
                                    <hot-product-card :spuNum="spuNum" :GMVNum="GMVNum" :tableData="hotProductTableData"></hot-product-card>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="12">
                            <el-card class="hot-chart">
                                <div slot="header" class="clearfix">
                                    <span>购买频次分布</span>
                                </div>
                                <div>
                                    <!-- <bar-chart :barData="frequencyBarData"></bar-chart> -->
                                     <pie-chart :pieData="frequencyBarData" unit=""></pie-chart>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20" class="chart-row">
                        <el-col :span="12">
                            <el-card class="pie-chart">
                                <div slot="header" class="clearfix">
                                    <span>终端GMV贡献占比</span>
                                </div>
                                <div>
                                    <pie-chart :pieData="siteGMVPieData" unit="金额"></pie-chart>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="12">
                            <el-card class="pie-chart">
                                <div slot="header" class="clearfix">
                                    <span>下单金额分布</span>
                                    <el-cascader  style="width: 220px; float: right;"
                                        clearable
                                        filterable
                                        :props="{label: 'cateName', children: 'levelValue', value: 'prop', checkStrictly: true, lazy: true, lazyLoad: getBackSubCategory}"
                                        placeholder="请选择商品后台类目"
                                        :options="backCategoryOptions"
                                        v-model="backCate"
                                        @change="setBackCateId"
                                        class="normalOperatorBox"
                                        size="mini">
                                    </el-cascader>
                                </div>
                                <div>
                                    <pie-chart :pieData="amountDistributionPieData"></pie-chart>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="6">
                     <el-card>
                        <div slot="header" class="clearfix">
                            <span>维度筛选器</span>
                        </div>
                        <div class="filter-item">
                            <h1>统计时间</h1>
                            <el-date-picker
                                class="statistic-time"
                                v-model="dateRange"
                                type="daterange"
                                align="right"
                                size="small"
                                unlink-panels
                                range-separator="~"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :clearable="false"
                                :picker-options="pickerOptions"
                                @change="handelDateChange">
                            </el-date-picker>
                        </div>
                        <div class="filter-item">
                            <h1>终端类型</h1>
                            <el-checkbox :indeterminate="isSiteIndeterminate" v-model="checkAllSite" @change="handleCheckAllSiteChange">全选</el-checkbox>
                            <el-checkbox-group v-model="checkedSite" @change="handleCheckedSiteChange">
                                <p v-for="(site, index) in siteList" :key="index">
                                    <el-checkbox :label="site.code" >{{site.label}}</el-checkbox>
                                </p>
                            </el-checkbox-group>
                        </div>
                        <div class="filter-item">
                            <h1>订单类型</h1>
                            <el-checkbox :indeterminate="isProdcutTypeIndeterminate" v-model="checkAllProductType" @change="handleCheckAllProductTypeChange">全选</el-checkbox>
                            <el-checkbox-group v-model="checkedProductType" @change="handleProductTypeChange">
                                <p v-for="(item, index) in productTypeList" :key="index">
                                    <el-checkbox :label="item.code" >{{item.label}}</el-checkbox>
                                </p>
                            </el-checkbox-group>
                        </div>
                        <div class="filter-item">
                            <h1>国家</h1>
                            <el-checkbox :indeterminate="isCountryIndeterminate" v-model="checkAllCountry" @change="handleCheckAllCountryChange">全选</el-checkbox>
                            <el-checkbox-group v-model="checkedCountry" @change="handleCheckedCountryChange">
                                <p v-for="(item, index) in countryList" :key="index">
                                    <el-checkbox :label="item.code" >{{item.label}}</el-checkbox>
                                </p>
                            </el-checkbox-group>
                        </div>
                        <div class="filter-item">
                            <h1>会员等级</h1>
                            <el-checkbox :indeterminate="isLevelIndeterminate" v-model="checkAllLevel" @change="handleCheckAllLevelChange">全选</el-checkbox>
                            <el-checkbox-group v-model="checkedLevel" @change="handleCheckedLevelChange">
                                <p v-for="(item, index) in userList" :key="index">
                                    <el-checkbox :label="item.code">{{item.label}}</el-checkbox>
                                </p>
                            </el-checkbox-group>
                        </div>
                        <div class="filter-item">
                            <h1>新老用户</h1>
                            <el-checkbox :indeterminate="isNewIndeterminate" v-model="checkAllNew" @change="handleCheckAllNewChange">全选</el-checkbox>
                            <el-checkbox-group v-model="checkedNew" @change="handleCheckedNewChange" :min="2">
                                <p v-for="(item, index) in buyingBehavior" :key="index">
                                    <el-checkbox :label="item.code" >{{item.label}}</el-checkbox>
                                </p>
                            </el-checkbox-group>
                        </div>
                        <div class="filter-item">
                            <h1>自购推荐</h1>
                            <el-checkbox :indeterminate="isShoppingIndeterminate" v-model="checkAllShopping" @change="handleCheckAllShoppingChange">全选</el-checkbox>
                            <el-checkbox-group v-model="checkedShopping" @change="handleCheckedShoppingChange">
                                <p v-for="(item, index) in shoppingType" :key="index">
                                    <el-checkbox :label="item.code" >{{item.label}}</el-checkbox>
                                </p>
                            </el-checkbox-group>
                        </div>
                     </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    // import moment from 'moment'
    import DataCard from './components/DataCard'
    import LineChart from './components/LineChart'
    import PieChart from './components/PieChart'
    import BarChart from './components/BarChart'
    import HotProductCard from './components/HotProductCard'

    import { simpleDataDisplay, orderBrokenLineGraph, orderProductTypeProportion,
        orderFrequency, orderAmountDistribution, productGMVPercentGraph, siteGMVPercentGraph ,
        orderActivityProductData } from '@/request/datacenter'
    import { categoryListGet } from '@/request/product'

    export default {
        // 订单销售看板
        name: 'OrderDataView',
        data() {
            return {
                activeName: 'NumOfOrder',
                activeTab: 'NumOfOrder',
                tabList: [{
                        label: '订单量',
                        name: 'NumOfOrder',
                        unit: '单',
                        desc: '全平台支付成功的全类型（普通商品/礼包商品/B2B/拼团）订单数，退款成功不扣减',
                        yMin: 0
                    }, {
                        label: 'GMV',
                        name: 'GMV',
                        unit: '$',
                        desc: '全平台支付成功的全类型（普通商品/礼包商品/B2B/拼团）订单金额，退款成功不扣减',
                        yMin: 0
                    }, {
                        label: '客单价',
                        name: 'GMVPerUser',
                        unit: '$',
                        desc: '统计周期内，全平台支付成功的全类型（普通商品/礼包商品/B2B/拼团）订单金额/支付成功的全种类订单数量，退款成功不扣减',
                        yMin: 0
                    }, {
                        label: '下单用户数',
                        name: 'NumOfOrderedUser',
                        unit: '人',
                        desc: '统计周期内，支付成功全种类订单对应的用户数量，同个统计粒度下按照userid去重',
                        yMin: 0
                    }, {
                        label: '下单频次',
                        name: 'OrderFrequency',
                        unit: '次',
                        desc: '1、定义为 统计周期内 全种类订单量/下单用户数，按用户id去重；2、纵轴展现粒度固定从1 ，到最大值，按20%作为递增区间',
                        yMin: 1
                    }, {
                        label: '优惠券使用占比',
                        name: 'DiscountApplied',
                        unit: '%',
                        desc: '1、定义为 统计周期内 使用优惠券的订单，占总下单的订单的比率；2、维度筛选枚举 【按等级】sh/ps/am/at，【按合计】即总计值，【按终端类型】ios/android/H5，【按商品类型】普通商品/礼包商品，【按新老用户】首单/复购，【按自购推荐】自购/推荐：通过分享链接点击后购买',
                        yMin: 0
                    }, {
                        label: '优惠券抵扣金额占比',
                        name: 'DiscountAmount',
                        unit: '%',
                        desc: '1、定义为 统计周期内 使用优惠券的订单抵扣金额，占总下单的订单金额的比；2、维度筛选枚举 【按等级】sh/ps/am/at，【按合计】即总计值，【按终端类型】ios/android/H5，【按商品类型】普通商品/礼包商品，【按新老用户】首单/复购，【按自购推荐】自购/推荐：通过分享链接点击后购买',
                        yMin: 0
                    }
                ],
                cardList1: [{
                    type: 'GMV',
                    title: 'GMV',
                    desc: '1、 统计周期内，全平台新增的GMV，不包含未支付，统计周期内已退款不扣减；2、统计单位为美元',
                    unit: 'USD',
                    cardData: {
                        time: '',
                        volume: '',
                        weeklyChange: 0,
                        dailyChange: 0
                    }
                }, {
                    type: 'NumOfOrder',
                    title: '订单量',
                    desc: ' 统计周期内，全平台新增的订单数，不包含未支付，统计周期内新增后退款成功不扣减',
                    unit: '单',
                    cardData: {
                        time: '',
                        volume: '',
                        weeklyChange: 0,
                        dailyChange: 0
                    }
                }, {
                    type: 'NumOfOrderedUser',
                    title: '下单人数',
                    desc: '统计周期内，全平台新增的成功提交订单的用户数',
                    unit: '人',
                    cardData: {
                         time: '',
                        volume: '',
                        weeklyChange: 0,
                        dailyChange: 0
                    }
                }, {
                    type: 'GMVPerUser',
                    title: '普货客单价',
                    desc: '统计周期内，全平台新增的，每一个顾客平均购买商品的金额（=GMV/下单人数）',
                    unit: 'USD',
                    cardData: {
                        time: '',
                        volume: '',
                        weeklyChange: 0,
                        dailyChange: 0
                    }
                }],
                cardList2: [{
                    type: 'NumOfCanceledOrder',
                    title: '取消订单订单数',
                    desc: '统计周期内，全平台取消订单的数量',
                    unit: '单',
                    cardData: {
                        time: '',
                        volume: '',
                        weeklyChange: 0,
                        dailyChange: 0
                    }
                }, {
                    type: 'NumOfCanceledUser',
                    title: '取消订单用户数',
                    desc: '统计周期内，全平台取消订单的用户数量，按用户维度去重',
                    unit: '人',
                    cardData: {
                        time: '',
                        volume: '',
                        weeklyChange: 0,
                        dailyChange: 0
                    }
                }, {
                    type: 'NumOfReturn',
                    title: '退货次数',
                    desc: '统计周期内，全平台申请退款的次数，包含app端和客服后台端的发起',
                    unit: '单',
                    cardData: {
                        time: '',
                        volume: '',
                        weeklyChange: 0,
                        dailyChange: 0
                    }
                }, {
                    type: 'NumOfReturnUser',
                    title: '退货用户数',
                    desc: '统计周期内，全平台申请退款的用户数，包含app端和客服后台端的发起',
                    unit: '人',
                    cardData: {
                        time: '',
                        volume: '',
                        weeklyChange: 0,
                        dailyChange: 0
                    }
                }],
                isSiteIndeterminate: true,
                checkAllSite: true,
                checkedSite: [0, 1, 2],
                siteOptions: [0, 1, 2],

                isProdcutTypeIndeterminate: true,
                checkAllProductType: true,
                checkedProductType: [0, 1, 4, 5, 8, 9, 10, 11, 100],
                productTypeOptions: [0, 1, 4, 5, 8, 9, 10, 11, 100],

                isCountryIndeterminate: true,
                checkAllCountry: true,
                checkedCountry: [0, 1, 2],
                countryOptions: [0, 1, 2],

                isLevelIndeterminate: true,
                checkAllLevel: true,
                checkedLevel: [2, 3, 4, 5],
                levelOptions: [2, 3, 4, 5],

                isNewIndeterminate: true,
                checkAllNew: true,
                checkedNew: [0, 1],
                newOptions: [0, 1],

                isShoppingIndeterminate: true,
                checkAllShopping: true,
                checkedShopping: [0, 1],
                shoppingOptions: [0, 1],

                siteList: [
                    {
                        code: 1,
                        label: 'Android'
                    }, {
                        code: 2,
                        label: 'ios'
                    }, {
                        code: 0,
                        label: 'H5'
                    }
                ],
                productTypeList: [
                    {
                        code: 0,
                        label: '普通商品'
                    }, {
                        code: 1,
                        label: '礼包商品'
                    }, {
                        code: 4,
                        label: '拼团订单'
                    }, {
                        code: 5,
                        label: '直播订单'
                    }, {
                        code: 8,
                        label: '虚拟商品订单'
                    }, {
                        code: 9,
                        label: '批发商品'
                    }, {
                        code: 10,
                        label: '微商商品'
                    }, {
                        code: 11,
                        label: '99青春礼包'
                    }, {
                        code: 100,
                        label: 'B2B'
                    }
                ],
                countryList: [
                    {
                        code: 0,
                        label: '马来西亚'
                    }, {
                        code: 1,
                        label: '新加坡'
                    }, {
                        code: 2,
                        label: '泰国'
                    }
                ],
                userList: [
                    {
                        code: 2,
                        label: 'AT'
                    }, {
                        code: 3,
                        label: 'AM'
                    }, {
                        code: 4,
                        label: 'PS'
                    }, {
                        code: 5,
                        label: 'SH'
                    }
                ],
                buyingBehavior: [
                    {
                        code: 0,
                        label: '首单'
                    }, {
                        code: 1,
                        label: '复购'
                    }
                ],
                shoppingType: [
                    {
                        code: 0,
                        label: '自购'
                    }, {
                        code: 1,
                        label: '推荐'
                    }
                ],
                cardData: {
                    title: 'GMV',
                    tipContent: '1、 统计周期内，全平台新增的GMV，不包含未支付，统计周期内已退款不扣减;2、统计单位为美元',
                    time: '2020-02-13',
                    timeText: '今日',
                    dataNum: '124,552',
                    dataUnit: 'USD',
                    WoW: 22,
                    DoD: 12
                },
                pickerOptions: {
                    shortcuts: [{
                        text: '昨日',
                        onClick(picker) {
                            const end = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD');
                            const start = moment(new Date()).add(-1, 'days').format('YYYY-MM-DD');
                            console.log(end)
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '今日',
                        onClick(picker) {
                            const end = moment(new Date()).format('YYYY-MM-DD');
                            const start = moment(new Date()).format('YYYY-MM-DD');
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上周',
                        onClick(picker) {
                            const weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天  周日为一周中的第一天
                            const start = moment().subtract(weekOfday + 7, 'days').format('YYYY-MM-DD') // 周一日期
                            const end = moment().subtract(weekOfday + 1, 'days').format('YYYY-MM-DD') // 周日日期
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本周',
                        onClick(picker) {
                            let weekOfday = parseInt(moment().format('d')) // 计算今天是这周第几天 周日为一周中的第一天
                            let start = moment().subtract(weekOfday-1, 'days').format('YYYY-MM-DD') // 周一日期
                            let end = moment().add(7 - weekOfday, 'days').format('YYYY-MM-DD') // 周日日期
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上月',
                        onClick(picker) {
                            let start = moment().subtract('month', 1).format('YYYY-MM') + '-01'
                            let end = moment(start).subtract('month', -1).add('days', -1).format('YYYY-MM-DD')
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '本月',
                        onClick(picker) {
                            let start = moment().add('month', 0).format('YYYY-MM') + '-01'
                            let end = moment(start).add('month', 1).add('days', -1).format('YYYY-MM-DD')
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '去年',
                        onClick(picker) {
                            let start = moment().year(moment().year() -1).startOf('year')
                            let end = moment().year(moment().year() -1).endOf('year')
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '今年',
                        onClick(picker) {
                            let start = moment().startOf('year')
                            let end = moment().endOf('year')
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '过去7天',
                        onClick(picker) {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
                          picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '过去30天',
                        onClick(picker) {
                          const end = new Date();
                          const start = new Date();
                          start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
                          picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '上线至今',
                        onClick(picker) {
                          const end = new Date();
                          const start = moment('2018-12-26 00:00:00');
                          picker.$emit('pick', [start, end]);
                        }
                    }]
                },
                dateRange: ["2019-11-01", "2019-12-31"],
                dateRangeTimeStamp: [1572537600, 1577721599],
                dimensionData: [],
                colorList: ['#8d7fec', '#5085f2', '#e75fc3', '#f87be2', '#f2719a'],
                productGMVPieData: [],
                siteGMVPieData: [],
                productTypeProportionPieData: [],
                amountDistributionPieData: [],
                frequencyBarData: [],
                lineDataMap: {
                    NumOfOrder: {},
                    GMV: {},
                    GMVPerUser: {},
                    NumOfOrderedUser: {},
                    OrderFrequency: {},
                    DiscountApplied: {},
                    DiscountAmount: {}
                },
                spuNum: '',
                GMVNum: '',
                hotProductTableData: [],
                backCategoryOptions: [],
                backCate: '',
                backCateId: ''
            }
        },
        components: {
            DataCard,
            LineChart,
            PieChart,
            BarChart,
            HotProductCard
        },
        created() {
            // this.countryList = JSON.parse(this.getStore('countryList'))
            this.initTime()
            this.getAllGlobalData('NumOfOrder')
            this.getAllChartData()
            this.fetchCategory({
                level: 1,
                cateType: 2,
                resolve: (data) => {
                    this.backCategoryOptions = data
                    console.log(this.backCategoryOptions)
                }
            })
        },
        methods: {
            handleTabClick(tab) {
                this.activeTab = tab.paneName
                this.getLineData()
                if (this.$refs[tab.paneName]) {
                    this.$refs[tab.paneName][0].resizeChart()
                }
            },
            initTime() {
                let start = moment(new Date().getTime() - 3600 * 1000 * 24 * 29).format('YYYY-MM-DD')
                let end = moment(new Date().getTime()).format('YYYY-MM-DD')
                this.dateRange = [start, end]
                this.dateRangeTimeStamp[0] = moment(start + ' 00:00:00', 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000
                this.dateRangeTimeStamp[1] = moment(end + ' 23:59:59', 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000
                console.log(this.dateRange, this.dateRangeTimeStamp)
            },
            getAllChartData() {
                this.getLineData()
                this.getProductGMVPercentGraph()
                this.getSiteGMVPercentGraph()
                this.getProductTypeProportion()
                this.getAmountDistribution()
                this.getOrderFrequency()
                this.getHotProduct()
            },
            handelDateChange(data){
                data[0] = moment(data[0]).format('YYYY-MM-DD')
                data[1] = moment(data[1]).format('YYYY-MM-DD')
                this.dateRange = data
                let startTime = data[0] + ' 00:00:00'
                let endTime = data[1] + ' 23:59:59'
                this.dateRangeTimeStamp[0] = moment(startTime, 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000
                this.dateRangeTimeStamp[1] = moment(endTime, 'YYYY-MM-DD HH:mm:ss').valueOf() / 1000
                this.getAllChartData()
            },
            handleCheckAllSiteChange(val) {
                this.checkedSite = val ? this.siteOptions : [];
                this.isSiteIndeterminate = false;
                this.getAllChartData()
            },
            handleCheckedSiteChange(value) {
                let checkedCount = value.length;
                this.checkAllSite = checkedCount === this.siteList.length;
                this.isSiteIndeterminate = checkedCount > 0 && checkedCount < this.siteList.length;
                this.getAllChartData()
            },
            handleCheckAllProductTypeChange(val) {
                this.checkedProductType = val ? this.productTypeOptions : [];
                this.isProdcutTypeIndeterminate = false;
                this.getAllChartData()
            },
            handleProductTypeChange(value) {
                let checkedCount = value.length;
                this.checkAllProductType = checkedCount === this.productTypeList.length;
                this.isProdcutTypeIndeterminate = checkedCount > 0 && checkedCount < this.productTypeList.length;
                this.getAllChartData()
            },

            handleCheckAllCountryChange(val) {
                this.checkedCountry = val ? this.countryOptions : [];
                this.isCountryIndeterminate = false;
                this.getAllChartData()
            },
            handleCheckedCountryChange(value) {
                let checkedCount = value.length;
                this.checkAllCountry = checkedCount === this.countryList.length;
                this.isCountryIndeterminate = checkedCount > 0 && checkedCount < this.countryList.length;
                this.getAllChartData()
            },

            handleCheckAllLevelChange(val) {
                this.checkedLevel = val ? this.levelOptions : [];
                this.isLevelIndeterminate = false;
                this.getAllChartData()
            },
            handleCheckedLevelChange(value) {
                let checkedCount = value.length;
                this.checkAllLevel = checkedCount === this.userList.length;
                this.isLevelIndeterminate = checkedCount > 0 && checkedCount < this.userList.length;
                this.getAllChartData()
            },

            handleCheckAllNewChange(val) {
                return
                this.checkedNew = val ? this.newOptions : [];
                this.isNewIndeterminate = false;
                this.getAllChartData()
            },
            handleCheckedNewChange(value) {
                return
                let checkedCount = value.length;
                this.checkAllNew = checkedCount === this.buyingBehavior.length;
                this.isNewIndeterminate = checkedCount > 0 && checkedCount < this.buyingBehavior.length;
                this.getAllChartData()
            },

            handleCheckAllShoppingChange(val) {
                this.checkedShopping = val ? this.shoppingOptions : [];
                this.isShoppingIndeterminate = false;
                this.getAllChartData()
            },
            handleCheckedShoppingChange(value) {
                let checkedCount = value.length;
                this.checkAllShopping = checkedCount === this.shoppingType.length;
                this.isShoppingIndeterminate = checkedCount > 0 && checkedCount < this.shoppingType.length;
                this.getAllChartData()
            },
            getGlobalData(dataType) {
                let params = {
                    dataType: dataType
                }
                simpleDataDisplay(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        _.forEach(this.cardList1, item => {
                            _.forEach(res.data, simpleItem => {
                                if (item.type === simpleItem.dataType) {
                                    item.cardData = simpleItem
                                    item.cardData.time = moment().locale('zh-cn').format('YYYY-MM-DD')
                                    item.cardData.timeText = '今日'
                                }
                            })
                        })

                        _.forEach(this.cardList2, item => {
                            _.forEach(res.data, simpleItem => {
                                if (item.type === simpleItem.dataType) {
                                    item.cardData = simpleItem
                                    item.cardData.time = moment().locale('zh-cn').format('YYYY-MM-DD')
                                    item.cardData.timeText = '今日'
                                }
                            })
                        })
                    }
                })
            },
            getAllGlobalData() {
                let typeList = ['GMV', 'NumOfOrder', 'NumOfOrderedUser', 'GMVPerUser', 'NumOfCanceledOrder',
                    'NumOfCanceledUser', 'NumOfReturn', 'NumOfReturnUser'];
                this.getGlobalData(typeList)
            },
            getDimensionData() {
                let dataList = []
                if (this.checkedSite.length > 0) {
                    let dimensionObj = {}
                    dimensionObj.dimensionCode = 0
                    dimensionObj.degree = this.checkedSite
                    dataList.push(dimensionObj)
                }

                if (this.checkedProductType.length > 0) {
                    let dimensionObj = {}
                    dimensionObj.dimensionCode = 1
                    dimensionObj.degree = this.checkedProductType
                    dataList.push(dimensionObj)
                }

                if (this.checkedCountry.length > 0) {
                    let dimensionObj = {}
                    dimensionObj.dimensionCode = 2
                    dimensionObj.degree = this.checkedCountry
                    dataList.push(dimensionObj)
                }

                if (this.checkedLevel.length > 0) {
                    let dimensionObj = {}
                    dimensionObj.dimensionCode = 3
                    dimensionObj.degree = this.checkedLevel
                    dataList.push(dimensionObj)
                }

                if (this.checkedNew.length > 0) {
                    let dimensionObj = {}
                    dimensionObj.dimensionCode = 4
                    dimensionObj.degree = this.checkedNew
                    dataList.push(dimensionObj)
                }

                if (this.checkedShopping.length > 0) {
                    let dimensionObj = {}
                    dimensionObj.dimensionCode = 5
                    dimensionObj.degree = this.checkedShopping
                    dataList.push(dimensionObj)
                }
                this.dimensionData = dataList
            },
            getLineData() {
                this.getDimensionData()
                let params = {
                    dataType: this.activeName,
                    startTime: this.dateRangeTimeStamp[0],
                    endTime: this.dateRangeTimeStamp[1],
                    dimension: this.dimensionData
                }
                orderBrokenLineGraph(this.filterData(params)).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        let series = []
                        let xAxis = []
                        _.forEach(res.dataPoint, point => {
                            series.push(point.volume)
                            xAxis.push(point.date)
                        })
                        this.lineDataMap[this.activeName] = {
                            series: series,
                            xAxis: xAxis
                        }
                    }
                })
            },
            /**
             * GMV商品占比
            */
            getProductGMVPercentGraph() {
                let params = {
                    startTime: this.dateRangeTimeStamp[0],
                    endTime: this.dateRangeTimeStamp[1],
                    dimension: this.dimensionData
                }
                productGMVPercentGraph(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        let productGMVList = []
                        _.forEach(res.proportion, (item, index)=> {
                            let productGMVObj = {}
                            productGMVObj.value =  Number(item.productValue)
                            productGMVObj.legendname = item.productType
                            productGMVObj.itemStyle = {color: this.colorList[index]}
                            productGMVList.push(productGMVObj)
                        })
                        this.productGMVPieData = productGMVList
                    }
                })
            },
            /**
             * 终端GMV占比
            */
            getSiteGMVPercentGraph() {
                let params = {
                    startTime: this.dateRangeTimeStamp[0],
                    endTime: this.dateRangeTimeStamp[1],
                    dimension: this.dimensionData
                }
                siteGMVPercentGraph(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        let siteGMVList = []
                        _.forEach(res.siteType, (item, index)=> {
                            let siteGMVObj = {}
                            siteGMVObj.value =  Number(item.siteValue)
                            siteGMVObj.legendname = item.siteName
                            siteGMVObj.itemStyle = {color: this.colorList[index]}
                            siteGMVList.push(siteGMVObj)
                        })
                        console.log(siteGMVList)
                        this.siteGMVPieData = siteGMVList
                    }
                })
            },
            /**
             * 订单数量商品占比
            */
            getProductTypeProportion() {
                let params = {
                    startTime: this.dateRangeTimeStamp[0],
                    endTime: this.dateRangeTimeStamp[1],
                    dimension: this.dimensionData
                }
                orderProductTypeProportion(this.filterData(params)).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        let productTypeProportionList = []
                        _.forEach(res.proportion, (item, index)=> {
                            let productProportionObj = {}
                            productProportionObj.value = Number(item.productValue)
                            productProportionObj.legendname = item.productType
                            productProportionObj.itemStyle = {color: this.colorList[index]}
                            productTypeProportionList.push(productProportionObj)
                        })
                        this.productTypeProportionPieData = productTypeProportionList
                    }
                })
            },
            /**
             * 下单金额分布
            */
            getAmountDistribution() {
                this.dimensionDataCopy =  _.cloneDeep(this.dimensionData)
                if (this.backCateId != '') {
                    let dimensionObj = {}
                    dimensionObj.dimensionCode = 6
                    dimensionObj.degree = [parseInt(this.backCateId)]
                    this.dimensionDataCopy.push(dimensionObj)
                }
                let params = {
                    startTime: this.dateRangeTimeStamp[0],
                    endTime: this.dateRangeTimeStamp[1],
                    dimension: this.dimensionDataCopy
                }
                console.log(this.params)
                orderAmountDistribution(this.filterData(params)).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        let amountDistributionList = []
                        _.forEach(res.percentages, (item, index)=> {
                            let amountDistributionObj = {}
                            amountDistributionObj.value = Number(item.amountValue)
                            amountDistributionObj.legendname = item.amountPaid
                            amountDistributionObj.itemStyle = {color: this.colorList[index]}
                            amountDistributionList.push(amountDistributionObj)
                        })
                        console.log(amountDistributionList)
                        this.amountDistributionPieData = amountDistributionList
                    }
                })
            },
            /**
             * 购买频次分布
            */
            getOrderFrequency() {
                let params = {
                    startTime: this.dateRangeTimeStamp[0],
                    endTime: this.dateRangeTimeStamp[1],
                    dimension: this.dimensionData
                }
                orderFrequency(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        let frequencyBarDataList = []
                        _.forEach(res.data, (item, index)=> {
                            let frequencyBarObj = {}
                            frequencyBarObj.value = Number(item.volume)
                            frequencyBarObj.legendname = item.frequency
                            frequencyBarObj.itemStyle = {color: this.colorList[index]}
                            frequencyBarDataList.push(frequencyBarObj)
                        })
                        this.frequencyBarData = frequencyBarDataList
                    }
                })
            },
            /**
             * 获取爆款商品统计
            */
            getHotProduct() {
                let params = {
                    startTime: this.dateRangeTimeStamp[0],
                    endTime: this.dateRangeTimeStamp[1],
                    dimension: this.dimensionData
                }
                orderActivityProductData(this.filterData(params)).then((res) => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.spuNum = res.totalNumber
                        this.GMVNum = res.totalGMV
                        this.hotProductTableData = res.product
                    }
                })
            },
            getBackSubCategory (data, resolve) {
                if (data.level == 0) {
                    return
                }
                let value = JSON.parse(data.value)
                this.fetchCategory({
                    pid: parseInt(value.cateId),
                    cateType: 2,
                    level: data.level + 1,
                    resolve
                })
            },
            // 获取分类
            fetchCategory ({ id, cateType, level, pid, page, resolve }) {
                categoryListGet(this.filterData({
                    pid: pid,
                    id: id,
                    level: level,
                    cateType: cateType,
                    page: page
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        for (let i = 0; i < res.categoryUnit.length; i++) {
                            res.categoryUnit[i]['levelValue'] = []
                            let item = res.categoryUnit[i].cateNameValue.find((val) => {
                                return val.languageCode == 'cn'
                            })
                            res.categoryUnit[i]['cateName'] = item ? item.name : ''
                            res.categoryUnit[i]['prop'] = JSON.stringify({
                                cateId: String(res.categoryUnit[i].cateId),
                                cateName: item ? item.name : ''
                            })
                            if (cateType == 2) {
                                res.categoryUnit[i]['leaf'] = level > 2
                            } else {
                                res.categoryUnit[i]['leaf'] = level > 1
                            }
                        }
                        resolve && resolve(res.categoryUnit, res)
                    }
                })
            },
            setBackCateId () {
                if (this.backCate && this.backCate.length > 0) {
                    let cateInfo = JSON.parse(this.backCate[this.backCate.length - 1])
                    this.backCateId = cateInfo.cateId
                } else {
                    this.backCateId = ''
                }
                console.log(this.backCateId)
                this.getAmountDistribution()
            },
        }
    }
</script>

<style lang="scss">
    .statistic-time {
        margin-top: 8px;
        width: 250px !important
    }
</style>

<style lang="scss" scoped>
    .dashboard {
        height: 95vh;
        width: 100%;
        padding: 14px;
        background-position: center;
        overflow: auto;
    }

    .global-data {
        min-width: 900px;
    }
    .detail-data {
        min-width: 1200px;
        margin-top: 20px;
        .line-chart {
            height: 520px;
            .line-chart-info {
                font-weight: 600;
                color: #000;
                font-size: 18px;
            }
        }
        .pie-chart {
            height: 400px;
        }
        .hot-chart {
            height: 500px;
        }
        .bar-chart {
            height: 400px;
        }
        .chart-row {
            margin-top: 20px;
        }
        .filter-item {
            margin-bottom: 20px;
        }
    }

</style>
