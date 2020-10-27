<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleTabChange">
      <el-tab-pane label="下单失败" name="CREATE_ERROR"></el-tab-pane>
      <el-tab-pane label="待付款" name="WAIT_PAY"></el-tab-pane>
      <el-tab-pane label="待付款异常" name="WAIT_PAY_ERROR"></el-tab-pane>
      <el-tab-pane label="已付款" name="PAY_SUCCESS"></el-tab-pane>
    </el-tabs>
    <div class="filter-container">
      <el-form ref="purchaseOrderFilter" inline :model="queryData" label-width="80px" size="medium">
        <el-form-item label="失败原因：" v-if="activeName=='CREATE_ERROR'">
          <el-select v-model="queryData.createFailReason" clearable >
            <el-option
              v-for="(item,index) in faliReason"
              :key="index"
              :value="item.value"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="失败原因：" v-if="activeName=='WAIT_PAY_ERROR'">
          <el-select v-model="queryData.payFailReason" clearable >
            <el-option
              v-for="(item,index) in faliReason"
              :key="index"
              :value="item.value"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品：" class="product" prop="value">
          <el-input
            placeholder="请输入"
            size="medium"
            clearable
            v-model="queryData.value"
            class="input-with-select"
            @keyup.enter.native="getAutoPurchaseOrderList()"
          >
            <el-select v-model="queryData.choseType" slot="prepend" placeholder="请选择">
              <el-option
                v-for="(item, index) in productOptionList"
                :key="index"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="采购单号：">
          <el-input
            v-model="queryData.purchaseOrderNo"
            clearable
            placeholder="请输入采购单号"
            size="medium"
            @keyup.enter.native="getAutoPurchaseOrderList()"
          ></el-input>
        </el-form-item>
        <span v-show="drop">
          <el-form-item label="供应商：">
            <el-select
              v-model="queryData.supplierId"
              filterable
              clearable
              remote
              reserve-keyword
              :remote-method="getSupplierList"
              placeholder="请输入供应商"
              @change="getAutoPurchaseOrderList()"
              v-el-select-loadmore="loadMore"
            >
              <el-option
                v-for="(item, index) in supplierLists"
                :key="index"
                :label="item.supplierName"
                :value="item.supplierId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="后台类目：" class="filter-item" prop="cateId">
            <el-cascader
              style="width: 300px"
              clearable
              filterable
              :props="{label: 'cateName', children: 'levelValue', value: 'cateId', lazy: true, lazyLoad: getBackSubCategory, checkStrictly: true,emitPath:false}"
              placeholder="请选择商品后台分组"
              :options="backCategoryOptions"
              v-model="queryData.cateId"
              @change="setBackCateId"
              class="normalOperatorBox"
              size="medium"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="订单号：">
            <el-input
              v-model="queryData.orderNo"
              placeholder="请输入订单号"
              clearable
              size="medium"
              @keyup.enter.native="getAutoPurchaseOrderList()"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建时间：">
            <el-date-picker
              v-model="queryData.timeList"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="medium"
              type="daterange"
              clearable
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="第三方订单号：" v-if="activeName!='CREATE_ERROR'" label-width="120px">
            <el-input
              v-model="queryData.thirdNo"
              placeholder="请输入第三方订单号"
              size="medium"
              @keyup.enter.native="getAutoPurchaseOrderList()"
            ></el-input>
          </el-form-item>
        </span>
        <div>
          <el-form-item>
            <el-button
              icon="el-icon-search"
              type="primary"
              size="medium"
              @click="getAutoPurchaseOrderList(1)"
            >搜索</el-button>
            <el-button icon="el-icon-refresh-left" size="medium" @click="resetSearch()">重置</el-button>
            <!-- <el-button
              size="medium"
              type="primary"
              v-if="activeName=='CREATE_ERROR'&&hasPermission('BTN_TRACEABILITY_1688_ORDER_EDIT')"
            >供应商溯源</el-button>-->
            <el-button
              icon="el-icon-s-check"
              type="primary"
              size="medium"
              v-if="activeName=='CREATE_ERROR' && hasPermission('BTN_BATCH_AUTO_PURCHASE_1688')"
              @click="autoPurchase(false)"
            >批量自动采购</el-button>
            <!-- <el-button
              v-if="hasPermission('BTN_PURCHASE_LIST_EXPORT')"
              :loading="exportLoading"
              icon="el-icon-download"
              type="primary"
              size="medium"
              @click="exportPurchaseOrder('yes')"
            >导出订单</el-button>
            <el-button
              v-if="hasPermission('BTN_PURCHASE_LIST_EXPORT')"
              :loading="exportNoImgLoading"
              icon="el-icon-download"
              type="primary"
              size="medium"
              @click="exportPurchaseOrder('noImg')"
            >导出（不带图）</el-button>-->
            <el-button
              icon="el-icon-s-check"
              type="primary"
              size="medium"
              v-if="activeName=='WAIT_PAY' && hasPermission('BTN_BEFORE_PAY_CKECK_1688')"
              @click="validtorPay"
            >付款前校验</el-button>
            <el-button
              type="primary"
              size="medium"
              v-if="activeName=='WAIT_PAY_ERROR' && hasPermission('BTN_BATCH_PAY_CAN_PURCHASE_1688')"
              @click="openConfirmDialog"
            >批量可付款</el-button>
            <el-button
              size="medium"
              type="primary"
              v-if="activeName=='CREATE_ERROR'"
              @click="autoPurchase(true)"
            >现货价下单</el-button>
            <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
              {{dropDownContent}}
              <i :class="dropDownIcon"></i>
            </el-link>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content-wrapper">
      <!---分开表格处理，以防止表格用v-if布局错乱以及抖动-->
      <pay-fail-table
        v-if="activeName=='CREATE_ERROR'||activeName=='WAIT_PAY_ERROR'"
        :loadingFail="loading"
        :tableData="tableData"
        :type="activeName"
        @open-edit="openEditDialog"
        @open-detail="showPurchaseOrderDetail"
        @on-select="hasSelectOrderList"
        @on-success-purchase="successPurchase"
        @on-cancel="cancelPurchaseOrder"
      ></pay-fail-table>
      <pay-success-table
        v-if="activeName=='WAIT_PAY'||activeName=='PAY_SUCCESS'"
        :loadingSuccess="loadingSuccess"
        :tableData="tableData"
        @open-edit="openEditDialog"
        :type="activeName"
        @open-detail="showPurchaseOrderDetail"
        @on-cancel="cancelPurchaseOrder"
      ></pay-success-table>
    </div>
    <div class="pagination-box">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-size="queryData.page.pageSize"
        :page-sizes="[10,20, 30, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!--查看综合详情-->
    <comprehensive-details ref="purchaseOrderDetail" @getList="getListnew" :List="List"></comprehensive-details>
    <edit-supplier
      ref="editDialog"
      :editSupplierDialog="editSupplierDialog"
      @on-cancel-supplier-dialog="closeSupplierDialog"
      :detailType="activeName"
      :pruchaseEditForm="pruchaseEditForm"
      :purchaseOrderNo="purchaseOrderNo"
      :dialogTitle="dialogTitle"
      @on-confirm-success="autoPurchaseSuccess"
    ></edit-supplier>
    <!--付款前校验-->
    <before-confirm-payment
      :confirmDialogVisible="confirmDialogVisible"
      :paymentLoading="paymentLoading"
      :noConformDialog="noConformDialog"
      :submitConformDialog="submitConformDialog"
      :checkContent="checkContent"
      @on-cancel="cancelConfirm"
    ></before-confirm-payment>
    <!--批量付款弹窗-->
    <confirm-payment
      :dialogConfirm="dialogConfirm"
      @on-cancel="cancelConfirmDialog"
      :hasSelectTotal="hasSelectOrder.length"
      @on-success="confirmPay"
    ></confirm-payment>
    <!--确认采购-->
    <confirm-purchase
      v-if="editDialog.confirmPurchase.show"
      ref="confirmPurchase"
      :editDialog="editDialog"
      @getList="getListnew"
      :purchaseList="purchaseList"
      :details="details"
      :transferList="transferList"
    ></confirm-purchase>
  </div>
