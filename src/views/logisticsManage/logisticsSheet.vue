<template>
  <div class="app-container forward-receive-wrapper">
    <el-form ref="logifilterForm" inline :model="queryData">
      <el-form-item prop="purchaseOrderNo" label="采购单号：" class="filter-item">
        <el-input
          v-model="queryData.purchaseOrderNo"
          clearable
          placeholder="请输入采购单号"
          size="medium"
          @keyup.enter.native="search"
        ></el-input>
      </el-form-item>
      <el-form-item prop="logiCode" label="物流单号：" class="filter-item">
        <el-input
          v-model="queryData.logiCode"
          clearable
          placeholder="请输入物流单号"
          size="medium"
          @keyup.enter.native="search"
        ></el-input>
      </el-form-item>
      <el-form-item prop="skuCode" label="skuCode：" class="filter-item">
        <el-input
          v-model="queryData.skuCode"
          clearable
          placeholder="请输入skuCode"
          size="medium"
          @keyup.enter.native="search"
        ></el-input>
      </el-form-item>
      <span v-show="drop">
        <el-form-item label="供应商：">
          <el-select
            v-model="queryData.supplierId"
            :remote-method="getSupplierList"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入供应商"
            @change="search()"
          >
            <el-option
              v-for="(item, index) in supplierList"
              :key="index"
              :label="item.supplierName"
              :value="item.supplierId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="warehouseNo" label="仓库：" class="filter-item">
          <el-select v-model="queryData.warehouseNo" clearable size="medium" placeholder="请选择仓库">
            <el-option
              v-for="(val, key) in warehouseList"
              :key="key"
              :label="val.warehouseName"
              :value="val.warehouseNo"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="signStatus" label="签收状态：" class="filter-item">
          <el-select v-model="queryData.signStatus" clearable @change="search()" size="medium">
            <el-option v-for="(val, key) in signStatusMap" :key="key" :label="val" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="incomeStatus" label="入库状态：" class="filter-item">
          <el-select v-model="queryData.incomeStatus" clearable @change="search()" size="medium">
            <el-option v-for="(val, key) in incomeStatusMap" :key="key" :label="val" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="timeList" label="发货时间：" class="filter-item">
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
    <div class="main-content-wrapper">
      <el-table
        border
        height="100%"
        :span-method="arraySpanMethod"
        :data="dataList"
        style="width: 100%"
      >
        <el-table-column prop="logiCode" min-width="150px" align="center" fixed="left" label="物流单号"></el-table-column>
        <el-table-column prop="logiCompany" min-width="150px" align="center" label="物流公司">
          <template slot-scope="scope">
            <span>{{ getCompanyName(scope.row.logiCompany || '-')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="warehouseName" min-width="150px" align="center" label="收货仓库"></el-table-column>
        <el-table-column label="签收状态" align="center" min-width="120px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.signStatus === 1" type="success" size="mini">仓储签收</el-tag>
            <el-tag v-if="scope.row.signStatus === 2" size="mini">仓储未签收</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="incomeStatus" min-width="120px" align="center" label="入库状态">
          <template slot-scope="scope">
            <el-tag effect="plain" v-if="scope.row.incomeStatus === 1" size="mini">已入库</el-tag>
            <el-tag
              effect="plain"
              v-if="scope.row.incomeStatus === 2"
              type="success"
              size="mini"
            >未入库</el-tag>
            <el-tag effect="plain" v-if="scope.row.incomeStatus === 3" size="mini">已取消</el-tag>
            <el-tag effect="plain" v-if="scope.row.incomeStatus === 4" size="mini">已完结</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="purchaseOrderNo" min-width="180px" align="center" label="采购单号">
          <template slot-scope="scope">
            <div v-for="(item, i) in scope.row.purchaseOrderNo" :key="i">{{ item || '-'}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="skuCode" min-width="180px" align="center" label="skuCode">
          <template slot-scope="scope">
            <div
              class="point blue"
              @click="triggerToPrint(scope.row.skuCode)"
            >{{ scope.row.skuCode }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="nameCn" min-width="200px" align="center" label="商品名称">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.nameCn" placement="top">
              <span
                class="block-right"
                style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical"
              >{{scope.row.nameCn}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" align="center" min-width="120px">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="hover">
              <img :src="dealShowFileSrc(scope.row.skuCover)" class="previewImage" />
              <img :src="dealShowFileSrc(scope.row.skuCover)" class="thumbnail" slot="reference" />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="standardAttr" min-width="180px" align="center" label="sku规格"></el-table-column>
        <el-table-column prop="totalCount" align="center" label="预期数量">
          <template slot-scope="scope">{{ scope.row.totalCount || '-'}}</template>
        </el-table-column>
        <el-table-column prop="actualCount" align="center" label="实际数量">
          <template slot-scope="scope">{{ scope.row.incomeCount || '-'}}</template>
        </el-table-column>
        <el-table-column prop="abnormalCount" label="异常数量" align="center">
          <template slot-scope="scope">{{ scope.row.abnormalCount || '-'}}</template>
        </el-table-column>
        <el-table-column prop="remark" label="商品入库备注" align="center" min-width="120px">
          <template slot-scope="scope">{{ scope.row.remark || '-' }}</template>
        </el-table-column>
        <el-table-column prop="createTime" min-width="180px" align="center" label="发货时间">
          <template slot-scope="scope">{{ scope.row.createTime | secondTimeFormat }}</template>
        </el-table-column>
        <el-table-column prop="signTime" min-width="180px" align="center" label="签收时间">
          <template slot-scope="scope">{{ scope.row.signTime | secondTimeFormat }}</template>
        </el-table-column>
        <el-table-column prop="incomeTime" min-width="180px" align="center" label="入库时间">
          <template slot-scope="scope">{{ scope.row.incomeTime | secondTimeFormat }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="SKU操作" align="center" min-width="130px">
          <template slot-scope="scope">
            <div class="order-btn-box" v-if="scope.row.signStatus ===2&&scope.row.logiSignStatus!=1">
              <el-button plain type="primary" size="mini" @click="setshow(scope.row,1)">修改快递单号</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="整单操作" align="center" min-width="130px">
          <template slot-scope="scope">
            <div class="order-btn-box" v-if="scope.row.signStatus === 2&&scope.row.logiSignStatus!=1">
              <el-button plain type="primary" size="mini" @click="setshow(scope.row,2)">整单修改</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="page-wrapper">
      <el-pagination
        @size-change="handleSizeChanges"
        @current-change="handleCurrentChanges"
        :current-page="queryData.page.pageNum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryData.page.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="totals"
      ></el-pagination>
    </div>
    <ModifyLogiNoDialog
      :dialogVisible="modifyDialogVisible"
      :logiInfo="logiInfo"
      @on-cancle="handleCancleModify"
      @on-confirm="handleConfirmModify"
    ></ModifyLogiNoDialog>
  </div>
</template>

<script>
import {
  logiOrderPage,
  modifyIncomeOrderLogi,
  warehousePage,
} from "@/request/warehouse";
import { supplierBasePage } from "@/request/supplier";
import ModifyLogiNoDialog from "../purchaseManage/components/ModifyLogiNoDialog";
import { arrayToString, formatTime } from "@/js/common/filter";
import logisticsCompany from "@/data/company.js";
export default {
  data() {
    return {
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "el-icon-arrow-down",
      logisticsCompany: logisticsCompany,
      warehouseList: [],
      queryData: {
        warehouseNo: "",
        purchaseOrderNo: "",
        supplierId: null,
        logiCode: "",
        skuCode: "",
        signStatus: null,
        incomeStatus: null,
        timeList: [],
        startTime: "",
        endTime: "",
        page: {
          pageNum: 1,
          pageSize: 20,
        },
      },
      supplierList: [],
      modifyDialogVisible: false,
      logiInfo: {
        incomeNo: "",
        logiCompany: "",
        logiCode: "",
        skuCode: [],
      },
      ship: {
        isSyncNow: false,
        shipList: [],
        show: false,
        logisticsType: {
          DOMESTIC: "国内",
          INTERNATIONAL: "国际",
          LOCAL: "当地",
        },
        param: {
          orderNo: "",
          logisticsCompany: "",
          logiCode: "",
          logisticsType: "DOMESTIC",
        },
      },
      param: {
        orderNo: "",
        incomeStatus: "",
        signStatus: "",
        incomeStatus: "",
        logiCode: "",
        productInfo: "",
        productNature: "",
        pageNum: 1,
        pageSize: 10,
      },
      timeList: [],
      productNature: {
        1: "普货",
        2: "敏感货",
      },
      abnormalType: {
        0: "颜色/尺码错误",
        1: "款式错误",
        2: "多货",
        3: "少货",
        4: "质量问题",
        5: "少配件",
        6: "其他",
      },
      signStatusMap: {
        1: "仓储签收",
        2: "仓储未签收",
      },
      incomeStatusMap: {
        0: "未入库",
        1: "已入库",
        2: "已取消",
        3: "已完结",
      },
      totals: 0,
      dataList: [],
      dialog: {
        param: {},
        show: false,
        imgList: [],
      },
      uploadFileUrl: `${process.env.VUE_APP_UPLOAD_API}`,
      uploadFileName: `${process.env.VUE_APP_UPLOAD_NAME}`,
      headers: this.$headers,
      beginTime: "",
      endTime: "",
    };
  },
  computed: {
    nowEndDate() {
      return this.$store.state.globalNum.nowEndDate;
    },
    lastMonthDate() {
      return this.$store.state.globalNum.lastMonthDate;
    },
  },
  components: {
    ModifyLogiNoDialog,
  },
  created() {
    this.queryData.signStatus = this.$route.query.signStatus;
    this.queryData.supplierId = this.$route.query.supplierId;
    this.queryData.warehouseNo = this.$route.query.warehouseNo;
    this.queryData.incomeStatus = this.$route.query.incomeStatus;
    this.beginTime =
      this.$route.query.lastMonthDate === undefined
        ? ""
        : formatTime(this.$route.query.lastMonthDate);
    this.endTime =
      this.$route.query.nowEndDate === undefined
        ? ""
        : formatTime(this.$route.query.nowEndDate);
    console.log(this.beginTime);
    console.log(this.endTime);
    if (this.beginTime !== "" || this.endTime !== "") {
      this.queryData.timeList = [this.beginTime, this.endTime];
    } else {
      this.queryData.timeList = [this.lastMonthDate, this.nowEndDate];
    }
    this.getLogiOrderList();
    this.getWarehouseList();
    // this.getSupplierList()
  },
  methods: {
    // 获取供应商列表
    getSupplierList(query) {
      let params = {
        supplierName: query,
      };
      supplierBasePage(this.filterData(params)).then((res) => {
        console.log(res);
        if (res.ret.errcode === 1) {
          this.supplierList = res.list;
        }
      });
    },
    /**
     * 获取仓库列表
     */
    getWarehouseList() {
      let params = {
        page: {
          pageSize: 100,
          pageNum: 1,
        },
      };
      warehousePage(this.filterData(params))
        .then((res) => {
          if (res.ret.errcode === 1) {
            this.warehouseList = res.list;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取物流公司名称
    getCompanyName(item) {
      let data = logisticsCompany.find((val) => {
        return val.code == item;
      });
      return data ? data.name : item;
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
    getLogiOrderList() {
      let params = this.queryData;
      params.timeList = params.timeList || [];
      params.startTime = params.timeList[0];
      params.endTime = params.timeList[1];
      logiOrderPage(this.filterData(params)).then((res) => {
        console.log(res);
        if (res.ret.errcode === 1) {
          let data = [];
          for (let i = 0; i < res.list.length; i++) {
            let item = res.list[i];
            for (let j = 0; j < item.sku.length; j++) {
              if (j == 0) {
                Object.assign(item.sku[j], {
                  rowspan: item.sku.length,
                });
              }
              Object.assign(item.sku[j], {
                incomeNo: item.incomeNo,
                incomeTime: item.incomeTime,
                logiCode: item.logiCode,
                logiCompany: item.logiCompany,
                warehouseName: item.warehouseName,
                createTime: item.createTime,
                signTime: item.signTime,
                signStatus: item.signStatus,
                incomeStatus: item.incomeStatus,
                sourceList: res.list[i],
                logiSignStatus:res.list[i].logiSignStatus
              });
              data.push(item.sku[j]);
            }
          }
          this.dataList = data;
          this.totals = res.total;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    search() {
      this.queryData.page.pageNum = 1;
      this.getLogiOrderList();
    },
    // 显示修改物流单号
    setshow(data, type) {
      this.logiInfo.incomeNo = data.incomeNo;
      this.logiInfo.logiCompany = data.logiCompany;
      this.logiInfo.logiCode = data.logiCode;
      if (type == 1) {
        this.logiInfo.skuCode.push(data.skuCode);
      }
      this.modifyDialogVisible = true;
    },
    handleCancleModify() {
      this.logiInfo.skuCode = [];
      this.modifyDialogVisible = false;
    },
    handleConfirmModify(data) {
      modifyIncomeOrderLogi(this.filterData(data))
        .then((res) => {
          console.log(res);
          if (res.ret.errcode === 1) {
            this.modifyDialogVisible = false;
            this.$message.success("修改成功！");
            this.getLogiOrderList();
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      let activeColumn = [0, 1, 2, 3, 4, 14, 15, 16, 18];
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
    triggerToPrint(productCode) {
      this.$router.push({
        name: "printPage",
        query: {
          productCode: productCode,
        },
      });
    },
    showConfirmReceiveDialog(data) {
      this.dialog.imgList = [];
      let sourceList = JSON.parse(JSON.stringify(data.sourceList));
      let proList = [];
      for (let i = 0; i < sourceList.skuList.length; i++) {
        let item = sourceList.skuList[i];
        proList.push(
          Object.assign(item, {
            imgs: "",
            abnormalType: "",
            abnormalCount: "",
            remark: data.remark,
            count: item.actualCount,
          })
        );
      }
      let newData = {
        orderNo: sourceList.orderNo,
        logiCode: sourceList.logiCode,
        remark: sourceList.remark,
        skuList: proList,
      };
      console.log(111);
      this.dialog.param = newData;
      this.dialog.show = true;
    },
    handleSizeChanges(val) {
      this.queryData.page.pageSize = val;
      this.getLogiOrderList();
    },
    handleCurrentChanges(val, type) {
      this.queryData.page.pageNum = val;
      this.getLogiOrderList();
    },
    resetSearch() {
      Object.assign(this.queryData, {
        warehouseNo: "",
        purchaseOrderNo: "",
        supplierId: null,
        logiCode: "",
        skuCode: "",
        signStatus: null,
        incomeStatus: null,
        timeList: [],
        startTime: "",
        endTime: "",
        page: {
          pageNum: 1,
          pageSize: 20,
        },
      });
      // this.$refs.logifilterForm.resetFields()
      this.getLogiOrderList();
    },
    handleUploaderRemove(file, fileList, key, i) {
      let mappedFileList = fileList.map((mappingfile) => {
        if (mappingfile.response !== undefined) {
          mappingfile.url = mappingfile.response.data;
        }
        return mappingfile;
      });
      this.dialog.imgList[i] = mappedFileList;
      this.dialog.param.skuList[i][key] = arrayToString(mappedFileList);
    },
    handleUploadSuccess(response, file, fileList, key, i) {
      if (response.data) {
        console.log(fileList);
        let mappedFileList = fileList.map((mappingfile) => {
          if (mappingfile.response !== undefined) {
            mappingfile.url = mappingfile.response.data;
          }
          return mappingfile;
        });
        this.dialog.imgList[i] = mappedFileList;
        this.dialog.param.skuList[i][key] = arrayToString(mappedFileList);
      } else {
        let itemI = fileList.find((item) => {
          return item == file;
        });
        if (itemI != -1) {
          fileList.splice(itemI, 1);
        }
      }
    },
  },
};
</script>

<style lang="scss">
.forward-receive-wrapper {
  .el-form-item {
    margin-bottom: 10px;
  }
}

.box-card {
  margin-bottom: 10px;
}
</style>
