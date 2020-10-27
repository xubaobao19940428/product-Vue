<template>
    <el-dialog title="取消采购数量" :visible.sync="editDialog.cancelnum.show" width="700px" @close="editDialog.cancelnum.show = false" :close-on-click-modal="false">
        <el-form label-position="right" label-width="130px" :model="editDialog.param">
            <el-form-item label="供应商：" prop="supplierName">
                <span>{{ editDialog.param.supplierName }}</span>
            </el-form-item>
            <el-form-item label="skuCode：" prop="skuCode">
                <span>{{ editDialog.param.skuCode }}</span>
            </el-form-item>
            <el-form-item label="系统数量：" prop="purchaseCount">
                <span>{{ editDialog.param.systemCount }}</span>
            </el-form-item>
            <el-form-item label="实际采购数量：" prop="purchaseCount">
                <span>{{ editDialog.param.purchaseCount }}</span>
            </el-form-item>
            <el-form-item label="入库数量：" prop="incomeNum">
                <span>{{ editDialog.param.incomeNum }}</span>
            </el-form-item>
            <el-form-item label="已取消数量：" prop="cancelCount">
                <span>{{ editDialog.param.cancelCount }}</span>
            </el-form-item>
            <el-form-item label="发货数量：" >
                <span>{{ editDialog.param.shipCount }}</span>
            </el-form-item>
            <el-form-item label="取消数量：" prop="count">
                <el-input placeholder="请输入取消数量" min="1" :max="editDialog.param.cancelCount" v-model="editDialog.param.count" style="width: 200px">
                </el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <div slot="footer" class="dialog-footer">
                <el-button @click="getCancelclose" size="small">取 消</el-button>
                <el-button type="primary" @click="onConfirmCancelPurchaseNum" size="small">确 定</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
    import common from '@/views/purchaseManage/common/common'
    export default {
        name: 'cancelPurchaesNum',
        props: {
            editDialog: {
                type: Object,
                default: function() {}
            }
        },
        mixins: [common],
        data() {
            return {}
        },
        components: {},
        methods: {
            getCancelclose () {
                this.editDialog.cancelnum.show = false
                this.editDialog.param.count = ''
            },
            onConfirmCancelPurchaseNum () {
                console.log(this.editDialog.param)
                this.$emit('on-confirm', this.editDialog.param)
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
