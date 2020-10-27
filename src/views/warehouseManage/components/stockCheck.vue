<template>
  <div class="stock-check">
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form :model="stockDetail" label-width="120px" size="small">
        <el-form-item label="商品编码：">
          <span>111</span>
        </el-form-item>
        <el-form-item label="仓库名称：">
          <span>111</span>
        </el-form-item>
        <el-form-item label="库存类型：">
          <span>111</span>
        </el-form-item>
        <el-form-item label="修改前库存：">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="调整库存：">
          <el-row>
            <el-col :span="12">
              <el-select v-model="stockDetail.type" clearable placeholder="增减选择">

              </el-select>
            </el-col>
            <el-col :span="12">
              <el-input></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="备注：">
          <el-input type="textarea" v-model="stockDetail.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "stockCheck",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      stockDetail: {
        remark: "",
      },
    };
  },
  computed: {},
  watch: {},
  methods: {
      handleClose(){
          this.$emit('on-cancel')
      }
  },
};
</script>

<style lang="scss" scoped>
.stock-check {
  .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }
}
</style>
