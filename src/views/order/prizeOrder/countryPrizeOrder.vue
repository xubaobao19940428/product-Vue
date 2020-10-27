<template>
    <div class="app-container">
        <el-form inline label-width="90px" :model="searchParam">
            <el-form-item label="大奖期号：">
                <el-input v-model="searchParam.productPeriod" clearable></el-input>
            </el-form-item>
            <el-form-item label="兑奖码：">
                <el-input v-model="searchParam.code" clearable></el-input>
            </el-form-item>
            <el-form-item label="用户ID：">
                <el-input v-model="searchParam.userId" clearable></el-input>
            </el-form-item>
            <el-form-item label="下单时间：">
                <el-date-picker type="daterange" value-format="timestamp"
                    start-placeholder="开始时间" end-placeholder="结束时间"
                    clearable
                    v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" @click="getList(1)" size="medium" type="primary">搜索</el-button>
                <el-button icon="el-icon-refresh-left" plain size="medium" @click="resetSearchParam">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-table :data="dataList" border v-loading="load" style="width: 100%">
                <el-table-column label="用户ID" fixed="left" align="center" prop="userId"></el-table-column>
                <el-table-column label="付款状态" align="center">
                    <template slot-scope="scope">
                        {{ payStatusObj[scope.row.payStatus] }}
                    </template>
                </el-table-column>
                <el-table-column label="参与商品" align="center">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="hover">
                            <img :src="dealShowFileSrc(scope.row.productCover)" class="previewImage">
                            <img v-popover:popover :src="dealShowFileSrc(scope.row.productCover)"
                                 class="thumbnail"
                                 slot="reference">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="大奖期号" align="center" prop="productPeriod"></el-table-column>
                <el-table-column label="兑奖码" align="center" prop="code"></el-table-column>
                <!-- <el-table-column label="已邀用户ID" align="center" prop=""></el-table-column> -->
                <el-table-column label="邀新数" align="center" prop="inviteNewNum"></el-table-column>
                <el-table-column label="奖励兑奖ID" align="center" prop="awardCode"></el-table-column>
                <el-table-column label="中奖状态" align="center">
                    <template slot-scope="scope">
                        {{ winStatusObj[scope.row.winStatus] }}
                    </template>
                </el-table-column>
                <el-table-column label="该期中奖码" align="center" prop="winCode"></el-table-column>
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
    </div>
</template>

<script>
import { findOrder } from '@/request/prize'
export default {
    props: {
        countryCode: String
    },
    data () {
        return {
            searchParam: {
                productPeriod: '', // 大奖期号
                code: '', // 兑奖码
                userId: '', // 用户ID
                queryStartTime: null,
                queryEndTime: null,
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            },
            load: false,
            timeList: [],
            dataList: [],
            totals: 0,
            payStatusObj: {
                0: '未支付',
                1: '已支付',
                2: '已退款'
            },
            winStatusObj: {
                1: '待开奖',
                2: '未中奖',
                3: '已中奖'
            }
        }
    },
    created () {
        this.getList(1)
    },
    methods: {
        resetSearchParam () {
            this.searchParam = {
                productPeriod: '', // 大奖期号
                code: '', // 兑奖码
                userId: '', // 用户ID
                queryStartTime: null,
                queryEndTime: null,
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            }
            this.timeList = []
        },
        handleSizeChange (value) {
            Object.assign(this.searchParam.page, {
                pageSize: value,
                pageNum: 1
            })
            this.getList()
        },
        getList (pageNum) {
            this.load = true
            this.searchParam.page.pageNum = pageNum || this.searchParam.page.pageNum
            this.timeList = this.timeList || []
            let resParam = {}
            resParam = this.filterData(Object.assign(this.searchParam, {
                queryStartTime: !this.timeList[0] ? null : this.timeList[0] + '',
                queryEndTime: !this.timeList[1] ? null : this.timeList[1] + ''
            }))
            resParam.countryCode = this.countryCode
            findOrder(resParam).then(res => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.superLuckyOrderUnit
                    this.totals = res.total
                }
                this.load = false
            }).catch(err => {
                this.load = false
            })
        },
    }
}
</script>
