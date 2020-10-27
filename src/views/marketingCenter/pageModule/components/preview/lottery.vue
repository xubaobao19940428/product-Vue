<template>
    <div>
        <lottery :info="item.info"
                 isEdit="true"
                 :imgHeadUrl="imgHeadUrl"
                 :prop="prop"
                 :moduleId="moduleId"
                 :luckPrizeList="allPrizeList"></lottery>
    </div>
</template>

<script>
import { getLuckDrawTemplate } from '@/request/luckdraw'
export default {
    props: {
        data: [Object, Array],
        lang: String,
        moduleId: [String, Number]
    },
    data () {
        return {
            item: {
                info: {
                    prizeList: []
                }
            },
            prop: {
                'luckPrizeName': 'prizeName',
                'luckPrizeImg': 'image'
            },
            imgHeadUrl: process.env.VUE_APP_FILE_URL
        }
    },
    computed: {
        allPrizeList () {
            return this.$store.state.pageEdit.allPrizeData[this.data.moduleId]
        }
    },
    watch: {
        data: {
            handler (val, oldVal) {
                this.initData(JSON.parse(JSON.stringify(val)))
            },
            deep: true
        }
    },
    created () {
        this.initData(JSON.parse(JSON.stringify(this.data)))
    },
    methods: {
        initData (val) {
            console.log(val)
            if (!val.info.isChange) {
                // 测试数据
                Object.assign(this.item, val)
            } else {
                // 获取奖品数据
                getLuckDrawTemplate({luckDrawId: val.info.luckDrawId}).then(res => {
                    if (res.ret.errcode === 1) {
                        for (let i = 0; i < res.luckDrawInfo.luckPrizeInfo.length; i++) {
                            let langName = res.luckDrawInfo.luckPrizeInfo[i].luckPrizeName.find((val) => {
                                return val.languageCode == 'cn' || val.languageCode == 'en'
                            })

                            Object.assign(res.luckDrawInfo.luckPrizeInfo[i], {
                                prizeName: langName ? langName.name : {languageCode: 'cn', name: ''}
                            })
                        }
                        val.info.prizeList = res.luckDrawInfo.luckPrizeInfo.filter(item => item.luckPrizeType !== 4)
                        this.$store.dispatch('updateAllPrizeList', {
                            key: val.moduleId,
                            data: val.info.prizeList
                        })
                    }
                })

                Object.assign(this.item, val)
            }
        }
    }
}
</script>
