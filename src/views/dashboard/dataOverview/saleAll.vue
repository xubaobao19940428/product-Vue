<template>
   <div class="sale_all">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="display: flex;justify-content: space-between;">
        <div>
          <span style="font-size:20px;font-weight:900;line-height:20px">
            2020年销售统计
            <p style="color:#cccccc;font-size:12px">数据更新至{{todayTime1}}</p>
          </span>
        </div>
        <div>
          <!-- <el-date-picker
            style="margin-right:20px"
            v-model="saleTime"
            type="daterange"
            clearable
            value-format="timestamp"
            :picker-options="pickerOptions0"
            range-separator="~"
            @change="changeTime"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker> -->
          <el-button-group>
            <el-button-group style="padding: 3px 0">
              <el-button
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
      <div class="saleChart">
          <div class="sale_left">
            <saleAllChart :title="dTitle" :chartTitle="dChartTitle" :tableData="yearSales.saleRowData" :originData="yearSales"/>
          </div>
          <div class="sale_right">
           <saleAllChart :title="gTitle" :chartTitle="gChartTitle" :tableData="yearGmv.gmvRowData" :originData="yearGmv"/>
          </div>
      </div>

    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import saleAllChart from './saleAllChart/index'
export default {
  name: 'saleAll',
  components:{
    saleAllChart
  },
  props:{
    // saleRowData:{
    //   type:Array,
    //   default:()=>{
    //     return []
    //   }
    // },
    // gmvRowData:{
    //   type:Array,
    //   default:()=>{
    //     return []
    //   }
    // },
    yearGmv:{
      type:Object,
      default:()=>{
        return {
           xAxis:[],
           data:[],
           lenged:[],
           saleRowData:[],
        }
      }
    },
    yearSales:{
      type:Object,
      default:()=>{
        return {
           xAxis:[],
           data:[],
           lenged:[],
           saleRowData:[],
        }
      }
    },
  },
  data() {
    return {
        buildType: "1",
        buildCheckButton: [
        { name: "全部", value: "All" },
        { name: "MY", value: "MY" },
        { name: "TH", value: "TH" },
        { name: "SG", value: "SG" },
        { name: "ID", value: "ID" }
      ],
      isChange: 0,
      dTitle:'订单',
      gTitle:'GMV ($)',
      dChartTitle:'有效订单数',
      gChartTitle:'收入',
      todayTime1:'',
      pickerOptions0: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now()
          );
        }
      },
      saleTime: [
        new Date(new Date().toLocaleDateString()).getTime() -
          24 * 60 * 60 * 1000 * 120 -
          1,
        new Date(new Date().toLocaleDateString()).getTime()
      ],
    };
  },

  methods: {
       clickType(index, value) {
        this.isChange = index;
        this.buildType = value;
        this.$emit('on-set-sale',this.buildType)
        },

        //左边表格
       formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
      },
    formatTime(number,format) {

      var formateArr  = ['Y','M','D','h','m','s'];
      var returnArr   = [];

      var date = new Date(number);
      returnArr.push(date.getFullYear());
      returnArr.push(this.formatNumber(date.getMonth() + 1));
      returnArr.push(this.formatNumber(date.getDate()));
      returnArr.push(this.formatNumber(date.getHours()));
      returnArr.push(this.formatNumber(date.getMinutes()));
      returnArr.push(this.formatNumber(date.getSeconds()));

      for (var i in returnArr)
      {
        format = format.replace(formateArr[i], returnArr[i]);
      }
      return format;
      },
    getTodayTime(){
        var todayTime = new Date().getTime()-24*60*60*1000
       this.todayTime1 = this.formatTime(todayTime,'Y/M/D')
       console.log(this.todayTime1)
      },
  },
  mounted(){
    this.getTodayTime()
  }
};
</script>

<style lang="scss" scoped>
.sale_all {
  width: 100%;
  margin: 20px 0;
  .el-card {
    height: auto;
    .el-button-group {
      margin-left: 10px;
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
  .saleChart{
      width:100%;
      display:flex;
      .sale_left{
          width:50%;
          height:320px;
          border:1px solid #cccccc;
          margin-right:20px;
      }
      .sale_right{
          width:50%;
          height:320px;
          border:1px solid #cccccc;
      }
  }
}
</style>
