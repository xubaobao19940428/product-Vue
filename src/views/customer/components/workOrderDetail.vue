<template>
    <el-dialog title="工单详情页"
               width="700px"
               :visible="showDialog"
               @close="closeDialog()">
        <common-detail :workOrderNo="workOrderNo" :collapseArray="collapseArray"></common-detail>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeDialog()">取 消</el-button>
            <el-button size="small" type="primary" @click="closeDialog()">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import commonDetail from './commonInfo'
    export default {
        props: {
            showDialog: {
                type: Boolean,
                default: false
            },
            collapseArray: Array,
            workOrderNo: String
        },
        data () {
            return {}
        },
        components: {
            commonDetail
        },
        methods: {
            closeDialog () {
                this.$emit('close')
            }
        }
    }
</script>
