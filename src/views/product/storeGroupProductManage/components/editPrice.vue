<template>
  <el-dialog
    title="编辑价格"
    :visible.sync="editPriceDialog"
    width="1200px"
    :before-close="handleClose"
  >
    <el-form
      :model="editPriceForm"
      ref="ruleForm"
      label-width="100px"
      label-position="left"
      inline="true"
    >
      <el-form-item label="商品ID:">
        <span>{{ editPriceForm.productId }}</span>
      </el-form-item>
      <el-form-item label="商品名称:">
        <span>{{ editPriceForm.productName }}</span>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane
        v-for="(item, index) in tableData"
        :key="index"
        :label="item.name"
        :name="item.countryCode"
      >
        <el-form
          :model="item.productDetail"
          :rules="ruleValidate"
          :ref="'productDetail' + item.countryCode"
        >
          <el-table
            ref="multipleTable"
            height="100%"
            :data="item.productDetail"
            border
            style="width: 100%"
            :header-cell-style="{ background: '#F5F7FA', color: '#606266' }"
          >
            <el-table-column prop="comeFrom" label="SKUID" align="center">
            </el-table-column>
            <el-table-column prop="comeFrom" label="规格1" align="center">
            </el-table-column>
            <el-table-column prop="comeFrom" label="规格2" align="center">
            </el-table-column>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope"> 供货价 </template>
            </el-table-column>
            <el-table-column prop="comeFrom" align="center">
              <template slot="header" slot-scope="scope">
                <span style="color: red">*</span>销售价(THB)
              </template>
              <template slot-scope="scope">
                <el-form-item required>
                  <el-input-number
                    v-model="scope.row.salePrice"
                    :precision="2"
                    :step="0.01"
                    controls-position="right"
                    size="small"
                  ></el-input-number>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="comeFrom" align="center">
              <template slot="header" slot-scope="scope">
                <span style="color: red">*</span>活动价(THB)
              </template>
              <template slot-scope="scope">
                <el-form-item required>
                  <el-input-number
                    v-model="scope.row.activePrice"
                    :precision="2"
                    :step="0.01"
                    controls-position="right"
                    size="small"
                  ></el-input-number>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="comeFrom" align="center" width="180">
              <template slot="header" slot-scope="scope">
                <span style="color: red">*</span>活动开始时间
              </template>
              <template slot-scope="scope">
                <el-form-item required>
                  <el-date-picker
                    size="small"
                    v-model="scope.row.startTime"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="comeFrom" align="center" width="180">
              <template slot="header" slot-scope="scope">
                <span style="color: red">*</span>活动结束时间
              </template>
               <template slot-scope="scope">
                <el-form-item required>
                  <el-date-picker
                    size="small"
                    v-model="scope.row.endTime"
                    type="date"
                    value-format="timestamp"
                    placeholder="选择日期"
                  >
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: "editPrice",
  props: {
    editPriceDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeName: "MY",
      editPriceForm: {
        productId: "11111111111",
        productName: "22222",
      },
      ruleValidate: {
        salePrice: [
          {
            required: true,
            trigger: "blur",
            message: "不能为空",
          },
        ],
        activePrice: [
          {
            required: true,
            trigger: "blur",
            message: "不能为空",
          },
        ],
      },
      tableData: [
        {
          countryCode: "MY",
          name: "马来西亚",
          productDetail: [
            {
              salePrice: 11.11,
              activePrice: 11,
              startTime: 1483326245000,
              endTime: 1483326245000,
            },
          ],
        },
        {
          countryCode: "TH",
          name: "泰国",
          productDetail: [
            {
              salePrice: 11.11,
              activePrice: 11,
            },
          ],
        },
      ],
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleClose() {
      this.$emit("on-cancel");
    },
  },
};
</script>

<style lang="scss" scoped>
.form_inline_label {
  display: flex;
  flex-wrap: wrap;
}
 /deep/ .el-date-editor.el-input{
     width:150px;
 }
 /deep/ .el-input-number{
     width:120px;
 }
</style>
