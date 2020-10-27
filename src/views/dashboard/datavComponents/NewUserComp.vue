<template>
    <div class="new-user-comp-wrapper">
        <!-- <p>拉新产品数据</p> -->
        <div class="title_top">拉新产品数据(人)</div>
        <div class="new-use-chart">
            <div class="chart-top">
                <div class="chart-l">
                    <PieChart :barData="promotion1" ref="setPieData"></PieChart>
                </div>
                <div class="chart-r">
                    <p class="title">拆红包</p>
                    <p class="money">{{promoTotal1}}</p>
                    <p class="total">新注册用户数</p>
                </div>
            </div>
            <div class="chart-bottom">
                <div class="chart-l">
                    <PieChart :barData="promotion2" ref="setPieData2"></PieChart>
                </div>
                <div class="chart-r">
                    <p class="title">摇一摇</p>
                    <p class="money">{{promoTotal2}}</p>
                    <p class="total">新注册用户数</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import PieChart from './PieChart'
    export default {
        props: {
            promotion1: {
                type: Array,
                default: () => {
                    return []
                }
            },
            promotion2: {
                type: Array,
                default: () => {
                    return []
                }
            },
            promoTotal1: {
                type: String,
                default: '0'
            },
            promoTotal2: {
                type: String,
                default: '0'
            }
        },
        data () {
            return {
            }
        },
        components: {
            PieChart
        },
        watch: {

        },
        methods: {
            setOption () {
                this.$refs['setPieData'].setOption()
                this.$refs['setPieData2'].setOption()
            }
        },
        mounted () {

        }
    }
</script>

<style lang="scss" scoped>
    .new-user-comp-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        .new-use-chart{
            flex: 1;
            width: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .chart-top, .chart-bottom{
            flex: 1;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-sizing: border-box;
            padding: 0 .1rem;
            .chart-l{
                flex: 1;
            }
            .chart-r{
                width:1.5rem;
                height:1rem;
                padding:0.1rem;
                background-image: url(../../../assets/images/center_left_right.png);
                background-position: center;
                background-size: 100% 100%;
                box-sizing:border-box;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                p{
                    text-align:center;
                }
                p[class="title"]{
                    font-size:0.18rem;
                }
                p[class="money"]{
                    font-size:.3rem;
                    color:#00ebff;
                }
                p[class="total"]{
                    font-size:.12rem;
                    color:#00ABEE;
                }
            }
        }
        .title_top {
            font-size: .15rem;
            color: #fefefe;
            width:100%;
            height:0.395rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            box-sizing: border-box;
            padding: .22rem;
            background-image: url(../../../assets/images/title-header3.png);
        }

    }
</style>
