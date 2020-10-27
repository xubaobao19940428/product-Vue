<template>
    <el-dialog
        title="批量发起售后"
        :visible.sync="toggle"
        width="80%"
        :before-close="cancel" class="initate-sale">
        <el-form ref="afterSaleFilter" :rules="rules" :label-position="'left'" inline :model="queryData" class="initate-form">
            <el-form-item label="售后原因：" prop="reason">
                <el-select v-model="queryData.reason" filterable clearable placeholder="请选择" size="medium">
                    <el-option v-for="item in reasonList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否发放补偿券：" prop="isVouchers">
                <el-radio-group v-model="queryData.isVouchers">
                    <el-radio :label="1">不发放</el-radio>
                    <el-radio :label="2">发放</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <initate-table></initate-table>
        <special-table></special-table>
        <div class="initate-prompt">
            <div><i class="iconfont icon-prompt">&#xe72b;</i>共有13笔B类订单（礼包订单/品牌馆订单/Costgo订单等），请确认是否仍需发起售后</div>
            <div class="prompt-see">
                <i class="iconfont">&#xe671;</i>
                <span>查看</span><span>取消查看</span>
            </div>
        </div>
        <div class="initate-prompt">
            <div><i class="iconfont icon-prompt">&#xe72b;</i>共有13条数据验证不通过而无法售后，请按照上传模板填写表格</div>
            <div class="prompt-see">
                <i class="iconfont">&#xe671;</i>
                <span>查看</span><span>取消查看</span>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取消操作</el-button>
            <el-button type="primary" @click="confirm">确定对选中条目发起售后</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { AllReturnReason } from '@/request/afterSale'
    import initateTable from './initateTable'
    import specialTable from './specialTable'

    export default {
        data () {
            return {
                queryData: {
                    reason: '',
                    isVouchers: 1
                },
                reasonList: [],
                rules:{
                    reason: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                    isVouchers: [{ required: true, message: '请至少选择一个', trigger: 'change' }]
                }
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        components: {
            initateTable,
            specialTable
        },
        mounted () {
            this.getAllReturnReason()
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            },
        },
        methods: {
            getAllReturnReason () {
                AllReturnReason({}).then(res => {
                    if (res.ret.errcode === 1) {
                        this.reasonList = res.refundReason
                    }
                })
            },
            getCountryImg (code) {
                let item = this.countryList.find((val) => {
                    return val.shortCode == code
                })
                return item ? this.dealShowFileSrc(item.image) : ''
            },
            cancel () {

            },
            confirm () {

            }
        }
    }
</script>
<style lang="scss" scoped>
    .initate-sale{
        .initate-form{
            display: flex; 
        }
        .initate-prompt{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 30px;
            margin-top: 10px;
            background-color: rgb(228,228,228);
            .icon-prompt{
                margin: 0 10px;
                color: red;
            }
            .prompt-see{
                color: #409EFF;
                margin-right: 10px;
                .iconfont{
                    margin-right: 5px;
                }
            }
        }
    }
    
</style>