<template>
    <el-card class="member-income-card">
        <div slot="header" class="clearfix">
            <span>用户收益信息</span>
        </div>
        <div class="">
            <table class="income-table">
              <tr>
                <td>累计收益</td>
                <td>礼包收益</td>
                <td>普通商品收益</td>
                <td>预期收益</td>
                <td>团队订单</td>
              </tr>
              <tr>
                <td>123</td>
                <td>3</td>
                <td>12</td>
                <td>3</td>
                <td>3</td>
              </tr>
              <tr>
                <td>今日收益</td>
                <td>本周收益</td>
                <td>收益系数</td>
                <td>账户余额</td>
                <td>已提现积分</td>
              </tr>
              <tr>
                <td>3</td>
                <td>2</td>
                <td>4</td>
                <td>6</td>
                <td>6</td>
              </tr>
            </table>
        </div>
    </el-card>
</template>

<script>
    export default {
        name: 'memberIncomeInfo',
        props: {},
        components: {
        },
        data() {
            return {

            }
        },
        mounted() {
        },
        methods: {

        }
    }
</script>

<style lang="scss" scoped>
.income-table{
    width: 100%;
    border-left: 1px solid #ebeef5;
    border-top: 1px solid #ebeef5;
    color: #444;
    font-size: 14px;
    border-spacing:0;
    text-align: center;
    td{
      border-right: 1px solid #ebeef5;
      border-bottom: 1px solid #ebeef5;
      box-sizing: border-box;
      padding: 16px;
    }
    tr:nth-child(2n+1) {
        background: #f5f7fa;
    }
}
</style>


