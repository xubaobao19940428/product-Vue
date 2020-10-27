<template>
    <div class="upload-progress-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="false" width="800px">
            <div slot="title">
                {{title}}
            </div>
            <el-table ref="productListTable" :data="productListData" v-loading="loading" fit highlight-current-row style="width: 100%; margin-top:16px;" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                <el-table-column label="来源商品ID" align="center"  width="130">
                    <template slot-scope="scope">
                        <el-link type="primary" :underline="false" :href="'https://detail.1688.com/offer/'+ scope.row.orgId+ '.html'" target="_blank">{{scope.row.orgId}}</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="状态" header-align="center" align="center" width="500">
                    <template slot-scope="scope" >
                        <div v-if="scope.row.fetchStatus === 1" class="danger">
                            <p v-for="(item, index) in scope.row.result" :key="index">
                                {{item}}
                            </p>
                        </div>
                        <div v-if="scope.row.fetchStatus === 2" class="warning">
                            <p v-for="(item, index) in scope.row.result" :key="index">
                                {{item}}
                            </p>
                        </div>
                        <div v-if="scope.row.fetchStatus === 3" class="success">
                            <p v-for="(item, index) in scope.row.result" :key="index">
                                {{item}}
                            </p>
                        </div>
                        <div v-if="scope.row.fetchStatus === 4" class="info">
                            <p v-for="(item, index) in scope.row.result" :key="index">
                                {{item}}
                            </p>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="90">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.fetchStatus === 2" @click="confirmUpload(scope.row.oneKeyId)">确认上传</el-button>
                        <el-button type="text" v-if="scope.row.flag === true && scope.row.oneKeyId != ''" @click="jumpToProduct(scope.row.oneKeyId)">去看看</el-button>
                        <el-button type="text" v-if="scope.row.flag === true && scope.row.draftId != ''" @click="jumpToProductDraft(scope.row.draftId)">去看看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary"  @click="goToCheck" size="small" :disabled="btnDisabled"> 去审核 </el-button>
                <el-button @click="continueUpload" size="small" :disabled="btnDisabled">继续上传</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { oneKeyUploadProduct, checkToBeConfirm} from '@/request/product'
    export default {
        data() {
            return {
                title: '上传进度',
                loading: false,
                productListData: [
                    // {
                    //     productId: '525395652086',
                    //     status: 1,
                    //     statusStr: '成功'
                    // },  {
                    //     productId: '525395652086',
                    //     status: 2,
                    //     statusStr: '待确认'
                    // },  {
                    //     productId: '525395652086',
                    //     status: 3,
                    //     statusStr: '失败'
                    // },  {
                    //     productId: '525395652086',
                    //     status: 4,
                    //     statusStr: '等待中...'
                    // }
                ],
                btnDisabled: false
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            sourceResult: {
                type: Object,
                default: () => {}
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            },
            languageList() {
                return JSON.parse(this.getStore('languageList'))
            },
            countryList() {
                return JSON.parse(this.getStore('countryList'))
            },
        },
        watch: {
            toggle: function(newValue, oldValue) {
                if (newValue) {
                    this.oneKeyUploadProduct()
                }
            }
        },
        methods: {
            goToCheck() {
                this.$router.push({
                    name: 'productCheck'
                })
                this.loading = false
            },
            continueUpload() {
                this.$emit('on-continue')
                this.loading = false
            },
            /**
             *  根据外源商品id一键上货
             * */
            oneKeyUploadProduct() {
                this.loading = true
                this.productListData = []
                let countryCodeList = []
                let languageCodeList = []
                _.forEach(this.countryList, country => {
                    countryCodeList.push(country.shortCode)
                })
                _.forEach(this.languageList, language => {
                    languageCodeList.push(language.code)
                })
                this.sourceResult.countryCode = countryCodeList
                this.sourceResult.languageCode = languageCodeList
                oneKeyUploadProduct(this.sourceResult).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        _.forEach(res.fetchResult, item => {
                            let flag = false
                            _.forEach(item.result, info => {
                                if (info.indexOf('本商品已存在') != -1) {
                                    flag = true
                                }
                            })
                            item.flag = flag
                        })
                       this.productListData = res.fetchResult
                    }
                    this.loading = false
                }).catch(err => {
                    console.log(err)
                })
            },
            confirmUpload(id) {
                let params = {
                    oneKeyId: id
                }
                checkToBeConfirm(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('确认上传成功')
                        // 更新数据状态
                        _.forEach(this.productListData, row => {
                            if (row.oneKeyId === id) {
                                row.fetchStatus = 3
                                row.result = ['成功']
                            }
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            jumpToProduct(id) {
                let routeData = this.$router.resolve({
                    path: `/product/productEditNew?productId=${id}`
                });
                window.open(routeData.href, '_blank');
            },
            jumpToProductDraft(id) {
                let routeData = this.$router.resolve({
                    path: `/product/productEditNew?draftId=${id}`
                });
                window.open(routeData.href, '_blank');
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

