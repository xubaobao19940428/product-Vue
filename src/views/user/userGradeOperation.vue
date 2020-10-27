<template>
    <div class="app-container">
        <!-- <el-button type="primary" @click="test">test</el-button> -->
        <el-table :data="tableData" style="width: 100%" :header-cell-style="{background:'#F5F7FA',color:'#606266'}" height="250">
            <el-table-column prop="grade" label="级别" min-width="140" align="center" header-align="center">
            </el-table-column>
            <el-table-column prop="condition" label="升级" min-width="150" header-align="center">
            </el-table-column>
            <el-table-column label="商品收益" header-align="center">
                <el-table-column prop="buyIncome" label="自购" min-width="120" header-align="center">
                </el-table-column>
                <el-table-column prop="fansBuyIncome" label="直接团员购买" min-width="120" header-align="center">
                </el-table-column>
                <el-table-column prop="groupIncome" label="团队奖励" min-width="120" header-align="center">
                </el-table-column>
            </el-table-column>
            <el-table-column label="礼包收益" header-align="center">
                <el-table-column prop="giftDirectIncome" label="直推礼包奖" min-width="120" header-align="center">
                </el-table-column>
                <el-table-column prop="giftGroupTransIncome" label="团队礼包奖" min-width="120" header-align="center">
                </el-table-column>
            </el-table-column>
            <el-table-column label="伯乐奖" header-align="center">
                <el-table-column prop="proPearlIncome" label="商品收益" min-width="120" header-align="center">
                </el-table-column>
                <el-table-column prop="giftPearlIncome" label="礼包收益" min-width="120" header-align="center">
                </el-table-column>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import {login} from '@/request/login'
    export default {
        name: 'userGradeManagement',
        data() {
            return {
                tableData: [{
                    grade: 'Shopper(SH)',
                    condition: '注册',
                    buyIncome: '无',
                    fansBuyIncome: '1.返给粉丝无门槛优惠券RM5（仅新用户，优惠券有期限）\n2.返给新人优惠券RM5',
                    groupIncome: '无',
                    giftDirectIncome: '无',
                    giftGroupTransIncome: '无',
                    proPearlIncome: '无',
                    giftPearlIncome: '无'
                }, {
                    grade: 'Preferred Shopper(PS)',
                    condition: '购买RM199以上的礼包',
                    buyIncome: '所购商品返佣比例x100%',
                    fansBuyIncome: '所购商品返佣比例x100%',
                    groupIncome: '无',
                    giftDirectIncome: '直推返利RM50',
                    giftGroupTransIncome: '无',
                    proPearlIncome: '无',
                    giftPearlIncome: '无'
                }, {
                    grade: 'Affiliate Marketer(AM)',
                    condition: '1）直推10个PS\n 2）团队满30个PS',
                    buyIncome: '所购商品返佣比例x140%',
                    fansBuyIncome: '所购商品返佣比例x140%',
                    groupIncome: '团队内PS所购商品返佣比例x40%',
                    giftDirectIncome: '直推返利\n一次返利RM75\n二次返利RM25（平台发放）',
                    giftGroupTransIncome: '团队PS成员直推礼包\n一次返利RM25\n二次返利RM25（平台发放）',
                    proPearlIncome: '直属AM下级个人收益的20%',
                    giftPearlIncome: '直属AM下级团队每新增一个PS，收益RM10'
                }, {
                    grade: 'Affiliate Trainer(AT)',
                    condition: '1）直育3个AM\n2）团队满8个AM\n3）团队满500个PS+AM',
                    buyIncome: '所购商品返佣比例x156%',
                    fansBuyIncome: '所购商品返利比例x156%',
                    groupIncome: '1.团队内直属PS本人所购商品返佣比例x56%\n2.团队内AM团队所购商品返佣比例x16%',
                    giftDirectIncome: '直推返利\n一次返利RM90\n二次返利RM45（平台发放）',
                    giftGroupTransIncome: '1.团队直属PS成员直推礼包\n一次返利RM40\n二次返利RM45（平台发放）\n' +
                        '2.团队AM成员直推礼包\n一次返利RM15\n二次返利RM20（平台发放）',
                    proPearlIncome: '直属AT下级个人收益的20%',
                    giftPearlIncome: '直属AT下级团队每新增一个BO，收益RM10'
                }]
            }
        },
        mounted() {},
        methods: {
            test() {
                let params = {
                    'account': "fingoTech",
                    'deviceId': "8e5604af-99db-47a5-b5e9-465040486690",
                    'password': "fingo123"
                }
                login(params);
            }
        }
    }
</script>

<style lang="scss">
.el-table .cell {
    white-space: pre-line;
}
</style>
