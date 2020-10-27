<template>
    <div class="various-table">
        <div class="table-top">
            <div class="table-title">
                <div class="title">各品类销售详情</div>
                <div @click="timeChange()" class="line-chart-time">
                    {{dateRangeVariousTimeStamp[0]}}~{{dateRangeVariousTimeStamp[1]}}
                    <i
                        class="iconfont"
                    >&#xe65b;</i>
                </div>
            </div>
            <div class="chose-box">
                <el-select v-model="category" @change="categoryChange" size="medium">
                    <el-option
                        v-for="item in categoryList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val"
                    ></el-option>
                </el-select>
                <el-button type="primary" class="out-btn" @click="exportTable">导出数据</el-button>
            </div>
        </div>
        <el-table
            id="varioustable"
            :data="saleDetail"
            border
            v-loading="loading"
            style="width: 100%"
        >
            <el-table-column label="日期" width="200" align="center" fixed="left">
                <template slot-scope="scope">
                    <div>
                        <div
                            v-if="dateRangeVariousTimeStamp[0] !== dateRangeVariousTimeStamp[1]"
                        >{{dateRangeVariousTimeStamp[0]}} ~ {{dateRangeVariousTimeStamp[1]}}</div>
                        <div v-else>{{dateRangeVariousTimeStamp[0]}}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="一级分类" width="180" align="center" v-if="category !== '4'">
                <template slot-scope="scope">{{scope.row.catLevelOne}}</template>
            </el-table-column>
            <el-table-column
                label="二级分类"
                width="180"
                align="center"
                v-if="category == '0' || category == '2' || category == '3'"
            >
                <template slot-scope="scope">{{scope.row.catLevelTwo}}</template>
            </el-table-column>
            <el-table-column
                label="三级分类"
                width="180"
                align="center"
                v-if="category == '0' || category == '3'"
            >
                <template slot-scope="scope">{{scope.row.catLevelThree}}</template>
            </el-table-column>
            <el-table-column label="商品ID" width="180" align="center" v-if="category =='0'">
                <template slot-scope="scope">{{scope.row.productId}}</template>
            </el-table-column>
            <el-table-column label="商品名称" width="300" align="center" v-if="category =='0'">
                <template slot-scope="scope">
                    <div class="product">
                        <img :src="dealShowFileSrc(scope.row.productPic)" class="product-img" />
                        <div class="product-name">{{scope.row.productName}}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="SKUCode" width="180" align="center" v-if="category =='0'">
                <template slot-scope="scope">{{scope.row.skuCode}}</template>
            </el-table-column>
            <el-table-column label="规格" width="250" align="center" v-if="category =='0'">
                <template
                    slot-scope="scope"
                >{{scope.row.skuValue && JSON.parse(scope.row.skuValue)[0].attrName}}{{scope.row.skuValue && ','}}{{scope.row.skuValue && JSON.parse(scope.row.skuValue)[0].valueName}}</template>
            </el-table-column>
            <el-table-column
                label="供应商ID"
                width="180"
                align="center"
                v-if="category =='4' || category =='0'"
            >
                <template slot-scope="scope">{{scope.row.supplierId}}</template>
            </el-table-column>
            <el-table-column
                label="供应商名称"
                width="180"
                align="center"
                v-if="category =='4' || category =='0'"
            >
                <template slot-scope="scope">{{scope.row.supplierName}}</template>
            </el-table-column>
            <el-table-column label="销售量" width="180" align="center">
                <template slot-scope="scope">{{scope.row.saleNum}}</template>
            </el-table-column>
            <el-table-column label="销售额" width="180" align="center">
                <template slot-scope="scope">{{scope.row.saleAmount}}</template>
            </el-table-column>
            <el-table-column label="PV" width="180" align="center">
                <template slot-scope="scope">{{scope.row.PV}}</template>
            </el-table-column>
            <el-table-column label="UV" width="180" align="center">
                <template slot-scope="scope">{{scope.row.UV}}</template>
            </el-table-column>
            <el-table-column label="PV/UV" width="180" align="center">
                <template slot-scope="scope">{{scope.row.UVDivPV}}</template>
            </el-table-column>
            <!-- <el-table-column label="毛利率" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.grossMargin}}
                </template>
            </el-table-column>-->
            <el-table-column label="国内云仓最新在库数" width="180" align="center">
                <template slot-scope="scope">{{scope.row.inStockCN}}</template>
            </el-table-column>
            <!-- <el-table-column label="国内云仓最新库存额" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.inStockCNAmount}}
                </template>
            </el-table-column>-->
            <el-table-column label="海外马来仓最新在库数" width="180" align="center">
                <template slot-scope="scope">{{scope.row.inStockMY}}</template>
            </el-table-column>
            <!-- <el-table-column label="海外马来仓最新库存额" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.inStockMYAmount}}
                </template>
            </el-table-column>-->
            <el-table-column label="泰国仓最新在库数" width="180" align="center">
                <template slot-scope="scope">{{scope.row.inStockTH}}</template>
            </el-table-column>
            <!-- <el-table-column label="泰国仓最新库存额" width="180" align="center" fixed="right">
                <template slot-scope="scope">
                    {{scope.row.inStockTHAmount}}
                </template>
            </el-table-column>-->
        </el-table>
        <div class="pagenation">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[5, 10, 15, 20]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination"
            ></el-pagination>
        </div>
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
    import XLSX from "xlsx";
    import {
        ShowCategorySaleDetail,
        GetAllCategoryDetailToExcel
    } from "@/request/commdityCategory";
    import { dealShowFileSrc } from "@/js/common/globalMethod";
    import timeChose from "../../memberTeam/components/timeChose";
    let moment = window.moment;

    export default {
        props: {
            exportFile: {
                type: Function,
                default: () => {}
            }
        },
        data() {
            return {
                saleDetail: [],
                queryData: {
                    page: {
                        pageSize: 5,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                },
                total: 0,
                loading: true,
                timeDialogVisible: false,
                timeMark: "",
                category: "0",
                categoryList: [
                    {
                        val: "0",
                        label: "按单品"
                    },
                    {
                        val: "1",
                        label: "一级分类"
                    },
                    {
                        val: "2",
                        label: "二级分类"
                    },
                    {
                        val: "3",
                        label: "三级分类"
                    },
                    {
                        val: "4",
                        label: "供应商"
                    }
                ],
                dateRangeVariousTimeStamp: [
                    moment()
                    .subtract("days", 30)
                    .format("YYYY-MM-DD"),
                    moment()
                    .subtract("days", 1)
                    .format("YYYY-MM-DD")
                ],
                dateRangeTimeStamp: [],
                exportData: [],
                headerTable: {
                    catLevelOne: "一级分类",
                    catLevelTwo: "二级分类",
                    catLevelThree: "三级分类",
                    firstPayNum: "新付费用户",
                    SH_Rate: "SH占比",
                    PS_Rate: "PS占比",
                    AM_Rate: "AM占比",
                    AT_Rate: "AT占比",
                    saleOrderPrice: "客单价",
                    saleOrderNum: "客件数",
                    repeatedBuyRate: "复购率"
                }
            };
        },
        components: {
            timeChose
        },
        created() {
            let startTime = this.dateRangeVariousTimeStamp[0] + " 00:00:00";
            let endTime = this.dateRangeVariousTimeStamp[1] + " 23:59:59";
            this.dateRangeTimeStamp[0] = moment(startTime, "YYYY-MM-DD HH:mm:ss")
            .valueOf()
            .toString();
            this.dateRangeTimeStamp[1] = moment(endTime, "YYYY-MM-DD HH:mm:ss")
            .valueOf()
            .toString();
        },
        mounted() {
            this.getShowCategorySaleDetail();
        },
        methods: {
            outputXlsxFile(data, header, xlsxName) {
                const ws = XLSX.utils.json_to_sheet(data, header);

                const wb = XLSX.utils.book_new();

                XLSX.utils.book_append_sheet(wb, ws, xlsxName);

                XLSX.writeFile(wb, xlsxName + ".xlsx");
            },
            exportTable() {
                let params = {
                    name: "120",
                    startTime: this.dateRangeTimeStamp[0],
                    endTime: this.dateRangeTimeStamp[1],
                    type: this.category
                };
                this.exportFile(params);
                // GetAllCategoryDetailToExcel(params).then(res => {
                //     if (res.ret.errcode === 1) {
                //         console.log(res);
                //         let url = this.dealShowFileSrc(res.excelUrl);
                //         window.open(`${url}`);
                //     }
                // });
                // let table = document.getElementById('varioustable');
                // let worksheet = XLSX.utils.table_to_sheet(table);
                // let workbook = XLSX.utils.book_new();
                // XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');
                // try {
                //     XLSX.writeFile(workbook, 'text.xlsx');
                // } catch(e) {
                //     console.log(e, workbook);
                // }
            },
            getShowCategorySaleDetail() {
                this.loading = true;
                console.log(this.dateRangeTimeStamp);
                let params = {
                    startTime: this.dateRangeTimeStamp[0],
                    endTime: this.dateRangeTimeStamp[1],
                    type: this.category,
                    page: this.queryData.page
                };
                ShowCategorySaleDetail(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res);
                        this.loading = false;
                        this.saleDetail = res.CategorySaleDetail;
                        this.total = Number(res.total);
                    }
                });
            },
            categoryChange(val) {
                this.category = val;
                this.getShowCategorySaleDetail();
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val;
                this.getShowCategorySaleDetail();
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val
                    ? val
                    : this.queryData.page.pageNum;
                this.getShowCategorySaleDetail();
            },
            timeChange() {
                this.timeDialogVisible = true;
            },
            cancleTime() {
                this.timeDialogVisible = false;
            },
            confirmTime(timeMark, dateRange, dateRangeTimeStamp) {
                console.log(timeMark, dateRange, dateRangeTimeStamp);
                this.dateRangeVariousTimeStamp = dateRange;
                // this.dateRangeTimeStamp = dateRangeTimeStamp
                this.dateRangeTimeStamp = [
                    dateRangeTimeStamp[0].toString(),
                    dateRangeTimeStamp[1].toString()
                ];

                this.timeDialogVisible = false;
                this.getShowCategorySaleDetail();
            }
        }
    };
</script>
<style lang="scss" scoped>
    .various-table {
        .table-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .table-title {
                display: flex;
                justify-content: flex-start;
                .title {
                    font-size: 18px;
                    font-weight: 500;
                }
            }
            .line-chart-time {
                margin-left: 20px;
                color: rgb(209, 209, 208);
                font-size: 12px;
                .iconfont {
                    color: rgb(193, 193, 193);
                    font-size: 16px;
                }
            }
        }
        .product {
            display: flex;
            justify-content: space-between;
            .product-img {
                width: 100px;
                height: 100px;
            }
            .product-name {
                width: 160px;
                text-align: left;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
            }
        }
        .pagenation {
            display: flex;
            justify-content: flex-end;
        }
        .chose-box {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        }
        .out-btn {
            margin-left: 20px;
        }
    }
</style>
