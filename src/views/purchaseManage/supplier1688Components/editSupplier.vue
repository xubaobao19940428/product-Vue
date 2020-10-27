<template>
  <div class="edit_supplier_dialog">
    <el-dialog
      :title="dialogTitle"
      :visible.sync="editSupplierDialog"
      width="1200px"
      top="5vh"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <div>
        <el-form inline :model="editForm">
          <el-form-item label="供应商：">
            <el-select
              size="small"
              v-if="detailType=='CREATE_ERROR'||detailType=='WAIT_PAY_ERROR'"
              v-model="editForm.supplierId"
              filterable
              clearable
              remote
              reserve-keyword
              :remote-method="getSupplierList"
              placeholder="请输入供应商"
              @clear="clearSelect"
              v-el-select-loadmore="loadMore"
            >
              <el-option
                v-for="(item, index) in supplierLists"
                :key="index"
                :label="item.supplierName"
                :value="item.supplierId"
              ></el-option>
            </el-select>
            <span v-else>{{editForm.supplierName}}</span>
          </el-form-item>
          <el-form-item label="采购金额：">
            <span>{{editForm.purchaseAmount}}</span>
          </el-form-item>
          <el-form-item label="运费：">
            <span>{{editForm.freight}}</span>
          </el-form-item>
          <div class="form_button">
            <el-button
              type="primary"
              size="small"
              v-if="detailType=='CREATE_ERROR'||detailType=='WAIT_PAY_ERROR'"
              @click="SyncNowRelationN"
            >一键同步第三方订单号</el-button>
            <el-button
              type="primary"
              @click="addProduct"
              size="small"
              v-if="detailType=='CREATE_ERROR'"
            >新增商品</el-button>
          </div>
          <div v-for="(item,index) in editForm.skuList" :key="index" class="form_data">
            <el-card class="box-card">
              <div class="form_data_noline1">
                <span class="form_index">{{index+1}}</span>
                <el-image
                  style="width: 120px; height: 120px"
                  :src="dealShowFileSrc(item.skuCover)"
                  :fit="fit"
                ></el-image>
                <div class="product_detail">
                  <el-form-item label="商品：">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.productId+','+item.skuName"
                      placement="top"
                    >
                      <span
                        style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width:200px;"
                      >{{item.productId+','+item.skuName}}</span>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="规格：">
                    <el-tooltip
                      class="item"
                      effect="dark"
                      :content="item.skuCode+','+item.skuValues"
                      placement="top"
                    >
                      <span
                        style="display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width:200px;"
                      >{{item.skuCode+','+item.skuValues}}</span>
                    </el-tooltip>
                  </el-form-item>
                  <el-form-item label="链接：">
                    <el-tooltip class="item" effect="dark" :content="item.skuLink" placement="top">
                      <a
                        :href="item.skuLink"
                        target="_blank"
                        style="color: #66b1ff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width:200px;font-size:12px"
                      >{{item.skuLink}}</a>
                    </el-tooltip>
                  </el-form-item>
                </div>
              </div>
              <div class="form_data_noline">
                <el-form-item label="采购单价：">
                  <span>{{item.supplyPrice}}</span>
                </el-form-item>
                <el-form-item label="系统数量：">
                  <span>{{item.sysCount}}</span>
                </el-form-item>
                <el-form-item label="采购数量：">
                  <el-input
                    v-model="item.purchaseCount"
                    size="small"
                    oninput="value=value.replace(/[^\d]/g,'')"
                    v-if="(detailType=='CREATE_ERROR'||detailType=='WAIT_PAY_ERROR')&&item.cancelStatus==2"
                  ></el-input>
                  <span
                    v-if="detailType=='WAIT_PAY'||detailType=='PAY_SUCCESS'||item.cancelStatus==1"
                  >{{item.purchaseCount}}</span>
                </el-form-item>
              </div>
              <div class="form_data_noline">
                <el-form-item
                  label="失败原因："
                  label-width="120px"
                  v-if="detailType!='WAIT_PAY'&&detailType!='PAY_SUCCESS'"
                >
                  <el-tooltip class="item" effect="dark" :content="item.failReason" placement="top">
                    <p
                      style="color: #66b1ff; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width:140px;font-size:14px"
                    >{{item.failReason}}</p>
                  </el-tooltip>
                </el-form-item>
                <el-form-item
                  label="第三方订单号："
                  label-width="120px"
                  v-if="(detailType=='CREATE_ERROR'||detailType=='WAIT_PAY_ERROR')&&item.cancelStatus==2"
                >
                  <el-input v-model="item.thirdNo" size="small" @input="changeValue"></el-input>
                </el-form-item>
                <el-form-item
                  label="第三方订单号："
                  label-width="120px"
                  v-if="detailType=='WAIT_PAY'||detailType=='PAY_SUCCESS'||item.cancelStatus==1"
                >
                  <span >{{item.thirdNo}}</span>
                </el-form-item>
              </div>
              <div class="form_data_online2">
                <!-- <div> -->
                <div v-if="item.cancelStatus==1" class="cancel_reson">
                  <p>已取消{{'('+returnReason(item.cancelReason)+')'}}</p>
                </div>
                <el-form-item
                  class="padding_form_item"
                  v-if="(detailType=='CREATE_ERROR'||detailType=='WAIT_PAY_ERROR')&&item.cancelStatus==2"
                >
                  <el-select
                    style="width:150px"
                    size="small"
                    placeholder="请选择取消原因"
                    v-model="item.cancelReason"
                    @change="changeValue"
                  >
                    <el-option
                      v-for="(item,index) in createFailReason"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <div
                  class="product_button"
                  v-if="(detailType=='CREATE_ERROR'||detailType=='WAIT_PAY_ERROR')&&item.cancelStatus==2"
                  style="margin-top:5px"
                >
                  <el-form-item>
                    <el-button
                      type="primary"
                      size="small"
                      @click="updateData(index,item.skuCode)"
                    >更新单价</el-button>
                    <el-button
                      type="primary"
                      size="small"
                      @click="cancelPurchase(index,item.skuCode)"
                    >取消采购</el-button>
                  </el-form-item>
                  <!-- </div> -->
                </div>
              </div>
            </el-card>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          v-if="detailType=='CREATE_ERROR'"
          @click="addAutoPurchaseUpdate(1)"
        >发起自动采购</el-button>
        <el-button type="primary" v-if="detailType=='WAIT_PAY_ERROR'" @click="confirmPurchase">可付款</el-button>
        <el-button
          type="primary"
          @click="addAutoPurchaseUpdate(2)"
          v-if="detailType=='CREATE_ERROR'||detailType=='WAIT_PAY_ERROR'"
        >确 定</el-button>
        <el-button
          type="primary"
          v-if="detailType!='CREATE_ERROR'&&detailType!='WAIT_PAY_ERROR'"
          @click="handleClose"
        >确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
    <add1688Po :show="dialogProduct" @on-cancel="cancelAddProduct" @on-save-skuOrder="addSkuOrder"></add1688Po>
  </div>
