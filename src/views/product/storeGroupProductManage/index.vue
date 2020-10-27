<template>
  <div class="app-container">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="所有商品" name="first"></el-tab-pane>
      <el-tab-pane label="待发布" name="second"></el-tab-pane>
      <el-tab-pane label="已发布" name="third"></el-tab-pane>
    </el-tabs>
    <div class="filter-container">
      <el-form ref="brandFilterForm" inline :model="queryData">
        <el-form-item label="平台：" class="filter-item" prop="platform">
          <el-select
            v-model="queryData.platform"
            placeholder="选择平台"
            size="medium"
            disabled
            clearable
          >
          </el-select>
        </el-form-item>
        <el-form-item label="商品：" class="filter-item" prop="type">
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
            style="width: 200px; margin-right: 20px"
            size="medium"
            placeholder="请输入"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item
          label="Fingo后台类目："
          class="filter-item"
          prop="backCate"
        >
          <el-cascader
            style="width: 300px"
            clearable
            filterable
            :props="{
              label: 'cateName',
              children: 'cateList',
              value: 'cateId',
              lazy: true,
              lazyLoad: getBackSubCategory,
              checkStrictly: true,
            }"
            placeholder="请选择商品后台分组"
            :options="backCategoryOptions"
            v-model="queryData.fingoCateId"
            @change="setBackCateId"
            class="normalOperatorBox"
            size="medium"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item
          label="第三方类目："
          class="filter-item"
          prop="thirdCategoryIdList"
        >
          <el-cascader
            style="width: 300px"
            clearable
            :props="{
              label: 'name',
              children: 'children',
              value: 'id',
              checkStrictly: false,
              lazy: true,
              lazyLoad: getPlatformCategory,
               checkStrictly: true,
            }"
            placeholder="请选择第三方类目"
            :options="backCategoryOptions1"
            v-model="queryData.lazadaCateId"
            class="normalOperatorBox"
            size="medium"
          >
          </el-cascader>
        </el-form-item>

        <el-form-item label="Fingo状态：" class="filter-item" prop="status">
          <el-select
            v-model="queryData.fingoStatus"
            size="medium"
            clearable
            @change="search"
          >
            <el-option label="上架" :value="1"> </el-option>
            <el-option label="下架" :value="2"> </el-option>
          </el-select>
        </el-form-item>
        <span v-show="drop">
          <el-form-item label="状态：" class="filter-item" prop="status">
            <el-select
              v-model="queryData.status"
              size="medium"
              clearable
              @change="search"
            >
              <el-option label="全部" :value="0"> </el-option>
              <el-option label="待发布" :value="1"> </el-option>
              <el-option label="已发布" :value="2"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家：" class="filter-item" prop="countryCode">
            <el-select
              v-model="queryData.countryCode"
              size="medium"
              @change="search"
            >
              <el-option label="泰国" value="TH"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="发布状态："
            class="filter-item"
            prop="publishSuccess"
          >
            <el-select
              v-model="queryData.publishSuccess"
              size="medium"
              clearable
              @change="search"
            >
              <el-option label="发布成功" :value="1"> </el-option>
              <el-option label="发布失败" :value="2"> </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item
            label="第三方平台状态："
            class="filter-item"
            prop="status"
          >
            <el-select
              v-model="queryData.lazadaStatus"
              size="medium"
              clearable
              @change="search"
            >
              <el-option label="上架" :value="1"> </el-option>
              <el-option label="下架" :value="2"> </el-option>
            </el-select>
          </el-form-item> -->

          <el-form-item label="" class="filter-item">
            <el-select
              v-model="queryData.timeType"
              clearable
              size="medium"
              style="width: 100px"
            >
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
          <el-form-item label="供应商：">
            <el-select
              v-model="queryData.supplierId"
              filterable
              clearable
              remote
              reserve-keyword
              :remote-method="getSupplierList"
              placeholder="请输入供应商"
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
        </span>
        <el-form-item class="filter-item" style="margin-left: 20px">
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="search"
            size="medium"
            @keyup.enter.native="search"
            >搜索</el-button
          >
          <el-button
            icon="el-icon-refresh-left"
            @click="resetSearch"
            size="medium"
            >重置</el-button
          >
          <el-button size="medium" type="primary">批量发布</el-button>
          <el-button size="medium" type="primary" @click="exportProduct"
            >导出</el-button
          >
          <el-link
            style="margin-left: 20px"
            type="primary"
            :underline="false"
            @click="dropDown"
          >
            {{ dropDownContent }}
            <i :class="dropDownIcon"></i>
          </el-link>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-content-wrapper">
      <el-table
        ref="multipleTable"
        height="100%"
        :data="tableData"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange"
        v-loading="loading"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="comeFrom"
          label="商品信息"
          align="center"
          width="300"
        >
          <template slot-scope="scope">
            <div
              class="flex flex-item--center split-order-item"
              v-for="(item, index) in scope.row.productInfo"
              :key="index"
            >
              <el-popover placement="top-start" trigger="hover">
                <img
                  :src="dealShowFileSrc(scope.row.productInfo.skuCover)"
                  class="previewImage"
                />
                <img
                  :src="dealShowFileSrc(scope.row.productInfo.skuCover)"
                  class="image-box thumbnail"
                  slot="reference"
                />
              </el-popover>
              <div class="block-right">
                <div class="pointer">商品ID：{{ item.productId || "-" }}</div>
                <div class="pointer">
                  {{ scope.row.productInfo.productName }}
                </div>
                <!-- <div class="pointer">
                    <el-tooltip class="item" effect="dark" :content="item.productName" placement="top">
                        <span
                            style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 1;-webkit-box-orient: vertical">
                          {{ item.productName || '-' }}
                        </span>
                    </el-tooltip>
                  </div> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="comeFrom"
          label="Fingo状态"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column
          prop="comeFrom"
          label="状态"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="nameEn"
          label="Fingo后台类目"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="nameCn"
          label="第三方平台类目"
          align="center"
          width="200"
        >
        </el-table-column>

        <el-table-column
          prop="nameCn"
          label="第三方平台销售国家"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="nameCn"
          label="销售店铺"
          align="center"
          width="100"
        >
        </el-table-column>
        <el-table-column
          prop="nameCn"
          label="供应商"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="nameCn"
          label="上新时间"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column
          prop="nameCn"
          label="更新时间"
          align="center"
          width="200"
        >
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <div style="display:flex;justify-content: space-between;">
              <el-button
              plain
              type="text"
              size="mini"
              @click="editPrice(scope.row)"
              >编辑价格</el-button
            >
            <el-button
              plain
              type="text"
              size="mini"
              @click="editPrice(scope.row)"
              >发布商品</el-button
            >
            </div>
            
            <el-button
              plain
              type="text"
              size="mini"
              @click="editPrice(scope.row)"
              >查看商品详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100]"
        :current-page="queryData.page.pageNum"
        :page-size="queryData.page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
        class="pagination"
      >
      </el-pagination>
    </div>
    <!--发布商品-->
    <publish-product
       ref="publishProductRef"
      :publishVisible="publishVisible"
      @on-cancel="cancelPublishDialog"
      :productId="productId"
      @publish-success="confirmPublishSuccess"
    ></publish-product>
    <!---编辑价格-->
    <edit-price
      :editPriceDialog="editPriceDialog"
      @on-cancel="cancelEditPriceDialog"
    ></edit-price>
  </div>
