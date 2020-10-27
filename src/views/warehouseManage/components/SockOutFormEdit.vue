<template>
    <div class="sock-out-form-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="1000px" @close="cancle" :close-on-click-modal="false">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>基本信息</span>
                </div>
                <el-form ref="sockOutForm"  :model="sockOutData" :rules="ruleValidate" label-position="right" label-width="100px">
                    <el-form-item label="原出库单号：" prop="oldOutNo" >
<!--                        <el-input v-model="sockOutData.oldOutNo" @blur="getOutOrderDetail" size="medium" style="width: 300px"></el-input>-->
                        {{sockOutData.oldOutNo || '-'}}
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="出库类型：" prop="outType">
<!--                                <el-select v-model="sockOutData.outType" clearable size="medium" placeholder="请选择库存类型" disabled>-->
<!--                                    <el-option v-for="(item, key) in outTypeList" :key="key" :label="item.label" :value="item.value"></el-option>-->
<!--                                </el-select>-->
                                {{getTypeName(sockOutData.outType) || '-'}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="仓库名称：" prop="warehouseName">
                                {{sockOutData.warehouseName || '-'}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="关联订单号：" prop="orderNo">
                                {{sockOutData.orderNo || '-'}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="子订单号：" prop="subOrderNo">
                                {{sockOutData.subOrderNo || '-'}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
            <el-card class="box-card" style="margin-top: 16px;">
                <div slot="header" class="clearfix">
                    <span>商品信息</span>
                    <el-button @click="addColumn" style="float: right; padding: 3px 0" type="text">添加</el-button>
                </div>
                <el-table :data="skuList" border fit highlight-current-row  style="width: 100%;height: 100%">
                        <el-table-column prop="skuCode" label="skuCode" align="center" width="140px"></el-table-column>
                        <el-table-column prop="nameCn" label="商品名" align="center" min-width="150px"></el-table-column>
                        <el-table-column prop="standardAttr" label="sku信息" align="center" min-width="150px"></el-table-column>
                        <el-table-column prop="count" label="原出库单数量" align="center" width="140px"></el-table-column>
                        <el-table-column v-for="(col, index) in tableCols" :prop="col.value" min-width="120" align="center" :key="col.value" :label="col.lable">
                            <template slot="header" slot-scope="scope">
                                <span style="margin-right: 8px">{{col.lable}}</span> <i v-if="index != 0" class="el-icon-circle-close" @click="deleteCol(col.name)"></i>
                            </template>
                            <template slot-scope="scope" >
                                <el-input  v-model="scope.row[col.value]" size="medium"></el-input>
                            </template>
                        </el-table-column>
                 </el-table>
            </el-card>
            <el-card class="box-card" style="margin-top: 16px;">
                <div slot="header" class="clearfix">
                    <span>收件人信息</span>
                </div>
                <el-form ref="saveAddressForm" :model="address" label-position="right" label-width="100px" >
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="姓名：" prop="name">
                                {{address.receiverName}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号：" prop="mobile">
                                {{address.receiverPhone}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="国家：" prop="country">
                                {{address.country}}
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮编：" prop="postcode">
                                {{address.postcode}}
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="收货地址：" prop="address">
                            {{address.stateName}} - {{address.cityName}} - {{address.address}}
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="propShowDialog=true" size="small">修改收件人信息</el-button>
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <app-address v-if="propShowDialog" :countryCode="address.country"  @confirm="updateAddress" :propShowDialog="propShowDialog"
                     :propParam="address" :countryList="countryList" @close="propShowDialog=false"></app-address>
    </div>
</template>
<script>
    import _ from 'lodash'
    import { outOrderDetail } from '@/request/warehouse'
    import appAddress from '@/components/addressSelect/appAddress'
    import { updateReceiverAddress } from '@/request/order.js'

    export default {
        // 新建出库单
        name: 'SockOutFormDialog',
        data () {
            return {
                totalCount1: 0,
                totalCount2: 0,
                propShowDialog: false,
                addIndex: 3,
                sockOutData: {
                    oldOutNo: '',
                    outType: '',
                    warehouseName: '',
                    orderNo: '',
                    subOrderNo: ''
                },
                ruleValidate: {
                    oldOutNo: [{
                        required: true,
                        trigger: 'blur',
                        message: '原出库单号不能为空'
                    }]
                    // outType: [{
                    //     required: true,
                    //     trigger: 'change',
                    //     message: '出库类型不能为空'
                    // }]
                },
                address: {
                    receiverName: '',
                    receiverPhone: '',
                    country: '',
                    postcode: '',
                    address: '',
                    cityName: '',
                    detail: '',
                    stateName: ''
                },
                // ruleAddress: {
                //     name: [{
                //         required: true,
                //         trigger: 'blur',
                //         message: '姓名不能为空'
                //     }],
                //     mobile: [{
                //         required: true,
                //         trigger: 'blur',
                //         message: '手机号不能为空'
                //     }],
                //     country: [{
                //         required: true,
                //         trigger: 'blur',
                //         message: '国家不能为空'
                //     }],
                //     postcode: [{
                //         required: true,
                //         trigger: 'blur',
                //         message: '邮编不能为空'
                //     }],
                //     address: [{
                //         required: true,
                //         trigger: 'blur',
                //         message: '收货地址不能为空'
                //     }]
                // },
                skuList: [],
                outTypeList: [{
                    value: 'B2C_ORDER',
                    label: 'B2C订单'
                }, {
                    value: 'B2B_ORDER',
                    label: 'B2B订单'
                }, {
                    value: 'SPILT_ORDER',
                    label: '拆单'
                }, {
                    value: 'TRANSFER_ORDER',
                    label: '调仓'
                }, {
                    value: 'REFUND_SPILT_ORDER',
                    label: '退款拆单'
                }, {
                    value: 'REISSUE',
                    label: '补发'
                }, {
                    value: 'BARTER',
                    label: '换货'
                }],
                tableCols: [{
                                lable: '出库单1',
                                name: 'out1',
                                value: 'out1'
                            },
                            {
                                lable: '出库单2',
                                name: 'out2',
                                value: 'out2'
                            }]
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            dialogTitle: {
                type: String,
                default: ''
            },
            oldOutNo: {
                type: String,
                default: ''
            },
            type: {
                type: String,
                default: ''
            }
        },
        components: { appAddress },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            toggle: {
                get: function () {
                    return this.dialogVisible
                },
                set: function () {}
            }
        },
        created () {
            this.sockOutData.oldOutNo = this.oldOutNo
            console.log(this.oldOutNo)
            if (this.oldOutNo != '') {
                this.getOutOrderDetail()
            }
        },
        // mounted () {
        //
        // },
        methods: {
            /**
             * 处理数组显示
             */
            getTypeName (item) {
                let data = this.outTypeList.find((val) => {
                    return val.value == item
                })
                return data ? data.label : item
            },
            // 保存收货人相关信息
            updateAddress (param) {
                updateReceiverAddress(Object.assign(param, {
                    orderId: this.sockOutData.orderNo
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('保存收件人信息成功！')
                        this.propShowDialog = false
                        this.getOutOrderDetail()
                        // this.$emit('refresh')
                    }
                })
            },
            getOutOrderDetail () {
                console.log(this.sockOutData.oldOutNo)
                let params = {
                    outNo: this.sockOutData.oldOutNo
                }
                outOrderDetail(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.sockOutData = Object.assign(this.sockOutData, res.outOrder)
                        this.skuList = res.outOrder.sku
                        this.address = res.outOrder.address
                        this.address.detail = this.address.address
                        console.log(this.address)
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            addColumn () {
                let item = {}
                let length = this.tableCols.length
                item.lable = `出库单${this.addIndex}`
                item.name = `out${this.addIndex}`
                item.value = `out${this.addIndex}`
                this.tableCols.push(item)
                this.addIndex = this.addIndex + 1
            },
            cancle () {
                this.reset()
                this.$emit('on-cancle')
            },
            confirm () {
                this.$refs.sockOutForm.validate((valid) => {
                    if (valid) {
                        let outOrderSku = {}
                        outOrderSku.oldOutNo = this.sockOutData.oldOutNo
                        outOrderSku.outNo = this.sockOutData.oldOutNo
                        outOrderSku.outType = this.sockOutData.outType
                        outOrderSku.type = this.type
                        let skuList = []
                        let skuList2 = []
                        _.forEach(this.skuList, sku => {
                            _.forEach(sku, (value, key) => {
                                if (key.indexOf('out') != -1) {
                                    let item = {}
                                    item.batchNo = key
                                    item.count = value
                                    item.skuCode = sku.skuCode
                                    skuList.push(item)
                                }
                            })
                        })
                        // console.log(this.skuList)
                        // console.log(skuList)
                        // console.log(this.tableCols)
                        // for (let i = 0; i < skuList.length; i++) {
                        //     this.totalCount1 += skuList[i].count
                        // }
                        // for (let i = 0; i < this.skuList.length; i++) {
                        //     this.totalCount2 += this.skuList[i].count
                        // }
                        for (let i = 0; i < this.tableCols.length; i++) {
                            for (let j = 0; j < skuList.length; j++) {
                                if (this.tableCols[i].name === skuList[j].batchNo) {
                                    let item = {}
                                    item.batchNo = skuList[j].batchNo
                                    item.count = skuList[j].count
                                    item.skuCode = skuList[j].skuCode
                                    skuList2.push(item)
                                }
                            }
                        }
                        // console.log(skuList2)
                        outOrderSku.sku = skuList2
                        this.$emit('on-confirm', outOrderSku)
                        // this.reset()
                    }
                })
            },
            reset () {
                this.$refs.sockOutForm.resetFields()
                // this.$refs.saveAddressForm.resetFields()
                this.addIndex = 3
                this.skuList = []
                this.tableCols = [{
                                      lable: '出库单1',
                                      name: 'out1',
                                      value: 'out1'
                                  },
                                  {
                                      lable: '出库单2',
                                      name: 'out2',
                                      value: 'out2'
                                  }]
            },
            deleteCol (name) {
                this.tableCols.splice(_.findIndex(this.tableCols, function (o) { return o.name == name }), 1)
                console.log(this.tableCols)
            }
        }
    }
</script>

<style lang="scss">
    .sock-out-form-dialog {
        .el-dialog__header {
            border-bottom: 1px solid #ebeef5;
        }
        .el-dialog__body {
            padding: 50px 40px;
        }
        .el-dialog__footer {
            border-top: 1px solid #ebeef5;
        }
        .el-form--inline .el-form-item {
            margin-right: 0;
        }
    }

    .upload-wapper {
        overflow: hidden;
    }
    .cover-image {
        width: 110px;
        height: 110px;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        padding: 4px;
        &:hover {
            .operate-area {
                opacity: .5;
                transition: opacity .3s;
                border-radius: 6px;
            }
        }
        .operate-area {
            position: absolute;
            opacity: 0;
            background: #000000;
            height: 110px;
            line-height: 110px;
            bottom: 0;
            left: 0px;
            width: 110px;
            box-sizing: border-box;
            color: #fff;
            font-size: 16px;
            text-align: center;
        }
    }
</style>