</template>

<script>
import { supplierBasePage } from "@/request/supplier";
import { categoryListGet } from "@/request/product";
import comprehensiveDetails from "@/views/purchaseManage/purchaseOrder/components/comprehensiveDetails";
import _ from "lodash";
import editSupplier from "./supplier1688Components/editSupplier";
import beforeConfirmPayment from "./supplier1688Components/beforeConfirmPayment";
import payFailTable from "./supplier1688Components/payFailTable";
import paySuccessTable from "./supplier1688Components/paySuccessTable";
import confirmPayment from "./supplier1688Components/confirmPayment";
import confirmPurchase from "@/views/purchaseManage/purchaseOrder/components/confirmPurchase";
import {
  AutoPurchaseOrderList,
  AutoPayCheck,
  CanPayBatch,
  AutoPurchaseDetail,
  AutoBatchPurchase,
} from "@/request/purchase";
import { GetTransferAddress } from "@/request/warehouse";
let params = {};
export default {
  name: "supplier1688Order",
  components: {
    comprehensiveDetails,
    editSupplier,
    beforeConfirmPayment,
    payFailTable,
    paySuccessTable,
    confirmPayment,
    confirmPurchase,
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      faliReason: [
        {
          name: "订单状态错误",
          value: "1",
        },
        {
          name: "运费不一致",
          value: "2",
        },
        {
          name: "总金额不一致",
          value: "3",
        },
        {
          name: "SKU单价不一致",
          value: "4",
        },
        {
          name: "SKU数量不一致",
          value: "5",
        },
        {
          name: "SKU规格名称不一致",
          value: "6",
        },
        {
          name: "商品有起批量",
          value: "7",
        },
        {
          name: "商品下架",
          value: "8",
        },
        {
          name: "SKU缺货",
          value: "9",
        },
        {
          name: "SKU价格高于供货价",
          value: "10",
        },
        {
          name: "商品限购",
          value: "11",
        },
        {
          name: "卖家未授权分销",
          value: "12",
        },
        {
          name: "1688系统异常",
          value: "13",
        },
        {
          name: "交易方式不支持",
          value: "14",
        },
        {
          name: "FINGO系统异常",
          value: "15",
        },
        {
          name: "其他原因",
          value: "0",
        },
      ],
      dialogTitle: "编辑采购单",
      purchaseOrderNo: "",
      percentage: 0,
      //批量可付款校验
      dialogConfirm: false,
      //付款前校验
      confirmDialogVisible: false,
      paymentLoading: false,
      noConformDialog: false,
      submitConformDialog: false,
      //导出
      exportLoading: false,
      exportNoImgLoading: false,
      //批量自动采购
      editSupplierDialog: false,
      activeName: "CREATE_ERROR",
      drop: false,
      total: 0,
      loading: false,
      loadingSuccess: false,
      dropDownContent: "展开",
      dropDownIcon: "el-icon-arrow-down",
      tableData: [],
      supplierLists: [],
      queryData: {
        createFailReason: "",
        supplierId: "",
        skuCode: "",
        productName: "",
        productId: "",
        skuId: "",
        choseType: "",
        purchaseOrderNo: "",
        orderNo: "",
        timeList: [],
        value: "",
        cateId: "",
        thirdNo: "",
        startDate: "",
        endDate: "",
        tabType: "CREATE_ERROR",
        page: {
          pageSize: 20,
          pageNum: 1,
        },
      },
      backCategoryOptions: [],
      supplierQuery: {
        supplierName: "",
        page: {
          pageSize: 20,
          pageNum: 1,
        },
      },
      productOptionList: [
        {
          name: "skuCode",
          code: "1",
        },
        {
          name: "商品名称",
          code: "2",
        },
        {
          name: "skuID",
          code: "3",
        },
        {
          name: "商品ID",
          code: "4",
        },
      ],
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
      hasSelectOrder: [],
      //编辑以及sku详情
      pruchaseEditForm: {},
      //可付款总计
      checkContent: [],
      //确认采购
      purchaseList: [],
      details: [],
      transferList: [],
      editDialog: {
        confirmPurchase: {
          show: false,
        },
        stockOutDetails: {
          show: false,
        },
        // 原订单信息详情页
        Original: {
          show: false,
        },
        // 补单
        Supplement: {
          show: false,
        },
        // 取消采购数量
        cancelnum: {
          show: false,
        },
        show: false,
        type: "edit",
        title: "采购订单编辑",
        param: {
          maxCount: "",
          incomeNum: "",
          storageCount: "",
          purchaseOrderNo: "",
          fingoSkuCode: "",
          purchaseOrderStatus: "",
          purchaseSource: "",
          purchasePrice: "",
          freight: "",
          deliveWay: "",
          forwarderCode: "",
          systemCount: "",
          purchaseCount: "",
          purchaseActualCount: "",
          logisticsSingle: "",
          thirdOrderNo: "",
          supplierId: "",
          synSwitch: false,
          content: "",
          cancelCount: "",
          count: "",
          availableShipCount: "",
          warehouseName: "",
          warehouseNo: "",
        },
      },
    };
  },
  computed: {},
  watch: {},
  mounted() {
    this.getSupplierList("");
    this.fetchCategory({
      level: 1,
      cateType: 2,
      resolve: (data) => {
        this.backCategoryOptions = data;
      },
    });
    this.getAutoPurchaseOrderList();
    // this.getTransferList();
  },
  methods: {
    /**
     * 获取交货仓列表
     */
    getTransferList() {
      GetTransferAddress().then((res) => {
        if (res.ret.errcode === 1) {
          console.log(res);
          this.transferList = res.twhList;
        }
      });
    },
    //确认采购按钮
    successPurchase() {
      this.getAutoPurchaseOrderList();
    },
    //编辑按钮
    autoPurchaseSuccess() {
      this.editSupplierDialog = false;
      this.getAutoPurchaseOrderList();
    },
    //整单取消
    cancelPurchaseOrder() {
      this.getAutoPurchaseOrderList();
    },
    //重置搜索
    resetSearch() {
      (this.queryData = {
        createFailReason: "",
        supplierId: "",
        skuCode: "",
        productName: "",
        productId: "",
        skuId: "",
        choseType: "",
        purchaseOrderNo: "",
        orderNo: "",
        timeList: [],
        value: "",
        cateId: "",
        thirdNo: "",
        startDate: "",
        endDate: "",
        tabType: this.activeName,
        page: {
          pageSize: 20,
          pageNum: 1,
        },
      }),
        this.getParams();
      this.queryData.page.pageNum = 1;
      this.hasSelectOrder = [];
      this.getAutoPurchaseOrderList();
    },
    getParams() {
      console.log(this.queryData.timeList);
      if (this.queryData.timeList && this.queryData.timeList.length) {
        this.queryData.startDate = this.queryData.timeList[0];
        this.queryData.endDate = this.queryData.timeList[1];
      }else{
         this.queryData.startDate =''
        this.queryData.endDate = ''
      }
      if (this.queryData.choseType == 1) {
        this.queryData.skuCode = this.queryData.value;
        this.queryData.productName=''
        this.queryData.skuId=''
        this.queryData.productId=''
      } else if (this.queryData.choseType == 2) {
        this.queryData.productName = this.queryData.value;
        this.queryData.skuCode =''
        this.queryData.skuId=''
        this.queryData.productId=''
      } else if (this.queryData.choseType == 3) {
        this.queryData.skuId = this.queryData.value;
        this.queryData.skuCode = '';
        this.queryData.productName=''
        this.queryData.productId=''
      } else if (this.queryData.choseType == 4) {
        this.queryData.productId = this.queryData.value;
        this.queryData.skuCode = '';
        this.queryData.productName=''
        this.queryData.skuId=''
      }
      this.queryData.tabType = this.activeName;
      params = Object.assign(this.queryData, {});
    },
    //初始化数据
    getAutoPurchaseOrderList(type) {
      this.getParams();
      if (type == 1) {
        params.page.pageNum = 1;
      }
      if (
        this.activeName == "CREATE_ERROR" ||
        this.activeName == "WAIT_PAY_ERROR"
      ) {
        this.loading = true;
      } else if (
        this.activeName == "WAIT_PAY" ||
        this.activeName == "PAY_SUCCESS"
      ) {
        this.loadingSuccess = true;
      }
      AutoPurchaseOrderList(this.filterData(params))
        .then((res) => {
          console.log(res);
          if (res.ret.errcode == 1) {
            this.tableData = res.pbList;
            this.total = res.total;
            this.loading = false;
            this.loadingSuccess = false;
          } else {
            this.loading = false;
            this.loadingSuccess = false;
          }
        })
        .catch((error) => {
          this.loading = false;
          this.loadingSuccess = false;
        });
    },
    getListnew() {
      this.getAutoPurchaseOrderList();
    },
    //付款前校验
    validtorPay() {
      this.getParams();
      this.confirmDialogVisible = true;
      this.paymentLoading = true;
      AutoPayCheck(this.filterData(params))
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            this.confirmDialogVisible = false;
            this.paymentLoading = false;

            if (resultes.successSum == 0) {
              this.noConformDialog = true;
            } else {
              this.submitConformDialog = true;
              this.checkContent = resultes.checkContent;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancelConfirm(data) {
      if (data == "confirm") {
        this.confirmDialogVisible = false;
      } else if (data == "noConfirm") {
        this.noConformDialog = false;
      } else if (data == "submitConfirm") {
        this.submitConformDialog = false;
      }
    },
    closeSupplierDialog() {
      this.editSupplierDialog = false;
    },
    //采购单弹窗
    openEditDialog(data) {
      this.purchaseOrderNo = data.data.purchaseOrderNo;
      if (data.type == "edit") {
        this.dialogTitle = "编辑采购单";
        this.$refs["editDialog"].getSupplierList(data.data.supplierName);
      } else {
        this.dialogTitle = "sku详情";
      }
      var params = {
        purchaseOrderNo: this.purchaseOrderNo,
      };
      AutoPurchaseDetail(params)
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            this.pruchaseEditForm = resultes;
            this.editSupplierDialog = true;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleTabChange(tabs) {
      (this.queryData = {
        createFailReason: "",
        supplierId: "",
        skuCode: "",
        productName: "",
        productId: "",
        skuId: "",
        choseType: "",
        purchaseOrderNo: "",
        orderNo: "",
        timeList: [],
        value: "",
        cateId: "",
        thirdNo: "",
        startDate: "",
        endDate: "",
        tabType: tabs.name,
        page: {
          pageSize: 20,
          pageNum: 1,
        },
      }),
        this.getParams();
      this.queryData.page.pageNum = 1;
      this.hasSelectOrder = [];
      this.getAutoPurchaseOrderList();
    },
    //表格选择
    hasSelectOrderList(data) {
      this.hasSelectOrder = data;
    },
    //自动采购
    autoPurchase(type) {
      if (this.hasSelectOrder.length == 0) {
        this.$message.warning("请选择要自动采购的采购单");
      } else {
        console.log(this.hasSelectOrder);
        var params = {
          purchaseNo: [],
          isUseSpotPrice:type
        };
        _.forEach(this.hasSelectOrder, (item) => {
          params.purchaseNo.push(item.purchaseOrderNo);
        });
        const loading = this.$loading({
          lock: true,
          text: "正在采购中",
          spinner: "el-icon-loading",
          background: "rgba(0, 0, 0, 0.7)",
        });
        AutoBatchPurchase(params).then((resultes) => {
          if (resultes.ret.errcode == 1) {
            loading.close();
            this.hasSelectOrder = [];
            this.getAutoPurchaseOrderList();
            this.$message({
              type:'success',
              message:type?'选中的采购单已现货价下单':'选中的采购单已发起1688自动采购'
            })
          }
        });
      }
    },
    //批量可付款操作
    openConfirmDialog() {
      console.log(this.hasSelectOrder);
      if (this.hasSelectOrder.length == 0) {
        this.$message.warning("请选择要付款的采购单");
      } else {
        this.dialogConfirm = true;
      }
    },
    //批量可付款确认操作
    confirmPay() {
      var params = {
        purchaseOrders: [],
      };
      _.forEach(this.hasSelectOrder, (item) => {
        params.purchaseOrders.push(item.purchaseOrderNo);
      });
      CanPayBatch(params)
        .then((res) => {
          if (res.ret.errcode == 1) {
            this.dialogConfirm = false;
            this.getAutoPurchaseOrderList();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    cancelConfirmDialog() {
      this.dialogConfirm = false;
    },
    dropDown() {
      if (this.drop) {
        this.dropDownContent = "展开";
        this.dropDownIcon = "el-icon-arrow-down";
      } else {
        this.dropDownContent = "收起";
        this.dropDownIcon = "el-icon-arrow-up";
      }
      this.drop = !this.drop;
    },
    getRowKeys(row) {
      if (this.activeName == 1 || this.activeName == 3) {
        return row.date;
      } else if (this.activeName == 2 || this.activeName == 4) {
        return row.name;
      }
    },
    //获取后台类目
    getBackSubCategory(data, resolve) {
      if (data.level == 0) {
        return;
      }
      let value = data.value;
      this.fetchCategory({
        pid: parseInt(value),
        cateType: 2,
        level: data.level + 1,
        resolve,
      });
    },
    // 获取分类
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
          for (let i = 0; i < res.categoryUnit.length; i++) {
            res.categoryUnit[i]["levelValue"] = [];
            let item = res.categoryUnit[i].cateNameValue.find((val) => {
              return val.languageCode == "cn";
            });
            res.categoryUnit[i]["cateName"] = item ? item.name : "";
            res.categoryUnit[i]["cateId"] = String(
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
    //获得供应商
    getSupplierList(value) {
      this.supplierQuery.supplierName = value;
      if (value != "") {
        this.supplierQuery.page.pageNum = 1;
      }
      supplierBasePage(this.filterData(this.supplierQuery)).then((res) => {
        if (res.ret.errcode === 1) {
          if (!value) {
            this.supplierLists = this.deleteObject([
              ...this.supplierLists,
              ...res.list,
            ]);
          } else {
            this.supplierLists = res.list;
          }
        }
      });
    },
    loadMore() {
      if (this.supplierQuery.supplierName == "") {
        this.supplierQuery.page.pageNum++;
        this.getSupplierList("");
      }
    },
    showPurchaseOrderDetail(data) {
      var data = {
        purchaseOrderNo: data.purchaseOrderNo,
        details: [],
      };
      var params = {
        purchaseOrderNo: data.purchaseOrderNo,
      };
      AutoPurchaseDetail(params)
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            data.details = resultes.skuList;
            this.List.show = true;
            this.List.purchaseOrderNo = data.purchaseOrderNo;
            for (const iterator of data.details) {
              this.$refs.purchaseOrderDetail.getAllSkuDeliveryDetail(
                iterator.skuCode
              );
            }
            for (const iterator of data.details) {
              this.$refs.purchaseOrderDetail.getAllSkuAbnormalDetail(
                iterator.skuCode
              );
            }
            this.$refs.purchaseOrderDetail.getPurchaseOrderDetail();
            this.$refs.purchaseOrderDetail.getPurchaseLogiList();
            this.$refs.purchaseOrderDetail.getPurchaseAssociatedOrderList();
            this.$refs.purchaseOrderDetail.getPurchaseStatusRate();
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    //分页
    handleCurrentChange(val) {
      this.queryData.page.pageNum = val;
      this.getAutoPurchaseOrderList();
    },
    handleSizeChange(val) {
      this.queryData.page.pageSize = val;
      this.getAutoPurchaseOrderList();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  .filter-container {
    .product {
      .el-select .el-input {
        width: 130px;
      }
    }
  }
  /deep/ .input-with-select {
    .el-input-group__prepend {
      background-color: #fff;
      .el-select {
        width: 100px;
      }
    }
  }
}
</style>
