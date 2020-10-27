<template>
  <div class="forward-receive-wrapper app-container">
    <el-form ref="abnormalFilterForm" inline :model="queryData">
      <el-form-item label="异常编号：" class="filter-item">
        <el-input v-model="queryData.abnormalNo" clearable placeholder="请输入" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="物流单号：" class="filter-item" prop="logiCode">
        <el-input v-model="queryData.logiCode" clearable placeholder="请输入物流单号" size="medium"></el-input>
      </el-form-item>
      <el-form-item label="skuCode：" class="filter-item">
        <el-input placeholder="请输入商品skuCode" size="medium" v-model="queryData.skuCode"></el-input>
      </el-form-item>
      <span v-show="drop">
        <el-form-item label="供应商：" class="filter-item" prop="supplierId">
          <el-select
            v-model="queryData.supplierId"
            :remote-method="getSupplierList"
            filterable
            clearable
            remote
            reserve-keyword
            placeholder="请输入供应商"
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
        <!-- <el-form-item label="采购员：" class="filter-item" prop="buyerId">
                        <el-select v-model="queryData.buyerId" filterable clearable placeholder="请选择采购员" size="medium">
                            <el-option v-for="(item, index) in buyerList" :key="item.sysUserId" :label="item.nickName" :value="item.sysUserId"></el-option>
                        </el-select>
        </el-form-item>-->
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
        <el-form-item label="采购处理状态：" class="filter-item">
          <el-select v-model="queryData.status" multiple clearable size="medium">
            <el-option
              v-for="item in abnormalStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--                <el-form-item label="仓库编号：" class="filter-item">-->
        <!--                     <el-input v-model="queryData.warehouseNo" clearable placeholder="请输入" size="medium"></el-input>-->
        <!--                 </el-form-item>-->
        <el-form-item label="异常类型：" class="filter-item">
          <el-select v-model="queryData.abnormalReason" clearable size="medium">
            <el-option
              v-for="item in skuAbnormalTypeList"
              :key="item.type"
              :label="item.remark"
              :value="item.type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="记录时间：" class="filter-item" prop="timeList">
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
      </span>
      <el-form-item class="filter-item" style="margin-left: 20px;">
        <el-button
          icon="el-icon-search"
          type="primary"
          @click="getAbnormalSkuList(1)"
          size="medium"
        >搜索</el-button>
        <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
        <el-button
          v-if="hasPermission('BTN_PURCHASE_EXPORT_ABNORMAL_SKU')"
          :loading="exportLoading"
          icon="el-icon-download"
          type="primary"
          size="medium"
          @click="exportAbnormal"
        >导出异常</el-button>
        <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
          {{dropDownContent}}
          <i :class="dropDownIcon"></i>
        </el-link>
      </el-form-item>
    </el-form>
    <div class="main-content-wrapper">
      <el-table :data="skuDataList" border height="100%">
        <el-table-column
          prop="abnormalNo"
          align="center"
          fixed="left"
          min-width="200px"
          label="异常编号"
        ></el-table-column>
        <el-table-column prop="logiCode" align="center" min-width="200px" label="物流单号"></el-table-column>
        <el-table-column prop="skuCode" label="商品编号" align="center" min-width="200px"></el-table-column>
        <el-table-column prop="nameCn" align="center" label="商品名称" min-width="160px"></el-table-column>
        <el-table-column prop="standardAttr" align="center" label="SKU规格" min-width="180px"></el-table-column>
        <el-table-column label="SKU图片" align="center" min-width="120px">
          <template slot-scope="scope">
            <el-popover placement="top-start" trigger="hover">
              <img :src="dealShowFileSrc(scope.row.skuCover)" class="previewImage" />
              <img :src="dealShowFileSrc(scope.row.skuCover)" class="thumbnail" slot="reference" />
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="abnormalCount" align="center" label="异常数量"></el-table-column>
        <el-table-column label="异常类型" align="center" prop="abnormalReason" min-width="150px"></el-table-column>
        <el-table-column prop="content" align="center" label="异常描述">
          <template slot-scope="scope">{{scope.row.content || '-' }}</template>
        </el-table-column>
        <el-table-column label="现场照片" align="center" min-width="150px">
          <template slot-scope="scope">
            <div
              class="list-img-box"
              v-for="(url, i) in formatImg(scope.row.imgs)"
              @click="previewImg(formatImg(scope.row.imgs), 0)"
              v-if="i == 0"
              :key="i"
            >
              <img :src="dealShowFileSrc(url)" />
              <span>{{ formatImg(scope.row.imgs).length }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="采购处理状态" align="center" min-width="150px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.abnormalStatus  === 1" size="mini" close-transition>处理中</el-tag>
            <el-tag
              v-if="scope.row.abnormalStatus === 2"
              type="danger"
              size="mini"
              close-transition
            >待处理</el-tag>
            <el-tag
              v-if="scope.row.abnormalStatus === 8"
              type="warning"
              size="mini"
              close-transition
            >已完结</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop align="center" min-width="180px" label="最新处理备注">
          <template slot-scope="scope">
            <span v-if="scope.row.remark">{{scope.row.remark}}</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <!--                <el-table-column  align="center" min-width="180px" label="采购处理备注">-->
        <!--                    <template slot-scope="scope">-->
        <!--                        <span v-if="scope.row.remark">{{scope.row.remark}}</span>-->
        <!--                        <span v-else> - </span>-->
        <!--                    </template>-->
        <!--                </el-table-column>-->
        <el-table-column prop="userName" align="center" label="创建人" width="140px">
          <template slot-scope="scope">{{scope.row.userName || '-' }}</template>
        </el-table-column>
        <el-table-column prop="createTime" min-width="180" align="center" label="记录时间">
          <template slot-scope="scope">{{scope.row.createTime | secondTimeFormat }}</template>
        </el-table-column>
        <el-table-column label="供应商名称" prop="supplierName" align="center" min-width="140px">
          <template slot-scope="scope">{{scope.row.supplierName || '-' }}</template>
        </el-table-column>
        <!-- <el-table-column label="采购员" min-width="100" align="center" prop="buyerName">
          <template slot-scope="scope">{{scope.row.buyerName || '-' }}</template>
        </el-table-column>-->
        <el-table-column fixed="right" label="操作" align="center" min-width="100px">
          <template slot-scope="scope">
            <div class="order-btn-box">
              <el-button
                v-if="hasPermission('BTN_ABNORMAL_ORDER_PACKAGE') && (scope.row.abnormalStatus == 1 || scope.row.abnormalStatus == 2)"
                type="text"
                size="mini"
                v-preventReClick="500"
                @click="showSkuDealDialog(scope.row, 'edit')"
              >处理</el-button>
              <el-button
                v-if="hasPermission('BTN_ABNORMAL_ORDER_REPAIR') &&  (scope.row.abnormalStatus == 1 || scope.row.abnormalStatus == 2)"
                type="text"
                size="mini"
                v-preventReClick="500"
                @click="showRepairDialog(scope.row)"
              >补单</el-button>
              <el-button
                v-if="scope.row.abnormalStatus == 8"
                type="text"
                size="mini"
                v-preventReClick="500"
                @click="showSkuDealDialog(scope.row, 'detail')"
              >查看详情</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination
        @size-change="handleSizeChanges"
        @current-change="getAbnormalSkuList"
        :current-page="queryData.page.pageNum"
        :page-size="queryData.page.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next"
        :total="totals"
      ></el-pagination>
    </div>
    <deal-abnormal-dialog
      :propShowDialog="skuDialog.show"
      :dealType="skuDialog.type"
      :propParam="skuDialog.param"
      @close="skuDialog.show = false"
      @confirm="confirmDealSku"
    ></deal-abnormal-dialog>
    <image-preview
      v-show="image.show"
      :close="closePreview"
      :index="image.index"
      :list="image.list"
    ></image-preview>
    <sku-repair-dialog
      ref="skuRepairDialog"
      :propShowDialog="skuRepairDialog.show"
      :propParam="skuRepairDialog.param"
      @close="skuRepairDialog.show = false"
      @confirm="confirmRepair"
    ></sku-repair-dialog>
  </div>
</template>

<script>
import {
  abnormalSkuPage,
  skuAbnormalType,
  warehousePage,
  AbnormalPurchaseOrder,
  AbnormalProcess,
  ExportAbnormalLogi,
  ExportAbnormalSku,
} from "@/request/warehouse";
import imagePreview from "@/components/imagePreview";
import dealAbnormalDialog from "./components/dealSkuDialog";
import skuRepairDialog from "./components/skuRepairDialog";
import { supplierBasePage } from "@/request/supplier";
import { listSysUserByPage } from "@/request/staff";
import { formatTime } from "@/js/common/filter";
import { categoryListGet } from "@/request/product";
export default {
  data() {
    return {
      backCategoryOptions: [],
      exportLoading: false,
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "el-icon-arrow-down",
      activeName: "abnormalPackage",
      signAbnormalTypeList: [],
      abnormalStatusList: [
        {
          value: 1,
          label: "处理中",
        },
        {
          value: 2,
          label: "待处理",
        },
        {
          value: 8,
          label: "已完结",
        },
      ],
      warehouseList: [],
      packageAbnormalTypeList: [],
      skuAbnormalTypeList: [],
      supplierList: [],
      buyerList: [],
      queryData: {
        buyerId: "", // 采购员id
        supplierId: "",
        logiCode: "",
        skuCode: "",
        abnormalReason: "",
        status: [],
        startTime: "",
        endTime: "",
        timeList: [],
        warehouseNo: "",
        abnormalNo: "",
        cateId: [],
        page: {
          pageNum: 1,
          pageSize: 20,
        },
      },
      totals: 0,
      loading: false,
      packageDataList: [],
      skuDataList: [],
      signStatusList: [],
      image: {
        show: false,
        index: 0,
        list: [],
      },
      skuDialog: {
        show: false,
        type: "",
        param: {
          abnormalNo: "",
          skuCode: "",
          purchaseOrderNo: "",
          abnormalCount: "",
          nameCn: "",
          abnormalReason: "",
          productContent: "",
          process: [],
          content: "",
        },
      },
      skuRepairDialog: {
        show: false,
        param: {
          abnormalNo: "",
          purchase: [],
          abnormalCount: "",
          abnormalReason: "",
          purchaseOrderNo: "",
        },
      },
      beginTime: "",
      endTime: "",
    };
  },
  components: {
    imagePreview,
    dealAbnormalDialog,
    skuRepairDialog,
  },
  computed: {
    nowEndDate() {
      return this.$store.state.globalNum.nowEndDate;
    },
    lastMonthDate() {
      return this.$store.state.globalNum.lastMonthDate;
    },
  },
  created() {
    this.queryData.supplierId = this.$route.query.supplierId;
    this.queryData.warehouseNo = this.$route.query.warehouseNo;
    this.queryData.status = this.$route.query.status;
    this.beginTime =
      this.$route.query.lastMonthDate === undefined
        ? ""
        : formatTime(this.$route.query.lastMonthDate);
    this.endTime =
      this.$route.query.nowEndDate === undefined
        ? ""
        : formatTime(this.$route.query.nowEndDate);
    if (this.beginTime !== "" || this.endTime !== "") {
      this.queryData.timeList = [this.beginTime, this.endTime];
      console.log(this.queryData.timeList);
    } else {
      this.queryData.timeList = [this.lastMonthDate, this.nowEndDate];
    }
    this.getAbnormalSkuList();
    this.getSkuAbnormalTypeList();
    // this.getSupplierList()
    this.getBuyerList();
    this.getWarehouseList();
    this.fetchCategory({
      level: 1,
      cateType: 2,
      resolve: (data) => {
        this.backCategoryOptions = data;
      },
    });
  },
  methods: {
    getBackSubCategory(data, resolve) {
      if (data.level == 0) {
        return;
      }
      let value = data.value;
      console.log(data);
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
            res.categoryUnit[i]["cateId"] = String(
              res.categoryUnit[i]["cateId"]
            );
            res.categoryUnit[i]["cateName"] = item ? item.name : "";
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
    // 导出异常
    exportAbnormal() {
      this.exportLoading = true;
      let params = this.queryData;
      params.startTime = params.timeList ? params.timeList[0] : null;
      params.endTime = params.timeList ? params.timeList[1] : null;
      ExportAbnormalSku(this.filterData(params))
        .then((res) => {
          if (res.ret.errcode === 1) {
            this.exportLoading = false;
            let fileUrl = res.fileUrl;
            window.open(this.dealShowFileSrc(fileUrl));
          } else {
            this.exportLoading = false;
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.exportLoading = false;
          console.log(err);
        });
    },
    /**
     * 获取采购负责人列表
     */
    getBuyerList() {
      let params = {
        page: {
          pageNum: 1,
          pageSize: 1000,
        },
        groupIds: [68, 69, 70],
      };
      listSysUserByPage(params)
        .then((res) => {
          if (res.ret.errcode === 1) {
            this.buyerList = res.sysUserPb;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 获取供应商列表
     */
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
    handleSizeChanges(val) {
      this.queryData.page.pageSize = val;
      this.getAbnormalSkuList(1);
    },
    resetSearch() {
      this.queryData = {
        logiCode: "",
        skuCode: "",
        abnormalReason: "",
        abnormalStatus: "",
        startTime: "",
        endTime: "",
        timeList: [],
        page: {
          pageNum: 1,
          pageSize: 20,
        },
      };
    },
    formatImg(imgStr) {
      if (imgStr) {
        return imgStr.split(",");
      }
      return [];
    },
    closePreview() {
      this.image.index = 0;
      this.image.show = false;
    },
    previewImg(imgs, i) {
      this.image.list = imgs;
      this.image.index = i;
      this.image.show = true;
    },
    // 异常类型
    getSkuAbnormalTypeList() {
      skuAbnormalType()
        .then((res) => {
          if (res.ret.errcode === 1) {
            this.skuAbnormalTypeList = res.type;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 异常列表
    getAbnormalSkuList(page) {
      this.queryData.page.pageNum = page || this.queryData.page.pageNum;
      let params = this.queryData;
      params.startTime = params.timeList ? params.timeList[0] : null;
      params.endTime = params.timeList ? params.timeList[1] : null;
      abnormalSkuPage(this.filterData(params))
        .then((res) => {
          if (res.ret.errcode === 1) {
            this.totals = res.total;
            this.skuDataList = res.list;
            console.log(this.skuDataList);
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 处理
    showSkuDealDialog(data, type) {
      this.skuDialog.param = {
        abnormalNo: data.abnormalNo,
        skuCode: data.skuCode,
        purchaseOrderNo: data.purchaseOrderNo,
        abnormalCount: data.abnormalCount,
        nameCn: data.nameCn,
        abnormalReason: data.abnormalReason,
        productContent: data.content,
        process: [],
        content: "",
      };
      AbnormalProcess({
        abnormalNo: data.abnormalNo,
      }).then((res) => {
        if (res.ret.errcode === 1) {
          this.skuDialog.param.process = res.process;
        }
      });
      this.skuDialog.type = type;
      this.skuDialog.show = true;
    },
    confirmDealSku() {
      this.skuDialog.show = false;
      this.getAbnormalSkuList();
    },
    // 补单
    showRepairDialog(data) {
      // this.$nextTick(() => {
      //   this.$refs["skuRepairDialog"]
      //     .getOriginData(data.supplierName)
      //     .then((response) => {
            AbnormalPurchaseOrder({
              abnormalNo: data.abnormalNo,
            }).then((res) => {
              if (res.ret.errcode === 1) {
                if (res.purchase.length <= 0) {
                  this.$message.warning("无可补采购单");
                } else {
                  this.skuRepairDialog.param.purchase = res.purchase;
                  this.skuRepairDialog.show = true;
                }
              }
            });
          // });
      // });
      this.skuRepairDialog.param.abnormalNo = data.abnormalNo;
      this.skuRepairDialog.param.abnormalReason = data.abnormalReason;
      this.skuRepairDialog.param.purchaseOrderNo = data.purchaseOrderNo;
      this.skuRepairDialog.param.abnormalCount = data.abnormalCount;
      // this.skuRepairDialog.param.supplierId = data.supplierId
      // this.skuRepairDialog.param.thirdOrderNo = data.thirdOrderNo
    },
    confirmRepair() {
      this.skuRepairDialog.show = false;
    },
  },
};
</script>

<style lang="scss">
</style>
