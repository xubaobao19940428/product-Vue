<template>
    <el-dialog title="发货信息" width="1200px" :visible.sync="deliver.show" @close="deliver.show = false">
        <el-button class="button-sync-tag mar-t-20" size="mini" type="primary" @click="SyncNow()">复制到所有商品
        </el-button>
        <el-form label-position="left" label-width="90px" :model="deliver.param" ref="ship" style="margin-left:1px">
            <el-form-item>
                <div class="logistics-info-wrapper">
                    <div style="margin-left: -86px;">采购单号：{{this.deliver.param.purchaseOrderNo}}</div>
                    <div v-for="(item, i) in deliver.ships" class="mar-b-10 logistics-info-item" :key="i">
                        <div class="flex" style="margin-left: -86px;">
                            <div style="width: 240px">skuCode：{{item.skuCode}}</div>
                            <div style="width: 160px">未发货数量：{{item.availableShipCount}}</div>
                            <div>
                                <div v-for="(skuItem, j) in item.logiList" :key="j">
                                    <div class="flex align-center">
                                        <el-input v-model="skuItem.count" style="width: 23%;" class="mar-l-10 " placeholder="输入发货数量" @blur="checkLogistics(skuItem.count)" size="medium"></el-input>
                                        <el-select v-model="skuItem.logiCompany" style="margin-left: 10px" placeholder="物流公司" size="medium" filterable clearable>
                                            <el-option v-for="item in logisticsCompany" :key="item.id" :label="item.companyName" :value="item.logiCompany"></el-option>
                                        </el-select>
                                        <el-input v-model="skuItem.logiCode" style="width: 24%; margin-left: 10px" placeholder="请输入物流单号" @blur="validateJyh(skuItem.logiCode)" size="medium"></el-input>
                                        <i class="el-icon-circle-close"  style="margin-left: 10px " @click="deleteDeliverSku(item, i,j)">
                                            </i>
                                        <div>
                                            <el-button type="text" @click="addSkuMag(item)" size="mini" style="margin-left: 10px">物流拆分</el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="deliver.show = false" size="small">取 消</el-button>
            <el-button type="primary" @click="handleDeliver" size="small" :v-loading="loading">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import { deliver } from '@/request/purchase'
    import { getLogiCompanyList } from '@/request/logi'
    import common from '@/views/purchaseManage/common/common'
    export default {
        name: 'shippingInformation',
        props: {
            deliver: {
                type: Object,
                default: function () {}
            }
        },
        mixins: [common],
        data () {
            return {
                loading: false,
                logisticsCompany: []
            }
        },
        components: {},
        mounted () {
            this.getLogisticsCompany()
        },
        methods: {
            getLogisticsCompany () {
                // TODO 分页
                getLogiCompanyList({
                    type: 2,
                    cooperateStatus: 1,
                    page: {
                        pageNum: 1,
                        pageSize: 100,
                        pagingSwitch: false
                    }
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.logisticsCompany = res.logiCompany
                    }
                })
            },
            // 复制到所有商品
            SyncNow () {
                console.log(this.deliver.ships)
                for (let i = 0; i < this.deliver.ships.length; i++) {
                    for (let j = 0; j < this.deliver.ships[i].logiList.length; j++) {
                        // debugger
                        var subData = this.deliver.ships[i].logiList[j]
                        subData.logiCode = this.deliver.ships[0].logiList[0].logiCode
                        subData.logiCompany = this.deliver.ships[0].logiList[0].logiCompany
                        subData.logisticsType = this.deliver.ships[0].logiList[0].logisticsType
                    }
                }
            },
            // 限制输入格式
            checkLogistics (data) {
                if (data == '') {
                    this.$alert('输入不可为空')
                }
            },
            validateJyh (glhm) {
                var reg = /^[A-Za-z0-9]{1,30}$/
                if (!reg.test(glhm)) {
                    this.$alert('请输入字母或数字组成的物流单号,不能有空格')
                    // this.form.glhm = '';
                }
            },
            // 新增一条物流单号记录
            addSkuMag (skuItem) {
                skuItem.logiList.push({
                    logisticsType: 'DOMESTIC',
                    logiCompany: '',
                    logiCode: '',
                    count: ''
                })
            },
            // 删除一条Sku发货信息
            deleteDeliverSku (skuItem, i, j) {
                skuItem.logiList.splice(j, 1)
                if (skuItem.logiList == '') {
                    this.deliver.ships.splice(i, 1)
                }
            },
            // 发货
            handleDeliver () {
                this.loading = true
                let params = {
                    delivers: this.deliver.ships
                }
                deliver(this.filterData(params)).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.deliver.show = false
                        this.$message.success('发货成功！')
                        this.$emit('refresh-list')
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
