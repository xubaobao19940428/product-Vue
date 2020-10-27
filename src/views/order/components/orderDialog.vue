<template>
    <el-dialog title="订单详情"
               :visible.sync="visible"
               width="700px"
               @close="closeDialog">
      <el-form label-position="top">
        <el-form-item label="">
          <div class="flex flex-item--center"
               v-for="(item, index) in dialogData.orderInfo"
               :key="index"
               style="margin-bottom:10px">
            <img v-popover:popover :src="item.productsCoverCn"
                 class="thumbnail">
            <div class="block-right">
              <div>{{item.productsNameCn}}</div>
              <div>{{item.skuDescCn | specFilter}}</div>
              <div>数量：{{item.count}}</div>
              <div>单价：{{item.price | divideFilter}}</div>
              <div>实际收入：{{item.actualPrice}}</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="用户信息" >
          <div>收货人：{{dialogData.receiveName}}</div>
          <div>电话：{{dialogData.mobile}}</div>
          <div>地址：{{dialogData.address}}</div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="closeDialog" size="small">确 定</el-button> -->
      </div>
    </el-dialog>

</template>
<script>
export default {
    name: 'Sample',
    components: {},
    mixins: [],
    extends: {},
    props: {
        visible: {
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
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
            formLabelWidth: '100px'
        }
    },
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
