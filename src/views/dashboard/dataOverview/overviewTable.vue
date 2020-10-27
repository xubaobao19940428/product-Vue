<template>
  <div class="overview_table">
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span style="font-size:20px;font-weight:900;line-height:46px">今日数据 {{todayTime}}</span>
        </div>
        <div class="all_table">
        <div class="table1">
        <p class="table_title">支付订单数(<span style="font-size:14px;">客单价($)</span>)</p>
            <el-table
                :data="payData.slice(0,payData.length-1)"
                max-height="250"
                fit
                :summary-method="getSummaries"
                show-summary
                :cell-class-name="changeCellStyle"
                style="width: 100%; margin-top: 20px;text-align:center">
                <el-table-column
                v-for="(item,index) in payTableAttrData"
                :label="item.name"
                :key="index"
                :prop="item.value"
                align="center"
                :fixed="item.fixed">
                <template slot-scope="scope">
                    <div v-if="item.value=='rowName'">
                        <span>{{scope.row.rowName}}</span>
                    </div>
                    <div v-if="item.value=='myData'">
                        <span>{{scope.row.myData}}</span>
                    </div>
                    <div v-if="item.value=='sgData'">
                        <span>{{scope.row.sgData}}</span>
                    </div>
                    <div v-if="item.value=='thData'">
                        <span>{{scope.row.thData}}</span>
                    </div>
                    <div v-if="item.value=='totalData'">
                        <span>{{scope.row.totalData}}</span>
                    </div>
                </template>
                </el-table-column>
            </el-table>
        </div>
            <div class="table1">
        <p class="table_title">支付GMV($)</p>
           <el-table
                :data="gmvData.slice(0,gmvData.length-1)"
                max-height="250"
                :summary-method="getSummaries1"
                show-summary
                :cell-class-name="changeCellStyle"
                style="width: 100%; margin-top: 20px;text-align:center">
                <el-table-column
                v-for="(item,index) in gmvTableAttrData"
                :label="item.name"
                :key="index"
                :prop="item.value"
                align="center"
                :fixed="item.fixed">
                <template slot-scope="scope" :class="scope.row.value=='合计'?'el-table__footer-wrapper':''">
                    <div v-if="item.value=='rowName'">
                        <span>{{scope.row.rowName}}</span>
                    </div>
                    <div v-if="item.value=='myData'">
                        <span>{{scope.row.myData}}</span>
                    </div>
                    <div v-if="item.value=='sgData'">
                        <span>{{scope.row.sgData}}</span>
                    </div>
                    <div v-if="item.value=='thData'">
                        <span>{{scope.row.thData}}</span>
                    </div>
                    <div v-if="item.value=='totalData'">
                        <span>{{scope.row.totalData}}</span>
                    </div>
                </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="table1">
        <p class="table_title">新注册用户数(人)</p>
           <el-table
                :data="newUserData.slice(0,newUserData.length-1)"
                max-height="250"
                :summary-method="getSummaries2"
                show-summary
                :cell-class-name="changeCellStyle"
                style="width: 100%; margin-top: 20px;text-align:center">
                <el-table-column
                v-for="(item,index) in newUserTableAttrData"
                :label="item.name"
                :key="index"
                :prop="item.value"
                align="center"
                :fixed="item.fixed">
                <template slot-scope="scope" :class="scope.row.value=='合计'?'el-table__footer-wrapper':''">
                    <div v-if="item.value=='rowName'">
                        <span>{{scope.row.rowName}}</span>
                    </div>
                    <div v-if="item.value=='myData'" class="table_right">
                        <span>{{scope.row.myData}}</span>
                    </div>
                    <div v-if="item.value=='sgData'" class="table_right">
                        <span>{{scope.row.sgData}}</span>
                    </div>
                    <div v-if="item.value=='thData'" class="table_right">
                        <span>{{scope.row.thData}}</span>
                    </div>
                    <div v-if="item.value=='totalData'" class="table_right">
                        <span>{{scope.row.totalData}}</span>
                    </div>
                </template>
                </el-table-column>
            </el-table>
        </div>
        </div>

        </el-card>
  </div>
</template>

