<template>
  <div class="product_cost">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div>
          <span style="font-size:20px;font-weight:900;line-height:20px;display:block">
            商品成本分析
            <span style="color:#cccccc;font-size:12px">数据更新至{{todayTime1}}</span>
          </span>
          <el-form :model="formData" :inline="true" label-position="top" size="medium">
            <el-form-item label="日期">
              <el-date-picker
                style="margin-right:20px"
                v-model="formData.buildValue"
                type="daterange"
                clearable
                value-format="timestamp"
                :picker-options="pickerOptions0"
                range-separator="~"
                @change="changeTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="后台类目" class="filter-item">
              <el-cascader
                ref="cascaderDetail"
                clearable
                filterable
                :props="{label: 'cateName', children: 'levelValue', value: 'cateId', lazy: true, lazyLoad: getBackSubCategory, checkStrictly: true,emitPath:false}"
                placeholder="请选择商品后台分组"
                :options="backCategoryOptions"
                v-model="formData.cateId"
                @change="setBackCateId"
                class="normalOperatorBox"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="国家">
              <el-button-group style="text-align:left">
                <el-button
                  v-for="(item,index) in buildCheckButton"
                  :key="index"
                  class="btn"
                  :class="{'isactive':isChange === index}"
                  @click="clickType(index,item.value)"
                >{{item.name}}</el-button>
              </el-button-group>
            </el-form-item>
            <el-form-item label="　">
              <el-button type="primary">数据导出</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div>
        <el-table :data="productSaleTableData" style="width: 100%;text-align:center;height:250px">
          <el-table-column prop="date" label="日期" width="180" align="center" fixed="left"></el-table-column>
          <el-table-column prop="name" align="center" label="活动类型" width="180"></el-table-column>
          <el-table-column prop="address" align="center" label="商品ID" width="180"></el-table-column>
          <el-table-column prop="address" align="center" label="商品名称" width="200"></el-table-column>
          <el-table-column prop="address" align="center" label="一级分类" width="150"></el-table-column>
          <el-table-column prop="address" align="center" label="二级分类" width="150"></el-table-column>
          <el-table-column prop="address" align="center" label="三级分类" width="150"></el-table-column>
          <el-table-column prop="address" align="center" label="可售库存件数" width="200"></el-table-column>
          <el-table-column prop="address" align="center" label="库存商品GMV($)" width="150"></el-table-column>
          <el-table-column prop="address" align="center" label="库存采购成本($)" width="150"></el-table-column>
          <el-table-column prop="address" align="center" label="毛利率" width="150"></el-table-column>
         
        </el-table>
         <div class="pagination-box">
            <el-pagination
                background
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[5,10, 20, 30, 50]"
                :page-size="formData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { categoryListGet } from "@/request/product";
export default {
  name: "productCostAnalysis",
  props: {
    productSaleTableData: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    var originDate = () => {
      var newDate = new Date();
      newDate.setMonth(0);
      newDate.setDate(1);
      return newDate.getTime();
    };
    return {
      todayTime1: "",
      formData: {
        detailTimeValue: [
          new Date(new Date().toLocaleDateString()).getTime() -
            24 * 60 * 60 * 1000 * 13 -
            1,
          new Date(new Date().toLocaleDateString()).getTime() -
            24 * 60 * 60 * 1000
        ],
        cateId: "",
        page:{
            pageSize:10,
            pageNum:1
        }
      },
      total:0,
      buildType: "All",
      isChange: 0,
      level: 1,
      pickerOptions0: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() - 8.64e7 ||
            time.getTime() < originDate() - 8.64e7
          );
        }
      },
      backCategoryOptions: [],
      buildCheckButton: [
        { name: "全部", value: "All" },
        { name: "MY", value: "MY" },
        { name: "TH", value: "TH" },
        { name: "SG", value: "SG" },
        { name: "ID", value: "ID" }
      ]
    };
  },
  computed: {},
  watch: {},
  methods: {
    //时间修改时触发
    changeTime(value) {
      this.$emit("on-build-up", {
        dateTime: this.formData.detailTimeValue,
        changeType: this.buildType
      });
    },
    clickType(index, value) {
      this.isChange = index;
      this.buildType = value;
      this.$emit("on-build-up", {
        dateTime: this.formData.detailTimeValue,
        changeType: this.buildType
      });
    },
    formatNumber(n) {
      n = n.toString();
      return n[1] ? n : "0" + n;
    },
    formatTime(number, format) {
      var formateArr = ["Y", "M", "D", "h", "m", "s"];
      var returnArr = [];

      var date = new Date(number);
      returnArr.push(date.getFullYear());
      returnArr.push(this.formatNumber(date.getMonth() + 1));
      returnArr.push(this.formatNumber(date.getDate()));
      returnArr.push(this.formatNumber(date.getHours()));
      returnArr.push(this.formatNumber(date.getMinutes()));
      returnArr.push(this.formatNumber(date.getSeconds()));
      for (var i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i]);
      }
      return format;
    },
    getTodayTime() {
      var todayTime = new Date().getTime() - 24 * 60 * 60 * 1000;
      this.todayTime1 = this.formatTime(todayTime, "Y/M/D");
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
    setBackCateId(val) {
      var data = this.$refs["cascaderDetail"].getCheckedNodes();
      this.level = data[0].level;
    }
  },
  mounted() {
    this.getTodayTime();
    this.fetchCategory({
      level: 1,
      cateType: 2,
      resolve: data => {
        this.backCategoryOptions = data;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.product_cost {
  width: 100%;
  margin: 20px 0;
  .el-card {
    height: auto;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .isactive {
    color: #409eff !important;
    background: #ecf5ff !important;
    border-color: #b3d8ff !important;
  }
  .btn {
    background: #fff;
    border: 1px solid #dcdfe6;
  }
}
</style>
