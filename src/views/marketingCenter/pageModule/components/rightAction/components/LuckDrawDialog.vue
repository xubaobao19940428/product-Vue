<template>
    <el-dialog title="添加抽奖工具"
        :close-on-click-modal="false"
        :visible="showDrawDialog"
        @close="handleClose"
    >
        <el-table :data="dataList" v-loading="loading"
            row-key="luckDrawId"
            highlight-current-row
            @current-change="handleSimpleSelect"
            ref="luckDrawSelectTable"
        >
            <el-table-column label="抽奖名称" align="center" prop="luckDrawName" width="120px"></el-table-column>
            <el-table-column label="国家" align="center">
                <template slot-scope="scope">
                    {{ scope.row.countryCode | countryFilter }}
                </template>
            </el-table-column>
            <el-table-column label="奖品数量" width="100px" align="center">
                <template slot-scope="scope">
                    {{ scope.row.luckPrizeInfo.length - 1 }}
                </template>
            </el-table-column>
            <el-table-column label="时效" align="center" width="360px">
                <template slot-scope="scope">{{ scope.row.startTime | secondTimeFormat}} ~ {{ scope.row.endTime | secondTimeFormat}}</template>
            </el-table-column>
        </el-table>

        <span slot="footer">
            <el-button type="primary" @click="handleConfirm">确定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { listLuckDrawTemplate } from '@/request/luckdraw'
export default {
    props: {
        showDrawDialog: Boolean,
        countryCode: String,
        curLuckDrawId: ''
    },
    data () {
        return {
            dataList: [],
            luckDrawId: '', // 选中的奖品ID
            luckDrawPassword: '', // 抽奖密令
            luckDrawName: '',
            loading: false,
            selectItem: []
        }
    },
    created () {
        this.getList()
    },
    methods: {
        getList () {
            this.loading = true
            let resParam = {
                countryCode: this.countryCode,
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: false
                },
                filterEnded: true
            }
            listLuckDrawTemplate(resParam).then(res => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.luckDrawInfo
                    let item = res.luckDrawInfo.find(item => item.luckDrawId === this.curLuckDrawId)
                    this.$refs.luckDrawSelectTable.setCurrentRow(item)
                }
                this.loading = false
            }).catch(err => {
                console.error(err)
                this.loading = false
            })
        },
        handleSimpleSelect (val) {
            this.luckDrawId = val.luckDrawId
            this.luckDrawPassword = val.luckDrawPassword
            this.luckDrawName = val.luckDrawName
        },
        handleClose () {
            this.$emit('close')
        },
        handleConfirm () {
            if (!this.luckDrawId) {
                this.$message('请先选择抽奖工具')
                return
            }
            this.$emit('confirm', { luckDrawId: this.luckDrawId, luckDrawPassword: this.luckDrawPassword, luckDrawName: this.luckDrawName, isChange: true })
        }
    }
}
</script>