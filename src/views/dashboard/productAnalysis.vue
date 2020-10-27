<template>
  <div class="dashboard app-container">
    <div class="analysis_top">
      <SystemNotice :notice="notice" v-if="notice"></SystemNotice>
      <!--普获分析-->
      <normalAnalysis
        :generalProductData="generalProductData"
        :generalGmvData="generalGmvData"
        :generalProductType="generalProductType"
        @on-search-general="searchGeneralData"
        :loading="generalload"
      ></normalAnalysis>
      <!--商品趋势解析-->
      <productAnalysis
        @on-build-up="getBuildUP"
        :originData="buildUpData"
        :pieData="gmvPieChart"
        :pieData1="salePieChart"
        :cateList="cateList"
      ></productAnalysis>
      <!--商品销售详情-->
      <productSealDetail
        :productSaleTableData="productSaleTableData"
        :total="productSaleTotal"
        :activeList="activeList"
        @on-build-up="setProductSaleTable"
        :exportFile="commonExport"
        @clear-data="clearData"
         
      ></productSealDetail>
      <!--商品成本分析-->
      <!-- <productCostAnalysis></productCostAnalysis> -->
      <!--商品成本分析-->
      <supplyMarketingAnalysis
        :supplyMarketTableData="supplyMarketTableData"
        @on-reset-search="resetSearchUnit"
        :cateList="cateList"
      ></supplyMarketingAnalysis>
    </div>
  </div>
</template>

