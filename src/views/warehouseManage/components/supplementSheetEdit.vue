<template>
    <div class="sock-out-form-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="1000px" @close="cancle" :close-on-click-modal="false">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>基本信息</span>
                </div>
                <el-form ref="sockOutForm"  :model="sockOutData" :rules="ruleValidate" label-position="right" label-width="100px">
                    <el-form-item label="原出库单号："  >
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
                    <el-row>
                        <el-col :span="12">
                            <el-form-item prop="warehouseNo" label="补货出货仓：" class="filter-item" v-if="type == '3' || type == '5' ">
                                <el-select v-model="warehouseNo" clearable size="medium" placeholder="请选择仓库" @change="changeWarehouse(warehouseNo)">
                                    <el-option v-for="(val, key) in warehouseList" :key="key" :label="val.warehouseName" :value="val.warehouseNo"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>
            <el-card class="box-card" style="margin-top: 16px;">
                <div slot="header" class="clearfix">
                    <span>商品信息</span>
                    <el-button @click="addSku" style="float: right; padding: 3px 0" type="text">新增SKU</el-button>
                </div>
                <el-table :data="skuList" border fit highlight-current-row style="width: 100%;height: 100%">
                        <el-table-column prop="skuCode" label="skuCode" align="center" width="140px"></el-table-column>
                        <el-table-column prop="nameCn" label="商品名" align="center" min-width="150px"></el-table-column>
                        <el-table-column prop="standardAttr" label="sku信息" align="center" min-width="150px"></el-table-column>
                        <el-table-column prop="count" label="原出库单数量" align="center" width="140px"></el-table-column>
                        <el-table-column label="补发数量" min-width="100px" align="center" prop="count1" v-if="type == '3' || type == '5'">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.count1" :min="0" tyle="width: 150px;" @blur="checkCount(scope.row)" size="mini" type="number"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="换货数量" min-width="100px" align="center" prop="count1" v-if="type == '4' || type == '6'">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.count1" :min="0" tyle="width: 150px;" @blur="checkCount(scope.row)" size="mini" type="number"></el-input>
                            </template>
                        </el-table-column>
                    </el-table>
            </el-card>
            <el-card class="box-card" style="margin-top: 16px;" >
                <div slot="header" class="clearfix">
                    <span>收件人信息</span>
                </div>
                <el-form ref="saveAddressForm" :model="address" label-position="right" label-width="100px" v-if="type!=3">
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
                <el-form  ref="saveAddressForm" :model="address" label-position="right" label-width="100px" v-else>
                    <el-row> 
                        <el-col :span="12">
                            <el-form-item label="姓名：" prop="name">
                                <el-input v-model="address.receiverName"></el-input>
                            </el-form-item>
                            <el-form-item label="国家：" prop="country">
                                <el-input v-model="address.country"></el-input>
                            </el-form-item>
                            <el-form-item label="省：">
                                <el-select v-model="address.stateName" @change="getCityData" placeholder="省" style="width:100%">
                                    <el-option
                                        v-for="item in stateList"
                                        :key="item.stateName"
                                        :label="item.stateName"
                                        :value="item.stateName">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="手机号：" prop="mobile">
                                <el-input v-model="address.receiverPhone"></el-input>
                            </el-form-item>
                             <el-form-item label="邮编：" prop="postcode">
                                <el-select v-model="address.postcode" placeholder="邮编" style="width:100%">
                                <el-option
                                    v-for="item in postcodeList"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                                </el-option>
                            </el-select>
                            </el-form-item>
                            <el-form-item label="市：">
                                <el-select v-model="address.cityName" @change="getPostCode" placeholder="市" style="width:100%">
                                    <el-option
                                        v-for="item in cityList"
                                        :key="item.cityName"
                                        :label="item.cityName"
                                        :value="item.cityName">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="详细地址：" prop="address">
                        <el-input v-model="address.address">

                        </el-input>
                        </el-form-item>
                </el-form>
            </el-card>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="propShowDialog=true" size="small" v-if="type!=3">修改收件人信息</el-button>
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <app-address v-if="propShowDialog" :countryCode="address.country"  @confirm="updateAddress" :propShowDialog="propShowDialog"
                     :propParam="address" :countryList="countryList" @close="propShowDialog=false"></app-address>
        <!-- 新建sku库存 -->
        <add-sku-inventory-dialog :dialogVisible="addInventoryDialogVisible" :type="'1'" @on-cancle="handleOnCancle" @confirm="handleOnConfirm"></add-sku-inventory-dialog>

    </div>