</template>

<script>
import { categoryListGet, CategoryLazadaList,ListProduct} from "@/request/product";
import { supplierBasePage } from "@/request/supplier";
import publishProduct from "./components/publishProduct";
import editPrice from "./components/editPrice";
export default {
  name: "stroeGroupManage",
  data() {
    return {
      //编辑价格
      editPriceDialog: false,
      productId:'',
      //商品发布
      typeList: [
        {
          label: "商品ID",
          value: "1",
        },
        {
          label: "skuId",
          value: "2",
        },
        {
          label: "skuCode",
          value: "3",
        },
        {
          label: "商品名称",
          value: "4",
        },
      ],
      publishVisible: false,
      activeName: "first",
      loading: false,
      drop: false,
      dropDownContent: "展开",
      dropDownIcon: "el-icon-arrow-down",
      queryData: {
        value: "",
        lazadaCateId: [],
        platform: "LAZADA",
        countryCode: "TH",
        lazadaStatus: "",
        fingoStatus: "",
        supplierId: "",
        publishSuccess: "",
        status: 0,
        name: "",
        fingoCateId: "",
        type:'',
        page: {
          pageNum: 1,
          pageSize: 20,
        },
      },
      tableData: [],
      totalCount: 0,
      multipleSelection: [],
      backCategoryOptions: [],
      backCategoryOptions1: [],
      supplierLists: [],
      supplierQuery: {
        supplierName: "",
        page: {
          pageSize: 20,
          pageNum: 1,
        },
      },
    };
  },
  components: {
    publishProduct,
    editPrice,
  },
  mounted() {
    this.fetchCategory({
      level: 1,
      cateType: 2,
      resolve: (data) => {
        this.backCategoryOptions = data;
      },
    });
    this.getSupplierList("");
    
    this.search()
  },
  methods: {
    //初始化店群商品
    search(type){
       if(type==1){
        this.queryData.page.pageNum=1
      }
      let params={
        status:this.queryData.status,
        fingoCateId:this.queryData.fingoCateId?String(this.queryData.fingoCateId[this.queryData.fingoCateId.length]):'',
        lazadaCateId:this.queryData.lazadaCateId?String(this.queryData.lazadaCateId[this.queryData.lazadaCateId.length]):'',
        countryCode:this.queryData.countryCode,
        publishSuccess:this.queryData.publishSuccess,
        fingoStatus:this.queryData.fingoStatus,
        supplierId:this.queryData.supplierId
      }
      switch(this.queryData.type){
        case '2':
          params.fingoSkuId = this.queryData.value;
          break;
        case '1':
          params.fingoProductId = this.queryData.value;
          break;
        case '3':
          params.fingoSkuCode = this.queryData.value
          break;
        case '4':
          params.fingoProductName = this.queryData.value
      }
     
      ListProduct(this.filterData(params)).then(resultes=>{
        if(resultes.ret.errcode==1){

        }
      }).catch(error=>{
        console.log(error)
      })
    },
    //商品导出
    exportProduct() {
      this.publishVisible = true;
      this.$refs['publishProductRef'].getGetPublishInfo()
      this.productId='111'
    },
    confirmPublishSuccess(){
      this.publishVisible = false
      this.search()
      this.productId=''
    },
    cancelPublishDialog() {
      this.publishVisible = false;
    },
    cancelEditPriceDialog() {
      this.editPriceDialog = false;
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
    
    resetSearch() {
      console.log(11);
      //   this.queryData.page.pageNum = 1;
      //   this.queryData.page.pageSize = 20;
      //   this.$refs.brandFilterForm.resetFields();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    cancelDialog() {
      this.dialogEdit = false;
    },
    handleCurrentChange(val) {
      this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum;
    },
    handleSizeChange(val) {
      this.queryData.page.pageSize = val;
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
            res.categoryUnit[i]["cateList"] = [];
            let item = res.categoryUnit[i].cateNameValue.find((val) => {
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
    setBackCateId() {
      if (this.queryData.backCate && this.queryData.backCate.length > 0) {
        let cateInfo = JSON.parse(
          this.queryData.backCate[this.queryData.backCate.length - 1]
        );
        this.queryData.backCateId = cateInfo.cateId;
      } else {
        this.queryData.backCateId = "";
      }
    },
    //第三方类目
    thredFetchCategory({ id, countryCode, resolve }) {
      CategoryLazadaList({
        id: id,
        countryCode: "TH",
      }).then((response) => {
        if (response.ret.errcode == 1) {
          response.subCategoryList.map((item) => {
            if (!item.leaf) {
              item.children = [];
            }
          });
          if (id == 0) {
            this.backCategoryOptions1 = response.subCategoryList;
          } else {
            resolve && resolve(response.subCategoryList, response);
          }
        }
      });
    },
    //第三方类目懒加载
    getPlatformCategory(data, resolve) {
      this.thredFetchCategory({
        id: data.value,
        countryCode: "TH",
        resolve,
      });
    },
  },
};
</script>

