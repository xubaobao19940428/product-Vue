<style>
  .echarts{
    width: 100%;
    max-width: 800px;
  }
</style>
<template>
  <div class="dashboard app-container">
  <div class="dashboard_header">
    <overviewHeader :todayGiftGmv="todayGiftGmv" :todayNormal="todaynormalGmv" :todayUser="todayUser" :changeNormal="changeNormal" />
    
  </div>
  <!--中间表格部分-->
  <div class="dashboard_table">
    <overviewTable :payData="payData" :payTableAttrData="payTableAttrData" :gmvData="gmvData" :gmvTableAttrData="gmvTableAttrData" :newUserData="newUserData" :newUserTableAttrData="newUserTableAttrData"/>
    <div class="chart_hour">
    <el-card class="box-card">
        <div slot="header" class="clearfix" style="display: flex;justify-content: space-between;">
            <span style="font-size:20px;font-weight:900;line-height:46px">小时增长 {{todayTime1}}</span>
            <el-button-group style="padding: 3px 0">
                <el-button   v-for="(item,index) in checkButton" :key="index" class="btn" :class="{'isactive':isChange === index}" @click="typeClick(index,item.value)">{{item.name}}</el-button>
                
            </el-button-group>
        </div>
         <chartView @changeValue="changeValue1" :watchTypeChange="changeType" :checkValue="changeName" :lineData="hoursLineData" :barData="hoursBarData"/>
        </el-card>
    </div>
  </div>
  <div class="product">
  <productTop :myData="myData" :thData="thData" @topChange="topChange"/>
  </div>
  
  <!--增长趋势-->
  <div class="build_up">
    <buildUp @on-build-up="getBuildUP" :originData="buildUpData" :pieData="gmvPieChart" :pieData1="salePieChart"/>
  </div>
  <div class="sale_all">
    <saleAll  :yearSales="yearSales" :yearGmv="yearGmv" @on-set-sale="setSale"/>
  </div>
  <!--最后部分-->
  <div class="last_module">
    <lastModule  :countryData="countryData" :allNum="allNum" :allCountryData="allCountryData" @on-country-data="setCountryData"/>
  </div>
  </div>
</template>
<script src="../../js/dashboard/hometest.js"></script>
<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  height: 95vh;
  width: 100%;
  background-position: center;
  .isactive {
    color: #409eff!important;
    background: #ecf5ff!important;
    border-color: #b3d8ff!important;
  }
  .btn{
      background: #FFF;
      border: 1px solid #DCDFE6;
      color: #606266;
  }
  .mar-t-40{
    margin-top: 40px;
  }
  .item-box{
    width: 100%;
    ul{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      border: 1px solid #EBEEF5;
      border-right: 0;
      border-bottom: 0;
      padding: 0;
      li{
        list-style: none;
        color: #444;
        font-size: 14px;
        width: 50%;
        div{
          width: 100%;
          box-sizing: border-box;
          padding: 15px 0;
          text-align: center;
          border-bottom: 1px solid #EBEEF5;
          border-right: 1px solid #EBEEF5;
        }
      }
      .list-header{
        width: 100%;
        text-align: center;
        font-weight: 800;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        border-right: 1px solid #EBEEF5;
        border-bottom: 1px solid #EBEEF5;
      }
    }
  }
  .app-item-box{
    display: block;
  }
  .list-item-box{
    width: 100%;
    padding: 0;
    display: none;
  }
  @media screen and (min-width:700px){
    .item-box{
      ul{
        li{
          flex: 1;
        }
      }
    }
    .app-item-box{
      display: none;
    }
    .list-item-box{
      display: block;
    }
  }
  .order-statics-wrapper{
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0;
    margin-top: 20px;
    li{
      margin-bottom: 20px;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      border-radius: 4px;
      border: 1px solid #ebeef5;
      background-color: #fff;
      overflow: hidden;
      color: #303133;
      font-weight: bolder;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: 30px;
      font-size: 18px;
      line-height: 24px;
      .l{
        margin-right: 10px;
        i{
         font-size: 30px;
          color: #555;
          font-weight: normal;
        }
      }
      .r{
        box-sizing: border-box;
        padding-right: 50px;
        div:nth-child(1){
          color: #444;
          font-weight: normal;
          font-size: 14px;
        }
      }
    }
  }
  .user-statics-wrapper{
    list-style: none;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-sizing: border-box;
    padding: 40px 0;
    color: #303133;
    font-size: 14px;
    line-height: 24px;
    b{
      font-size: 18px;
    }
  }
  .chart-wrapper{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    .total-box{
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 18px;
    }
  }
  .user-wrapper{
    flex-wrap: wrap;
    position: relative;
  }
  .item-content-wrapper{
    border: 1px solid #DCDFE6;
    margin-top: 30px;
    padding: 0;
    .header-box{
      height: 70px;
      box-sizing: border-box;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f5f7fa;
      h5{
        font-size: 20px;
      }
    }
      #hourRegisterChart {
          height: 340px;
      }
    .content-wrapper{
      box-sizing: border-box;
      padding: 20px;
      .statistics-wrapper{
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        margin-top: 50px;
        li{
          margin-bottom: 20px;
          margin-right: 20px;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
          border-radius: 4px;
          border: 1px solid #ebeef5;
          background-color: #fff;
          overflow: hidden;
          color: #303133;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          padding: 20px 30px;
          font-size: 14px;
          line-height: 24px;
          b{
           font-size: 18px;
          }
        }
      }
    }
  }
  .form-item{
    margin-right: 100px;
    border-bottom: 1px solid #EBEEF5;
    .label-item{
       min-width: 100px;
    }
  }
  &-container {
    margin: 30px;
  }
  /deep/ .el-card__header{
        padding:10px 20px;
        overflow:scroll;
    }
}
</style>
