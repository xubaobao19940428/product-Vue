<template>
    <div class="match-setting-wrapper app-container">
        <div class="operator-container">
            <el-button icon="el-icon-plus" type="primary"
                size="medium"
                @click="handleAdd"
                class="operator-item"
            >
                新增
            </el-button>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="dataList" v-loading="load">
                <el-table-column label="序号" type="index" width="120px" align="center"></el-table-column>
                <el-table-column label="活动ID" align="center" prop="id"></el-table-column>
                <el-table-column label="活动开始时间" align="center">
                    <template slot-scope="scope">{{ scope.row.startTime | secondTimeFormat }}</template>
                </el-table-column>
                <el-table-column align="center" label="更新人">
                    <template slot-scope="scope">
                        {{scope.row.operation || '-'}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="180px" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleBatch(scope.row)">一键同步</el-button>
                        <el-button type="text" :disabled="notStart(scope.row.startTime)" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button type="text" @click="handleDel(scope.row, scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

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

        <el-dialog :visible="editShow" title="修改活动开始时间" @close="editShow = false"
            :close-on-click-modal="false"
            width="600px"
        >
            <el-date-picker type="datetime" value-format="timestamp"
                placeholder="请输入活动开始时间"
                style="width: 90%"
                class="m8"
                v-model="curStartTime">
            </el-date-picker>

            <div class="footer" slot="footer">
                <el-button @click="editShow = false">取消</el-button>
                <el-button type="primary" size="medium" @click="handleConfirm">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible="batchEditTime" title="同步时间" width="540px">
            同步至未来 <el-input-number v-model="sizeNum" :precision="0" :min="1" :controls="false"></el-input-number>天
            <div class="footer" slot="footer">
                <el-button @click="batchEditTime = false">取消</el-button>
                <el-button type="primary" size="medium" @click="handleBatchConfirm" :loading="batching">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { setMatchTime, queryMatchTime, updateMatchTime, removeMatchTime, setBatchMatchTime } from '@/api/shake.js'
let moment = require('moment')
export default {
    props: {
        countryCode: String
    },
    data () {
        return {
            dataList: [],
            curStartTime: '',
            curId: '',
            editShow: false,
            batchEditTime: false,
            sizeNum: 1,
            page: {
                pageNum: 1,
                pageSize: 10,
                pagingSwitch: true
            },
            totals: 0,
            load: false,
            batching: false
        }
    },
    methods: {
        notStart (time) {
            if (moment().isAfter(parseInt(time))) {
                return true
            }
            return false
        },
        handleSizeChange (val) {
            Object.assign(this.page, {
                pageSize: val,
                pageNum: 1
            })
            this.getList()
        },
        getList (pageNum) {
            this.page.pageNum = pageNum ? pageNum : 1
            this.load = true
            queryMatchTime(Object.assign({countryCode: this.countryCode, sortField: 'start_time', sortType: 'desc'}, this.page)).then(res => {
                this.load = false
                if (res.ret.errCode === 0) {
                    this.dataList = res.data.list
                    this.totals = res.data.total
                }
            }).catch(() => {
                this.load = false
            })
        },
        handleDel (item, index) {
            this.$confirm('确认删除该条设置吗？', '提示')
                .then(() => {
                    if (item.id) {
                        removeMatchTime({
                            id: item.id
                        }).then(res => {
                            if (res.ret.errCode === 0) {
                                this.$message.success('删除成功')
                                this.getList()
                            }
                        })
                    } else {
                        this.dataList.splice(index, 1)
                        this.$message.success('删除成功')
                    }
                })
                .catch(() => {})
        },
        handleEdit (item) {
            this.curId = item.id
            this.curStartTime = item.startTime
            this.editShow = true
        },
        handleBatch (item) {
            this.curId = item.id
            this.sizeNum = 1
            this.batchEditTime = true
        },
        handleBatchConfirm () {
            if (!this.sizeNum) {
                this.$message.warning('同步天数必填且需大于0')
            } else {
                this.batching = true
                setBatchMatchTime({
                    size: this.sizeNum,
                    id: this.curId
                }).then(res => {
                    this.batching = false
                    if (res.ret.errCode === 0) {
                        this.batchEditTime = false
                        this.$message.success('同步时间成功')
                        this.getList()
                    }
                }).catch(() => {
                    this.batching = false
                })
            }
        },
        handleConfirm () {
            if (!this.curStartTime) {
                this.$message.warning('活动开始时间必填')
                return
            }
            if (this.curId) {
                updateMatchTime({
                    countryCode: this.countryCode,
                    startTime: this.curStartTime,
                    id: this.curId
                }).then(res => {
                    if (res.ret.errCode === 0) {
                        this.editShow = false
                        this.$message.success('修改成功')
                        this.getList()
                    }
                })
            } else {
                setMatchTime({
                    countryCode: this.countryCode,
                    startTime: this.curStartTime
                }).then(res => {
                    if (res.ret.errCode === 0) {
                        this.editShow = false
                        this.$message.success('保存成功')
                        this.getList()
                    }
                })
            }
        },
        handleAdd () {
            this.dataList.push({
                startTime: ''
            })
            this.handleEdit({
                startTime: ''
            })
        }
    }
}
</script>
<style scoped lang="scss">
.match-setting-wrapper {
    .m8 {
        margin-top: 8px;
    }
}
</style>
