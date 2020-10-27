<template>
    <div class="trend-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="true" width="900px" @close="close">
            <div slot="title">
                {{title}}
            </div>
            <div style="height: 400px;">
                <line-chart :lineData="lineData"></line-chart>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import LineChart from './TrendLineChart'

    export default {
        data() {
            return {
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: '转化率趋势'
            },
            lineData: {
                type: Object,
                default: () => {}
            },
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            }
        },
        components: {
            LineChart
        },
        methods: {
            close() {
                console.log('close')
                this.$emit('on-close')
            }
        }
    }
</script>

<style lang="scss">
    .trend-dialog {
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


