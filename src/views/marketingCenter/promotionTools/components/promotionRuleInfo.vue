<template>
    <div class="rule-info-box">
        <template v-if="promotionType != 6">
            <div class="form-tips mar-t-10">支持多级优惠，请按级别越高，门槛越高的规律填写</div>
            <div v-for="(item, i) in ruleInfo" :key="i" class="rule-box">
                <!--满额减-->
                <template v-if="promotionType == 0">
                    <span>{{ item.level }}级优惠</span>
                    <em>满</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd" v-model="item.conditionsReached" @blur="judgeInput(item)" type="text" placeholder="商品金额"></el-input>
                    <em>{{ getCurrencyCode }}，减</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd"  v-model="item.favouredPolicy" @blur="judgeInput(item)"  type="text" placeholder="优惠金额"></el-input>
                    <em>{{ getCurrencyCode }}</em>
                </template>
                <!--每满额减-->
                <template v-if="promotionType == 1">
                    <span>{{ item.level }}级优惠</span>
                    <em>每满</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd"  v-model="item.conditionsReached" @blur="judgeInput(item)"  type="text" placeholder="商品金额"></el-input>
                    <em>{{ getCurrencyCode }}，减</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd"  v-model="item.favouredPolicy" @blur="judgeInput(item)"  type="text" placeholder="优惠金额"></el-input>
                    <em>{{ getCurrencyCode }}</em>
                </template>
                <!--M元N件-->
                <template v-else-if="promotionType == 2">
                    <span>{{ item.level }}级优惠</span>
                    <el-input class="input-item" :disabled="hasStart || hasEnd" v-model="item.conditionsReached" type="text" placeholder="商品金额"></el-input>
                    <em>{{ getCurrencyCode }}，任选</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd" v-model="item.favouredPolicy" @blur="judgeInt(item, 'favouredPolicy')" type="text" placeholder="购买件数"></el-input>
                    <em>件</em>
                </template>
                <!--M件N折-->
                <template v-else-if="promotionType == 3">
                    <span>{{ item.level }}级优惠</span>
                    <em>满</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd"  v-model="item.conditionsReached" @blur="judgeInt(item, 'conditionsReached')"  type="text" placeholder="商品件数"></el-input>
                    <em>件，优惠</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd" v-model="item.favouredPolicy"  @blur="judgeInputCheck(item)" type="text" placeholder="优惠率"></el-input>
                    <em>%</em>
                    <em class="form-tips">如：82折填18，9折填10</em>
                </template>
                <!--第M件N元-->
                <template v-else-if="promotionType == 4">
                    <span>{{ item.level }}级优惠</span>
                    <em>第</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd"  v-model="item.conditionsReached" type="text" @blur="judgeInt(item, 'conditionsReached')"  placeholder="商品件数"></el-input>
                    <em>件，售价</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd" v-model="item.favouredPolicy" type="text" placeholder="计价金额"></el-input>
                    <em>{{ getCurrencyCode }}</em>
                </template>
                <!--第M件N折-->
                <template v-else-if="promotionType == 5">
                    <span>{{ item.level }}级优惠</span>
                    <em>第</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd"  v-model="item.conditionsReached" @blur="judgeInt(item, 'conditionsReached')" type="text" placeholder="商品件数"></el-input>
                    <em>件，优惠</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd"  v-model="item.favouredPolicy" type="text" placeholder="优惠率"></el-input>
                    <em>%</em>
                </template>
                <!--每满件减-->
                <template v-else-if="promotionType == 7">
                    <span>{{ item.level }}级优惠</span>
                    <em>满</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd"  v-model="item.conditionsReached" type="text" @blur="judgeInt(item, 'conditionsReached')"  placeholder="商品件数"></el-input>
                    <em>件，减</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd" v-model="item.favouredPolicy" type="text" placeholder="优惠金额"></el-input>
                    <em>{{ getCurrencyCode }}</em>
                </template>
                <!--每满件减-->
                <template v-else-if="promotionType == 8">
                    <span>{{ item.level }}级优惠</span>
                    <em>每满</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd"  v-model="item.conditionsReached" type="text" @blur="judgeInt(item, 'conditionsReached')"  placeholder="商品件数"></el-input>
                    <em>件，减</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd" v-model="item.favouredPolicy" type="text" placeholder="优惠金额"></el-input>
                    <em>{{ getCurrencyCode }}</em>
                </template>
                <!--满额发券-->
                <template v-else-if="promotionType == 9">
                    <span>{{ item.level }}级优惠</span>
                    <em>每满</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd"  v-model="item.conditionsReached" type="text" placeholder="商品金额"></el-input>
                    <em>{{ getCurrencyCode }}，送</em>
                    <el-input class="input-item" :disabled="hasStart || hasEnd"  v-model="item.favouredPolicy"  type="text" placeholder="优惠券包ID"></el-input>
                </template>
                <i v-if="i > 0" class="el-icon-delete" @click="deleteRule(i)"></i>
            </div>
            <!----->
            <div class="add-btn" v-if="ruleInfo.length < 5 && promotionType != 1 && promotionType != 8" @click="addRule()"><i class="el-icon-plus"></i>再加一级优惠</div>
            <div class="form-tips mar-t-10" v-if="promotionType != 1 && promotionType != 8">提醒：每级优惠不叠加，如：满足二级优惠条件后则不再享有一级优惠。最多支持五级优惠。</div>
        </template>
        <template v-else>
            <div class="form-tips mar-t-10 mar-b-10">未特别指定的地区，视为不参与包邮优惠</div>
            <el-table border
                      current-row-key="level"
                      row-key="level"
                      ref="freeShipping"
                      :data="ruleInfo">
                <el-table-column label="包邮地区" min-width="100" align="center">
                    <template slot-scope="scope">
                        <div class="form-item" @click="showAddressDialog(scope.row, scope.$index)">
                            <span>{{ scope.row.stateCode.join(',') }}</span>
                            <em class="add-btn mar-l-10">编 辑</em>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="包邮门槛" min-width="150" align="center">
                    <template slot-scope="scope">
                        <div class="form-item">
                            <span>满</span>
                            <el-input :disabled="hasStart || hasEnd" class="input-item" v-model="scope.row.conditionsReached" type="text" placeholder="请输入"></el-input>
                            <el-select v-model="scope.row.freeShippingType" :disabled="hasStart || hasEnd" placeholder="请选择" class="select-item">
                                <el-option label="件" value="0"></el-option>
                                <el-option :label="getCurrencyCode" value="1"></el-option>
                            </el-select>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="100" align="center">
                    <template slot-scope="scope">
                        <div class="add-btn" @click="deleteRule(scope.$index)">删 除</div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="add-btn center" @click="addRule()">新增指定地区</div>
        </template>
        <select-address v-if="address.show" :propShowDialog="address.show" :propStateList="address.list" :countryCode="countryCode" @close="address.show = false" @confirm="confirmSelectAddress"></select-address>
    </div>
