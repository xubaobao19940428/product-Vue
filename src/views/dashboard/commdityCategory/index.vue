<template>
    <div class="commdity-category">
        <el-row :gutter="12" class="num-row">
            <el-col :span="12" v-for="(item, index) in statisticsTodayCategory" :key="index">
                <el-card shadow="never" class="increase-num" v-if="item.type !== '品类下架'">
                    <div class="member-title">
                        <div>{{item.type}}</div>
                        <el-tooltip
                            class="item-icon"
                            effect="dark"
                            :content="cardInfo[index]"
                            placement="top"
                        >
                            <i class="el-icon-warning-outline"></i>
                        </el-tooltip>
                    </div>
                    <div class="member-time">{{new Date().getTime() | dateTimeFormat}} | 今日</div>
                    <div>
                        <span class="human-num">{{item.data}}</span>
                        <span class="human">sku</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-card shadow="never" class="table-card">
            <various-table :exportFile="commonExport"></various-table>
        </el-card>
        <el-card shadow="never" class="table-card">
            <movable-goods :exportFile="commonExport"></movable-goods>
        </el-card>
        <el-card shadow="never" class="table-card">
            <movable-user-goods :exportFile="commonExport"></movable-user-goods>
        </el-card>
        <el-card shadow="never" class="table-card">
            <purchase-situation :exportFile="commonExport"></purchase-situation>
        </el-card>
        <el-row :gutter="12" class="pie-box">
            <el-col :span="12">
                <el-card class="pieChart">
                    <div class="pie-title">
                        <div>取消订单的品类占比</div>
                        <div @click="timeCancleChange()" class="line-chart-time">
                            {{dateRangeCancleTimeStamp[0]}}~{{dateRangeCancleTimeStamp[1]}}
                            <i
                                class="iconfont"
                            >&#xe65b;</i>
                        </div>
                    </div>
                    <pie-chart :pieData="cancleData" unit="%"></pie-chart>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="pieChart">
                    <div class="pie-title">
                        <div>申请退货的品类占比</div>
                        <div @click="timeRetuenChange()" class="line-chart-time">
                            {{dateRangeReturnTimeStamp[0]}}~{{dateRangeReturnTimeStamp[1]}}
                            <i
                                class="iconfont"
                            >&#xe65b;</i>
                        </div>
                    </div>
                    <pie-chart :pieData="returnData" unit="%"></pie-chart>
                </el-card>
            </el-col>
        </el-row>
        <!-- <el-row class="pie-box">
            <el-col>
                <el-card class="pieChart">
                    <div class="pie-title">
                        <div class="line-one">
                            <div>各品类复购情况</div>
                            <div @click="timeGraininessChange()" class="line-chart-time">
                                {{dateRangeGraininessTimeStamp[0][graininess][0]}}~{{dateRangeGraininessTimeStamp[0][graininess][1]}}
                                <i class="iconfont">&#xe65b;</i>
                            </div>
                        </div>
                        <div class="line-two">
                            <div>粒度：</div>
                            <el-select v-model="graininess" @change="graininessChange" size="small">
                                <el-option
                                v-for="item in graininessList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                        </el-select>
                        </div>
                    </div>
                    <line-chart :ref="this.graininess" :lineData="lineDataMap[this.graininess]" :unit="'%'"></line-chart>
                </el-card>
            </el-col>
        </el-row>-->
        <time-chose
            :dialogVisible="timeDialogVisible"
            :timeMark="timeMark"
            @on-cancle="cancleTime"
            @on-confirm="confirmTime"
        ></time-chose>
    </div>
