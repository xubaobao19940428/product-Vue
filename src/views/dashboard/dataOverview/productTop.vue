<template>
  <div class="product_top">
     <el-card class="box-card">
            <div slot="header" class="clearfix" style="display: flex;justify-content: space-between;">
            <span style="font-size:20px;font-weight:900;line-height:20px">普货商品Top30榜
            <p style="color:#cccccc;font-size:12px">每10分钟更新一次</p>
            </span>
            
            <div>
            <el-date-picker
                    style="margin-right:20px"
                    v-model="productValue"
                    type="daterange"
                    clearable
                    value-format="timestamp"
                    :picker-options="pickerOptions0"
                    range-separator="~"
                    @change="changeTime"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
            <span style="vertical-align: middle;font-size:14px;">排序维度:</span>
            <el-button-group>
            <el-button v-for="(item,index) in checkButton" :key="index" @click="clickType(index,item.value)" class="btn" :class="{'isactive':isChange === index}">
                {{item.name}}
            </el-button>
        </el-button-group>
            </div>
        </div>
        <div class="all_table">
        <div class="table1">
        <p class="table_title">MY</p>
            <el-table
                :data="myData"
                height="230"
                style="width: 100%; text-align:center">
                <el-table-column
                type="index"
                width="40"
                align="center"
                label="排名">
                </el-table-column>
                 <el-table-column
                show-overflow-tooltip
               
                align="center"
                label="商品名称">
                <template slot-scope="scope">
                    <el-tooltip v-if="scope.row.productName" class="item" effect="dark" :content="scope.row.productName" placement="top">
                        <el-link  :underline="false" style="color: #66b1ff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; 400px" @click="proudctDetail(scope.row)">{{ scope.row.productName}}</el-link>
                    </el-tooltip>
                <span v-else>-</span>
               </template>
                </el-table-column>
                <el-table-column
                prop="soldNum"
                align="center"
                width="100"
                label="售出件数">
                </el-table-column>
                <el-table-column
                prop="paidGmv"
                align="center"
                width="100"
                label="支付GMV($)">
                </el-table-column>
            </el-table>
        </div>
            <div class="table1">
             <p class="table_title">TH</p>
            <el-table
                :data="thData"
                height="230"
                style="width: 100%;text-align:center">
                 <el-table-column
                type="index"
                width="40"
                align="center"
                label="排名">
                </el-table-column>
                <el-table-column
                show-overflow-tooltip
                align="center"
                label="商品名称">
                 <template slot-scope="scope">
                    <el-tooltip v-if="scope.row.productName" class="item" effect="dark" :content="scope.row.productName" placement="top">
                        <el-link  :underline="false" style="color: #66b1ff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; 400px" @click="proudctDetail(scope.row)">{{ scope.row.productName}}</el-link>
                    </el-tooltip>
                <span v-else>-</span>
               </template>
                </el-table-column>
                <el-table-column
                prop="soldNum"
                align="center"
                width="100"
                label="售出件数">
                </el-table-column>
                <el-table-column
                prop="paidGmv"
                align="center"
                width="100"
                label="支付GMV($)">
                </el-table-column>
            </el-table>
        </div>
        </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'productTop',
  props:{
      myData:{
          type:Array,
          default:()=>{
              return []
          }
      },
      thData:{
          type:Array,
          default:()=>{
              return []
          }
      }
  },
  data() {
    return {
        productValue:[new Date(new Date().toLocaleDateString()).getTime(),
        new Date(new Date().toLocaleDateString()).getTime()+((24 * 60 * 60 * 1000))-1 ],
        checkButton:[
            {name:'售出件数',value:'1'},
            {name:'支付GMV',value:'2'}
        ],
        isChange:0,
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now()||time.getTime()<Date.now()-8.64e7*7;
          }
        },
        tableData: [],
        topType:'1'
    };
  },
  computed:{
  },
  watch:{
  },
  methods: {
      clickType(index,value){
          this.isChange=index
          this.topType=value
          this.$emit('topChange',{'todayTime':this.productValue,'changeType':this.topType})
      },
      changeTime(value){
          this.$emit('topChange',{'todayTime':this.productValue,'changeType':this.topType})
      },
      proudctDetail(row){
          console.log(row)
          this.$router.push({
              path:'/product/productListNew',
              query:{
                  productId:row.productId
              }
          })
      }
  },
};
</script>

<style lang="scss" scoped>
.product_top{
    width:100%;
    height:400px;
    margin:20px 0;
    .el-card{
        height:100%;
        .el-button-group{
            margin-left:10px;
        }
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
                font-size: 20px;
                color: rgba(85, 85, 85, 0.972549019607843);
                line-height: 30px;
            }
        }
        .table1:nth-child(3){
            margin-top:20px;
        }
    }
    }
    .isactive {
        color: #409eff!important;
        background: #ecf5ff!important;
        border-color: #b3d8ff!important;
        }
    .btn{
        background: #FFF;
        border: 1px solid #DCDFE6;
    }
    /deep/ .el-table__header th{
            background:#fafafa;
    }
    /deep/ .el-card__header{
        padding:10px 20px;
    }
    /deep/ .el-table__header th{
        height:35px;
    }
    /deep/ .el-table__header tr{
        height:35px
    }
}
</style>