</template>
<script>
    import _ from 'lodash'
    import { outOrderDetail, GetReissueWarehouse } from '@/request/warehouse'
    import appAddress from '@/components/addressSelect/appAddress'
    import { updateReceiverAddress } from '@/request/order.js'
    import { addInventory } from '@/request/inventory'
    import AddSkuInventoryDialog from './AddSkuInventoryDialog'
    import { getAppCountryDivision } from '@/request/i18n.js'
    export default {
        // 新建出库单
        name: 'SockOutFormDialog',
        data () {
            return {
                cityList:[],
                stateList:[],
                postcodeList:[],
                skuCodeAdd: true,
                addInventoryDialogVisible: false,
                warehouseList: [],
                propShowDialog: false,
                addIndex: 3,
                sockOutData: {
                    oldOutNo: '',
                    outType: '',
                    warehouseName: '',
                    orderNo: '',
                    subOrderNo: ''
                },
                warehouseNo: '',
                ruleValidate: {
                    oldOutNo: [{
                        required: true,
                        trigger: 'blur',
                        message: '原出库单号不能为空'
                    }],
                    warehouseNo: [{
                        required: false,
                        trigger: 'change',
                        message: '出货仓库不能为空'
                    }]
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
                cityAndStateType:''
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
            },
            countryCode:{
                type:String,
                default:''
            }
        },
        components: { appAddress, AddSkuInventoryDialog },
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
            if (this.oldOutNo != '') {
                this.getOutOrderDetail()
            }
        },
        mounted(){
            this.getAddressData({
                            resolve: (data) => {
                                this.stateList = data
                            }
                        })
        },
        methods: {
            getAddressData ({ resolve }) {
                getAppCountryDivision({
                    countryCode: this.countryCode,
                    stateName: this.address.stateName
                }).then((res) => {
                    console.log(res)
                    resolve && resolve(res.stat)
                    if(this.cityAndStateType=='state'){
                       this.address.cityName= res.stat[0].stateName
                       this.address.postcode = res.stat[0].city[0].postcode[0]
                    }
                })
            },
            resetAddress (type) {
                switch (type) {
                    case 'country':
                        this.address.stateName = ''
                        this.address.stateCode = ''
                        this.address.cityCode = ''
                        this.address.cityName = ''
                        this.address.postcode = ''

                        break
                    case 'state':
                        this.address.cityCode = ''
                        this.address.cityName = ''
                        this.address.postcode = ''
                        console.log(this.address)
                        break
                    case 'city':
                        this.address.postcode = ''
                        break
                }
                
            },
            getCityData () {
                this.getAddressData({
                    resolve: (stat) => {
                        this.cityAndStateType = 'state'
                        this.resetAddress('state')
                        
                        this.cityList = stat[0].city
                        this.postcodeList = []
                    }
                })
            },
            getPostCode () {
                this.cityAndStateType = 'city'
                this.resetAddress('city')
                let city = this.cityList.find((val) => {
                    return val.cityName == this.address.cityName
                })
                this.postcodeList = city.postcode
                this.address.postcode = this.postcodeList[0]
            },
            changeWarehouse (data) {
                if (data == '') {
                    this.$message.error('补货出货仓不可为空！')
                    this.warehouseNo = this.sockOutData.warehouseNo
                }
            },
            getTypeName (item) {
                let data = this.outTypeList.find((val) => {
                    return val.value == item
                })
                return data ? data.label : item
            },
            handleOnCancle () {
                this.addInventoryDialogVisible = false
            },
            // data为返回SKU数据
            handleOnConfirm (data) {
                this.skuCodeAdd = true
                this.addInventoryDialogVisible = false
                for (let i = 0; i < this.skuList.length; i++) {
                    if (data.skuCode == this.skuList[i].skuCode) {
                        this.$message.error('添加失败！skuCode不可重复！')
                        this.skuCodeAdd = false
                        return false
                    }
                }
                if (this.skuCodeAdd == true) {
                    this.skuList.push({
                        skuCode: data.skuCode,
                        nameCn: data.nameCn,
                        standardAttr: data.standardAttr,
                        count: 0,
                        count1: 0
                    })
                }
            },
            checkCount (data) {
                if (data.count1 < 0 || data.count1 === '') {
                    this.$alert('数据不能为空或小于零')
                    data.count1 = 0
                    return false
                }
                return true
            },
            /**
             * 获取仓库列表
             */
            getWarehouseList () {
                let params = {
                    outNo: this.sockOutData.oldOutNo
                }
                console.log(params)
                GetReissueWarehouse(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.warehouseList = res.warehouse
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 保存收货人相关信息
            updateAddress (param) {
                updateReceiverAddress(Object.assign(param, {
                    orderId: this.sockOutData.orderNo
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('保存收件人信息成功！')
                        this.propShowDialog = false
                        this.getOutOrderDetailAddress()
                        // this.$emit('refresh')
                    }
                })
            },
            getOutOrderDetailAddress () {
                console.log(this.sockOutData.oldOutNo)
                let params = {
                    outNo: this.sockOutData.oldOutNo
                }
                outOrderDetail(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.address = res.outOrder.address
                        this.address.detail = this.address.address
                         
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    console.log(err)
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
                        this.warehouseNo = this.sockOutData.warehouseNo
                        this.skuList1 = res.outOrder.sku
                        // 拼接count
                        this.skuList1.map((item, index) => {
                            this.skuList.push(
                                Object.assign({}, item, { count1: '0' })
                            )
                        })
                        this.address = res.outOrder.address
                        this.address.detail = this.address.address
                        this.getWarehouseList()
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 新增SKU显示弹窗
            addSku () {
                this.addInventoryDialogVisible = true
            },
            addColumn () {
                let item = {}
                let length = this.tableCols.length
                item.lable = `出库单${this.addIndex}`
                item.name = `name${this.addIndex}`
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
                        outOrderSku.outType = this.sockOutData.outType
                        outOrderSku.warehouseNo = this.warehouseNo
                        outOrderSku.outNo = this.sockOutData.oldOutNo
                        outOrderSku.type = this.type
                        if(this.type==3){
                        outOrderSku.phone = this.address.receiverPhone
                        outOrderSku.countryCode = this.address.country
                        outOrderSku.province = this.address.stateName
                        outOrderSku.city = this.address.cityName
                        outOrderSku.name = this.address.receiverName
                        outOrderSku.postcode = this.address.postcode
                        outOrderSku.address = this.address.address
                        }   
                       
                        let skuList = []
                        console.log(this.skuList)
                        _.forEach(this.skuList, sku => {
                            let item = {}
                            // item.batchNo = key
                            item.count = sku.count1
                            item.skuCode = sku.skuCode
                            skuList.push(item)
                        })
                        console.log(skuList)
                        outOrderSku.sku = skuList
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
