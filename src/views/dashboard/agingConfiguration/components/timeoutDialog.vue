<template>
    <el-dialog
    title="超时时效"
    :visible.sync="toggle"
    width="40%"
    :before-close="cancel">
    <div class="timeout-dialog">
        <div class="sysName">
            系统 ：{{timeMessage.sysName}}
        </div>
        <div class="timeName">
            时效名称：{{showTimeName(timeMessage.sysName,timeMessage.timeName)}}
        </div>
        <div class="timeType">
            时效值：
            <el-radio-group v-model="radio">
                <el-radio :label="'LOGI'" :disabled="radio === 'CUSTOM'">物流时效</el-radio>
                <el-radio :label="'CUSTOM'" :disabled="radio === 'LOGI'">自定义</el-radio>
            </el-radio-group>
            <div class="inpunt-num" v-if="radio === 'CUSTOM'">
                <el-input v-model="minDay" placeholder="" size='mini'></el-input>
                -
                <el-input v-model="maxDay" placeholder="" size='mini'></el-input> 天
            </div>
        </div>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
    </el-dialog>
</template>
<script>
    import { QueryTimeoutInfo, TimeoutUpdate } from '@/request/prescription'

    export default {
        data () {
            return {
                radio: this.timeMessage.timeType,
                minDay: this.timeMessage.minDay,
                maxDay: this.timeMessage.maxDay
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            timeMessage: Object
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
            showTimeName (sys,time) {
                if (sys === '订单' ) {
                    if (time === 'DELIVERY') {
                        return '超时发货'
                    }
                } else if (sys === '采购' ) {
                    if (time === 'PURCHASE') {
                        return '超时采购'
                    } else if (time === 'DELIVERY') {
                        return '超时发货'
                    } else if (time === 'INCOME') {
                        return '超时入库'
                    }
                } else if (sys === '仓库' ) {
                    if (time === 'OUT') {
                        return '超时出库'
                    }
                } 
            },
            getTimeoutUpdate () {
                let params = {
                    timeoutConfigNo: this.timeMessage.timeoutConfigNo,
                    minDay: Number(this.minDay),
                    maxDay: Number(this.maxDay)
                }
                console.log(params)
                TimeoutUpdate(params).then(res =>{
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.$message.success('修改成功')
                        this.$emit('on-confirm')
                    }
                })
            },
            cancel () {
                this.$emit('on-cancel')
            },
            confirm () {
                if (this.radio === 'CUSTOM') {
                    if (Number(this.minDay) > Number(this.maxDay)) {
                        this.$message.error('时效值无效')
                    } else {
                        this.getTimeoutUpdate()
                    }
                } else if (this.radio === 'LOGI') {
                    this.getTimeoutUpdate()
                }
                
            }
        }
    }
</script>
<style lang="scss">
    .timeout-dialog{
        .el-input{
            width: 70px;
        }
    }
</style>
<style lang="scss" scoped>
    .timeout-dialog{
        font-size: 14px;
        font-weight: 500;
        .sysName{
            margin: 20px 0;
        }
        .timeName{
            margin-bottom: 20px;
        }
        .inpunt-num{
            padding-left: 60px;
            padding-top: 20px;
        }
    }
</style>