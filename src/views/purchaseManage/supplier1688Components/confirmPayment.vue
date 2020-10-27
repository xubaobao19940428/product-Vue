<template>
  <div class="confirm_payment">
    <el-dialog
      title="确认可付款"
      :visible.sync="dialogConfirm"
      width="700px"
      :show-close="false"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <p style="line-height:40px">
        已选中
        <span style="color:#409EFF;padding:0 10px;">{{hasSelectTotal}}</span>单,确认可支付1688订单？
      </p>
      <span class="tips" style="font-size:14px;">说明：商品有起批量问题的采购单，付款后采购单的采购数量以您录入的数量为准，请知悉！</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmSelect" size="medium" type="primary">确 认</el-button>
        <el-button @click="handleClose" size="medium">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    hasSelectTotal: {
      type: Number,
      default: 0,
    },
    dialogConfirm:{
        type:Boolean,
        default:false,
    }
  },
  name: "confirmPayment",
  data() {
    return {};
  },
  computed: {},
  watch: {},
  methods: {
      handleClose(){
          this.$emit('on-cancel')
      },
      confirmSelect(){
        this.$emit('on-success')
      }
  },
};
</script>

<style scoped>
</style>
