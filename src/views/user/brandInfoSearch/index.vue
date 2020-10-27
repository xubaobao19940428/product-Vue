<template>
    <div class="app-container">
        <el-form ref="form" label-width="80px" :rules="rules" :model="param">
            <el-form-item label="用户ID：" prop="skuCode">
                <el-input placeholder="请输入用户ID" v-model="param.userId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">确定</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="dataList"
                  border
                  max-height="700px"
                  style="width: 100%">
            <el-table-column label="自购"
                             prop="selfBuying">
            </el-table-column>
            <el-table-column label="自售"
                             prop="selfSales">
            </el-table-column>
            <el-table-column label="有效团队销售额"
                             prop="effTeamSales"
                             min-width="120px">
            </el-table-column>
            <el-table-column label="全部团队销售额"
                             prop="totalTeamSales"
                             min-width="120px">
            </el-table-column>
            <el-table-column label="有效团队销售额（美金）"
                             prop="effTeamUsd"
                             min-width="120px">
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import { GetBrandSalesInfo } from '@/request/user'
    export default {
        data () {
            return {
                param: {
                    userId: ''
                },
                rules: {
                    userId: [{ required: true, message: '不能为空', trigger: 'change' }]
                },
                dataList: []
            }
        },
        methods: {
            onSubmit () {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        GetBrandSalesInfo(this.param).then((res) => {
                            if (res.ret.errcode === 1) {
                                this.dataList = [res]
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
