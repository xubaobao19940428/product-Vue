<template>
    <el-dialog 
        :visible="goodsDialogShow"
        @close="handleClose"
        class="one-edit-goods-dialog"
        title="编辑大奖商品"
        width="800px"
    >
        <el-form :model="param" label-position="right" label-width="120px" >
            <!-- <el-form-item label="所在大奖专题："></el-form-item> -->
            <el-form-item label="活动时间：">
                <el-date-picker type="datetimerange" value-format="timestamp"
                    start-placeholder="开始时间" end-placeholder="结束时间"
                    v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="大奖商品：">
                <h2>商品信息</h2>
                <el-table :data="productBaseList" border :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                    <el-table-column label="商品ID" prop="productId" align="center" width="200px"></el-table-column>
                    <el-table-column label="商品名称" prop="skuName" align="center"></el-table-column>
                </el-table>
                <h2>SKU设置</h2>
                <el-table border :data="skuInfo" v-loading="load" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                    <el-table-column label="skuId" prop="skuId" align="center"></el-table-column>
                    <el-table-column label="sku图片" align="center">
                        <template slot-scope="scope">
                            <el-popover placement="top-start" trigger="hover">
                                <img :src="dealShowFileSrc(scope.row.skuCover)" class="previewImage">
                                <img v-popover:popover :src="dealShowFileSrc(scope.row.skuCover)"
                                    class="thumbnail"
                                    slot="reference">
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="原价">
                        <template slot="header" slot-scope="scope">
                            原价
                            <el-tooltip class="item" effect="dark" content="一键同步(以第一条sku为源数据)" placement="top">
                                <i class="el-icon-refresh" @click="syncData('skuPrice')"></i>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <el-input-number 
                                class="config-common-input"
                                :controls="false"
                                v-model="scope.row.skuPrice" :min="1"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="活动价">
                        <template slot="header" slot-scope="scope">
                            活动价
                            <el-tooltip class="item" effect="dark" content="一键同步(以第一条sku为源数据)" placement="top">
                                <i class="el-icon-refresh" @click="syncData('skuActivePrice')"></i>
                            </el-tooltip>
                        </template>
                        <template slot-scope="scope">
                            <el-input-number 
                                class="config-common-input"
                                :controls="false"
                                v-model="scope.row.skuActivePrice" :min="0"></el-input-number>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-row :gutter="8">
                <el-col :span="10">
                    <el-form-item label="中奖对象：">{{ winTypeObj[param.winType] }}</el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="所需码数：">
                        <el-input-number style="width: 100px" :controls="false" v-model="param.codeNumber" :min="1" :precision="0"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="8">
                <el-col :span="12">
                    <el-form-item label="邀新可获码数：">
                        <el-input-number controls-position="right" style="width: 100px" v-model="param.codeNewUser" :precision="0" :min="0"></el-input-number>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="邀老可获码数：">
                        <el-input-number controls-position="right" style="width: 100px" v-model="param.codeOldUser" :precision="0" :min="0"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="dialog-footer" slot="footer">
            <el-button @click="handleConfirm" type="primary" size="small">确定</el-button>
            <el-button size="small" @click="handleClose">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { listSuperLuckProductSkuRule } from '@/request/prize'
import { viewProductInfo } from '@/request/product'

