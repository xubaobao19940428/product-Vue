<template>
    <div class="activity-sku-wrapper">
        <div class="sync-wrapper" v-show="skuList.length && propType == 'edit'">
            <el-select class="input-item flex1" v-model="skuAttrList" clearable multiple filterable placeholder="请选择" size="medium">
                <el-option v-for="(item, index) in skuList"
                           :key="index"
                           :label="item.values"
                           :value="item.skuId"></el-option>
            </el-select>
            <el-input v-model="activePrice" placeholder="活动价" class="mar-l-10 input-item"></el-input>
            <el-input v-model="activeCommissionRate" placeholder="活动佣金率" class="mar-l-10 input-item"></el-input>
            <el-input v-model="activeStock" placeholder="活动库存" class="mar-l-10 input-item"></el-input>
            <el-button size="small" @click="syncSkuInfo" plain type="success" icon="el-icon-refresh" class="mar-l-10 sync-btn">同 步</el-button>
        </div>
        <el-table border
                  :data="skuList">
            <el-table-column label="skuID" prop="skuId" align="center" min-width="100px"></el-table-column>
            <el-table-column label="规格" min-width="100" align="center">
                <template slot-scope="scope">
                    {{ scope.row.values }}
                </template>
            </el-table-column>
            <el-table-column label="VIP价(RM)" min-width="100" align="center">
                <template slot-scope="scope">
                    {{ scope.row.priceVip }}
                </template>
            </el-table-column>
            <el-table-column label="参考活动价(RM)" min-width="150" align="center">
                <template slot-scope="scope">
                    {{ scope.row.adviseActivePrice }}
                </template>
            </el-table-column>
            <el-table-column min-width="100px" align="center">
                <template slot="header" slot-scope="scope">
                    <span class="required">*</span>活动价(RM)
                </template>
                <template slot-scope="scope">
                    <el-input-number 
                        v-if="propType == 'edit'" 
                        v-model="scope.row.activePrice" 
                        :controls="false" 
                        size="small" 
                        :min="0" 
                        :max="9999999" 
                        :precision="2"
                    ></el-input-number>
                    <span v-else>{{ scope.row.activePrice }}</span>
                </template>
            </el-table-column>
            <el-table-column label="佣金率%" min-width="80" align="center">
                <template slot-scope="scope">
                    {{ (scope.row.commissionRate * 100).toFixed(2) }}
                </template>
            </el-table-column>
            <el-table-column min-width="110px" align="center">
                <template slot="header" slot-scope="scope">
                    <span class="required">*</span>活动佣金率%
                </template>
                <template slot-scope="scope">
                    <el-input-number 
                        v-if="propType == 'edit'" 
                        v-model="scope.row.activeCommissionRate" 
                        :controls="false" 
                        size="small" 
                        :min="0" 
                        :max="9999999" 
                        :precision="2"></el-input-number>
                    <span v-else>{{ scope.row.activeCommissionRate }}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="100px" header-align="center">
                <template slot="header" slot-scope="scope">
                    <span class="required">*</span>活动库存
                </template>
                <template slot-scope="scope">
                    <el-input-number v-if="propType == 'edit'"  v-model="scope.row.activeStock" :controls="false" size="small" :min="0" :max="9999999" :precision="0"></el-input-number>
                    <span v-else>{{ scope.row.activeStock }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        props: {
            // propSkuList: {
            //     type: Array,
            //     default: () => { return [] }
            // },
            defaultSkuList: {
                type: Array,
                default: () => { return [] }
            },
            propType: {
                type: String,
                default: 'edit'
            }
        },
        data () {
            return {
                skuList: [],
                skuAttrList: [],
                activePrice: '',
                activeCommissionRate: '',
                activeStock: ''
            }
        },
        watch: {
            // propSkuList: {
            //     handler (data) {
            //         console.log(data)
            //         this.skuList = []
            //         for (let i = 0; i < data.length; i++) {
            //             this.skuList.push({
            //                 skuId: data[i].skuId,
            //                 values: data[i].values,
            //                 priceVip: data[i].priceVip,
            //                 adviseActivePrice: data[i].priceActivityRef,
            //                 activePrice: data[i].priceActivityRef,
            //                 commissionRate: data[i].commissionRate,
            //                 activeCommissionRate: this.multiplyFilter(data[i].commissionRate),
            //                 activeStock: 9999,
            //                 skuCode: data[i].skuCode
            //             })
            //         }
            //     },
            //     deep: true
            // },
            defaultSkuList: {
                handler (data) {
                    console.log(data)
                    console.log('defaultSkuList')
                    for (let i = 0; i < data.length; i++) {
                        data[i].activeCommissionRate = data[i].activeCommissionRate ? this.multiplyFilter(data[i].activeCommissionRate) : ''
                    }
                    this.skuList = data
                },
                deep: true
            }
        },
        created () {
            this.dataShow()
        },
        methods: {
            dataShow () {
                let data = JSON.parse(JSON.stringify(this.defaultSkuList))
                for (let i = 0; i < data.length; i++) {
                    data[i].activeCommissionRate = data[i].activeCommissionRate ? this.multiplyFilter(data[i].activeCommissionRate) : this.multiplyFilter(data[i].commissionRate)
                    data[i].activePrice = data[i].activePrice ? data[i].activePrice : data[i].adviseActivePrice
                    data[i].activeStock = data[i].activeStock 
                }
                this.skuList = data
            },
            getSkuList () {
                let self = this
                return new Promise((resolve) => {
                    let canSubmit = self.skuList.length > 0 ? true : false
                    if (canSubmit) {
                        let skuList = JSON.parse(JSON.stringify(self.skuList))
                        for (let i = 0; i < skuList.length; i++) {
                            skuList[i].activePrice = skuList[i].activePrice.toString()
                            skuList[i].activeStock = skuList[i].activeStock.toString()
                            skuList[i].activeCommissionRate = skuList[i].activeCommissionRate ? this.divideFilter(skuList[i].activeCommissionRate) : ''
                        }
                        resolve(skuList)
                        console.log(skuList)
                    } else {
                        self.$message.warning('请将规格信息补充完整')
                    }
                })
            },
            divideFilter (value) {
                let float = parseFloat(value || 0)
                return (float / 100).toFixed(2)
            },
            multiplyFilter (value) {
                let float = parseFloat(value || 0)
                return (float * 100).toFixed(0)
            },
            syncSkuInfo () {
                console.log('===>')
                for (let i = 0; i < this.skuList.length; i++) {
                    let item = this.skuAttrList.find((id) => {
                        return id == this.skuList[i].skuId
                    })
                    console.log(item)
                    if (item) {
                        if (this.activePrice) {
                            this.skuList[i].activePrice = this.activePrice
                        }
                        if (this.activeCommissionRate) {
                            this.skuList[i].activeCommissionRate = this.activeCommissionRate
                        }
                        if (this.activeStock) {
                            this.skuList[i].activeStock = this.activeStock
                        }
                    }
                }
            }
        }
    }
</script>
<style lang="scss">
    .activity-sku-wrapper{
        .el-input-number--small{
            width: 100%;
        }
        .sync-wrapper{
            display: flex;
            margin-bottom: 10px;
            width: 100%;
            .input-item{
                width: 100px;
            }
            .sync-btn{
                height: 40px;
            }
        }
    }
</style>
