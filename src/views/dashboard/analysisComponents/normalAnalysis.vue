<template>
  <div class="build_up">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="display: flex;justify-content: space-between;">
        <div style="padding-top:10px">
          <span style="font-size:20px;font-weight:900;line-height:20px">普货分析</span>
        </div>
        <div>
          <el-date-picker
            style="margin-right:20px"
            v-model="buildValue"
            type="date"
            value-format="timestamp"
            @change="changeTime"
            :picker-options="pickerOptions0"
            placeholder="选择日期"
            size="medium"
          ></el-date-picker>
          <el-button-group>
            <el-button-group style="padding: 3px 0">
              <el-button
                size="medium"
                v-for="(item,index) in buildCheckButton"
                :key="index"
                class="btn"
                :class="{'isactive':isChange === index}"
                @click="clickType(index,item.value)"
              >{{item.name}}</el-button>
            </el-button-group>
          </el-button-group>
        </div>
      </div>
      <!--用来写数据-->
      <div class="normal_top">
        <ul>
          <li
            v-for="(item,index) in generalProductType"
            :key="index"
            :class="{'chang_normal':isNormal===index}"
            @click="changeNormal(index)"
          >
            <div class="normal_top_left">
              <p class="blod_text" :class="{'normal_text_color':isNormal===index}">{{item.type}}</p>
              <span class="normal_text" :class="{'normal_text_color':isNormal===index}">
                同比增长
                <span>{{item.change.indexOf('-')==-1&&item.change.indexOf('N')==-1?`+${item.change}`:item.change}}</span>
              </span>
              <span class="normal_bottom" :class="{'normal_text_color':isNormal===index}">{{item.gmv}}</span>
            </div>
            <div class="normal_top_right">
              <el-progress type="circle" :percentage="item.ratio" :stroke-width="16" :width="100" :class="{'is_first':isNormal==index}"></el-progress>
            </div>
          </li>
        </ul>
      </div>
      <div class="all_table">
        <div class="table1">
          <p class="table_title">Top30售出件数</p>
          <el-table
            :data="generalProductData"
            height="230"
            class="el-tablemy"
            v-loading="loading"
            :cell-class-name="changeCellStyle"
            style="width: 100%; text-align:center"
          >
            <el-table-column type="index" width="50" align="center" label="排名"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="商品名称">
              <template slot-scope="scope">
                <el-tooltip
                  v-if="scope.row.productName"
                  class="item"
                  effect="dark"
                  :content="scope.row.productName"
                  placement="top"
                >
                  <el-link
                    :underline="false"
                    style="color: #66b1ff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; 400px"
                    @click="proudctDetail(scope.row)"
                  >{{ scope.row.productName}}</el-link>
                </el-tooltip>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="cateOneName" align="center" width="100" label="一级类目"></el-table-column>
            <el-table-column prop="soldNum" align="center" width="100" label="售出件数"></el-table-column>
            <el-table-column prop="gmv" align="center" width="100" label="支付GMV($)"></el-table-column>
          </el-table>
        </div>
        <div class="table1">
          <p class="table_title">Top30支付GMV</p>
          <el-table :data="generalGmvData" height="230" style="width: 100%;text-align:center" :cell-class-name="changeCellGmvStyle" class="cell_table_gmv" v-loading="loading">
            <el-table-column type="index" width="50" align="center" label="排名"></el-table-column>
            <el-table-column show-overflow-tooltip align="center" label="商品名称">
              <template slot-scope="scope">
                <el-tooltip
                  v-if="scope.row.productName"
                  class="item"
                  effect="dark"
                  :content="scope.row.productName"
                  placement="top"
                >
                  <el-link
                    :underline="false"
                    style="color: #66b1ff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; 400px"
                    @click="proudctDetail(scope.row)"
                  >{{ scope.row.productName}}</el-link>
                </el-tooltip>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="cateOneName" align="center" width="100" label="一级类目"></el-table-column>
            <el-table-column prop="soldNum" align="center" width="100" label="售出件数"></el-table-column>
            <el-table-column prop="gmv" align="center" width="100" label="支付GMV($)"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { numberReg } from "@/utils";

