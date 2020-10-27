<template>
    <div class="subject-ediit-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="1200px" @close="cancle" :close-on-click-modal="false">
            <el-card class="info-card">
                <div class='info-title mar-b-10'>
                    拼团设置
                    <el-button type="text" @click="addSpecialRate" style="float: right">增加特殊折扣</el-button>
                </div>
                <div>
                    <el-form ref="groupSettingForm" :model="groupSetting" :rules="ruleValidate" label-width="110px" size="mini" style="width:1000px">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="推送国家：">
                                    {{groupSetting.countryName}}
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="所在专题：">
                                    {{groupSetting.subjectName}}
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="拼团时间：" prop="groupTime">
                            <el-date-picker
                                v-model="groupSetting.groupTime"
                                type="datetimerange"
                                align="right"
                                size="medium"
                                value-format="timestamp"
                                start-placeholder="开始时间"
                                end-placeholder="结束时间"
                                :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item label="成团人数：" prop="groupNum">
                                    <el-input-number v-model="groupSetting.groupNum" controls-position="right" :min="2" style="width: 100px"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="团长折扣：" prop="leaderDiscount">
                                    <el-input-number v-model="groupSetting.leaderDiscount" controls-position="right" :min="0" :max="1" :precision="2" :step=".1" style="width: 100px"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="团员折扣：" prop="followDiscount">
                                    <el-input-number v-model="groupSetting.followDiscount" controls-position="right" :min="0" :max="1" :precision="2" :step=".1" style="width: 100px"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6" v-for="(item, index) in groupSetting.specialDiscount" :key="index" >
                                <el-form-item label="特殊折扣：" :prop="'specialDiscount.' + index + '.discount'"
                                :rules="{required: true, message: '特殊折扣不能为空', trigger: 'blur'}" >
                                    <el-input-number v-model="item.discount" controls-position="right" :min="0" :max="1" :precision="2" :step=".1" style="width: 100px"></el-input-number>
                                    <el-button type="text" @click.prevent="remove(item)" style="margin-left: 6px">删除</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="有效时长：" prop="validTimeOut">
                                    <el-input-number v-model="groupSetting.validTimeOut" controls-position="right" :min="1"></el-input-number> 小时
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="最大支付时限：" prop="payTimeOut">
                                    <el-input-number v-model="groupSetting.payTimeOut" controls-position="right" :min="1"></el-input-number> 小时
                                    <!-- <p>0表示未支付不能参团</p> -->
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="20">
                                <el-checkbox v-model="groupSetting.groupActivityItemType" :true-label="2" :false-label="1">抽奖团</el-checkbox>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="6">
                                <el-form-item label="中奖人数：">
                                    <el-input-number v-model="groupSetting.numOfWinners" controls-position="right" :min="1"></el-input-number>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="未中奖退款：">
                                    <el-select v-model="groupSetting.refundType" placeholder="请选择" size="medium">
                                        <el-option v-for="(val, key) in refundType"
                                                   :key="key"
                                                   :label="val.name"
                                                   :value="val.key"
                                        ></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item label="新用户数：">
                                    <el-input-number v-model="groupSetting.numOfNewUsers" controls-position="right" :min="0"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-card>
            <el-card class="info-card">
                <div class='info-title mar-b-10'>用户分级</div>
                <div class="user-category">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <h2>发团用户</h2>
                            <div>
                                <el-radio-group v-model="createGroupRadio">
                                    <div class="user-type">
                                        <el-radio :label="3">全量用户</el-radio>
                                    </div>
                                    <div class="user-type">
                                        <el-radio :label="1">等级</el-radio>
                                        <el-checkbox-group v-model="createGroupCheckList" v-if="createGroupRadio === 1" class="type-item">
                                            <el-checkbox v-for="(item, index) in memberLevel" :key="index" :label="item.label" ></el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div class="user-type">
                                        <el-radio :label="2">用户ID</el-radio>
                                        <el-input
                                            class="type-item"
                                            v-if="createGroupRadio === 2"
                                            type="textarea"
                                            :autosize="{ minRows: 2, maxRows: 4}"
                                            placeholder="可填写多个用户id，id之间用英文','隔开"
                                            v-model="createUserIdList"
                                            style="width: 350px">
                                        </el-input>
                                    </div>
                                </el-radio-group>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <h2>参团用户</h2>
                            <div>
                                <el-radio-group v-model="joinGroupRadio">
                                    <div class="user-type">
                                        <el-radio :label="3">全量用户</el-radio>
                                    </div>
                                    <div class="user-type">
                                        <el-radio :label="1">等级</el-radio>
                                        <el-checkbox-group v-model="joinGroupCheckList" v-if="joinGroupRadio === 1" class="type-item">
                                            <el-checkbox v-for="(item, index) in memberLevel" :key="index" :label="item.label"></el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div class="user-type">
                                        <el-radio :label="2">用户ID</el-radio>
                                        <el-input
                                            class="type-item"
                                            v-if="joinGroupRadio === 2"
                                            type="textarea"
                                            :autosize="{ minRows: 2, maxRows: 4}"
                                            placeholder="可填写多个用户id，id之间用英文','隔开"
                                            v-model="joinUserIdList"
                                            style="width: 350px">
                                        </el-input>
                                    </div>
                                </el-radio-group>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-card>
            <el-card class="info-card">
                <div class='info-title mar-b-10'>拼团商品</div>
                <div class="group-product">
                    <h2>商品信息</h2>
                    <el-table border :data="productBaseData" :header-cell-style="{background:'#F5F7FA',color:'#606266'}" style="width:700px">
                        <el-table-column prop="spuId" label="spuId" align="center" min-width="100px"></el-table-column>
                        <el-table-column prop="name" label="商品信息" align="center" min-width="200px"></el-table-column>
                    </el-table>
                    <h2>SKU设置</h2>
                    <el-table border :data="skuTableData" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                        <el-table-column prop="skuId" label="skuId" align="center" width="170px" fixed="left"></el-table-column>
                        <el-table-column prop="price" :label="'原价('  + getCurrencyUnit( groupSetting.countryCode, 'currencyUnit') + ')'" align="center" min-width="90px"></el-table-column>
                        <el-table-column prop="priceVip" :label="'VIP价格('  + getCurrencyUnit( groupSetting.countryCode, 'currencyUnit') + ')'" align="center" min-width="100px"></el-table-column>
                        <el-table-column prop="activePrice" :label="'参考活动价('  + getCurrencyUnit( groupSetting.countryCode, 'currencyUnit') + ')'" align="center" min-width="100px"></el-table-column>
                        <el-table-column align="center" width="130px">
                            <template slot="header" slot-scope="scope">
                                *活动价
                                <el-tooltip class="item" effect="dark" content="一键同步(以第一条sku为源数据)" placement="top">
                                    <i class="el-icon-refresh" @click="syncData('activityPrice')"></i>
                                </el-tooltip>
                            </template>
                            <template slot-scope="scope">
                                <el-input-number
                                    v-model="scope.row.activityPrice"
                                    :controls="false"
                                    :min="0" :precision="2" size="mini">
                                </el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" width="130px">
                            <template slot="header" slot-scope="scope">
                                {{ countryCode == 'TH' ? '活动总佣金率' : '活动佣金率' }}
                                <el-tooltip class="item" effect="dark" content="1表示 100%佣金率； 0.1即10%佣金率；0.01即1%佣金率；0即无佣金" placement="top">
                                    <i class="el-icon-info"></i>
                                </el-tooltip>
                            </template>
                            <template slot-scope="scope">
                                {{scope.row.commission / 100}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" width="150px">
                            <template slot="header" slot-scope="scope">
                                {{ countryCode == 'TH' ? '*活动总佣金率' : '*活动佣金率' }}
                                <el-tooltip class="item" effect="dark" content="一键同步(以第一条sku为源数据)" placement="top">
                                    <i class="el-icon-refresh" @click="syncData('activityCommissionRate')"></i>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="1表示 100%佣金率； 0.1即10%佣金率；0.01即1%佣金率；0即无佣金" placement="top">
                                    <i class="el-icon-info"></i>
                                </el-tooltip>
                            </template>
                            <template slot-scope="scope">
                                <el-input-number
                                    v-model="scope.row.activityCommissionRate"
                                    :controls="false"
                                    :min="0"
                                    :max="999999"
                                    :precision="2" size="mini">
                                </el-input-number>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" min-width="100px">
                            <template slot="header" slot-scope="scope">
                                *活动库存
                                <el-tooltip class="item" effect="dark" content="一键同步(以第一条sku为源数据)" placement="top">
                                    <i class="el-icon-refresh" @click="syncData('activityStock')"></i>
                                </el-tooltip>
                            </template>
                            <template slot-scope="scope">
                                <el-input-number v-model="scope.row.activityStock" :controls="false" :min="0" size="mini">
                                </el-input-number>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { viewById, updateGroup } from '@/request/marketing.js'
    import { viewProductInfo } from '@/request/product'
    export default {
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            serialId: {
                type: String,
                default: ''
            },
            countryCode: {
                type: String,
                default: 'MY'
            }
        },
        data () {
            return {
                dialogTitle: '编辑拼团',
                refundType: [{
                    name: '积分方式',
                    key: 1
                }],
                groupSetting: {
                    groupTime: ['', ''],
                    groupNum:3,
                    leaderDiscount: 1,
                    followDiscount: '1',
                    specialDiscount: [
                        {discount: '1'},
                    ],
                    validTimeOut: 0,
                    payTimeOut: 0,
                    countryCode: '',
                    numOfWinners: '',
                    numOfNewUsers: '',
                    refundType: '1',
                    groupActivityItemType: 1
                },
                ruleValidate: {
                    groupTime: [
                        { required: true, message: '请选择拼团时间', trigger: 'change' }
                    ],
                    groupNum: [
                        { required: true, message: '请输入成团人数', trigger: 'blur' },
                    ],
                    leaderDiscount: [
                        { required: true, message: '请输入团长折扣', trigger: 'blur' }
                    ],
                    followDiscount: [
                        { required: true, message: '请输入团员折扣', trigger: 'blur' }
                    ],
                    validTimeOut: [
                        { required: true, message: '请输入有效时长', trigger: 'blur' }
                    ],
                    payTimeOut: [
                        { required: true, message: '请输入最大支付时限', trigger: 'blur' }
                    ]
                },
                options: [],
                productBaseData: [],
                skuTableData:[],
                createGroupRadio: null,
                joinGroupRadio: null,
                createGroupCheckList: [],
                joinGroupCheckList: [],
                createUserIdList: '',
                joinUserIdList: '',
                memberLevel: [{
                    label: 'SH',
                    value: 'SH'
                }, {
                    label: 'PS',
                    value: 'PS'
                }, {
                    label: 'AM',
                    value: 'AM'
                }, {
                    label: 'AT',
                    value: 'AT'
                }],
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            }
        },
        components: {
        },
        watch: {
            dialogVisible: function(newValue, oldValue) {
                if (newValue) {
                    this.getGroupDetail()
                }
            }
        },
        created () {
        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
            },
            confirm() {
                // if (this.verifySettingData()) {
                    console.log(this.groupSetting)
                // }
                let createGroupGrade = {
                    type: null,
                    groupType: 1,
                    gdesc: ''
                }
                let joinGroupGrade = {
                    type: null,
                    groupType: 2,
                    gdesc: ''
                }
                let activityErrorItems = ''
                let activityTipItems = ''
                let rateTipItems = ''
                let rateErrorItems = ''
                let rateLowTipItems = ''
                let list = [...this.skuTableData]

                if (this.createGroupRadio) {
                    if (this.createGroupRadio === 1) {
                        if (this.createGroupCheckList.length > 0) {
                            createGroupGrade.gdesc = this.createGroupCheckList.join(',')
                        } else {
                            this.$message.error('请设置发团用户等级！')
                            return
                        }
                    } else if (this.createGroupRadio === 2) {
                        createGroupGrade.gdesc = this.createUserIdList
                    } else {
                        createGroupGrade.gdesc = ''
                    }
                    createGroupGrade.type = this.createGroupRadio
                } else {
                    this.$message.error('请设置发团用户！')
                    return
                }

                if (this.joinGroupRadio) {
                    if (this.joinGroupRadio === 1) {
                        if (this.joinGroupCheckList.length > 0) {
                            joinGroupGrade.gdesc = this.joinGroupCheckList.join(',')
                        } else {
                            this.$message.error('请设置发团用户等级！')
                            return
                        }
                    } else if (this.joinGroupRadio === 2) {
                        joinGroupGrade.gdesc = this.joinUserIdList
                    } else {
                        joinGroupGrade.gdesc = ''
                    }
                    joinGroupGrade.type = this.joinGroupRadio
                } else {
                    this.$message.error('请设置参团用户！')
                    return
                }

                for (let i = 0; i < list.length; i++) {
                    let item = list[i]

                    if (item.activityCommissionRate >= 1) {
                        rateErrorItems +=  `${item.skuId} `
                    } else if (item.activityCommissionRate < 1 && item.activityCommissionRate >= 0.2) {
                        rateTipItems += `${item.skuId} `
                    } else if (item.activityCommissionRate < 0.01) {
                        // 本意用于检测小于1%的，但是小数位只保留两位（会默认改为最小0.01），避免截除保留两位小数导致精度问题，所以判断0也可以
                        rateLowTipItems += `${item.skuId} `
                    }

                    let activityPrice = parseFloat(item.activityPrice)
                    if (activityPrice > item.priceVip) {
                        activityErrorItems += `${item.skuId} `
                    } else if (activityPrice < item.activePrice) {
                        activityTipItems += `${item.skuId} `
                    }
                }
                if (rateErrorItems) {
                    this.$message.error(rateErrorItems + '的活动佣金率设置异常，保存失败')
                    return false
                } else if (activityErrorItems) {
                    this.$message.error(activityErrorItems + '的活动价设置过高，保存失败')
                } else if (activityTipItems || rateTipItems || rateLowTipItems) {
                    let text = activityTipItems ? activityTipItems + '的活动价过低，' : ''
                    text += rateTipItems ? rateTipItems + '的活动佣金率过高，' : ''
                    text += rateLowTipItems ? rateLowTipItems + '的活动佣金率过低，' : ''

                    this.$confirm(text + '确认要保存吗？', '提醒', {
                        confirmButtonText: '保存',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.handleGoConfirm(createGroupGrade, joinGroupGrade)
                    }).catch(() => {
                        return false
                    })
                } else {
                    this.handleGoConfirm(createGroupGrade, joinGroupGrade)
                }
            },
            handleGoConfirm (createGroupGrade, joinGroupGrade) {
                _.forEach(this.groupSetting.specialDiscount, specialDiscount => {
                    specialDiscount.discount = specialDiscount.discount + ''
                })
                 _.forEach(this.skuTableData, row => {
                     row.activityPrice = row.activityPrice + ''
                     row.activityCommissionRate = row.activityCommissionRate + ''
                 })

                let params = {
                    serialId: this.serialId,
                    numOfWinners: this.groupSetting.numOfWinners,
                    numOfNewUsers: this.groupSetting.numOfNewUsers,
                    refundType: this.groupSetting.refundType,
                    groupActivityItemType: this.groupSetting.groupActivityItemType,
                    startTime: this.groupSetting.groupTime[0] + '',
                    endTime: this.groupSetting.groupTime[1] + '',
                    groupNum: this.groupSetting.groupNum,
                    leaderDiscount: this.groupSetting.leaderDiscount + '',
                    followDiscount: this.groupSetting.followDiscount + '',
                    specialDiscount: this.groupSetting.specialDiscount,
                    validTimeOut: this.groupSetting.validTimeOut,
                    payTimeOut: this.groupSetting.payTimeOut,
                    createGroupGrade: createGroupGrade,
                    joinGroupGrade: joinGroupGrade,
                    productSkuListVo: this.skuTableData
                }
                console.log(params)
                updateGroup(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('活动更新成功！')
                        this.$emit('on-confirm')
                        this.createGroupCheckList = []
                        this.joinGroupCheckList = []
                    }

                }).catch(err => {
                    console.log(err)
                })
            },
            verifySettingData() {
                let flag = false
                this.$refs.groupSettingForm.validate((valid) => {
                    if (valid) {
                        if (this.groupSetting.specialDiscount.length > this.groupSetting.groupNum) {
                            this.$message.warning('特殊折扣数量不能超过成团人数')
                            flag = false
                        } else {
                            flag = true
                        }
                    } else {
                        flag = false
                    }
                });
                return flag
            },
            getGroupDetail() {
                let params = {
                    itemSerialId: this.serialId
                }
                viewById(params).then(res => {
                    if (res.ret.errcode === 1) {
                        let specialDiscount = {}
                        if (res.specialDiscount) {
                            specialDiscount = res.specialDiscount
                        } else {
                            specialDiscount = [{discount: '1'}]
                        }
                        if (!res.productSkuListVo.length) {
                            // 当前没有编辑过，就取当前到未来60天的时间
                            const start = (new Date(new Date().toLocaleDateString())).getTime()
                            const end = start + 3600 * 1000 * 24 * 60 - 1
                            this.groupSetting.groupTime = [start, end]
                        } else {
                            this.groupSetting.groupTime = [res.startTime, res.endTime]
                        }
                        this.groupSetting.countryName = res.countryName
                        this.groupSetting.countryCode = res.countryCode
                        this.groupSetting.subjectName = res.subjectName
                        this.groupSetting.groupNum = res.groupNum
                        this.groupSetting.leaderDiscount = res.leaderDiscount
                        this.groupSetting.followDiscount = res.followDiscount
                        this.groupSetting.specialDiscount = specialDiscount
                        this.groupSetting.validTimeOut = res.validTimeOut || 24 // 默认为24小时
                        this.groupSetting.payTimeOut = res.payTimeOut || 2 // 默认为2小时
                        this.groupSetting.numOfWinners = res.numOfWinners
                        this.groupSetting.numOfNewUsers = res.numOfNewUsers
                        this.groupSetting.refundType = res.refundType
                        this.groupSetting.groupActivityItemType = res.groupActivityItemType
                        if (res.createGroupGrade) {
                            this.createGroupRadio = res.createGroupGrade.type
                            if (res.createGroupGrade.type === 1) {
                                this.createGroupCheckList = res.createGroupGrade.gdesc.split(',')
                            } else if (res.createGroupGrade.type === 2) {
                                this.createUserIdList = res.createGroupGrade.gdesc
                            }
                        } else {
                            this.createGroupRadio = 3 // 默认取全量用户
                        }

                        if (res.joinGroupGrade) {
                            this.joinGroupRadio = res.joinGroupGrade.type
                            if (res.joinGroupGrade.type === 1) {
                                this.joinGroupCheckList = res.joinGroupGrade.gdesc.split(',')
                            } else if (res.joinGroupGrade.type === 2) {
                                this.joinUserIdList = res.joinGroupGrade.gdesc
                            }
                        } else {
                            this.joinGroupRadio = 3
                        }
                        // 查询商品详细数据
                        if (res.productId) {
                            this.getProductDetailById(res.productId, res.countryCode, res.productSkuListVo)
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            addSpecialRate() {
                if (this.groupSetting.specialDiscount.length >= this.groupSetting.groupNum ) {
                    this.$message.warning('特殊折扣数量不能超过成团人数')
                    return
                }
                this.groupSetting.specialDiscount.push({
                    discount: 1
                });
            },
            remove(item) {
                // if (this.groupSetting.specialDiscount.length <= 1) {
                //     this.$message.warning('至少有一个特殊折扣')
                //     return
                // }
                let index = this.groupSetting.specialDiscount.indexOf(item)
                if (index !== -1) {
                    this.groupSetting.specialDiscount.splice(index, 1)
                }
            },
            syncData(type) {
                if (this.skuTableData.length > 0) {
                    let sourceData = this.skuTableData[0]
                    _.forEach(this.skuTableData, item => {
                        item[type] = sourceData[type]
                    })
                }
            },
            /**
             * 编辑时，根据商品id获取详细的商品信息
            */
            getProductDetailById(productId, countryCode, productSkuListVo) {
                this.skuTableData = []
                let params = {
                   productId: productId
                }
                viewProductInfo(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        let baseData = {}
                        baseData.spuId = productId
                        _.forEach(res.title, (title)=> {
                            if (title.languageCode === 'cn') {
                                baseData.name = title.name
                            }
                        })
                        this.productBaseData = [baseData]
                        _.forEach(res.skuCountry, (sku) => {
                            if (sku.countryCode === countryCode) {
                                sku.price = sku.price // 原价
                                sku.activityPrice = sku.activePrice // 默认取参考活动价
                                sku.activityCommissionRate = sku.commission / 100 // 默认取参考活动佣金率
                                sku.activityStock = 9999 // 活动库存默认取9999
                                this.skuTableData.push(sku)
                            }
                        })
                        if (productSkuListVo) {
                            _.forEach(productSkuListVo, productSku => {
                                _.forEach(this.skuTableData, row => {
                                    if (productSku.skuId === row.skuId) {
                                        row.activityPrice = productSku.activityPrice
                                        row.activityCommissionRate = productSku.activityCommissionRate
                                        row.activityStock = productSku.activityStock
                                    }
                                })
                            })
                        }
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            validateSpecialRate() {
                let isZero = false
                this.groupSetting.specialDiscount.forEach(item => {
                    if (item.value === 0) {
                        isZero = true
                    }
                })
                return isZero
            }
        }
    }
</script>
<style lang="scss">
.subject-ediit-dialog {
    .group-product {
        .el-input-number .el-input {
            width: 90%;
        }
    }
}
</style>
<style lang="scss" scoped>
    .action-btn-wrapper{
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: flex-end;
        box-sizing: border-box;
        padding: 0 50px 10px;
        border-bottom: 1px solid #EBEEF5;
    }
    .promotion-edit-wrapper{
        overflow: auto;
        flex: 1;
    }
    .user-category {
        h2 {
            height: 30px;
        }
        p {
            padding: 10px;
        }
        .user-type {
            padding: 10px 0;
            .type-item {
                display: block;
                margin: 6px 0px;
                padding-left: 20px
            }
        }
    }
    .group-product {
        h2 {
            height: 30px;
            margin-top: 10px;
        }
    }
</style>
