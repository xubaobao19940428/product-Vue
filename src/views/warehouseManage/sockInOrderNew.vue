<template>
  <div class="app-container forward-receive-wrapper">
    <el-form ref="sockInFilterForm" inline :model="queryData" label-width="80px" size="medium">
      <el-form-item label="入库单号：" class="filter-item">
        <el-input
          v-model="queryData.incomeNo"
          clearable
          placeholder="请输入入库单号"
          size="medium"
          @keyup.enter.native="search(1)"
        ></el-input>
      </el-form-item>
      <el-form-item label="物流单号：" class="filter-item">
        <el-input
          v-model="queryData.logiCode"
          clearable
          placeholder="请输入物流单号"
          size="medium"
          @keyup.enter.native="search(1)"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态：" class="filter-item">
        <el-select
          v-model="queryData.incomeOrderStatus"
          clearable
          size="medium"
          @change="search(1)"
        >
          <el-option
            v-for="item in signForStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物流公司：" class="filter-item">
        <el-select
          v-model="queryData.logiCompany"
          clearable
          size="medium"
          @change="search(1)"
          v-el-select-loadmore="loadMore"
        >
          <el-option
            v-for="item in wareCompanyLists"
            :key="item.logiCompany"
            :label="item.companyName"
            :value="item.logiCompany"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间类型：" class="filter-item">
        <el-select
          v-model="queryData.incomeOrderTimeType"
          clearable
          size="medium"
          @change="search(1)"
          style="width:100px"
        >
          <el-option
            v-for="item in timeTypeLists"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          value-format="yyyy-MM-dd HH:mm:ss"
          v-model="queryData.timeList"
          type="daterange"
          size="medium"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="异常类型：" class="filter-item">
        <el-select
          v-model="queryData.incomeExceptionType"
          clearable
          size="medium"
          @change="search(1)"
        >
          <el-option
            v-for="item in incomeExceptionLists"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购单号：" class="filter-item">
        <el-input
          v-model="queryData.purchaseOrderNo"
          clearable
          placeholder="采购单号"
          size="medium"
          @keyup.enter.native="search(1)"
        ></el-input>
      </el-form-item>
      <el-form-item label="仓库：" class="filter-item">
        <el-select v-model="queryData.warehouseNo" clearable size="medium" @change="search(1)">
          <el-option
            v-for="item in wareLists"
            :key="item.warehouseNo"
            :label="item.warehouseName"
            :value="item.warehouseNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <div>
        <el-form-item class="filter-item" style="margin-left: 20px;">
          <el-button icon="el-icon-search" type="primary" @click="search(1)" size="medium">搜索</el-button>
          <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
          <el-button type="primary" size="medium" @click="exportOrder">导出</el-button>
        </el-form-item>
      </div>
    </el-form>
    <div class="main-content-wrapper">
      <el-table v-loading="loading" height="100%" :data="dataList" style="width: 100%" border>
        <el-table-column label="入库单号" width="200" align="center" prop="incomeNo"></el-table-column>
        <el-table-column label="采购单号" width="200" align="center">
          <template slot-scope="scope">
            <div
              v-for="(item,index) in scope.row.simplePurchaseOrderInfo"
              :key="index"
              style="border-bottom:1px solid #cccccc;margin-bottom:10px"
            >
              <el-link
                :underline="false"
                type="primary"
                @click="detailPurchase(item)"
              >{{item.purchaseNo}}</el-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label width="1" align="center">
          <template slot-scope="scope">
            <span>{{setTimeInter(Number(scope.row.timeOutDetail),scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="物流单号" width="200" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.logiCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="国内物流公司" width="200" align="center" prop="logiCompanyName"></el-table-column>
        <el-table-column label="状态|物流时效" width="200" align="center">
          <template slot-scope="scope">
            <div>
              {{signForStatus[scope.row.incomeOrderStatus.toString()].label}}
              <span
                v-if="scope.row.timeOutDetail!=''"
              >|</span>
              <span style="color:red" v-if="scope.row.timeOutDetail!=''">{{scope.row.time1}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="物流信息" width="300" align="center" prop="logiDetailInfo">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.logiDetailInfo"
              placement="top"
              v-if="scope.row.logiDetailInfo.length"
            >
              <el-link :underline="false" type="primary">查看详情</el-link>
            </el-tooltip>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <el-table-column label="异常类型" width="200" align="center" prop="incomeExceptionType">
          <template slot-scope="scope">
            <div>
              <span
                v-if="scope.row.incomeExceptionInfo.exceptionType!=0"
                style="color:red"
              >{{incomeExceptionType[scope.row.incomeExceptionInfo.exceptionType]}}</span>
              <div style="color:red">{{ scope.row.incomeExceptionInfo.exceptionTime }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="目的仓" width="100" align="center" prop="warehouseName"></el-table-column>
        <el-table-column label="入库信息" width="200">
          <template slot-scope="scope">
            <div>
              预计入库数量：
              <span v-if="scope.row.totalCount">{{scope.row.totalCount}}</span>
              <span v-else>--</span>
            </div>
            <div>
              实际入库数量：
              <span v-if="scope.row.incomeCount">{{scope.row.incomeCount}}</span>
              <span v-else>--</span>
            </div>
            <div>
              取消数量：
              <span v-if="scope.row.cancelCount">{{scope.row.cancelCount}}</span>
              <span v-else>--</span>
            </div>
            <div>
              异常数量：
              <span v-if="scope.row.abnormalCount">{{scope.row.abnormalCount}}</span>
              <span v-else>--</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="时间信息" width="300">
          <template slot-scope="scope">
            <div>
              快递签收时间：
              <span v-if="scope.row.logiSignTime">{{scope.row.logiSignTime}}</span>
              <span v-else>--</span>
            </div>
            <div>
              仓储签收时间：
              <span v-if="scope.row.warehouseSignTime">{{scope.row.warehouseSignTime}}</span>
              <span v-else>--</span>
            </div>
            <div>
              入库时间：
              <span v-if="scope.row.incomeTime">{{scope.row.incomeTime}}</span>
              <span v-else>--</span>
            </div>
            <div>
              完结时间：
              <span v-if="scope.row.overTime">{{scope.row.overTime}}</span>
              <span v-else>--</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center" fixed="right">
          <template slot-scope="scope">
            <!-- <el-link :underline="false" type="primary" @click="updateSyncIncome(scope.row)">同步入库信息</el-link> -->
            <el-link
              :underline="false"
              type="primary"
              @click="updateInCome(scope.row)"
              v-if="(scope.row.incomeOrderStatus == 3 &&hasPermission('MENU_WAREHOUSE_CONFIRM_STORAGE_NEW'))"
            >确认入库</el-link>
            <el-link
              :underline="false"
              type="primary"
              style="margin:0 20px;"
              @click="detailOrder(scope.row)"
            >详情</el-link>
            <el-link :underline="false" type="primary" @click="SyncLogic(scope.row)">同步物流信息</el-link>
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
    <comprehensive-details ref="purchaseOrderDetail" @getList="getListnew" :List="List"></comprehensive-details>
    <sock-in-order-detail
      :dialogVisible="dialogVisible"
      ref="sockInOrderDetailRef"
      @on-cancel="cancelDialog"
    ></sock-in-order-detail>
    <confirm-sock-in-dialog
      :dialogVisible="sockInDialogVisible"
      :sockInData="sockInData"
      @on-cancle="handleCancleSockIn"
      @on-confirm="handleConfirmSockIn"
    ></confirm-sock-in-dialog>
    <!--确认入库有异常弹窗-->
    <abnormal-product
      :dialogVisible="abnormalDialog"
      :sockInData="sockInDataSku"
      @on-cancle="handleCancleAbnormal"
      @on-confirm="handleConfirmAbnormal"
    ></abnormal-product>
  </div>
</template>

<script>
import {
  NewIncomeOrderPage,
  warehousePage,
  NewIncomeOrderExport,
  SyncLogicDetail,
  SyncIncome,
  IncomeProductDetail,
  OrderIncomeCheck,
  OrderIncome,
} from "@/request/warehouse";
import comprehensiveDetails from "@/views/purchaseManage/purchaseOrder/components/comprehensiveDetails";
import { QueryLogiCompanyList } from "@/request/directMail";
import sockInOrderDetail from "./components/sockInOrderDetail";
import ConfirmSockInDialog from "./components/ConfirmSockInDialog";
import abnormalProduct from "./components/abnormalProduct";
export default {
  data() {
    return {
      //确认入库
      sockInDialogVisible: false,
      sockInData: {},
      //异常图片信息
      abnormalDialog: false,
      sockInDataSku: {},
      queryData: {
        incomeNo: "", //入库单号
        logiCode: "", //物流单号
        logiCompany: "", //物流公司
        incomeOrderStatus: "", //状态,
        warehouseNo: "", //仓库
        purchaseOrderNo: "", //采购单号
        incomeOrderTimeType: "", //时间类型
        incomeExceptionType: "", //异常类型
        timeList: [],
        startTime: "",
        endTime: "",
        page: {
          pagingSwitch: true,
          pageNum: 1,
          pageSize: 20,
        },
      },
      loading: false,
      totals: 0,
      statusListMap: {
        1: "已入库",
        2: "未入库",
      },
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
      signForStatus: [
        { label: "全部", value: "" },
        { label: "待快递签收", value: 1 },
        { label: "待仓储签收", value: 2 },
        { label: "待入库", value: 3 },
        { label: "已入库", value: 4 },
        { label: "已取消", value: 5 },
        { label: "已完结", value: 6 },
      ],
      wareCompanyLists: [],
      timeTypeLists: [
        { label: "快递签收时间", value: 1 },
        { label: "仓储签收时间", value: 2 },
        { label: "入库时间", value: 3 },
      ],
      incomeExceptionLists: [
        { label: "所有", value: "" },
        { label: "全部异常", value: 1 },
        { label: "仓储签收超时", value: 2 },
        { label: "入库超时", value: 3 },
      ],
      wareLists: [],
      dataList: [],
      incomeExceptionType: {
        0: "所有",
        1: "全部异常",
        2: "仓储签收超时",
        3: "入库超时",
      },
      supplierQuery: {
        countryCode: "CN",
        page: {
          pageSize: 20,
          pageNum: 1,
        },
      },
      List: {
        parcelAnomaly: "",
        total: 0,
        detailList: [],
        productList: [],
        relList1: [],
        relList2: [],
        show: false,
        param: {
          pageSize: 10,
          pageNum: 1,
        },
        // skuList: []
      },
      dialogVisible: false,
    };
  },
  components: {
    comprehensiveDetails,
    sockInOrderDetail,
    ConfirmSockInDialog,
    abnormalProduct,
  },
  created() {
    this.getWarehouseList();
    this.getLogiCompanyList();
    this.search(1);
  },
  mounted() {},
  methods: {
    //异常商品上传
    handleCancleAbnormal() {
      this.abnormalDialog = false;
    },
    handleConfirmAbnormal(data) {
      console.log(data);
      let inComeParams = {
        incomeNo: data.incomeNo,
        logiCode: data.logiCode,
        sku: [],
        imgInfo: [],
      };
      this.sockInData.scokInSkuList.map((item) => {
        inComeParams.sku.push({
          skuCode: item.skuCode,
          count: item.incomeCount,
          abnormalType: item.abnormalType ? item.abnormalType : "",
          abnormalCount: item.abnormalCount,
          remark: item.remark ? item.remark : "",
          imgs: item.imgs ? item.imgs : "",
        });
       
      });
       data.scokInSkuList.map((item) => {
          inComeParams.imgInfo.push({
            skuCode: item.skuCode,
            remark: item.remark ? item.remark : "",
            imgs: item.imgs ? item.imgs : "",
          });
        });
      OrderIncome(inComeParams).then((resultes) => {
              if (resultes.ret.errcode == 1) {
                this.$message.success("确认入库成功");
                this.sockInDialogVisible = false;
                this.abnormalDialog= false
                this.search(1);
              }
            });
    },
    //同步入库信息
    updateInCome(row) {
      IncomeProductDetail({ incomeNo: row.incomeNo })
        .then((response) => {
          if (response.ret.errcode == 1) {
            response.incomeOrderProductDetail.map((item) => {
              item.abnormalCount = item.abnormalCount || 0;
            });
            this.sockInData = {
              logiCode: row.logiCode,
              incomeNo: row.incomeNo,
              scokInSkuList: response.incomeOrderProductDetail,
            };
            this.sockInDialogVisible = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //取消确认入库
    handleCancleSockIn() {
      this.sockInDialogVisible = false;
    },
    //确认入库
    handleConfirmSockIn(sockInData) {
      this.sockInData = JSON.parse(JSON.stringify(sockInData));
      let params = {
        incomeNo: sockInData.incomeNo,
        sku: [],
      };
      sockInData.scokInSkuList.map((item) => {
        params.sku.push({
          skuCode: item.skuCode,
          count: item.incomeCount,
        });
      });
      OrderIncomeCheck(params).then((resultes) => {
        if (resultes.ret.errcode == 1) {
          if (!resultes.sku||resultes.sku.length==0) {
            let inComeParams = {
              incomeNo: sockInData.incomeNo,
              logiCode: sockInData.logiCode,
              sku: [],
              imgInfo: [],
            };
            sockInData.scokInSkuList.map((item) => {
              inComeParams.sku.push({
                skuCode: item.skuCode,
                count: item.incomeCount,
                abnormalType: item.abnormalType ? item.abnormalType : "",
                abnormalCount: item.abnormalCount,
                remark: item.remark ? item.remark : "",
                imgs: item.imgs ? item.imgs : "",
              });
              // inComeParams.imgInfo.push({
              //   skuCode: item.skuCode,
              //   remark: item.remark ? item.remark : "",
              //   imgs: item.imgs ? item.imgs : "",
              // });
            });
            OrderIncome(inComeParams).then((resultes) => {
              if (resultes.ret.errcode == 1) {
                this.$message.success("确认入库成功");
                this.sockInDialogVisible = false;
                this.search(1);
              }
            });
          } else {
            resultes.sku.map((item) => {
              item.abnormalType = "SHORTAGE";
            });
            this.sockInDataSku = {
              logiCode: sockInData.logiCode,
              incomeNo: sockInData.incomeNo,
              scokInSkuList: resultes.sku,
            };
            this.abnormalDialog = true;
          }
        }
      });
    },
    loadMore() {
      this.supplierQuery.page.pageNum++;
      this.getLogiCompanyList();
    },
    getLogiCompanyList() {
      QueryLogiCompanyList(this.supplierQuery).then((resultes) => {
        if (resultes.ret.errcode === 1) {
          this.wareCompanyLists = [
            ...this.wareCompanyLists,
            ...resultes.company,
          ];
        }
      });
    },
    //清空
    resetSearch() {
      this.queryData.incomeNo = "";
      this.queryData.logiCode = "";
      this.queryData.logiCompany = "";
      this.queryData.incomeOrderStatus = "";
      this.queryData.warehouseNo = "";
      this.queryData.purchaseOrderNo = "";
      this.queryData.incomeOrderTimeType = "";
      this.queryData.incomeExceptionType = "";
      this.queryData.timeList = [];
      this.queryData.startTime = "";
      this.queryData.endTime = "";
      this.search(1);
    },
    returnLogiDetailInfo(logiDetailInfo) {
      // console.log(logiDetailInfo)
      var str = "";
      _.forEach(logiDetailInfo, (item, index) => {
        if (index < 1) {
          str += item;
        }
      });
      return str;
    },
    //导出入库单
    exportOrder() {
      if (this.queryData.timeList && this.queryData.timeList.length) {
        this.queryData.startTime = this.queryData.timeList[0];
        this.queryData.endTime = this.queryData.timeList[1];
      } else {
        this.queryData.startTime = "";
        this.queryData.endTime = "";
      }
      var params = Object.assign(this.queryData, {});
      NewIncomeOrderExport(this.filterData(params))
        .then((response) => {
          if (response.ret.errcode == 1) {
            this.$message.success("入库单数据导出返回成功");
          }
          // window.open(this.dealShowFileSrc(response.fileUrl))
        })
        .catch((error) => {
          console.log(error);
        });
    },
    search(type) {
      if (type == 1) {
        this.queryData.page.pageNum = 1;
      }
      if (this.queryData.timeList && this.queryData.timeList.length) {
        this.queryData.startTime = this.queryData.timeList[0];
        this.queryData.endTime = this.queryData.timeList[1];
      } else {
        this.queryData.startTime = "";
        this.queryData.endTime = "";
      }
      var params = Object.assign(this.queryData, {});
      NewIncomeOrderPage(this.filterData(params))
        .then((response) => {
          if (response.ret.errcode == 1) {
            this.totals = response.total;
            // this.dataList = response.list
            let incomeList = [];
            response.list.map((item) => {
              item.timeOutDetail = item.countDownEndTime;
            });
            this.dataList = response.list;
            // let data = [];
            // for (let i = 0; i < incomeList.length; i++) {
            //   let item = incomeList[i];
            //   for (let j = 0; j < item.simplePurchaseOrderInfo.length; j++) {
            //     if (j == 0) {
            //       Object.assign(item.simplePurchaseOrderInfo[j], {
            //         rowspan: item.simplePurchaseOrderInfo.length,
            //       });
            //     }
            //     Object.assign(item.simplePurchaseOrderInfo[j], {
            //       abnormalCount: item.abnormalCount,
            //       cancelCount: item.cancelCount,
            //       incomeCount: item.incomeCount,
            //       incomeExceptionInfo: item.incomeExceptionInfo,
            //       incomeNo: item.incomeNo,
            //       incomeOrderStatus: item.incomeOrderStatus,
            //       incomeTime: item.incomeTime,
            //       logiCode: item.logiCode,
            //       logiCompanyName: item.logiCompanyName,
            //       logiCompany: item.logiCompany,
            //       logiDetailInfo: item.logiDetailInfo,
            //       logiSignTime: item.logiSignTime,
            //       overTime: item.overTime,
            //       totalCount: item.totalCount,
            //       warehouseName: item.warehouseName,
            //       warehouseSignTime: item.warehouseSignTime,
            //       timeOutDetail:item.countDownEndTime,
            //       time1:''
            //     });
            //     data.push(item.simplePurchaseOrderInfo[j]);
            //   }
            // }
            // this.dataList = data;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      let activeColumn = [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
      let item = activeColumn.find((val) => {
        return val == columnIndex;
      });
      if (item || columnIndex == 0) {
        if (row.rowspan) {
          return {
            rowspan: row.rowspan,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    getWarehouseList() {
      let params = {
        page: this.queryData.pageData,
      };
      warehousePage(this.filterData(params))
        .then((res) => {
          if (res.ret.errcode === 1) {
            this.wareLists = res.list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //倒计时
    setTimeInter(val, index) {
      var newDate = new Date().getTime();
      var originTime = val;
      var differTime = originTime - newDate;
      var timeDom;
      var t, h, m, s;
      var _this = this;
      if (differTime >= 0) {
        t = Math.floor(differTime / 1000 / 60 / 60 / 24);
        h = Math.floor(differTime / 1000 / 60 / 60);
        // h = Math.floor((differTime / 1000 / 60 / 60) % 24);//带天数的处理
        m = Math.floor((differTime / 1000 / 60) % 60);
        s = Math.floor((differTime / 1000) % 60);
        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        // if (t <= 0) {
        //   t = "";
        //   timeDom = h + ":" + m + ":" + s;
        // } else {
        //   timeDom = t + "天" + h + ":" + m + ":" + s;
        // }
        timeDom = h + ":" + m + ":" + s;
        // window.setTimeout(() => {
        if (timeDom && index >= 0) {
          _this.dataList[index].time1 = timeDom;
        }

        // _this.setTimeInter(originTime);
        // }, 1000);
      } else {
        timeDom = "00:00:00";
        _this.dataList[index].time1 = timeDom;
      }
    },
    //跳转到采购单页面
    detailPurchase(row) {
      console.log(row);
      var data = {
        purchaseOrderNo: row.purchaseNo,
        details: [],
      };
      data.skuCode = row.skuCode;
      this.List.show = true;
      this.List.purchaseOrderNo = row.purchaseNo;
      for (const iterator of data.skuCode) {
        this.$refs.purchaseOrderDetail.getAllSkuDeliveryDetail(iterator);
      }
      for (const iterator of data.skuCode) {
        this.$refs.purchaseOrderDetail.getAllSkuAbnormalDetail(iterator);
      }
      this.$refs.purchaseOrderDetail.getPurchaseOrderDetail();
      this.$refs.purchaseOrderDetail.getPurchaseLogiList();
      this.$refs.purchaseOrderDetail.getPurchaseAssociatedOrderList();
      this.$refs.purchaseOrderDetail.getPurchaseStatusRate();
    },
    //详情
    detailOrder(row) {
      this.dialogVisible = true;
      this.$refs["sockInOrderDetailRef"].sockInOrderDetailLists(row.incomeNo);
    },
    cancelDialog() {
      this.dialogVisible = false;
    },
    //同步物流信息
    SyncLogic(row) {
      console.log(row);
      var params = {
        logiCode: row.logiCode,
        logiCompany: row.logiCompany,
        purchaseNo: row.purchaseNo,
      };
      SyncLogicDetail(params)
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            this.$message.success("同步物流信息成功");
            this.search();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //同步入库信息
    updateSyncIncome(row) {
      var params = {
        incomeNo: row.incomeNo,
      };
      SyncIncome(params)
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            this.$message.success("同步入库信息成功");
            this.search();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleSizeChanges(val) {
      this.queryData.page.pageSize = val;
      this.search();
    },
    handleCurrentChanges(val) {
      this.queryData.page.pageNum = val;
      this.search();
    },
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
