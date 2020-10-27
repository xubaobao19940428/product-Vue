<template>
    <div class="history-table-dialog">
        <el-dialog
            title="操作"
            :visible="dialog.show"
            @close="handleClose"
            width="900px"
        >
            <el-table :data="dataList" v-loading="load" border>
                <el-table-column label="版本编号" prop="serialId" align="center" fixed="left" min-width="100"></el-table-column>
                <el-table-column label="操作人" align="center" prop="operator"></el-table-column>
                <el-table-column label="创建时间" min-width="160" align="center">
                    <template slot-scope="scope">{{ scope.row.updateTime | secondTimeFormat }}</template>
                </el-table-column>
                <el-table-column label="生效时间" min-width="160" align="center">
                    <template slot-scope="scope">
                        <el-date-picker
                            v-show="scope.row.isEditTime"
                            v-model="scope.row.startTime"
                            type="datetime"
                            :clearable="false"
                            value-format="timestamp"
                        ></el-date-picker>
                        <span v-show="!scope.row.isEditTime" :class="[scope.row.isFeature ? 'red' : '']">{{ scope.row.startTime | secondTimeFormat }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="240" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="handleView(scope.row)" type="text" size="mini">预览</el-button>
                        <el-button @click="handleEdit(scope.row)" type="text" class="green" size="mini">编辑</el-button>
                        <!-- 生效中的不能删除 以及只有一条数据的时候不能删除 -->
                        <el-button
                            v-show="scope.row.status != 1"
                            type="text"
                            class="red"
                            size="mini"
                            :disabled="dataList.length <= 1"
                            @click="handleDel(scope.row)">删除</el-button>
                        <el-button type="text" plain @click="handleCopy(scope.row)" size="mini">复制新页面</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="发布" align="center" fixed="right" min-width="200">
                    <template slot-scope="scope">
                        <el-button type="success" v-if="scope.row.status == 2"
                            size="mini"
                            plain
                            @click="handleActive(scope.row)">立即生效</el-button>
                        <el-tag v-else>当前生效</el-tag>
                        <template v-if="scope.row.status == 2">
                            <el-button
                                v-if="scope.row.startTime && !scope.row.isEditTime"
                                @click="handleDelTime(scope.row)"
                                type="text" size="mini">删除定时</el-button>
                            <el-button
                                v-else
                                @click="handleOpt(scope.row, scope.$index)"
                                type="text"
                                size="mini">{{ scope.row.isEditTime ? '保存定时' : '定时生效' }}</el-button>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-box">
                <el-pagination
                    @current-change="getList"
                    @size-change="handleSizeChange"
                    :current-page="page.pageNum"
                    :page-size="page.pageSize"
                    layout="sizes, total, prev, pager, next, jumper"
                    :page-sizes="[5, 10, 15, 20]"
                    :total="totals">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { getPageHistoryBySerialId, deletePageHistory, activating, getPageAndLayouts, updateVersionPageTime } from '@/request/marketing'
// import moment from 'moment'
let moment = window.moment

export default {
    props: {
        dialog: {
            type: Object,
            default: {
                show: true,
                serialId: ''
            }
        }
    },
    data () {
        return {
            dataList: [],
            load: false,
            page: {
                pageNum: 1,
                pageSize: 10,
                pagingSwitch: true
            },
            totals: 0,
            pageHistoryStatus: {
                1: '生效中',
                2: '未生效',
                3: '已删除'
            }
        }
    },
    created () {
        this.getList(1)
    },
    methods: {
        handleClose () {
            this.$emit('cancel')
        },
        handleDel (row) {
            if (row.status == 1) return
            deletePageHistory({ serialId: row.serialId }).then(res => {
                if (res.ret.errcode === 1){
                    this.$message.success('删除成功')
                    this.$emit('rush')
                    this.getList()
                }
            })
        },
        handleDelTime (row) {
            updateVersionPageTime({
                requestType: 2,
                serialId: row.pageSerialId,
                historyPageId: row.serialId,
                startTime: row.startTime
            }).then(res => {
                if (res.ret.errcode === 1) {
                    this.$message.success('删除定时成功')
                    this.getList() // 还是请求当页的数据
                }
            })
        },
        handleOpt (row, index) {
            let item = Object.assign(row, { isEditTime: !row.isEditTime })
            if (!item.isEditTime) { // 改后处于保存的状态，则是需要请求接口
                updateVersionPageTime({
                    requestType: 1,
                    serialId: row.pageSerialId,
                    historyPageId: row.serialId,
                    startTime: row.startTime
                }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('设置定时生效成功')
                        if (moment().isBefore(item.startTime)) {
                            item.isFeature = true
                        } else {
                            item.isFeature = false
                        }
                        this.dataList.splice(index, 1, item)
                    }
                })
            } else {
                this.dataList.splice(index, 1, item)
            }
        },
        handleView (row) {
            this.$router.push({
                name: 'previewIframe',
                query: {
                    historySerialId: row.serialId,
                    countryCode: this.dialog.countryCode
                }
            })
        },
        // 编辑的时候，需要传递这个父页面的serialId和对应国家码,而复制新页面则不用
        handleEdit (row) {
            this.$router.push({
                name: 'pageEdit',
                query: {
                    historySerialId: row.serialId,
                    pageSerialId: row.pageSerialId,
                    type: 'edit'
                }
            })
        },
        handleCopy (row) {
            this.$router.push({
                name: 'pageEdit',
                query: {
                    historySerialId: row.serialId,
                    type: 'copy'
                }
            })
        },
        handleActive (row) {
            activating({historySerialId: row.serialId}).then(res => {
                if (res.ret.errcode === 1) {
                    this.$message.success('生效成功')
                    this.$emit('rush')
                    this.getList()
                }
            })
        },
        handleSizeChange (value) {
            Object.assign(this.page, {
                pageSize: value,
                pageNum: 1
            })
            this.getList()
        },
        getList (page) {
            this.load = true
            this.page.pageNum = page || this.page.pageNum
            getPageHistoryBySerialId({page: this.page, serialId: this.dialog.serialId}).then(res => {
                if (res.ret.errcode === 1) {
                    this.totals = res.total
                    this.dataList = res.marketingPageHistoryInfoList.map(item => {
                        item.isEditTime = false
                        let intStartTime = parseInt(item.startTime)
                        item.startTime = intStartTime ? intStartTime : null
                        if (item.startTime) {
                            if (moment().isBefore(item.startTime)) {
                                item.isFeature = true
                            } else {
                                item.isFeature = false
                            }
                        } else {
                            item.isFeature = false
                        }

                        return item
                    })
                }
                this.load = false
            }).catch(err => {
                this.load = false
            })
        }
    }
}
</script>
<style lang="scss" scope>
    @import '@/styles/variables.scss';
    .green {
        color: $green;
    }

    .red {
        color: $red;
    }
    .el-date-editor.el-input {
        width: 100%;
    }
    .pagination-box {
        padding-bottom: 16px;
    }
</style>
