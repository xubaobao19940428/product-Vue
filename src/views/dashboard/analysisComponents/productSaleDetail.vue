<template>
  <div class="product_detail">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div>
          <span style="font-size:20px;font-weight:900;line-height:20px;display:block">
            商品销售详情
            <span style="color:#cccccc;font-size:12px">数据更新至{{todayTime1}}</span>
          </span>
          <el-form :model="formData" :inline="true" label-position="top" size="medium">
            <el-form-item label="日期">
              <el-date-picker
                style="margin-right:20px"
                v-model="formData.dateTime"
                type="daterange"
                value-format="timestamp"
                :picker-options="pickerOptions0"
                range-separator="~"
                :clearable="false"
                @change="changeTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="后台品类" class="filter-item">
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
            <el-form-item label="活动类型">
              <el-select
                v-model="formData.activityType"
                style="width:150px"
                clearable
                @change="changeActive"
              >
                <el-option
                  v-for="(item,index) in activeList"
                  :key="index"
                  :label="item"
                  :value="item"
                ></el-option>
              </el-select>
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
              <el-button type="primary" @click="exportTable">数据导出</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div>
        <el-table
          :data="productSaleTableData"
          style="width: 100%;text-align:center;"
          height="230"
          @sort-change="sortChange"
          :header-cell-style="{'background':'#fafafa','color':'black','font-weight':900}"
        >
          <el-table-column label="日期" width="200" align="center" fixed="left">
            <template slot-scope="scope">
              <span>{{timestampToTime(formData.dateTime[0]).substr(0,10)+'~'+timestampToTime(formData.dateTime[1]).substr(0,10)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="activityType" align="center" label="活动类型" width="180"></el-table-column>
          <el-table-column prop="activityName" align="center" label="活动名称" width="180"></el-table-column>
          <el-table-column prop="productId" align="center" label="商品ID" width="180"></el-table-column>
          <el-table-column prop="productName" align="center" label="商品名称" width="200">
            <template slot-scope="scope">
              <div class="flex flex-item--center">
                <el-popover placement="top-start" trigger="hover">
                  <img :src="dealShowFileSrc(scope.row.productPic)" class="previewImage" />
                  <img
                    :src="dealShowFileSrc(scope.row.productPic)"
                    class="image-box"
                    slot="reference"
                  />
                </el-popover>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="scope.row.productName"
                  placement="top"
                >
                  <span
                    class="block-right"
                    style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical"
                  >{{scope.row.productName}}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cateOneName" align="center" label="一级分类" width="150"></el-table-column>
          <el-table-column prop="cateTwoName" align="center" label="二级分类" width="150"></el-table-column>
          <el-table-column prop="cateThreeName" align="center" label="三级分类" width="150"></el-table-column>
          <el-table-column prop="supplierName" align="center" label="供应商" width="200"></el-table-column>
          <el-table-column prop="soldNum" align="center" label="售出件数" width="150" sortable="custom"></el-table-column>
          <el-table-column prop="pnoAmt" align="center" label="商品GMV" width="150" sortable="custom"></el-table-column>
          <el-table-column
            prop="discount"
            align="center"
            label="商品优惠金额"
            width="150"
            sortable="custom"
          ></el-table-column>
          <el-table-column prop="freight" align="center" label="商品运费" width="150"></el-table-column>
          <el-table-column
            prop="freightDiscount"
            align="center"
            label="运费优惠金额"
            width="150"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            prop="paidGmv"
            align="center"
            label="支付GMV"
            width="150"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            prop="productView"
            align="center"
            label="曝光量"
            width="150"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            prop="productClick"
            align="center"
            label="点击量"
            width="150"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            prop="clickPerView"
            align="center"
            label="曝光点击率"
            width="150"
            sortable="custom"
          ></el-table-column>
          <el-table-column prop="orderNum" align="center" label="下单数" width="150" sortable="custom"></el-table-column>
          <el-table-column
            prop="orderPerClick"
            align="center"
            label="点击购买率"
            width="150"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            prop="orderPaidNum"
            align="center"
            label="下单已支付数"
            width="150"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            prop="payPerOrder"
            align="center"
            label="支付转化率"
            width="150"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            prop="refundQty"
            align="center"
            label="退款件数"
            width="150"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            prop="refundRate"
            align="center"
            label="退款率"
            width="150"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            prop="refundGmv"
            align="center"
            label="退款GMV"
            width="150"
            sortable="custom"
          ></el-table-column>
          <el-table-column prop="income" align="center" label="收入" width="150" sortable="custom"></el-table-column>
        </el-table>
        <div class="pagination-box">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :page-sizes="[5,10, 20, 30, 50]"
            :current-page="formData.page.pageNum"
            :page-size="formData.page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { categoryListGet } from "@/request/product";
export default {
  name: "productSealDetail",
  props: {
    productSaleTableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    activeList: {
      type: Array,
      default: () => {
        return [];
      },
    },
    exportFile: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      todayTime1: "",
      formData: {
        dateTime: [
          new Date(new Date().toLocaleDateString()).getTime() -
            24 * 60 * 60 * 1000 * 7,
          new Date(new Date().toLocaleDateString()).getTime() -
            24 * 60 * 60 * 1000,
        ],
        cateId: "",
        page: {
          pageSize: 10,
          pageNum: 1,
        },
        cateLevel: 0, //等级
        order: "desc", //排序
        olderField: "", //排序字段
        activityType: "", //活动类型
        countryCode: "All",
      },
      isChange: 0,
      pickerOptions0: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() - 8.64e7 ||
            time.getTime() < Date.now() - 8.64e7 * 62
          );
        },
      },
      backCategoryOptions: [],
      buildCheckButton: [
        { name: "全部", value: "All" },
        { name: "MY", value: "MY" },
        { name: "TH", value: "TH" },
        { name: "SG", value: "SG" },
        { name: "ID", value: "ID" },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    //时间修改时触发
    changeTime(value) {
      var differTime = value[1] - value[0];
      if (Math.floor(differTime / 1000 / 60 / 60 / 24) > 6) {
        this.$message.warning("筛选时间要小于7天");
        this.formData.dateTime=[]
        this.$emit('clear-data','111')
        return;
      }

      this.formData.page.pageNum = 1;
      this.changeToFather();
    },
    clickType(index, value) {
      this.isChange = index;
      this.formData.countryCode = value;
      this.formData.page.pageNum = 1;
      this.changeToFather();
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
    setBackCateId(val) {
      this.formData.page.pageNum = 1;
      if (!val) {
        this.formData.cateId = "";
        this.formData.cateLevel = 0;
      } else {
        var data = this.$refs["cascaderDetail"].getCheckedNodes();
        this.formData.cateId = val;
        this.formData.cateLevel = data[0].level;
      }
      this.changeToFather();
    },
    //排序
    sortChange(val) {
      if (val.order === "ascending") {
        this.formData.order = "asc";
      } else {
        this.formData.order = "desc";
      }
      switch (val.column.label) {
        case "售出件数":
          this.formData.olderField = "1";
          break;
        case "商品GMV":
          this.formData.olderField = "2";
          break;
        case "商品优惠金额":
          this.formData.olderField = "3";
          break;
        case "运费优惠金额":
          this.formData.olderField = "4";
          break;
        case "支付GMV":
          this.formData.olderField = "5";
          break;
        case "曝光量":
          this.formData.olderField = "6";
          break;
        case "点击量":
          this.formData.olderField = "7";
          break;
        case "曝光点击率":
          this.formData.olderField = "8";
          break;
        case "下单数":
          this.formData.olderField = "9";
          break;
        case "点击购买率":
          this.formData.olderField = "10";
          break;
        case "下单已支付数":
          this.formData.olderField = "11";
          break;
        case "支付转化率":
          this.formData.olderField = "12";
          break;
        case "退款件数":
          this.formData.olderField = "13";
          break;
        case "退款率":
          this.formData.olderField = "14";
          break;
        case "退款GMV":
          this.formData.olderField = "15";
          break;
        case "收入":
          this.formData.olderField = "16";
          break;
      }
      this.changeToFather();
    },
    handleCurrentChange(val) {
      this.formData.page.pageNum = val;
      this.changeToFather();
    },
    handleSizeChange(val) {
      this.formData.page.pageSize = val;
      this.changeToFather();
    },
    changeActive(val) {
      this.formData.page.pageNum = 1;
      this.changeToFather();
    },
    changeToFather() {
      this.$emit("on-build-up", {
        dateTime: this.formData.dateTime,
        cateId: this.formData.cateId,
        countryCode: this.formData.countryCode,
        cateLevel: this.formData.cateLevel.toString(), //等级
        order: this.formData.order, //排序
        olderField: this.formData.olderField, //排序字段
        activityType: this.formData.activityType, //活动类型
        page: this.formData.page,
      });
    },
    exportTable() {
      if(this.formData.dateTime.length==0){
        this.$message.warning('请挑选历史七天数据')
        return
      }
      let params = {
        startTime: this.formData.dateTime[0].toString(),
        endTime: this.formData.dateTime[1].toString(),
        cateId: this.formData.cateId,
        countryCode: this.formData.countryCode,
        cateLevel: this.formData.cateLevel.toString(), //等级
        order: this.formData.order, //排序
        olderField: this.formData.olderField, //排序字段
        activityType: this.formData.activityType, //活动类型
      };
      this.exportFile(params);
    },
  },
  mounted() {
    this.getTodayTime();
    this.fetchCategory({
      level: 1,
      cateType: 2,
      resolve: (data) => {
        this.backCategoryOptions = data;
      },
    });
  },
};
</script>

<style lang="scss" scoped>
.product_detail {
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
