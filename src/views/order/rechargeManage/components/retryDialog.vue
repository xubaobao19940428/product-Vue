<template>
  <div class="retry-dialog">
    <el-dialog
      title="重试"
      :visible.sync="toggle"
      :before-close="cancle"
      :close-on-click-modal="false"
      width="400px"
    >
      <el-form ref="recharge" inline label-width="80px" :model="queryData" :rules="rule">
        <el-form-item prop="account" label="充值账号：" class="filter-item">
          <el-input
            v-model="queryData.account"
            clearable
            placeholder="请输入充值账号"
            size="medium"
            onkeypress="return(/[\d]/.test(String.fromCharCode(event.keyCode)))"
            style="width: 200px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancle" size="small">取 消</el-button>
        <el-button type="primary" @click="confirm" size="small">下一步</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryData: {
        account: "",
      },
      rule: {
        account: [{ required: true, message: "不能为空", trigger: "bulr" }],
      },
    };
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    reCharge: Object,
  },
  mounted() {
    this.queryData.account = this.reCharge.account;
  },
  computed: {
    toggle: {
      get: function () {
        return this.dialogVisible;
      },
      set: function () {},
    },
  },
  methods: {
    cancle() {
      this.$emit("on-cancle");
    },
    confirm() {
      if (this.queryData.account === "") {
        this.$message.error("请输入充值账号！");
        return;
      }
      this.$emit("on-confirm", this.queryData.account);
    },
  },
};
</script>

<style lang="scss">
.retry-dialog {
  .el-dialog__body {
    padding: 20px 40px;
  }
}
</style>