</template>
<script>
    // import moment from 'moment'
    import {
        StatisticsTodayCategory,
        GetCancelCategoryRate,
        GetReturnCategoryRate,
        GetRepeatedBuyCateDetail
    } from "@/request/commdityCategory";
    import { RouteAndExport } from "@/request/fileCenter";
    import timeChose from "../memberTeam/components/timeChose";
    import variousTable from "./components/variousTable";
    import movableGoods from "./components/movableGoods";
    import movableUserGoods from "./components/movableUserGoods";
    import purchaseSituation from "./components/purchaseSituation";
    import pieChart from "./components/pieChart";
    import lineChart from "./components/lineChart";

    export default {
        data() {
            return {
                statisticsTodayCategory: [],
                cardInfo: [
                    "统计周期内，新上架的sku数量，包括曾经下架又在周期内上架的商品",
                    "统计周期内，在架的商品数量，实时刷新",
                    "统计周期内按sku，执行下架操作的商品数量"
                ],
                dateRangeCancleTimeStamp: [
                    moment()
                    .subtract("days", 30)
                    .format("YYYY-MM-DD"),
                    moment()
                    .subtract("days", 1)
                    .format("YYYY-MM-DD")
                ],
                dateRangeReturnTimeStamp: [
                    moment()
                    .subtract("days", 30)
                    .format("YYYY-MM-DD"),
                    moment()
                    .subtract("days", 1)
                    .format("YYYY-MM-DD")
                ],
                timeDialogVisible: false,
                timeMark: "",
                cancleData: [],
                returnData: [],
                graininess: "5",
                graininessList: [
                    {
                        value: "5",
                        label: "日"
                    },
                    {
                        value: "6",
                        label: "周"
                    },
                    {
                        value: "7",
                        label: "月"
                    }
                ],
                dateRangeGraininessTimeStamp: [
                    {
                        "5": [
                            moment()
                            .subtract("days", 30)
                            .format("YYYY-MM-DD"),
                            moment()
                            .subtract("days", 1)
                            .format("YYYY-MM-DD")
                        ],
                        "6": [
                            moment()
                            .subtract("days", 30)
                            .format("YYYY-MM-DD"),
                            moment()
                            .subtract("days", 1)
                            .format("YYYY-MM-DD")
                        ],
                        "7": [
                            moment()
                            .subtract("days", 30)
                            .format("YYYY-MM-DD"),
                            moment()
                            .subtract("days", 1)
                            .format("YYYY-MM-DD")
                        ]
                    }
                ],
                lineDataMap: {
                    "5": {},
                    "6": {},
                    "7": {}
                }
            };
        },
        components: {
            timeChose,
            variousTable,
            movableGoods,
            movableUserGoods,
            purchaseSituation,
            lineChart,
            pieChart
        },
        mounted() {
            this.getStatisticsTodayCategory();
            this.getGetCancelCategoryRate();
            this.getGetReturnCategoryRate();
            this.getGetRepeatedBuyCateDetail();
        },
        methods: {
            getStatisticsTodayCategory() {
                let params = {
                    flag: ""
                };
                StatisticsTodayCategory(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res);
                        this.statisticsTodayCategory = res.todayCategory;
                    }
                });
            },
            getGetRepeatedBuyCateDetail() {
                let start =
                    this.dateRangeGraininessTimeStamp[0][this.graininess][0] +
                    " 00:00:00";
                let end =
                    this.dateRangeGraininessTimeStamp[0][this.graininess][1] +
                    " 23:59:59";
                let startTime = moment(start, "YYYY-MM-DD HH:mm:ss")
                .valueOf()
                .toString();
                let endTime = moment(end, "YYYY-MM-DD HH:mm:ss")
                .valueOf()
                .toString();
                let params = {
                    startTime: startTime,
                    endTime: endTime,
                    type: this.graininess
                };
                GetRepeatedBuyCateDetail(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res);
                        if (this.graininess === "5") {
                            let series = {};
                            let xAxis = [];
                            let cateName = [];
                            _.forEach(res.repeatedBuyProduct, point => {
                                xAxis.push(
                                    moment(point.dataType).format("YYYY-MM-DD")
                                );
                                cateName.push(point.cateName);
                            });
                            for (const iterator of this.checkArray(cateName)) {
                                series[iterator] = [];
                                for (const val of res.repeatedBuyProduct) {
                                    if (iterator === val.cateName) {
                                        series[val.cateName].push(
                                            (val.cateRate * 100).toFixed(2)
                                        );
                                    }
                                }
                            }
                            this.lineDataMap[this.graininess] = {
                                series: series,
                                xAxis: this.checkArray(xAxis),
                                cateName: this.checkArray(cateName)
                            };
                            console.log("===>", this.lineDataMap);
                        } else {
                            let series = {};
                            let xAxis = [];
                            let copy = [];
                            let cateName = [];
                            _.forEach(res.repeatedBuyProduct, point => {
                                copy.push(point.dataType);
                                cateName.push(point.cateName);
                            });
                            if (this.graininess === "6") {
                                for (
                                    let i = 0;
                                    i < this.checkArray(copy).length;
                                    i++
                                ) {
                                    let x = "第" + (i + 1) + "周";
                                    xAxis.push(x);
                                }
                            } else {
                                for (
                                    let i = 0;
                                    i < this.checkArray(copy).length;
                                    i++
                                ) {
                                    let x = "第" + (i + 1) + "月";
                                    xAxis.push(x);
                                }
                            }
                            console.log(xAxis);
                            console.log(this.checkArray(cateName));
                            for (const iterator of this.checkArray(cateName)) {
                                series[iterator] = [];
                                for (const val of res.repeatedBuyProduct) {
                                    if (iterator === val.cateName) {
                                        series[val.cateName].push(
                                            (val.cateRate * 100).toFixed(2)
                                        );
                                    }
                                }
                                // console.log(series)
                            }
                            this.lineDataMap[this.graininess] = {
                                series: series,
                                xAxis: this.checkArray(xAxis),
                                cateName: this.checkArray(cateName)
                            };
                            console.log(this.lineDataMap);
                        }
                    }
                });
            },
            checkArray(arr) {
                let result = [];
                for (let i = 0, len = arr.length; i < len; i++) {
                    if (result.indexOf(arr[i]) == -1) {
                        result.push(arr[i]);
                    }
                }
                return result.sort(function(a, b) {
                    return moment(a).valueOf() - moment(b).valueOf();
                });
            },
            getGetCancelCategoryRate() {
                // let params = {
                //     startTime: this.dateRangeCancleTimeStamp[0],
                //     endTime: this.dateRangeCancleTimeStamp[1]
                // }
                let start = this.dateRangeCancleTimeStamp[0] + " 00:00:00";
                let end = this.dateRangeCancleTimeStamp[1] + " 23:59:59";
                let startTime = moment(start, "YYYY-MM-DD HH:mm:ss")
                .valueOf()
                .toString();
                let endTime = moment(end, "YYYY-MM-DD HH:mm:ss")
                .valueOf()
                .toString();
                let params = {
                    startTime: startTime,
                    endTime: endTime
                };
                GetCancelCategoryRate(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res);
                        let cancleDataList = [];
                        let sum = 0;
                        for (const iterator of res.cancelCatRate) {
                            sum += Number(iterator.cateValue);
                        }
                        console.log(sum);
                        _.forEach(res.cancelCatRate, (item, index) => {
                            let cancleDataObj = {};
                            cancleDataObj.value =
                                (Number(item.cateValue) / Number(sum)).toFixed(2) *
                                100;
                            cancleDataObj.legendname = item.cateName;
                            cancleDataList.push(cancleDataObj);
                        });
                        console.log(cancleDataList);
                        this.cancleData = cancleDataList;
                    }
                });
            },
            getGetReturnCategoryRate() {
                // let params = {
                //     startTime: this.dateRangeReturnTimeStamp[0],
                //     endTime: this.dateRangeReturnTimeStamp[1]
                // }
                let start = this.dateRangeReturnTimeStamp[0] + " 00:00:00";
                let end = this.dateRangeReturnTimeStamp[1] + " 23:59:59";
                let startTime = moment(start, "YYYY-MM-DD HH:mm:ss")
                .valueOf()
                .toString();
                let endTime = moment(end, "YYYY-MM-DD HH:mm:ss")
                .valueOf()
                .toString();
                let params = {
                    startTime: startTime,
                    endTime: endTime
                };
                GetReturnCategoryRate(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res);
                        let returnDataList = [];
                        let sum = 0;
                        for (const iterator of res.returnCatRate) {
                            sum += Number(iterator.cateValue);
                        }
                        _.forEach(res.returnCatRate, (item, index) => {
                            let returnDataObj = {};
                            returnDataObj.value =
                                (Number(item.cateValue) / Number(sum)).toFixed(2) *
                                100;
                            returnDataObj.legendname = item.cateName;
                            returnDataList.push(returnDataObj);
                        });
                        console.log(returnDataList);
                        this.returnData = returnDataList;
                    }
                });
            },
            graininessChange(val) {
                this.graininess = val;
                this.getGetRepeatedBuyCateDetail();
            },
            timeGraininessChange() {
                this.timeMark = "graininess";
                this.timeDialogVisible = true;
            },
            timeCancleChange() {
                this.timeMark = "cancle";
                this.timeDialogVisible = true;
            },
            timeRetuenChange() {
                this.timeMark = "return";
                this.timeDialogVisible = true;
            },
            cancleTime() {
                this.timeDialogVisible = false;
            },
            confirmTime(timeMark, dateRange, dateRangeTimeStamp) {
                console.log(timeMark, dateRange, dateRangeTimeStamp);
                if (this.timeMark === "cancle") {
                    this.dateRangeCancleTimeStamp = dateRange;
                    this.getGetCancelCategoryRate();
                } else if (this.timeMark === "return") {
                    this.dateRangeReturnTimeStamp = dateRange;
                    this.getGetReturnCategoryRate();
                } else if ((this.timeMark = "graininess")) {
                    this.dateRangeGraininessTimeStamp[0][
                        this.graininess
                        ] = dateRange;
                    this.getGetRepeatedBuyCateDetail();
                }
                this.timeDialogVisible = false;
            },
            commonExport(params) {
                RouteAndExport({
                    type: 1,
                    param: JSON.stringify(params)
                })
                .then(response => {
                    if (response.ret.errcode == 1) {
                        switch (response.code) {
                            case 1:
                            case 2:
                            case 3:
                                this.$notify({
                                    title: "生成导出任务成功",
                                    message:
                                        "导出的数据文件正在生成中，请至文件中心查看进度并下载",
                                    type: "success",
                                    onClose: () => {
                                        this.$router.push(
                                            "/fileCenter/exportList"
                                        );
                                    },
                                    duration: 1500
                                });
                                break;
                            case 4:
                                this.$notify({
                                    title: "生成导出任务失败",
                                    message: "任务生成失败，请稍后再试",
                                    type: "info"
                                });
                                break;
                            case 5:
                                this.$notify({
                                    title: "导出限制",
                                    message:
                                        "相同参数的导出任务，同个用户15分钟内只允许导出一次",
                                    type: "info"
                                });
                                break;

                            case 6:
                                this.$notify({
                                    title: "请勿反复提及导出任务",
                                    message: "请勿重复提交，30秒后再尝试",
                                    type: "info"
                                });
                            default:
                                break;
                        }
                    }
                })
                .catch(err => {
                    console.error(err);
                });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .commdity-category {
        width: 100%;
        overflow: auto;
        .table-card {
            margin-top: 5px;
        }
        .member-title {
            display: flex;
            justify-content: flex-start;
            font-size: 20px;
            font-weight: 500;
            .item-icon {
                font-size: 14px;
                color: rgb(209, 209, 208);
            }
        }
        .member-time {
            margin-bottom: 10px;
            margin-top: 5px;
            font-size: 14px;
            color: rgb(209, 209, 208);
        }
        .human-num {
            font-size: 24px;
            font-weight: 500;
        }
        .human {
            font-size: 12px;
            padding-left: 5px;
        }
        .line-chart-time {
            margin-left: 20px;
            color: rgb(209, 209, 208);
            font-size: 12px;
            cursor: pointer;
            .iconfont {
                color: rgb(193, 193, 193);
                font-size: 16px;
            }
        }
        .line-one {
            display: flex;
            justify-content: flex-start;
        }
        .line-two {
            display: flex;
            justify-content: flex-end;
        }
        .pie-box {
            margin-top: 10px;
        }
        .pie-title {
            display: flex;
            justify-content: space-between;
            padding-bottom: 20px;
            border-bottom: 1px solid rgb(209, 209, 208);
        }
        .pieChart {
            height: 400px;
        }
    }
</style>
