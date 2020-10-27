<template>
  <div class="direct-mail">
    <el-tabs v-model="activeTab" @tab-click="tabClick">
      <el-tab-pane
        v-for="(item, index) in tabList"
        :key="index"
        :label="item.title"
        :name="item.name"
      >
        <el-form ref="directMailFilter" inline label-width="80px" :model="queryData">
          <el-form-item class="filter-item" label="时间：">
            <el-select v-model="queryData.timeChose" placeholder="请选择" @change="timeChoseChange">
              <el-option
                v-for="(item, index) in timeChoseList"
                :key="index"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="timeList" class="filter-item">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="queryData.timeList"
              size="medium"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
          <el-form-item prop="jitNo" label="订单号：" class="filter-item">
            <el-input
              v-model="queryData.jitNo"
              clearable
              placeholder="订单编号"
              size="medium"
              style="width: 200px"
              @keyup.enter.native="search"
            ></el-input>
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
          <span v-show="drop">
            <el-form-item prop="subOrderNo" label="子单号：" class="filter-item">
              <el-input
                v-model="queryData.subOrderNo"
                clearable
                placeholder="订单编号"
                size="medium"
                style="width: 200px"
                @keyup.enter.native="search"
              ></el-input>
            </el-form-item>
            <el-form-item prop="orderNo" label="主单号：" class="filter-item">
              <el-input
                v-model="queryData.orderNo"
                clearable
                placeholder="订单编号"
                size="medium"
                style="width: 200px"
                @keyup.enter.native="search"
              ></el-input>
            </el-form-item>
            <el-form-item label="供应商：" prop="supplierId" class="filter-item">
              <el-select
                v-model="queryData.supplierId"
                :remote-method="getSupplierList"
                filterable
                clearable
                remote
                reserve-keyword
                placeholder="请输入供应商"
                style="width: 260px"
              >
                <el-option
                  v-for="(item, index) in supplierList"
                  :key="index"
                  :label="item.supplierName"
                  :value="item.supplierId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="filter-item" label="系统：">
              <el-select
                v-model="queryData.isUseFingoSystem"
                placeholder="请选择"
                @change="optionChange"
              >
                <el-option v-for="(val, key) in FingoSystem" :key="key" :label="val" :value="key"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="filter-item" label="商品：">
              <el-select v-model="queryData.choseType" placeholder="请选择" @change="optionChange">
                <el-option
                  v-for="(item, index) in productOptionList"
                  :key="index"
                  :label="item.name"
                  :value="item.code"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="filter-item">
              <el-input
                placeholder="请输入"
                clearable
                v-model="queryData.value"
                class="input-with-select"
              ></el-input>
            </el-form-item>
            <el-form-item label="销售国家：" class="filter-item" prop="countryCode">
              <el-select v-model="queryData.countryCode" size="medium" clearable>
                <el-option
                  v-for="(item, index) in countryList"
                  :key="index"
                  :label="item.nameLocal"
                  :value="item.shortCode"
                ></el-option>
              </el-select>
            </el-form-item>
          </span>
          <el-form-item class="filter-item" style="margin-left: 20px;">
            <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
            <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
              {{dropDownContent}}
              <i :class="dropDownIcon"></i>
            </el-link>
          </el-form-item>
        </el-form>
        <div class="btn-box">
          <el-button type="primary" plain @click="exportTable">
            <i class="iconfont">&#xe638;</i>下载
          </el-button>
          <el-button type="primary" @click="uploadFile">
            <i class="iconfont">&#xe62b;</i>批量上传物流单
          </el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%" :span-method="arraySpanMethod">
          <el-table-column label="订单信息" width="240" fixed="left">
            <template slot-scope="scope">
              <div>订单号：{{scope.row.jitNo}}</div>
              <div>子单号：{{scope.row.subOrderNo|| '-'}}</div>
              <div>主单号：{{scope.row.orderNo || '-'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="时间" width="200">
            <template slot-scope="scope">
              <!-- <div>下单：{{scope.row.createTime | formatTime}}</div> -->
              <div>支付：{{scope.row.payTime | formatTime}}</div>
              <div>发货：{{scope.row.shipTime | formatTime}}</div>
            </template>
          </el-table-column>
          <el-table-column label="供应商" width="300">
            <template slot-scope="scope">
              <div>{{scope.row.supplierName}}</div>
              <div>供应商ID：{{scope.row.supplierId}}</div>
            </template>
          </el-table-column>
          <el-table-column label="商品" width="400" align="center">
            <template slot-scope="scope">
              <div class="produt">
                <img :src="dealShowFileSrc(scope.row.productCover)" />
                <div class="product-content">
                  <div class="product-content-name">{{scope.row.productName}}</div>
                  <div class="product-content-supplier">sku_code：{{scope.row.skuCode}}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="规格" width="180" align="center">
            <template slot-scope="scope">{{scope.row.skuDesc}}</template>
          </el-table-column>
          <el-table-column label="数量" width="180" align="center">
            <template slot-scope="scope">{{scope.row.count}}</template>
          </el-table-column>
          <el-table-column label="已发货数量" width="180" align="center">
            <template slot-scope="scope">{{scope.row.shipCount}}</template>
          </el-table-column>
          <el-table-column label="销售国家" width="100" align="center">
            <template slot-scope="scope">{{showCountry(scope.row.countryCode)}}</template>
          </el-table-column>
          <el-table-column label="收货信息" width="300" align="center">
            <template slot-scope="scope">
              <div class="address">
                <div>收货人姓名：{{scope.row.address.receiverName}}</div>
                <div>收货人电话：{{scope.row.address.receiverPhone}}</div>
                <div>邮编：{{scope.row.address.postcode}}</div>
                <div>收货地址：{{scope.row.address.address}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="120" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.jitStatus === '1'?'待发货':scope.row.jitStatus === '2'?'部分发货':scope.row.jitStatus === '3'?'已发货':'已取消'}}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="scope.row.jitStatus === '1' || scope.row.jitStatus === '2'"
                @click="shipClick(scope.row)"
              >发货</el-button>
              <el-button
                type="text"
                v-if="scope.row.jitStatus === '1'"
                @click="cancleClick(scope.row)"
              >取消</el-button>
              <el-button
                type="text"
                v-if="scope.row.jitStatus === '3' || scope.row.jitStatus === '2'"
                @click="viewClick(scope.row)"
              >查看物流</el-button>
              <el-button
                type="text"
                v-if="scope.row.jitStatus === '3' || scope.row.jitStatus === '2'"
                @click="modifyClick(scope.row)"
              >修改运单号</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrapper">
          <el-pagination
            @size-change="handleSizeChanges"
            @current-change="handleCurrentChanges"
            :current-page="queryData.page.pageNum"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="queryData.page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-tab-pane>
    </el-tabs>
    <upload-file
      v-if="uploadDialog"
      :dialogVisible="uploadDialog"
      :mark="'direct'"
      @on-cancle="uploadCancle"
    ></upload-file>
    <bulk-ship
      v-if="blukShipDialog"
      :dialogVisible="blukShipDialog"
      :shipCountryCode="shipCountryCode"
      :blukShipList="bundList"
      @on-cancle="blukShipCancle"
      @on-confirm="blukShipConfirm"
    ></bulk-ship>
    <view-logistics
      v-if="viewDialog"
      :dialogVisible="viewDialog"
      :bundList="bundList"
      @on-cancle="viewCancle"
    ></view-logistics>
    <modify-waybill
      v-if="modifyDialog"
      :dialogVisible="modifyDialog"
      :modifyJitNo="modifyJitNo"
      :modifyList="modifyList"
      :countryCode="countryCode"
      @on-cancle="modifyCancle"
      @on-confirm="modifyConfirm"
    ></modify-waybill>
  </div>
</template>
<script>
// import moment from 'moment'
import { supplierBasePage } from "@/request/supplier";
import {
  JitOrderPage,
  QueryLogiTracking,
  ExportJitOrder,
  QueryJitLogi,
  CancelOrder
} from "@/request/directMail";
import bulkShip from "./components/bulkShip";
import ViewLogistics from "./components/ViewLogistics";
import ModifyWaybill from "./components/ModifyWaybill";
import UploadFile from "./components/UploadFile";
import { categoryListGet } from "@/request/product";
export default {
  data() {
    return {
      backCategoryOptions: [],
      activeTab: "ALL",
      tabList: [
        {
          title: "全部",
          name: "ALL"
        },
        {
          title: "待发货",
          name: "UN_SHIP"
        },
        {
          title: "部分发货",
          name: "PART_SHIP"
        },
        {
          title: "已发货",
          name: "SHIPPED"
        },
        {
          title: "已取消",
          name: "CANCELED"
        },
        {
          title: "未分组",
          name: "UNGROUP"
        }
      ],
      productOptionList: [
        {
          name: "商品名称",
          code: "1"
        },
        {
          name: "skuCode",
          code: "2"
        }
        // {
        //     name: '条形码',
        //     code: '3'
        // },
        // {
        //     name: '商家货号',
        //     code: '4'
        // }
      ],
      timeChoseList: [
        //     {
        //     name: '下单时间',
        //     code: 1
        // },
        {
          name: "支付时间",
          code: 3
        },
        {
          name: "发货时间",
          code: 4
        }
      ],
      queryData: {
        choseType: "1",
        timeChose: 3,
        value: "",
        skuCode: "",
        productName: "",
        supplierId: "",
        isUseFingoSystem: "",
        timeList: [],
        jitNo: "",
        subOrderNo: "",
        orderNo: "",
        countryCode: "",
        cateId: [],
        page: {
          pageNum: 1,
          pageSize: 10
        }
      },
      modifyJitNo: "",
      countryCode: "",
      FingoSystem: {
        "1": "使用商家系统",
        "2": "不使用商家系统"
      },
      total: 0,
      supplierName: "",
      supplierList: [],
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "el-icon-arrow-down",
      tableData: [],
      bundList: [],
      modifyList: [],
      blukShipDialog: false,
      viewDialog: false,
      modifyDialog: false,
      uploadDialog: false,
      shipCountryCode: ""
    };
  },
  components: {
    bulkShip,
    ViewLogistics,
    ModifyWaybill,
    UploadFile
  },
  created() {
    let startTime =
      moment()
        .subtract(3, "months")
        .format("YYYY-MM-DD") + " 00:00:00";
    let endTime = moment().format("YYYY-MM-DD") + " 23:59:59";
    this.queryData.timeList = [startTime, endTime];
    console.log(this.queryData.timeList);
  },
  mounted() {
    // this.getSupplierList()
    this.getJitOrderPage();
    this.fetchCategory({
      level: 1,
      cateType: 2,
      resolve: data => {
        this.backCategoryOptions = data;
      }
    });
  },
  computed: {
    countryList() {
      return this.$store.state.dict.countryList;
    },
    nowEndDate() {
      return this.$store.state.globalNum.nowEndDate;
    },
    lastMonthDate() {
      return this.$store.state.globalNum.lastMonthDate;
    }
  },
  methods: {
    //后台类目
    getBackSubCategory(data, resolve) {
      if (data.level == 0) {
        return;
      }
      let value = data.value
      console.log(data);
      this.fetchCategory({
        pid: parseInt(value),
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
            res.categoryUnit[i]['cateId'] = String(res.categoryUnit[i]['cateId'])
            // res.categoryUnit[i]["prop"] = JSON.stringify({
            //   cateId: String(res.categoryUnit[i].cateId),
            //   cateName: item ? item.name : ""
            // });
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
    showCountry(code) {
      let country = this.countryList.find(val => {
        return val.shortCode === code;
      });
      return country.nameCn;
    },
    // 获取供应商列表
    getSupplierList(query) {
      let params = {
        supplierName: query
      };
      supplierBasePage(this.filterData(params)).then(res => {
        console.log(res);
        if (res.ret.errcode === 1) {
          this.supplierList = res.list;
        }
      });
    },
    tabClick(val) {
      console.log(val);
      this.activeTab = val.name;
      this.getJitOrderPage();
    },
    optionChange(val) {
      console.log(val);
      this.queryData.choseType = val;
      switch (this.queryData.choseType) {
        case "1":
          (this.queryData.skuCode = ""),
            (this.queryData.qrCode = ""),
            (this.queryData.supplierCode = "");
          break;
        case "2":
          (this.queryData.productName = ""),
            (this.queryData.qrCode = ""),
            (this.queryData.supplierCode = "");
          break;
        case "3":
          (this.queryData.productName = ""),
            (this.queryData.skuCode = ""),
            (this.queryData.supplierCode = "");
          break;
        case "4":
          (this.queryData.productName = ""),
            (this.queryData.skuCode = ""),
            (this.queryData.qrCode = "");
          break;
      }
    },
    timeChoseChange(val) {
      console.log(val);
      this.queryData.timeChose = val;
    },
    timeChoseChange(val) {
      console.log(val);
      this.queryData.timeChose = val;
    },
    // 合并单元格
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      let activeColumn = [0, 1, 2, 7, 8, 9, 10];
      let item = activeColumn.find(val => {
        return val == columnIndex;
      });
      if (item || columnIndex == 0) {
        if (row.rowspan) {
          return {
            rowspan: row.rowspan,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    getJitOrderPage() {
      switch (this.queryData.choseType) {
        case "1":
          this.queryData.productName = this.queryData.value;
          break;
        case "2":
          this.queryData.skuCode = this.queryData.value;
          break;
      }
      console.log(this.queryData.timeList);
      let params = {
        page: this.queryData.page,
        jitNo: this.queryData.jitNo,
        subOrderNo: this.queryData.subOrderNo,
        orderNo: this.queryData.orderNo,
        skuCode: this.queryData.skuCode,
        jitStatus: 0,
        supplierId: this.queryData.supplierId,
        startTime: this.queryData.timeList ? this.queryData.timeList[0] : null,
        endTime: this.queryData.timeList ? this.queryData.timeList[1] : null,
        timeType: this.queryData.timeChose,
        tabType: this.activeTab,
        productName: this.queryData.productName,
        countryCode: this.queryData.countryCode,
        isUseFingoSystem: this.queryData.isUseFingoSystem,
        receiverName: "",
        receiverPhone: "",
        languageCode: "cn",
        reqType: 1,
        cateId:this.queryData.cateId?this.queryData.cateId:[]
      };
      console.log(params);
      JitOrderPage(this.filterData(params)).then(res => {
        if (res.ret.errcode === 1) {
          if (res.ret.errcode === 1) {
            let data = [];
            for (let i = 0; i < res.list.length; i++) {
              for (let j = 0; j < res.list[i].details.length; j++) {
                let item = JSON.parse(JSON.stringify(res.list[i]));
                if (j == 0) {
                  item["rowspan"] = res.list[i].details.length;
                }
                Object.assign(item, res.list[i].details[j]);
                data.push(item);
              }
            }
            console.log(data);
            this.tableData = data;
            this.total = parseInt(res.total);
          }
        }
      });
    },
    handleSizeChanges(val) {
      this.queryData.page.pageSize = val;
      this.getJitOrderPage();
    },
    handleCurrentChanges(val) {
      this.queryData.page.pageNum = val;
      this.getJitOrderPage();
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
    search() {
      this.queryData.page.pageNum = 1;
      this.queryData.page.pageSize = 20;
      this.getJitOrderPage();
    },
    resetSearch() {
      this.queryData.choseType = "1";
      this.queryData.timeChose = 3;
      this.queryData.value = "";
      this.queryData.skuCode = "";
      this.queryData.productName = "";
      // this.queryData.qrCode = ''
      // this.queryData.supplierCode = ''
      let startTime =
        moment()
          .subtract(3, "months")
          .format("YYYY-MM-DD") + " 00:00:00";
      let endTime = moment().format("YYYY-MM-DD") + " 23:59:59";
      this.queryData.timeList = [startTime, endTime];
      this.queryData.jitNo = "";
      this.queryData.orderNo = "";
      this.queryData.subOrderNo = "";
      this.queryData.jitStatus = 0;
      this.queryData.supplierId = "";
      this.queryData.countryCode = "";
      this.queryData.logiCode = "";
      this.queryData.isUseFingoSystem = "";
      this.queryData.page.pageNum = 1;
      this.queryData.page.pageSize = 10;
      this.getJitOrderPage();
    },
    //导出
    exportTable() {
      this.getExport();
    },
    getExport() {
      switch (this.queryData.choseType) {
        case "1":
          this.queryData.productName = this.queryData.value;
          break;
        case "2":
          this.queryData.skuCode = this.queryData.value;
          break;
      }
      let params = {
        page: this.queryData.page,
        jitNo: this.queryData.jitNo,
        subOrderNo: this.queryData.subOrderNo,
        orderNo: this.queryData.orderNo,
        skuCode: this.queryData.skuCode,
        jitStatus: 0,
        supplierId: this.queryData.supplierId,
        startTime: this.queryData.timeList[0],
        endTime: this.queryData.timeList[1],
        timeType: this.queryData.timeChose,
        tabType: this.activeTab,
        productName: this.queryData.productName,
        countryCode: this.queryData.countryCode,
        isUseFingoSystem: this.queryData.isUseFingoSystem,
        receiverName: "",
        receiverPhone: "",
        languageCode: "cn",
        reqType: 1
      };
      console.log(params);
      ExportJitOrder(this.filterData(params)).then(res => {
        if (res.ret.errcode === 1) {
          let url = this.dealShowFileSrc(res.fileUrl);
          console.log(url);
          window.open(`${url}`);
        }
      });
    },
    //导入
    uploadFile() {
      this.uploadDialog = true;
    },
    uploadCancle() {
      this.uploadDialog = false;
      this.getJitOrderPage();
    },
    //查看物流
    viewClick(val) {
      console.log(val);
      this.getqueryLogi(val.jitNo);
      this.viewDialog = true;
    },
    getqueryLogi(jitNo) {
      let params = {
        jitNo: jitNo,
        languageCode: "cn",
        refresh: 1
      };
      QueryLogiTracking(params).then(res => {
        if (res.ret.errcode === 1) {
          console.log(res);
          this.bundList = res.logi;
        }
      });
    },
    viewCancle() {
      this.viewDialog = false;
    },
    //修改运单号
    modifyClick(val) {
      this.modifyJitNo = val.jitNo;
      this.getQueryJitLogi(val.jitNo, val.address);
    },
    getQueryJitLogi(jitNo, address) {
      let params = {
        jitNo: jitNo
      };
      QueryJitLogi(params).then(res => {
        if (res.ret.errcode === 1) {
          console.log(res);
          this.modifyList = res.logi;
          this.modifyDialog = true;
          this.countryCode = address.country;
        }
      });
    },
    modifyCancle() {
      this.modifyDialog = false;
    },
    modifyConfirm() {
      this.modifyDialog = false;
    },
    // 发货
    shipClick(val) {
      this.blukShipDialog = true;
      this.bundList.splice(0);
      this.bundList.push(val);
      this.shipCountryCode = val.address.country;
      for (let i = 0; i < this.bundList[0].details.length; i++) {
        if (
          this.bundList[0].details[i].count -
            this.bundList[0].details[i].shipCount ===
          0
        ) {
          console.log(i);
          this.bundList[0].details.splice(i, 1);
        }
      }
      console.log(this.bundList);
    },
    blukShipCancle() {
      this.blukShipDialog = false;
    },
    blukShipConfirm() {
      this.blukShipDialog = false;
      this.getJitOrderPage();
    },
    //取消
    cancleClick(val) {
      console.log(val);
      this.getCancelOrder(val.jitNo);
    },
    getCancelOrder(jitNo) {
      let params = {
        languageCode: "cn",
        reqType: 1,
        jitNo: jitNo
      };
      CancelOrder(params).then(res => {
        if (res.ret.errcode === 1) {
          console.log(res);
          this.getJitOrderPage();
        }
      });
    }
  }
};
</script>
<style lang="scss">
.direct-mail {
  .el-table .el-table__header th {
    background: #f5f7fa;
    color: #606266;
  }
  .el-table__header tr,
  .el-table__header th {
    text-align: center;
  }
}
</style>
<style lang="scss" scoped>
.direct-mail {
  overflow: auto;
  .btn-box {
    margin-bottom: 10px;
    .iconfont {
      margin-right: 3px;
      margin-top: 3px;
    }
  }
  .produt {
    display: flex;
    justify-content: space-around;
    padding: 10px 0;
    img {
      width: 100px;
      height: 100px;
    }
    .product-content {
      width: 250px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }
    .product-content-name {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .product-content-supplier {
      text-align: left;
      color: rgb(120, 120, 120);
    }
  }
  .address {
    text-align: left;
  }
}
</style>
