<template>
  <div class="dialog_edit">
      <el-dialog title="编辑货代详情" :visible.sync="dialogFormVisible" :before-close="closeEditDialog" width="40%">
            <el-form :model="editFormDetail" label-position="left">
                <el-form-item label="货代工作号" :label-width="formLabelWidth">
                <el-input v-model="editFormDetail.jobNo" autocomplete="off" disabled></el-input>
                </el-form-item>
                <el-form-item label="物流单号" :label-width="formLabelWidth" >
                    <el-form-item v-for="(item,index) in editFormDetail.logiNo" :key="index" style="margin-bottom:5px">
                      <el-input v-model="editFormDetail.logiNo[index].logiNo" autocomplete="off" style="width:70%"></el-input>
                      <el-button @click="deleteLogiNo(index)" type="primary" style="margin-left:5px;">删除</el-button>
                    </el-form-item>
                    <el-button @click="addLogiNo" size="small" type="primary">添加物流单号</el-button>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeEditDialog">取 消</el-button>
                <el-button type="primary" @click="updateLoan">确 定</el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'DialogEditLoan',
  props:{
      editForm:{
          type:Object,
          default:{
              jobNo:'',
              logiNo:[
                  {logNo:''}
              ]
          }
      },
      dialogFormVisible:{
          type:Boolean,
          default:false
      }
  },
  data() {
    return {
        formLabelWidth:'120px',
        editFormDetail:this.editForm
        
    };
  },
  computed:{
  },
  watch:{
  },
  methods: {
      closeEditDialog(){
          this.$emit('on-cancel')
      },
      updateLoan(){
          this.$emit('on-submit',this.editFormDetail)
      },
      addLogiNo(){
          this.editFormDetail.logiNo.push({
              logiNo:''
          })
      },
      deleteLogiNo(index){
          if(index==0){
              
          }else{
              this.editFormDetail.logiNo.splice(index,1)
          }
      }
  },
};
</script>

<style scoped>

</style>
