<template>
  <div class="confirm_payment">
    <el-dialog
      title="正在校验"
      :visible.sync="confirmDialogVisible"
      width="30%"
      :show-close="false"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div v-loading="paymentLoading" style="height:40px;width:100%" id="progress"></div>
      <p style="color:#f56c6c;font-size:14px;font-weight:900;margin-bottom:10px">付款前校验中,请勿关闭页面</p>
      <span class="tips" style="font-size:12px;">说明：系统每次选取30个采购单执行付款前校验</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose" size="medium">取消提交</el-button>
      </span>
    </el-dialog>
    <!--0单校验时-->
    <el-dialog
      :visible.sync="noConformDialog"
      width="30%"
      :show-close="false"
      :before-close="noHandleClose"
      :close-on-click-modal="false"
    >
      <p style="line-height:40px">
        校验通过
        <span style="color:#409EFF;font-weight:900">0</span>单,请前往待付款异常标签页处理
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="noHandleClose" size="medium" type="primary">关 闭</el-button>
      </span>
    </el-dialog>
    <!---确认付款弹窗-->
    <el-dialog
      title="确认付款"
      :visible.sync="submitConformDialog"
      width="800px"
      :show-close="false"
      :before-close="submitHandleClose"
      :close-on-click-modal="false"
    >
      <p style="color:#f56c6c;font-size:14px;font-weight:900;margin-bottom:10px">支付过程中,请勿关闭页面</p>
      <div>
        <div class="payment_link1" v-for="(item,index) in checkContent" :key="index">
          <ul>
            <li>
              校验通过
              <span class="weight_font">{{item.sum}}</span>单
            </li>
            <li>
              合计采购总额：
              <span class="weight_font">{{item.purchaseAmount}}</span>
            </li>
            <li>
              含运费：
              <span class="weight_font">{{item.freight}}</span>
            </li>
            <li v-if="item.checkPayNo.indexOf('KJB')!=-1">
              <el-button
                type="primary"
                size="small"
                @click="goToPayment(item.checkPayNo,'1')"
                :disabled="crossPay"
              >生成跨境宝付款链接</el-button>
            </li>
            <li v-else>
              <el-button
                type="primary"
                size="small"
                @click="goToPayment(item.checkPayNo,'2')"
                :disabled="alipay"
              >生成支付宝付款链接</el-button>
            </li>
          </ul>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="submitHandleClose" size="medium" type="primary">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GeneratePayUrl } from "@/request/purchase";
export default {
  name: "beforeConfirmPayment",
  props: {
    confirmDialogVisible: {
      type: Boolean,
      default: false,
    },
    paymentLoading: {
      type: Boolean,
      default: true,
    },
    noConformDialog: {
      type: Boolean,
      default: false,
    },
    submitConformDialog: {
      type: Boolean,
      default: false,
    },
    checkContent: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // percentage:{
    //   type:Number,
    //   default:0,
    // }
  },
  data() {
    return {
      alipay: false,
      crossPay: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleClose() {
      this.$emit("on-cancel", "confirm");
    },
    noHandleClose() {
      this.$emit("on-cancel", "noConfirm");
    },
    submitHandleClose() {
      this.$emit("on-cancel", "submitConfirm");
      this.alipay = false;
      this.crossPay = false;
    },
    goToPayment(checkPayNo, type) {
      var params = {
        checkPayNo: checkPayNo,
      };
      GeneratePayUrl(params).then((resultes) => {
        if (resultes.ret.errcode == 1) {
          if (type === "1") {
            this.crossPay = true;
          } else {
            this.alipay = true;
          }
          window.open(resultes.payUrl)
        }
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.payment_link1 {
  margin: 20px 0;
  ul {
    display: flex;
    line-height: 40px;
    justify-content: space-around;
    font-size: 16px;
    font-weight: bold;
    li {
      .weight_font {
        color: #409eff;
        display: inline-block;
        margin: 0 10px;
      }
    }
  }
}
</style>
