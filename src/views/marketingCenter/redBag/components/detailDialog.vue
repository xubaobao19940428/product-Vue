<template>
    <el-dialog title="助力详情"
        :visible="detailDialog.show"
        width="650px"
        @close="handleClose"
    >
        <el-table :data="detailDialog.detailList" style="padding-bottom: 16px;">
            <el-table-column label="用户ID" prop="userId"></el-table-column>
            <el-table-column label="用户昵称" prop="nickName"></el-table-column>
            <el-table-column label="助力金额" prop="amount"></el-table-column>
            <el-table-column label="助力时间" min-width="140px">
                <template slot-scope="scope">
                    {{ scope.row.createTime | secondTimeFormat }}
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
export default {
    props: {
        detailDialog: {
            type: Object,
            defualt: {
                show: true,
                detailList: []
            }
        }
    },
    methods: {
        handleClose () {
            this.$emit('close')
        }
    }
}
</script>