export default {
    props: {
        goodsDialogShow: Boolean,
        productSerialId: [String, Number],
        productId: [String, Number],
        countryCode: String,
        productSetParam: Object
    },
    data () {
        return {
            productBaseList: [],
            param: {
                codeNumber: 1,
                winType: 1,
                codeOldUser: 0,
                codeNewUser: 0
            },
            setAvtivityPrice: 0,
            needFillSet: false,
            load: false,
            timeList: [],
            skuInfo: [],
            productBaseList: [],
            winTypeObj: {
                0: '真实用户',
                1: '机器人'
            }
        }
    },
    created () {
        let temp = JSON.parse(JSON.stringify(this.productSetParam))
        if (Object.keys(temp).length) {
            if (temp.startTime && temp.endTime) {
                this.timeList = [temp.startTime, temp.endTime]
            }
            Object.assign(this.param, {
                codeNewUser: temp.invitationNew,
                codeOldUser: temp.invitationOld
            })
            this.setAvtivityPrice = temp.activePrice
            this.needFillSet = true
        } else {
            this.param = {
                codeNumber: 1,
                winType: 1,
                codeOldUser: 0,
                codeNewUser: 0
            }
        }
        this.getDetail()
    },
    methods: {
        handleClose () {
            this.$emit('close')
        },
        syncData (type) {
            if (this.skuInfo.length > 0) {
                let skuItem = this.skuInfo[0]
                _.forEach(this.skuInfo, item => {
                    item[type] = skuItem[type]
                })
            }
        },
        getProductSkuData (skuInfos) {
            viewProductInfo({productId: this.productId}).then(res => {
                if (res.ret.errcode === 1) {
                    let baseData = {}
                    baseData.productId = this.productId
                    _.forEach(res.title, (title)=> {
                        if (title.languageCode === 'cn') {
                            baseData.skuName = title.name
                        }
                    })

                    this.productBaseList = [baseData]
                    res.skuCountry.forEach(item => {
                        let temp = {}
                        // 设置默认值
                        if (item.countryCode === this.countryCode) {
                            temp.skuId = item.skuId
                            temp.skuCover = item.cover
                            temp.skuPrice = item.price
                            temp.skuCode = item.skuCode
                            temp.skuActivePrice = this.needFillSet ? this.setAvtivityPrice :  (item.activePrice || 0)
                            this.skuInfo.push(temp)
                        }
                    })

                    if (skuInfos && skuInfos.length) {
                        skuInfos.forEach(item2 => {
                            this.skuInfo.forEach(item3 => {
                                if (item2.skuId == item3.skuId) {
                                    item3.id = item2.id
                                    item3.skuActivePrice = item2.skuActivePrice || 0
                                    item3.skuId = item2.skuId
                                    item3.skuCover = item2.skuCover
                                    item3.skuPrice = item2.skuPrice
                                    item3.skuCode = item2.skuCode
                                }
                            })
                        })
                    }
                }
            })
        },
        handleConfirm () {
            if (this.timeList.length < 2 ) {
                this.$message.error('活动时间必填')
                return
            }
            let resParam = JSON.parse(JSON.stringify(this.param))
            resParam.productSerialId = this.productSerialId
            resParam.startTime = this.timeList[0] + ''
            resParam.endTime = this.timeList[1] + ''
            resParam.updateSkuInfo = this.skuInfo.map(item => {
                return {
                    id: item.id || null,
                    skuActivePrice: item.skuActivePrice + '',
                    skuPrice: item.skuPrice + '',
                    skuId: item.skuId,
                    skuCode: item.skuCode
                }
            })
            this.$emit('confirm', resParam)
        },
        getDetail () {
            listSuperLuckProductSkuRule({productSerialId: this.productSerialId}).then(res => {
                if (res.ret.errcode === 1) {
                    if (res.startTime && res.endTime) {
                        this.timeList = [res.startTime, res.endTime]
                    }

                    Object.assign(this.param, {
                        codeNewUser: this.needFillSet ? this.param.codeNewUser : res.codeNewUser || 0,
                        codeOldUser: this.needFillSet ? this.param.codeOldUser : res.codeOldUser || 0,
                        winType: res.winType || 1,
                        codeNumber: res.codeNumber || 1
                    })
                    this.productBaseList = [res.skuInfos[0]]
                    if (this.productId) {
                        this.skuInfo = []
                        this.getProductSkuData(JSON.parse(JSON.stringify(res.skuInfos)))
                    } else {
                        this.skuInfo = res.skuInfos || []
                    }
                }
            })
        }
    }
}
</script>

<style scoped lang="scss">
.one-edit-goods-dialog {
    .config-common-input {
        width: 100%;
    }
}
</style>