<script>
import normalAnalysis from "./analysisComponents/normalAnalysis";
import productAnalysis from "./analysisComponents/productAnalysis";
import productSealDetail from "./analysisComponents/productSaleDetail";
import productCostAnalysis from "./analysisComponents/productCostAnalysis";
import supplyMarketingAnalysis from "./analysisComponents/supplyMarketingAnalysis";
import SystemNotice from './analysisComponents/messageScroll'
import {
  OverviewTrendGrap,
  OrdinaryProductAnalysis,
  ProductTrendAnalysis,
  ProductSalesDetail,
  GetBackendLevelOneCategory,
  PriceBrandAnalysis,
  ProductAnalysisBroadcast
} from "@/request/dataV";
import { RouteAndExport } from "@/request/fileCenter";
import { categoryListGet } from "@/request/product";
export default {
  name: "",
  components: {
    normalAnalysis,
    productAnalysis,
    productSealDetail,
    productCostAnalysis,
    supplyMarketingAnalysis,
    SystemNotice
  },
  data() {
    return {
      notice:'',
      cateList:[
        { cateId:'all',
          cateName:'全部'
        }
      ],
      buildValue: [
        new Date(new Date().toLocaleDateString()).getTime() -
          24 * 60 * 60 * 1000 * 13 -
          1,
        new Date(new Date().toLocaleDateString()).getTime() -
          24 * 60 * 60 * 1000
      ],
      //普货数据
      generalload: true,
      generalProductType: [],
      generalProductData: [],
      generalGmvData: [],
      generalProduct: {
        countryCode: "All",
        date:
          new Date(new Date().toLocaleDateString()).getTime(),
        type: 0
      },
      //增长趋势数据
      upParsing: {
        dateTime: [
          new Date(new Date().toLocaleDateString()).getTime() -
            24 * 60 * 60 * 1000 * 14 +
            1,
          new Date(new Date().toLocaleDateString()).getTime() -
            24 * 60 * 60 * 1000
        ],
        countryCode: "All",
        graphType: "1",
        cateOneId: "All"
      },
      buildUpData: {
        xAxis: [],
        normalData: [],
        axle: []
      },
      gmvPieChart: [],
      salePieChart: [],
      //商品销售详情
      isFirstReq: 1, //记录是不是第一次请求
      formData: {
        dateTime: [
          new Date(new Date().toLocaleDateString()).getTime() -
            24 * 60 * 60 * 1000 * 7,
          new Date(new Date().toLocaleDateString()).getTime() -
            24 * 60 * 60 * 1000
        ],
        cateId: "",
        page: {
          pageSize: 10,
          pageNum: 1
        },
        cateLevel: 0, //等级
        order: "desc", //排序
        olderField: "", //排序字段
        activityType: "", //活动类型
        countryCode: "All"
      },
      productSaleTableData: [],
      productSaleTotal: 0,
      activeList: [], //活动类型
      //商品价格带
      supplyMarkForm: {
        dateTime:new Date(new Date().toLocaleDateString()).getTime() -
        24 * 60 * 60 * 1000,
        cateId: "all",
        countryCode: "MY",
        cateName:'全部'
      },
      supplyMarketTableData: [
        {
            cateOneName: "全部",
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "0-5",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },{
            cateOneName: "全部",
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "5-10",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },{
            cateOneName: "全部",
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "10-20",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },
          {
            cateOneName: "全部",
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "20-50",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },
          {
            cateOneName: "全部",
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "50-80",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },
          {
            cateOneName: "全部",
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "80-120",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },
          {
            cateOneName: "全部",
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "120-150",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },
          {
            cateOneName: "全部",
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "150-200",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },
          {
            cateOneName: "全部",
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "200-300",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          }
      ]
    };
  },
  computed: {},
  watch: {
    'supplyMarkForm.countryCode':{
      handler(newVal,old){},
      deep:true
    }
  },
  mounted() {
    this.getOverviewTrendGrap();
    this.getOrdinaryProductAnalysis();
    this.getProductSalesDetail();
    // this.getBackendLevelOneCategory()
    this.getPriceBrandAnalysis()
    //只获得一级类目
     this.fetchCategory({
      level: 1,
      cateType: 2,
      resolve: data => {
        // this.backCategoryOptions = data;
        this.cateList = [...this.cateList,...data]
      }
    });
    this.getProductAnalysisBroadcast()
  },
  methods: {
    getProductAnalysisBroadcast(){
      ProductAnalysisBroadcast({}).then(res=>{
        if(res.ret.errcode==1){
          console.log('消息提示',res)
          this.notice = res.message
        }
      })
    },
    //获取一级类目
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
    getBackendLevelOneCategory(){
      GetBackendLevelOneCategory({}).then(res=>{
        if(res.ret.errcode==1){
          this.cateList = [...this.cateList,...JSON.parse(res.categoryInfo)]
        }
      })
    },
    //普货分析页面传来数据
    searchGeneralData(data) {
      this.generalProduct = Object.assign(this.generalProduct, data);
      this.getOrdinaryProductAnalysis();
    },
    //普货分析处理
    getOrdinaryProductAnalysis() {
      var params = {
        countryCode: this.generalProduct.countryCode,
        date: this.generalProduct.date.toString(),
        type: this.generalProduct.type.toString()
      };
      this.generalload = true;
      OrdinaryProductAnalysis(params)
        .then(resultes => {
          if (resultes.ret.errcode == 1) {
            this.generalProductData = resultes.soldNumRanking;
            this.generalGmvData = resultes.gmvRanking;
            this.generalload = false;
            if (resultes.boardData && resultes.boardData.length != 0) {
              this.generalProductType = resultes.boardData;
            }
          }
        })
        .catch(error => {
          setTimeout(() => {
            this.generalload = false;
          }, 2000);
        });
    },
    //增长趋势解析图表处理
    getBuildUP(data) {
      (this.upParsing.dateTime = data.dateTime),
        (this.upParsing.countryCode = data.countryCode);
      this.upParsing.graphType = data.graphType;
      this.upParsing.cateOneId = data.cateOneId;
      this.getOverviewTrendGrap();
    },
    getOverviewTrendGrap() {
      var params = {
        startTime: this.upParsing.dateTime[0].toString(),
        endTime: this.upParsing.dateTime[1].toString(),
        countryCode: this.upParsing.countryCode,
        graphType: this.upParsing.graphType,
        cateOneId: String(this.upParsing.cateOneId)
      };
      ProductTrendAnalysis(params).then(res => {
        if (res.ret.errcode == 1) {
          //前面折线图统一处理
          if (this.upParsing.graphType != 5) {
            var xAxis = [];
            var axle = [];
            var yAixs = [];
            _.forEach(res.graph, item => {
              xAxis.push({
                name: item.type,
                isShow: item.visible
              });
              _.forEach(item.point, child => {
                child.tag = child.tag.substr(0, 10);
                child.value = child.volume;
              });
              yAixs.push(item.point);
            });
            _.forEach(res.graph[0].point, xline => {
              xline.tag = xline.tag.substr(0, 10);
              axle.push(xline.tag);
            });
            this.buildUpData = {
              xAxis: xAxis,
              normalData: yAixs,
              axle: axle
            };
          } else {
            //后面两个饼图分开处理
            var gmvPieChart = [],
              salePieChart = [];
            _.forEach(res.chart, item => {
              if (item.type == "支付GMV") {
                item.slice.map(child => {
                  child.name = child.tag;
                  child.value = Number(child.volume);
                  gmvPieChart.push(child);
                });
              } else {
                item.slice.map(child => {
                  child.name = child.tag;
                  child.value = Number(child.volume);
                  salePieChart.push(child);
                });
              }
            });
            this.salePieChart = salePieChart;
            this.gmvPieChart = gmvPieChart;
          }
        }
      });
    },
    clearData(data){
      this.productSaleTableData = []
      this.productSaleTotal= 0
    },
    //商品销售详情
    getProductSalesDetail() {
      
      var params = Object.assign(this.formData, {});
      params.startTime = String(params.dateTime[0]);
      params.endTime = String(params.dateTime[1]);
      ProductSalesDetail(params)
        .then(response => {
          if (response.ret.errcode == 1) {
            this.productSaleTableData = response.detail;
            this.productSaleTotal = Number(response.total);
            if (this.isFirstReq == 1) {
              this.activeList = response.types;
            }
            this.isFirstReq++;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    //商品销售详情页面传参
    setProductSaleTable(data) {
      this.formData = Object.assign(this.formData, data);
      this.getProductSalesDetail();
    },
    //导出接口
    commonExport(params) {
      RouteAndExport({
        type: 2,
        param: JSON.stringify(params)
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
    //商品价格带分析
    resetSearchUnit(data) {
      _.forEach(data,(value,key)=>{
        this.supplyMarkForm[key] = value
      })
      if(this.supplyMarkForm.countryCode=='MY'){
        this.supplyMarketTableData=[{
            cateOneName: this.supplyMarkForm.cateName,
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "0-5",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },{
            cateOneName: this.supplyMarkForm.cateName,
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "5-10",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },{
            cateOneName: this.supplyMarkForm.cateName,
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "10-20",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },
          {
            cateOneName: this.supplyMarkForm.cateName,
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "20-50",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },
          {
            cateOneName: this.supplyMarkForm.cateName,
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "50-80",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },
          {
            cateOneName: this.supplyMarkForm.cateName,
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "80-120",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },
          {
            cateOneName: this.supplyMarkForm.cateName,
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "120-150",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },
          {
            cateOneName: this.supplyMarkForm.cateName,
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "150-200",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },
          {
            cateOneName: this.supplyMarkForm.cateName,
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: "200-300",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },{
            cateOneName: this.supplyMarkForm.cateName,
            currency: "MYR",
            netProfitMargin: "0",
            paidGmv: "0",
            priceRange: ">300",
            rollingSalesRate: "0",
            salesQty: "0",
            soldProductCost: "0",
            soldProductNum: "0",
            stockNum: "0"
          },]
         
      }else if(this.supplyMarkForm.countryCode=='TH'){
        this.supplyMarketTableData=[{
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "0-50",
          currency: "THB",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "50-100",
          currency: "THB",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "100-200",
          currency: "THB",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "200-300",
          currency: "THB",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "300-400",
          currency: "THB",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "400-500",
          currency: "THB",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "500-600",
          currency: "THB",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "600-700",
          currency: "THB",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "700-800",
          currency: "THB",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: ">800",
          currency: "THB",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        }]
      }else{
        this.supplyMarketTableData=[
            {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "0-2",
          currency: "SGD",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "2-5",
          currency: "SGD",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "5-10",
          currency: "SGD",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
         cateOneName: this.supplyMarkForm.cateName,
          priceRange: "10-15",
          currency: "SGD",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "15-20",
          currency: "SGD",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "20-30",
          currency: "SGD",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "30-50",
          currency: "SGD",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "50-10",
          currency: "SGD",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
          cateOneName: this.supplyMarkForm.cateName,
          priceRange: "100-200",
          currency: "SGD",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        },
        {
         cateOneName: this.supplyMarkForm.cateName,
          priceRange: ">200",
          currency: "SGD",
          stockNum: 0,
          soldProductNum: 0,
          rollingSalesRate: "0%",
          salesQty: 0,
          paidGmv: 0,
          soldProductCost: 0,
          netProfitMargin: "0%"
        }
          ]
      }
      this.getPriceBrandAnalysis()
    },
    getPriceBrandAnalysis(){
      var params={
        cateOneId:this.supplyMarkForm.cateId,
        date:this.supplyMarkForm.dateTime.toString(),
        countryCode:this.supplyMarkForm.countryCode
      }
       PriceBrandAnalysis(params).then(res=>{
         if(res.ret.errcode==1){
           _.forEach(res.info,item=>{
             _.forEach(this.supplyMarketTableData,oldVal=>{
               if(item.priceRange==oldVal.priceRange){
                 _.forEach(item,(value,key)=>{
                   if(item[key]!=''){
                     oldVal[key] = value
                   }  
                 })
               }
             })
           })
         }
       }).catch(error=>{
         console.log(error)
       })
    }
   
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-form-item__content {
  line-height: 1;
}
</style>
