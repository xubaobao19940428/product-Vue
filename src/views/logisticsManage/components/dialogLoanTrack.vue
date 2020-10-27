<template>
  <div class="product-list-setting-dialog">
    <el-dialog
      :title="title"
      :visible.sync="toggle"
      width="750px"
      top="10vh"
      :close-on-click-modal="false"
      @close="cancle"
    >
      <el-form
        ref="listSettingForm"
        :model="settingModel"
        :rules="ruleValidate"
        label-width="100px"
      >
      <div>
          <el-form-item label="选择字段：" prop="checkedItem" v-if="type=='first'">
            <el-checkbox-group v-model="settingModel.checkedItem" @change="changeChecked">
                <el-checkbox
                v-for="item in itemList"
                :label="item.label"
                :key="item.value"
                :disabled="item.disabled"
                >{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
      </div>
      <div>
          <el-form-item label="选择字段：" prop="costgoItem" v-if="type!='first'">
          <el-checkbox-group v-model="settingModel.costgoItem" @change="changeCostgo">
            <el-checkbox
              v-for="item in allCostgo"
              :label="item.label"
              :key="item.value"
              :disabled="item.disabled"
            >{{item.label}}</el-checkbox>
          </el-checkbox-group>
          </el-form-item>
      </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle" size="small">取 消</el-button>
        <el-button type="primary" @click="comfirm" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 商品列表设置
  name: "DialogLoanTrack",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    setting: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: "first"
    }
  },
  data() {
    return {
      title: "列表设置",
      itemList: [
        {
          label: "货代工作号",
          value: "jobNo",
          minWidth: 180,
          disabled: true
        },
        {
          label: "报关单号",
          value: "bgdNo",
          minWidth: 250,
          disabled: true
        },
        {
          label: "发货人",
          value: "shipper",
          minWidth: 180,
          disabled: false
        },
        {
          label: "收货人",
          value: "consignee",
          minWidth: 180,
          disabled: false
        },
        {
          label: "贸易方式",
          value: "tradeType",
          minWidth: 180,
          disabled: false
        },
        {
          label: "起运港",
          value: "polName",
          minWidth: 80,
          disabled: false
        },
        {
          label: "目的港",
          value: "podName",
          minWidth: 120,
          disabled: false
        },
        {
          label: "BL单号",

          value: "masterNo",
          minWidth: 150,
          disabled: false
        },
        {
          label: "船次航次",
          value: "vessel",
          minWidth: 100,
          disabled: false
        },
        {
          label: "唛头",
          value: "marks",
          minWidth: 125,
          disabled: false
        },
        {
          label: "提货日期",
          value: "reqPickDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "品名",
          value: "skuName",
          minWidth: 100,
          disabled: false
        },
        {
          label: "件数",
          value: "pkgNum",
          minWidth: 100,
          disabled: false
        },
        {
          label: "毛重",
          value: "grossWeight",
          minWidth: 100,
          disabled: false
        },
        {
          label: "体积",
          value: "measurement",
          minWidth: 120,
          disabled: false
        },
        {
          label: "开航日期",
          value: "etd",
          minWidth: 200,
          disabled: false
        },
        {
          label: "到港日期",
          value: "eta",
          minWidth: 200,
          disabled: false
        },
        {
          label: "截关日期",
          value: "lastPassDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "车号",
          value: "truckNo",
          minWidth: 80,
          disabled: false
        },
        {
          label: "车型",
          value: "truckType",
          minWidth: 150,
          disabled: false
        },
        {
          label: "装载方式",
          value: "loadingType",
          minWidth: 150,
          disabled: false
        },
        {
          label: "invoice Date",
          value: "invoiceDate",
          minWidth: 160,
          disabled: false
        },
        {
          label: "送舱日期",
          value: "sendPortDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "门到门的物流天数",
          value: "cycleDayNum",
          minWidth: 160,
          disabled: false
        },
        {
          label: "QTY",
          value: "qty",
          minWidth: 160,
          disabled: false
        },
        {
          label: "QTY UNIT",
          value: "qtyUnit",
          minWidth: 160,
          disabled: false
        },
        {
          label: "目的港清关日期",
          value: "portClearanceDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "Invoice NO.",
          value: "invoiceNo",
          minWidth: 160,
          disabled: false
        },
        {
          label: "到仓日期",
          value: "arrivalDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "预计到仓日期",
          value: "expectedArrivalDate",
          minWidth: 200,
          disabled: false
        }
      ],
      allCostgo:[
        {
          label: "货代工作号",
          value: "jobNo",
          minWidth: 180,
          disabled: false
        },
         {
          label: "订单号",
          value: "orderNo",
          minWidth: 180,
          disabled: true
        },
        {
          label: "出库单号",
          value: "outNo",
          minWidth: 250,
          disabled: true
        },
        {
          label: "物流单号",
          value: "logiNo",
          minWidth: 180,
          disabled: false
        },
        {
          label: "报关单号",
          value: "bgdNo",
          minWidth: 180,
          disabled: false
        },
        {
          label: "发货人",
          value: "shipper",
          minWidth: 180,
          disabled: false
        },
        {
          label: "收货人",
          value: "consignee",
          minWidth: 180,
          disabled: false
        },
        {
          label: "贸易方式",
          value: "tradeType",
          minWidth: 180,
          disabled: false
        },
        {
          label: "起运港",
          value: "polName",
          minWidth: 80,
          disabled: false
        },
        {
          label: "目的港",
          value: "podName",
          minWidth: 120,
          disabled: false
        },
        {
          label: "BL单号",
          value: "masterNo",
          minWidth: 100,
          disabled: false
        },
        {
          label: "船次航次",

          value: "vessel",
          minWidth: 100,
          disabled: false
        },
        {
          label: "唛头",
          value: "marks",
          minWidth: 125,
          disabled: false
        },
        {
          label: "提货日期",
          value: "reqPickDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "品名",
          value: "skuName",
          minWidth: 100,
          disabled: false
        },
        {
          label: "件数",
          value: "pkgNum",
          minWidth: 100,
          disabled: false
        },
        {
          label: "毛重",
          value: "grossWeight",
          minWidth: 100,
          disabled: false
        },
        {
          label: "体积",
          value: "measurement",
          minWidth: 120,
          disabled: false
        },
        {
          label: "开航日期",
          value: "etd",
          minWidth: 200,
          disabled: false
        },
        {
          label: "到港日期",
          value: "eta",
          minWidth: 200,
          disabled: false
        },
        {
          label: "截关日期",
          value: "lastPassDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "车号",
          value: "truckNo",
          minWidth: 80,
          disabled: false
        },
        {
          label: "车型",
          value: "truckType",
          minWidth: 150,
          disabled: false
        },
        {
          label: "装载方式",
          value: "loadingType",
          minWidth: 150,
          disabled: false
        },
        {
          label: "invoice Date",
          value: "invoiceDate",
          minWidth: 160,
          disabled: false
        },
        {
          label: "送舱日期",
          value: "sendPortDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "门到门的物流天数",
          value: "cycleDayNum",
          minWidth: 160,
          disabled: false
        },
        {
          label: "QTY",
          value: "qty",
          minWidth: 160,
          disabled: false
        },
        {
          label: "QTY UNIT",
          value: "qtyUnit",
          minWidth: 160,
          disabled: false
        },
        {
          label: "目的港清关日期",
          value: "portClearanceDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "Invoice NO.",
          value: "invoiceNo",
          minWidth: 160,
          disabled: false
        },
        {
          label: "到仓日期",
          value: "arrivalDate",
          minWidth: 200,
          disabled: false
        },
        {
          label: "预计到仓日期",
          value: "expectedArrivalDate",
          minWidth: 200,
          disabled: false
        }
      ],
      settingModel: this.setting,
      ruleValidate: {
        checkedItem: [
          {
            required: true,
            message: "请选择字段",
            trigger: "change"
          }
        ],
        costgoItem: [
          {
            required: true,
            message: "请选择字段",
            trigger: "change"
          }
        ]
      },
      hasChecked:JSON.parse(JSON.stringify(this.setting))
    };
  },
  components: {},
  computed: {
    toggle: {
      get: function() {
        return this.dialogVisible;
      },
      set: function() {

      }
    }
  },
  mounted() {
  },
  methods: {
    cancle() {
      this.$emit("on-cancle");
    },
    comfirm() {
      
    this.$emit("on-confirm", this.hasChecked);
    },
    changeChecked(val){
      var arr = JSON.parse(JSON.stringify(val))
      _.forEach(this.itemList,(item,index)=>{
        _.forEach(arr,(checked,oldIndex)=>{
          if(item.label==checked){
            arr.splice(index,0,item.label)
            // arr.splice(oldIndex,1)
          }
        })
      })
      this.hasChecked.checkedItem = arr
    },
    changeCostgo(val){
       var arr = JSON.parse(JSON.stringify(val))
      _.forEach(this.allCostgo,(item,index)=>{
        _.forEach(arr,(checked,oldIndex)=>{
          if(item.label==checked){
            arr.splice(index,0,item.label)
            // arr.splice(oldIndex,1)
          }
        })
      })
      this.hasChecked.costgoItem = arr
    }
  }
};
</script>

<style lang="scss">
.product-list-setting-dialog {
  .el-select .el-input {
    width: 400px;
  }
  .el-input,
  .el-textarea {
    width: 400px;
  }
  .el-dialog__header {
    border-bottom: 1px solid #ebeef5;
  }
  .el-dialog__body {
    padding: 50px 40px;
  }
  .el-dialog__footer {
    border-top: 1px solid #ebeef5;
  }
  .el-form--inline .el-form-item {
    margin-right: 0;
  }
}
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #409eff !important;
}
</style>
