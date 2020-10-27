<template>
    <div class="product-list-action">
        <div class="action-title">商品组</div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>商品排序(最多支持添加{{ maxProduct }}个商品)</span>
            </div>
            <ul class="add-wrapper-ul">
                <li v-for="(item, i) in productList[data.moduleId]" :key="item.productId + '_' + i" class="add-wrapper-li">
                    <div class="product-img-box">
                        <img :src="dealShowFileSrc(item.cover || item.productCover)"/>
                        <div class="delete-box" @click.stop="deleteProduct(item.productId)">
                            <i class="el-icon-delete"></i>
                        </div>
                    </div>
                </li>
            </ul>
        </el-card>
        <el-button class="add-box" @click="showAddDialog">
            <i class="el-icon-plus"></i>
        </el-button>
        <product-add-dialog v-if="showAddProduct"
                            :showAddProduct="showAddProduct"
                            @cancel="showAddProduct = false"
                            @confirm="confirmAddProduct"></product-add-dialog>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import productAddDialog from './components/productAddDialog'
    import Sortable from 'sortablejs'

    export default {
        props: {
            data: [Array, Object],
            curIndex: [Number, String]
        },
        data () {
            return {
                showAddProduct: false,
                maxProduct: 6
            }
        },
        computed: {
            ...mapState({
                pageData: state => state.contentManage.pageData,
                productList: state => state.contentManage.productList
            }),
            componentVal () {
                let obj = JSON.parse(this.data.componentValue)
                return obj.data
            }
        },
        components: {
            productAddDialog
        },
        mounted () {
            let ele = this.$el.querySelector('.add-wrapper-ul')
            this.sortable = Sortable.create(ele, {
                group: {
                    name: 'product',
                    pull: false,
                    put: true
                },
                filter: '.delete-box',
                animation: 100,
                sort: true,
                onEnd: (e) => {
                    let selectedId = JSON.parse(JSON.stringify(this.componentVal))
                    let tempList = selectedId.splice(e.oldIndex, 1)
                    selectedId.splice(e.newIndex, 0, ...tempList)
                    this.submitData(selectedId)
                }
            })
        },
        methods: {
            // 删除
            deleteProduct (proId) {
                let productIds = JSON.parse(JSON.stringify(this.pageData.productIds))
                let index = productIds.findIndex((id) => {
                    return id == proId
                })
                if (index != -1) {
                    productIds.splice(index, 1)
                    this.submitData(productIds)
                }
            },
            showAddDialog () {
                this.showAddProduct = true
            },
            submitData (productIds) {
                this.$store.dispatch('updateArticlePageData', {
                    productIds: productIds
                })
                let oldVal = JSON.parse(this.data.componentValue)
                oldVal.data = productIds
                oldVal.isChange = true
                this.$store.dispatch('updateArticleComponents', {
                    type: 'edit',
                    index: this.curIndex,
                    componentValue: JSON.stringify(oldVal)
                })
            },
            confirmAddProduct (data) {
                let productIds = JSON.parse(JSON.stringify(this.pageData.productIds))
                for (let i = 0; i < data.selectedId.length; i++) {
                    let item = productIds.find((id) => {
                        return id == data.selectedId[i]
                    })
                    if (!item) {
                        productIds.push(data.selectedId[i])
                    }
                }
                if (productIds.length > this.maxProduct) {
                    return this.$message.warning(`最多添加${this.maxProduct}个商品`)
                }
                this.showAddProduct = false
                this.submitData(productIds)
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "./common";
    .product-list-action{
        .add-wrapper-ul {
            display: flex;
            flex-wrap: wrap;
            li{
                margin: 4px 4px;
                background-color: #ffffff;
                padding: 12px 0;
                width: 22%;
                border-radius: 4px;
                position: relative;
                .delete-box{
                    position: absolute;
                    height: 30px;
                    left: 0;
                    bottom: 0;
                    right: 0;
                    cursor: pointer;
                    z-index: 9;
                    opacity: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgba(0, 0, 0, 0.5);
                    i {
                        font-size: 14px;
                        color: #fff;
                    }
                }
                .product-img-box {
                    width: 60px;
                    height: 60px;
                    overflow: hidden;
                    margin: 0 auto;
                    img {
                        width: 100%;
                    }
                }
                &:hover{
                    .delete-box{
                        opacity: 1;
                    }
                }
            }
        }
    }
</style>