</template>
<script>
    import selectAddress from '@/components/addressSelect/backAddress'
    export default {
        props: {
            promotionType: [String, Number],
            promotionRuleInfo: {
                type: Array,
                default: () => { return [] }
            },
            countryCode: String,
            hasStart: Boolean,
            hasEnd: Boolean
        },
        data () {
            return {
                ruleInfo: [],
                getCurrencyCode: 'RM',
                address: {
                    show: false,
                    index: -1,
                    list: []
                }
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        components: {
            selectAddress
        },
        watch: {
            countryCode: {
                handler () {
                    let item = this.countryList.find((val) => {
                        return val.shortCode == this.countryCode
                    })
                    this.getCurrencyCode =  item ? item.currencyUnit : ''
                },
                deep: true
            },
            promotionRuleInfo (val) {
                this.ruleInfo = val
                if (this.ruleInfo.length <= 0) {
                    this.addRule()
                }
            }
        },
        created () {
            this.ruleInfo = this.promotionRuleInfo
            if (this.ruleInfo.length <= 0) {
                this.addRule()
            }
        },
        methods: {
            deleteRule (i) {
                this.ruleInfo.splice(i, 1)
                for (let j = 0; j < this.ruleInfo.length; j++) {
                    this.ruleInfo[j].level = j + 1
                }
            },
            judgeInput (item) {
                let temp1 = parseFloat(item.favouredPolicy) // 优惠金额
                let temp2 = parseFloat(item.conditionsReached) // 商品总额

                if (temp1 > (temp2 * 0.9).toFixed(2)) {
                    this.$message.warning('您设置的优惠让利过高，禁止保存')
                    item.favouredPolicy = ''
                    item.conditionsReached = ''
                } else if (temp1 > (temp2 * 0.3).toFixed(2)) {
                    this.$confirm('您设置的优惠让利超过了30%，这可能导致财务损失，仍要保存吗?', '提示', {
                        confirmButtonText: '确定保存',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                    }).catch(() => {
                        item.favouredPolicy = ''
                        item.conditionsReached = ''
                    })
                }
            },
            judgeInputCheck (item) {
                let temp = parseFloat(item.favouredPolicy)
                if (temp > 90) {
                    this.$message.warning('您设置的优惠让利过高，禁止保存')
                    item.favouredPolicy = ''
                } else if (temp > 30) {
                    this.$confirm('您设置的优惠让利超过了30%，这可能导致财务损失，仍要保存吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {

                    }).catch(() => {
                        item.favouredPolicy = ''
                    })
                }
            },
            judgeInt (item, key) {
                if (item[key]) {
                    item[key] = String(parseInt(item[key]))
                }
            },
            addRule () {
                if (this.hasStart || this.hasEnd) {
                    return
                }
                this.ruleInfo.push({
                    level: this.ruleInfo.length + 1,
                    freeShippingType: '1',
                    conditionsReached: '', // 条件
                    favouredPolicy: '', // 优惠
                    stateCode: [] // 地区
                })
            },
            showAddressDialog (data, index) {
                if (this.hasStart || this.hasEnd) {
                    return
                }
                this.address.index = index
                this.address.list = data.stateCode
                this.address.show = true
            },
            confirmSelectAddress (address) {
                for (let i = 0; i < this.ruleInfo.length; i++) {
                    if (this.address.index != i) {
                        let stateCode = this.ruleInfo[i].stateCode
                        for (let j = 0; j < stateCode.length; j++) {
                            let item = address.find((val) => {
                                return val === stateCode[j]
                            })
                            if (item) {
                                return this.$message.warning(item + '已经设置过，请更换')
                            }
                        }
                    }
                }
                if (address.length > 0) {
                    this.ruleInfo[this.address.index].stateCode = address
                }
                this.address.show = false
            },
            getData () {
                let self = this
                let ruleInfo = self.ruleInfo.filter((val) => {
                    if (this.promotionType != 6) {
                        return val.conditionsReached && val.conditionsReached && val.favouredPolicy && val.favouredPolicy != 0
                    } else {
                        return val.stateCode && val.stateCode.length != 0 && val.conditionsReached && val.conditionsReached != 0
                    }
                })
                return ruleInfo
            }
        }
    }
</script>
<style lang="scss" scoped>
 .rule-info-box{
     .rule-box{
         display: flex;
         align-items: center;
         margin-top: 10px;
         .el-icon-delete{
             margin-left: 10px;
             cursor: pointer;
             &:hover{
                 color: #409eff;
             }
         }
         span{
             color: #666;
             margin-right: 20px;
         }
     }
     .add-btn{
         color: #409eff;
         width: 150px;
         cursor: pointer;
     }
     .form-item{
         display: flex;
         justify-content: center;
         align-items: center;
         box-sizing: border-box;
         padding: 10px;
         span{
             flex: 1;
             overflow:hidden;
             text-overflow:ellipsis;
             display:-webkit-box;
             -webkit-line-clamp:4;
             -webkit-box-orient:vertical;
         }
     }
     .input-item{
         width: 100px;
         margin: 0 10px;
     }
     .select-item{
         width: 80px;
     }
     .center{
         text-align: center;
     }
 }
</style>
