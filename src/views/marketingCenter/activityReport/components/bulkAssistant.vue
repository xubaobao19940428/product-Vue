<template>
    <el-dialog
        title="批量助手"
        :visible.sync="dialogVisible"
        width="800px"
        :before-close="handleClose"
        class="bulk-assistant-dialog">
        <el-collapse>
            <el-collapse-item>
                <template slot="title"><i class="iconfont">&#xe63a;</i>选择分组</template>
                <el-form inline label-width="90px">
                    <el-form-item label="选择分组：">
                        <el-select v-model="queryData.groupLabelId" clearable placeholder="请选择" size="medium">
                            <el-option v-for="(item, index) in activityLabel"
                                        :key="index"
                                        :label="getMultiLangShowInfo(item.name)"
                                        :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item>
                <template slot="title"><i class="iconfont">&#xe63a;</i>设置活动时间</template>
                <el-form inline label-width="90px" :model="params" :rules="rules" class="time-form">
                    <el-form-item>
                        <el-radio-group v-model="params.spuPreheat">
                            <el-radio :label="1" @click.native.prevent="clickItem(1)">跟随活动</el-radio>
                            <el-radio :label="2" @click.native.prevent="clickItem(2)">自定义</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="time-box">
                        <el-form-item v-if="preheat == 1" label="预热时间：" prop="preheat">
                            <el-date-picker
                                v-model="params.spuPreheatTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                :default-time="country==='TH'?'01:00:00':'00:00:00'">
                            </el-date-picker>
                        </el-form-item> 
                        <el-form-item label="开始时间：" prop="start">
                            <el-date-picker
                                v-model="params.startTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                :default-time="country==='TH'?'01:00:00':'00:00:00'">
                            </el-date-picker>
                        </el-form-item> 
                        <el-form-item label="结束时间：" prop="end">
                            <el-date-picker
                                v-model="params.endTime"
                                type="datetime"
                                placeholder="选择日期时间"
                                :default-time="country==='TH'?'00:59:59':'23:59:59'">
                            </el-date-picker>
                        </el-form-item>  
                    </div>
                </el-form>
            </el-collapse-item>
            <el-collapse-item>
                <template slot="title"><i class="iconfont">&#xe63a;</i>设置活动价</template>
                <el-form inline label-width="90px" :model="priceInfo" class="time-form">
                    <el-form-item>
                        <el-radio-group v-model="priceInfo.switchPrice">
                            <el-radio :label="0" @click.native.prevent="clickSwitchPrice(0)">建议活动价</el-radio>
                            <el-radio :label="1" @click.native.prevent="clickSwitchPrice(1)">按建议活动价打折</el-radio>
                            <el-radio :label="2" @click.native.prevent="clickSwitchPrice(2)">按VIP价打折</el-radio>
                            <el-radio :label="3" @click.native.prevent="clickSwitchPrice(3)">自定义</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="price-box">
                            <div class="price-item">活动价 = 建议活动价</div>
                            <div class="price-item"><div class="price-text">活动价 = 建议活动价 ➗ </div><el-input v-model="priceInfo.num1" size="small" @input="checkNum"></el-input></div>
                            <div class="price-item"><div class="price-text1">活动价 = VIP价 * </div><el-input v-model="priceInfo.num2" size="small" @input="checkNum"></el-input></div>
                            <div class="price-item"><div class="price-text2">活动价 = </div><el-input v-model="priceInfo.num3" size="small" @input="checkNum"></el-input></div>
                        </div>
                </el-form>
            </el-collapse-item>
            <el-collapse-item>
                <template slot="title"><i class="iconfont">&#xe63a;</i>设置活动佣金率</template>
                <el-form inline label-width="90px" :model="rateInfo" class="time-form">
                    <el-form-item>
                        <el-radio-group v-model="rateInfo.switchRate">
                            <el-radio :label="0" @click.native.prevent="clickSwitchRate(0)">按日常佣金率</el-radio>
                            <el-radio :label="1" @click.native.prevent="clickSwitchRate(1)">按日常佣金率换算</el-radio>
                            <el-radio :label="2" @click.native.prevent="clickSwitchRate(2)">自定义</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="price-box">
                            <div class="price-item">活动佣金率 = 日常佣金率</div>
                            <div class="price-item"><div class="price-text3">活动佣金率 = 日常佣金率 * </div><el-input v-model="rateInfo.num2" size="small" @input="checkNum"></el-input></div>
                            <div class="price-item"><div class="price-text4">活动佣金率 = </div><el-input v-model="rateInfo.num3" size="small" placeholder="0.00001~0.5" @input="checkNum"></el-input></div>
                        </div>
                </el-form>
            </el-collapse-item>
            <el-collapse-item>
                <template slot="title"><i class="iconfont">&#xe63a;</i>设置活动库存</template>
                <el-form inline label-width="90px" :model="stockInfo" class="time-form">
                    <el-form-item class="stock-radio">
                        <el-radio-group v-model="stockInfo.radio">
                            <el-radio :label="3">批量填充</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div class="price-box stock-box">
                            <div class="price-item"><div class="price-text4">活动库存 = </div><el-input v-model="stockInfo.stock" size="small"></el-input></div>
                        </div>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm">确定填充</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { BatchUpdateNoSignedProduct } from '@/request/activityReport'
    import { listActiveGroup } from '@/request/marketing.js'
    import common from '@/js/common/mixins'

    export default {
        props: {
            dialogVisible: Boolean,
            preheat: String,
            country: String,
            activeId: String,
            activeSpuInfo: Array
        },
        data () {
            return{
                queryData: {
                    groupLabelId: ''
                },
                params: {
                    spuPreheat: 0,
                    spuPreheatTime: '',
                    startTime: '',
                    endTime: ''
                },
                priceInfo: {
                    priceVariable: '',
                    switchPrice: -1,
                    num1: '',
                    num2: '',
                    num3: ''
                },
                rateInfo: {
                    rateVariable: '',
                    switchRate: -1,
                    num2: '',
                    num3: ''
                },
                stockInfo: {
                    radio: 3,
                    stock: '',
                },
                rules: {
                    spuPreheatTime: [{ required: true, message: '请选择日期时间', trigger: 'change' }],
                    startTime: [{ required: true, message: '请选择日期时间', trigger: 'change' }],
                    endTime: [{ required: true, message: '请选择日期时间', trigger: 'change' }]
                },
                activityLabel: [],

            }
        },
        mixins: [common],
        created () {
            this.getActivityLabel()
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {}
            }
        },
        methods: {
            clickItem (e) {
                e === this.params.spuPreheat ? this.params.spuPreheat = 0 : this.params.spuPreheat = e
            },
            clickSwitchPrice (e) {
                e === this.priceInfo.switchPrice ? this.priceInfo.switchPrice = -1 : this.priceInfo.switchPrice = e
            },
            clickSwitchRate (e) {
                e === this.rateInfo.switchRate ? this.rateInfo.switchRate = -1 : this.rateInfo.switchRate = e
            },
            checkNum (val) {
                let re = /^[0-9]+.?[0-9]*$/; //判断字符串是否为数字
                if (!re.test(val)){
                    this.$message.error('请输入数字！')
                }
            },
            getActivityLabel () {
                listActiveGroup(this.filterData({
                    activeId: this.activeId
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.activityLabel = res.groupInfo
                    }
                })
            },
            confirm () {
                if (this.params.spuPreheatTime && this.params.spuPreheatTime > this.params.startTime) {
                    this.$message.error('商品的预热时间须不大于商品的开始时间')
                    return
                }
                
                if (this.params.startTime > this.params.endTime) {
                    this.$message.error('活动的结束时间须不小于活动的开始时间')
                    return
                }
                switch(this.priceInfo.switchPrice){
                    case -1 : this.priceInfo.priceVariable = '';break;
                    case 0 : this.priceInfo.priceVariable = '';break;
                    case 1 : this.priceInfo.priceVariable = this.priceInfo.num1;break;
                    case 2 : this.priceInfo.priceVariable = this.priceInfo.num2;break;
                    case 3 : this.priceInfo.priceVariable = this.priceInfo.num3;break;
                }
                switch(this.rateInfo.switchRate){
                    case -1 : this.rateInfo.rateVariable = '';break;
                    case 0 : this.rateInfo.rateVariable = '';break;
                    case 1 : this.rateInfo.rateVariable = this.rateInfo.num2;break;
                    case 2 : this.rateInfo.rateVariable = this.rateInfo.num3;break;
                }
                let item = this.activityLabel.find( val => {
                    return val.id =  this.queryData.groupLabelId
                })
                let params = {
                    activeSpuInfo: this.activeSpuInfo,
                    activeId: this.activeId,
                    countryCode: this.country,
                    groupLabelId: this.queryData.groupLabelId,
                    groupLabel: this.queryData.groupLabelId===''?[]:item.name,
                    spuPreheat: this.params.spuPreheat,
                    spuPreheatTime: this.params.spuPreheatTime===''?'':(moment(moment(this.params.spuPreheatTime).format('YYYY-MM-DD HH:mm:ss')).valueOf()).toString(),
                    startTime: this.params.startTime===''?'':(moment(moment(this.params.startTime).format('YYYY-MM-DD HH:mm:ss')).valueOf()).toString(),
                    endTime: this.params.endTime===''?'':(moment(moment(this.params.endTime).format('YYYY-MM-DD HH:mm:ss')).valueOf()).toString(),
                    switchPrice: this.priceInfo.switchPrice,
                    priceVariable: this.priceInfo.priceVariable,
                    switchRate: this.rateInfo.switchRate,
                    rateVariable: this.rateInfo.rateVariable,
                    stock: this.stockInfo.stock
                }
                BatchUpdateNoSignedProduct(params).then(res=>{
                    if (res.ret.errcode === 1) {
                        this.$message.success('批量编辑成功！')
                        this.$emit('confirm')
                    }
                })
            },
            handleClose () {
                this.$emit('close')
            }
        },
    }
</script>
<style lang="scss">
    .bulk-assistant-dialog{
        .el-radio-group{
            display: flex;
            flex-direction: column;
            margin-left: 20px;
        }
        .el-radio{
            margin-bottom: 30px;
        }
    }
</style>
<style lang="scss" scoped>
    .bulk-assistant-dialog{
        .iconfont{
            color: #409EFF;
        }
        .time-form{
            display: flex;
            margin-top: 10px;
        }
        .time-box{
            margin-top: 35px;
        }
        .price-box{
            display: flex;
            flex-direction: column;
            .price-item{
                display: flex;
                align-items: center;
                margin-bottom: 15px;
            }
            .price-text{
                width: 240px;
            }
            .price-text1{
                width: 140px;
            }
            .price-text2{
                width: 80px;
            }
            .price-text3{
                width: 260px;
            }
            .price-text4{
                width: 120px;
            }
        }
        .stock-box{
            margin-top: -9px;
        }
        .stock-radio{
            margin-right: 95px;
        }
    }
</style>