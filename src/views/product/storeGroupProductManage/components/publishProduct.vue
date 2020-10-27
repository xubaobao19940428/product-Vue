<template>
  <el-dialog
    title="发布商品"
    :visible.sync="publishVisible"
    width="800"
    :before-close="handleClose"
  >
    <el-form
      :model="publishForm"
      :rules="publishRules"
      ref="ruleForm"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="第三方平台:">
        <el-select v-model="publishForm.platform" disabled></el-select>
      </el-form-item>
      <el-form-item label="销售店铺:" prop="sellerId">
        <div class="form_inline_label">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="publishForm.sellerId"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox v-for="seller in sellerInfoList" :label="seller.sellerId" :key="seller.sellerId">{{
              seller.sellerName
            }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="销售国家:" prop="countryCode">
        <div class="form_inline_label">
          <el-checkbox
            :indeterminate="isIndeterminateCountry"
            v-model="checkAllCountry"
            @change="handleCheckAllChangeCountry"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="publishForm.countryCode"
            @change="handleCheckedCitiesChangeCountry"
          >
            <el-checkbox v-for="city in cities" :label="city.countryCode" :key="city.countryCode">{{
              city.countryName
            }}</el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirmPublish('ruleForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {GetPublishInfo,PublishProduct} from '@/request/product'
const cityOptions = ["上海", "北京", "广州", "深圳"];
export default {
  name: "publishProduct",
  props: {
    publishVisible: {
      type: Boolean,
      default: false,
    },
    productId:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      publishForm: {
        platform: "LAZADA",
        sellerId: [],
        countryCode:[]
      },
      publishRules: {
         sellerId:[{required:true,message:'请挑选销售店铺',trigger:'change'}],
         countryCode:[{required:true,message:'请挑选销售国家',trigger:'change'}] 
      },
      checkAll: false,
      cities: [],
      isIndeterminate: true,
      //销售国家
      sellerInfoList:[],
      isIndeterminateCountry:false,
      checkAllCountry:false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    handleClose() {
      this.$emit("on-cancel");
    },
    handleCheckAllChange(val) {
      this.publishForm.sellerId = val ? sellerInfoList : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.sellerInfoList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.sellerInfoList.length;
    },
    handleCheckAllChangeCountry(val) {
      this.publishForm.countryCode = val ? cities : [];
      this.isIndeterminateCountry = false;
    },
    handleCheckedCitiesChangeCountry(value) {
      let checkedCount = value.length;
      this.checkAllCountry = checkedCount === this.cities.length;
      this.isIndeterminateCountry =checkedCount > 0 && checkedCount < this.cities.length;
    },
    getGetPublishInfo(){
      GetPublishInfo({}).then(resultes=>{
        if(resultes.ret.errcode==1){
          this.cities=resultes.countryInfo
          this.sellerInfoList = resultes.sellerInfo
        }
      }).catch(error=>{
        console.log(error)
      })
    },
    confirmPublish(formName){
      this.$refs[formName].validate((valid)=>{
            if(valid){
              console.log(this.publishForm,this.productId)
              let params={
                sellerId:this.publishForm.sellerId,
                countryCode:this.publishForm.countryCode,
                productId:this.productId
              }
              PublishProduct(params).then(resultes=>{
                if(resultes.ret.errcode==1){
                  this.$message.success('发布成功')
                  this.$emit('publish-success')
                  this.$refs[formName].resetFields()
                }
              })
            }
        })
    }
  },
};
</script>

<style scoped>
.form_inline_label {
  display: flex;
  flex-wrap: wrap;
}
</style>
