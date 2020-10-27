<template>
    <div class="swipe-preview-box">
        <template v-if="productList[data.moduleId] && productList[data.moduleId].length > 0" >
            <article-product :imgHeadUrl="imgHeadUrl" :unit="unit" :data="productList[data.moduleId]"></article-product>
        </template>
        <div v-else class="default-box">
            <img src="@/assets/add.png">
            <span>添加商品</span>
        </div>
    </div>
</template>
<script>
    import { getProductSpu } from '@/request/product'
    import { mapState } from 'vuex'
    export default {
        props: {
            data: [Array, Object],
            index: [String, Number]
        },
        computed: {
            componentVal () {
                let Obj = JSON.parse(this.data.componentValue)
                return Obj
            },
            ...mapState({
                pageData: state => state.contentManage.pageData,
                productList: state => state.contentManage.productList
            }),
            unit () {
                let countryCode = this.$route.query.countryCode
                return this.getCurrencyUnit(countryCode, 'currencyUnit')
            }
        },
        data () {
            return {
                imgHeadUrl: process.env.VUE_APP_FILE_URL,
                prop: {
                    productId: 'productId',
                    productName: 'title',
                    priceVip: 'priceVip',
                    productCover: 'cover'
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                },
                lang: 'cn'
            }
        },
        watch: {
            data: {
                handler (val, oldVal) {
                    if (this.componentVal.isChange) {
                        // 只有弹框确定和自动更新修改的时候才会触发重新请求
                        this.getProduct()
                    }
                },
                deep: true
            }
        },
        mounted () {
            this.getProduct()
        },
        methods: {
            getProduct () {
                if (this.componentVal.data.length <= 0) {
                    this.$store.dispatch('updateArticleProductList', {
                        key: this.data.moduleId,
                        data: []
                    })
                    let oldVal = JSON.parse(JSON.stringify(this.componentVal))
                    oldVal.isChange = false
                    this.$store.dispatch('updateArticleComponents', {
                        type: 'edit',
                        index: this.index,
                        componentValue: JSON.stringify(oldVal)
                    })
                    return
                }
                let param = {
                    productId: this.componentVal.data,
                    page: this.page,
                    countryCode: this.$route.query.countryCode,
                    languageCode: this.lang
                }
                getProductSpu(this.filterData(param)).then(res => {
                    if (res.ret.errcode === 1) {
                        let temp = res.spu
                        this.$store.dispatch('updateArticleProductList', {
                            key: this.data.moduleId,
                            data: temp
                        })
                        let oldVal = JSON.parse(JSON.stringify(this.componentVal))
                        oldVal.isChange = false
                        this.$store.dispatch('updateArticleComponents', {
                            type: 'edit',
                            index: this.index,
                            componentValue: JSON.stringify(oldVal)
                        })
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .swipe-preview-box{
        width: 100%;
        height: 70px;
        .default-box{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            background-color: #F5F6F7;
            img{
                width: 30px;
                display: flex;
                margin-bottom: 5px;
            }
        }
    }
</style>