export default {
  name: "normalAnalysis",
  props: {
    generalProductData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    generalGmvData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    generalProductType: {
      type: Array,
      default: () => {
        return [
          {
            type: "整体",
            change: "0",
            gmv:'$0',
            ratio:50
          },
          {
            type: "会场",
            change: "0",
            gmv:'$0',
            ratio:50
          },
          {
            type: "品牌馆",
            change: "0",
            gmv:'$0',
            ratio:50
          },
          {
            type: "日常活动",
            change: "0",
            gmv:'$0',
            ratio:50
          },
          {
            type: "精选商品",
            change: "0",
            gmv:'$0',
            ratio:50
          },
          {
            type: "新品",
            change: "0",
            gmv:'$0',
            ratio:50
          },
          {
            type: "机器上货",
            change: "0",
            gmv:'$0',
            ratio:50
          },
          {
            type: "爆款好物",
            change: "0",
            gmv:'$0',
            ratio:50
          },
          {
            type: "现货专区",
            change: "0",
            gmv:'$0',
            ratio:50
          },
          {
            type: "直播商品",
             change: "0",
            gmv:'$0',
            ratio:50
          },
          {
            type: "限时抢购",
            change: "0",
            gmv:'$0',
            ratio:50
          }
        ];
      }
    },
    loading:{
      type:Boolean,
      default:true
    }
  },
  data() {
    return {
      isChange: 0,
      buildValue:
        new Date(new Date().toLocaleDateString()).getTime(),
      countryCode: "All",
      buildCheckButton: [
        { name: "全部", value: "All" },
        { name: "MY", value: "MY" },
        { name: "TH", value: "TH" },
        { name: "SG", value: "SG" },
        { name: "ID", value: "ID" }
      ],
      todayTime1: "",
      isNormal: 0,
      pickerOptions0: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < Date.now()-8.64e7*7
          );
        }
      },
    };
  },

  methods: {
    //列表项加粗
    changeCellStyle({ row, column, rowIndex, columnIndex }) {
      //第八列添加 red 类

      if (columnIndex == 3) {
        return "fontb";
      }
      //某一行其中的一个变量applies值如果大于0，并且在第六列，即确定一个具体的单元格需要确定行和列
    },
    changeCellGmvStyle({ row, column, rowIndex, columnIndex }){
      if (columnIndex == 4) {
        return "fontb";
      }
    },
    changeNormal(index) {
      this.isNormal = index;
      // var progress = document.getElementsByClassName(
      //   "el-progress-circle__path"
      // );
      // progress[index].style.stroke = "#3596fa";
      // for (let i = 0; i < progress.length; i++) {
      //   if (i != index) {
      //     progress[i].style.stroke = "#9CC8F7";
      //   }
      // }
        this.$emit('on-search-general',{
        date:this.buildValue,
        type:this.isNormal,
        countryCode:this.countryCode,
      })
    },
    //tabs按钮
    clickType(index, value) {
      this.isChange = index;
      this.countryCode = value;
      this.$emit('on-search-general',{
        date:this.buildValue,
        type:this.isNormal,
        countryCode:value,
       
      })
    },
    changeTime(value) {
      this.$emit('on-search-general',{
        date:value,
        type:this.isNormal,
        countryCode:this.countryCode,
      })
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
    proudctDetail(row){
          this.$router.push({
              path:'/product/productListNew',
              query:{
                  productId:row.productId
              }
          })
      }
  },
  mounted() {
    this.getTodayTime();
    // this.clickType(0,'All')
  },
  // updated(){
  //   this.changeNormal(0)
  // }
};
</script>

<style lang="scss" scoped>
.build_up {
  width: 100%;
  margin: 20px 0;
  //   overflow-y: scroll;
  .el-card {
    height: auto;
    .el-button-group {
      margin-left: 10px;
    }
    .normal_top {
      overflow-x: scroll;
      ul {
        display: -webkit-box;
        width: 1500px;
        flex-wrap: wrap;
        li {
          width: 250px;
          height: 150px;
          border-left: 1px solid #cccccc;
          border-bottom: 1px solid #cccccc;
          border-top: 1px solid #cccccc;
          border-radius: 4px;
          padding: 20px 10px 20px 20px;
          display: flex;
          cursor: pointer;
          .normal_top_left {
            flex: 1;
            .blod_text {
              font-size: 20px;
              font-weight: 900;
              color: #303133;
            }
            .normal_text {
              font-size: 12px;
              color: #cccccc;
              margin-top: 20px;
              display: block;
            }
            .normal_bottom {
              margin-top: 20px;
              display: block;
              font-size: 25px;
              color: #666666;
              font-weight: 900;
            }
            .normal_text_color {
              color: #409eff;
            }
          }
          .normal_top_right {
            flex: 1;
            line-height: 150px;
          }
        }
        li:nth-child(6){
          border-right:1px solid #cccccc
        }
        li:last-child{
          border-right:1px solid #cccccc
        }
        .chang_normal {
          border: 2px solid #3596fa;
          color: #3596fa;
          border-radius: 4px;
        }
      }
    }
    .all_table {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 20px;
      .table1 {
        width: 49%;
        border: 1px solid #dddddd;
        padding: 10px;
        .table_title {
          font-weight: 900;
          font-style: normal;
          font-size: 20px;
          color: #303133;
          line-height: 30px;
        }
      }
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

  /deep/ .el-tabs__nav-wrap::after {
    background: #ffffff;
  }
  /deep/ .el-progress-circle__track {
    stroke: #eee;
  }
  /deep/ .el-progress-circle__path {
    stroke: #9cc8f7;
  }
  /deep/ .is_first {
    .el-progress-circle__path{
          stroke:#3596fa
      }
  }
  /deep/ .fontb {
    font-weight: 900;
  }
  /deep/ .el-tablemy th:nth-child(4) .cell {
    color: #575757;
    font-weight: 900;
  }
  /deep/ .cell_table_gmv th:last-child .cell{
    color: #575757;
    font-weight: 900;
  }
  
}
</style>
