<template>
    <div>
        <el-checkbox disabled v-model="includeTabChecked">包含以下商品</el-checkbox>
        <div  v-for="(item, i) in promotionProductType" :key="i" class="flex align-center mar-l-20">
            <el-checkbox :disabled="hasEnd" v-model="item.checked" @change="switchSelect">{{ item.name }}</el-checkbox>
            <el-input :disabled="hasEnd" v-show="item.checked" v-model="item.value" @change="setData" type="text" class="mar-l-10" placeholder="填写商品SPUID，多个商品时请用英文逗号,隔开"></el-input>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            promotionProductInfo: {
                type: Array,
                default: () => { return [] }
            },
            hasEnd: Boolean
        },
        data () {
            return {
                param: {},
                includeTabChecked: false,
                promotionProductType: [{
                    checked: false,
                    value: '',
                    name: '按商品',
                    type: '0'
                }]
            }
        },
        watch: {
            promotionProductInfo: {
                handler (val) {
                    console.log(val)
                    this.init()
                },
                deep: true
            }
        },
        created () {
            this.init()
        },
        methods: {
            init () {
                for (let i = 0; i < this.promotionProductInfo.length; i++) {
                    let data = this.promotionProductInfo[i]
                    if (!data.promotionProductType) {
                        data.promotionProductType = '0'
                    }
                    let itemI = this.promotionProductType.findIndex((val) => {
                        return val.type == data.promotionProductType
                    })
                    if (itemI != -1) {
                        this.promotionProductType[itemI].value = data.bindsId.join(',')
                        this.promotionProductType[itemI].checked = true
                        this.includeTabChecked = true
                    }
                }
            },
            switchSelect () {
                let item = this.promotionProductType.find((val) => {
                    return val.checked
                })
                this.includeTabChecked = item ? true : false
            },
            setData () {
                this.$emit('setData')
            },
            splitData (data) {
                let item = data.split(',')
                for (let i = 0; i < item.length; i++) {
                    item[i] = item[i].trim()
                }
                return data ? item : []
            },
            getData () {
                let data = []
                let self = this
                if (self.includeTabChecked) {
                    for (let i = 0; i < self.promotionProductType.length; i++) {
                        if (self.promotionProductType[i].checked && self.promotionProductType[i].value) {
                            data.push({
                                promotionProductType: self.promotionProductType[i].type,
                                bindsId: self.splitData(self.promotionProductType[i].value)
                            })
                        }
                    }
                }
                return data
            }
        }
    }
</script>
