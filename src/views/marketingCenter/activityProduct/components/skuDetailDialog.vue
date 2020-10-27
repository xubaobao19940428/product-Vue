<template>
    <el-dialog title="活动商品" width="900px"
               append-to-body
               :visible="propShowDialog"
               @close="close">
        <sku-detail propType="look" :defaultSkuList="defaultSkuList"></sku-detail>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" type="primary" @click="close">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import skuDetail from './productSkuEdit'
    export default {
        props: {
            propShowDialog: Boolean,
            defaultSkuList: {
                type: Array,
                default: () => {
                    return []
                }
            }
        },
        data () {
            return {}
        },
        components: {
            skuDetail
        },
        methods: {
            close () {
                this.$emit('close')
            }
        }
    }
</script>
