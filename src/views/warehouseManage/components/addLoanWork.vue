<template>
  <div class="add_loan_work">
    <el-dialog title="添加货代工作号" :visible.sync="dialogFormVisible" :before-close="cancelLoan">
    <el-form :model="form" label-width="120px">
        <el-form-item label="出库单号：" :label-width="formLabelWidth">
         <el-input v-model="form.outNo" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="物流单号：" :label-width="formLabelWidth">
         <el-input v-model="form.logiNo" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="货代工作号：" :label-width="formLabelWidth">
         <el-input v-model="form.jobNo" autocomplete="off" placeholder="请输入货代公司工作号"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="cancelLoan">取 消</el-button>
        <el-button type="primary" @click="updateLoan">确 定</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'AddLoanWork',
  props:{
      form:{
          type:Object,
          default:()=>{
              return {
                  logiNo:'',
                  jobNo:'',
                  outNo:''
              }
          }
      },
      dialogFormVisible:{
          type:Boolean,
          default:false
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
      cancelLoan(){
          this.$emit('on-cancel')
      },
      updateLoan(){
          this.$emit('on-submit',this.form)
      }
  },
};
</script>

<style scoped>

</style>
