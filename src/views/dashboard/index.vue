<style>
  .echarts{
    width: 100%;
    max-width: 800px;
  }
</style>
<template>
  <div class="dashboard app-container">
  <!--<div class="dashboard_header">
    <overviewHeader :todayGiftGmv="todayGiftGmv" :todayNormal="todaynormal" :todayUser="todayUser" :changeNormal="changeNormal" />
    
  </div>
  <!--中间表格部分-->
  <!--<div class="dashboard_table">
    <overviewTable :payData="payData" :payTableAttrData="payTableAttrData" :gmvData="gmvData" :gmvTableAttrData="gmvTableAttrData" :newUserData="newUserData" :newUserTableAttrData="newUserTableAttrData"/>
    <div class="chart_hour">
    <el-card class="box-card">
        <div slot="header" class="clearfix" style="display: flex;justify-content: space-between;">
            <span style="font-size:20px;font-weight:900;line-height:46px">小时增长 {{todayTime}}</span>
            <el-button-group style="padding: 3px 0">
                <el-button   v-for="(item,index) in checkButton" class="btn" :class="{'isactive':isChange === index}" @click="typeClick(index,item.value)">{{item.name}}</el-button>
                
            </el-button-group>
        </div>
         <chartView @changeValue="changeValue1" :watchTypeChange="changeType" :checkValue="changeName" :lineData="hoursLineData" :barData="hoursBarData"/>
        </el-card>
    </div>
  </div>
  <div class="product">
  <productTop :myData="myData" :thData="thData" @topChange="topChange"/>
  </div>-->
      <div class="app-item-box">
          <div class="item-box">
              <ul v-for="(item, index) in orderDataList"
                  :key="index">
                  <li class="list-header">{{ getPropName(item.code) }}</li>
                  <li>
                      <div>普通商品订单</div>
                      <div>{{ item.ordinaryOrderNum }} ({{ item.wholesaleOrderNum || 0 }})</div>
                  </li>
                  <li>
                      <div>普通商品成交额（$）</div>
                      <div> {{ item.ordinaryOrderAmount || 0 }}({{ item.wholesaleOrderAmount || 0 }})</div>
                  </li>
                  <li>
                      <div>普通商品客单价（$）</div>
                      <div>{{ item.perCustomerTransaction }}</div>
                  </li>
                  <li>
                      <div>普通商品成交额占比</div>
                      <div> {{ item.ordinaryOrderAmountRate  || 0}}% ({{ ((item.wholesaleOrderAmount / item.totalOrderAmount) * 100).toFixed(2)  }}%)</div>
                  </li>
                  <li>
                      <div>礼包订单</div>
                      <div> {{ (item.giftOrderNum || 0) }} （{{ item.superGiftOrderNum || 0 }}）</div>
                  </li>
                  <li>
                      <div>成交额（$）</div>
                      <div>  {{ item.totalOrderAmount || 0 }}</div>
                  </li>
              </ul>
          </div>
      </div>
      <div class="list-item-box">
          <el-table
              :data="orderDataList"
              border>
              <el-table-column width="50px">
                  <template slot-scope="scope">
                      {{ getPropName(scope.row.code) }}
                  </template>
              </el-table-column>
              <el-table-column
                  min-width="140px"
                  prop="ordinaryOrderNum"
                  label="普通商品订单">
                  <template slot-scope="scope">
                      {{ (scope.row.ordinaryOrderNum || 0) }} （{{ scope.row.wholesaleOrderNum || 0 }}）
                  </template>
              </el-table-column>
              <el-table-column
                  min-width="140px"
                  label="礼包订单">
                  <template slot-scope="scope">
                      {{ (scope.row.giftOrderNum || 0) }} （{{ scope.row.superGiftOrderNum || 0 }}）
                  </template>
              </el-table-column>
              <el-table-column
                  prop="totalOrderAmount"
                  min-width="120px"
                  label="成交额（$）">
                  <template slot-scope="scope">
                      {{ scope.row.totalOrderAmount || 0 }}
                  </template>
              </el-table-column>
              <el-table-column
                  prop="ordinaryOrderAmount"
                  min-width="180px"
                  label="普通商品成交额 $(代购) (客单价)">
                  <template slot-scope="scope">
                      {{ scope.row.ordinaryOrderAmount || 0 }} ( {{ scope.row.wholesaleOrderAmount || 0 }} ), ( {{ scope.row.perCustomerTransaction  }} )
                  </template>
              </el-table-column>
              <el-table-column
                  min-width="180px"
                  label="普通商品成交额占比">
                  <template slot-scope="scope">
                      {{ scope.row.ordinaryOrderAmountRate  || 0}}% ( {{ ((scope.row.wholesaleOrderAmount / scope.row.totalOrderAmount) * 100).toFixed(2) }}%)
                  </template>
              </el-table-column>
          </el-table>
      </div>
      <div>
          <ul v-if="Object.keys(orderStatistics).length > 0" class="order-statics-wrapper">
              <li>
                  <div class="l">
                      <i class="iconfont">&#xe612;</i>
                  </div>
                  <div class="r">
                      <div>总交易额（$）</div>
                      <div>{{ orderStatistics.tradeAmount || 0 }}</div>
                  </div>
              </li>
              <li>
                  <div class="l">
                      <i class="iconfont">&#xe8bc;</i>
                  </div>
                  <div class="r">
                      <div>总订单量（笔)</div>
                      <div>{{ orderStatistics.orderCount  || 0}}</div>
                  </div>
              </li>
              <li>
                  <div class="l">
                      <i class="iconfont">&#xe673;</i>
                  </div>
                  <div class="r">
                      <div>总用户数（人）</div>
                      <div>{{ orderStatistics.userCount || 0 }}</div>
                  </div>
              </li>
              <li>
                  <div class="l">
                      <i class="iconfont">&#xe605;</i>
                  </div>
                  <div class="r">
                      <div>总商品数（件）</div>
                      <div>{{ orderStatistics.productCount  || 0}}</div>
                  </div>
              </li>
          </ul>
      </div>
      <div class="item-content-wrapper">
          <div class="header-box">
              <h5>平台订单状态</h5>
              <el-date-picker
                  v-model="orderStatusTimeList"
                  @change="getOrderStatus"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="订单开始日期"
                  end-placeholder="订单结束日期"
                  :picker-options="pickerOptions">
              </el-date-picker>
          </div>
          <div class="content-wrapper">
              <el-form label-width="150px"
                       label-position="left"
                       :inline="true"
                       v-if="Object.keys(orderStatusInfo).length > 0">
                  <el-form-item label="待付款订单" class="form-item">
                      <div class="label-item">{{ orderStatusInfo.toPayOrderNum || 0}}</div>
                  </el-form-item>
                  <el-form-item label="已发货订单" class="form-item">
                      <div class="label-item">{{ orderStatusInfo.toReceiveOrderNum || 0}}</div>
                  </el-form-item>
                  <el-form-item label="订单退款申请" class="form-item">
                      <div class="label-item">{{ orderStatusInfo.afterSalesOrderNum|| 0 }}</div>
                  </el-form-item>
                  <el-form-item label="待发货订单" class="form-item">
                      <div class="label-item">{{ orderStatusInfo.toShipOrderNum || 0}}</div>
                  </el-form-item>
                  <el-form-item label="已完成订单" class="form-item">
                      <div class="label-item">{{ orderStatusInfo.completedOrderNum || 0}}</div>
                  </el-form-item>
                  <el-form-item label="已关闭订单" class="form-item">
                      <div class="label-item">{{ orderStatusInfo.closedOrderNum || 0}}</div>
                  </el-form-item>
              </el-form>
          </div>
      </div>
      <div class="item-content-wrapper">
          <div class="header-box">
              <h5>今日注册及PS数</h5>
          </div>
          <div class="content-wrapper">
              <div id="hourRegisterChart" ></div>
          </div>
      </div>
      <div class="item-content-wrapper">
          <div class="header-box">
              <h5>订单交易数统计</h5>
              <el-date-picker
                  v-model="orderTimeList"
                  @change="getOrderTrade"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="订单开始日期"
                  end-placeholder="订单结束日期"
                  :picker-options="pickerOptions">
              </el-date-picker>
          </div>
          <div class="content-wrapper">
              <ul v-if="Object.keys(OrderTradeChartCountList).length > 0" class="statistics-wrapper">
                  <li>
                      <div>本月订单交易总数</div>
                      <div><b>{{ OrderTradeChartCountList.monthCount|| 0}}</b> 笔</div>
                      <div>上月 <b>{{ OrderTradeChartCountList.lastMonthCount|| 0 }}</b></div>
                  </li>
                  <li>
                      <div>本周订单交易总数</div>
                      <div><b>{{ OrderTradeChartCountList.weekCount || 0 }}</b> 笔</div>
                      <div>上周 <b>{{ OrderTradeChartCountList.lastWeekCount|| 0 }}</b></div>
                  </li>
                  <li>
                      <div>本月交易额总数</div>
                      <div>$ <b>{{ OrderTradeChartCountList.monthAmount || 0  }}</b></div>
                      <div>上月 <b>{{ OrderTradeChartCountList.lastMonthAmount || 0  }}</b></div>
                  <li>
                      <div>本周交易额总数</div>
                      <div>$ <b>{{ OrderTradeChartCountList.weekAmount || 0 }}</b></div>
                      <div>上周 <b>{{ OrderTradeChartCountList.lastWeekAmount || 0  }}</b></div>
                  </li>
              </ul>
              <v-chart v-if="polar1.ready"
                       id="chart1"
                       :autoresize="true"
                       :options="polar1"/>
          </div>
      </div>
      <div class="item-content-wrapper">
          <div class="header-box">
              <h5>商品信息统计</h5>
          </div>
          <div class="content-wrapper">
              <el-form label-width="150px"
                       label-position="left"
                       :inline="true"
                       v-if="Object.keys(productInfo).length > 0">
                  <el-form-item label="在架普通商品" class="form-item">
                      <div class="label-item">{{ productInfo.spu|| 0 }}</div>
                  </el-form-item>
                  <el-form-item label="在架礼包" class="form-item">
                      <div class="label-item">{{ productInfo.giftSpu || 0}}</div>
                  </el-form-item>
                  <el-form-item label="今日上架" class="form-item">
                      <div class="label-item">{{ productInfo.todaySpu || 0}}</div>
                  </el-form-item>
                  <el-form-item label="本周上架" class="form-item">
                      <div class="label-item">{{ productInfo.weekSpu || 0}}</div>
                  </el-form-item>
                  <el-form-item label="本月上架" class="form-item">
                      <div class="label-item">{{ productInfo.monthSpu || 0}}</div>
                  </el-form-item>
                  <el-form-item label="已下架" class="form-item">
                      <div class="label-item">{{ productInfo.offShelfSpu || 0}}</div>
                  </el-form-item>
              </el-form>
          </div>
      </div>
      <div class="item-content-wrapper">
          <div class="header-box">
              <h5>用户动态</h5>
              <el-date-picker
                  v-model="userTimeList"
                  @change="getUserChartData"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  align="right"
                  unlink-panels
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  :picker-options="pickerOptions">
              </el-date-picker>
          </div>
          <div class="content-wrapper">
              <div class="flex user-wrapper">
                  <ul v-if="Object.keys(userStatistics).length > 0"
                      class="user-statics-wrapper">
                      <li>
                          <div>本月新增用户总数</div>
                          <div><b>{{ userStatistics.monthCount|| 0}}</b></div>
                          <div>上月<b>{{ userStatistics.lastMonthCount|| 0}}</b></div>
                      </li>
                      <li>
                          <div>本周新增用户总数</div>
                          <div><b>{{ userStatistics.weekCount|| 0}}</b></div>
                          <div>上周<b>{{ userStatistics.lastWeekCount|| 0}}</b></div>
                      </li>
                  </ul>
                  <v-chart v-if="polar3.ready"
                           class="flex1"
                           :autoresize="true"
                           :options="polar3"/>
                  <div class="chart-wrapper flex1"
                       v-if="polar2.ready">
                      <v-chart :autoresize="true"
                               :options="polar2"/>
                      <div class="total-box">
                          <div>总用户</div>
                          <div class="mar-t-10">{{ userStatistics.totalCount|| 0 }} 人</div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>
<script src="../../js/dashboard/home.js"></script>
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
    }
}
</style>
