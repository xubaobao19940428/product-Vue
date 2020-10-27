<template>
    <div class="eidt-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="false" width="800px">
            <div slot="title">
                {{title}}
            </div>
            <el-form ref="liveEditForm" :model="liveModel" :rules="ruleValidate" label-width="150px">
                <el-form-item label="商品ID：" prop="productId">
                    <el-input v-model="liveModel.productId" clearable size="medium" placeholder="请输入商品ID" style="width: 320px"></el-input>
                </el-form-item>
                <el-form-item label="适用国家：" prop="countryCode">
                    <el-select v-model="liveModel.countryCode" size="medium">
                        <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="直播链接：" prop="liveUrl">
                    <el-input v-model="liveModel.liveUrl" clearable size="medium" placeholder="请输入直播链接" style="width: 320px"></el-input>
                </el-form-item>
                <el-form-item label="开播时间：" prop="startTime">
                    <el-date-picker v-model="liveModel.startTime" type="datetime" placeholder="选择" value-format="timestamp"></el-date-picker>
                </el-form-item>
                <el-form-item label="商品开始时刻：" prop="adviceTime">
                    <el-time-picker v-model="liveModel.adviceTime" value-format="HH:mm:ss" placeholder="建议开播后及时填写"></el-time-picker>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { UpdateOrInsertLiveProduct } from '@/request/product'
    export default {
        data () {
            return {
                ruleValidate: {
                    productId: [{ required: true, trigger: 'blur', message: '商品ID不能为空' }],
                    liveUrl: [{ required: true, trigger: 'blur', message: '直播链接不能为空' }],
                    countryCode: [{ required: true, trigger: 'change', message: '请选择国家' }],
                    startTime: [{ required: true, trigger: 'change', message: '不能为空' }]
                }
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            liveData: {
                type: Object,
                default: function () {
                    return {}
                }
            }

        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible
                },
                set: function () {}
            },
            liveModel: function () {
                return this.liveData
            },
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        methods: {
            cancel () {
                this.$emit('on-cancel')
                this.$refs.liveEditForm.resetFields()
            },
            confirm () {
                this.$refs.liveEditForm.validate((valid) => {
                    if (valid) {
                        this.liveModel.startTime = this.liveModel.startTime + ''
                        this.liveModel.adviceTime = this.liveModel.adviceTime ? this.liveModel.adviceTime + '' : ''
                        UpdateOrInsertLiveProduct({
                            liveProductPb: this.filterData(this.liveModel)
                        }).then((res) => {
                            if (res.ret.errcode === 1) {
                                this.$message.success('成功！')
                                this.$emit('on-confirm', this.liveModel)
                                this.$refs.liveEditForm.resetFields()
                            }
                        }).catch((err) => {
                            console.log(err)
                        })
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .eidt-dialog {
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
        .limit-num-tip {
            color: #000;
        }
    }
</style>
