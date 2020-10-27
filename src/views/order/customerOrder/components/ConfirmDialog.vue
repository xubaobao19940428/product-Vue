<template>
    <div class="confirm-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="true" width="400px" >
            <div slot="title">
                <i class="el-icon-warning icon"></i>{{title}}
            </div>
            <p class="warning">{{text}}</p>
            <div slot="footer" class="dialog-footer">
                <!-- <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button> -->
            </div>
        </el-dialog>
    </div>
</template>

<script>
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
                default: '提示'
            },
            text: {
                type: String,
                default: ''
            },

        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {
                }
            },
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
            },
            confirm() {
                this.$emit('on-confirm')
            }
        }
    }
</script>

<style lang="scss">
.confirm-dialog {
    .el-dialog__header {
        border-bottom: none !important;
    }
    .el-dialog__body {
        padding: 0px 40px;
    }
    .el-dialog__footer {
        border-top: none !important;
    }
}
</style>

<style lang="scss" scoped>
.icon {
    margin-right: 6px;
    font-size: 18px;
    color: #E6A23C;
}
.warning {
    color: #F56C6C;
    line-height: 24px;
}
</style>




