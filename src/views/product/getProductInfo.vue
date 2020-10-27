<template>
  <div class="app-container">
    <el-form ref="form" label-width="80px" :rules="rules" :model="param">
        <el-form-item label="国家：" prop="countryCode">
            <el-select v-model="param.countryCode" clearable placeholder="请选择" size="medium">
                <el-option v-for="(item, index) in countryList"
                           :key="index"
                           :label="item.nameEn + '/' + item.nameCn "
                           :value="item.shortCode"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="商品编码：" prop="skuCode">
            <el-input placeholder="请输入商品编码" v-model="param.skuCode"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              max-height="700px"
              style="width: 100%">
      <el-table-column label="商品编码"
                       fixed="left"
                       prop="skuCode"
                       min-width="200px">
      </el-table-column>
      <el-table-column label="是否有效"
                       min-width="100px">
        <template slot-scope="scope">
          {{ scope.row.saleStatus == 1 ? '有效' : '无效' }}
        </template>
      </el-table-column>
      <el-table-column label="商品名称"
                       prop="title"
                       min-width="240px">
      </el-table-column>
      <el-table-column label="SKU属性"
                       prop="standardAttrStr"
                       min-width="120px">
      </el-table-column>
      <el-table-column label="SKU图片"
                       min-width="180px">
        <template slot-scope="scope">
          <el-popover placement="top-start" trigger="hover">
            <img :src="dealShowFileSrc(scope.row.skuCover)" class="previewImage">
            <img :src="dealShowFileSrc(scope.row.skuCover)" class="thumbnail" slot="reference">
          </el-popover>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
    import { getProductSkuInfoBySkuCode } from '@/request/product'
    export default {
        data () {
            return {
                param: {
                    countryCode: '',
                    skuCode: ''
                },
                rules: {
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }],
                    skuCode: [{ required: true, message: '不能为空', trigger: 'change' }]
                },
                dataList: []
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        methods: {
            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        getProductSkuInfoBySkuCode(this.param).then((res) => {
                            if (res.ret.errcode === 1) {
                                if (res.productSkuInfo) {
                                    this.dataList = [res.productSkuInfo]
                                } else {
                                    this.$message.warning('商品不存在')
                                }
                            }
                        })
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
  .thumbnail{
   width: 140px;
 }
</style>
