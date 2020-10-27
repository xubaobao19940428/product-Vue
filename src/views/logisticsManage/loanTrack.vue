<template>
  <div class="app-container app-puchase">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="采购单" name="first"></el-tab-pane>
      <el-tab-pane label="costgo订单" name="second"></el-tab-pane>
    </el-tabs>
    <!-- <div class="search_header"> -->
      <div class="filter-container">
        <el-form ref="productFilterForm" inline label-width="90px" :model="queryData">
          <!-- <el-form-item label="商品：" class="filter-item" prop="type">
            <el-select
              v-model="queryData.type"
              filterable
              clearable
              style="width: 110px"
              size="medium"
              placeholder="选择类型"
            >
              <el-option
                v-for="(item, index) in typeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              v-model="queryData.value"
              style="width: 200px; margin-right: 20px;"
              size="medium"
              placeholder="请输入"
              clearable
            ></el-input>
          </el-form-item>-->
          <el-form-item label="订单号：" v-if="activeName=='second'">
            <el-input placeholder="请输入订单号" v-model="queryData.orderNo" clearable></el-input>
          </el-form-item>
          <el-form-item label="物流单号：" v-if="activeName=='second'">
            <el-input placeholder="请输入物流单号" v-model="queryData.logiNo" clearable></el-input>
          </el-form-item>
          <!-- <el-form-item
            label="商品类型："
            class="filter-item"
            prop="productType"
            v-if="activeName=='first'"
          >
            <el-select v-model="queryData.productType" size="medium">
              <el-option
                v-for="(item, index) in productTypeList"
                :key="index"
                :label="item.name"
                :value="item.productType"
              ></el-option>
            </el-select>
          </el-form-item>-->
          <!-- <el-form-item label="后台类目：" class="filter-item" prop="backCate">
            <el-cascader
              style="width: 300px"
              clearable
              filterable
              :props="{label: 'cateName', children: 'levelValue', value: 'cateId', lazy: true, lazyLoad: getBackSubCategory, checkStrictly: true}"
              placeholder="请选择商品后台分组"
              :options="backCategoryOptions"
              v-model="queryData.cateId"
              class="normalOperatorBox"
              size="medium"
            ></el-cascader>
          </el-form-item>-->
          <el-form-item label="唛头：" v-if="activeName=='first'">
            <el-input placeholder="请输入唛头" v-model="queryData.marks" clearable></el-input>
          </el-form-item>
          <span>
            <el-form-item label="货代工作号：">
              <el-input placeholder="请输入货代工作号" v-model="queryData.jobNo" clearable></el-input>
            </el-form-item>
            <el-form-item label="BL单号：">
              <el-input placeholder="请输入BL单号" v-model="queryData.blNo" clearable></el-input>
            </el-form-item>
            <el-form-item label="到仓日期：" class="filter-item" prop="timeList">
              <el-date-picker
                v-model="queryData.timeList"
                size="medium"
                type="daterange"
                value-format="timestamp"
                :picker-options="pickerOptions0"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                
              ></el-date-picker>
            </el-form-item>
          </span>
          <el-form-item class="filter-item" style="margin-left: 20px;">
            <el-button icon="el-icon-search" type="primary" @click="searchB2B" size="medium">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="medium"
              v-if="hasPermission('BTN_IMPORT_LOGISTICS')"
              @click="importJobNo"
            >导入货代工作号</el-button>
            <el-button
              type="primary"
              icon="el-icon-download"
              size="medium"
              v-if="hasPermission('BTN_EXPORT_LOGISTICS')"
              @click="exportOrder"
            >导出清单</el-button>
            <el-button
              type="primary"
              size="medium"
              icon="el-icon-setting"
              @click="listSetting"
              v-if="hasPermission('BTN_SET_TABLELIST')"
            >列表设置</el-button>
            <!-- <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
              {{dropDownContent}}
              <i :class="dropDownIcon"></i>
            </el-link>-->
          </el-form-item>
        </el-form>
      </div>
      <div class="main-content-wrapper">
        <el-table :data="tableData" style="width: 100%" ref="table" height="100%" :row-key="getRowKeys" v-loading="loading" border>
          <el-table-column
            v-for="(item,index) in (activeName=='first'?tableCols:costgoCols)"
            :key="index"
            :prop="item.value"
            :label="item.label"
            :width="item.minWidth"
            align="center"
          >
            <template slot-scope="scope">
              <div v-if="item.value=='arrivalDate'">
                <span>{{scope.row.arrivalDate || '-'}}</span>
              </div>
              <div v-if="item.value=='bgdNo'">
                <span>{{scope.row.bgdNo || '-'}}</span>
              </div>
              <div v-if="item.value=='consignee'">
                <span>{{scope.row.consignee || '-'}}</span>
              </div>
              <div v-if="item.value=='cycleDayNum'">
                <span>{{scope.row.cycleDayNum || '-'}}</span>
              </div>
              <div v-if="item.value=='eta'">
                <span>{{scope.row.eta || '-'}}</span>
              </div>
              <div v-if="item.value=='etd'">
                <span>{{scope.row.etd || '-'}}</span>
              </div>
              <div v-if="item.value=='expectedArrivalDate'">
                <span>{{scope.row.expectedArrivalDate || '-'}}</span>
              </div>
              <div v-if="item.value=='grossWeight'">
                <span>{{scope.row.grossWeight || '-'}}</span>
              </div>
              <div v-if="item.value=='invoiceDate'">
                <span>{{scope.row.invoiceDate || '-'}}</span>
              </div>
              <div v-if="item.value=='invoiceNo'">
                <span>{{scope.row.invoiceNo || '-'}}</span>
              </div>
              <div v-if="item.value=='jobNo'">
                <span>{{scope.row.jobNo || '-'}}</span>
              </div>
              <div v-if="item.value=='lastPassDate'">
                <span>{{scope.row.lastPassDate || '-'}}</span>
              </div>
              <div v-if="item.value=='loadingType'">
                <span>{{scope.row.loadingType || '-'}}</span>
              </div>
              <div v-if="item.value=='logiNo'">
                <span>{{scope.row.logiNo || '-'}}</span>
              </div>
              <div v-if="item.value=='masterNo'">
                <span>{{scope.row.masterNo || '-'}}</span>
              </div>
              <div v-if="item.value=='measurement'">
                <span>{{scope.row.measurement || '-'}}</span>
              </div>
              <div v-if="item.value=='orderNo'">
                <span>{{scope.row.orderNo || '-'}}</span>
              </div>
              <div v-if="item.value=='outNo'">
                <span>{{scope.row.outNo || '-'}}</span>
              </div>
              <div v-if="item.value=='marks'">
                <span>{{scope.row.marks.join(',') || '-'}}</span>
              </div>
              <div v-if="item.value=='pkgNum'">
                <span>{{scope.row.pkgNum || '-'}}</span>
              </div>
              <div v-if="item.value=='podName'">
                <span>{{scope.row.podName || '-'}}</span>
              </div>
              <div v-if="item.value=='polName'">
                <span>{{scope.row.polName || '-'}}</span>
              </div>
              <div v-if="item.value=='portClearanceDate'">
                <span>{{scope.row.portClearanceDate || '-'}}</span>
              </div>
              <div v-if="item.value=='qty'">
                <span>{{scope.row.qty || '-'}}</span>
              </div>
              <div v-if="item.value=='qtyUnit'">
                <span>{{scope.row.qtyUnit || '-'}}</span>
              </div>
              <div v-if="item.value=='reqPickDate'">
                <span>{{scope.row.reqPickDate || '-'}}</span>
              </div>
              <div v-if="item.value=='sendPortDate'">
                <span>{{scope.row.sendPortDate || '-'}}</span>
              </div>
              <div v-if="item.value=='shipper'">
                <span>{{scope.row.shipper || '-'}}</span>
              </div>
              <div v-if="item.value=='skuName'">
                <span>{{scope.row.skuName || '-'}}</span>
              </div>
              <div v-if="item.value=='tradeType'">
                <span>{{scope.row.tradeType || '-'}}</span>
              </div>
              <div v-if="item.value=='truckNo'">
                <span>{{scope.row.truckNo || '-'}}</span>
              </div>
              <div v-if="item.value=='truckType'">
                <span>{{scope.row.truckType || '-'}}</span>
              </div>
              <div v-if="item.value=='vessel'">
                <span>{{scope.row.vessel || '-'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="200" fixed="right" :key="Math.random()">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="activeName=='first'&&hasPermission('BTN_LOANTRSCK_SEARCH_ORDER')"
                :disabled="scope.row.loading"
                @click="searchOnlyOne(scope.row,scope.$index)"
              >查询</el-button>
              <el-button
                type="text"
                v-if="activeName=='second'&&hasPermission('BTN_EDIT_COSTGO')"
                @click="editLoanTrack(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                v-if="activeName=='second'&&hasPermission('BTN_LOANTRSCK_SEARCH_ORDER')"
                :disabled="scope.row.loading"
                @click="searchOnlyOne(scope.row,scope.$index)"
              >查询</el-button>
              <el-button
                type="text"
                v-if="activeName=='second'&&hasPermission('BTN_WATCH_COSTGO')"
                @click="watchDetail(scope.row)"
              >查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryData.page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    <!-- </div> -->
    <DialogLoanTrack
      :dialogVisible="dialogVisible"
      :setting="settingModel"
      @on-cancle="dialogVisible=false"
      @on-confirm="handleOnSettingConfirm"
      :type="activeName"
    ></DialogLoanTrack>
    <DialogEditLoan
      :dialogFormVisible="dialogFormVisible"
      :editForm="editForm"
      @on-cancel="cancelEditDialog"
      @on-submit="onSubmit"
    ></DialogEditLoan>
    <DialogTableLoan
      :dialogTableVisible="dialogTableVisible"
      @on-cancel="cancelWatchDialog"
      :gridData="gridData"
    ></DialogTableLoan>
    <upload-file-dialog
      :dialogVisible="uploadDialogVisible"
      @on-confirm="handleUploadConfirm"
      @on-cancle="handleUploadCancle"
      :editType="activeName"
    ></upload-file-dialog>
  </div>
</template>

<script>
import { categoryListGet, getProductEnumInfo } from "@/request/product";
import DialogLoanTrack from "./components/dialogLoanTrack";
import DialogEditLoan from "./components/dialogEditLoan";
import DialogTableLoan from "./components/dialogTableLoan";
import {
  FreightForwarderList,
  ExportCostGoFreight,
  QueryFreightForwarderInfo,
  EditFreightForwarder,
  B2BOutOrderInfo
} from "@/request/logi";
import UploadFileDialog from "./components/uploadFileDialog.vue";
import _ from "lodash";
export default {
  name: "",
  components: {
    DialogLoanTrack,
    DialogEditLoan,
    DialogTableLoan,
    UploadFileDialog
  },
  data() {
    return {
      loading:false,
      //导入货代
      uploadDialogVisible: false,
      //查看详情
      dialogTableVisible: false,
      //编辑部分弹窗内容
      dialogFormVisible: false,
      editForm: {
        jobNo: "",
        logiNo: [],
        outNo: ""
      },
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      gridData: [],
      //列表设置内容
      dialogVisible: false,
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "el-icon-arrow-down",
      activeName: "first",
      typeList: [],
      productTypeList: [],
      tableData: [],
      backCategoryOptions: [],
      settingModel: {
        checkedItem: [
          "货代工作号",
          "报关单号",
          "贸易方式",
          "起运港",
          "目的港",
          "BL单号",
          "船次航次",
          "唛头",
          "提货日期",
          "品名",
          "件数",
          "毛重",
          "体积",
          "开航日期",
          "到港日期",
          "截关日期",
          "车号",
          "送舱日期",
          "目的港清关日期",
          "到仓日期",
          "预计到仓日期"
        ],
        costgoItem: [
          "货代工作号",
          "订单号",
          "出库单号",
          "物流单号",
          "报关单号",
          "贸易方式",
          "起运港",
          "目的港",
          "BL单号",
          "船次航次",
          "唛头",
          "提货日期",
          "品名",
          "件数",
          "毛重",
          "体积",
          "开航日期",
          "到港日期",
          "截关日期",
          "车号",
          "送舱日期",
          "目的港清关日期",
          "到仓日期",
          "预计到仓日期"
        ]
      },
      queryData: {
        orderNo: "",
        logiNo: "",
        jobNo: "",
        blNo: "",
        marks: "",
        // cateId: "",
        // type: "",
        // value: "",
        reqType: "2",
        productType: null,
        timeList: [],
        startTime: "",
        endTime: "",
        page: {
          pageSize: 20,
          pageNum: 1
        }
      },
      total: 0,
      //cosTgo单号
      costgoCols: [
        {
          label: "货代工作号",
          value: "jobNo",
          minWidth: 180,
          disabled: false
        },
        {
          label: "订单号",
          value: "orderNo",
          minWidth: 180,
          disabled: true
        },
        {
          label: "出库单号",
          value: "outNo",
          minWidth: 250,
          disabled: true
        },
        {
          label: "物流单号",
          value: "logiNo",
          minWidth: 180,
          disabled: false
        },
        {
          label: "报关单号",
          value: "bgdNo",
          minWidth: 180,
          disabled: false
        },
        {
          label: "贸易方式",
          value: "tradeType",
          minWidth: 180,
          disabled: false
        },
        {
          label: "起运港",
          value: "polName",
          minWidth: 80,
          disabled: false
        },
        {
          label: "目的港",
          value: "podName",
          minWidth: 120,
          disabled: false
        },
        {
          label: "BL单号",
          value: "masterNo",
          minWidth: 150,
          disabled: false
        },
        {
          label: "船次航次",
          value: "vessel",
          minWidth: 100,
          disabled: false
        },
        {
          label: "唛头",
          value: "marks",
          minWidth: 250,
          disabled: false
        },
        {
          label: "提货日期",
          value: "reqPickDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "品名",
          value: "skuName",
          minWidth: 100,
          disabled: false
        },
        {
          label: "件数",
          value: "pkgNum",
          minWidth: 100,
          disabled: false
        },
        {
          label: "毛重",
          value: "grossWeight",
          minWidth: 100,
          disabled: false
        },
        {
          label: "体积",
          value: "measurement",
          minWidth: 120,
          disabled: false
        },
        {
          label: "开航日期",
          value: "etd",
          minWidth: 200,
          disabled: false
        },
        {
          label: "到港日期",
          value: "eta",
          minWidth: 200,
          disabled: false
        },
        {
          label: "截关日期",
          value: "lastPassDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "车号",
          value: "truckNo",
          minWidth: 100,
          disabled: false
        },

        {
          label: "送舱日期",
          value: "sendPortDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "目的港清关日期",
          value: "portClearanceDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "到仓日期",
          value: "arrivalDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "预计到仓日期",
          value: "expectedArrivalDate",
          minWidth: 200,
          disabled: false
        }
      ],
      //采购单
      tableCols: [
        {
          label: "货代工作号",
          value: "jobNo",
          minWidth: 180,
          disabled: true
        },
        {
          label: "报关单号",
          value: "bgdNo",
          minWidth: 250,
          disabled: true
        },
        {
          label: "贸易方式",
          value: "tradeType",
          minWidth: 180,
          disabled: false
        },
        {
          label: "起运港",
          value: "polName",
          minWidth: 80,
          disabled: false
        },
        {
          label: "目的港",
          value: "podName",
          minWidth: 120,
          disabled: false
        },
        {
          label: "BL单号",

          value: "masterNo",
          minWidth: 150,
          disabled: false
        },
        {
          label: "船次航次",
          value: "vessel",
          minWidth: 100,
          disabled: false
        },
        {
          label: "唛头",
          value: "marks",
          minWidth: 250,
          disabled: false
        },
        {
          label: "提货日期",
          value: "reqPickDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "品名",
          value: "skuName",
          minWidth: 100,
          disabled: false
        },
        {
          label: "件数",
          value: "pkgNum",
          minWidth: 100,
          disabled: false
        },
        {
          label: "毛重",
          value: "grossWeight",
          minWidth: 100,
          disabled: false
        },
        {
          label: "体积",
          value: "measurement",
          minWidth: 120,
          disabled: false
        },
        {
          label: "开航日期",
          value: "etd",
          minWidth: 200,
          disabled: false
        },
        {
          label: "到港日期",
          value: "eta",
          minWidth: 200,
          disabled: false
        },
        {
          label: "截关日期",
          value: "lastPassDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "车号",
          value: "truckNo",
          minWidth: 100,
          disabled: false
        },
        {
          label: "送舱日期",
          value: "sendPortDate",
          minWidth: 160,
          disabled: false
        },
        {
          label: "目的港清关日期",
          value: "portClearanceDate",
          minWidth: 160,
          disabled: false
        },
        {
          label: "到仓日期",
          value: "arrivalDate",
          minWidth: 160,
          disabled: false
        },
        {
          label: "预计到仓日期",
          value: "expectedArrivalDate",
          minWidth: 160,
          disabled: false
        }
      ],
      //全部采购的表头名称
      allCols: [
        {
          label: "货代工作号",
          value: "jobNo",
          minWidth: 180,
          disabled: true
        },
        {
          label: "报关单号",
          value: "bgdNo",
          minWidth: 250,
          disabled: true
        },
        {
          label: "发货人",
          value: "shipper",
          minWidth: 180,
          disabled: false
        },
        {
          label: "收货人",
          value: "consignee",
          minWidth: 180,
          disabled: false
        },
        {
          label: "贸易方式",
          value: "tradeType",
          minWidth: 180,
          disabled: false
        },
        {
          label: "起运港",
          value: "polName",
          minWidth: 80,
          disabled: false
        },
        {
          label: "目的港",
          value: "podName",
          minWidth: 120,
          disabled: false
        },
        {
          label: "BL单号",

          value: "masterNo",
          minWidth: 150,
          disabled: false
        },
        {
          label: "船次航次",
          value: "vessel",
          minWidth: 100,
          disabled: false
        },
        {
          label: "唛头",
          value: "marks",
          minWidth: 250,
          disabled: false
        },
        {
          label: "提货日期",
          value: "reqPickDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "品名",
          value: "skuName",
          minWidth: 100,
          disabled: false
        },
        {
          label: "件数",
          value: "pkgNum",
          minWidth: 100,
          disabled: false
        },
        {
          label: "毛重",
          value: "grossWeight",
          minWidth: 100,
          disabled: false
        },
        {
          label: "体积",
          value: "measurement",
          minWidth: 120,
          disabled: false
        },
        {
          label: "开航日期",
          value: "etd",
          minWidth: 200,
          disabled: false
        },
        {
          label: "到港日期",
          value: "eta",
          minWidth: 200,
          disabled: false
        },
        {
          label: "截关日期",
          value: "lastPassDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "车号",
          value: "truckNo",
          minWidth: 100,
          disabled: false
        },
        {
          label: "车型",
          value: "truckType",
          minWidth: 150,
          disabled: false
        },
        {
          label: "装载方式",
          value: "loadingType",
          minWidth: 150,
          disabled: false
        },
        {
          label: "invoice Date",
          value: "invoiceDate",
          minWidth: 160,
          disabled: false
        },
        {
          label: "送舱日期",
          value: "sendPortDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "门到门的物流天数",
          value: "cycleDayNum",
          minWidth: 160,
          disabled: false
        },
        {
          label: "QTY",
          value: "qty",
          minWidth: 160,
          disabled: false
        },
        {
          label: "QTY UNIT",
          value: "qtyUnit",
          minWidth: 160,
          disabled: false
        },
        {
          label: "目的港清关日期",
          value: "portClearanceDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "Invoice NO.",
          value: "invoiceNo",
          minWidth: 200,
          disabled: false
        },
        {
          label: "到仓日期",
          value: "arrivalDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "预计到仓日期",
          value: "expectedArrivalDate",
          minWidth: 200,
          disabled: false
        }
      ],
      //costgo表头
      allCostgo: [
        {
          label: "订单号",
          value: "orderNo",
          minWidth: 180,
          disabled: true
        },
        {
          label: "出库单号",
          value: "outNo",
          minWidth: 250,
          disabled: true
        },
        {
          label: "物流单号",
          value: "logiNo",
          minWidth: 180,
          disabled: false
        },
        {
          label: "货代工作号",
          value: "jobNo",
          minWidth: 180,
          disabled: false
        },
        {
          label: "报关单号",
          value: "bgdNo",
          minWidth: 180,
          disabled: false
        },
        {
          label: "发货人",
          value: "shipper",
          minWidth: 180,
          disabled: false
        },
        {
          label: "收货人",
          value: "consignee",
          minWidth: 180,
          disabled: false
        },
        {
          label: "贸易方式",
          value: "tradeType",
          minWidth: 180,
          disabled: false
        },
        {
          label: "起运港",
          value: "polName",
          minWidth: 80,
          disabled: false
        },
        {
          label: "目的港",
          value: "podName",
          minWidth: 120,
          disabled: false
        },
        {
          label: "BL单号",
          value: "masterNo",
          minWidth: 150,
          disabled: false
        },
        {
          label: "船次航次",

          value: "vessel",
          minWidth: 100,
          disabled: false
        },
        {
          label: "唛头",
          value: "marks",
          minWidth: 250,
          disabled: false
        },
        {
          label: "提货日期",
          value: "reqPickDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "品名",
          value: "skuName",
          minWidth: 100,
          disabled: false
        },
        {
          label: "件数",
          value: "pkgNum",
          minWidth: 100,
          disabled: false
        },
        {
          label: "毛重",
          value: "grossWeight",
          minWidth: 100,
          disabled: false
        },
        {
          label: "体积",
          value: "measurement",
          minWidth: 120,
          disabled: false
        },
        {
          label: "开航日期",
          value: "etd",
          minWidth: 200,
          disabled: false
        },
        {
          label: "到港日期",
          value: "eta",
          minWidth: 200,
          disabled: false
        },
        {
          label: "截关日期",
          value: "lastPassDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "车号",
          value: "truckNo",
          minWidth: 100,
          disabled: false
        },
        {
          label: "车型",
          value: "truckType",
          minWidth: 150,
          disabled: false
        },
        {
          label: "装载方式",
          value: "loadingType",
          minWidth: 150,
          disabled: false
        },
        {
          label: "invoice Date",
          value: "invoiceDate",
          minWidth: 160,
          disabled: false
        },
        {
          label: "送舱日期",
          value: "sendPortDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "门到门的物流天数",
          value: "cycleDayNum",
          minWidth: 160,
          disabled: false
        },
        {
          label: "QTY",
          value: "qty",
          minWidth: 160,
          disabled: false
        },
        {
          label: "QTY UNIT",
          value: "qtyUnit",
          minWidth: 160,
          disabled: false
        },
        {
          label: "目的港清关日期",
          value: "portClearanceDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "Invoice NO.",
          value: "invoiceNo",
          minWidth: 160,
          disabled: false
        },
        {
          label: "到仓日期",
          value: "arrivalDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "预计到仓日期",
          value: "expectedArrivalDate",
          minWidth: 200,
          disabled: false
        }
      ]
    };
  },
  computed: {},
  watch: {},
  created() {
    if (this.getStore("loanListColumn")) {
      this.tableCols = JSON.parse(this.getStore("loanListColumn"));
      let checkedItem = [];
      _.forEach(this.tableCols, (col, index) => {
        checkedItem.splice(index, 0, col.label);
      });
      this.settingModel.checkedItem = _.uniq(checkedItem);
    }
    if (this.getStore("cosListColumn")) {
      this.costgoCols = JSON.parse(this.getStore("cosListColumn"));
      let costgoItem = [];
      _.forEach(this.costgoCols, (col, index) => {
        costgoItem.splice(index, 0, col.label);
      });
      this.settingModel.costgoItem = _.uniq(costgoItem);
    }
  },
  mounted() {
    // this.getProductEnumInfo();
    // this.fetchCategory({
    //   level: 1,
    //   cateType: 2,
    //   resolve: data => {
    //     this.backCategoryOptions = data;
    //   }
    // });
    this.searchB2B();
  },
  methods: {
    getRowKeys(row){
      return row.jobNo
    },
    //分页
    handleSizeChange(val) {
      this.queryData.page.pageSize = val;
      this.searchB2B();
    },
    handleCurrentChange(val) {
      this.queryData.page.pageNum = val;
      this.searchB2B();
    },
    //初始化数据
    searchB2B() {
      this.loading = true
      let params = {};
      params.startTime = "";
      params.endTime = "";
      if (this.activeName == "first") {
        this.queryData.reqType = "2";
      } else {
        this.queryData.reqType = "1";
      }
      for (var key in this.queryData) {
        params[key] = this.queryData[key];
      }

      if (this.queryData.timeList) {
        if (this.queryData.timeList.length != 0) {
          params.startTime = this.timestampToTime(this.queryData.timeList[0]);
          params.endTime = this.timestampToTime(this.queryData.timeList[1]+24*60*60*1000-1);
        }
      }

      FreightForwarderList(this.filterData(params))
        .then(response => {
          if (response.ret.errcode == 1) {
            _.forEach(response.pbList, item => {
              item.loading = false;
            });
            this.tableData = response.pbList;
            this.total = response.total;
            this.loading=false
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //tabs切换
    handleClick(tabs) {
      this.queryData.page.pageNum = 1;
      this.resetSearch();
      this.searchB2B();
    },
    //列表设置
    listSetting() {
      this.dialogVisible = true;
    },
    //重制搜索
    resetSearch() {
      (this.queryData.orderNo = ""),
        (this.queryData.logiNo = ""),
        (this.queryData.jobNo = ""),
        (this.queryData.blNo = ""),
        (this.queryData.marks = ""),
        (this.queryData.timeList = []);
      this.searchB2B();
    },
    //导出订单
    exportOrder() {
      let params = {};
      params.startTime = "";
      params.endTime = "";
      if (this.activeName == "first") {
        this.queryData.reqType = "2";
      } else {
        this.queryData.reqType = "1";
      }
      for (var key in this.queryData) {
        params[key] = this.queryData[key];
      }
      if (this.queryData.timeList) {
        {
          if (this.queryData.timeList.length != 0) {
            params.startTime = this.queryData.timeList[0].toString();
            params.endTime = this.queryData.timeList[1].toString();
          }
        }
      }
      ExportCostGoFreight(this.filterData(params))
        .then(response => {
          if (response.ret.errcode == 1) {
            let fileUrl = response.fileUrl;
            window.open(this.dealShowFileSrc(fileUrl));
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //导入货代设置
    importJobNo() {
      this.uploadDialogVisible = true;
    },
    handleUploadConfirm() {
      this.uploadDialogVisible = false;
      this.searchB2B();
    },
    handleUploadCancle() {
      this.uploadDialogVisible = false;
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
    getBackSubCategory(data, resolve) {
      if (data.level == 0) {
        return;
      }
      let value = JSON.parse(data.value);
      this.fetchCategory({
        pid: parseInt(value.cateId),
        cateType: 2,
        level: data.level + 1,
        resolve
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
            res.categoryUnit[i]["prop"] = JSON.stringify({
              cateId: String(res.categoryUnit[i].cateId),
              cateName: item ? item.name : ""
            });
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
    //得到商品品类
    getProductEnumInfo() {
      let params = {};
      getProductEnumInfo(this.filterData(params)).then(response => {
        if (response.ret.errcode === 1) {
          let productTypes = [];
          _.forEach(response.productType, item => {
            item.productType = item.productType + "";
            productTypes.push(item);
          });
          this.productTypeList = productTypes;
        }
      });
    },
    handleOnSettingConfirm(data) {
      this.dialogVisible = false;
      if (this.activeName == "first") {
        this.tableCols = [];
        let checkedItem = _.uniq(data.checkedItem);
        let checkedClos = [];

        _.forEach(checkedItem, item => {
          _.forEach(this.allCols, col => {
            if (col.label == item) {
              checkedClos.push(col);
            }
          });
        });
        this.tableCols = checkedClos;
        this.setStore("loanListColumn", checkedClos);
      } else {
        this.costgoCols = [];
        let costgoItem = _.uniq(data.costgoItem);
        let costgoClos = [];
        _.forEach(costgoItem, item => {
          _.forEach(this.allCostgo, col => {
            if (col.label == item) {
              costgoClos.push(col);
            }
          });
        });
        this.costgoCols = costgoClos;
        this.setStore("cosListColumn", costgoClos);
      }
    },
    searchOnlyOne(row, index) {
      this.tableData[index].loading = true;
      var params = {
        jobNo: row.jobNo
      };
      QueryFreightForwarderInfo(params)
        .then(response => {
          if (response.ret.errcode == 1) {
            this.searchB2B();
          }
        })
        .catch(error => {
          this.tableData[index].loading = false;
        });
      // window.setTimeout(()=>{
      //   this.tableData[index] = Object.assign(this.tableData[index],obj)
      //     this.tableData[index].loading=false
      // },2000)
    },
    //编辑costgo订单
    editLoanTrack(row) {
      console.log(row);
      var arr = [];
      this.editForm.logiNo = [];
      this.dialogFormVisible = true;
      this.editForm.jobNo = row.jobNo;

      // this.editForm.logiNo = row.logiNo
      this.editForm.outNo = row.outNo;
      arr = row.logiNo.split(",");
      _.forEach(arr, item => {
        this.editForm.logiNo.push({
          logiNo: item
        });
      });
      console.log(this.editForm);
    },
    cancelEditDialog() {
      this.dialogFormVisible = false;
    },
    onSubmit(data) {
      var logiNo = [];
      _.forEach(data.logiNo, item => {
        logiNo.push(item.logiNo);
      });
      var inputLigiNo = logiNo.join(",");
      var params = {
        jobNo: data.jobNo,
        logiNo: inputLigiNo,
        outNo: data.outNo
      };
      EditFreightForwarder(params)
        .then(res => {
          if (res.ret.errcode == 1) {
            this.$message.success("编辑成功");
            this.dialogFormVisible = false;
            this.searchB2B();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //查看costgo订单
    watchDetail(row) {
      var params = {
        outNo: row.outNo
      };
      B2BOutOrderInfo(params)
        .then(response => {
          if (response.ret.errcode == 1) {
            this.gridData = response.skuInfo;
            this.dialogTableVisible = true;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    cancelWatchDialog() {
      this.dialogTableVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
// .loan_track {
  // overflow-y: scroll;
 
/deep/ .el-table__fixed-body-wrapper{
top:44px!important;
}
// }
</style>
