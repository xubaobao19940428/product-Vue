<template>
    <div class="key-metrics-table">
        <table style="vertical-align: middle;">
            <thead>
                <tr>
                    <th style="min-width:100px;">模块</th>
                    <th style="width:150px;" align="left">指标</th>
                    <th style="width:120px;" align="right">{{mouth}}月累计</th>
                    <th style="width:140px;" align="right">{{mouth}}月目标完成率</th>
                    <th style="width:200px;" align="right">{{dateList[0]}} ~ {{dateList[1]}}</th>
                    <th style="width:600px;" nowrap="nowrap">环比增长率</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td align="center">合计</td>
                    <td>
                        <el-tooltip class="item" effect="dark" content="全平台用户实际支付的交易额，包含所有订单类型，不扣除退款的数据" placement="top">
                            <span>GMV</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[0].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[0].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[0].periodData}}</td>
                    <td rowspan="26" class="border">
                        <div class="not-display">.</div>
                        <PlusOrMinusChart :chartData="chartData"></PlusOrMinusChart>
                    </td>
                </tr>
                <tr>
                    <td rowspan="4" align="center">礼包</td>
                    <td>
                        <el-tooltip class="item" effect="dark" content="全平台GMV中，礼包订单的GMV数据" placement="top">
                            <span>礼包GMV</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[1].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[1].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[1].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="礼包GMV中，马来西亚的数据" placement="top">
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;MY</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[2].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[2].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[2].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="礼包GMV中，新加坡的数据" placement="top">
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;SG</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[3].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[3].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[3].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="礼包GMV中，泰国的数据" placement="top">
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;TH</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[4].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[4].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[4].periodData}}</td>
                </tr>
                <tr>
                    <td rowspan="8" align="center">普货</td>
                    <td>
                        <el-tooltip class="item" effect="dark" content="全平台GMV中，广义普货订单的GMV数据（除了礼包、B2B订单外的所有订单类型）" placement="top">
                            <span>普货GMV</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[5].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[5].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[5].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="普货GMV中，马来西亚的金额" placement="top">
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;MY</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[6].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[6].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[6].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="普货GMV中，泰国的金额" placement="top">
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;SG</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[7].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[7].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[7].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="普货GMV中，新加坡的金额" placement="top">
                            <span>&nbsp;&nbsp;&nbsp;&nbsp;TH</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[8].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[8].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[8].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="爆款商品（爆款好物中的商品即为大爆款）产生的GMV占普货GMV的占比" placement="top">
                            <span>爆款占比</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[9].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[9].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[9].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="普货商品的订单数量，广义普货（除去礼包订单、b2b订单）" placement="top">
                            <span>普货单量</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[10].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[10].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[10].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="普货GMV/普货订单数" placement="top">
                            <span>普货客单价</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[11].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[11].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[11].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="下单普货成交UV/平台总UV" placement="top">
                            <span>普货转化率</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[12].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[12].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[12].periodData}}</td>
                </tr>
                <tr>
                    <td rowspan="2" align="center">新人</td>
                    <td>
                        <el-tooltip class="item" effect="dark" content="当天注册当天自己购买普货" placement="top">
                            <span>新注册当天转化率</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[13].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[13].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[13].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="新增注册的用户数量" placement="top">
                            <span>新注册用户数</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[14].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[14].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[14].periodData}}</td>
                </tr>
                <tr>
                    <td rowspan="3" align="center">会员</td>
                    <td>
                        <el-tooltip class="item" effect="dark" content="七天前成为ps的用户中，七日内发生开单行为（自购或推荐用户购买）的用户数/七天前成为ps的用户数量" placement="top">
                            <span>7日开单率</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[15].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[15].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[15].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="七天前成为ps的用户中，发生破零行为的用户数/七天前成为ps的用户数 （破零行为：关联下属有升级为ps）" placement="top">
                            <span>7日破零率</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[16].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[16].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[16].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="新增的PS人数" placement="top">
                            <span>新增PS数</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[17].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[17].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[17].periodData}}</td>
                </tr>

                <tr>
                    <td rowspan="4" align="center">采购</td>
                    <td>
                        <el-tooltip class="item" effect="dark" content="缺货的七天前礼包订单/七天前的总礼包订单，（七天前新增的礼包订单，到统计截止时有任何一个出库单未出库，即缺货）" placement="top">
                            <span>so7D缺货率-礼包</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[18].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[18].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[18].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="缺货的七天前普货订单/七天前的总普货订单，（七天前新增的普货订单，到统计截止时有任何一个出库单未出库，即缺货）" placement="top">
                            <span>so7D缺货率-普货</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[19].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[19].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[19].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="（只统计系统单）当天求和所有采购单{新增的采购单处理时间-采购单创建时间}/新增的采购单数，精确到小时保留一位小数" placement="top">
                            <span>JIT采购时效</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[20].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[20].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[20].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="缺货的七天前的采购单/七天前的总采购单，（七天前新增的采购单，到统计截止时有任何一个入库单未入库，即缺货采购单）" placement="top">
                            <span>po7D缺货率</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[21].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[21].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[21].periodData}}</td>
                </tr>

                <tr>
                    <td rowspan="3" align="center">物流</td>
                    <td>
                        <el-tooltip class="item" effect="dark" content="出库单维度，取今天出库的出库单，求和（出库时间-用户实际支付时间）/今日出库订单数，精确到小时保留一位小数" placement="top">
                            <span>出库时效</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[22].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[22].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[22].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="订单维度，取今天确认收货的订单，求和（到货时间-用户实际支付时间）/今日到货的订单数，精确到小时保留一位小数" placement="top">
                            <span>到货时效</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[23].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[23].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[23].periodData}}</td>
                </tr>
                <tr>
                    <td>
                        <el-tooltip class="item" effect="dark" content="统计周期内，执行慢必赔的订单/所有订单数量" placement="top">
                            <span>订单延时赔付比例</span>
                        </el-tooltip>
                    </td>
                    <td class="text-right">{{keyMetricsTableData[24].monthlyData}}</td>
                    <td class="text-right">{{keyMetricsTableData[24].progress || '-'}}</td>
                    <td class="text-center">{{keyMetricsTableData[24].periodData}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import PlusOrMinusChart from './PlusOrMinusChart'
    export default {
        props: {
            keyMetricsTableData: {
                type: Array,
                default: () => []
            },
            chartData: {
                type: Array,
                default: () => { return [] }
            },
            dateList: {
                type: Array,
                default: () => { return [] }
            },
            mouth: {
                type: Number,
                default: 1
            }
        },
        data() {
            return {
            };
        },
        components: {
            PlusOrMinusChart
        },
        watch: {

        },
        methods: {

        },
        mounted: function() {

        }
    };
</script>

<style lang="scss" scoped>
.key-metrics-table {
    table {
        thead {
            tr {
                height: 25px;
                font-weight: 600;
                border-bottom: 1px solid #ebeef5;
            }
        }
        tbody {
            font-size: 14px;
            td {
                vertical-align: middle;
                span {
                    vertical-align: middle;
                }
            }
            tr {
                height: 23px;
                border-bottom: 1px solid #ebeef5;
               .border {
                   border-right: 1px solid #ebeef5;
                   border-left: 1px solid #ebeef5;
               }
               .not-display {
                   height: 0px;
                   width: 0px;
                   color: #fff;
               }
            }
            .text-right {
                text-align: right;
            }
            .text-center {
                text-align: center;
            }
        }
    }
}

</style>
