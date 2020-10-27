<template>
    <div>
        <product-list :info="item.info" :lang="lang" :prop="prop" :unit="pageData.unit" :imgHeadUrl="imgHeadUrl"></product-list>
    </div>
</template>
<script>
    import { getGroupSpuBoss } from '@/request/marketing'
    const TEST_OBJECT = {
        productId: '4323434',
        productName: '商品标题商品标题商品商品标题商品标题商品商品标题商品标题商品商品标题商品标题商品商品标题商品标题商品商品标题商品标题商品',
        activePrice: 323,
        price: 435,
        priceVip: 430
    }

    export default {
        props: {
            data: [Object, Array],
            lang: String
        },
        data () {
            return {
                item: {
                    info: {}
                },
                imgHeadUrl: process.env.VUE_APP_FILE_URL,
                prop: {
                    productId: 'spuId',
                    productName: 'groupSpuTitleCn',
                    priceVip: 'groupSpuPriceVip',
                    price: 'groupSpuPrice',
                    productCover: 'groupSpuCover',
                    activePrice: 'groupSpuActivityPrice'
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: false
                }
            }
        },
        computed: {
            pageData () {
                return this.$store.state.pageEdit.pageData
            },
            productList () {
                return this.$store.state.pageEdit.productList
            }
        },
        watch: {
            data: {
                handler (val, oldVal) {
                    console.log(val)
                    if (val.info.isChange) {
                        // 只有弹框确定和自动更新修改的时候才会触发重新请求
                        this.initData(JSON.parse(JSON.stringify(val)))
                    } else {
                        this.initTestData(JSON.parse(JSON.stringify(val)))
                    }
                },
                deep: true
            }
        },
        created () {
            if (this.data.info.isChange) {
                // 只有弹框确定和自动更新修改的时候才会触发重新请求
                this.initData(JSON.parse(JSON.stringify(this.data)))
            } else {
                this.initTestData(JSON.parse(JSON.stringify(this.data)))
            }
        },
        methods: {
            initTestData (data) {
                data.info.productList = this.productList[data.moduleId] ? this.productList[data.moduleId] : []
                if (!data.info.selectedId || !data.info.selectedId.length) {
                    // 根据设置一行几个来设置默认的值
                    let temp = []
                    if (data.info.colNum == 1) {
                        temp = new Array(3).fill(TEST_OBJECT)
                    } else {
                        temp = new Array(4).fill(TEST_OBJECT)
                    }

                    data.info.isTest = true
                    this.setLimit(data, temp)
                } else {
                    this.setLimit(data, data.info.productList)
                }
                Object.assign(this.item, data)
            },
            setLimit (data, temp) {
                if (data.info.isShowTickerImg && data.info.stickerImgList && data.info.stickerImgList.length) {
                    // 清空之前的贴图内容，因为在修改的时候，如果是减少了但是原来的没有办法清空
                    temp = temp.map(a => {
                        a.tickerImg = ''
                        return a
                    })
                    data.info.stickerImgList.forEach(item => {
                        temp.forEach(tempItem => {
                            if (item.selectIds.includes(tempItem.spuId)) {
                                tempItem.tickerImg = item.tickerImg // 对象形式
                            }
                        })
                    })
                }
                if (data.info.isShowLimit && data.info.colNum != 'no') {
                    let num = (data.info.colNum || 2) * (data.info.limitLine || 1)
                    if (temp.length > num) {
                        data.info.productList = temp.slice(0, num)
                        data.info.allProductList = temp
                    } else {
                        data.info.productList = temp
                    }
                } else {
                    data.info.productList = temp
                }
                Object.assign(this.item, data)
            },
            initData (data) {
                // 根据id获取所有的商品
                switch (data.info.selectedType) {
                    case 'groupActivityData':
                        this.getGroupActivityData(data)
                        break
                    case 'groupActivityProductData':
                        this.getGroupActivityData(data)
                        break
                }

                console.log(this.item)
            },
            getGroupActivityData (data) {
                let param = {
                    productStatus: data.info.productStatus,
                    languageCode: this.lang,
                    groupItemSerialId: data.info.selectedType == 'groupActivityProductData' ? data.info.selectedId : null,
                    subjectSerialId: data.info.selectedType == 'groupActivityData' ? data.info.selectedId : null,
                    countryCode: this.pageData.countryCode
                }
                getGroupSpuBoss(this.filterData(param)).then((res) => {
                    if (res.ret.errcode === 1) {
                        let temp = res.groupProductDetailUnit
                        this.setLimit(data, temp)
                        data.info.isTest = false
                        this.$store.dispatch('updateProductList', {
                            key: this.data.moduleId,
                            data: res.groupProductDetailUnit
                        })

                        Object.assign(this.item, {
                            key: this.data.moduleId,
                            data: data
                        })
                    }
                })
            }
        }
    }
</script>
