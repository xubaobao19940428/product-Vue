<template>
  <div class="after-sale-status">
    <div class="status-title">{{ refund.status }}</div>
    <div class="module top">
      <div class="top-name">退款金额：</div>
      <div class="money">
        {{ refund.currency }}
        <div :class="{ 'pricess': mark === 1 }">{{ refund.refundAmount }}</div>
        <div :class="{ 'pricess': markTwo === 1 }">（含运费{{refund.refundFreight}}）</div>
      </div>
      <div
        v-if="refund.refundStatus === 1 || refund.refundStatus === 2"
        class="modify"
        @click="modifyClick"
      >修改</div>
    </div>
    <div class="top">
      <div class="module">
        <div class="top-name">退款方式：</div>
        <div :class="{ 'pricess': useType === 1 }">{{ refund.refundType == 1 ? '积分' : '银行卡' }}</div>
        <div
          class="modify"
          v-if="refund.refundStatus !==4 && refund.refundStatus !==5 && refund.refundStatus !==6"
          @click="refundMethod"
        >修改</div>
      </div>
      <div class="status-mid" v-if="refund.refundType == 0">
        <div class="module-box">
          <div class="module">
            <div class="top-name">银行卡号：</div>
            <div :class="{ 'pricess': name === 1 }">{{refund.refundCardNo}}</div>
          </div>
          <div class="module">
            <div class="top-name">银行名称：</div>
            <div :class="{ 'pricess': name === 1 }">{{refund.refundBankName}}</div>
          </div>
        </div>
        <div class="module-box">
          <div class="module">
            <div class="top-name">电话号码：</div>
            <div :class="{ 'pricess': name === 1 }">{{refund.mobile}}</div>
          </div>
          <div class="module">
            <div class="top-name">电子邮箱：</div>
            <div :class="{ 'pricess': name === 1 }">{{refund.email}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer" v-if="refund.refundStatus === 1 || refund.refundStatus === 2 ">
      <div class="footer-title">对客户说：</div>
      <el-input
        type="textarea"
        size="medium"
        placeholder="如有需要，可在此为客户留言，建议语言：English"
        v-model="textarea"
      ></el-input>
    </div>
    <div
      class="btn-box"
      v-if="refund.refundStatus !==4 && refund.refundStatus !==5 && refund.refundStatus !==6"
    >
      <div class="btn-box-title">
        <i class="iconfont">&#xe69b;</i> 你的决定：
      </div>
      <div v-if="toChange === 0 && refund.refundStatus ===1">
        <el-button type="success" @click="auditPassClick">同意申请</el-button>
        <el-button type="danger" plain @click="rejectClick">拒绝申请</el-button>
        <el-button type="warning" plain @click="DelayProcessClick">标记为等待中</el-button>
      </div>
      <div v-else-if="toChange === 0 && refund.refundStatus ===2">
        <el-button type="success" @click="auditPassClick">同意申请</el-button>
        <el-button type="danger" plain @click="rejectClick">拒绝申请</el-button>
      </div>
      <div v-else-if="toChange === 1 && (refund.refundStatus ===1 || refund.refundStatus ===2)">
        <el-button type="warning" plain @click="submitClick">提交修改</el-button>
      </div>
      <el-button
        type="primary"
        v-if="refund.refundStatus ===3 && refund.refundType == 0"
        @click="refundSuccessClick"
      >标记为退款完成</el-button>
      <el-button
        type="warning"
        v-if="refund.refundStatus ===3 && refund.refundType == 1"
        plain
        @click="submitClick"
      >提交修改</el-button>
    </div>
    <refund-amount
      v-if="dialogVisible"
      :dialogVisible="dialogVisible"
      @on-cancel="refundCancel"
      @on-confirm="refundConfirm"
      :amount="refund.refundProductAmount"
      :freight="refund.refundFreight"
      :currency="refund.currency"
    ></refund-amount>
    <refund-method
      v-if="refundMethodDialogVisible"
      :dialogVisible="refundMethodDialogVisible"
      :refund="refund"
      @on-cancel="refundMethodCancel"
      @on-confirm="refundMethodConfirm"
    ></refund-method>
  </div>
</template>
<script>
import {
  RejectApply,
  DelayProcessing,
  RefundSuccess,
  ModifyAfterSale,
  AuditPass,
  ReturnOperValid,
} from "@/request/afterSale";
import refundAmount from "./refundAmount";
import refundMethod from "./refundMethod";

export default {
  data() {
    return {
      textarea: "",
      dialogVisible: false,
      refundMethodDialogVisible: false,
      mark: 0,
      markTwo: 0,
      card: 0,
      name: 0,
      useType: 0,
      toChange: 0,
    };
  },
  props: {
    refund: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    refundAmount,
    refundMethod,
  },
  methods: {
    modifyClick() {
      this.dialogVisible = true;
    },
    refundCancel() {
      this.dialogVisible = false;
    },
    refundConfirm(val) {
      this.dialogVisible = false;
      console.log(val);
      if (val.amount !== this.refund.refundProductAmount) {
        this.toChange = 1;
        this.mark = 1;
      }
      if (val.freight !== this.refund.refundFreight) {
        this.toChange = 1;
        this.markTwo = 1;
      }
      Object.assign(this.refund, {
        refundAmount: (Number(val.amount) + Number(val.freight)).toString(),
        refundFreight: val.freight,
        refundProductAmount: val.amount,
      });
    },
    refundMethodCancel() {
      this.refundMethodDialogVisible = false;
    },
    refundMethodConfirm(val) {
      console.log(val);
      this.refundMethodDialogVisible = false;
      if (val.refundBankName !== this.refund.refundBankName) {
        this.name = 1;
        this.toChange = 1;
      }
      if (val.refundType !== this.refund.refundType) {
        this.toChange = 1;
        this.useType = 1;
      }
      Object.assign(this.refund, val);
      console.log(this.refund);
    },
    refundMethod() {
      this.refundMethodDialogVisible = true;
    },
    rejectClick() {
      if (this.textarea === "") {
        this.$message.error("请填写客服留言！");
      } else {
        let params = {
          refundId: this.refund.refundId,
          message: this.textarea,
        };
        RejectApply(params).then((res) => {
          if (res.ret.errcode === 1) {
            console.log(res);
            this.$emit("on-comfirm");
          }
        });
      }
    },
    DelayProcessClick() {
      if (this.textarea === "") {
        this.$message.error("请填写客服留言！");
      } else {
        let params = {
          refundId: this.refund.refundId,
          message: this.textarea,
        };
        DelayProcessing(params).then((res) => {
          if (res.ret.errcode === 1) {
            console.log(res);
            this.$emit("on-comfirm");
          }
        });
      }
    },
    refundSuccessClick() {
      let params = {
        refundId: this.refund.refundId,
      };
      RefundSuccess(params).then((res) => {
        if (res.ret.errcode === 1) {
          console.log(res);
          this.$emit("on-comfirm");
        }
      });
    },
    submitClick() {
      let params = {
        refundId: this.refund.refundId,
        refundProductAmount: this.refund.refundProductAmount,
        refundFreight: this.refund.refundFreight,
        message: this.textarea,
        refundType: Number(this.refund.refundType),
        refundCardNo: this.refund.refundCardNo,
        refundBankName: this.refund.refundBankName,
        refundCardholder: this.refund.refundCardholder,
        refundTel: this.refund.mobile,
        refundMail: this.refund.email,
      };
      console.log(params);
      ModifyAfterSale(params).then((res) => {
        if (res.ret.errcode === 1) {
          console.log(res);
          this.toChange = 0;
          this.$emit("on-comfirm");
        }
      });
    },
    auditPassClick() {
      this.getReturnOperValid();
    },
    getAuditPass() {
      let params = {
        refundId: this.refund.refundId,
        message: this.textarea,
      };
      AuditPass(params).then((res) => {
        if (res.ret.errcode === 1) {
          console.log(res);
          this.$emit("on-comfirm");
        }
      });
    },
    getReturnOperValid() {
      let params = {
        operType: 2,
        orderId: this.refund.orderId,
        product: [
          { skuId: this.refund.skuId, suborderId: this.refund.suborderId },
        ],
      };
      ReturnOperValid(params).then((res) => {
        if (res.ret.errcode === 1) {
          console.log(res);
          if (res.popContent) {
            this.$confirm(
              res.popContent.detailContent,
              res.popContent.warnContent,
              {
                confirmButtonText: "仍要直接过审",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(async () => {
                await this.getAuditPass();
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消",
                });
              });
          } else {
            this.getAuditPass();
          }
        }
      });
    },
  },
};
</script>
<style lang="scss">
.after-sale-status {
  .el-textarea {
    width: 400px;
  }
  .el-textarea__inner {
    min-height: 100px !important;
  }
}
</style>
<style lang="scss" scoped>
.after-sale-status {
  .status-title {
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 16px;
    background-color: rgb(214, 214, 214);
  }
  .module {
    display: flex;
    padding: 20px 0 20px 40px;
    .top-name {
      width: 100px;
      font-weight: 300;
    }
    .modify {
      margin-left: 10px;
      font-size: 14px;
      color: #409eff;
      cursor: pointer;
    }
  }
  .money {
    display: flex;
  }
  .top {
    border-bottom: 1px dashed rgb(239, 239, 239);
  }
  .status-mid {
    display: flex;
  }
  .footer {
    display: flex;
    margin-left: 40px;
    margin-top: 20px;
    .footer-title {
      width: 80px;
      font-weight: 300;
    }
  }
  .btn-box {
    display: flex;
    margin-top: 20px;
    margin-bottom: 10px;
    .btn-box-title {
      margin-left: 40px;
      font-weight: 300;
    }
    .iconfont {
      font-size: 12px;
      color: red;
    }
  }
  .pricess {
    color: rgb(207, 38, 67);
  }
}
</style>