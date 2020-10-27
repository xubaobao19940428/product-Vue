<template>
  <div class="performance-contract">
    <el-row :gutter="12">
      <el-col :span="24">
        <!--整体查询数据-->
        <el-card shadow="always">
          <el-form inline label-width="90px">
            <el-form-item label="查询日期：">
              <!-- <el-select
                v-model="queryData.period"
                filterable
                size="medium"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in DateList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>-->
              <el-date-picker
                v-model="queryData.period"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="出库仓：">
              <el-select
                v-model="queryData.outWare"
                filterable
                size="medium"
                placeholder="请选择"
                @change="changeWare"
              >
                <el-option
                  v-for="(item, index) in outWareList"
                  :key="index"
                  :label="item.label"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单类型：">
              <el-select v-model="queryData.orderType" filterable size="medium" placeholder="请选择">
                <el-option
                  v-for="(item, index) in orderList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="时效类型：">
              <el-select
                v-model="queryData.standardType"
                filterable
                size="medium"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in agingList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px">
              <el-button type="primary" size="medium" icon="el-icon-search" @click="searchErp">搜索</el-button>
              <el-button size="medium" icon="el-icon-refresh-left" @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <!---so数据-->
    <el-row :gutter="12">
      <el-col :span="24">
        <el-card shadow="always">
          <div class="so-head">
            <div class="total-order">总计下单：{{totalOrderNum}}单</div>
            <el-tabs v-model="activeTab" type="card" @tab-click="handleTabsClickCountry">
              <el-tab-pane
                v-for="item in countryList"
                :key="item.name"
                :label="item.label"
                :name="item.name"
              ></el-tab-pane>
            </el-tabs>
          </div>
          <div class="so-target">
            <div>SO关键指标</div>
            <div v-if="activeTab != '全部'">数据时间:{{vsTime}}</div>
            <div v-if="activeTab != '全部'" class="so-area">
              <div>地区：</div>
              <el-select
                v-model="queryData.areaName"
                filterable
                clearable
                size="medium"
                placeholder="请选择"
                @change="getAreaName"
              >
                <el-option
                  v-for="(item, index) in areaNames"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
            </div>
          </div>
          <card-list
            :activeIndex="activeIndex"
            :board="board"
            :vsTime="vsTime"
            :Module="'SOModule'"
            @changeCard="changeCard"
          ></card-list>
          <line-chart :lineDataMap="lineDataMap.SOModule"></line-chart>
          <el-row :gutter="12" class="sub-row" v-if="activeTab != '全部'">
            <el-col :span="12">
              <el-card shadow="never" class="sub-card">
                <line-chart :lineDataMap="lineDataMap.soAbnormal"></line-chart>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="never" class="sub-card">
                <data-table
                  :title="'SO异常数据明细'"
                  :tableList="soAbnormalTable"
                  :total="soAbnormalTotal"
                  :type="1"
                  @on-page-select="pageSelect"
                  :queryData="queryData"
                ></data-table>
              </el-card>
            </el-col>
          </el-row>
          <el-row :gutter="12" class="sub-row" v-if="activeTab != '全部'">
            <el-col :span="12">
              <el-card shadow="never" class="sub-card">
                <div style="display:flex;justify-content: space-between;">
                  <div>宅配时效监控</div>
                  <div>
                    <div style="display:inline-block">宅配商：</div>
                    <el-select
                      v-model="queryData.logiCompany"
                      filterable
                      clearable
                      size="medium"
                      placeholder="请选择"
                      @change="getHomeAbnormal()"
                    >
                      <el-option
                        v-for="(item, index) in logiNames"
                        :key="index"
                        :label="item"
                        :value="item"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <line-chart :lineDataMap="lineDataMap.homeAbnormal"></line-chart>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="never" class="sub-card">
                <data-table
                  :title="'宅配异常数据明细'"
                  :tableList="homeAbnormalTable"
                  :total="homeAbnormalTotal"
                  :type="2"
                  @on-page-select="pageSelect"
                  :queryData="queryData"
                ></data-table>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!--po指标--->
    <el-row :gutter="12">
      <el-col :span="24">
        <el-card shadow="always">
          <el-tabs v-model="queryData.tapType" type="card" @tab-click="wareHandleTabsClick">
            <el-tab-pane
              v-for="item in wareLists"
              :key="item.name"
              :label="item.label"
              :name="item.tapType"
            ></el-tab-pane>
          </el-tabs>
          <div class="so-target">
            <div>PO关键指标</div>
            <div>总计采购：{{wareTotalOrderNum}}单</div>
          </div>
          <card-list
            :activeIndex="activeIndex"
            :board="wareBoard"
            :vsTime="vsTime"
            :Module="'POModule'"
            @changeCard="changeCard"
          ></card-list>
          <line-chart :lineDataMap="lineDataMap.POModule"></line-chart>
          <el-row :gutter="12" class="sub-row" v-if="queryData.tapType!=0">
            <el-col :span="12">
              <el-card shadow="never" class="sub-card">
                <div style="display:flex;justify-content: space-between;">
                  <div>PO异常数据图表</div>
                  <div>
                    <div style="display:inline-block">一级类目：</div>
                    <el-select
                      v-model="queryData.cateOneId"
                      filterable
                      clearable
                      size="medium"
                      placeholder="请选择"
                      @change="getErpPoAbnormalDataGraph()"
                    >
                      <el-option
                        v-for="(item, index) in cateList"
                        :key="index"
                        :label="item.cateName"
                        :value="item.cateId.toString()"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <line-chart :lineDataMap="lineDataMap.poAbnormal"></line-chart>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card shadow="never" class="sub-card">
                <data-table
                  :title="'PO异常数据明细'"
                  :tableList="poAbnormalTable"
                  :total="poAbnormalTotal"
                  :type="3"
                  @on-page-select="pageSelect"
                  :queryData="queryData"
                ></data-table>
              </el-card>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import cardList from "./components/cardList";
