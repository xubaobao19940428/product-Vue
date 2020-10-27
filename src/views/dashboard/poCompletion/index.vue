<template>
  <div class="po-completion">
    <el-row :gutter="12" class="po-row">
      <el-col :span="24">
        <!--整体查询数据-->
        <el-card shadow="always">
          <el-form inline label-width="90px">
            <el-form-item label="采购日期：">
              <el-date-picker
                v-model="queryData.period"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="入库仓：">
              <el-select
                v-model="queryData.warehouseName"
                filterable
                size="medium"
                placeholder="请选择"
                @change="changeWare"
              >
                <el-option
                  v-for="(item, index) in wareList"
                  :key="index"
                  :label="item.label"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类目：">
              <el-select placeholder v-model="queryData.cateId" @change="changeCategory">
                <el-option v-for="item in cateList" :key="item.cateId" :label="item.cateName" :value="String(item.cateId)"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px">
              <el-button type="primary" size="medium" icon="el-icon-search" @click="search">搜索</el-button>
              <el-button size="medium" icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
              <el-button type="primary" size="medium" @click="commonExport">导出</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12" class="po-row">
        <el-col :span="24">
            <el-card shadow="always">
                <line-data :lineDataMap="lineDataMap.POModule"></line-data>
            </el-card>
        </el-col>
    </el-row>
    <el-row :gutter="12" class="po-row">
        <el-col :span="24">
            <el-card shadow="always">
                <div class="status-select">
                    <div>状态：</div>
                    <el-select v-model="queryData.status" size="medium" @change="changeClick">
                        <el-option
                            v-for="(item, index) in statusList"
                            :key="index"
                            :label="item.label"
                            :value="item.name"
                        ></el-option>
                    </el-select>
                </div>
                <el-table border :data="tableData">
                    <el-table-column label="采购日期" min-width="100px" align="center">
                        <template slot-scope="scope">
                            <div>{{ scope.row.purchaseDate }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="采购PO总数" min-width="100px" align="center">
                        <template slot-scope="scope">
                            <div>{{ scope.row.purchaseTotalNum }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="整单取消PO总数" min-width="100px" align="center">
                        <template slot-scope="scope">
                            <div class="column-click" @click="getPoIncomplete(scope.row.purchaseDate,'6')">{{  scope.row.cancelNum  }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100px" align="center">
                        <template slot="header" slot-scope="scope">
                            <div>
                                履约PO总数
                                <el-tooltip effect="dark" content="履约PO总数 = 采购PO总数 - 整单取消PO总数" placement="top">
                                    <i class="iconfont">&#xe680;</i>
                                </el-tooltip>
                            </div>
                        </template>
                        <template slot-scope="scope">
                            <div>{{ scope.row.validNum }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="待采购PO占比" min-width="100px" align="center">
                        <template slot-scope="scope">
                            <div class="column-click" @click="getPoIncomplete(scope.row.purchaseDate,'0')">{{ scope.row.yet2PurchaseData }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="待发货PO占比" min-width="100px" align="center">
                        <template slot-scope="scope">
                            <div class="column-click" @click="getPoIncomplete(scope.row.purchaseDate,'1')">{{ scope.row.yet2ShipData }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="待仓储签收PO占比" min-width="100px" align="center">
                        <template slot-scope="scope">
                            <div class="column-click" @click="getPoIncomplete(scope.row.purchaseDate,'2')">{{ scope.row.yet2SignData }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="待入库PO占比" min-width="100px" align="center">
                        <template slot-scope="scope">
                            <div class="column-click" @click="getPoIncomplete(scope.row.purchaseDate,'3')">{{ scope.row.yet2IncomeData }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="入库异常待处理PO占比" min-width="130px" align="center">
                        <template slot-scope="scope">
                            <div class="column-click" @click="getPoIncomplete(scope.row.purchaseDate,'4')">{{ scope.row.errorData }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="已完结PO占比" min-width="100px" align="center">
                        <template slot-scope="scope">
                            <div>{{ scope.row.completeData }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" min-width="100px" align="center" fixed="right">
                        <template slot-scope="scope">
                            <div class="">{{ scope.row.state }}</div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-box">
                    <el-pagination @size-change="handleSizeChanges"
                                @current-change="handleCurrentChanges"
                                :current-page="queryData.page.pageNum"
                                :page-sizes="[5, 10, 20, 50]"
                                :page-size="queryData.page.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="totals">
                    </el-pagination>
                </div>
            </el-card>
        </el-col>
    </el-row>
    <po-dialog v-if="dialogVisible" :dialogVisible="dialogVisible" :data="dataList" :queryData="queryData" :state="state" :time="time" @on-cancle="cancelDialog"></po-dialog>
  </div>
</template>
<script>
import { categoryListGet } from "@/request/product";
import { RouteAndExport } from "@/request/fileCenter";
import { PoCompletionRate, PoIncompleteOrderDetail } from "@/request/dataBoard";
import lineData from './components/lineData'
import poDialog from './components/poDialog'

export default {
    data () {
        return{
            queryData: {
                period: [moment().subtract(8, "days"), moment().subtract(1, "days")],
                warehouseName: '全部',
                status: "全部",
                cateId: "全部",
                page:{
                    pageSize:10,
                    pageNum:1
                }
            },
            state: '',
            time: '',
            totals: 0,
            wareList:[
                {
                    name: "全部",
                    label: "全部",
                },
                {
                    name: "马来仓",
                    label: "马来仓",
                },
                {
                    name: "泰国仓",
                    label: "泰国仓",
                },
                {
                    name: "东莞仓",
                    label: "东莞仓",
                }
            ],
            statusList: [
                {
                    name: "全部",
                    label: "全部",
                },
                {
                    name: "0",
                    label: "未完结",
                },
                {
                    name: "1",
                    label: "已完结",
                },
            ],
            cateList:[
                {   
                    cateId:'全部',
                    cateName:'全部'
                }
            ],
            lineDataMap: {
                POModule: {
                    xAxis: [],
                    normalData: [],
                    axle: []
                }
            },
            tableData: [],
            dataList: [],
            dialogVisible: false
        }
        
    },
    components: {
        lineData,
        poDialog
    },
    mounted () {
        this.fetchCategory({
            level: 1,
            cateType: 2,
            resolve: data => {
                this.cateList = [...this.cateList,...data]
            }
        })
        this.getPoCompletionRate()
    },
    methods: {
        // 获取分类
        fetchCategory({ id, cateType, level, pid, page, resolve }) {
            categoryListGet(
                this.filterData({
                pid: pid,
                id: id,
                level: level,
                cateType: cateType,
                page: page
                })
            ).then(res => {
                if (res.ret.errcode === 1) {
                for (let i = 0; i < res.categoryUnit.length; i++) {
                    res.categoryUnit[i]["levelValue"] = [];
                    let item = res.categoryUnit[i].cateNameValue.find(val => {
                    return val.languageCode == "cn";
                    });
                    res.categoryUnit[i]["cateName"] = item ? item.name : "";
                    if (cateType == 2) {
                    res.categoryUnit[i]["leaf"] = level > 2;
                    } else {
                    res.categoryUnit[i]["leaf"] = level > 1;
                    }
                }
                resolve && resolve(res.categoryUnit, res);
                }
            });
        },
        getPoCompletionRate () {
            console.log(this.queryData)
            let params ={
                startTime: this.queryData.period === null ? '' : moment(this.queryData.period[0]).valueOf().toString(),
                endTime: this.queryData.period === null ? '' : moment(this.queryData.period[1]).valueOf().toString(),
                warehouseName: this.queryData.warehouseName,
                cateOneId: this.queryData.cateId,
                status: this.queryData.status,
                page: this.queryData.page
            }
            PoCompletionRate(this.filterData(params)).then(res => {
                if (res.ret.errcode === 1) {
                    this.tableData = res.list
                    this.totals = res.totalNum
                    this.lineDataMap.POModule = this.changeAPIParams(res)
                }
            })
        },
        changeAPIParams (resultes) {
            let xAxis = [];
            let axle = [];
            let yAixs = [];
            _.forEach(resultes.graph, (item) => {
                xAxis.push({
                    name: item.type
                });
                _.forEach(item.point, (child) => {
                    child.tag = child.tag;
                    child.value = child.completionRate;
                    child.cancelNum = child.cancelNum;
                    child.errorData = child.errorData;
                    child.purchaseTotalNum = child.purchaseTotalNum;
                    child.yet2IncomeData = child.yet2IncomeData;
                    child.yet2ShipData = child.yet2ShipData;
                });
                yAixs.push(item.point);
            });
            _.forEach(resultes.graph[0].point, (xline) => {
                xline.tag = xline.tag;
                axle.push(xline.tag);
            });
            var data = {
                xAxis: xAxis,
                normalData: yAixs,
                axle: axle,
            };
            return data;
        },
        getPoIncomplete (time, val) {
            console.log(val)
            this.state = val
            this.time = time
            this.dialogVisible = true
        },
        changeClick (val) {
            this.queryData.status = val
            this.queryData.pageNum = 1
            this.getPoCompletionRate()
        },
        cancelDialog () {
            this.dialogVisible = false
        },
        handleSizeChanges (val) {
            this.queryData.page.pageSize = val
            this.getPoCompletionRate()
        },
        handleCurrentChanges (val) {
            this.queryData.page.pageNum = val
            this.getPoCompletionRate()
        },
        search () {
            this.getPoCompletionRate()
        },
        resetSearch () {
            Object.assign(this.queryData, {
                period: [moment().subtract(7, "days"), moment()],
                warehouseName: '全部',
                status: '全部',
                cateId: "全部",
                page:{
                    pageSize:10,
                    pageNum:1
                }
            }) 
        },
        commonExport() {
            let params = {
                startTime: this.queryData.period === null ? '' : moment(this.queryData.period[0]).valueOf().toString(),
                endTime: this.queryData.period === null ? '' : moment(this.queryData.period[1]).valueOf().toString(),
                warehouseName: this.queryData.warehouseName,
                cateOneId: this.queryData.cateId,
                status: this.queryData.status
            }
            RouteAndExport({
                type: 8,
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
    .po-completion{
        overflow: scroll;
        .po-row{
            margin-bottom: 10px;
        }
        .status-select{
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 5px;
        }
        .column-click{
            color: #4f91d8;
            cursor: pointer;
        }
    }
</style>