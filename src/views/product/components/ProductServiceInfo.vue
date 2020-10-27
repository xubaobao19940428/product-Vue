<template>
    <div class="product-media-wrapper">
       <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane v-for="(item, index) in saleCountryList" :key="index" :label="item.nameLocal" :name="item.nameLocal">
                <service-info-item :ref="'serviceInfoItem' + item.shortCode" :type="type" :shortCode="item.shortCode" :serviceInfoItemForm="allServiceInfoItemForm[item.shortCode]"></service-info-item>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import ServiceInfoItem from './ServiceInfoItem'

    export default {
        // 添加商品限购
        name: 'AddPurchaseLimit',
        props: {
            type: {
                type: String,
                default: 'add'
            },
            allServiceInfoItemForm: {
                type: Object,
                default: () => {}
            }
        },
        data() {
            return {
                // activeName: '马来',
                allServiceInfoData: {},
                dataValid: false,
                // serviceInfoItemForm: {
                //     afterSalePledge: null,
                //     arrivalPledge: null,
                //     freightId: null
                // }
            }
        },
        computed: {
            countryList() {
                return this.$store.state.dict.countryList
            },
            saleCountryList() {
                return this.$store.state.dict.saleCountryList
            },
            activeName: {
                get: function (){
                    let activeName = ''
                    if(this.saleCountryList.length > 0) {
                        activeName = this.saleCountryList[0].nameLocal
                    }
                    return activeName
                },
                set: function () {
                }
            }
        },
        components: {
            ServiceInfoItem
        },
        methods: {
            handleClick() {},
            getAllServiceInfoData() {
                let allServiceInfo = this.$refs
                _.forEach(allServiceInfo, (item, key)=> {
                    // 触发表单校验
                    if (item.length > 0) {
                        item[0].getServiceInfoItemData()
                        this.allServiceInfoData[key.substr(15)] = item[0].serviceInfoItemForm
                    }
                })

                // 校验服务承诺是否为空
                _.forEach(this.allServiceInfoData, (value, key) => {
                    let afterSaleDataValid = false
                    let freightDataValid = false
                    if (this.type != 'check' && (value.afterSalePledge === null || value.afterSalePledge === '')) {
                        let country = _.find(this.saleCountryList, {'shortCode': key})
                        this.$message.error(`${country.nameLocal}售后政策不能为空`)
                        afterSaleDataValid = false
                    } else {
                        afterSaleDataValid = true
                    }

                    if (this.type != 'check' && value.freightType === 2 && (value.freightId === null || value.freightId === '')) {
                        let country = _.find(this.saleCountryList, {'shortCode': key})
                        this.$message.error(`${country.nameLocal}运费模板不能为空`)
                        freightDataValid = false
                    } else {
                        freightDataValid = true
                    }

                    if (afterSaleDataValid && freightDataValid) {
                        this.dataValid = true
                    }
                })
            },
        }
    }
</script>

<style lang="scss" scoped>
    .product-media-wrapper {
        padding: 10px 60px;
    }
</style>
