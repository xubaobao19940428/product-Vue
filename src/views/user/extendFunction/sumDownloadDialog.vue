<template>
    <el-dialog
        class="sum-download-dialog"
        :visible="downloadDialog"
        @close="handleClose"
        :close-on-click-modal="false"
    >
        <el-form inline>
            <el-form-item label="选择时段：">
                <el-date-picker
                    v-model="timeList"
                    size="medium" type="daterange"
                    value-format="timestamp"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                    >
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="medium" @click="getList(1)">查询</el-button>
            </el-form-item>
            <el-button class="right" type="text" @click="handleDownload">下载</el-button>
        </el-form>
        
        <el-table :data="dataList" border v-loading="load">
            <el-table-column label="日期" align="center" prop="day"></el-table-column>
            <el-table-column label="用户ID" align="center" prop="operationId"></el-table-column>
            <el-table-column label="昵称" align="center" prop="nickName"></el-table-column>
            <el-table-column label="真实姓名" align="center" prop="realName"></el-table-column>
            <el-table-column label="审核量" align="center" prop="checkNum"></el-table-column>
        </el-table>

        <div class="pagination-box">
            <el-pagination
                @current-change="getList"
                @size-change="handleSizeChange"
                :current-page="searchParam.page.pageNum"
                :page-size="searchParam.page.pageSize"
                layout="sizes, total, prev, pager, next, jumper"
                :page-sizes="[5, 10, 15, 20]"
                :total="totals">
            </el-pagination>
        </div>
    </el-dialog>
</template>

<script>
import { auditFlowCheckList, downloadAuditFlowCheckList } from '@/request/polypay'
import moment from 'moment'
export default {
    props: {
        downloadDialog: Boolean
    },
    data () {
        return {
            searchParam: {
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                },
                startTime: null,
                endTime: null
            },
            timeList: [],
            totals: 0,
            load: false,
            dataList: []
        }
    },
    created () {
        let now = moment().valueOf()
        let nowStart = moment(new Date().toLocaleDateString())
        this.timeList = [nowStart, now]
        this.getList(1)
    },
    methods: {
        getList (page) {
            this.load = true
            this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
            this.timeList = this.timeList || []
            let resParam = this.filterData(Object.assign(this.searchParam, {
                startTime: !this.timeList[0] ? null : this.timeList[0] + '',
                endTime: !this.timeList[1] ? null : this.timeList[1] + ''
            }))

            auditFlowCheckList(resParam).then(res => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.checkInfo
                    this.totals = res.total
                }
                this.load = false
            }).catch(() => {
                this.load = false
            })
        },
        handleDownload () {
            this.timeList = this.timeList || []
            let resParam = this.filterData(Object.assign(this.searchParam, {
                startTime: !this.timeList[0] ? null : this.timeList[0] + '',
                endTime: !this.timeList[1] ? null : this.timeList[1] + ''
            }))
            downloadAuditFlowCheckList(resParam).then(res => {
                if (res.ret.errcode === 1) {
                    let a = document.createElement('a')
                    a.download = '文件'
                    a.href = res.url
                    a.click()
                }
            })
        },
        handleSizeChange (value) {
            Object.assign(this.searchParam.page, {
                pageSize: value,
                pageNum: 1
            })
            this.getList()
        },
        handleClose () {
            this.$emit('close')
        }
    }
}
</script>

<style lang="scss">
.el-dialog__body {
    padding: 10px 20px;
}
</style>