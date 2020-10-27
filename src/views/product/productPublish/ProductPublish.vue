<template>
    <div class="app-container product-publish-wrapper">
        <div class="main-content-wrapper product-publish">
            <el-row :gutter="30">
                <el-col :span="6">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>手工录入</span>
                        </div>
                        <div class="publish-info">
                            <p>1. 需要提前准备好商品的标题、图片、参数等各项资料；</p>
                            <p>2. 依次录入商品的各项资料；</p>
                            <p>3. 完成录入后，商品以草稿形式推送到审核列表中，审核成功即正式生效；</p>
                            <p>4. 等待商品审核并上架。</p>
                        </div>
                        <div class="operate">
                            <el-button type="primary" plain class="publish-button" @click="addProduct">开始发布</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>ID上货</span>
                        </div>
                        <div class="publish-info">
                            <p>1. 提前准备好1688等网站的商品ID或商品链接；</p>
                            <p>2. 点击开始发布>>选择商品来源(目前仅支持1688)>>输入来源平台的商品ID，点击上传，系统将自动获取商品数据并自动填充到新增商品页；</p>
                            <p>3. 检查并修改或补充商品信息，完成定价，然后点击保存；</p>
                            <p>4. 等待商品审核并上架。</p>
                        </div>
                        <div class="operate">
                            <el-button type="primary" plain class="publish-button" @click="startPublish">开始上货</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>搜索上货</span>
                        </div>
                        <div class="publish-info">
                            <p>1. 填写搜索关键词；</p>
                            <p>2. 填写计划上货数量；</p>
                            <p>3. 选择商品归属的后台类目；</p>
                            <p>4. 点击确定上货，稍等5分钟后进去商品管理列表即可看到找货结果；</p>
                            <p>5. 系统已经按照价格、重量等因素去除不符合要求的商品，并为您自动完成图片、标题的处理。</p>
                        </div>
                        <div class="operate">
                            <el-button type="primary" plain class="publish-button" @click="startDistribution">开始上货</el-button>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="6">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>以图找货</span>
                        </div>
                        <div class="publish-info">
                            <p>1. 本功能为试行版，主要以人工操作为主；</p>
                            <p>2. 选择目标图片并下载；</p>
                            <p>3. 将图片上传至1688的以图找货功能中进行识别；</p>
                            <p>4. 从1688给出的结果中，挑选符合要求的商品并记录商品ID；</p>
                            <p>5. 最后使用ID上货完成商品发布即可。</p>
                        </div>
                        <div class="operate">
                            <el-button type="primary" plain class="publish-button" @click="showSerachProcuct">开始找货</el-button>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <one-key-upload-dialog :dialogVisible="uploadDialogVisible" @on-cancle="handleCanclePublish" @on-confirm="handleConfirmPublish"></one-key-upload-dialog>
        <upload-progress-dialog :dialogVisible="progressDialogVisible" :sourceResult="sourceResult" @on-continue="handleContinueUpload"></upload-progress-dialog>
        <auto-distribution-dialog :dialogVisible="autoDistributionDialogVisible" @on-cancle="handleCancleDistribution" @on-confirm="handleConfirmDistribution"></auto-distribution-dialog>
        <search-product-by-img-dialog :dialogVisible="searchProductByImgDialogVisible" @on-close="handleClose"></search-product-by-img-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import OneKeyUploadDialog from './OneKeyUploadDialog'
    import UploadProgressDialog from './UploadProgressDialog'
    import AutoDistributionDialog from './AutoDistributionDialog'
    import SearchProductByImgDialog from './SearchProductByImgDialog'
    // import {} from '@/request'

    export default {
        // 发布商品
        name: 'ProductPublish',
        data() {
            return {
                uploadDialogVisible: false,
                progressDialogVisible: false,
                autoDistributionDialogVisible: false,
                searchProductByImgDialogVisible: false,
                sourceResult: {
                    source: null,
                    sourceProductId: []
                }
            }
        },
        components: {
            OneKeyUploadDialog,
            UploadProgressDialog,
            AutoDistributionDialog,
            SearchProductByImgDialog
        },
        mounted() {
        },
        computed: {

        },
        watch: {

        },
        methods: {
            addProduct () {
                this.$router.push({
                    name: 'productEditNew'
                })
            },
            startPublish() {
                this.uploadDialogVisible = true
            },
            handleCanclePublish() {
                this.uploadDialogVisible = false
            },
            handleConfirmPublish(sourceResult) {
                // this.uploadDialogVisible = false
                this.sourceResult = sourceResult
                this.progressDialogVisible = true
            },
            handleContinueUpload() {
                this.progressDialogVisible = false
                this.uploadDialogVisible = true
            },
            startDistribution() {
                this.autoDistributionDialogVisible = true
            },
            handleCancleDistribution() {
                this.autoDistributionDialogVisible = false
            },
            handleConfirmDistribution() {
                this.autoDistributionDialogVisible = false
            },
            showSerachProcuct() {
                this.searchProductByImgDialogVisible = true
            },
            handleClose() {
                this.searchProductByImgDialogVisible = false
            }
        }
    }
</script>

<style lang="scss">
    .product-publish-wrapper {
        .el-card__header {
            text-align: center;
            padding:26px 20px;
            font-size: 20px;
        }
        .el-card__body {
            padding: 0;
        }
    }
</style>

<style lang="scss" scoped>
    .product-publish-wrapper {
        .product-publish {
            width: 1200px;
            margin: 0 auto;
            padding-top: 70px;
            .box-card {
                height: 500px;
                .publish-info {
                    height: 340px;
                    padding: 30px;
                    p {
                        line-height: 24px;
                        font-weight: 300;
                        font-size: 14px;
                        color: #333333;
                        margin-bottom: 4px;
                    }
                }
                .operate {
                    text-align: center;
                    .publish-button {
                        width: 180px;
                        height: 44px;
                        font-size: 20px;
                    }
                }
            }
        }
        .add-category {
            text-align: center;
            border-top: 1px solid #EBEEF5;
            .el-button {
                padding: 16px;
            }
        }
    }
</style>


