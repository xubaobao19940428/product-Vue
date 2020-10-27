<template>
    <div class="order-after-sale">
        <div class="after-sale">
            <el-card shadow="always" class="">
                <div class="step1-title">
                    <div class="title">Step1 选择售后商品</div>
                    <div class="prompt">多个商品系统将生成多条售后单</div>
                </div>
                <el-table :data="tableData" ref="multipleTable" border style="width: 100%" @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center" fixed="left"></el-table-column>
                    <el-table-column label="商品信息" width="400" align="center">
                        <template slot-scope="scope">
                            <div class="produt">
                                <img :src="dealShowFileSrc(scope.row.productItem.productSnap.skuCover)" />
                                <div class="product-content">
                                    <div class="product-content-supplier">商品ID：{{scope.row.productItem.productSnap.productId}}</div>
                                    <div class="product-content-supplier">skuID：{{scope.row.productItem.productSnap.skuId}}</div>
                                    <div class="product-content-name">{{scope.row.productItem.productSnap.productName}}</div>
                                    <div v-if="scope.row.productItem.productSnap && scope.row.productItem.productSnap.attr && scope.row.productItem.productSnap.attr.length !== 0" class="product-content-supplier">
                                        规格：
                                        <span v-for="item in scope.row.productItem.productSnap.attr" :key="item.attrId">{{item.attrLabel}}：{{ item.valueLabel }} </span>
                                    </div>
                                    <div class="product-pledge">
                                        <div v-for="(item,index) in scope.row.productItem.productSnap.afterPledge" :key="index" :class="{ 'pricess': scope.row.ischose }">{{item.label}}</div>
                                        <div v-for="(val,index) in scope.row.productItem.productSnap.arrivalPledge" :key="index" :class="{ 'pricess': scope.row.ischose }">{{val.label}}</div>
                                    </div>
                                    <div class="promotion-coupon-wrapper">
                                        <div class="promotion" v-if="scope.row.productItem.productSnap.promotion.length > 0">
                                            <em>促销</em>
                                            <div>
                                                <span class="mar-r-10" v-for="(item, i) in scope.row.productItem.productSnap.promotion" :key="scope.$index + '-promotion' + i">{{ item.label }}</span>
                                            </div>
                                        </div>
                                        <div class="coupon" v-if="scope.row.productItem.productSnap.coupon.length > 0">
                                            <em>用劵</em>
                                            <div>
                                                <span class="mar-r-10" v-for="(item, i) in scope.row.productItem.productSnap.coupon" :key="scope.$index + '-coupon' + i">{{ item.label }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="子单编号" width="250" align="center">
                        <template slot-scope="scope">
                            <div v-for="(item,index) in scope.row.productItem.suborderItem" :key="index" class="sub-order-wrapper">
                                <div>发货仓库名称：{{item.warehouseName}}</div>
                                <div>{{item.suborderId}}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="子单状态" width="100" align="center">
                        <template slot-scope="scope">
                            <div v-for="(item,index) in scope.row.productItem.suborderItem" :key="index" class="sub-order-wrapper">
                                <div>{{subStatus[item.status]}}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="发货状态" width="180" align="center">
                        <template slot-scope="scope">
                            {{scope.row.refundStatus}}
                        </template>
                    </el-table-column> -->
                    <el-table-column label="售后数量" width="250" align="center">
                        <template slot-scope="scope">
                            <div>最多可退{{ scope.row.calAfterSalesAmount.refundNum }}</div>
                            <el-input-number v-model="scope.row.num" controls-position="right" @change="handleChange($event,scope.row.productItem.productSnap.skuId)" :min="1" :max="scope.row.calAfterSalesAmount.refundNum"></el-input-number>
                            <!-- <el-input v-model="scope.row.num" :disabled="true"></el-input> -->
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="退款金额" width="200" align="center"> -->
                    <el-table-column label="是否退运费" width="200" align="center">
                        <template slot-scope="scope">
                            <!-- <div>最多可退{{ scope.row.calAfterSalesAmount.refundAmount }}</div> -->
                            <div class="amount-box">
                                <!-- <el-input v-model="scope.row.amount" placeholder="请输入内容"></el-input> -->
                                <el-switch v-model="scope.row.freight" active-color="#13ce66" inactive-color="#C0C4CC" @change="freightChange(scope.row.productItem.productSnap.skuId)"></el-switch>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
            <div>
                <el-row :gutter="12" class="num-row">
                    <el-card shadow="always" class="card">
                        <el-col :span="12" class="step2">
                            <div class="title">Step2 选择退款方式</div>
                            <el-form label-position="left" label-width="80px" :model="queryData" :rules="queryRules">
                                <el-form-item prop="refundAmount" label="退款总额：">
                                    <div>{{ refundCurrency }}{{ queryData.refundAmount }}（含运费{{queryData.refundFreight}}）</div>
                                </el-form-item>
                                <el-form-item prop="refundType" label="退款账户：">
                                    <el-radio-group v-model="queryData.refundType">
                                        <el-radio label="1">积分</el-radio>
                                        <el-radio label="0">银行卡</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <div class="bank-meaasge">
                                    <el-form-item prop="refundCardNo" label="银行卡号：">
                                        <el-select v-model="queryData.refundCardNo" placeholder="请选择" size="small" @change="cardChange">
                                            <el-option
                                                v-for="item in refundCardNoList"
                                                :key="item.val"
                                                :label="item.label"
                                                :value="item.val">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item prop="refundBankName" label="银行名称：">
                                        <el-select v-model="queryData.refundBankName" placeholder="请选择" size="small" @change="bankChange">
                                            <el-option
                                                v-for="item in refundBankNameList"
                                                :key="item.val"
                                                :label="item.label"
                                                :value="item.val">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item prop="refundCardholder" label="账户名称">
                                        <el-input v-model="queryData.refundCardholder" size="small" disabled></el-input>
                                    </el-form-item>
                                    <el-form-item prop="mobile" label="联系电话：">
                                        <el-input v-model="queryData.mobile" size="small" disabled></el-input>
                                    </el-form-item>
                                    <el-form-item prop="email" label="电子邮箱：">
                                        <el-input v-model="queryData.email" size="small" disabled></el-input>
                                    </el-form-item>
                                </div>
                            </el-form>
                        </el-col>
                    </el-card>
                    <el-card shadow="always" class="card">
                        <el-col :span="12" class="step3">
                                <div class="title">Step3 填写售后愿意</div>
                                <el-form label-position="left" label-width="80px" :model="reson" :rules="rules">
                                    <el-form-item prop="afterType" label="售后类型：">
                                        <el-radio-group v-model="reson.afterType">
                                            <el-radio label="7">仅退款</el-radio>
                                            <el-radio label="1">退货退款</el-radio>
                                        </el-radio-group>
                                    </el-form-item>
                                    <el-form-item label="售后原因：" prop="reason">
                                        <el-select v-model="reson.reason" filterable clearable placeholder="请选择" size="medium">
                                            <el-option v-for="item in reasonList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="上传凭证：">
                                        <div class="pic-box">
                                            <c-upload :fileList="reson.pic" @setData="setCoverImg" :limit="3" :iscopy="true" accept="jpeg,jpg,png"></c-upload>
                                            <div class="pic-prompt">支持jpg、jpeg、png，最多3张；</div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item label="备注说明：">
                                        <el-input type="textarea" v-model="reson.remark"></el-input>
                                    </el-form-item>
                                </el-form>
                        </el-col>
                     </el-card>
                </el-row>
            </div>  
        </div>
        <el-card shadow="always" class="footer">
            <!-- <div class="btn-box">  -->
                <!-- <el-button type="primary" plain>提交并审核通过</el-button> -->
                <el-button type="primary" @click="submitAfterSale">提交售后</el-button>
            <!-- </div> -->
        </el-card>
        <out-bound v-if="outBoundDialog" :dialogVisible="outBoundDialog" :orderId="orderId" :selectedSkuInfoList="selectedSkuInfoList" @on-cancle="cancleOutBound" @stepReq="stepReq" @on-confirm="confirmOutBound"></out-bound>
    </div>
</template>
<script>
    import { GetAfterSaleProduct, GetUserBankList, ComputeReturnAmount, ReturnOperValid, ApplyForRefundV1, AllReturnReason } from '@/request/afterSale'
    import cUpload from '@/components/fileUpload/'
    import outBound from './components/outBound'

    export default {
        data () {
            return{
                orderId: '',
                tableData: [],
                refundCurrency: '',
                queryData: {
                    refundAmount: '0',
                    refundFreight: '0',
                    refundType: '1',
                    refundCardNo: '',
                    refundBankName: '',
                    refundCardholder: '',
                    mobile: '',
                    email: ''
                },
                reson: {
                    afterType: '7',
                    reason: '',
                    pic: [],
                    remark: ''
                },
                subStatus: {
                    0: '待支付',
                    1: '待发货',
                    2: '待收货',
                    3: '交易成功',
                    4: '交易关闭',
                    5: '部分发货'
                },
                reasonList: [],
                rules: {
                    afterType: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                    reason: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                },
                queryRules: {
                    refundAmount: [{ required: true}],
                    refundType: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                    refundCardNo: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                    refundBankName: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                    refundCardholder: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                    mobile: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                    email: [{ required: true, message: '请至少选择一个', trigger: 'change' }]
                },
                refundBankNameList: [],
                refundCardNoList: [],
                picLists: [],
                skuList:[],
                product: [],
                bankList: [],
                outBoundDialog: false,
                selectedSkuInfoList:[]
            }
        },
        components:{
            cUpload,
            outBound
        },
        mounted() {
            this.orderId = this.$route.query.orderId
            this.getAfterSaleProduct()
            this.getAllReturnReason()
        },
        methods: {
            getAllReturnReason () {
                AllReturnReason({}).then(res => {
                    if (res.ret.errcode === 1) {
                        this.reasonList = res.refundReason
                    }
                })
            },
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        // setTimeout(()=>{
                        //     this.$refs.multipleTable.toggleRowSelection(row)
                        // },500)
                        this.$nextTick(()=>{
                            this.$refs.multipleTable.toggleRowSelection(row)
                        })
                        // this.$refs.multipleTable.toggleAllSelection()
                    })
                } 
            },
            handleSelectionChange (val) {
                console.log(val)
                this.skuList.splice(0)
                this.product.splice(0)
                this.selectedSkuInfoList.splice(0)
                for (const iterator of this.tableData) {
                    iterator.ischose = false
                }
                let product = []
                for (const iterator of val) {
                    iterator.ischose = true
                    this.skuList.push({skuId:iterator.productItem.productSnap.skuId}) 
                    this.product.push({
                        skuId:iterator.productItem.productSnap.skuId,
                        applyNum: iterator.num,
                        returnFreight: iterator.freight
                    })
                    product.push({
                        skuId:iterator.productItem.productSnap.skuId,
                        num: iterator.num,
                        returnFreight: iterator.freight
                    })
                    this.selectedSkuInfoList.push({
                        skuId:iterator.productItem.productSnap.skuId,
                        productName:iterator.productItem.productSnap.productName,
                        skuCover:iterator.productItem.productSnap.skuCover,
                        attr:iterator.productItem.productSnap.attr,
                        outOrderCount: iterator.outOrderCount,
                        num: iterator.num
                    })
                }
                let obj = {};
                let peon = this.product.reduce((cur,next) => {
                    obj[next.skuId] ? "" : obj[next.skuId] = true && cur.push(next);
                    return cur;
                },[]) 
                this.product = peon
                let obj1 = {};
                let peon1 = this.skuList.reduce((cur,next) => {
                    obj1[next.skuId] ? "" : obj1[next.skuId] = true && cur.push(next);
                    return cur;
                },[]) 
                this.skuList = peon1
                let obj2 = {};
                let peon2 = this.selectedSkuInfoList.reduce((cur,next) => {
                    obj2[next.skuId] ? "" : obj2[next.skuId] = true && cur.push(next);
                    return cur;
                },[]) 
                this.selectedSkuInfoList = peon2
                if (product.length !== 0) {
                    let obj2 = {};
                    let peon2 = product.reduce((cur,next) => {
                        obj2[next.skuId] ? "" : obj2[next.skuId] = true && cur.push(next);
                        return cur;
                    },[]) 
                    product = peon2
                    console.log(product)
                    this.getComputeReturnAmount(product) 
                }else {
                    this.queryData.refundAmount = '0'
                    this.queryData.refundFreight = '0'
                }
            },
            cardChange (val) {
                console.log(val)
                for (const iterator of this.bankList) {
                    if (val === iterator.accountNo) {
                        this.queryData.refundBankName = iterator.bankName
                        this.queryData.refundCardholder = iterator.accountName
                        this.queryData.mobile = iterator.mobile
                        this.queryData.email = iterator.email
                    }
                }
            },
            bankChange (val) {
                console.log(val)
                for (const iterator of this.bankList) {
                    if (val === iterator.bankName) {
                        this.queryData.refundCardNo = iterator.accountNo
                        this.queryData.refundCardholder = iterator.accountName
                        this.queryData.mobile = iterator.mobile
                        this.queryData.email = iterator.email
                    }
                }
            },
            setCoverImg(res){
                this.picLists = res.data.split(',')
                console.log(this.picLists)
            },
            // 合并单元格
            arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
                let activeColumn = [1,4,5]
                let item = activeColumn.find((val) => {
                    return val == columnIndex
                })
                if (item || columnIndex == 0) {
                    if (row.rowspan) {
                        return {
                            rowspan: row.rowspan,
                            colspan: 1
                        }
                    } else {
                        return {
                           rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            },
            getAfterSaleProduct () {
                let params = {
                    orderId: this.orderId
                }
                GetAfterSaleProduct(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        if (res.afterSaleOrderProduct.length === 0) {
                            this.$confirm('暂无可售后商品！', '提示', {
                                confirmButtonText: '知道了',
                                cancelButtonText: '',
                                type: 'warning'
                            }).then(async () => {
                                this.$router.push({
                                    name: 'orderList'
                                })
                            }).catch(() => {
                                this.$router.push({
                                    name: 'orderList'
                                })
                            })
                        }else{
                            this.getUserBankList(res.userId)
                            // let data = []
                            // for (let i = 0; i < res.afterSaleOrderProduct.length; i++) {
                            //     for (let j = 0; j < res.afterSaleOrderProduct[i].productItem.suborderItem.length; j++) {
                            //         let item = JSON.parse(JSON.stringify(res.afterSaleOrderProduct[i]))
                            //         if (j == 0) {
                            //             item['rowspan'] = res.afterSaleOrderProduct[i].productItem.suborderItem.length
                            //         }
                            //         Object.assign(item, res.afterSaleOrderProduct[i].productItem.suborderItem[j],{num:res.afterSaleOrderProduct[i].calAfterSalesAmount.refundNum,amount:res.afterSaleOrderProduct[i].calAfterSalesAmount.refundAmount,freight:false,ischose:false})
                            //         data.push(item)
                            //     }
                            // }
                            // console.log(data)
                            let data = []
                            for (let index = 0; index < res.afterSaleOrderProduct.length; index++) {
                                Object.assign(res.afterSaleOrderProduct[index],{num:res.afterSaleOrderProduct[index].calAfterSalesAmount.refundNum,freight:false,ischose:false})
                                data.push(res.afterSaleOrderProduct[index])
                            }
                            this.tableData = res.afterSaleOrderProduct
                            if(res.afterSaleOrderProduct.length === 1) {
                                this.toggleSelection(data)
                            }
                        }
                    }
                })
            },
            handleChange (val,skuId) {
                console.log(this.product)
                for (let index = 0; index < this.product.length; index++) {
                    if (this.product[index].skuId === skuId ) {
                        this.product[index].applyNum = val
                    } 
                }
                for (const iterator of this.selectedSkuInfoList) {
                    if (iterator.skuId === skuId) {
                        iterator.num = val
                    }
                }
                let amount = JSON.parse(JSON.stringify(this.product).replace(/applyNum/g,"num"))
                this.getComputeReturnAmount(amount)
            },
            getComputeReturnAmount (val) {
                let params = {
                    orderId: this.orderId,
                    product: val
                }
                ComputeReturnAmount (params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.refundCurrency = res.currency
                        this.queryData.refundAmount = res.returnAmount
                        this.queryData.refundFreight = res.returnFreight
                    }
                })
            },
            getUserBankList (userId) {
                let params = {
                    userId
                }
                GetUserBankList(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.bankList = res.data
                        this.refundCardNoList.splice(0)
                        this.refundBankNameList.splice(0)
                        for (let index = 0; index < res.data.length; index++) {
                            this.refundCardNoList.push({val:res.data[index].accountNo,label:res.data[index].accountNo})
                            this.refundBankNameList.push({val:res.data[index].bankName,label:res.data[index].bankName})
                        }   
                    }
                })
            },
            freightChange (val) {
                if (this.product.length !== 0) {
                    for (let index = 0; index < this.product.length; index++) {
                        if (val === this.product[index].skuId) {
                            this.product[index].returnFreight = !this.product[index].returnFreight
                            let amount = JSON.parse(JSON.stringify(this.product).replace(/applyNum/g,"num"))
                            console.log(amount)
                            this.getComputeReturnAmount(amount)
                            return
                        }
                    }
                    this.$message.error('请选择售后商品！')
                } else {
                    this.$message.error('请选择售后商品！')
                }
            },
            submitAfterSale () {
                if (this.reson.reason === '') {
                    this.$message.error('请选择售后原因！')
                } else if(this.product.length === 0){
                    this.$message.error('请选择售后商品！')
                } else {
                    if (this.queryData.refundType == '0') {
                        if (this.queryData.refundCardNo === '' || this.queryData.refundBankName === '' || this.queryData.refundCardholder === '') {
                            this.$message.error('请填写必填信息')
                            return
                        }
                    }
                    this.getReturnOperValid()
                }
            },
            getReturnOperValid () {
                let params = {
                    operType: 1,
                    orderId: this.orderId,
                    product: this.skuList
                }
                ReturnOperValid(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        if(res.popContent){
                            this.$confirm(res.popContent.detailContent, res.popContent.warnContent, {
                                confirmButtonText: '仅提交申请',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then( async() => {
                                for (let index = 0; index < this.selectedSkuInfoList.length; index++) {
                                    if (this.selectedSkuInfoList[index].outOrderCount <= 1) {
                                        this.selectedSkuInfoList.splice(index--,1)
                                    } 
                                }
                                if (this.selectedSkuInfoList.length !== 0 ) {
                                    this.outBoundDialog = true
                                } else {
                                    await this.getApplyForRefundV1()
                                }
                                
                            }).catch(() => {
                                this.$message({
                                    type: 'info',
                                    message: '已取消'
                                })
                            })
                        } else {
                            for (let index = 0; index < this.selectedSkuInfoList.length; index++) {
                                if (this.selectedSkuInfoList[index].outOrderCount <= 1) {
                                    this.selectedSkuInfoList.splice(index--,1)
                                } 
                            }
                            if (this.selectedSkuInfoList.length !== 0 ) {
                                this.outBoundDialog = true
                            } else {
                                this.getApplyForRefundV1()
                            }
                        }
                    }
                })
            },
            cancleOutBound () {
                this.outBoundDialog = false
            },
            stepReq () {
                this.outBoundDialog = false
                this.getApplyForRefundV1()
            },
            confirmOutBound (val) {
                this.outBoundDialog = false
                console.log(val)
                let list = []
                let out = []
                let superId = []
                let outBound = []

                for (const iterator of val) {
                    list.push(iterator.skuOutOrderData)
                    outBound.push([])
                }
                console.log(list)
                for (const iterator of list) {
                    for (const item of iterator) {
                        out.push(item)
                        superId.push(item.superSkuId)
                    }
                }
                let arr = [...new Set(superId)]
                console.log(out)
                console.log(arr)
                for (let index = 0; index < arr.length; index++) {
                    for (const val of out) {
                        if (arr[index] === val.superSkuId) {
                            outBound[index].push(...val.outOrder)
                        }
                    }
                    
                }
                console.log(outBound)
                this.getApplyForRefundV1(arr,outBound)
            },
            getApplyForRefundV1 (superId,outBound) {
                let bankId = ''
                for (const iterator of this.bankList) {
                    if (this.queryData.refundCardNo == iterator.accountNo) {
                        bankId = iterator.id
                    }
                }
                let code = 0
                for (const iterator of this.reasonList) {
                    if (iterator.value === this.reson.reason) {
                        code = iterator.code
                    }
                }
                let product = []
                console.log(superId)
                console.log(this.product)
                if (outBound) {
                    for (let index = 0; index < this.product.length; index++) {
                        // for (const iterator of this.product) {

                            if (this.product[index].skuId === superId[index]) {
                                product.push({
                                    applyNum: this.product[index].applyNum,
                                    returnFreight: this.product[index].returnFreight,
                                    skuId: this.product[index].skuId,
                                    out: outBound[index]
                                })
                            
                            } else {
                                product.push({
                                    applyNum: this.product[index].applyNum,
                                    returnFreight: this.product[index].returnFreight,
                                    skuId: this.product[index].skuId,
                                    out: []
                                })
                            }
                        // }
                    }
                } else {
                    for (const iterator of this.product) {
                        product.push({
                            applyNum: iterator.applyNum,
                            returnFreight: iterator.returnFreight,
                            skuId: iterator.skuId,
                            out: []
                        })
                    }
                }
                console.log(product)
                let params = {
                    orderId: this.orderId,
                    reason: this.reson.reason,
                    reasonCode: code.toString(),
                    refundAmount: this.queryData.refundAmount,
                    bankId: bankId,
                    refundType: Number(this.queryData.refundType),
                    afterType: Number(this.reson.afterType),
                    remark: this.reson.remark,
                    pic: this.picLists,
                    refundCurrency: this.refundCurrency,
                    product: product,
                    mobile: this.queryData.mobile,
                    email: this.queryData.email
                }
                console.log(params)
                ApplyForRefundV1(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.$router.push({
                            name: 'afterSale'
                        })
                    }
                })
            }

        }
    }
