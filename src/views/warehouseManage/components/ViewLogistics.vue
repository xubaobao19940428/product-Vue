<template>
    <el-dialog
        title="查看物流"
        :visible.sync="toggle"
        width="700px"
        :before-close="cancle"
        class="view-logis">
        <el-tabs v-model="bundle" @tab-click="handleTabs">
            <el-tab-pane
                :key="index"
                v-for="(item, index) in bundList"
                :label="'包裹'+ (index+1)"
                :name="(index).toString()"
            >
                <div class="package-box">
                    <img :src="dealShowFileSrc(item.skuInfo[0].productCover)" class="package-img"/>
                    <div class="package-shadow"></div>
                    <div class="package-num">X{{item.skuInfo[0].count}}</div>
                </div>
                <div class="content">
                    <div class="content-company">物流公司：<span>{{item.logiCompany}}</span></div>
                    <div class="content-code">
                        运单号：{{item.logiCode}}
                        <i class="el-icon-document-copy" v-clipboard:copy="item.logiCode" v-clipboard:success="onCopy" v-clipboard:error="onError">点击复制</i>
                    </div>
                </div>
                <div class="content-time">发货时间：{{item.shipTime}}</div>
                <div class="content-prompt">温馨提示：如您的订单由多个包裹组成，点击可切换不同包裹的物流信息</div>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancle">关 闭</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import VueClipboard from 'vue-clipboard2'
    Vue.use(VueClipboard)

    export default {
        data() {
            return {
                bundle: '0',
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            bundList: Array
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {}
            },
        },
        methods: {
            handleTabs (val) {
                // console.log(val.name)
                this.bundle = val.name
            },
            //复制链接
            onCopy () {
                this.$message({
                    message: `复制成功！`,
                    type: 'success'
                });
            },
            onError () {
                this.$message.error(`复制失败！`)
            },
            cancle () {
                this.$emit('on-cancle')
            },
            confirm () {
                this.$emit('on-confirm')
            }
        },
    }
</script>
<style lang="scss" scoped>
    .view-logis{
        .el-icon-document-copy{
            color: #409EFF;
            cursor: pointer;
        }
        .package-box{
            position: relative;
            .package-img{
                width: 100px;
                height: 100px;
            }
            .package-shadow{
                position: absolute;
                width: 100px;
                height: 30px;
                bottom: 0px;
                background: black;
                opacity: 0.3;
            }
            .package-num{
                position: absolute;
                bottom: 5px;
                width: 100px;
                text-align: center;
                z-index: 3;
                color: #fff;
            }
        }
        .content{
            .content-company{
                padding: 10px 0;
                font-weight: 500;
                span{
                    color: #409EFF;
                    font-weight: 400;
                }
            }
            .content-code{
                padding: 10px 0 5px 0;
            }

        }
        .content-time{
            padding: 5px 0 5px 0;
        }
        .content-prompt{
            padding: 5px 0 5px 0;
            font-weight: 500;
        }
    }
</style>
