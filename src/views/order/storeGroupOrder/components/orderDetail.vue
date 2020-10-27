<template>
  <el-dialog title="商品详情" :visible.sync="dialogVisible" width="900px" :before-close="handleClose">
    <el-table v-loading="loading" :data="dataList" style="width: 100%" border>
      <el-table-column label="商品" width="300" align="center">
        <template slot-scope="scope">
          <div class="flex flex-item--center">
            <el-popover placement="top-start" trigger="hover">
              <img :src="dealShowFileSrc(scope.row.productCover)" class="previewImage" />
              <img
                :src="dealShowFileSrc(scope.row.productCover)"
                class="image-box"
                slot="reference"
                style="height:100px;width:100px"
              />
            </el-popover>
            <div>
              <p>SkuCode：{{scope.row.skuCode}}</p>
              <p>{{scope.row.productName}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="规格" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.standardAttr}}</div>
        </template>
      </el-table-column>
      <el-table-column label="Fingo SKU" align="center">
        <template slot-scope="scope">
          <div></div>
        </template>
      </el-table-column>
      <el-table-column label="品类" align="center">
        <template slot-scope="scope">
          <div>{{scope.row.categoryUnit.backCateFirstName}}>></div>
          <div>{{scope.row.categoryUnit.backCateSecondName}}>></div>
          <div>{{scope.row.categoryUnit.backCateThirdName}}</div>
        </template>
      </el-table-column>
      <el-table-column label="销售数量" align="center">
        <template slot-scope="scope">
          <span>数量：{{scope.row.totalCount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价(单元)" align="center">
        <template slot-scope="scope">
          <span></span>
        </template>
      </el-table-column>
    </el-table>
     <div class="pagination-box">
        <el-pagination
          @size-change="handleSizeChanges"
          @current-change="handleCurrentChanges"
          :page-size="queryData.page.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next"
          :total="totals"
        ></el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import _ from "lodash";
import { IncomeProductDetail } from "@/request/warehouse";
export default {
  name: "orderDetail",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      queryData: {
        page: {
          pagingSwitch: true,
          pageSize: 10,
          pageNum: 1,
        },
        incomeNo: "",
      },
      dataList: [],
      totals:0,
    };
  },
  components: {},
  methods: {
    sockInOrderDetailLists(incomeNo) {
      this.queryData.incomeNo = incomeNo;
      IncomeProductDetail(this.queryData)
        .then((response) => {
          if (response.ret.errcode == 1) {
            this.dataList = response.incomeOrderProductDetail;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
     handleSizeChanges(val) {
      this.queryData.page.pageSize = val;
      this.sockInOrderDetailLists(this.queryData.incomeNo)
    },
    handleCurrentChanges(val) {
      this.queryData.page.pageNum = val;
      this.sockInOrderDetailLists(this.queryData.incomeNo)
    },
    handleClose(){
      this.$emit('on-cancel')
    }
  },
};
</script>

<style lang="scss" scoped>
.forward-receive-wrapper {
  .el-form-item {
    margin-bottom: 10px;
  }
}
.box-card {
  margin-bottom: 10px;
}
/deep/ .el-dialog__body{
  padding-bottom:50px;
}
</style>
