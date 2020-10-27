<template>
    <div class="modify-info-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <el-form label-position="left" label-width="90px" :model="logiInfo" ref="ship" style="margin-left:10px">
                <el-form-item>
                    <el-form-item label="入库单号：">{{ logiInfo.incomeNo }}</el-form-item>
                    <el-form-item label="skuCode：" v-if="logiInfo.skuCode.length > 0 ">{{ logiInfo.skuCode[0] }}</el-form-item>
                    <el-form-item label="物流类型：">国内</el-form-item>
                    <el-form-item label="物流公司：">
                        <el-select v-model="logiInfo.logiCompany" filterable placeholder="物流公司" size="medium">
                            <el-option v-for="val in logisticsCompanyList" :key="val.code" :label="val.name" :value="val.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="物流单号：">
                        <el-input v-model="logiInfo.logiCode" clearable style="width: 220px" placeholder="请输入物流单号" size="medium"></el-input>
                    </el-form-item>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import logisticsCompanyList from '@/data/company.js'

    export default {
        // 上传异常信息
        name: 'ModifyLogiNoDialog',
        data() {
            return {
                logisticsCompanyList: logisticsCompanyList,
                dialogTitle: '修改快递单号'
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            logiInfo: {
                type: Object,
                default: function() {
                    return {}
                }
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            }
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
            },
            confirm() {
                this.$emit('on-confirm', this.logiInfo)
            }
        }
    }
</script>

<style lang="scss">
    .modify-info-dialog {
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



