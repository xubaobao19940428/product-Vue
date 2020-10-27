<template>
    <div class="hot-product">
        <el-row :gutter="8">
            <el-col :span="12">
                <p class="title">爆款商品数</p>
                <p class="num">{{spuNum || '-'}} <span class="unit">个SPU</span></p>
                <!-- <smooth-line-chart></smooth-line-chart> -->
            </el-col>
            <el-col :span="12">
                <p class="title">爆款商品贡献GMV</p>
                <p class="num">{{GMVNum || '-'}} <span class="unit">USD</span></p>
                <!-- <smooth-line-chart></smooth-line-chart> -->
            </el-col>
        </el-row>
        <div class="table-wrap">
            <el-table height="300" :data="tableDataList" border style="width: 100%;" >
                <el-table-column type="index" prop="" label="排名" align="center" width="50">
                </el-table-column>
                <el-table-column prop="productName" label="商品名称" align="center" min-width="120">
                    <template slot-scope="scope" >
                        <!-- <el-tooltip class="item" effect="dark" :content="scope.row.productName" placement="top"> -->
                            <span @click="jumpToProduct(scope.row.spuId)"
                                style="color:#409EFF; cursor: pointer; display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 1;-webkit-box-orient: vertical">
                                {{scope.row.productName}}
                            </span>
                        <!-- </el-tooltip> -->
                    </template>
                </el-table-column>
                <el-table-column prop="salesNumber" label="销量" width="80" align="center">
                </el-table-column>
                <el-table-column prop="changePP" label="同比涨跌" width="100" align="center">
                    <template slot-scope="scope" >
                        <span>{{scope.row.changePP | toDecimal2 }}%</span>
                        <div class="triangle-up" v-if="scope.row.changePP > 0"></div>
                        <div class="triangle-down" v-if="scope.row.changePP < 0"></div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[5, 10, 15]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                class="pagination">
            </el-pagination>
        </div> -->
    </div>
</template>

<script>
import SmoothLineChart from './SmoothLineChart'
export default {
    props: {
        spuNum: {
            type: String,
            default: ''
        },
        GMVNum: {
            type: String,
            default: ''
        },
        tableData: {
            type: Array,
            default: () => { return [] }
        }
    },
    data() {
        return {
            queryData: {
                page: {
                    pageNum: 1,
                    pageSize: 5
                }
            },
            totalCount: 0
        };
    },
    watch: {
        tableData: {
            handler(newVal, oldVal) {
                console.log(newVal, oldVal)
            },
            deep: true
        }
    },
    filters: {
        toDecimal2: function(x) {
            var f = parseFloat(x);
            if (isNaN(f)) {
                return '';
            }
            var f = Math.round(x * 100) / 100;
            var s = f.toString();
            var rs = s.indexOf('.');
            if (rs < 0) {
                rs = s.length;
                s += '.';
            }
            while (s.length <= rs + 2) {
                s += '0';
            }
            return Math.abs(s);
        }
    },
    computed: {
        tableDataList() {
            return this.tableData
        }
    },
    components: {
        SmoothLineChart
    },
    methods: {
        handleCurrentChange(val) {
            this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
        },
        handleSizeChange(val) {
            this.queryData.page.pageSize = val
        },
        jumpToProduct(spuId) {
            this.$router.push({
                path: '/product/productEditNew',
                query: { productId: spuId }
            })
        }
    },
    mounted: function() {
    }
};
</script>

<style lang="scss" scoped>
    .hot-product {
        .title {
            color: #929292;
            font-weight: 400;
            font-size: 14px;
        }
        .num {
            color: #5a5a5a;
            font-weight: 400;
            font-size: 28px;
        }
        .unit {
            font-size: 14px;
        }
        .table-wrap {
            margin-top: 10px;
        }
        .triangle-up{
            display: inline-block;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0px 6px 6px 6px;
            border-color: transparent transparent red;
            margin: 0 2px 3px 2px;
        }
        .triangle-down {
            display: inline-block;
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 6px 6px 0px 6px;
            border-color:  #15d6ba  transparent transparent transparent;
            margin: 0 2px 3px 2px;
        }
    }
</style>