<script>
export default {
  name: 'overviewTable',
  props:{
      payData:{
          type:Array,
          default:()=>{
              return [
                  {rowName:'11'}
              ]
          }
      },
      payTableAttrData:{
          type:Array,
          default:()=>{
              return [{lable: '商品ID',
            name: '商品ID',
            value: 'rowName',
            minWidth: 180,
            fixed:false,}]
          }
      },
      gmvData:{
          type:Array,
          default:()=>{
              return [
                  {rowName:'11'}
              ]
          }
      },
      gmvTableAttrData:{
          type:Array,
          default:()=>{
              return [{lable: '商品ID',
            name: '商品ID',
            value: 'rowName',
            minWidth: 180,
            fixed:false,}]
          }
      },
      newUserData:{
          type:Array,
          default:()=>{
              return [
                  {rowName:'11'}
              ]
          }
      },
      newUserTableAttrData:{
          type:Array,
          default:()=>{
              return [{lable: '商品ID',
            name: '商品ID',
            value: 'rowName',
            minWidth: 180,
            fixed:false,}]
          }
      }
  },
  watch:{
      payData:{
          handler(newVal,oldVal){
              console.log(newVal)
          },
          deep:true
      }
  },
  data() {
    return {
        tableData: [{
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        }, {
          id: '12987123',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        }, {
          id: '12987124',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        }, {
          id: '12987125',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        }, {
          id: '12987126',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }],
        todayTime:''
    };
  },
  computed:{
  },
  watch:{
  },
  mounted(){
      this.getTodayTime()
  },
  methods: {
      changeCellStyle({row, column, rowIndex, columnIndex}) {
      //第八列添加 red 类

        if(columnIndex == 4){
          return 'fontb'
        }
        //某一行其中的一个变量applies值如果大于0，并且在第六列，即确定一个具体的单元格需要确定行和列

       },
      getTodayTime(){
        var todayTime = new Date()
        var Y = todayTime.getFullYear()
        var M = todayTime.getMonth()
        var D = todayTime.getDate()
        if(M<10){
            M='0'+(M+1)
        }
        if(D<10){
            D='0'+D
        }
        this.todayTime = Y+'/'+M+'/'+D
      },
      getSummaries(param) {
        const { columns, data } = param;

        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }else if(index==1){
              sums[index]=this.payData[this.payData.length-1].myData
              return;
          }else if(index==2){
               sums[index]=this.payData[this.payData.length-1].thData
              return;
          }else if(index==3){
               sums[index]=this.payData[this.payData.length-1].sgData
              return;
          }else if(index==4){
               sums[index]=this.payData[this.payData.length-1].totalData
              return;
          }
        });

        return sums;
      },
      getSummaries1(param) {
        const { columns, data } = param;

        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }else if(index==1){
              sums[index]=this.gmvData[this.gmvData.length-1].myData
              return;
          }else if(index==2){
               sums[index]=this.gmvData[this.gmvData.length-1].thData
              return;
          }else if(index==3){
               sums[index]=this.gmvData[this.gmvData.length-1].sgData
              return;
          }else if(index==4){
               sums[index]=this.gmvData[this.gmvData.length-1].totalData
              return;
          }
        });

        return sums;
      },
      getSummaries2(param) {
        const { columns, data } = param;

        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '整站';
            return;
          }else if(index==1){
              sums[index]=this.newUserData[this.newUserData.length-1].myData
              return;
          }else if(index==2){
               sums[index]=this.newUserData[this.newUserData.length-1].thData
              return;
          }else if(index==3){
               sums[index]=this.newUserData[this.newUserData.length-1].sgData
              return;
          }else if(index==4){
               sums[index]=this.newUserData[this.newUserData.length-1].totalData
              return;
          }
        });

        return sums;
      }
  },
};
</script>

<style lang="scss" scoped>
.overview_table{
    width:100%;
    height:auto;
    margin-bottom:20px;
    .all_table{
        display:flex;
        justify-content: space-between;
        flex-wrap:wrap;
        .table1{
            width:49%;
            border: 1px solid #dddddd;
            padding:10px;
            .table_title{
                font-weight: 400;
                font-style: normal;
                font-size: 16px;
                color: rgba(85, 85, 85, 0.972549019607843);
                line-height: 30px;
            }
        }
        .table1:nth-child(3){
            margin-top:20px;
        }
    }
    /deep/ .el-table__header th{
            background:#fafafa;
    }
    /deep/ .el-table__fixed-footer-wrapper tbody td{
        background-color:#ffffff;
    }
    /deep/ .el-table__footer-wrapper tbody td{
        background-color:#ffffff;
    }
   /deep/ .fontb{
        font-weight:900;
    }
    /deep/ .el-table__footer-wrapper tbody td{
        font-weight:900
    }
    /deep/ .el-table__fixed-footer-wrapper tbody td{
        font-weight:900
    }
    /deep/ .el-table th:last-child .cell{
        color:#575757;
        font-weight:900;
    }
    /deep/ .el-table__header th{
        height:35px;
    }
    /deep/ .el-table__header tr{
        height:35px
    }

}
</style>
