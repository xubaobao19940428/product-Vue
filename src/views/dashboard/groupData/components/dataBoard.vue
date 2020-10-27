<template>
  <div class="fright-databoard">
    <el-card shadow="always">
      <div class="title">拼团关键数据</div>
      <div class="filter-container">
        <el-form ref="indexFilterForm" inline label-width="90px" :model="queryData">
          <el-form-item label="选择日期：" prop="timeList" class="filter-item">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="queryData.timeList"
              size="medium"
              type="daterange"
              :clearable="false"
              :picker-options="pickerOptions"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="拼团类型：" class="filter-item" prop="status">
            <el-select v-model="queryData.groupType" size="medium">
              <el-option
                v-for="(item, index) in dataHouseCrux"
                :key="index"
                :label="item.itemName"
                :value="item.itemCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家：" class="filter-item" prop="countryCode">
            <el-select v-model="queryData.countryCode" size="medium">
              <el-option
                v-for="(item, index) in dataHouseCountry"
                :key="index"
                :label="item.itemName"
                :value="item.itemCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="filter-item" style="margin-left: 20px;">
            <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column label="日期" width="250" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.dateDay}}</div>
            </template>
          </el-table-column>
          <el-table-column label="当日开团数" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.groupTotal}}</div>
            </template>
          </el-table-column>
          <el-table-column label="当日开团成功数" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.groupTotalSuccess}}</div>
            </template>
          </el-table-column>
          <el-table-column label="当日拼团订单数" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.groupOrderTotal}}</div>
            </template>
          </el-table-column>
           <el-table-column label="首页拼团入口PV(UV)" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.indexEntryNum}}</div>
            </template>
          </el-table-column>
           <el-table-column label="PS店铺页拼团入口PV(UV)" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.psShopEntryNum}}</div>
            </template>
          </el-table-column>
           <el-table-column label="个人中心拼团入口PV(UV)" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.accountEntryNum}}</div>
            </template>
          </el-table-column>
          <el-table-column label="当日GMV" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.gmv}}</div>
            </template>
          </el-table-column>
          <el-table-column label="历史拼团订单数" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.groupOrderTotalHistory}}</div>
            </template>
          </el-table-column>
          <el-table-column label="累计GMV" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.gmvTotal}}</div>
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
            :total="queryData.total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
    <el-card shadow="always">
      <div class="title" style="display:flex;justify-content: space-between;">
        <span>拼团商品数据</span>
        <el-button-group style="padding: 3px 0">
          <el-button
            v-for="(item,index) in buildCheckButton"
            :key="index"
            class="btn"
            :class="{'isactive':isChange === index}"
            @click="clickType(index,item.value)"
          >{{item.name}}</el-button>
        </el-button-group>
      </div>
      <div class="filter-container">
        <el-form ref="indexFilterForm" inline label-width="90px" :model="initData">
          <el-form-item label="选择日期：" prop="timeList" class="filter-item">
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="initData.timeList"
              size="medium"
              type="daterange"
              :clearable="false"
              :picker-options="pickerLastOptions"
              start-placeholder="开始日期"
              @change="changeTime"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="商品ID：" class="filter-item" prop="status">
            <el-input v-model="initData.product" placeholder="请输入" size="medium"></el-input>
          </el-form-item>
          <el-form-item label="拼团类型：" class="filter-item" prop="countryCode">
            <el-select v-model="initData.groupType" size="medium">
              <el-option
                v-for="(item, index) in dataHouseCrux"
                :key="index"
                :label="item.itemName"
                :value="item.itemCode"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="filter-item" style="margin-left: 20px;">
            <el-button type="primary" @click="commonExport(initData)" size="medium">数据导出</el-button>
            <el-button icon="el-icon-search" type="primary" @click="initSearch" size="medium">搜索</el-button>
            <el-button icon="el-icon-refresh-left" @click="initResetSearch" size="medium">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- string productName = 1; // 商品名称
        string productPic = 2; // 商品图片
        string productId = 3; // 商品id
        -->
        <el-table :data="tableInitData" border style="width: 100%" @sort-change="sortChange">
          <el-table-column label="商品名称" width="300" align="center" fixed="left">
            <template slot-scope="scope">
              <div class="product">
                <img :src="dealShowFileSrc(scope.row.productPic)" class="product-img" />
                <div class="product-name">{{scope.row.productName}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品ID" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.productId}}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单销量" width="200" align="center" sortable="custom">
            <template slot-scope="scope">
              <div>{{scope.row.orderNum}}</div>
            </template>
          </el-table-column>
          <el-table-column label="曝光PV" width="200" align="center" sortable="custom">
            <template slot-scope="scope">
              <div>{{scope.row.productViewPv}}</div>
            </template>
          </el-table-column>
          <el-table-column label="曝光UV" width="200" align="center" >
            <template slot-scope="scope">
              <div>{{scope.row.productViewUv}}</div>
            </template>
          </el-table-column>
          <el-table-column label="点击PV数" width="200" align="center" sortable="custom">
            <template slot-scope="scope">
              <div>{{scope.row.productClickPv}}</div>
            </template>
          </el-table-column>
          <el-table-column label="点击UV数" width="200" align="center" sortable="custom">
            <template slot-scope="scope">
              <div>{{scope.row.productClickUv}}</div>
            </template>
          </el-table-column>
          <el-table-column label="点击转化率" width="200" align="center" >
            <template slot-scope="scope">
              <div>{{scope.row.clickPerView}}</div>
            </template>
          </el-table-column>
          <el-table-column label="详情页点击开团PV数" width="200" align="center" sortable="custom">
            <template slot-scope="scope">
              <div>{{scope.row.createGroupPv}}</div>
            </template>
          </el-table-column>
          <el-table-column label="详情页点击开团UV数" width="200" align="center" sortable="custom">
            <template slot-scope="scope">
              <div>{{scope.row.createGroupUv}}</div>
            </template>
          </el-table-column>
          <el-table-column label="详情页点击参团PV数" width="200" align="center" sortable="custom">
            <template slot-scope="scope">
              <div>{{scope.row.joinGroupPv}}</div>
            </template>
          </el-table-column>
          <el-table-column label="详情页点击参团UV数" width="200" align="center" sortable="custom">
            <template slot-scope="scope">
              <div>{{scope.row.joinGroupUv}}</div>
            </template>
          </el-table-column>
          <el-table-column label="规格确认PV数" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.specSelectPv}}</div>
            </template>
          </el-table-column>
          <el-table-column label="规格确认UV数" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.specSelectUv}}</div>
            </template>
          </el-table-column>
          <el-table-column label="参团支付成功" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.joinPaidNum}}</div>
            </template>
          </el-table-column>
          <el-table-column label="开团支付成功" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.createPaidNum}}</div>
            </template>
          </el-table-column>
          <el-table-column label="订单金额" width="200" align="center">
            <template slot-scope="scope">
              <div>{{scope.row.orderAmount}}</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="page-wrapper">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="initData.page.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="initData.total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
