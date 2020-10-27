<template>
  <div class="dialog_table">
        <el-dialog title="查看出库单商品详情" :visible.sync="dialogTableVisible" width="60%" :show-close="false">
            <el-table :data="gridData" style="text-align:center;width:100%" border>
                <el-table-column property="outNo" label="出库单号" align="center"></el-table-column>
                <el-table-column  label="SKU图片" align="center">
                     <template slot-scope="scope">
                <el-popover placement="top-start" trigger="hover">
                    <img :src="dealShowFileSrc(scope.row.skuCover)" class="previewImage">
                    <img :src="dealShowFileSrc(scope.row.skuCover)" class="thumbnail image-box" slot="reference">
                </el-popover>
            </template>
                </el-table-column>
                <el-table-column property="skuId" label="商品ID" align="center"></el-table-column>
                <el-table-column property="skuName" label="商品名称" align="center"></el-table-column>
                <el-table-column property="skuCode" label="SKUcode" align="center"></el-table-column>
                <el-table-column property="values" label="规格" align="center"></el-table-column>
                <el-table-column property="count" label="数量" align="center"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeDetailDialog" type="primary">关 闭</el-button>
            </div>
        </el-dialog>  
  </div>
</template>

<script>
export default {
  name: 'DialogTableLoan',
  props:{
      dialogTableVisible:{
          type:Boolean,
          default:false
      },
      gridData:{
          type:Array,
          default:()=>{
              return []
          }
      }
  },
  data() {
    return {
        
    };
  },
  computed:{
  },
  watch:{
  },
  methods: {
      closeDetailDialog(){
          this.$emit('on-cancel')
      }
  },
};
</script>

<style scoped>

</style>
