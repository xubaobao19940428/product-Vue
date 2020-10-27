<template>
    <div>
        <el-checkbox disabled v-model="includeTabChecked">包含以下商品</el-checkbox>
        <div  v-for="(item, i) in promotionProductType" :key="i" class="flex align-center mar-l-20">
            <template v-if="item.type == '0'">
                <el-checkbox :disabled="hasEnd" v-model="item.checked" @change="switchSelect">{{ item.name }}</el-checkbox>
                <el-input :disabled="hasEnd" v-show="item.checked" v-model="item.value" type="text" class="mar-l-10" placeholder="填写商品SPUID，多个商品时请用英文逗号,隔开"></el-input>
            </template>
            <template v-else-if="item.type == '1'">
                <el-checkbox :disabled="hasEnd" v-model="item.checked" @change="switchSelect">{{ item.name }}</el-checkbox>
                <div class="category-wrapper" v-show="item.checked">
                    <div>
                        <el-tag v-for="(tag, i) in bindCateInfo"
                                :key="tag.cateId"
                                @close="removeCategory(tag, i)"
                                closable>{{tag.cateName}}
                        </el-tag>
                    </div>
                    <el-cascader style="width: 45%"
                                 filterable
                                 clearable
                                 remote
                                 @visible-change="clearSelectCategory"
                                 @change="addCategory"
                                 :props="{label: 'cateName',multiple: true, checkStrictly: false, children: 'levelValue', value: 'prop', lazy: true, lazyLoad: getSubCategory}"
                                 placeholder="请选择商品后台分组"
                                 :options="categoryOptions"
                                 v-model="selectedOptions"
                                 class="normalOperatorBox"
                                 size="medium">
                    </el-cascader>
                </div>
            </template>
        </div>
    </div>
</template>
<script>
    import productCommon from '../../../product/common/common'
    export default {
        props: {
            propProductId: {
                type: Array,
                default: () => { return [] }
            },
            propCateId: {
                type: Array,
                default: () => { return [] }
            },
            hasEnd: Boolean
        },
        mixins: [productCommon],
        data () {
            return {
                param: {},
                selectedOptions: [],
                categoryOptions: [],
                includeTabChecked: false,
                cateType: 2,
                bindCateInfo: [],
                promotionProductType: {
                    productId: {
                        checked: false,
                        value: '',
                        name: '按商品名单',
                        type: '0',
                        key: 'productId'
                    },
                    cateId: {
                        checked: false,
                        value: '',
                        name: '按商品类目',
                        type: '1',
                        key: 'cateId'
                    }
                }
            }
        },
        watch: {
            propProductId () {
                this.init()
            },
            propCateId () {
                this.init()
            }
        },
        created () {
            this.init()
            this.fetchCategory({
                level: 1,
                cateType: this.cateType,
                resolve: (data) => {
                    this.categoryOptions = data
                }
            })
        },
        methods: {
            addCategory () {
                if (!this.selectedOptions) {
                    return
                }
                for (let i = 0; i < this.selectedOptions.length; i++) {
                    let data = JSON.parse(this.selectedOptions[i][2])
                    let item = this.bindCateInfo.find((val) => {
                        return val.cateId == data.cateId
                    })
                    if (!item) {
                        this.bindCateInfo.push(data)
                    }
                }
            },
            removeCategory (tag, i) {
                this.bindCateInfo.splice(i, 1)
            },
            clearSelectCategory (show) {
                if (!show) {
                    this.selectedOptions = []
                }
            },
            init () {
                if (this.propProductId.length > 0) {
                    this.promotionProductType.productId.value = this.propProductId.join(',')
                    this.promotionProductType.productId.checked = true
                }
                this.bindCateInfo = []
                if (this.propCateId.length > 0) {
                    for (let i = 0; i < this.propCateId.length; i++) {
                        this.bindCateInfo.push({
                            cateId: this.propCateId[i].id,
                            cateName: this.propCateId[i].name
                        })
                    }
                }
                if (this.bindCateInfo.length > 0) {
                    this.promotionProductType.cateId.checked = true
                }
                this.switchSelect()
            },
            switchSelect () {
                let flg = false
                for (let key in this.promotionProductType) {
                    if (this.promotionProductType[key].checked) {
                        flg = true
                        break
                    }
                }
                this.includeTabChecked = flg
            },
            splitData (data) {
                let item = data.split(',')
                for (let i = 0; i < item.length; i++) {
                    item[i] = item[i].trim()
                }
                return data ? item : []
            },
            getData () {
                let data = {
                    productId: [],
                    cateId: []
                }
                let self = this
                if (self.includeTabChecked) {
                    let cateId = []
                    for (let i = 0; i < self.bindCateInfo.length; i++) {
                        cateId.push(self.bindCateInfo[i].cateId)
                    }
                    self.promotionProductType.cateId.value = cateId.join(',')
                    for (let key in this.promotionProductType) {
                        if (self.promotionProductType[key].checked && self.promotionProductType[key].value) {
                            data[key] = self.splitData(self.promotionProductType[key].value)
                        }
                    }
                }
                return data
            }
        }
    }
</script>
<style lang="scss" scoped>
    .category-wrapper{
        display: flex;
        width: 100%;
        flex-direction: column;
        margin: 10px 0 0 10px;
    }
</style>
