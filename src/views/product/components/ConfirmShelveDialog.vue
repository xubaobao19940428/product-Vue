<template>
    <div class="upload-progress-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="false" width="800px">
            <div slot="title">
                {{title}}
            </div>
            <el-table ref="productListTable" :data="checkResultList" v-loading="loading" fit highlight-current-row style="width: 100%; margin-top:16px;" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                <el-table-column label="商品ID" align="center" width="200">
                    <template slot-scope="scope">
                        <span style="color: #02A7F0">{{scope.row.productId}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="提醒" header-align="center" align="center" width="400">
                    <template slot-scope="scope" >
                        <div v-if="scope.row.ret.errcode === 4353" class="warning">
                            <p>该商品最近一次因【{{scope.row.reason}}】被下架，你确认要重新上架吗？</p>
                        </div>
                        <div v-else-if="scope.row.ret.errcode === 4354" class="danger">
                            {{scope.row.reason}}
                        </div>
                        <div v-else>{{scope.row.reason}}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="90">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.offReason === 2 || scope.row.offReason === 3 || scope.row.offReason === 5 || scope.row.offReason === 6" @click="stillShelve(scope.row)">仍要上架</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button  v-if="dialogType === 'acceptAdvice'" type="primary" size="small" @click="confirmAcceptAdvice" > 确 认 </el-button>
                <el-button v-else type="primary" size="small" @click="confirmShelve" > 确 认 </el-button>
                <el-button size="small" @click="cancel">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { batchOnShelve, batchAcceptShelveAdvice } from '@/request/product'
    export default {
        data() {
            return {
                title: '确认操作',
                loading: false,
                btnDisabled: false
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            checkResult: {
                type: Array,
                default: () => []
            },
            countryCode: {
                type: String,
                default: ''
            },
            dialogType: {
                type: String,
                default: ''
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            },
            checkResultList() {
                return this.checkResult
            }
        },
        methods: {
            cancel() {
                this.$emit('on-cancle')
            },
            /**
             * 仍要上架
            */
            stillShelve(row) {
                let params = {
                    productId: [row.productId],
                    countryCode: this.countryCode
                }
                batchOnShelve(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('上架成功')
                        _.remove(this.checkResultList, function(item) {
                            return item.productId === row.productId
                        })
                        this.$refs.productListTable.doLayout()
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            confirmShelve() {
                let productList = []
                _.forEach(this.checkResultList, item => {
                    if ((item.offReason === 0 || item.offReason === 1 || item.offReason === 4 || item.offReason === 7) && item.ret.errcode != 4354) {
                        productList.push(item.productId)
                    }
                })
                if (productList.length === 0) {
                    this.$message.warning('无可直接上架商品！')
                    return
                }
                let params = {
                    productId: productList,
                    countryCode: this.countryCode
                }
                batchOnShelve(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('上架成功')
                        this.$emit('on-confirm')
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            confirmAcceptAdvice() {
                let productList = []
                _.forEach(this.checkResultList, item => {
                    productList.push(item.productId)
                })
                let params = {
                    productId: productList,
                    countryCode: this.countryCode
                }
                if (productList.length === 0) {
                    this.$message.warning('无可直接采纳建议商品！')
                    return
                }
                batchAcceptShelveAdvice(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('操作成功')
                        this.$emit('on-confirm')
                    }
                }).catch((err) => {
                    console.error(err)
                })
            }
        }
    }
</script>

<style lang="scss">
    .upload-progress-dialog {
        .el-dialog__body {
            padding: 30px 40px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #ebeef5;
        }
        .el-dialog__body {
            padding: 50px 40px;
        }
        .el-dialog__footer {
            border-top: 1px solid #ebeef5;
        }
        .el-form--inline .el-form-item {
            margin-right: 0;
        }

    }
</style>

<style lang="scss" scoped>
    .upload-progress-dialog {
        .success {
            color: #67C23A;
        }
        .warning {
            color: #E6A23C;
        }
        .danger {
            color: #F56C6C;
        }
        .info {
            color: #909399;
        }
    }
</style>

