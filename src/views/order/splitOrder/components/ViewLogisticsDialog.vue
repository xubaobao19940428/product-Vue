<template>
    <el-dialog title="查看物流" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
        <el-tabs v-if="expressList.length > 0" @tab-click="getExpressInfo">
            <el-tab-pane v-for="(item, index) in expressList" min-width="120" align="center" :key="index" :label='"物流"+ index+1'>
                <el-row>
                    <el-col :span="12"><p>物流单号：{{item.expressNo}}</p></el-col>
                    <el-col :span="12"><p>子订单号：{{suborderId}}</p></el-col>
                </el-row>
                <div class="iframe-wrapper">
                    <iframe id="appIfm" v-if="webUrl" width="375" height="667" :src="webUrl"></iframe>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div v-else>
            暂无物流信息
        </div>
        <div slot="footer" class="dialog-footer">
        </div>
    </el-dialog>
</template>
<script>
    import common from '@/views/purchaseManage/common/common'
    export default {
        name: 'viewLogistics',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            suborderId: {
                type: String,
                default: ''
            },
            expressList: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data () {
            return {
                currentTab: 'DOMESTIC',
                webUrl: ''
            }
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible
                },
                set: function () {
                }
            },
            expressInfoList () {
                return this.logisticsSingleList
            }
        },
        created () {

        },
        components: {},
        methods: {
            cancle () {
                this.$emit('on-close')
            },
            // Todo
            getExpressInfo () {

            }
        }
    }
</script>

<style lang="scss" scoped>
    #logistic-detail {
        width: 500px;
    }
    .iframe-wrapper{
        position: relative;
        overflow: hidden;
        #appIfm{
            position: relative;
            top: -95px;
        }
    }
</style>
