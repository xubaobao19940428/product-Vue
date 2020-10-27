<template>
  <div class="app-container forward-receive-wrapper">
    <el-form ref="sockInFilterForm" inline :model="queryData" label-width="80px" size="medium">
      <el-form-item label="物流单号：" class="filter-item">
        <el-input
          v-model="queryData.logisticsNo"
          clearable
          placeholder="请输入物流单号"
          size="medium"
          @keyup.enter.native="search(1)"
        ></el-input>
      </el-form-item>
      <el-form-item label="出库单号：" class="filter-item">
        <el-input
          v-model="queryData.outNo"
          clearable
          placeholder="请输入出库单号"
          size="medium"
          @keyup.enter.native="search(1)"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态：" class="filter-item">
        <el-select v-model="queryData.status" clearable size="medium" @change="search(1)">
          <el-option v-for="(value,key) in signForStatus" :key="key" :label="value" :value="Number(key)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物流公司：" class="filter-item">
        <el-select
          v-model="queryData.logisticsCompanyNo"
          clearable
          size="medium"
          @change="search(1)"
        >
          <el-option v-for="(value,key) in wareCompanyLists" :key="key" :label="value" :value="Number(key)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运输方式：" class="filter-item">
        <el-select v-model="queryData.transportWay" clearable size="medium" @change="search(1)">
          <el-option v-for="(value,key) in transportLists" :key="key" :label="value" :value="Number(key)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="目的地：" class="filter-item">
        <el-select v-model="queryData.toPlace" clearable size="medium" @change="search(1)">
          <el-option v-for="(value,key) in destinationLists" :key="key" :label="value" :value="Number(key)"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="异常类型：" class="filter-item">
        <el-select v-model="queryData.exceptionType" clearable size="medium" @change="search(1)">
          <el-option
            v-for="(value,key) in exceptionTypeList"
            :key="key"
            :label="value"
            :value="Number(key)"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间类型：" class="filter-item" prop="timeList">
        <el-select v-model="queryData.timeType" clearable size="medium" style="width:100px">
          <el-option v-for="(value,key) in timeTypeLists" :key="key" :label="value" :value="Number(key)"></el-option>
        </el-select>
        <el-date-picker
          value-format="timestamp"
          v-model="queryData.timeList"
          type="daterange"
          size="medium"
          :default-time="['00:00:00', '23:59:59']"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <div>
        <el-form-item class="filter-item" style="margin-left: 20px;">
          <el-button icon="el-icon-search" type="primary" @click="search(1)" size="medium">搜索</el-button>
          <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
          <el-button type="primary" size="medium" @click="batchConfirm">批量确认到达</el-button>
          <el-button type="primary" size="medium" @click="exportData">
            导出
            <el-tooltip
              content="导出的最大数量默认5000,可修改 Apollo配置项:ERP_CROSS_BORDER_EXPORT_LIMIT 调整"
              placement="top"
            >
              <i class="el-icon-question"></i>
            </el-tooltip>
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="main-content-wrapper">
      <el-table v-loading="loading" height="100%" :data="dataList" style="width: 100%" border @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="物流单号" width="200" align="center" prop="logisticsNo"></el-table-column>
        <el-table-column label="第三方物流单号" width="200" align="center" prop="thridLogisticsNo"></el-table-column>
        <el-table-column label width="1" align="center">
          <template slot-scope="scope">
            <span>{{setTimeInter(Number(scope.row.deadlineTime),scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="出库单号" width="200" align="center" prop="outNo">
          <template slot-scope="scope">
            <el-link
              :underline="false"
              type="primary"
              @click="detailPurchase(scope.row)"
            >{{scope.row.outNo}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="物流公司" width="200" align="center" prop="logisticsCompanyName"></el-table-column>
        <el-table-column label="运输方式" width="200" align="center" prop="transportWayName"></el-table-column>
        <el-table-column label="目的地" width="100" align="center" prop="toPlace"></el-table-column>
        <el-table-column label="状态|物流时效" width="200" align="center">
          <template slot-scope="scope">
            <div>
              {{scope.row.statusName+'|'}}
              <span style="color:red">{{scope.row.timeOutDetail}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="异常类型" width="200" align="center">
          <template slot-scope="scope">
              <div v-if="scope.row.exceptionTypeName!=''" style="color:red">{{scope.row.exceptionTypeName}}</div>
              <div v-if="scope.row.exceptionRecordTime!=''" style="color:red">{{timestampToTime(Number(scope.row.exceptionRecordTime))}}</div>
          </template>
        </el-table-column>
        <el-table-column label="物流信息" width="200" align="center" prop="logisticsInfo">
          <template slot-scope="scope">
              <div v-for="(item,index) in scope.row.logisticsInfo.split(';')" :key="index">
                {{item}}
              </div>
          </template>
        </el-table-column>
        <el-table-column label="申报价值" width="200" align="center">
          <template slot-scope="scope">
            <div>申报价值:{{scope.row.declaredAmount}}</div>
            <div>重量:{{scope.row.declaredWeight}}</div>
          </template>
        </el-table-column>
        <el-table-column label="时间信息" width="300">
          <template slot-scope="scope">
            <div v-html="timeInfoListRep(scope.row.timeInfoList)" style="padding:10px 0 "></div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-link
              :underline="false"
              type="primary"
              style="margin-right:20px"
              v-if="scope.row.status==7"
              @click="manualConfirmOrder(scope.row,scope.$index)"
            >手动下单</el-link>
            <el-link
              :underline="false"
              type="primary"
              v-if="scope.row.logisticsCompanyNo!='1'&&scope.row.status!=5"
              @click="confirmArriveRight(scope.row,scope.$index)"
            >确认到达</el-link>
            <el-link
              :underline="false"
              type="primary"
              style="margin:0 20px;"
              :disabled="scope.row.status!=1&&scope.row.status!=2"
              @click="cancelLogi(scope.row,scope.$index)"
            >取消</el-link>
            <el-link
              :underline="false"
              type="primary"
              @click="updateLogiDetail(scope.row,scope.$index)"
            >同步物流信息</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination
        @size-change="handleSizeChanges"
        @current-change="handleCurrentChanges"
        :current-page="queryData.page.pageNum"
        :page-size="queryData.page.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        :total="totals"
      ></el-pagination>
    </div>
    <!--出库单详情-->
    <!-- <out-order-detail :dialogTableVisible="dialogTableVisible" :outNo="outNo" ref="outDetail"></out-order-detail> -->
  </div>
</template>

<script>
import _ from "lodash";
import {
  CrossBorderList,
  CrossBorderExport,
  SyncCrossBorderLogisticsInfo,
  EnumConfig,
  CancelCrossBorder,
  ConfirmArrive,
  ManualOrder,
  ConfirmArriveBatch
} from "@/request/logi";
// import outOrderDetail from './components/outOrderDetaiil'
export default {
  data() {
    return {
      //弹窗
      dialogTableVisible: false,
      outNo: "",
      queryData: {
        logisticsNo: "", //物流单号
        outNo: "", //出库单号
        status: "", //状态
        logisticsCompanyNo: "", //物流公司
        transportWay: "", //运输方式
        toPlace: "", //目的地
        timeType: "", //时间类型
        startTime: "", //开始时间
        endTime: "", //结束时间
        exceptionType: "", //异常类型
        timeList: [],
        page: {
          pageNum: 1,
          pageSize: 20,
        },
      },
      totals: 0,
      statusListMap: {
        1: "已入库",
        2: "未入库",
      },
      signForStatus: {},
      wareCompanyLists: {},
      transportLists: {},
      outTimeLists: {},
      exceptionTypeList: {},
      destinationLists: {},
      timeTypeLists: {},
      signStatusList: [
        {
          value: 1,
          label: "已签收",
        },
        {
          value: 2,
          label: "未签收",
        },
      ],
      dataList: [],
      loading: false,
      selectLogiNo:[]
    };
  },
  components: {
    // outOrderDetail
  },
  created() {},
  mounted() {
    this.search();
    this.getEnumConfig();
  },
  methods: {
        timestampToTime (timestamp) {
        var date = new Date(timestamp) 
          var Y = date.getFullYear() + '-';
          var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
          var D = (date.getDate()+1 <= 10 ? '0'+(date.getDate()) : date.getDate()) + ' ';
          var h = (date.getHours()+1 <= 10 ? '0'+(date.getHours()) : date.getHours())  + ':';
          var m = (date.getMinutes()+1 <= 10 ? '0'+(date.getMinutes()) : date.getMinutes())  + ':';
          var s = (date.getSeconds()+1 <= 10 ? '0'+(date.getSeconds()) : date.getSeconds());
          return Y+M+D+h+m+s;
      },
    //重制按钮
    resetSearch() {
      this.queryData = {
        logisticsNo: "", //物流单号
        outNo: "", //出库单号
        status: "", //状态
        logisticsCompanyNo: "", //物流公司
        transportWay: "", //运输方式
        toPlace: "", //目的地
        timeType: "", //时间类型
        startTime: "", //开始时间
        endTime: "", //结束时间
        exceptionType: "", //异常类型
        timeList: [],
        page: {
          pageNum: 1,
          pageSize: 20,
        },
      };
      this.search();
    },
    getEnumConfig() {
      EnumConfig({})
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            var data = JSON.parse(resultes.enumJson);
            this.exceptionTypeList = data.exceptionType;
            this.destinationLists = data.countryCode;
            this.wareCompanyLists = data.logisticsCompany;
            this.signForStatus = data.orderStatus;
            this.timeTypeLists = data.timeType;
            this.transportLists = data.transportWay;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //同步物流信息
    updateLogiDetail(row, index) {
      var params = {
        thridLogisticsNo: row.thridLogisticsNo,
      };
      SyncCrossBorderLogisticsInfo(params)
        .then((response) => {
          if (response.ret.errcode == 1) {
            this.$set(this.dataList, index, response.data);
            this.$message.success("同步物流信息成功");
          }
        })
        .catch((error) => {});
    },
    //取消
    cancelLogi(row, index) {
      var params = {
        thridLogisticsNo: row.thridLogisticsNo,
      };
      CancelCrossBorder(params)
        .then((response) => {
          if (response.ret.errcode == 1) {
            this.$set(this.dataList, index, response.data);
            this.$message.success("取消成功");
          }
        })
        .catch((error) => {});
    },
    //确认到达
    confirmArriveRight(row, index) {
      var params = {
        thridLogisticsNo: row.thridLogisticsNo,
      };
      ConfirmArrive(params)
        .then((response) => {
          if (response.ret.errcode == 1) {
            this.$set(this.dataList, index, response.data);
            this.$message.success("确认到达成功");
          }
        })
        .catch((error) => {});
    },
    //手动下单
    manualConfirmOrder(row, index) {
      var params = {
        thridLogisticsNo: row.thridLogisticsNo,
      };
      ManualOrder(params)
        .then((response) => {
          if (response.ret.errcode == 1) {
            this.$set(this.dataList, index, response.data);
            this.$message.success("手动下单成功");
          }
        })
        .catch((error) => {});
    },
    returnStatus(status) {
      var str = "";
      _.forEach(this.signForStatus, (item) => {
        if (item.value == status) {
          str = item.label;
        }
      });
      return str;
    },
    //导出
    exportData() {
      if (this.queryData.timeList && this.queryData.timeList.length) {
        this.queryData.startTime = this.queryData.timeList[0].toString();
        this.queryData.endTime = this.queryData.timeList[1].toString();
      } else {
        this.queryData.startTime = "";
        this.queryData.endTime = "";
      }
      var params = Object.assign(this.queryData, {});
      CrossBorderExport(this.filterData(params))
        .then((response) => {
          if (response.ret.errcode == 1) {
            var url = this.dealShowFileSrc(response.fileUrl);
            window.open(url);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //搜索
    search(type) {
      this.loading = true;
      if (this.queryData.timeList && this.queryData.timeList.length) {
        this.queryData.startTime = this.queryData.timeList[0].toString();
        this.queryData.endTime = this.queryData.timeList[1].toString();
      } else {
        this.queryData.startTime = "";
        this.queryData.endTime = "";
      }
      if(type==1){
        this.queryData.page.pageNum=1
      }
      var params = Object.assign(this.queryData, {});
      CrossBorderList(this.filterData(params))
        .then((response) => {
          if (response.ret.errcode == 1) {
            _.forEach(response.dataList, (item) => {
              item.timeOutDetail = item.deadlineTime;
            });
            this.dataList = response.dataList;
            this.totals = response.totalCount;
            this.loading = false;
          } else {
            this.loading = false;
          }
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    timeInfoListRep(timeInfoList) {
      var str = "";
      _.forEach(timeInfoList, (item) => {
        str += `${item}<br/>`;
      });
      return str;
    },
    //倒计时
    setTimeInter(val, index) {
      var newDate = new Date().getTime();
      var originTime = val;
      var differTime = originTime - newDate;
      var timeDom;
      var h, m, s;
      var _this = this;
      if (differTime >= 0) {
        h = Math.floor(differTime / 1000 / 60 / 60);
        m = Math.floor((differTime / 1000 / 60) % 60);
        s = Math.floor((differTime / 1000) % 60);
        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        timeDom = h + ":" + m + ":" + s;
        //递归调用函数所以是延时器不是定时器
        // window.setTimeout(()=>{
        if (timeDom && index >= 0) {
          _this.dataList[index].timeOutDetail = timeDom;
        }
        // _this.setTimeInter(originTime);
        // }, 1000);
      } else {
        timeDom = "00:00:00";
        _this.dataList[index].timeOutDetail = timeDom;
      }
    },
    detailPurchase(row) {
      var url = `${window.location.origin}/#/warehouseManage/sockOutOrder?outNo=${row.outNo}`;
      window.open(url);
    },
    handleSizeChanges(val) {
      this.queryData.page.pageSize = val;
      this.search();
    },
    handleCurrentChanges(val) {
      this.queryData.page.pageNum = val;
      this.search();
    },
    //批量确认到达选择
    handleSelectionChange(val){
      this.selectLogiNo = val
    },
    batchConfirm(){
      if(this.selectLogiNo.length==0){
        this.$message.warning('确认到达的订单数不能为0')
      }else{
        let params={
          thridLogisticsNos:[]
        }
        _.forEach(this.selectLogiNo,item=>{
          params.thridLogisticsNos.push(
            item.thridLogisticsNo
          )
        })
        ConfirmArriveBatch(params).then(resultes=>{
          if(resultes.ret.errcode==1){
            this.$message.success('批量确认到达成功')
            this.search()
          }
        })
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.forward-receive-wrapper {
  .el-form-item {
    margin-bottom: 10px;
  }
}
.box-card {
  margin-bottom: 10px;
}
</style>
