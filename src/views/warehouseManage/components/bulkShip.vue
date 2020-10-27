<template>
    <el-dialog
        title="发货"
        :visible.sync="toggle"
        width="1300px"
        :before-close="cancle"
        class="bulk-ship">
        <el-table :data="blukShipList[0].details" border style="width: 100%">
            <el-table-column label="商品" width="400" align="center" fixed="left">
                <template slot-scope="scope">
                    <div class="produt">
                        <img :src="dealShowFileSrc(scope.row.productCover)" />
                        <div class="product-content">
                            <div class="product-content-name">{{scope.row.productName}}</div>
                            <!-- <div class="product-content-supplier">商家货号：{{scope.row.skuCode}}</div> -->
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="规格" width="180" align="center">
                <template slot-scope="scope">
                    <div>{{scope.row.skuDesc}}</div>
                </template>
            </el-table-column>
            <el-table-column label="数量" width="180" align="center">
                <template slot-scope="scope">
                    <div>
                        <div>{{scope.row.count}}</div>
                        <div class="num-ship">已发货：{{scope.row.shipCount}}</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="发货数量" width="180" align="center">
                <template slot-scope="scope">
                    <div>
                        <div v-for="(item, index) in count[scope.$index]" :key="index" class="split-logis">
                            <el-input v-model="count[scope.$index][index]" placeholder="发货数量" size="medium" style="width: 230px"></el-input>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="物流发货" width="1000" align="center">
                <template slot-scope="scope">
                    <div v-for="(item, index) in splitLogistics[scope.$index]" :key="index" class="split-logis">
                        <el-select v-model="shipCountryCode" size="medium" clearable disabled class="disableSelect">
                            <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :value="item.shortCode"></el-option>
                        </el-select>
                        <el-select v-model="item.logiCompany" size="medium" clearable placeholder="请选择物流公司">
                            <el-option v-for="(item, index) in logiCompany" :key="index" :label="item.companyName" :value="item.logiCompany"></el-option>
                        </el-select>
                        <el-input v-model="item.logiCode" placeholder="物流单号" size="medium" style="width: 230px"></el-input>
                        <div class="operate">
                            <i class="iconfont" v-if="index !== 0" @click="deleteLogis(scope.$index,index)">&#xe61e;</i>
                            <div class="split-logi" v-if="index === (splitLogistics[scope.$index].length - 1)" @click="splitLogis(scope.$index,index)">拆分物流</div>
                        </div>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancle">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { Ship, GetLogiCompanyList } from '@/request/directMail'
    import { dealShowFileSrc } from '@/js/common/globalMethod'

    export default {
        data() {
            return {
                splitLogistics: [],
                count: [],
                logiCompany:[]
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            blukShipList: Array,
            shipCountryCode: String
        },
        created () {
            console.log(this.blukShipList)
            for(let i = 0;i<this.blukShipList[0].details.length;i++){
                this.$set(this.splitLogistics,i,[{
                    logiCode: '',
                    logiCompany: ''
                }])
                let count = this.blukShipList[0].details[i].count - this.blukShipList[0].details[i].shipCount
                this.$set(this.count,i,[count])
            }
            console.log(this.splitLogistics)
            console.log(this.count)
        },
        mounted () {
            this.getLogiCompanyList()
        },
        watch: {
            tableData: {
                handler(newVal, oldVal) {
                    console.log(newVal, oldVal)
                },
                deep: true
            }
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {}
            },
            countryList () {
                return this.$store.state.dict.countryList
            },
        },
        methods: {
             getLogiCompanyList () {
                let params = {
                    page: {
                        pageNum: 1,
                        pageSize: 100
                    },
                    type: 2,
                    countryCode: this.shipCountryCode,
                    logiCompany: '',
                    companyName: '',
                    cooperateStatus: 1
                }
                GetLogiCompanyList(params).then(res => {
                    if(res.ret.errcode === 1){
                        console.log(res)
                        this.logiCompany = res.logiCompany
                    }
                })
            },
            getShip () {
                let deliver = []
                let logi = []
                let realShip = []
                let skuCodeList = []
                for (const iterator of this.blukShipList[0].details) {
                    skuCodeList.push(iterator.skuCode)
                }
                for(let i = 0;i<this.splitLogistics.length;i++){
                    if (this.splitLogistics[i][0].logiCode!=='' || this.splitLogistics[i][0].logiCompany!=='') {
                        realShip.push(i)
                    }
                    let item = []
                    for(let j = 0;j<this.splitLogistics[i].length;j++){
                        console.log(this.splitLogistics[i][j])
                        console.log(this.count[i][j])
                        let itemI = Object.assign({},this.splitLogistics[i][j],{count:Number(this.count[i][j])})
                        item.push(itemI)
                    }
                    console.log(item)
                    logi.push(item)
                }
                console.log(logi)
                console.log(this.blukShipList)
                for(let i = 0;i<logi.length;i++){
                    for(let j = 0;j<realShip.length;j++){
                        if( i === realShip[j]) {
                            console.log(i)
                            deliver.push({
                                jitNo: this.blukShipList[0].jitNo,
                                skuCode: this.blukShipList[0].details[i].skuCode,
                                logi: logi[i]
                            })
                        }
                    }
                }
                console.log(deliver)
                let params = {
                    languageCode: 'cn',
                    deliver:deliver,
                    reqType: 1
                }
                Ship(params).then(res => {
                    if(res.ret.errcode === 1){
                        console.log(res)
                        this.$message.success('发货成功！')
                        this.$emit('on-confirm')
                    }
                })
            },
            deleteLogis (i,index) {
                // this.splitLogistics[i].splice(index,1)
                // this.count[i].splice(index,1)
                this.$delete(this.splitLogistics[i],index)
                this.$delete(this.count[i],index)
            },
            splitLogis (index,i) {
                // this.splitLogistics[index].push({
                //     logiCode: '',
                //     logiCompany: ''
                // })
                this.$set(this.splitLogistics[index],i+1,{
                    logiCode: '',
                    logiCompany: ''
                })
                this.$set(this.count[index],i+1,0)
                this.$forceUpdate()
                // this.count[index].push(0)
            },
            cancle () {
                this.$emit('on-cancle')
            },
            confirm () {
                this.getShip()
            }
        },
    }
</script>
<style lang="scss">
    .bulk-ship{
        .el-select{
            margin: 0 5px;
        }
        .el-input{
            margin: 0 5px;
        }
    }
</style>
<style lang="scss" scoped>
    .bulk-ship{
        .num-ship{
            color: rgb(250,198,143)
        }
        .split-logis{
            display: flex;
            justify-content: flex-start;
            margin-top: 10px;
            .disableSelect{
                margin-left: 0px;
            }
        }
        .operate{
            height: 36px;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            cursor: pointer;
        }
        .split-logi{
            color: #409EFF;
            margin-left: 5px;
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
        }
    }
</style>