// import moment from 'moment'
import {
  GetGroupProductData,
  GetGroupImportantData
} from "@/request/dataBoard";
import { RouteAndExport } from "@/request/fileCenter";
export default {
  data() {
    var originDate = () => {
      var newDate = new Date();
      newDate.setMonth(6);
      newDate.setDate(14);
      return newDate.getTime();
    };
    return {
      isChange: 0,
      buildCheckButton: [
        { name: "全部", value: "All" },
        { name: "MY", value: "MY" },
        { name: "TH", value: "TH" },
        { name: "SG", value: "SG" },
        { name: "ID", value: "ID" }
      ],

      queryData: {
        timeList: [],
        countryCode: "4",
        groupType: "5",
        page: {
          pageNum: 1,
          pageSize: 10,
          pagingSwitch: true
        },
        total: 0
      },
      initData: {
        timeList: [],
        product: "",
        groupType: "5",
        orderType: "37",
        orderName: "desc",
        countryCode: "All",
        page: {
          pageNum: 1,
          pageSize: 10,
          pagingSwitch: true
        },
        total: 0
      },
      nowDate: this.timestampToTime(new Date().getTime() - 8.64e7),
      pickerOptions: {
        disabledDate(time) {
          return (
            time.getTime() - 24 * 60 * 60 * 1000 >=
            moment()
              .startOf("day")
              .unix() *
              1000
          );
        }
      },
      pickerLastOptions: {
        disabledDate(time) {
          return time.getTime() > new Date().getTime() - 8.64e7;
        }
      },
      total: 0,
      totals: 0,
      tableData: [],
      tableInitData: [],
      lastMonthDateOnly: this.timestampToTime(
        new Date().getTime() - 24 * 60 * 60 * 1000 * 31
      )
    };
  },
  props: {
    dataHouseCrux: Array,
    dataHouseProduct: Array,
    dataHouseCountry: Array
  },
  created() {
    this.queryData.timeList = [this.lastMonthDate, this.nowEndDate];
    this.initData.timeList = [this.lastMonthDateOnly, this.nowDate];
  },
  mounted() {
    this.getGroupProductData();
    this.getGroupImportantData();
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
    changeTime(value) {
      console.log(value);
    },
    //国家按钮
    clickType(index, value) {
      this.isChange = index;
      this.initData.countryCode = value;
      this.getGroupProductData();
    },
    handleSizeChanges(val) {
      this.queryData.page.pageSize = val;
      this.getGroupImportantData();
    },
    handleCurrentChanges(val) {
      this.queryData.page.pageNum = val;
      this.getGroupImportantData();
    },
    handleSizeChange(val) {
      this.initData.page.pageSize = val;
      this.getGroupProductData();
    },
    handleCurrentChange(val) {
      this.initData.page.pageNum = val;
      this.getGroupProductData();
    },
    search() {
      this.getGroupImportantData();
    },
    getGroupImportantData() {
      let params = {
        startTime: moment(this.queryData.timeList[0])
          .valueOf()
          .toString(),
        endTime: this.timeTotimestamp(this.queryData.timeList[1]).toString(),
        groupType: this.queryData.groupType,
        countryCode: this.queryData.countryCode,
        page: this.queryData.page
      };

      GetGroupImportantData(params).then(res => {
        if (res.ret.errcode === 1) {
          this.tableData = res.groupImportantDataInfo;
          this.queryData.total = Number(res.total);
        }
      });
    },
    resetSearch() {
      this.queryData.startTime = this.nowEndDate;
      this.queryData.endTime = this.lastMonthDate;
      this.queryData.groupType = "5";
      this.queryData.countryCode = "4";
    },
    initSearch() {
      this.getGroupProductData();
    },
    sortChange(val) {
      if (val.order === "ascending") {
        this.initData.orderName = "asc";
      } else {
        this.initData.orderName = "desc";
      }
      switch (val.column.label) {
        case "订单销量":
          this.initData.orderType = "30";
          break;
        case "点击PV数":
          this.initData.orderType = "31";
          break;
        case "点击UV数":
          this.initData.orderType = "32";
          break;
        case "详情页点击开团PV数":
          this.initData.orderType = "33";
          break;
        case "详情页点击开团UV数":
          this.initData.orderType = "34";
          break;
        case "详情页点击参团PV数":
          this.initData.orderType = "35";
          break;
        case "详情页点击参团UV数":
          this.initData.orderType = "36";
          break;
        case "曝光PV":
          this.initData.orderType = "37";
          break;
        // case "曝光UV":
        //   this.initData.orderType = "38";
        //   break;
        // case "点击转化率":
        //   this.initData.orderType = "39";
        //   break;
      }
      this.getGroupProductData();
    },
    getGroupProductData() {
      let params = {
        startTime: this.timeTotimestamp(this.initData.timeList[0]).toString(),
        endTime: this.timeTotimestamp(this.initData.timeList[1]).toString(),
        productId: this.initData.product,
        groupType: this.initData.groupType,
        orderType: this.initData.orderType,
        orderName: this.initData.orderName,
        page: this.initData.page,
        countryCode: this.initData.countryCode
      };
      if (this.initData.timeList[1] == this.nowDate) {
        params.endTime = this.timeTotimestamp(
          this.initData.timeList[1]
        ).toString();
      } else {
        params.endTime = (
          this.timeTotimestamp(this.initData.timeList[1]) +
          24 * 60 * 60 * 1000 -
          1
        ).toString();
      }
      GetGroupProductData(params).then(res => {
        if (res.ret.errcode === 1) {
          this.tableInitData = res.groupBuyProductInfo;
          this.initData.total = Number(res.total);
        }
      });
    },
    //拼团商品数据
    commonExport() {
      var outParams = {
        startTime: moment(this.initData.timeList[0])
          .valueOf()
          .toString(),
        endTime: this.timeTotimestamp(this.initData.timeList[1]).toString(),
        productId: this.initData.product,
        groupType: this.initData.groupType,
        orderType: this.initData.orderType,
        orderName: this.initData.orderName,
        countryCode: this.initData.countryCode
      };
      RouteAndExport({
        type: 3,
        param: JSON.stringify(outParams)
      })
        .then(response => {
          if (response.ret.errcode == 1) {
            switch (response.code) {
              case 1:
              case 2:
              case 3:
                this.$notify({
                  title: "生成导出任务成功",
                  message:
                    "导出的数据文件正在生成中，请至文件中心查看进度并下载",
                  type: "success",
                  onClose: () => {
                    this.$router.push("/fileCenter/exportList");
                  },
                  duration: 1500
                });
                break;
              case 4:
                this.$notify({
                  title: "生成导出任务失败",
                  message: "任务生成失败，请稍后再试",
                  type: "info"
                });
                break;
              case 5:
                this.$notify({
                  title: "导出限制",
                  message: "相同参数的导出任务，同个用户15分钟内只允许导出一次",
                  type: "info"
                });
                break;

              case 6:
                this.$notify({
                  title: "请勿反复提及导出任务",
                  message: "请勿重复提交，30秒后再尝试",
                  type: "info"
                });
              default:
                break;
            }
          }
        })
        .catch(err => {
          console.error(err);
        });
    },
    initResetSearch() {
      this.initData.startTime = this.nowEndDate;
      this.initData.endTime = this.lastMonthDateOnly;
      this.initData.timeList = [this.lastMonthDateOnly, this.nowDate];
      this.initData.groupType = "5";
      this.initData.product = "";
      this.initData.orderType = "37";
      this.initData.orderName = "desc";
      this.initData.page.pageNum = 1;
      this.getGroupProductData();
    }
  }
};
</script>
<style lang="scss">
.fright-databoard {
  .el-card {
    margin-bottom: 10px;
  }
}
</style>
<style lang="scss" scoped>
.fright-databoard {
  overflow: scroll;
  .title {
    padding-bottom: 20px;
    font-size: 22px;
    font-weight: 600;
  }
  .product {
    display: flex;
    justify-content: space-between;
    .product-img {
      width: 100px;
      height: 100px;
    }
    .product-name {
      width: 160px;
      text-align: left;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
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