</template>

<script>
import add1688Po from "./add1688Pro";
import {
  AutoPurchaseSkuCancel,
  AutoPurchaseSkuPrice,
  AutoPurchaseUpdate,
  CanPayBatch,
} from "@/request/purchase";
import { supplierBasePage } from "@/request/supplier";
export default {
  components: {
    add1688Po,
  },
  name: "editSupplier",
  props: {
    editSupplierDialog: {
      type: Boolean,
      default: false,
    },
    dialogTitle: {
      type: String,
      default: "编辑采购单",
    },
    detailType: {
      type: String,
      default: "1",
    },
    purchaseOrderNo: {
      type: String,
      default: "",
    },
    pruchaseEditForm: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      createFailReason: [
        {
          value: "SELLER_UN_SUPPORT",
          label: "卖家未授权分销",
        },
        {
          value: "SKU_STOCK_OUT",
          label: "SKU缺货",
        },
        {
          value: "SKU_OFF_THE_SHELF",
          label: "商品下架",
        },
        {
          value: "SKU_ATTRIBUTE_ERROR",
          label: "SKU规格名称不一致",
        },
        {
          value: "SKU_PRICE_HIGHT",
          label: "商品价格高于供货价",
        },
        {
          value: "SKU_LIMIT_NUM",
          label: "商品限购",
        },
        {
          value: "SKU_OFFER_PREHEATING",
          label: "商品参加活动",
        },
        {
          value: "FINGO_SKU_ERROR",
          label: "FINGO商品异常",
        },
        {
          value: "1688_SYSTEM_ERROR",
          label: "1688系统问题",
        },
        {
          value: "PAY_TYPE_UN_SUPPORT",
          label: "交易方式不支持",
        },
        {
          value: "SKU_TRACE_ERROR",
          label: "溯源失败",
        },
        {
          value: "OTHER",
          label: "其他原因",
        },
      ],
      supplierLists: [],
      dialogProduct: false,
      editForm: {
        supplierName: "",
        purchaseAmount: "",
        freight: "",
        supplierId: "",
        skuList: [],
      },
      supplierQuery: {
        supplierName: "",
        page: {
          pageSize: 20,
          pageNum: 1,
        },
      },
    };
  },
  computed: {},
  watch: {
    pruchaseEditForm: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.editForm = Object.assign(this.editForm, newVal);
        }
      },
      deep: true,
    },
  },
  methods: {
    changeValue() {
      this.$forceUpdate();
    },
    handleClose() {
      this.$emit("on-cancel-supplier-dialog");
    },
    //更新单价
    updateData(index, skuCode) {
      var params = {
        purchaseOrderNo: this.purchaseOrderNo,
        skuCode: skuCode,
      };
      AutoPurchaseSkuPrice(params)
        .then((resultes) => {
          if (resultes.ret.errcode == 1) {
            this.editForm.skuList[index].supplyPrice = resultes.price;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSupplierList(value) {
      this.supplierQuery.supplierName = value;
      if (value != "") {
        this.supplierQuery.page.pageNum = 1;
      }
      supplierBasePage(this.filterData(this.supplierQuery)).then((res) => {
        if (res.ret.errcode === 1) {
          if (!value) {
            this.supplierLists = this.deleteObject([
              ...this.supplierLists,
              ...res.list,
            ]);
          } else {
            this.supplierLists = res.list;
          }
        }
      });
    },
    clearSelect() {
      this.getSupplierList("");
    },
    loadMore() {
      if (this.supplierQuery.supplierName == "") {
        this.supplierQuery.page.pageNum++;
        this.getSupplierList("");
      }
    },
    addProduct() {
      this.dialogProduct = true;
    },
    cancelAddProduct() {
      this.dialogProduct = false;
    },
    SyncNowRelationN() {
      console.log(this.editForm.skuList);
      if (this.editForm.skuList[0].thirdNo == "") {
        this.$message.warning("请填写第三方订单号");
      } else {
        _.forEach(this.editForm.skuList, (value, index) => {
          this.editForm.skuList[
            index
          ].thirdNo = this.editForm.skuList[0].thirdNo;
          this.$forceUpdate();
        });
      }
    },
    //skuCode取消
    cancelPurchase(index, skuCode) {
      if (this.editForm.skuList[index].cancelReason == "") {
        this.$message.error("请挑选当前SKU的取消原因");
      } else {
        var params={
          purchaseOrderNo:this.purchaseOrderNo,
          skuCode:skuCode,
          cancelReason:this.editForm.skuList[index].cancelReason
        }
        AutoPurchaseSkuCancel(params).then(resultes=>{
          if(resultes.ret.errcode==1){
            this.editForm.skuList[index].cancelStatus=1
            var obj = this.editForm.skuList[index]
            this.$set(this.editForm.skuList,index,obj)
            this.$message.success('取消采购成功')
          }
        }).catch(error=>{
          console.log(error)
        })
      }
    },
    //新增商品在底部展示
    addSkuOrder(data) {
      console.log(data);
      this.dialogProduct = false;
      _.forEach(data, (item) => {
        (item.skuValues = item.standardAttr),
          (item.cancelStatus = 2),
          (item.skuName = item.productName);
        item.thirdNo = item.thirdOrderNo;
        item.cancelReason = "";
        this.editForm.skuList.push(item);
      });
    },
    //自动采购
    addAutoPurchaseUpdate(type) {
      var sku = [];
      _.forEach(this.editForm.skuList, (item) => {
        sku.push({
          skuCode: item.skuCode,
          purchaseCount: item.purchaseCount,
          thirdNo: item.thirdNo,
        });
      });
      var params = {
        supplierId: this.editForm.supplierId,
        purchaseOrderNo: this.purchaseOrderNo,
        sku: sku,
        isPurchase: type == 1 ? 1 : 2,
      };
      AutoPurchaseUpdate(params)
        .then((response) => {
          if (response.ret.errcode == 1) {
            this.$message({
              type: "success",
              message: type == 2 ? "保存成功" : "自动采购成功",
            });
            this.$emit("on-confirm-success");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    confirmPurchase() {
      var params = {
        purchaseOrders: [this.purchaseOrderNo],
      };
      CanPayBatch(params)
        .then((res) => {
          if (res.ret.errcode == 1) {
            this.$message.success("可付款成功");
            this.$emit("on-confirm-success");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    returnReason(val) {
      var str = "";
      _.forEach(this.createFailReason, (item) => {
        if (item.value == val) {
          str = item.label;
        }
      });
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-form-item {
  margin-bottom: 5px;
}
.form_button {
  margin-bottom: 10px;
  text-align: right;
}
.form_data {
  width: 100%;
  height: 160px;
  //   background: #cccccc;
  margin-bottom: 10px;
  padding: 10px;
  box-sizing: border-box;
  //   display: flex;
  /deep/ .el-card {
    width: 100%;
    margin-bottom: 10px;
    //   height:100%;
    .el-card__body {
      padding: 10px;
      display: flex;
    }
  }
  .form_data_noline {
    // width: 25%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .el-form-item {
      width: 100%;
      margin-bottom: 5px;
      .el-input--small {
        width: 120px;
      }
    }
  }
  .form_data_noline1 {
    width: 36%;
    display: flex;
    .product_detail {
      display: flex;
      flex-direction: column;
      .el-form-item {
        width: 100%;
        margin-bottom: 5px;
        .el-input--small {
          width: 120px;
        }
      }
    }
  }
  .form_data_online2 {
    display: flex;
    width: 25%;
    .el-form-item {
      width: 100%;
      .el-button + .el-button {
        margin-left: 0;
      }
    }
    .padding_form_item {
      padding-top: 45px;
    }
    .cancel_reson {
      display: flex;
      width: 100%;
      height: 100%;
      align-items: center;
      justify-content: center;
      margin-left: 20px;
    }
  }
  .form_index {
    padding: 0 10px 0 0;
    line-height: 100px;
    font-size: 16px;
    font-weight: 900;
  }
  /deep/ img {
    height: 120px;
    width: 120px;
  }
}
</style>
