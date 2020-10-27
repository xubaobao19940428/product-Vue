<template>
  <div class="out-detail">
    <el-dialog title="商品详情" :visible.sync="dialogTableVisible" width="900px">
      <el-table :data="outOrderTableData" border>
        <el-table-column label="出库单相关商品信息" min-width="350px" >
                <template slot-scope="scope">
                    <div class="flex flex-item--center split-order-item" style="height: 100%">
                        <el-popover placement="top-start" trigger="hover">
                            <img :src="dealShowFileSrc(scope.row.skuCover)" class="previewImage">
                            <img :src="dealShowFileSrc(scope.row.skuCover)" class="thumbnail" slot="reference">
                        </el-popover>
                        <div class="block-right">
                            <div>
                                <div class="pointer">商品名称：{{scope.row.nameCn}}</div>
                                <div>skuCode：{{ scope.row.skuCode }}</div>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="规格" align="center" min-width="100px">
                <template slot-scope="scope">
                    <div>{{ scope.row.standardAttr }}</div>
                </template>
            </el-table-column>
            <el-table-column label="品类" align="center" min-width="100px">
                <template slot-scope="scope">
                    <div>
                        <div v-if="scope.row.cateName" v-html="returnCateName(scope.row.cateName)"></div>
                        <div v-else>-</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="出库数量" align="center" min-width="100px">
                <template slot-scope="scope">
                    <div>数量：{{ scope.row.count }}</div>
                </template>
            </el-table-column>
            <el-table-column label="配货数量" align="center" min-width="100px">
                <template slot-scope="scope">
                    <div :class="{prompt:scope.row.count !== scope.row.matchCount}">数量：{{ scope.row.matchCount }}</div>
                </template>
            </el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:20px"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryData.page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totals"
      ></el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { OutOrderNewDetail } from "@/request/warehouse";
export default {
  name: "outOrderDetail",
  props: {
    dialogTableVisible: {
      type: Boolean,
      default: false,
    },
    outNo: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      outOrderTableData: [],
      queryData: {
        outNo: this.outNo,
        page: {
          pageSize: 10,
          pageNum: 1,
        },
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    outOrderDetail(outNo) {
      this.queryData.outNo = outNo;
      OutOrderNewDetail(this.queryData)
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
              this.outOrderTableData = resultes.sku
              this.totals = resultes.total
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleSizeChange(val) {
      this.queryData.page.pageSize = val;
    },
    handleCurrentChange(val) {
      this.queryData.page.pageNum = val;
    },
    returnCateName(cateName){
        var str = ''
        _.forEach(cateName,(item,index)=>{
            if(index<=1){
                str+=`${item}>><br/>`
            }else{
                str+=`${item}`
            }
        })
        return str
    }
  },
};
</script>

<style lang="scss" scoped>
.out-detail {
  .el-dialog__wrapper {
    /deep/ .el-dialog {
      padding-bottom: 20px;
    }
  }
}
</style>
