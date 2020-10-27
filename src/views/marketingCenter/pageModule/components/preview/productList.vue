<template>
    <div>
        <product-list :info="item.info" :lang="lang" :prop="prop" :unit="pageData.unit" :imgHeadUrl="imgHeadUrl"></product-list>
    </div>
</template>
<script>
    const TEST_OBJECT = {
        productId: '4323434',
        productName: '商品标题商品标题商品商品标题商品标题商品商品标题商品标题商品商品标题商品标题商品商品标题商品标题商品商品标题商品标题商品',
        activePrice: 323,
        price: 435,
        priceVip: 430
    }
    import { getActiveByIdOrLabelId, getActiveProductByProductId } from '@/request/marketing'
    import { getProductSpu } from '@/request/product'
    // import moment from 'moment'

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
                    productId: 'productId',
                    productName: 'productName',
                    priceVip: 'priceVip',
                    price: 'price',
                    productCover: 'productCover',
                    activePrice: 'activePrice',
                    productCorner: 'productCorner',
                    promotionDesc: 'promotionDesc',
                    saleCount: 'saleCount',
                    cartCount: 'cartCount',
                    productType: 'productType'
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
                data.info.productList = this.productList[data.moduleId]
                if (!data.info.selectedId || !data.info.selectedId.length) {
                    // 清空所有选中商品的时候，恢复默认状态
                    this.$store.dispatch('updateProductList', {
                        key: this.data.moduleId,
                        data: []
                    })
                    // 根据设置一行几个来设置默认的值
                    let temp = []
                    if (data.info.colNum == 1) {
                        temp = new Array(3).fill(TEST_OBJECT)
                    } else if (data.info.colNum == 3) {
                        temp = new Array(6).fill(TEST_OBJECT)
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
            checkDateToTime (dateTime) {
                if (dateTime) {
                    dateTime = dateTime.replace(/-/g, '/')
                    let time = ''
                    time = Date.parse(moment(parseInt(dateTime))) || Date.parse(moment(parseInt(dateTime)))
                    return time
                }
            },
            setLimit (data, temp) {
                let now = moment().format('YYYY-MM-DD')
                if (data.info.isShowTickerImg && data.info.stickerImgList && data.info.stickerImgList.length) {
                    // 清空之前的贴图内容，因为在修改的时候，如果是减少了但是原来的没有办法清空
                    temp = temp.map(a => {
                        a.tickerImg = ''
                        return a
                    })
                    data.info.stickerImgList.forEach(item => {
                        temp.forEach(tempItem => {
                            if (item.selectIds.includes(tempItem.productId)) {
                                tempItem.tickerImg = item.tickerImg // 对象形式
                            }
                        })
                    })
                }
                if (data.info.isShowGroup && temp.length && data.info.timePoint && data.info.timePoint.length) {
                    // 时间锚点和商品结合起来
                    data.info.timePoint.forEach(timeItem => {
                        timeItem.productList = []
                        timeItem.endType = 1
                        let time = moment(timeItem.time).format('HH:mm:ss')
                        // if (this.curSelectCountry == 'TH') {
                        //     // 泰国的时区和我们的不同
                        //     time = moment(timeItem.time).utcOffset(7).format('HH:mm:ss')
                        // }

                        temp.forEach(item => {
                            let startTime = this.checkDateToTime(item.startTime)

                            if (data.info.timePointType !== 'date-time') {
                                let today = now + ' ' + time
                                if (moment(today).isSame(startTime)) {
                                    timeItem.productList.push(item)
                                    timeItem.endTime = item.endTime
                                    timeItem.startTime = item.startTime
                                }
                            } else {
                                // if (this.curSelectCountry == 'TH') {
                                //     // 泰国的时区，北京时间须转为当地的时间
                                //     timeItem.time = moment(timeItem.time).utcOffset(7).format('YYYY-MM-DD HH:mm:ss')
                                // }
                                if (moment(timeItem.time).isSame(startTime)) {
                                    // 如果时间锚点和开始时间一致，则他们处于同一个商品列表,改项的结束时间则取第一个商品的结束时间
                                    timeItem.productList.push(item)
                                    timeItem.endTime = item.endTime
                                    timeItem.startTime = item.startTime
                                }
                            }
                        })

                        if (data.info.isShowLimit && data.info.colNum != 'no') {
                            let num = (data.info.colNum || 2) * (data.info.limitLine || 1)
                            if (timeItem.productList.length > num) {
                                timeItem.productList = timeItem.productList.slice(0, num)
                                timeItem.allProductList = timeItem.productList
                            }
                        }
                    })
                } else{
                    // 还需要将贴图和商品结合起来
                    if (data.info.isShowLimit && data.info.colNum != 'no') {
                        let num = (data.info.colNum || 2)* (data.info.limitLine || 1)
                        if (temp.length > num) {
                            data.info.productList = temp.slice(0, num)
                            data.info.allProductList = temp
                        } else {
                            data.info.productList = temp
                        }
                    } else {
                        data.info.productList = temp
                    }
                }
                Object.assign(this.item, data)
            },
            initData (data) {
                // 根据id获取所有的商品
                switch (data.info.selectedType) {
                    case 'activityData':
                        this.getProductByActivityOrGroup(1, data)
                        break;
                    case 'groupData':
                        this.getProductByActivityOrGroup(2, data)
                        break;
                    case 'activityProductData':
                        this.getActivityProduct(data)
                        break;
                    case 'noActivityProductData':
                        this.getNoActivityProduct(data)
                        break;
                }

                console.log(this.item)
            },
            getProductByActivityOrGroup (type, data) {
                let param = {
                    type,
                    productStatus: data.info.productStatus,
                    countryCode: this.pageData.countryCode,
                    languageCode: this.lang,
                    sortType: data.info.sortColumn || 4
                }
                // sortColumn 兼容以前数据，设置为4 - 活动排序
                if (type == 1) {
                    // 表示根据活动ID
                    param.activeId = data.info.selectedId.join(',')
                } else {
                    param.groupLabelId = data.info.selectedId
                }
                getActiveByIdOrLabelId(this.filterData(param)).then(res => {
                    if (res.ret.errcode === 1) {
                        let temp = []
                        if (res.label.length) {
                            // 不考虑按分组标签分组的情况
                            res.label.forEach(item => {
                                temp = temp.concat(item.marketingProduct)
                            })
                        }
                        this.setLimit(data, temp)
                        data.info.isTest = false

                        Object.assign(this.item, data)
                        this.$store.dispatch('updateProductList', {
                            key: this.data.moduleId,
                            data: temp
                        })
                    }
                })
            },
            getActivityProduct (data) {
                let param = {
                    productStatus: data.info.productStatus,
                    languageCode: this.lang,
                    productId: data.info.selectedId,
                    countryCode: this.pageData.countryCode,
                    sortType: data.info.sortColumn || 4
                }
                // sortColumn 兼容以前数据，设置为4 - 活动排序
                getActiveProductByProductId(this.filterData(param)).then(res => {
                    if (res.ret.errcode === 1) {
                        let temp = res.marketingProductInfo
                        this.setLimit(data, temp)
                        data.info.isTest = false
                        this.$store.dispatch('updateProductList', {
                            key: this.data.moduleId,
                            data: res.marketingProductInfo
                        })

                        Object.assign(this.item, {
                            key: this.data.moduleId,
                            data: data
                        })
                    }
                })
            },
            getNoActivityProduct (data) {
                let param = {
                    productId: data.info.selectedId,
                    page: this.page,
                    countryCode: this.pageData.countryCode,
                    languageCode: this.lang,
                    sortColumn: data.info.sortColumn || 2
                }
                getProductSpu(this.filterData(param)).then(res => {
                    if (res.ret.errcode === 1) {
                        Object.assign(this.prop, {
                            productCover: 'cover',
                            productName: 'title',
                            saleCount: 'salesCount'
                        })
                        let temp = res.spu
                        data.info.isTest = false
                        this.setLimit(data, temp)
                        Object.assign(this.item, data)

                        this.$store.dispatch('updateProductList', {
                            key: this.data.moduleId,
                            data: res.spu
                        })
                    }
                })
            }
        }
    }
</script>
