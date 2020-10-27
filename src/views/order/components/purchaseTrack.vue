<template>
    <el-dialog title="采购追踪" width="700px"
               append-to-body
               :visible="propShowDialog"
               @close="close">
        <div>
            <template v-if="Object.keys(trackInfo).length > 0">
                <div v-if="trackInfo.receiverName">收货人姓名：{{ trackInfo.receiverName }}</div>
                <div class="mar-t-10" v-if="trackInfo.receiverPhone">收货手机号：{{ trackInfo.receiverPhone }}</div>
                <div class="mar-t-10" v-if="trackInfo.status">订单状态：{{ trackInfo.status | statusFilter }}</div>
                <div class="mar-t-10" v-if="trackInfo.createTime">创建时间： {{ trackInfo.createTime | formatTime }}</div>
                <div class="mar-t-10" v-if="trackInfo.payTime">支付时间： {{ trackInfo.payTime | formatTime }}</div>
            </template>
            <div v-for="(item, i) in orderDetail"
                 :key="i">
                <div class="mar-b-20 mar-t-10">订单号：{{ trackInfo.orderNo }}</div>
                    <div class="mar-b-10 mar-t-40">采购单号：{{ item.purchaseOrderNo }}（
                        <span v-for="(skuMsg, index) in item.skuCodes" :key="skuMsg.skuCode + index" style="fontWeight: 500">
                            {{ `${skuMsg.skuCode}: ${skuMsg.count}; ` }} 
                        </span>    
                    ）</div>
                    <el-steps align-center
                              :active="getActiveStep(item.trackInfos)"
                              process-status="success"
                              :space="150">
                        <el-step v-for="subItem in item.trackInfos" 
                            :key="subItem.poStatus"
                            :title="subItem.statusName"
                            :description="getText(subItem)"
                        ></el-step>
                    </el-steps>
                </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="close">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { getPurchaseOrder } from '@/request/order'
    let moment = require('moment')
    export default {
        props: {
            trackInfo: Object,
            propShowDialog: Boolean
        },
        data () {
            return {
                orderDetail: [],
                status: {
                    'STORAGED': 3,
                    'SHIPPED': 2,
                    'PART_SHIPPED': 2,
                    'PURCHASED': 1,
                    'WAIT_PURCHASE': 0
                }
            }
        },
        created () {
            this.getDetail()
        },
        methods: {
            getText (subItem) {
                let cancelText = this.formatTime(subItem.time)
                cancelText += (subItem.abnormalNum > 0) ? `异常数量${subItem.abnormalNum}` : ''
                cancelText += (subItem.normalNum > 0 ? `正常数量${subItem.normalNum}` : '')
                return cancelText
            },
            close () {
                this.$emit('close')
            },
            getActiveStep (subItem) {
                let item = subItem.find((val) => {
                    return val.curr == 1
                })
                return item ? this.status[item.poStatus] : ''
            },
            formatTime (value, format) {
                if (!format) {
                    format = 'YYYY-MM-DD HH:mm:ss'
                }
                return value && parseInt(value) ? moment(parseInt(value)).format(format) : ''
            },
            getDetail () {
                getPurchaseOrder({
                    orderNo: this.trackInfo.orderNo
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        if (!res.poInfos) {
                            this.$message.warning('未生成采购单')
                        } else {
                            this.orderDetail = res.poInfos
                        }
                    }
                })
            }
        }
    }
</script>
