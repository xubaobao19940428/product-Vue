<template>
    <div class="upload-logi-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="950px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="compositeProductForm">
                <el-form-item label="子订单号：">
                    {{logiInfo.suborderId}}
                </el-form-item>
                <el-form-item label="物流信息：">
                    <div class="logistics-info-wrapper">
                        <div v-for="(item, index) in logiInfo.expressInfo" :key="index" class="logiItem">
                            <!-- <el-input v-model="item.expressCompany" placeholder="物流公司名" style="width: 180px"></el-input> -->
                            <el-select v-model="item.expressCode" size="medium" placeholder="请选择物流公司">
                                <el-option v-for="(item, key) in expressCompanyList" :key="key" :label="item.name" :value="item.code">
                                </el-option>
                            </el-select>
                            <el-input v-model="item.expressNo" placeholder="物流单号" size="medium" style="width: 300px; margin-right: 8px;"></el-input>
                            <i v-if="index != 0" class="el-icon-circle-close" @click="deleteLogistics(index)"></i>
                        </div>
                        <el-button @click="addLogistics" size="small">+ 新 增</el-button>
                    </div>
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
    import _ from 'lodash'
    import { logiCompanyList } from '@/request/warehouse'
    export default {
        // 上传物流信息
        name: 'UploadLogiInfoDialog',
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
        data() {
            return {
                dialogTitle: '填写物流信息',
                expressCompanyList: []
            }
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {
                }
            }
        },
        created() {
            this.getLogiCompanyList()
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
            },
            confirm() {
                if (this.verifyLogiInfo(this.logiInfo.expressInfo)) {
                    this.$emit('on-confirm', this.logiInfo)
                } else {
                    this.$message.warning('物流信息不能为空！')
                }

            },
            addLogistics() {
                let logiItem = {
                    expressNo: '',
                    expressCode: ''
                }
                this.logiInfo.expressInfo.push(logiItem)
            },
            deleteLogistics(index) {
                if (this.logiInfo.expressInfo.length > 1) {
                    this.logiInfo.expressInfo.splice(index, 1)
                } else {
                    this.$message.warning('至少有一条物流信息！')
                }
            },
            verifyLogiInfo (data) {
                let flag = true
                _.forEach(data, logi => {
                    _.forEach(logi, item => {
                        if (_.isEmpty(item)) {
                            flag = false
                        }
                    })
                })
                return flag
            },
            getLogiCompanyList() {
                logiCompanyList().then(res => {
                    if (res.ret.errcode === 1) {
                        this.expressCompanyList = res.company
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss">
.upload-logi-dialog {
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
    .logistics-info-wrapper {
        padding-left: 70px;
        .logiItem {
            margin-bottom: 10px;
        }
    }
</style>




