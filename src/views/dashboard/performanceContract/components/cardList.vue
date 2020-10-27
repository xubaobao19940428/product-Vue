<template>
    <div class="card-list">
        <div class="card-box">
            <div v-for="(item,index) in board" :key="index" :class="['card',{active: activeIndex === index}]" @click="cardClick(index, item.title)">
                <div v-if="activeIndex === index" class="color-prompt"></div>
                <div class="card-title">
                    <div class="title">{{item.title}}{{item.standard}}</div>
                    <el-tooltip class="item" effect="dark" :content="item.title.indexOf('SO') != -1 ? soModule[item.title] : poModule[item.title]" placement="top">
                        <i class="iconfont">&#xe680;</i>
                    </el-tooltip>
                </div>
                <div class="card-data">{{item.data}}</div>
                <div class="card-prompt">
                    <div>vs {{timeVs}}</div>
                    <div class="ratio" >{{item.change}}<i class="iconfont top" v-if="item.change&&item.change.indexOf('-')==-1">&#xe645;</i><i class="iconfont botto" v-else>&#xe639;</i></div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name:'cardList',
    props:{
        board:{
            type:Array,
            default:()=>{
                return [1,2,3,4]
            }
        },
        vsTime:{
            type:String,
            default:''
        },
        Module:{
            type: String,
            default: ''
        },
        activeIndex:{
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            activeIndex: this.activeIndex,
            timeVs: '',
            soModule: {
                'SO整体时效': '用户下单付款起 至 用户签收所有订单的总时效平均值；（未签收部分不计入）',
                'SO达标-西马': '西马so标准：so下单付款至签收共计13D的订单数量占比；非标准时效：13D；',
                'SO达标-东马': '东马so标准：so下单付款至签收共计15D的订单数量占比；非标准时效：15D；',
                'SO达标-泰国': '泰国so标准：so下单付款至签收共计12D的订单数量占比；非标准时效：15D；',
                'SO达标-新加坡': '新加坡so标准：so下单付款至签收共计15D的订单数量占比；非标准时效：20D；',
                'SO出库达标': '出库标准：订单付款后，订单付款时间为查询范围内，120h出库单状态为已出库（或交易成功/跨境完成/已签收）的订单数量占比',
                'SO跨境达标': '跨境标准：订单付款时间为查询范围内，订单从已出库到完成跨境（或已签收/交易成功）的时间在72h内的订单数量占比；',
                'SO宅配达标': '宅配标准：订单付款时间为查询范围内，订单从跨境完成到订单签收（或交易完成）的时间在72h内的订单数量占比；',
            },
            poModule: {
                'PO整体时效': '用户下单付款起 至 对应采购单仓储签的总时效平均值；（未签收部分不计入）',
                'PO达标-东莞仓': 'PO标准：so下单至仓储签收共计5D的订单数量占比；非标准时效：6D',
                'PO达标-马来仓': 'PO标准：so下单至仓储签收共计5D的订单数量占比；非标准时效：6D',
                'PO达标-泰国仓': 'PO标准：so下单至仓储签收共计5D的订单数量占比；非标准时效：6D',
                'PO采购下单达标': '下单标准：SO推单 至 PO确认采购的时间在24h之内的订单数量占比；',
                'PO发货达标': '发货标准：PO确认采购到PO已发货的时间在24h之内的订单数量占比；',
                'PO采购到仓达标': '到仓标准：PO已发货到PO仓储签收的时间在72h之内的订单数量占比；'
            },
            list: [1,2,3,4]
        }
    },
    watch: {
        vsTime:{
            handler(newval) {
                console.log(newval)
                let time = newval.split('~')
                let diff = moment(time[1]).diff(time[0], 'days')
                console.log(diff)
                this.timeVs = moment(time[0]).subtract('days',diff+1).format('YYYY-MM-DD')+'~'+moment(time[0]).subtract('days',1).format('YYYY-MM-DD')
            },
            deep:true
        }
    },
    methods: {
        cardClick (index, title) {
            this.activeIndex = index
            this.$emit('changeCard', index, title, this.Module)
        }
    }
}
</script>
<style lang="scss" scoped>
    .card-list{
        height: 200px;
        padding-top: 30px;
        .card-box{
            display: flex;
            justify-content: space-around;
            cursor: pointer;
        }
        .active{
            box-shadow: 10px 10px 5px #888888;
        }
        .color-prompt{
            position: absolute;
            z-index: 10;
            top: -6px;
            left: -2px;
            width: 101%;
            height: 5px;
            background-color: rgb(18,0,254);
        }
        .card{
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 250px;
            height: 100px;
            padding: 5px;
            border-radius: 2px;
            border: 1px solid rgb(205,205,205);
        }
        .card-title{
            display: flex;
            margin-bottom: 10px;
            .title{
                font-size: 16px;
                font-weight: 500;
            }
        }
        .card-data{
            font-size: 22px;
            font-weight: 500;
        }
        .card-prompt{
            display: flex;
            align-items: center;
            font-size: 12px;
            color: rgb(156,156,156);
            .ratio{
                margin-left: 20px;
                .top{
                    font-size: 12px;
                    color: rgb(43,130,210)
                }
                .botto{
                    font-size: 12px;
                    color: rgb(204,5,11)
                }
            }
        }
    }
</style>