</script>
<style lang="scss">
    .order-after-sale{
        .el-input__inner,.el-input--small,.el-input-number {
            width: 200px
        }
        .el-form-item__content{
            margin-left: 0px !important;
        }
        .el-textarea{
            width:400px;
        }
        .el-textarea__inner{
            min-height: 100px !important;
        }
    }
</style>
<style lang="scss" scoped>
    .order-after-sale{
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        .after-sale{
            height: calc(100% - 82px);
            overflow: scroll;
        }
        .step1-title{
            display: flex;
            justify-content: flex-start;
            margin-bottom: 10px;
            .prompt{
                height: 26px;
                line-height: 26px;
                font-size: 12px;
                color: rgb(141,141,141)
            }
        }
        .produt{
            display: flex;
            justify-content: space-around;
            padding: 10px 0;
            img{
                width: 100px;
                height: 100px;
            }
            .product-content{
                width: 250px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
            }
            .product-content-name{
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
                overflow: hidden;
                margin-bottom: 10px;
            }
            .product-content-supplier{
                text-align: left;
                color: rgb(120, 120, 120)
            }
            .product-pledge{
                display: flex;
                div{
                    margin-right: 5px;
                }
            }
        }
        .promotion-coupon-wrapper{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 30px;
            .promotion, .coupon{
                display: flex;
                align-items: center;
                flex: 1;
                max-width: 150px;
                height: 100%;
                overflow: hidden;
                em{
                    background: #fd9a38;
                    color: #fff;
                    box-sizing: border-box;
                    padding: 0 5px;
                    height: 100%;
                }
                >div{
                    flex: 1;
                    height: 100%;
                    display: inline-block;
                    vertical-align: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    border: 1px solid #fd9a38;
                    color: #fd9a38;
                }
                span{
                    margin-left: 4px;
                }
            }
            .coupon{
                margin-left: 10px;
                >div{
                    border: 1px solid #e30326;
                    color: #e30326;
                }
                em{
                    background: #e30326;
                }
            }
        }
        .pricess{
            color: #e30326;
        }
        .title{
            margin-right: 10px;
            margin-bottom: 30px;
            font-size: 22px;
            color: rgb(88,88,88)
        }
        .amount-box{
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .num-row{
            display: flex;
            margin-top: 10px;
            margin-right: 0px;
            .card{
                width: 49.5%;
                margin-left: 5px;
            }
            .step2{
                height: 100%;
            }
            .step3{
                height: 100%;
            }
        }
        .pic-box{
            width: 500px;
            margin-left: 80px;
            .pic-prompt{
                color: rgb(177,177,177);
            }
        }
        .bank-meaasge{
            margin-left: 80px;
        }
        .footer{
            width: 100%;
            // position: fixed;
            bottom: 0px;
            display: flex;
            justify-content: center;
        }
        .sub-order-wrapper{
            border-top: 1px solid #EBEEF5;
            height: 60px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            >div{
                width: 100%;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .sub-order-wrapper:nth-child(1) {
            border-top: 0;
        }
    }
</style>