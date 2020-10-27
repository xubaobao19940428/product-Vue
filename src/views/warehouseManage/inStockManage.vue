<template>
  <div class="app-container forward-receive-wrapper">
    <div class="search-form">
      <el-form :model="queryData" :inline="true" label-width="80px">
        <el-form-item label="SkuCode：">
          <el-input placeholder="请输入" v-model="queryData.skuCode" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="出库单号：">
          <el-input placeholder="请输入" v-model="queryData.skuCode"></el-input>
        </el-form-item>
        <el-form-item label="订单号：">
          <el-input placeholder="请输入" v-model="queryData.skuCode"></el-input>
        </el-form-item>-->
        <el-form-item label="状态：">
          <el-select v-model="queryData.isProcess" clearable>
            <el-option
              v-for="(item,index) in status"
              :key="index"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间类型：" class="filter-item" prop="timeList">
          <el-select v-model="queryData.timeType" clearable size="medium" style="width:100px">
            <el-option
              v-for="(item,index) in timeTypeLists"
              :key="index"
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
        <el-form-item label="仓库：" >
          <el-select v-model="queryData.warehouseNo" clearable>
            <el-option
              v-for="(item,index) in warehouseList"
              :key="index"
              :label="item.warehouseName"
              :value="item.warehouseNo"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="商品类型：">
          <el-select v-model="queryData.status"></el-select>
        </el-form-item>
        <el-form-item label="品类：" class="filter-item" prop="cateId">
          <el-cascader
            style="width: 250px"
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
        </el-form-item>-->
        <div>
          <el-form-item class="filter-item" style="margin-left: 20px;">
            <el-button icon="el-icon-search" type="primary" size="medium" @click="search(1)">搜索</el-button>
            <el-button icon="el-icon-refresh-left" size="medium" @click="resetSearch">重置</el-button>
            <el-button size="medium" type="primary" @click="exportData" :loading="exportLoading">导出</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="main-content-wrapper">
      <el-table v-loading="loading" height="100%" :data="dataList" style="width: 100%">
        <el-table-column width="360px" align="center" label="商品信息" fixed="left">
          <template slot-scope="scope">
            <div class="flex-table">
              <el-popover placement="top-start" trigger="hover">
                <img :src="dealShowFileSrc(scope.row.productCover)" class="previewImage">
                <img :src="dealShowFileSrc(scope.row.productCover)" class="thumbnail" slot="reference">
              </el-popover>
              <div class="product-content">
                <p>skuCode:{{scope.row.skuCode}}</p>
                <p>商品名称:{{scope.row.productName}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="规格" align="center" width="200px">
          <template slot-scope="scope">
            <span>{{scope.row.standardAttr}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="品类">
          <template slot-scope="scope">
            <div v-if="scope.row.categoryUnit">
              <p>{{scope.row.categoryUnit.backCateFirstName}}>></p>
              <p>{{scope.row.categoryUnit.backCateSecondName}}>></p>
              <p>{{scope.row.categoryUnit.backCateThirdName}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品类型" align="center" width="200px">
          <template slot-scope="scope">
            <span v-if="scope.row.saleWay==1">售完即止</span>
            <span v-else-if="scope.row.saleWay==2">边售边采</span>
            <span v-else></span>
          </template>
        </el-table-column>
        <el-table-column width="180px" align="center" label="仓库">
          <template slot-scope="scope">
            <span>{{scope.row.warehouseName}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="校验日期">
          <template slot-scope="scope">
            <span>{{scope.row.validateTime}}</span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="状态｜时效">
          <template slot-scope="scope">
            <span>
              {{scope.row.isProcess==1?'已处理':'未处理'}}｜
              <span
                style="color:red"
              >{{setTimeInter(Number(scope.row.countdownEndTime))}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="库存信息">
          <template slot-scope="scope">
            <div class="product-content">
              <div>Fingo库存:{{scope.row.inStockQty}}</div>
              <div>第三方仓库存:{{scope.row.thirdStockQty}}</div>
              <div>差异库存:{{scope.row.diffStockQty}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px" fixed="right">
          <template slot-scope="scope">
            <el-link
              :underline="false"
              style="margin-right:10px"
              type="primary"
              v-if="scope.row.isProcess!=1"
              @click="showChangeStock(scope.row)"
            >修改库存</el-link>
            <el-link :underline="false" type="primary" @click="validateWarehouseInventory(scope.row)" v-if="scope.row.isProcess!=1">重新校验</el-link>
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
    <!-- <stock-check :dialogVisible="dialogVisible" @on-cancel="cancelStock"></stock-check> -->
    <el-dialog
      title="库存修改"
      width="700px"
      :visible.sync="stock.show"
      @close="clickToCancelStock"
      ref="stock"
      :close-on-click-modal="false"
    >
      <el-form label-width="100px" :model="stock.param" :rules="stock.rules">
        <el-form-item>
          <div class="logistics-info-wrapper">
            <el-form-item label="商品编码：" class="filter-item">
              <span>{{stock.param.skuCode}}</span>
            </el-form-item>
            <el-form-item label="仓库名称：" class="filter-item">
              <span>{{stock.param.warehouseName}}</span>
            </el-form-item>
            <el-form-item label="库存类型：" class="filter-item">
              <el-select
                v-model="stock.param.qtyType"
                disabled
                filterable
                clearable
                style="width: 228px"
                size="medium"
              >
                <el-option
                  v-for="(val, key) in inventoryTypeList"
                  :key="key"
                  :label="val"
                  :value="key"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="修改前库存：">
              <el-input
                v-if="stock.param.qtyType==''"
                type="number"
                :disabled="true"
                style="width: 40%;"
                size="medium"
              ></el-input>
              <el-input
                v-model="stock.param.inStockQty"
                v-else-if="stock.param.qtyType=='1'"
                type="number"
                :disabled="true"
                style="width: 40%;"
                size="medium"
              ></el-input>
              <el-input
                v-else
                v-model="stock.param.reserveQty"
                type="number"
                :disabled="true"
                style="width: 40%;"
                size="medium"
              ></el-input>
            </el-form-item>
            <el-form-item label="调整库存：">
              <el-select
                v-model="stock.param.dataType"
                filterable
                clearable
                style="width: 110px"
                size="medium"
                placeholder="增减选择"
              >
                <el-option v-for="(val, key) in incDecList" :key="key" :label="val" :value="key"></el-option>
              </el-select>
              <el-input
                v-model="stock.param.stock"
                style="width: 118px"
                size="medium"
                type="number"
                @blur="stockCheckNum(stock.param.stock)"
              ></el-input>
            </el-form-item>
            <el-form-item label="备注：">
              <el-input
                v-model="stock.param.remark"
                @change="stockCheckremark(stock.param.remark)"
                placeholder="请输入备注"
                type="textarea"
                :rows="3"
                style="width: 300px"
                :maxlength="300"
                size="medium"
              ></el-input>
            </el-form-item>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="clickToCancelStock()" size="small">取 消</el-button>
        <el-button type="primary" @click="clickToChangestock()" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { categoryListGet } from "@/request/product";
import { adminUpdateInventory } from "@/request/inventory";
import {
  DiffInventoryRecordPage,
  warehousePage,
  DiffInventoryRecordExport,
  ValidateWarehouseInventoryReq
} from "@/request/warehouse";
import stockCheck from "./components/stockCheck";
export default {
  name: "",
  data() {
    return {
      exportLoading: false,
      dialogVisible: false,
      loading: false,
      dataList: [],
      queryData: {
        isProcess: "",
        skuCode: "",
        cateId: "",
        timeList: [],
        warehouseNo: "",
        page: {
          pagingSwitch: false,
          pageSize: 20,
          pageNum: 1,
        },
      },
      totals: 0,
      inventoryTypeList: {
        "1": "在库库存",
        // '2': '在途库存'
      },
      incDecList: {
        1: "增加",
        2: "减少",
      },
      status: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "已处理",
        },
        {
          value: 2,
          label: "未处理",
        },
      ],
      timeTypeLists: [
        {
          value: 1,
          label: "校验时间",
        },
        {
          value: 2,
          label: "处理时间",
        },
      ],
      backCategoryOptions: [],
      warehouseList: [],
      stock: {
        show: false,
        param: {
          remark: "",
          dataType: "",
          stock: "",
          warehouseName: "",
          skuCode: "",
          qtyType: "",
          endBookedQty: "",
          endInstockQty: "",
          endReserveQty: "",
          pageNum: "",
          reserveQty: "",
          inStockQty: "",
          bookedQty: "",
          availableQty: "",
          pageSize: "",
          pagingSwitch: false,
          productNature: "",
          startBookedQty: "",
          startInstockQty: "",
          startReserveQty: "",
          startAvailableQty: "",
          endAvailableQty: "",
          warehouseNo: "",
        },
        rules: {
          reserveQty: [
            {
              required: true,
              message: "请输入修改后的备货库存",
              trigger: "change",
            },
          ],
          inStockQty: [
            {
              required: true,
              message: "请输入修改后的在库库存",
              trigger: "change",
            },
          ],
        },
      },
    };
  },
  components: {
    stockCheck,
  },
  computed: {},
  watch: {},
  mounted() {
    // this.fetchCategory({
    //   level: 1,
    //   cateType: 2,
    //   resolve: (data) => {
    //     this.backCategoryOptions = data;
    //   },
    // });
    this.getWarehouseList();
    this.search();
  },
  methods: {
    //重新校验
    validateWarehouseInventory(row){
      console.log(row)
      var params={
          warehouNo:row.warehouseNo,
          skuCode:row.skuCode
      }
      ValidateWarehouseInventoryReq(params).then(resultes=>{
        if(resultes.ret.errcode==1){
          this.$message.success('重新校验成功')
          this.search()
        }
      })
    },
    paramsOrgin(type) {
      let params = {};
      if (type == "search") {
        this.queryData.page.pagingSwitch = true;
      } else {
        this.queryData.page.pagingSwitch = false;
      }
      if (this.queryData.timeList && this.queryData.timeList.length != 0) {
        params.startTime = this.queryData.timeList[0];
        params.endTime = this.queryData.timeList[1];
      }

      params = Object.assign(this.queryData, params);
      return params;
    },
    search(type) {
      if (type == 1) {
        this.queryData.page.pageNum = 1;
      }
      let params = this.paramsOrgin("search");
      this.loading = true;
      DiffInventoryRecordPage(this.filterData(params))
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            this.loading = false;
            this.dataList = resultes.skuInfo;
            this.totals = resultes.total;
          }
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
    resetSearch(){
        this.queryData= {
            isProcess: "",
            skuCode: "",
            cateId: "",
            timeList: [],
            warehouseNo: "",
            page: {
            pagingSwitch: false,
            pageSize: 20,
            pageNum: 1,
            }
        }
      this.search()
    },
    //导出
    exportData() {
      let params = this.paramsOrgin("export");
      this.exportLoading = true;
      DiffInventoryRecordExport(this.filterData(params))
        .then((response) => {
          if (response.ret.errcode == 1) {
            this.exportLoading = false;
            this.$message.success("导出任务已建，请前往任务列表下载");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleCurrentChanges(val) {
      this.queryData.page.pageNum = val;
      this.search()
    },
    handleSizeChanges(val) {
      this.queryData.page.pageSize = val;
      this.search()
    },
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
            // res.categoryUnit[i]['cateId'] = String(res.categoryUnit[i]['cateId'])
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
    stockCheckDetail(row) {
      this.dialogVisible = true;
    },
    cancelStock() {
      this.dialogVisible = false;
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
    setTimeInter(val) {
      var newDate = new Date().getTime();
      var originTime = val;
      var differTime = originTime - newDate;
      var timeDom;
      var t, h, m, s;
      var _this = this;
      if (differTime >= 0) {
        t = Math.floor(differTime / 1000 / 60 / 60 / 24);
        h = Math.floor(differTime / 1000 / 60 / 60);
        m = Math.floor((differTime / 1000 / 60) % 60);
        s = Math.floor((differTime / 1000) % 60);
        h = h < 10 ? "0" + h : h;
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        timeDom = h + ":" + m + ":" + s;
      } else {
        timeDom = "00:00:00";
      }
      return timeDom;
    },
    showChangeStock(data) {
      this.stock.param.qtyType = "1";
      this.stock.param.skuCode = data.skuCode;
      this.stock.param.warehouseName = data.warehouseName;
      this.stock.param.warehouseNo = data.warehouseNo;
      this.stock.param.reserveQty = parseInt(data.reserveQty);
      this.stock.param.inStockQty = parseInt(data.inStockQty);
      this.stock.param.bookedQty = parseInt(data.bookedQty);
      this.stock.param.availableQty = parseInt(data.availableQty);
      this.stock.show = true;
    },
    // 限制输入格式
    stockCheckNum(data) {
      if (data < 0 || data == "") {
        this.$alert("调整库存不能为小于零或为空");
        this.stock.param.stock = "";
      }
    },
    // 输入备注不能为空
    stockCheckremark(data) {
      if (data == "") {
        this.$alert("输入备注不能为空");
      }
    },
    clickToCancelStock() {
      (this.stock.show = false),
        (this.stock.param.qtyType = ""),
        (this.stock.param.remark = ""),
        (this.stock.param.stock = ""),
        (this.stock.param.dataType = "");
    },
    // 限制输入格式
    checkNum(data) {
      if (data < 0) {
        this.$alert("输入格式错误不可输入负数");
        (this.stock.param.endBookedQty = ""),
          (this.stock.param.endInstockQty = ""),
          (this.stock.param.endReserveQty = ""),
          (this.stock.param.startBookedQty = ""),
          (this.stock.param.startInstockQty = ""),
          (this.stock.param.startReserveQty = ""),
          (this.stock.param.startAvailableQty = ""),
          (this.stock.param.endAvailableQty = "");
      }
    },
    showChangeStock(data) {
      (this.stock.param.qtyType = "1"),
        (this.stock.param.skuCode = data.skuCode);
      this.stock.param.warehouseName = data.warehouseName;
      this.stock.param.warehouseNo = data.warehouseNo;
      this.stock.param.reserveQty = parseInt(data.reserveQty);
      this.stock.param.inStockQty = parseInt(data.inStockQty);
      this.stock.param.bookedQty = parseInt(data.bookedQty);
      this.stock.param.availableQty = parseInt(data.availableQty);
      this.stock.show = true;
    },
   clickToChangestock() {
      if (this.stock.param.remark == "") {
        this.$alert("输入备注不能为空");
      } else if (
        this.stock.param.dataType == "" ||
        this.stock.param.qtyType == "" ||
        this.stock.param.remark == "" ||
        this.stock.param.stock == ""
      ) {
        this.$alert("输入不可为空");
      } else if (this.stock.param.dataType < 1) {
        this.$alert("输入不可为负数");
        this.stock.param.stock = "";
      } else {
         this.modifyInventory({
          operType: parseInt(this.stock.param.dataType),
          remark: this.stock.param.remark,
          warehouseNo: this.stock.param.warehouseNo,
          skuCode: this.stock.param.skuCode,
          qty: parseInt(this.stock.param.stock),
        });
      }
    },
    modifyInventory(params) {
      this.loading = true;
      adminUpdateInventory(this.filterData(params))
        .then((res) => {
          console.log(res);
          this.loading = false;
          if (res.ret.errcode === 1) {
            this.$message.success("库存修改成功！");
            this.search();
            this.stock.show = false;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch((err) => {
          this.loading = false;
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.flex-table {
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
  img {
    width: 100px;
    height: 100px;
  }
  .product-content {
    width:220px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }
}
</style>
