<template>
  <!--新增商品-->
  <el-dialog
    title="新增商品"
    :visible.sync="show"
    width="1300px"
    :close-on-click-modal="false"
    :before-close="cancel"
  >
    <el-form
      label-position="right"
      :model="addDialog"
      ref="addDialog"
      :rules="addDialogRules"
      :inline="true"
      size="small"
    >
      <el-form-item
        class="filter-item"
        v-for="(item,index) in addDialog.purchaseOrderProductAddInfos"
        :key="index"
      >
        <el-form-item
          label="SKUcode:"
          :prop="'purchaseOrderProductAddInfos.' + index + '.skuCode'"
          :rules="[
            { required: true, message: 'skuCode不能为空'},
            ]"
        >
          <el-input
            placeholder="请输入商品SKUcode"
            v-model="item.skuCode"
            style="width:150px"
            @blur="getSkuInfo(item.skuCode,index)"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="采购数量:"
          :prop="'purchaseOrderProductAddInfos.' + index + '.purchaseCount'"
          :rules="[
                { required: true, message: '采购数量不能为空'},
                ]"
        >
          <el-input-number
            placeholder="请输入采购数量"
            style="width:120px"
            oninput="value=value.replace(/[^\d]/g,'')"
            v-model="item.purchaseCount"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="采购单价:">
          <span>{{item.supplyPrice}}</span>
        </el-form-item>
        <el-form-item label="规格:">
          <el-tooltip class="item" effect="dark" :content="item.standardAttr" placement="top">
            <span
              style="display: inline-block;vertical-align: middle;overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width:100px;"
            >{{item.standardAttr}}</span>
          </el-tooltip>

          <el-image
            style="width: 60px; height: 60px;vertical-align: text-top;top:-20px;"
            :src="dealShowFileSrc(item.skuCover)"
            :fit="fit"
          ></el-image>
        </el-form-item>
        <el-form-item label="商品ID:">
          <span>{{item.productId}}</span>
        </el-form-item>
        <el-form-item label="第三方订单号:">
          <el-input placeholder="请输入第三方单号" v-model="item.thirdOrderNo"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="delete-box" @click="deleteProducts(index)">
            <i class="el-icon-circle-close"></i>
          </div>
        </el-form-item>
      </el-form-item>
      <div>
        <el-button @click="addProducts()" size="small">+ 新 增</el-button>
        <el-button type="primary" @click="SyncNowRelationN" size="small">一键同步第三方单号</el-button>
      </div>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" size="small">取 消</el-button>
        <el-button type="primary" :loading="addLoading" @click="addPurchase" size="small">确 定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { savePo } from "@/request/purchase";
