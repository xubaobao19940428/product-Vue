<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        ref="brandFilterForm"
        inline
        label-width="120px"
        :model="queryData"
      >
        <el-form-item label="平台：" class="filter-item" prop="platform">
          <el-select
            v-model="queryData.platform"
            placeholder="选择平台"
            size="medium"
            clearable
            disabled
          >
            <el-option
              v-for="item in platformList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
              checkStrictly: false,
              multiple: true,
            }"
            placeholder="请选择商品后台分组"
            :options="backCategoryOptions"
            v-model="queryData.fingoCategoryIdList"
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
              multiple: true,
            }"
            placeholder="请选择第三方类目"
            :options="backCategoryOptions1"
            v-model="queryData.thirdCategoryIdList"
            @change="setBackCateId1"
            class="normalOperatorBox"
            size="medium"
          >
          </el-cascader>
        </el-form-item>
        <el-form-item label="国家：" class="filter-item" prop="countryCode">
          <el-select v-model="queryData.countryCode" size="medium">
            <el-option
              v-for="item in countryList"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="映射状态："
          class="filter-item"
          prop="categoryStatus"
        >
          <el-select v-model="queryData.categoryStatus" size="medium" clearable>
            <el-option
              v-for="item in categoryStatusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="filter-item" style="margin-left: 20px">
          <el-button
            icon="el-icon-search"
            type="primary"
            @click="search(1)"
            size="medium"
            @keyup.enter.native="search(1)"
            >搜索</el-button
          >
          <el-button
            icon="el-icon-refresh-left"
            @click="resetSearch"
            size="medium"
            >重置</el-button
          >
          <el-button size="medium" type="primary">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main-content-wrapper">
      <el-table
        height="100%"
        :data="tableData"
        border
        style="width: 100%"
        v-loading="loading"
      >
        <el-table-column
          prop="thirdCategoryId"
          label="第三方类目ID"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column label="第三方类目" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.thirdCategoryNames.length == 0">-</div>
            <div v-else>
              {{ scope.row.thirdCategoryNames.join(">>") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="Fingo后台类目" align="center">
          <template slot-scope="scope">
            <div v-if="scope.row.fingoCategoryList.length == 0">-</div>
            <div v-else>
              {{ returnFingoCategoryList(scope.row.fingoCategoryList)}}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button
              plain
              type="primary"
              size="mini"
              @click="editStoreCategoy(scope.row)"
              >编辑</el-button
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
    <categoryEdit
      :backCategoryOptions="backCategoryOptions"
      :dialogEdit="dialogEdit"
      ref="categoryEditRef"
      @on-cancel="cancelDialog"
      @on-success="editSuccess"
    >
    </categoryEdit>
  </div>
</template>

<script>
import { categoryListGet } from "@/request/product";
import categoryEdit from "./components/categoryEdit";
import { CategoryMappingQuery, CategoryLazadaList } from "@/request/product";
export default {
  name: "categoryMapping",
  data() {
    return {
      loading: false,
      platformList: [
        {
          value: 1,
          label: "LAZADA",
        },
      ],
      categoryStatusList: [
        {
          value: 0,
          label: "未映射",
        },
        {
          value: 1,
          label: "已映射",
        },
      ],
      queryData: {
        platform: 1,
        fingoCategoryIdList: [],
        thirdCategoryIdList: [],
        categoryStatus: "",
        countryCode: "TH",
        page: {
          pageNum: 1,
          pageSize: 20,
        },
      },
      countryList: [
        {
          value: "TH",
          label: "泰国",
        },
      ],
      tableData: [],
      totalCount: 0,
      backCategoryOptions: [],
      dialogEdit: false,
      backCategoryOptions1: [],
    };
  },
  components: {
    categoryEdit,
  },
  mounted() {
    this.fetchCategory({
      level: 1,
      cateType: 2,
      resolve: (data) => {
        this.backCategoryOptions = data;
      },
    });
    // this.thredFetchCategory({
    //       id:0,
    //       countryCode:'TH',
    //       resolve:(data)=>{
    //           console.log(data)
    //           this.backCategoryOptions1 = data
    //       }
    //   })
    this.search(1);
  },
  methods: {

    returnFingoCategoryList(fingoCategoryList){
      var str=''
      fingoCategoryList.map(item=>{
        item.fingoCategoryItems.map((value,index)=>{
          if(index<item.fingoCategoryItems.length-1){
            str+=value.name+'>>'
          }else{
            str+=value.name+'('+value.id+')'+';'
          }
        })
      })
      str = str.substr(0, str.length - 1);  
      return str
    },
    editSuccess() {
      this.search();
      this.dialogEdit = false;
    },
    search(type) {
      this.loading = true;
      if (type == 1) {
        this.queryData.page.pageNum = 1;
      }
      let params = {
        page: this.queryData.page,
        platform: this.queryData.platform,
        categoryStatus: this.queryData.categoryStatus,
        countryCode: this.queryData.countryCode,
      };
      let fingoCategoryIdList = [],
        thirdCategoryIdList = [];
      if (this.queryData.fingoCategoryIdList.length != 0) {
        this.queryData.fingoCategoryIdList.map((item) => {
          fingoCategoryIdList.push(item[2]);
        });
        params.fingoCategoryIdList = fingoCategoryIdList;
      }
      if (this.queryData.thirdCategoryIdList.length != 0) {
        this.queryData.thirdCategoryIdList.map((item) => {
          thirdCategoryIdList.push(item[item.length - 1]);
        });
        params.thirdCategoryIdList = thirdCategoryIdList;
      }
      CategoryMappingQuery(params)
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            console.log(resultes);
            this.tableData = resultes.mappingList;
            this.totalCount = resultes.total;
            this.loading = false;
          } else {
            this.loading = false;
          }
        })
        .catch((error) => {
          this.loading = false;
          console.log(error);
        });
    },
    resetSearch() {
      this.queryData.page.pageNum = 1;
      this.queryData.page.pageSize = 20;
      this.queryData.fingoCategoryIdList = [];
      this.queryData.thirdCategoryIdList = [];
      this.queryData.categoryStatus = "";
      this.search(1);
    },
    cancelDialog() {
      this.dialogEdit = false;
    },
    handleCurrentChange(val) {
      this.queryData.page.pageNum = val;
      this.search();
    },
    handleSizeChange(val) {
      this.queryData.page.pageSize = val;
      this.search();
    },
    //Fingo后台类目懒加载
    getBackSubCategory(data, resolve) {
      console.log(data);
      if (data.level == 0) {
        return;
      }
      this.fetchCategory({
        pid: data.value,
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
    setBackCateId(data) {},
    //第三方类目选择
    setBackCateId1(data) {},
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
    //编辑第三方类目
    editStoreCategoy(row) {
      console.log(row);
      this.dialogEdit = true;
      this.$refs["categoryEditRef"].editCategory(row, "edit");
    },
  },
};
</script>

