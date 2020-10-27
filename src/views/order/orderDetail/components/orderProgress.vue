<template>
    <div class="order-progress">
        <div class="progress-box">
            <div class="progress-line">
                <div class="progress-title">提交订单</div>
                <div class="progress-time">{{timeList.length==0?'-':timeList[0] && timeList[0].time[0] | formatTime}}</div>
                <div class="progress-show">
                    <div v-if="timeList.length==0?false:true" class="push-b"></div>
                    <div v-if="timeList.length==0?true:false" class="push-g"></div>
                    <el-progress :percentage="timeList.length==0?0:timeList.length==1?50:100"></el-progress>
                </div>
                <div class="progress-continue">{{timeList.length==0?'':timeList.length==1?formatSecondsTo(nowTime,timeList[0].time[0]):formatSecondsTo(timeList[1].time[0],timeList[0].time[0])}}</div>
            </div>
            <div class="progress-line">
                <div class="progress-title">确认支付</div>
                <div class="progress-time">{{timeList.length==1?'-':timeList[1] && timeList[1].time[0] | formatTime}}</div>
                <div class="progress-show">
                    <div v-if="timeList.length<=1?false:true" class="push-b"></div>
                    <div v-if="timeList.length<=1?true:false" class="push-g"></div>
                    <el-progress :percentage="timeList.length<=1?0:timeList.length==2?50:100"></el-progress>
                </div>
                <!-- <div class="progress-continue">{{timeList.length==1?'':timeList.length==2?formatSecondsTo(nowTime,timeList[1].time[0]):formatSecondsTo(timeList[2].time[0],timeList[1].time[0])}}</div> -->
                <div class="progress-continue" v-if="timeList.length==1">{{''}}</div>
                <div class="progress-continue" v-else-if="timeList.length==2">{{formatSecondsTo(nowTime,timeList[1].time[0])}}</div>
                <div class="progress-continue" v-else-if="timeList.length>2">{{formatSecondsTo(timeList[2].time[0],timeList[1].time[0])}}</div>
            </div>
            <div class="progress-line">
                <div class="progress-title">发货</div>
                <div class="progress-time">{{timeList.length==2?'-':timeList[2] && timeList[2].time[0] | formatTime}}</div>
                <div class="progress-show">
                    <div v-if="timeList.length<=2?false:true" class="push-b"></div>
                    <div v-if="timeList.length<=2?true:false" class="push-g"></div>
                    <!-- <el-progress :percentage="timeList.length<=2?0:timeList.length=3?50:100"></el-progress> -->
                    <el-progress v-if="timeList.length<=2" :percentage="0"></el-progress>
                    <el-progress v-else-if="timeList.length==3" :percentage="50"></el-progress>
                    <el-progress v-else :percentage="100"></el-progress>
                </div>
                <!-- <div class="progress-continue">{{timeList.length==2?'':timeList.length==3?formatSecondsTo(nowTime,timeList[2].time[0]):formatSecondsTo(timeList[3].time[0],timeList[2].time[0])}}</div> -->
                <div class="progress-continue" v-if="timeList.length==2">{{''}}</div>
                <div class="progress-continue" v-else-if="timeList.length==3">{{formatSecondsTo(nowTime,timeList[2].time[0])}}</div>
                <div class="progress-continue" v-else-if="timeList.length>3">{{formatSecondsTo(timeList[3].time[0],timeList[2].time[0])}}</div>
            </div>
            <div class="progress-line">
                <div class="progress-title">收货</div>
                <div class="progress-time">{{timeList.length==3?'-':timeList[3] && timeList[3].time[0] | formatTime}}</div>
                <div class="progress-show">
                    <div v-if="timeList.length<=3?false:true" class="push-b" style="width:10px"></div>
                    <div v-if="timeList.length<=3?true:false" class="push-g" style="width:10px"></div>
                </div>
            </div>
        </div>
    </div> 
</template>
<script>
    import { OrderStatusFlow } from '@/request/order.js'

    export default {
        data () {
            return {
                timeList: [],
                nowTime: (new Date()).valueOf()
            }
        },
        props: {
            orderNo:String
        },
        mounted () {
            this.getOrderStatusFlow()
        },
        computed: {
        },
        methods: {
            getOrderStatusFlow () {
                let params = {
                    orderId: this.orderNo
                }
                OrderStatusFlow(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.timeList = res.flowInfo
                        console.log(this.timeList)
                        // this.$set(this.statusRate, 'pushContinueTime', res.pushContinueTime)

                    }
                })
            },
            formatSecondsTo (now,ms) {
                console.log(now,ms)
                let mss = Number(now) - ms
                console.log(mss)
                let duration
                let days = parseInt(mss / (1000 * 60 * 60 * 24))
                let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
                let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
                let seconds = parseInt((mss % (1000 * 60)) / 1000)
                if (days > 0)  duration = days + "天" + hours + "小时" + minutes + "分" + seconds + "秒"
                else if (hours > 0)  duration = hours + "小时" + minutes + "分" + seconds + "秒"
                else if (minutes > 0) duration = minutes + "分" + seconds + "秒"
                else if (seconds > 0) duration = seconds + "秒"
                // console.log(duration)
                return duration
            },
        }
    }
</script>
<style lang="scss">
    .order-progress{
        .el-progress{
            width:200px;
            display: flex;
            align-items: center;
        }
        .el-progress__text{
            display:none;
        }
        .el-progress-bar__outer{
            width:140px;
            height:3px !important;
        }
    }
</style>
<style lang="scss" scoped>
    .order-progress{
        display: flex;
        .progress-box{
            display: flex;
        }
        .abnormal-number{
            cursor: pointer;
            color:#409EFF;
        }
        .ship-number{
            cursor: pointer;
            color:#409EFF;
        }
        .progress-line{
            position: relative;
            width:150px;
            font-size:12px;
        }
        .progress-show{
            display: flex;
            height: 10px;
        }
        .progress-title{
            font-weight: bold;
        }
        .progress-time{
            font-size:10px;
            font-weight:200;
            margin: 2px 0;
        }
        .push-b{
            width: 15px;
            height: 10px;
            border-radius: 50%;
            background-color:#409EFF;
        }
        .push-g{
            width: 15px;
            height: 10px;
            border-radius: 50%;
            background-color: #EBEEF5;
        }
        .confirm-b{
            width: 15px;
            height: 10px;
            border-radius: 50%;
            background-color:#409EFF;
        }
        .confirm-g{
            width: 15px;
            height: 10px;
            border-radius: 50%;
            background-color: #EBEEF5;
        }
        .progress-continue{
            text-align: center;
            font-size:10px;
        }
        .progress-product-list{
            display: flex;
            flex-direction: column;
        }
        .progress-product{
            display:flex;
        }
        .progress-detail{
            display: flex;
        }
        .progress-brige{
            position:absolute;
            height: 2px;
            background-color: #409EFF;
            width: 60px;
            left: -25px;
            top: 10px;
            transform: rotate(90deg);
        }
    }
</style>