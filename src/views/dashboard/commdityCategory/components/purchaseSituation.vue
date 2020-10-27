<template>
    <div class="purchase-situation-table">
        <div class="table-top">
            <div class="table-title">
                <div class="title">各品类访购情况</div>
                <div @click="timeChange()" class="line-chart-time">
                    {{dateRangeVariousTimeStamp[0]}}~{{dateRangeVariousTimeStamp[1]}}
                    <i class="iconfont">&#xe65b;</i>
                </div>
            </div>
            <div class="chose-box">
                <el-select v-model="category" @change="categoryChange" size="medium">
                    <el-option
                        v-for="item in categoryList"
                        :key="item.val"
                        :label="item.label"
                        :value="item.val">
                    </el-option>
                </el-select>
                <el-button type="primary" class="out-btn" @click="exportTable">导出数据</el-button>
            </div>
        </div>
        <el-table
            id="purchasetable"
            :data="saleDetail"
            border
            v-loading="loading"
            style="width: 100%">
            <el-table-column label="日期" width="200" align="center" fixed="left">
                <template slot-scope="scope">
                    <div>
                        <div v-if="dateRangeVariousTimeStamp[0] !== dateRangeVariousTimeStamp[1]">
                            {{dateRangeVariousTimeStamp[0]}} ~ {{dateRangeVariousTimeStamp[1]}}
                        </div>
                        <div v-else>
                            {{dateRangeVariousTimeStamp[0]}}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="一级分类" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.catLevelOne}}
                </template>
            </el-table-column>
            <el-table-column label="二级分类" width="180" align="center" v-if="category == '2' || category == '3'">
                <template slot-scope="scope">
                    {{scope.row.catLevelTwo}}
                </template>
            </el-table-column>
            <el-table-column label="三级分类" width="180" align="center" v-if="category == '3'">
                <template slot-scope="scope">
                    {{scope.row.catLevelThree}}
                </template>
            </el-table-column>
            <el-table-column label="浏览商品详情页总次数" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.pvCount}}
                </template>
            </el-table-column>
            <el-table-column label="提交订单成功总次数" width="300" align="center">
                <template slot-scope="scope">
                    {{scope.row.orderNum}}
                </template>
            </el-table-column>
            <el-table-column label="访购比" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.visitBuyRate}}
                </template>
            </el-table-column>
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
                class="pagination">
            </el-pagination>
        </div>
        <time-chose :dialogVisible="timeDialogVisible" :timeMark="timeMark" @on-cancle="cancleTime" @on-confirm="confirmTime"></time-chose>
    </div>
</template>
<script>
    // import moment from 'moment'
    import XLSX from 'xlsx'
    import { GetCateVisitDetail, GetAllCategoryDetailToExcel } from '@/request/commdityCategory'
    import { dealShowFileSrc } from '@/js/common/globalMethod'
    import timeChose from '../../memberTeam/components/timeChose'
    let moment = window.moment

    export default {
        props: {
            exportFile: {
                type: Function,
                default: () => {}
            }
        },
        data () {
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
                loading:true,
                timeDialogVisible:false,
                timeMark:'',
                category:'1',
                categoryList:[{
                    val:'1',
                    label:'一级分类'
                },{
                    val:'2',
                    label:'二级分类'
                },{
                    val:'3',
                    label:'三级分类'
                }],
                dateRangeVariousTimeStamp: [moment().subtract('days', 30).format('YYYY-MM-DD'), moment().subtract('days', 1).format('YYYY-MM-DD')],
                dateRangeTimeStamp: []
            }
        },
        components: {
            timeChose
        },
        created() {
            let startTime = this.dateRangeVariousTimeStamp[0] + ' 00:00:00'
            let endTime = this.dateRangeVariousTimeStamp[1] + ' 23:59:59'
            this.dateRangeTimeStamp[0] = moment(startTime, 'YYYY-MM-DD HH:mm:ss').valueOf().toString()
            this.dateRangeTimeStamp[1] = moment(endTime, 'YYYY-MM-DD HH:mm:ss').valueOf().toString()
        },
        mounted () {
            this.getGetCateVisitDetail()
        },
        methods: {
            outputXlsxFile (data,header,xlsxName)  {

                const ws = XLSX.utils.json_to_sheet(data, header)

                const wb = XLSX.utils.book_new()

                XLSX.utils.book_append_sheet(wb, ws, xlsxName)

                XLSX.writeFile(wb, xlsxName + ".xlsx")

            },
            exportTable () {
                let params = {
                    name: '123',
                    startTime: this.dateRangeTimeStamp[0],
                    endTime: this.dateRangeTimeStamp[1],
                    type: this.category
                }
                this.exportFile(params);
                // GetAllCategoryDetailToExcel(params).then(res => {
                //     if(res.ret.errcode === 1){
                //         console.log(res)
                //         let url = this.dealShowFileSrc(res.excelUrl)
                //         window.open(`${url}`)
                //     }
                // })

                // let table = document.getElementById('purchasetable');
                // let worksheet = XLSX.utils.table_to_sheet(table);
                // let workbook = XLSX.utils.book_new();
                // XLSX.utils.book_append_sheet(workbook, worksheet, 'sheet');
                // // 以上四行也可以直接一行搞定，如果不需要对表格数据进行修改的话
                // // let workbook = XLSX.utils.table_to_book(document.getElementById('table'))
                // try {
                //     XLSX.writeFile(workbook, 'text.xlsx');
                // } catch(e) {
                //     console.log(e, workbook);
                // }
            },
            getGetCateVisitDetail () {
                this.loading = true
                console.log(this.dateRangeTimeStamp)
                let params ={
                    startTime: this.dateRangeTimeStamp[0],
                    endTime: this.dateRangeTimeStamp[1],
                    type:this.category,
                    page: this.queryData.page,

                }
                GetCateVisitDetail(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.loading = false
                        this.saleDetail = res.cateVisitDetail
                        this.total = Number(res.total)
                    }
                })
            },
            categoryChange (val) {
                this.category = val
                this.getGetCateVisitDetail()
            },
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getGetCateVisitDetail()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getGetCateVisitDetail()
            },
            timeChange () {
                this.timeDialogVisible = true
            },
            cancleTime () {
                this.timeDialogVisible = false
            },
            confirmTime (timeMark, dateRange, dateRangeTimeStamp) {
                console.log(timeMark, dateRange, dateRangeTimeStamp)
                this.dateRangeVariousTimeStamp = dateRange
                this.dateRangeTimeStamp = [dateRangeTimeStamp[0].toString(),dateRangeTimeStamp[1].toString()]
                this.timeDialogVisible = false
                this.getGetCateVisitDetail()
            },
        }
    }
</script>
<style lang="scss" scoped>
    .purchase-situation-table{
        .table-top{
            display: flex;
            justify-content: space-between;
            align-items: center;
            .table-title{
                display: flex;
                justify-content: flex-start;
                .title{
                    font-size: 18px;
                    font-weight: 500;
                }
            }
            .line-chart-time{
                margin-left: 20px;
                color: rgb(209, 209, 208);
                font-size: 12px;
                .iconfont{
                    color: rgb(193,193,193);
                    font-size: 16px;
                }
            }
        }
        .pagenation{
            display: flex;
            justify-content: flex-end;
        }
        .chose-box{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
        }
        .out-btn{
            margin-left: 20px;
        }
    }
</style>