import common from "@/views/purchaseManage/common/common";
import { getSkuInfo, addInventory } from "@/request/inventory";
export default {
  name: "add1688Po",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [common],
  data() {
    return {
      addLoading: false,
      supplierList: [],
      addDialog: {
        purchaseOrderProductAddInfos: [],
      },
      addDialogRules: {},
      url:
        "https://file-dev.fingo.shop/fingo/product/2020-04/23/original/18375497627287491969024_original_1920x1080.jpg",
    };
  },
  watch: {
    show: {
      handler(newVal, oldVal) {
        if (!newVal) {
          this.addDialog.purchaseOrderProductAddInfos = [];
        }
      },
    },
  },
  mounted() {
    // this.wmsWarehouseList = this.propWmsWarehouseList
    // if (this.addDialog.param.type === "editEntireOrder") {
    //     console.log('===>')
    //     this.getSupplierList('',this.addDialog.param.supplierId)
    // }
  },
  components: {},
  methods: {
    // 限制输入格式
    checkNum(data) {
      if (data <= 0) {
        this.$alert("采购数量不能为小于等于零");
      }
    },
    deleteProducts(i) {
      this.addDialog.purchaseOrderProductAddInfos.splice(i, 1);
    },
    addProducts() {
      this.addDialog.purchaseOrderProductAddInfos.push({
        skuCode: "",
        purchaseCount: "",
        purchasePrice: "",
        thirdOrderNo: "",
        skuCover: "",
        standardAttr: "",
        productName: "",
        productId: "",
        supplyPrice: "",
        skuLink: "",
      });
    },
    isRepeat(arr) {
      let hash = {};
      for (let i in arr) {
        if (hash[arr[i].skuCode]) {
          return true;
        }
        // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
        hash[arr[i].skuCode] = true;
      }
      return false;
    },
    addPurchase() {
      this.$refs["addDialog"].validate(async (valid) => {
        if (valid) {
          let purchaseOrderProductAddInfos = this.addDialog.purchaseOrderProductAddInfos.filter(
            (val) => {
              return val.skuCode && val.purchaseCount != "";
            }
          );
          if (purchaseOrderProductAddInfos.length > 0) {
            for (
              let i = 0;
              i < this.addDialog.purchaseOrderProductAddInfos.length;
              i++
            ) {
              if (
                this.addDialog.purchaseOrderProductAddInfos[i].purchaseCount < 0
              ) {
                this.$message.warning("采购数量异常");
              }
            }
            if (this.isRepeat(purchaseOrderProductAddInfos)) {
              this.$message.warning("skuCode不能相同");
            } else {
              let params = this.addDialog.purchaseOrderProductAddInfos;
              let purchaseOrder = {};
              // purchaseOrder.purchaseOrderNo = param.purchaseOrderNo;
              // purchaseOrder.warehouseNo = param.warehouseNo;
              // purchaseOrder.supplierId = param.supplierId;
              // purchaseOrder.deliveWay = param.deliveWay;
              // purchaseOrder.freight = param.freight;
              // purchaseOrder.isUse = param.isUse;
              // purchaseOrder.detailInfo = param.purchaseOrderProductAddInfos;
              this.$emit("on-save-skuOrder", params);
              // this.savePurchaseOrder(purchaseOrder);
            }
          } else {
            this.$message.warning("商品信息不能为空");
          }
        } else {
          return false;
        }
      });
    },
    // 一键同步第三方单号
    SyncNowRelationN() {
      for (
        let i = 0;
        i < this.addDialog.purchaseOrderProductAddInfos.length;
        i++
      ) {
        this.addDialog.purchaseOrderProductAddInfos[
          i
        ].thirdOrderNo = this.addDialog.purchaseOrderProductAddInfos[0].thirdOrderNo;
      }
      // }
    },
    changeWareHouse(data) {
      if (data == 1) {
        // this.addDialog.param.warehouseNo = '0002'
      }
    },
    savePurchaseOrder(params) {
      this.addLoading = true;
      savePo(this.filterData(params))
        .then((response) => {
          this.addLoading = false;
          if (response.ret.errcode === 1) {
            this.$message.success("操作成功！");
            this.addDialog.show = false;
            this.$emit("getList");
            this.reset();
          } else {
            this.$message.error(response.message);
          }
        })
        .catch((err) => {
          this.addLoading = false;
          console.log(err);
        });
    },
    cancel() {
      this.$emit("on-cancel");
      this.reset();
      this.addDialog.purchaseOrderProductAddInfos = [];
    },
    reset() {
      this.$refs.addDialog.resetFields();
    },
    getSkuInfo(skuCode, index) {
      let params = {
        skuCode: skuCode,
      };
      getSkuInfo(this.filterData(params))
        .then((res) => {
          if (res.ret.errcode === 1) {
            console.log(res);
            if (res.sku) {
              this.addDialog.purchaseOrderProductAddInfos[index].skuCover =
                res.sku.skuCover;
              this.addDialog.purchaseOrderProductAddInfos[index].standardAttr =
                res.sku.standardAttr;
              this.addDialog.purchaseOrderProductAddInfos[index].productName =
                res.sku.nameCn;
              this.addDialog.purchaseOrderProductAddInfos[index].productId =
                res.sku.productId;
              this.addDialog.purchaseOrderProductAddInfos[index].supplyPrice =
                res.sku.supplyPrice;
              this.addDialog.purchaseOrderProductAddInfos[index].skuLink =
                res.sku.skuLink;
              // this.$set(this.addDialog.purchaseOrderProductAddInfos,index,{
              //     skuCode: "",
              //     purchaseCount: "",
              //     purchasePrice: "",
              //     thirdOrderNo: "",
              // })
              // this.inventoryData.nameCn = res.sku.nameCn
              // this.inventoryData.skuCover = res.sku.skuCover
              // this.inventoryData.standardAttr = res.sku.standardAttr
            } else {
              // this.inventoryData.nameCn = ''
              // this.inventoryData.skuCover = ''
              // this.inventoryData.standardAttr = ''
              this.$message.warning("无匹配的sku信息");
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.delete-box {
  width: 24px;
  i {
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
