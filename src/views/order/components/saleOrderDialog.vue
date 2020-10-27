<template>
  <div>
    <el-dialog title="订单详情" :visible.sync="dialogVisible" width="700px" @close="closeDialog">
      <el-form label-position="top" style="margin-left:20px">
        <el-form-item label="">
          <div class="flex flex-item--center" v-for="(item, index) in dialogData.productInfo" :key="index" style="margin-bottom:10px">
            <img v-popover:popover :src="item.productsCoverCn" class="thumbnail">
            <div class="block-right">
              <div>{{item.productsNameCn}}</div>
              <div>{{item.skuDescCn | specFilter}}</div>
              <div>数量：{{item.count}}</div>
              <div>单价：{{item.price | divideFilter}}</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="用户信息：">
          <div class="flex">
            <div class="width--harf">
              <div>退款用户：{{dialogData.receiveName}}</div>
              <div>退款金额：{{dialogData.refundAmount | divideFilter}}</div>
              <div>件数：{{dialogData.count}}</div>
              <div>收货人：{{dialogData.mobile}}</div>
            </div>
            <div class="width--harf">
              <div>退款银行：{{dialogData.bankName}}</div>
              <div>退款银行卡号：{{dialogData.bankCard}}</div>
              <div>持卡人姓名：{{dialogData.usernameOfBank}}</div>
            </div>
          </div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="closeDialog" size="small">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
export default {
    name: 'Sample',
    components: {},
    mixins: [],
    extends: {},
    props: {
        dialogVisible: {
            type: Boolean,
            default: false
        },
        dialogData: {
            type: Object,
            default: function () {}
        }
    },
    data () {
        return {
            formLabelWidth: '100px'
        }
    },
    computed: {},
    directives: {},
    filters: {},
    created () {},
    mounted () {},
    watch: {},
    methods: {
        closeDialog () {
            this.$emit('closeDialog')
        }
    }
}
</script>
<style lang='scss' scoped>
  .title {
    display: inline-block;
    width: 110px;
    text-align: center;
  }
  div {
    line-height: 25px;
  }

</style>
