<template>
    <div>
        <fingo-coupon :info="item.info" :lang="lang" @get="handleGet" :unit="pageData.unit" :pageBg="pageData.background"></fingo-coupon>
    </div>
</template>

<script>
import { listUserCouponOnPageBoss } from '@/request/coupon'
export default {
    props: {
        data: [Object, Array],
        lang: String
    },
    data () {
        return {
            item: {
                info: {}
            }
        }
    },
    watch: {
        data: {
            handler (val) {
                this.initData(JSON.parse(JSON.stringify(val)))
            },
            deep: true
        }
    },
    computed: {
        pageData (data) {
            return this.$store.state.pageEdit.pageData
        },
        allCouponData () {
            return this.$store.state.pageEdit.allCouponData
        }
    },
    created () {
        this.initData(JSON.parse(JSON.stringify(this.data)))
    },
    methods: {
        handleGet () {
            return 
        },
        initData (val) {
            // 需要考虑没有优惠券的时候，展示的假数据
            if (!val.info.isChange) {
                val.info.couponList = this.allCouponData[val.moduleId]
                if (!val.info.couponList || !val.info.couponList.length) {
                    this.$store.dispatch('updateAllCouponData', {
                        key: val.moduleId,
                        data: []
                    }) // 默认自行清空的时候，需要把这个也清空
                    val.info.couponList = new Array(2).fill({
                        text2List: [{
                            languageCode: 'cn',
                            name: '文案二'
                        }],
                        text3List: [{
                            languageCode: 'cn',
                            name: '文案三'
                        }]
                    })
                }
                Object.assign(this.item, val)
            } else {
                let allCouponIds = val.info.couponList.map(item => item.encryptionCouponId)
                // 接口请求
                listUserCouponOnPageBoss({couponId: allCouponIds}).then(res => {
                    if (res.ret.errcode === 1) {
                        let temp = []
                        temp = res.eachCouponboss
                        // 需要保留原来的文案设置和查到的优惠券信息
                        val.info.couponList = val.info.couponList.map(item => {
                            let resItem = temp.find(a => a.parsedCouponId == item.encryptionCouponId)
                            return Object.assign(item, resItem)
                        })
                        this.$store.dispatch('updateAllCouponData', {
                            key: val.moduleId,
                            data: val.info.couponList
                        }) // 这里是为了用于配置页面的修改

                        Object.assign(this.item, val)
                    }
                })
                
            }
        }
    }
}
</script>