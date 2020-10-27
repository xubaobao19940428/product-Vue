<template>
    <el-dialog title="活动商品排序" width="700px"
               append-to-body
               :visible="propShowDialog"
               @close="close">
        <div class="product-sort-wrapper">
            <el-form ref="addDialog" label-position="right"
                     :rules="rules"
                     :model="param">
                <el-tabs>
                    <el-tab-pane v-for="(label, labelI) in param.productLabel"
                                 :key="label.groupLabelId + '_' + labelI"
                                 :label="label.groupLabelName">
                        <ul class="product-img-list" :id="'productLabel' + labelI">
                            <li v-for="(product, productI) in label.activeAllProductInfo" :key="product.productId + '_' + productI">
                                <div class="img-box">
                                    <img v-lazy="dealShowFileSrc(product.productCover)">
                                </div>
                                <div class="product-id">{{ product.productId }}</div>
                            </li>
                        </ul>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button size="small" :loading="loading" type="primary" @click="confirmAddItem">确 定</el-button>
            </span>
    </el-dialog>
</template>
<script>
    import { changeActiveAllProductSort } from '@/request/marketing.js'
    import Sortable from 'sortablejs'
    export default {
        props: {
            propShowDialog: Boolean,
            propParam: {
                type: Object,
                default: () => { return {} }
            }
        },
        data () {
            return {
                param: {
                    productLabel: [],
                    activeId: ''
                },
                rules: {},
                loading: false
            }
        },
        watch: {
            propShowDialog (val) {
                if (val) {
                    Object.assign(this.param, this.propParam)
                    this.setSort()
                }
            }
        },
        methods: {
            setSort () {
                this.$nextTick(() => {
                    for (let i = 0; i < this.param.productLabel.length; i++) {
                        let el = this.$el.querySelector('#productLabel' + i)
                        let index = i
                        this.sortable = Sortable.create(el, {
                            ghostClass: 'sortable-ghost',
                            onEnd: e => {
                                let tempIndex = this.param.productLabel[index].activeAllProductInfo.splice(e.oldIndex, 1)
                                this.param.productLabel[index].activeAllProductInfo.splice(e.newIndex, 0, ...tempIndex)
                            }
                        })
                    }
                })
            },
            confirmAddItem () {
                this.loading = true
                let activeAllProductInfo = []
                let index = 0
                for (let i = 0; i < this.param.productLabel.length; i++) {
                    for (let j = 0; j < this.param.productLabel[i].activeAllProductInfo.length; j++) {
                        index ++
                        this.param.productLabel[i].activeAllProductInfo[j].sort = index
                        activeAllProductInfo.push(this.param.productLabel[i].activeAllProductInfo[j])
                    }
                }
                changeActiveAllProductSort({
                    activeId: this.param.activeId,
                    activeAllProductInfo: activeAllProductInfo
                }).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.reset()
                        this.$emit('confirm')
                        this.$message.success('操作成功')
                    }
                }).catch(() => {
                    this.loading = false
                })
            },
            reset () {
                this.param = {
                    activeId: '',
                    productLabel: []
                }
            },
            close () {
                this.reset()
                this.$emit('close')
            }
        }
    }
</script>
<style lang="scss" scoped>
    .form-tips{
        color: #666;
        line-height: 20px;
        font-size: 14px;
        font-weight: 400;
    }
    .product-img-list{
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        li{
            margin: 0 10px 10px 0;
            border: 1px solid #eee;
            width: 80px;
            .img-box{
                width: 40px;
                height: 40px;
                overflow: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 0 auto;
                img{
                    max-width: 100%;
                    max-height: 100%;
                    display: flex;
                }
            }
            .product-id{
                box-sizing: border-box;
                padding: 5px;
                text-align: center;
            }
        }
    }
</style>
