<template>
    <div class="raffle-assistant-wrapper app-container">
        <el-form inline label-width="80px" :model="searchParam">
            <el-form-item label="抽奖名称：">
                <el-input placeholder="请输入抽奖名称" v-model="searchParam.luckDrawName"></el-input>
            </el-form-item>
            <el-form-item label="国家：">
                <el-select v-model="searchParam.countryCode"
                            filterable
                            clearable>
                    <el-option v-for="item in countryList"
                                :key="item.shortCode"
                                :label="item.nameLocal"
                                :value="item.shortCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="抽奖密令：">
                <el-input placeholder="至少8位，不支持模糊搜索" v-model="searchParam.luckDrawPassword" style="width: 220px"></el-input>
            </el-form-item>
            <el-form-item label="活动时间：">
                <el-date-picker type="datetimerange" value-format="timestamp"
                    start-placeholder="开始时间" end-placeholder="结束时间"
                    v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" type="primary" @click="getList(1)" size="medium">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="operator-container">
            <el-button 
                v-if="hasPermission('BTN_RAFFLE_ASSISTANT_ADD')"
                icon="el-icon-plus" 
                type="primary" size="medium" class="operator-item" @click="handleAdd">新增</el-button>
        </div>
        <div class="type-container">
            <el-button 
                type="primary" 
                plain 
                size="medium" 
                :class="['btn-padding', searchParam.luckDrawStatus === 0 ? 'primary-active' : '']"
                @click="handleSelect(0)"
            >全部</el-button>
            <el-button 
                type="success" 
                plain 
                size="medium" 
                :class="['btn-padding', searchParam.luckDrawStatus === 3 ? 'success-active' : '']"
                @click="handleSelect(3)"
            >未开始</el-button>
            <el-button 
                type="danger" 
                plain 
                size="medium" 
                :class="['btn-padding', searchParam.luckDrawStatus === 1 ? 'danger-active' : '']"
                @click="handleSelect(1)"
            >进行中</el-button>
            <el-button 
                type="info" 
                plain 
                size="medium" 
                :class="['btn-padding', searchParam.luckDrawStatus === 2 ?'info-active' : '']"
                @click="handleSelect(2)"
            >已结束</el-button>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="dataList" v-loading="loading" height="100%" style="width: 100%;">
                <el-table-column label="抽奖ID" fixed="left" align="center" prop="luckDrawId" width="120px"></el-table-column>
                <el-table-column label="抽奖名称" align="center" prop="luckDrawName" width="120px"></el-table-column>
                <el-table-column label="国家" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="抽奖密令" align="center" prop="luckDrawPassword" width="240px"></el-table-column>
                <el-table-column label="开始时间" align="center" width="180px">
                    <template slot-scope="scope">{{ scope.row.startTime | secondTimeFormat}}</template>
                </el-table-column>
                <el-table-column label="结束时间" align="center" width="180px">
                    <template slot-scope="scope">{{ scope.row.endTime | secondTimeFormat}}</template>
                </el-table-column>
                <el-table-column label="更新人" align="center" prop="operationName"></el-table-column>
                <el-table-column label="更新时间" align="center" width="180px">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | secondTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" fixed="right" width="120px">
                    <template slot-scope="scope">
                        <el-button 
                            v-if="hasPermission('BTN_RAFFLE_ASSISTANT_POOL')"
                            type="text" 
                            size="medium" @click="handleGoPool(scope.row.luckDrawId)">奖池</el-button>
                        <el-button 
                            v-if="hasPermission('BTN_RAFFLE_ASSISTANT_EDIT')"
                            type="text" 
                            size="medium" @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

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

        <cur-pool-dialog 
            v-if="poolShow"
            :dialog-visible="poolShow" 
            @close="poolShow = false"
            :luckPrizeList="luckPrizeList"
            :luckDrawId="curLuckDrawId"
        ></cur-pool-dialog>
    </div>
</template>

<script>
import curPoolDialog from './components/curPoolDialog'
import { listLuckDrawTemplate, queryLuckPrizeInfo } from '@/request/luckdraw'
export default {
    data () {
        return {
            searchParam: {
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                },
                luckDrawName: '',
                luckDrawId: '',
                countryCode: '',
                luckDrawStatus: 0,
                luckDrawPassword: '' // 抽奖密令
            },
            totals: 0,
            timeList: [],
            loading: false,
            dataList: [],
            awardShow: false,
            poolShow: false,
            luckPrizeList: [],
            curLuckDrawId: ''
        }
    },
    components: {
        curPoolDialog
    },
    computed: {
        countryList () {
            return this.$store.state.dict.countryList
        }
    },
    created () {
        this.getList(1)
    },
    methods: {
        handleSizeChange (value) {
            this.searchParam.page.pageSize = value
            this.getList(1)
        },
        handleSelect (state) {
            this.searchParam.luckDrawStatus = state
            this.getList(1)
        },
        handleAdd () {
            this.$router.push({
                name: 'raffleOperator',
                query: {
                    type: 'add'
                }
            })
        },
        handleEdit (row) {
            this.$router.push({
                name: 'raffleOperator',
                query: {
                    type: 'edit',
                    id: row.luckDrawId
                }
            })
        },
        handleGoPool (luckDrawId) {
            this.curLuckDrawId = luckDrawId
            this.poolShow = true
        },
        getList (page) {
            this.loading = true
            this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
            this.timeList = this.timeList || []
            let resParam = {}
            resParam = this.filterData(Object.assign(this.searchParam, {
                startTime: !this.timeList[0] ? null : this.timeList[0],
                endTime: !this.timeList[1] ? null : this.timeList[1]
            }))
            listLuckDrawTemplate(resParam).then(res => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.luckDrawInfo
                    this.totals = res.total
                }
                this.loading = false
            }).catch(err => {
                console.error(err)
                this.loading = false
            })
        }
    }
}
</script>

<style scoped lang="scss">
.raffle-assistant-wrapper {
    .type-container {
        margin-bottom: 4px;
        .btn-padding {
            padding: 10px 30px;
        }
    }
    .el-button {
        &.primary-active {
            color: #ffffff;
            background-color: #409EFF;
            border-color: #409EFF;
        }
        &.success-active {
            color: #ffffff;
            background-color: #67C23A;
            border-color: #67C23A;
        }
        &.info-active {
            color: #ffffff;
            background-color: #909399;
            border-color: #909399;
        }
        &.danger-active {
            color: #ffffff;
            background-color: #F56C6C;
            border-color: #F56C6C;
        }
    }
}
</style>