import lineChart from "./components/lineChart";
import dataTable from "./components/dataTable";
import {
  ErpSoCriticalIndicator,
  ErpSoAbnormalDataGraph,
  ErpDeliveryTimeliness,
  ErpPoCriticalIndicator,
  ErpPoAbnormalDataGraph,
} from "@/request/dataV";
import { categoryListGet } from "@/request/product";
export default {
  data() {
    return {
      vsTime: "",
      board: [],
      areaNames: [],
      queryData: {
        period: [moment().subtract(30, "days"), moment().subtract(15, "days")],
        orderType: 2,
        standardType: 1,
        countryName: "",
        areaName: "全部",
        warehouseName: "东莞仓",
        cateOneId: "全部",
        logiCompany: "",
        outWare: "东莞仓",
        tapType: "0",
      },
      DateList: [
        {
          value: 1,
          label: "近15天",
        },
        {
          value: 2,
          label: "近30天",
        },
      ],
      orderList: [
        {
          value: 2,
          label: "JIT订单",
        },
        {
          value: 3,
          label: "预售订单",
        },
        {
          value: 4,
          label: "现货订单",
        },
      ],
      agingList: [
        {
          value: 1,
          label: "标准时效",
        },
        {
          value: 2,
          label: "非标准时效",
        },
      ],
      activeTab: "全部",
      countryList: [
        {
          name: "全部",
          label: "全部",
        },
        {
          name: "西马",
          label: "西马",
        },
        {
          name: "东马",
          label: "东马",
        },
        {
          name: "府内",
          label: "府内",
        },
        {
          name: "府外",
          label: "府外",
        },
        {
          name: "新加坡",
          label: "新加坡",
        },
      ],
      list: [1, 2, 3, 4],
      lineDataMap: {
        SOModule: {
          xAxis: [],
          normalData: [],
          axle: [],
        },
        soAbnormal: {
          xAxis: [],
          normalData: [],
          axle: [],
        },
        homeAbnormal: {
          xAxis: [],
          normalData: [],
          axle: [],
        },
        POModule: {
          xAxis: [],
          normalData: [],
          axle: [],
        },
        poAbnormal: {
          xAxis: [],
          normalData: [],
          axle: [],
        },
      },
      totalOrderNum: 0,
      wareLists: [
        {
          name: "全部",
          label: "全部",
          tapType: "0",
        },
        {
          name: "东莞仓",
          label: "东莞仓",
          tapType: "1",
        },
      ],
      outWareList: [
        {
          name: "东莞仓",
          label: "东莞仓",
          tapType: "1",
        },
        {
          name: "马来仓",
          label: "马来仓",
          tapType: "1",
        },
        {
          name: "泰国仓",
          label: "泰国仓",
          tapType: "1",
        },
      ],
      wareActiveTab: "全部",
      wareBoard: [],
      wareTotalOrderNum: 0,
      //so表格的参数
      soAbnormalTable: [],
      soAbnormalPage: {
        page: {
          pageSize: 10,
          pageNum: 1,
        },
      },
      soAbnormalTotal: 0,
      //宅配异常数据
      homeAbnormalTable: [],
      homeAbnormalPage: {
        page: {
          pageSize: 10,
          pageNum: 1,
        },
      },
      logiNames: [],
      homeAbnormalTotal: 0,
      //po异常数据
      poAbnormalTable: [],
      poAbnormalPage: {
        page: {
          pageSize: 10,
          pageNum: 1,
        },
      },
      poAbnormalTotal: 0,
      //一级类目
      cateList: [{ cateId: "all", cateName: "全部" }],
      activeIndex: 0, //cardList的active Tab
    };
  },
  components: {
    cardList,
    lineChart,
    dataTable,
  },
  mounted() {
    this.getErpSoCriticalIndicator();
    this.getErpPoCriticalIndicator();
    this.fetchCategory({
      level: 1,
      cateType: 2,
      resolve: (data) => {
        // this.backCategoryOptions = data;
        this.cateList = [...this.cateList, ...data];
      },
    });
  },
  methods: {
    changeWare(val) {
      this.outWareList.map((item, index) => {
        if (val == item.name) {
          this.$set(this.wareLists, 1, item);
          if (this.queryData.tapType != 0) {
            this.queryData.warehouseName = this.queryData.outWare;
            this.wareHandleTabsClick({ name: "1" });
          }
        }
      });
    },
    resetSearch() {
      this.queryData = {
        period: "",
        orderType: 2,
        standardType: 1,
        countryName: "",
        areaName: "",
        warehouseName: "东莞仓",
        cateOneId: "all",
        logiCompany: "",
        outWare: "东莞仓",
        tapType: "0",
      };
      this.searchErp();
    },
    //搜索
    searchErp() {
      this.queryData.warehouseName = this.queryData.outWare;
      this.getErpSoCriticalIndicator();
      this.getErpPoCriticalIndicator();
      if (this.activeTab != "全部") {
        this.getSoAbnormal();
        this.getHomeAbnormal();
      }
      if(this.queryData.tapType!=0){
         this.getErpPoAbnormalDataGraph();
      }
    },
    //点击不同的card显示数据
    changeCard(index, title, Module) {
      for (const iterator of this.lineDataMap[Module].xAxis) {
        if (iterator.name === title) {
          iterator.isShow = true;
        } else {
          iterator.isShow = false;
        }
      }
    },
    //对请求返回参数统一处理，以免代码冗余
    changeAPIParams(resultes) {
      var xAxis = [];
      var axle = [];
      var yAixs = [];
      var dateFirst, dateEnd;
      _.forEach(resultes.graph, (item) => {
        xAxis.push({
          name: item.type,
          isShow: item.isVisible,
        });
        _.forEach(item.points, (child) => {
          child.tag = child.tag;
          child.value = child.volume;
          child.onTargetNum = Number(child.onTargetNum);
          child.paidOrderNum = Number(child.paidOrderNum);
        });
        yAixs.push(item.points);
      });
      _.forEach(resultes.graph[0].points, (xline) => {
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
    //初始化so数据
    getErpSoCriticalIndicator() {
      this.queryData.countryName = this.activeTab;
      var params = Object.assign(this.queryData, {
        startTime: moment(moment(this.queryData.period[0]).format("YYYY-MM-DD"))
          .valueOf()
          .toString(),
        endTime: moment(moment(this.queryData.period[1]).format("YYYY-MM-DD"))
          .valueOf()
          .toString(),
      });
      console.log(params);
      ErpSoCriticalIndicator(params)
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            var dateFirst, dateEnd;
            this.lineDataMap.SOModule = this.changeAPIParams(resultes);
            resultes.areaNames.unshift("全部");
            _.forEach(resultes.board, (item) => {
              if (item.type == 1) {
                item.title = `SO整体时效`;
              } else if (item.type == 2) {
                item.title = `SO达标-东马`;
              } else if (item.type == 3) {
                item.title = `SO达标-西马`;
              } else if (item.type == 4) {
                item.title = `SO达标-泰国`;
              } else if (item.type == 5) {
                item.title = `SO出库达标`;
              } else if (item.type == 6) {
                item.title = `SO跨境达标`;
              } else if (item.type == 7) {
                item.title = `SO宅配达标`;
              }
            });
            this.board = resultes.board.sort((a, b) => {
              return a.type - b.type;
            });
            this.vsTime =
              moment(this.queryData.period[0]).format("YYYY-MM-DD") +
              "~" +
              moment(this.queryData.period[1]).format("YYYY-MM-DD");
            this.areaNames = resultes.areaNames;
            this.totalOrderNum = resultes.totalOrderNum;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //po指标初始化
    getErpPoCriticalIndicator() {
      var params = Object.assign(this.queryData, {
        startTime: moment(moment(this.queryData.period[0]).format("YYYY-MM-DD"))
          .valueOf()
          .toString(),
        endTime: moment(moment(this.queryData.period[1]).format("YYYY-MM-DD"))
          .valueOf()
          .toString(),
      });
      ErpPoCriticalIndicator(params)
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            // var dateFirst, dateEnd;
            this.lineDataMap.POModule = this.changeAPIParams(resultes);
            _.forEach(resultes.board, (item) => {
              if (item.type == 8) {
                item.title = `PO整体时效`;
              } else if (item.type == 10) {
                item.title = `PO采购下单达标`;
              } else if (item.type == 11) {
                item.title = `PO发货达标`;
              } else if (item.type == 12) {
                item.title = `PO采购到仓达标`;
              } else if (item.type == 9) {
                item.title = `PO达标-东莞仓`;
              }else if (item.type == 13) {
                item.title = `PO达标-马来仓`;
              }else if (item.type == 14) {
                item.title = `PO达标-泰国仓`;
              }
            });
            this.wareBoard = resultes.board.sort((a, b) => {
              return a.type - b.type;
            });
            this.wareTotalOrderNum = resultes.totalOrderNum;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //地区选择
    getAreaName() {
      this.getErpSoCriticalIndicator();
      this.soAbnormalPage.page.pageNum = 1;
      this.homeAbnormalPage.page.pageNum = 1;
      this.getSoAbnormal();
      this.getHomeAbnormal();
    },
    //so异常数据指标
    getSoAbnormal() {
      var params = Object.assign(this.queryData, this.soAbnormalPage, {
        startTime: moment(moment(this.queryData.period[0]).format("YYYY-MM-DD"))
          .valueOf()
          .toString(),
        endTime: moment(moment(this.queryData.period[1]).format("YYYY-MM-DD"))
          .valueOf()
          .toString(),
      });

      ErpSoAbnormalDataGraph(params).then((resultes) => {
        if (resultes.ret.errcode == 1) {
          this.lineDataMap.soAbnormal = this.changeAPIParams(resultes);
          this.soAbnormalTotal = resultes.total;
          this.soAbnormalTable = resultes.list;
        }
      });
    },
    //宅配异常数据
    getHomeAbnormal() {
      var params = Object.assign(this.queryData, this.homeAbnormalPage, {
        startTime: moment(moment(this.queryData.period[0]).format("YYYY-MM-DD"))
          .valueOf()
          .toString(),
        endTime: moment(moment(this.queryData.period[1]).format("YYYY-MM-DD"))
          .valueOf()
          .toString(),
      });
      ErpDeliveryTimeliness(params).then((resultes) => {
        if (resultes.ret.errcode == 1) {
          this.lineDataMap.homeAbnormal = this.changeAPIParams(resultes);
          this.homeAbnormalTotal = resultes.total;
          this.homeAbnormalTable = resultes.list;
          this.logiNames = resultes.logiNames;
        }
      });
    },
    //分页处理
    pageSelect(data) {
      if (data.type == 1) {
        this.soAbnormalPage.page = data.page;
        this.getSoAbnormal();
      } else if (data.type == 2) {
        this.homeAbnormalPage.page = data.page;
        this.getHomeAbnormal();
      } else if (data.type == 3) {
        this.poAbnormalPage.page = data.page;
        this.getErpPoAbnormalDataGraph();
      }
    },
    //国家切换
    handleTabsClickCountry(tabs) {
      this.queryData.areaName = "全部";
      this.getErpSoCriticalIndicator();
      if (tabs.name != "全部") {
        this.getSoAbnormal();
        this.getHomeAbnormal();
      }
      this.activeIndex = 0;
    },
    //po异常
    getErpPoAbnormalDataGraph() {
      var params = Object.assign(this.queryData, this.poAbnormalPage, {
        startTime: moment(moment(this.queryData.period[0]).format("YYYY-MM-DD"))
          .valueOf()
          .toString(),
        endTime: moment(moment(this.queryData.period[1]).format("YYYY-MM-DD"))
          .valueOf()
          .toString(),
      });
      params.cateOneId = params.cateOneId + "";
      console.log(params.cateOneId);
      ErpPoAbnormalDataGraph(params)
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            this.lineDataMap.poAbnormal = this.changeAPIParams(resultes);
            this.poAbnormalTotal = resultes.total;
            this.poAbnormalTable = resultes.list;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //仓库切换
    wareHandleTabsClick(tabs) {
      this.queryData.warehouseName = this.queryData.outWare;
      this.getErpPoCriticalIndicator();
      if (tabs.name != 0) {
        this.getErpPoAbnormalDataGraph();
      }
    },

    // distinct(arr) {
    //   let newArr = [];
    //   for (let i = 0; i < arr.length; i++) {
    //     if (newArr.indexOf(arr[i]) < 0) {
    //       newArr.push(arr[i]);
    //     }
    //   }
    //   return newArr;
    // },
    //获取一级类目
    fetchCategory({ id, cateType, level, pid, page, resolve }) {
      categoryListGet(
        this.filterData({
          pid: pid,
          id: id,
          level: level,
          cateType: cateType,
          page: page,
        })
      ).then((res) => {
        if (res.ret.errcode === 1) {
          console.log(res.categoryUnit);
          for (let i = 0; i < res.categoryUnit.length; i++) {
            res.categoryUnit[i]["levelValue"] = [];
            let item = res.categoryUnit[i].cateNameValue.find((val) => {
              return val.languageCode == "cn";
            });
            res.categoryUnit[i]["cateName"] = item ? item.name : "";
            res.categoryUnit[i]["cateOneId"] = String(
              res.categoryUnit[i]["cateId"]
            );
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
  },
};
</script>
<style lang="scss" scoped>
.performance-contract {
  overflow: scroll;
  background-color: rgb(239, 239, 239);
  .so-head {
    position: relative;
  }
  .total-order {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    width: 100%;
    margin: 10px 0px;
    font-size: 16px;
  }
  .so-target {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid rgb(239, 239, 239);
  }
  .so-area {
    display: flex;
    align-items: center;
  }
  .sub-row {
    margin-top: 25px;
  }
  .sub-card {
    height: 350px;
  }
}
</style>