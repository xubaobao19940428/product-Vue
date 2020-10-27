<template>
  <!-- <div> -->
  <el-table
    v-loading="loadingFail"
    :data="tableData"
    height="100%"
    style="width: 100%;overflow-y:scroll"
    ref="tableRef"
    @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55" align="center" :key="Math.random()" fixed="left"></el-table-column>
    <el-table-column label="采购单号" width="200" align="center" fixed="left">
      <template slot-scope="scope">{{ scope.row.purchaseOrderNo }}</template>
    </el-table-column>
    <el-table-column label="第三方订单号" width="200" align="center" v-if="type=='WAIT_PAY_ERROR'">
      <template slot-scope="scope">{{ scope.row.thirdNo }}</template>
    </el-table-column>
    <el-table-column prop="supplierName" label="供应商名称" width="200" align="center"></el-table-column>
    <el-table-column prop="purchaseType" label="采购来源" align="center" width="100"></el-table-column>
    <el-table-column prop="purchaseAmount" label="采购总金额" align="center" width="100"></el-table-column>
    <el-table-column prop="freight" label="运费" align="center" width="100"></el-table-column>
    <el-table-column prop="failReason" label="失败原因" align="center" width="200" :key="Math.random()"></el-table-column>
    <el-table-column label="采购单状态" align="center" width="200">
      <template slot-scope="scope">
        <el-tag
          v-if="scope.row.purchaseOrderStatus === 'WAIT_PURCHASE'"
          effect="dark"
          type="warning"
          size="mini"
        >未采购</el-tag>
        <el-tag v-if="scope.row.purchaseOrderStatus === 'PURCHASED'" effect="dark" size="mini">待发货</el-tag>
        <el-tag v-if="scope.row.purchaseOrderStatus === 'STOCKOUT'" type="danger" size="mini">缺货</el-tag>
        <!--                        <el-tag v-if="scope.row.purchaseOrderStatus === 'PART_SHIPPED'" type="success" size="mini">部分发货</el-tag>-->
        <el-tag
          v-if="scope.row.purchaseOrderStatus === 'SHIPPED'"
          type="success"
          effect="dark"
          size="mini"
        >待入库</el-tag>
        <el-tag v-if="scope.row.purchaseOrderStatus === 'STORAGED'" effect="dark" size="mini">已入库</el-tag>
        <el-tag v-if="scope.row.purchaseOrderStatus === 'CANCLE'" type="info" size="mini">取消</el-tag>
        <el-tag v-if="scope.row.purchaseOrderStatus === 'CANCELED'" type="info" size="mini">已取消</el-tag>
        <div>{{scope.row.externalStatus}}</div>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="采购单创建时间" align="center" width="200"></el-table-column>
    <el-table-column label="整单操作" align="center" fixed="right" width="200">
      <template slot-scope="scope">
        <div class="order-btn-box">
          <!--编辑： 未采购-->
          <el-button
            type="text"
            size="mini"
            @click="openEditDialog(scope.row,'edit')"
            v-if="hasPermission('BTN_SKU_PURCHASE_1688_ORDER_EDIT')"
          >编辑</el-button>
          <el-button
            type="text"
            size="mini"
            @click="showPurchaseOrderDetail(scope.row)"
            v-if="hasPermission('BTN_ALL__1688_VIEW_DETAILS')"
          >查看详情</el-button>

          <!-- <el-button
            type="text"
            size="mini"
            @click="confirmPurchase(scope.row)"
            v-if="hasPermission('BTN_ALL_1688_CONFIRM_PURCHASE')&&type=='CREATE_ERROR'"
          >确认采购</el-button> -->
          <el-button
            type="text"
            size="mini"
            @click="confirmAllCancel(scope.row)"
            v-if="hasPermission('BTN_ALL_1688_CANCEL')"
          >整单取消</el-button>
          <el-button
            type="text"
            size="mini"
            @click="exportEntireOrder(scope.row)"
            v-if="hasPermission('BTN_PURCHASE_1688_LIST_EXPORT')"
            :loading="loading"
          >导出</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <!-- </div> -->
</template>

<script>
import { AutoPurchaseDetail, AutoBatchPurchase,allCancel,exportoPo } from "@/request/purchase";

export default {
  name: "payFailTable",
  props: {
    tableData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    loading: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "CREATE_ERROR",
    },
  },
  data() {
    return {
      loading:false,
      loadingFail:false,
      hasSelectOrder: [],
      externalStatus: {
        "1": "待自动下单",
        "2": "已下单未付款",
        "3": "采购成功",
        "4": "自动下单失败",
        "5": "采购取消",
        "0": "",
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleSelectionChange(val) {
      this.hasSelectOrder = val;
      this.$emit("on-select", val);
    },
    openEditDialog(row, type) {
      this.$emit("open-edit", { data: row, type: type });
    },
    showPurchaseOrderDetail(row) {
      this.$emit("open-detail", row);
    },
    //整单取消
    confirmAllCancel(data) {
      this.$confirm("确认取消此单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          await this.allCancel(data);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    allCancel(data) {
      let params = {
        purchaseOrderNo: data.purchaseOrderNo,
      };
      allCancel(params)
        .then((res) => {
          console.log(res);
          if (res.ret.errcode === 1) {
            this.$message.success("整单取消成功！");
            this.$emit('on-cancel')
          } else {
            if (tabActive === "EXTERNAL_PURCHASE_UN_PAY") {
              this.$confirm("1688取消订单失败，请人工取消或退款。", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              });
            } else if (tabActive === "EXTERNAL_UN_PURCHASE") {
              this.$confirm(
                "采购单已取消，但第三方系统取消订单失败，请务必人工登录对方系统操作取消订单或退款。",
                "提示",
                {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning",
                }
              );
            } else {
              this.$message.error(res.message);
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //确认采购
    confirmPurchase(row) {
      console.log(row);
      var params = {
        purchaseNo: [row.purchaseOrderNo],
      };
      AutoBatchPurchase(params).then((resultes) => {
        if (resultes.ret.errcode == 1) {
          this.$message.success("自动采购成功");
          this.$emit("on-success-purchase");
        }
      });
    },
     /**
             * 导出整个采购单
             */
            exportEntireOrder (data) {
                this.loading = true
                let params = {
                    purchaseOrderNo: data.purchaseOrderNo
                }
                exportoPo(params).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        let fileUrl = res.fileUrl
                        window.open(this.dealShowFileSrc(fileUrl))
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
  },
};
</script>

<style scoped>
</style>
