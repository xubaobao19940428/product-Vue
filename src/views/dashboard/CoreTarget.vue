<template>
    <div class="traffic-flow">
        <el-form inline label-width="90px">
            <el-form-item label="选择日期：" class="" prop="value">
                <el-date-picker
                    v-model="timeList"
                    size="medium" type="daterange"
                    value-format="timestamp"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                    :clearable="false"
                    :picker-options="pickerOptions"
                    @change="getAllData"
                    >
                </el-date-picker>
            </el-form-item>
        </el-form>
        <el-card class="key-metrics-table" v-loading="loading" element-loading-text="正在加载中..." >
           <KeyMetricsTable v-if="keyMetricsTableData.length>0" :mouth="mouth" :keyMetricsTableData="keyMetricsTableData" :chartData="tableChartData" :dateList="dateList"></KeyMetricsTable>
        </el-card>

        <el-card class="platform-product" style="margin-top: 20px; margin-bottom: 20px;">
            <div slot="header" class="clearfix">
                <span style="font-weight: 600; font-size: 22px">全平台GMV分析</span>
            </div>
            <el-row>
                <el-col :span="3">
                    <div class="filter-item">
                        <h1>按国家分析：</h1>
                        <el-checkbox :indeterminate="isCountryIndeterminate" v-model="checkAllCountry" @change="handleCheckAllCountryChange">全选</el-checkbox>
                        <el-checkbox-group v-model="checkedCountry" @change="handleCheckedCountryChange" :min="1">
                            <p v-for="(item, index) in countryList" :key="index">
                                <el-checkbox :label="item.shortCode" >{{item.nameLocal}}</el-checkbox>
                            </p>
                        </el-checkbox-group>
                    </div>
                </el-col>
                <el-col :span="21" v-loading="plantLoading">
                    <el-row>
                        <el-col :span="6">
                            <p class="pie-title">
                                礼包
                                <span v-if="String(GMVGiftPercent) != 'NaN'">{{GMVGiftPercent}}%</span>
                                <span v-else>-%</span>
                            </p>
                            <CorePieChart :pieData="allGMVGiftPie" :radius="GMVGiftPercent"></CorePieChart>
                        </el-col>
                        <el-col :span="6">
                            <p class="pie-title">
                                普通商品
                                <span v-if="String(GMVNormalPercent) != 'NaN'">{{GMVNormalPercent}}%</span>
                                <span v-else>-%</span>
                            </p>
                            <CorePieChart :pieData="allGMVNormaltPie" :radius="GMVNormalPercent"></CorePieChart>
                        </el-col>
                        <el-col :span="6">
                            <p class="pie-title">
                                B2B
                                <span v-if="String(GMVB2BPercent) != 'NaN'">{{GMVB2BPercent}}%</span>
                                <span v-else>-%</span>
                            </p>
                            <CorePieChart :pieData="allGMVB2BPie" :radius="GMVB2BPercent"></CorePieChart>
                        </el-col>
                        <el-col :span="6">
                            <p class="pie-title">
                                costgo
                                <span v-if="String(GMVCostgoPercent) != 'NaN'">{{GMVCostgoPercent}}%</span>
                                <span v-else>-%</span>
                            </p>
                            <CorePieChart :pieData="allGMVCostgoPie" :radius="GMVCostgoPercent"></CorePieChart>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-card>
        <el-card class="platform-product custom-product">
            <div slot="header" class="clearfix">
                <span style="font-weight: 600; font-size: 22px">普货GMV分析</span>
            </div>
            <el-tabs v-model="activeType" @tab-click="handleTabClick" lazy>
                <el-tab-pane label="用户等级" name="userLevel">
                    <el-row>
                        <el-col :span="3">
                            <div class="filter-item">
                                <h1>按国家分析：</h1>
                                <el-checkbox :indeterminate="isCountryIndeterminateOne" v-model="checkAllCountryOne" @change="handleCheckAllCountryChangeOne">全选</el-checkbox>
                                <el-checkbox-group v-model="checkedCountryOne" @change="handleCheckedCountryChangeOne" :min="1">
                                    <p v-for="(item, index) in countryList" :key="index">
                                        <el-checkbox :label="item.shortCode" >{{item.nameLocal}}</el-checkbox>
                                    </p>
                                </el-checkbox-group>
                            </div>
                        </el-col>
                        <el-col :span="21">
                            <el-row v-if="userLevelGMVData != null" v-loading="levelLoading">
                                <el-col :span="spanValue" v-for="(item, index) in resutCountryList" :key="index">
                                    <p class="pie-title">{{item}} <span>{{persentList[index]}}%</span> </p>
                                    <CorePieChart v-if="persentList[index] != 0" :pieData="userLevelGMVData[item]" :radius="persentList[index]" centerY="60%"></CorePieChart>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="订单类型" name="orderType">
                    <el-row>
                        <el-col :span="3">
                            <div class="filter-item">
                                <h1>按国家分析：</h1>
                                <el-checkbox :indeterminate="isCountryIndeterminateTwo" v-model="checkAllCountryTwo" @change="handleCheckAllCountryChangeTwo">全选</el-checkbox>
                                <el-checkbox-group v-model="checkedCountryTwo" @change="handleCheckedCountryChangeTwo">
                                    <p v-for="(item, index) in countryList" :key="index">
                                        <el-checkbox :label="item.shortCode" >{{item.nameLocal}}</el-checkbox>
                                    </p>
                                </el-checkbox-group>
                            </div>
                        </el-col>
                        <el-col :span="21">
                            <el-row v-if="orderTypeGMVData != null" v-loading="levelLoading">
                                <el-col :span="spanValue" v-for="(item, index) in resutCountryList" :key="index">
                                    <p class="pie-title">{{item}} <span>{{persentList[index]}}%</span> </p>
                                    <CorePieChart v-if="persentList[index] != 0" :pieData="orderTypeGMVData[item]" :radius="persentList[index]" centerY="65%"></CorePieChart>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane label="一级类目" name="productCate">
                    <el-row>
                        <el-col :span="3">
                            <div class="filter-item">
                                <h1>按国家分析：</h1>
                                <el-checkbox :indeterminate="isCountryIndeterminateThree" v-model="checkAllCountryThree" @change="handleCheckAllCountryChangeThree">全选</el-checkbox>
                                <el-checkbox-group v-model="checkedCountryThree" @change="handleCheckedCountryChangeThree" :min="1">
                                    <p v-for="(item, index) in countryList" :key="index">
                                        <el-checkbox :label="item.shortCode" >{{item.nameLocal}}</el-checkbox>
                                    </p>
                                </el-checkbox-group>
                            </div>
                        </el-col>
                        <el-col :span="21">
                            <el-row>
                                <el-row v-if="productCateGMVData != null" v-loading="cateLoading">
                                    <el-col :span="spanValue" v-for="(item, index) in resutCountryList" :key="index">
                                        <p class="pie-title">{{item}} <span>{{persentList[index]}}%</span> </p>
                                        <TreeMapChart v-if="persentList[index] != 0" :treeData="productCateGMVData[item]" :scale="persentList[index]/100 > 0.3 ? persentList[index]/100 : 0.3"></TreeMapChart>
                                    </el-col>
                                </el-row>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    // import moment from 'moment'
    import { getCountryList, getLanguageList } from '@/request/i18n'
    import {
        categoryListGet
    } from '@/request/product'
    import {
        coreIndicatorDataList,
        coreIndicatorPlatformGMVPieChart,
        coreIndicatorNormalGMVPieChart,
        getDataCenterTypeData
    } from '@/request/datacenter'
    import KeyMetricsTable from './components/KeyMetricsTable'
    import CorePieChart from './components/CorePieChart'
    import TreeMapChart from './components/TreeMapChart'

    export default {
        // 数据核心指标
        name: 'coreTarget',
        data() {
            return {
                timeList: ['', ''],
                dateList: ['', ''],
                startTime: '',
                endTime: '',
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() - 24 * 60 * 60 *1000 >= moment().startOf('day').unix() * 1000;
                    }
                },
                loading: false,
                plantLoading: false,
                levelLoading: false,
                cateLoading: false,
                dataTypeList: [],
                dataTypeObjList: [],
                keyMetricsTableData: [],
                tableChartData: [],
                isCountryIndeterminate: true,
                checkAllCountry: true,
                checkedCountry: [],
                countryOptions: [],
                activeType: 'userLevel',
                allGMVGiftPie: [],
                allGMVB2BPie: [],
                allGMVNormaltPie: [],
                allGMVCostgoPie: [],
                GMVGiftPercent: '',
                GMVNormalPercent: '',
                GMVB2BPercent: '',
                GMVCostgoPercent: '',
                isCountryIndeterminateOne: true,
                checkAllCountryOne: true,
                checkedCountryOne: [],
                countryOptionsOne: [],
                resutCountryList: [],
                spanValue: 8,
                userLevelGMVData: null,
                isCountryIndeterminateTwo: true,
                checkAllCountryTwo: true,
                checkedCountryTwo: [],
                countryOptionsTwo: [],
                orderTypeGMVData: null,
                isCountryIndeterminateThree: true,
                checkAllCountryThree: true,
                checkedCountryThree: [],
                countryOptionsThree: [],
                productCateGMVData: null,
                persentList: [],
                mouth: 1
            }
        },
        components: {
            KeyMetricsTable,
            CorePieChart,
            TreeMapChart
        },
        computed: {
            countryList () {
                let countryList = JSON.parse(this.getStore('countryList'))
                // let countryList = this.$store.state.dict.countryList
                let countryCode = []
                _.forEach(countryList, item => {
                    countryCode.push(item.shortCode)
                })
                this.checkedCountry = countryCode
                this.checkedCountryOne = countryCode
                this.checkedCountryTwo = countryCode
                this.checkedCountryThree = countryCode
                this.countryOptions = countryCode
                this.countryOptionsOne = countryCode
                this.countryOptionsTwo = countryCode
                this.countryOptionsThree = countryCode
                return countryList
            }
        },
        created() {
            this.getCountryList()
            this.getDataCenterTypeDataEnum()
            this.startTime = (moment().startOf('day').unix() * 1000 - 7 *24 * 60 *60 *1000)
            this.endTime = moment().endOf('day').unix() * 1000
            this.timeList = [this.startTime, this.endTime]
            this.dateList[0] = moment(this.startTime).format('YYYY-MM-DD')
            this.dateList[1] = moment(this.endTime).format('YYYY-MM-DD')
            this.mouth = parseInt(this.dateList[1].substring(5,7))
        },
        mounted() {
            this.getCoreIndicatorPlatformGMVPieChart()
            this.getCoreIndicatorNormalGMVPieChartTwo()
            this.getCoreIndicatorNormalGMVPieChart()
        },
        methods: {
            // 获取国家数据字典
            getCountryList() {
                let params = {
                    pageSize: 100,
                    pageNum: 1
                }
                getCountryList(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.setStore("countryList", res.countryInfo)
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            getAllData(data) {
                this.startTime = data[0]
                this.endTime = data[1]
                this.timeList = [this.startTime, this.endTime]
                this.dateList[0] = moment(this.startTime).format('YYYY-MM-DD')
                this.dateList[1] = moment(this.endTime).format('YYYY-MM-DD')
                this.mouth = parseInt(this.dateList[1].substring(5,7))
                this.getCoreIndicatorDataList()
                 this.getCoreIndicatorPlatformGMVPieChart()
                if (this.activeType === 'userLevel') {
                   this.getCoreIndicatorNormalGMVPieChart()
                } else if (this.activeType === 'orderType') {
                    this.getCoreIndicatorNormalGMVPieChartTwo()
                } else {
                    this.getCoreIndicatorNormalGMVPieChartThree()
                }
            },
            getDataCenterTypeDataEnum() {
                let params = {}
                getDataCenterTypeData(params).then((res) => {
                    let dataTypeList = []
                    let dataTypeObjList = []
                    if (res.ret.errcode === 1) {
                       _.forEach(res.CoreInfo, (item, index) => {
                           let typeCode = parseInt(item.typeCode)
                           if (typeCode < 26 ) {
                               dataTypeList.push(typeCode)
                           }
                           if (typeCode === 1) {
                               item.module = '合计'
                           } else if (typeCode > 1 && typeCode <= 5) {
                               item.module = '礼包'
                           } else if (typeCode > 5 && typeCode <= 13) {
                               item.module = '普货'
                           } else if (typeCode > 13 && typeCode <=15) {
                               item.module = '新人'
                           } else if (typeCode > 15 && typeCode <=18) {
                               item.module = '会员'
                           } else if (typeCode > 18 && typeCode <=22) {
                               item.module = '采购'
                           } else if (typeCode > 22 && typeCode <=25) {
                               item.module = '物流'
                           }
                           dataTypeObjList[24-index]= item
                       })
                    }
                    this.dataTypeList = dataTypeList
                    this.dataTypeObjList = dataTypeObjList
                    this.getCoreIndicatorDataList()
                })
            },
            handleCheckAllCountryChange(val) {
                this.checkedCountry = val ? this.countryOptions : [];
                this.isCountryIndeterminate = false;
            },
            handleCheckedCountryChange(value) {
                let checkedCount = value.length;
                this.checkAllCountry = checkedCount === this.countryList.length;
                this.isCountryIndeterminate = checkedCount > 0 && checkedCount < this.countryList.length;
                this.getCoreIndicatorPlatformGMVPieChart()
            },
            handleTabClick(tab) {
                if (tab.name === 'userLevel') {
                    this.getCoreIndicatorNormalGMVPieChart()
                }
                if (tab.name === 'orderType') {
                    this.getCoreIndicatorNormalGMVPieChartTwo()
                }
                if (tab.name === 'productCate') {
                    this.getCoreIndicatorNormalGMVPieChartThree()
                }
            },
            getCoreIndicatorDataList() {
                this.loading = true
                let params = {
                    startTime: this.startTime + '',
                    endTime: this.endTime + '',
                    dataType: this.dataTypeList
                }
                coreIndicatorDataList(this.filterData(params)).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.keyMetricsTableData = res.tableData
                        let labelLeft = {
                            normal: {
                                position: 'left'
                            }
                        }
                        let labelRight = {
                            normal: {
                                position: 'right'
                            }
                        }
                        let tableChartData = []
                        _.forEach(this.keyMetricsTableData, (item, index) => {
                            if (item.MoM <= 0) {
                                tableChartData[24-index] =
                                {
                                    target: this.dataTypeObjList[24-index].typename,
                                    module: this.dataTypeObjList[24-index].module,
                                    monthlyData: item.monthlyData,
                                    dataType: item.dataType,
                                    progress: item.progress,
                                    periodData: item.periodData,
                                    value: item.MoM,
                                    label: labelLeft,
                                    date: this.dateList,
                                }
                            }  else {
                                tableChartData[24-index] = {
                                    target: this.dataTypeObjList[24-index].typename,
                                    module: this.dataTypeObjList[24-index].module,
                                    monthlyData: item.monthlyData,
                                    dataType: item.dataType,
                                    progress: item.progress,
                                    periodData: item.periodData,
                                    value: item.MoM,
                                    label: labelRight,
                                    date: this.dateList,
                                }
                            }
                        })
                        this.tableChartData = tableChartData
                    }
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            },
            // 全平台GMV分析
            getCoreIndicatorPlatformGMVPieChart() {
                let params = {
                    startTime: this.startTime + '',
                    endTime: this.endTime + '',
                    countryCode: this.checkedCountry
                }
                this.plantLoading = true
                this.userLevelGMVData = null
                coreIndicatorPlatformGMVPieChart(this.filterData(params)).then((res) => {
                    this.plantLoading = false
                    let GiftPieList = []
                    let NormalPieList = []
                    let B2BPieList = []
                    let costgoPieList = []
                    let totalValue = 0
                    let GiftValue = 0
                    let NormalValue = 0
                    let B2BValue = 0
                    let costgoValue = 0
                    if (res.ret.errcode === 1) {
                        _.forEach(res.pieData, item => {
                            totalValue = totalValue + item.volume
                            item.value = item.volume
                            item.name = item.countryCode
                            item.legendname = item.countryCode
                            if (item.orderType === 'Gift') {
                                GiftValue = GiftValue + item.volume
                                GiftPieList.push(item)
                            } else if (item.orderType === 'Normal') {
                                NormalValue = NormalValue + item.volume
                                NormalPieList.push(item)
                            } else if (item.orderType === 'B2B') {
                                B2BValue = B2BValue + item.volume
                                B2BPieList.push(item)
                            } else if (item.orderType === 'costgo') {
                                costgoValue = costgoValue + item.volume
                                costgoPieList.push(item)
                            }
                        })
                        this.allGMVGiftPie = GiftPieList
                        this.allGMVB2BPie = B2BPieList
                        this.allGMVNormaltPie = NormalPieList
                        this.allGMVCostgoPie = costgoPieList
                        console.log('this.allGMVB2BPie', this.allGMVB2BPie)
                        this.GMVGiftPercent = ((GiftValue/totalValue) * 100).toFixed(2)
                        this.GMVNormalPercent = ((NormalValue/totalValue) * 100).toFixed(2)
                        this.GMVB2BPercent = ((B2BValue/totalValue) * 100).toFixed(2)
                        this.GMVCostgoPercent = ((costgoValue/totalValue) * 100).toFixed(2)
                    }
                }).catch((err) => {
                    console.log(err)
                    this.plantLoading = false
                })
            },
            handleCheckAllCountryChangeOne(val) {
                this.checkedCountryOne = val ? this.countryOptionsOne : [];
                this.isCountryIndeterminateOne = false;
                this.getCoreIndicatorNormalGMVPieChart()
            },
            handleCheckedCountryChangeOne(value) {
                let checkedCount = value.length;
                this.checkAllCountryOne = checkedCount === this.countryList.length;
                this.isCountryIndeterminateOne = checkedCount > 0 && checkedCount < this.countryList.length;
                this.getCoreIndicatorNormalGMVPieChart()
            },
            getCoreIndicatorNormalGMVPieChart() {
                let params = {
                    startTime: this.startTime + '',
                    endTime: this.endTime + '',
                    countryCode: this.checkedCountryOne,
                    dataType: 26
                }
                this.levelLoading = true
                coreIndicatorNormalGMVPieChart(params).then((res) => {
                    this.levelLoading = false
                    if (res.ret.errcode === 1) {
                        let total = 0
                        _.forEach(res.pieData, item => {
                            item.value = item.volume
                            item.name = item.typeTwo
                            item.legendname = item.typeTwo
                            total = total + item.volume
                        })
                        let resultGroupObj = _.groupBy(res.pieData, 'countryCode')
                        this.userLevelGMVData = JSON.parse(JSON.stringify(resultGroupObj))
                        this.resutCountryList = Object.getOwnPropertyNames(resultGroupObj)
                        this.spanValue = 24 / this.resutCountryList.length
                        let levelItemTotalList = []
                        _.forEach(this.userLevelGMVData, (item, key) => {
                            let levelItemTotal = 0
                            _.forEach(item, levelItem => {
                                levelItemTotal = levelItemTotal + levelItem.volume
                            })
                            levelItemTotalList.push(levelItemTotal)
                        })
                        let persentListTemp = []
                        _.forEach(levelItemTotalList, item => {
                            persentListTemp.push(Number(((item/total) * 100).toFixed(2)))
                        })
                        this.persentList = persentListTemp
                        var myEvent = new Event('resize');
                        window.dispatchEvent(myEvent);
                        console.log(this.userLevelGMVData)
                        _.forEach()
                    }

                }).catch(err => {
                    console.log(err)
                    this.levelLoading = false
                })
            },
            getCoreIndicatorNormalGMVPieChartTwo() {
                let params = {
                    startTime: this.startTime + '',
                    endTime: this.endTime + '',
                    countryCode: this.checkedCountryTwo,
                    dataType: 27
                }
                this.levelLoading = true
                coreIndicatorNormalGMVPieChart(params).then((res) => {
                    this.levelLoading = false
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        let total = 0
                        _.forEach(res.pieData, item => {
                            item.value = item.volume
                            item.name = item.typeTwo
                            item.legendname = item.typeTwo
                            total = total + item.volume
                        })
                        let resultGroupObj = _.groupBy(res.pieData, 'countryCode')
                        this.orderTypeGMVData = JSON.parse(JSON.stringify(resultGroupObj))
                        this.resutCountryList = Object.getOwnPropertyNames(resultGroupObj)
                        this.spanValue = 24 / this.resutCountryList.length
                        let levelItemTotalList = []
                        _.forEach(this.orderTypeGMVData, (item, key) => {
                            let levelItemTotal = 0
                            _.forEach(item, levelItem => {
                                levelItemTotal = levelItemTotal + levelItem.volume
                            })
                            levelItemTotalList.push(levelItemTotal)
                        })
                        let persentListTemp = []
                        _.forEach(levelItemTotalList, item => {
                            persentListTemp.push(Number(((item/total) * 100).toFixed(2)))
                        })
                        this.persentList = persentListTemp
                        var myEvent = new Event('resize');
                        window.dispatchEvent(myEvent);
                    }

                }).catch(err => {
                    console.log(err)
                    this.levelLoading = false
                })
            },
            handleCheckAllCountryChangeTwo(val) {
                console.log(val)
                this.checkedCountryTwo = val ? this.countryOptionsTwo : [];
                this.isCountryIndeterminateTwo = false;
                this.getCoreIndicatorNormalGMVPieChartTwo()
            },
            handleCheckedCountryChangeTwo(value) {
                let checkedCount = value.length;
                this.checkAllCountryTwo = checkedCount === this.countryList.length;
                this.isCountryIndeterminateTwo = checkedCount > 0 && checkedCount < this.countryList.length;
                this.getCoreIndicatorNormalGMVPieChartTwo()
            },
            getCoreIndicatorNormalGMVPieChartThree() {
                let params = {
                    startTime: this.startTime + '',
                    endTime: this.endTime + '',
                    // startTime: '1573404440000',
                    // endTime: '1583056040000',
                    countryCode: this.checkedCountryThree,
                    dataType: 28
                }
                coreIndicatorNormalGMVPieChart(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        let total = 0
                        _.forEach(res.pieData, item => {
                            item.value = item.volume
                            item.name = item.typeTwo
                            total = total + item.volume
                        })
                        let resultGroupObj = _.groupBy(res.pieData, 'countryCode')
                        this.productCateGMVData = JSON.parse(JSON.stringify(resultGroupObj))
                        this.resutCountryList = Object.getOwnPropertyNames(resultGroupObj)
                        let cateItemTotalList = []
                        _.forEach(this.productCateGMVData, (item, key) => {
                            let cateItemTotal = 0
                            _.forEach(item, cateItem => {
                                cateItemTotal = cateItemTotal + cateItem.volume
                            })
                            cateItemTotalList.push(cateItemTotal)
                        })
                        this.spanValue = 24 / this.resutCountryList.length
                        let persentListTemp = []
                        _.forEach(cateItemTotalList, item => {
                            persentListTemp.push(Number(((item/total) * 100).toFixed(2)))
                        })
                        this.persentList = persentListTemp
                    }

                })
            },
             handleCheckAllCountryChangeThree(val) {
                console.log(val)
                this.checkedCountryThree = val ? this.countryOptionsThree : [];
                this.isCountryIndeterminateThree = false;
                this.getCoreIndicatorNormalGMVPieChartThree()
            },
            handleCheckedCountryChangeThree(value) {
                let checkedCount = value.length;
                this.checkAllCountryThree = checkedCount === this.countryList.length;
                this.isCountryIndeterminateThree = checkedCount > 0 && checkedCount < this.countryList.length;
                this.getCoreIndicatorNormalGMVPieChartThree()
            },
        }
    }
</script>

<style lang="scss">

</style>

<style lang="scss" scoped>
    .traffic-flow {
        height: 95vh;
        width: 100%;
        padding: 14px;
        background-position: center;
        overflow: auto;
        .key-metrics-table {
            height: 650px;
            min-width: 1350px;
        }
        .filter-item {
            padding-left: 20px;
            margin-top: 80px;
        }
        .platform-product {
            height: 530px;
            h1 {
                padding: 10px;
                font-size: 16px;
                font-weight: 600;
            }
            .pie-title {
                text-align: center;
                font-size: 20px;
                font-weight: 600;
                span {
                    font-size: 14px;
                    font-weight: 400;
                    margin-left: 4px;
                    color: #909399;
                }
            }
            .funnel-chart {
                height: 400px;
                width: 600px;
            }
        }
        .custom-product {
            height: 620px;
        }
    }
</style>
