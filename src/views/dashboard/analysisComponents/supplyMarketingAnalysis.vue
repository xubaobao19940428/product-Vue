<template>
  <div class="supply_marketing">
    <el-card class="box-card">
      <div slot="header" class="clearfix" style="display: flex;justify-content: space-between;">
        <div>
          <span style="font-size:20px;font-weight:900;display: block;height: 100%;line-height: 80px;">
            供销价格带分析
            <span style="color:#cccccc;font-size:12px">数据更新至{{todayTime1}}</span>
          </span>
        </div>
        <div>
          <el-form :model="formData" :inline="true" label-position="top" size="medium">
            <el-form-item label="日期">
              <el-date-picker
            style="margin-right:20px"
            v-model="formData.dateTime"
            type="date"
            value-format="timestamp"
            @change="changeTime"
            :picker-options="pickerOptions0"
            placeholder="选择日期"
            size="medium"
          ></el-date-picker>
            </el-form-item>
           <el-form-item label="后台类目">
              <el-select placeholder v-model="formData.cateId" @change="changeCategory">
                <el-option v-for="item in cateList" :key="item.cateId" :label="item.cateName" :value="String(item.cateId)"></el-option>
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
          </el-form>
        </div>
      </div>
      <div>
        <el-table :data="supplyMarketTableData" style="width: 100%;text-align:center;" :header-cell-style="{'background':'#fafafa','color':'black','font-weight':900}">
          <el-table-column prop="cateOneName" label="一级类目"  align="center"></el-table-column>
          <el-table-column prop="priceRange" align="center" label="价格带" width="150">
            <template slot="header" slot-scope="scope">
              <span>价格带</span>
                  <el-tooltip content="取数规则，当天有订单则取订单里的售价，否则取商品的VIP价。" placement="top">
                    <i class="el-icon-question"></i>
                  </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column  align="center" label="货币" width="150" prop="currency">
            <!-- <template slot-scope="scope">
              <span>{{moneyUnit}}</span>
            </template> -->
          </el-table-column>
          <el-table-column prop="stockNum" align="center" label="在架商品数" width="150"></el-table-column>
          <el-table-column prop="soldProductNum" align="center" label="售出商品数" width="150"></el-table-column>
          <el-table-column prop="rollingSalesRate" align="center" label="动销率" width="100"></el-table-column>
          <el-table-column prop="salesQty" align="center" label="售出件数" width="150"></el-table-column>
          <el-table-column prop="paidGmv" align="center" label="支付GMV" width="100"></el-table-column>
          <el-table-column prop="soldProductCost" align="center" label="售出商品成本" width="150"></el-table-column>
          <el-table-column prop="netProfitMargin" align="center" label="毛利率" width="100"></el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { GetBackendLevelOneCategory } from "@/request/dataV";
export default {
  name: "supplyMarketingAnalysis",
  props:{
      supplyMarketTableData:{
          type:Array,
          default:()=>{
              return [
              
              ]
          }
      },
      cateList:{
        type:Array,
        default:()=>{
          return []
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
      isChange: 0,
      formData: {
        dateTime: new Date(new Date().toLocaleDateString()).getTime() -
        24 * 60 * 60 * 1000,
        cateId: "all",
        cateLevel:0,
        countryCode:'MY',
        cateName:'全部'
      },
      moneyUnit:'MYR',
      units:[
        { name: "MY", value: "MYR" },
        { name: "TH", value: "THB" },
        { name: "SG", value: "SGD" }
      ],
      buildCheckButton: [
        { name: "MY", value: "MY" },
        { name: "TH", value: "TH" },
        { name: "SG", value: "SG" }
      ],
      todayTime1:'',
      backCategoryOptions:[],
      level:1,
      pickerOptions0: {
        disabledDate(time) {
          return (
            time.getTime() > Date.now()-8.64e7
          );
        }
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    
    clickType(index, value) {
      this.isChange = index;
      this.formData.countryCode = value;
      _.forEach(this.units,item=>{
        if(item.name==this.formData.countryCode){
          this.moneyUnit = item.value
        }
      })
     this.changeToFather()
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
    changeToFather(){
       this.$emit('on-reset-search',{
        dateTime:this.formData.dateTime,
        cateId:this.formData.cateId,
        countryCode:this.formData.countryCode,
        cateName:this.formData.cateName
      })
    },
    changeTime(value) {
      this.changeToFather()
    }, 
     changeCategory(value){
       _.forEach(this.cateList,item=>{
         if(item.cateId==value){
           this.formData.cateName = item.cateName
         }
       })
      this.changeToFather()
    },
  },
  mounted() {
    this.getTodayTime()
  }
};
</script>

<style lang="scss" scoped>
.supply_marketing {
  width: 100%;
  margin: 20px 0;
  .el-card {
    height: auto;
    .el-form-item{
        margin-bottom:0;
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
