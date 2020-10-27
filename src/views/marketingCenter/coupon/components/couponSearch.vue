<template>
    <div class="app-container">
        <el-form inline label-width="90px">
            <el-form-item label="使用状态：">
                <el-select v-model="searchParam.couponUseStatus"
                            size="medium">
                    <el-option :value="9" label="全部"></el-option>
                    <el-option v-for="(val, key) in useStatus"
                                :key="key"
                                :label="val"
                                :value="key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单编号：">
                <el-input v-model="searchParam.orderNo"
                            clearable
                            size="medium"></el-input>
            </el-form-item>
            <el-form-item label="用户ID：">
                <el-input v-model="searchParam.userId"
                            clearable
                            size="medium"></el-input>
            </el-form-item>
            <span v-show="drop">
                <el-form-item label="优惠券ID：">
                    <el-input v-model="searchParam.couponId"
                                clearable
                                size="medium"></el-input>
                </el-form-item>
                <el-form-item label="到账时间：">
                    <el-date-picker
                        class="s-form"
                        v-model="searchParam.createTime"
                        type="date"
                        clearable
                        :picker-options="startLimit"
                        value-format="timestamp"
                        placeholder="选择开始日期">
                    </el-date-picker>
                    -
                    <el-date-picker
                        v-model="now"
                        class="s-form"
                        disabled
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择结束日期">
                    </el-date-picker>
                </el-form-item>
            </span>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button @click="getList(1)"
                            type="primary"
                            icon="el-icon-search"
                            size="medium">搜索</el-button>
                <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                    {{dropDownContent}}
                    <i :class="dropDownIcon"></i>
                </el-link>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-table :data="dataList"
                        border
                        v-loading="load"
                        height="100%">
                <el-table-column prop="couponUserDopb.couponId"
                                    min-width="100px"
                                    align="center"
                                    fixed="left"
                                    label="优惠券ID">
                </el-table-column>
                <el-table-column
                                label="优惠券信息"
                                align="center"
                                fixed="left"
                                min-width="120px">
                    <template slot-scope="scope">
                        {{ getLanguage(scope.row.name, 'cn') }}
                    </template>
                </el-table-column>
                <el-table-column prop="couponUserDopb.couponCode"
                                    min-width="200px"
                                    align="center"
                                    label="优惠码">
                </el-table-column>
                <el-table-column prop="couponUserDopb.userId"
                                    min-width="100px"
                                    align="center"
                                    label="领取用户ID">
                </el-table-column>
                <el-table-column prop="couponUserDopb.receivingChannel"
                                    align="center"
                                    label="领取方式">
                </el-table-column>
                <el-table-column label="到账时间"
                                    align="center"
                                    min-width="200px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.couponUserDopb.createTime | formatTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="优惠券有效期"
                                    align="center"
                                    min-width="320px">
                    <template slot-scope="scope">
                        <span>{{ scope.row.couponUserDopb.startTime | formatTime }} - {{ scope.row.couponUserDopb.endTime | formatTime }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="使用状态" align="center">
                    <template slot-scope="scope">
                        <span>{{ useStatus[scope.row.couponUserDopb.couponUseStatus || 0] }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    min-width="180px"
                    align="center"
                    label="使用时间">
                    <template slot-scope="scope">
                        <span v-if="parseInt(scope.row.couponUserDopb.couponUseTime)">
                            {{ scope.row.couponUserDopb.couponUseTime | formatTime }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="couponUserDopb.orderId"
                                    min-width="180px"
                                    align="center"
                                    label="订单编号">
                </el-table-column>
                <!-- <el-table-column label="操作" v-if="hasPermission('BTN_COUPON_SEARCH_WITHDRAW')" align="center" fixed="right" width="100px">
                    <template slot-scope="scope">
                        <el-button 
                            v-if="!scope.row.couponUserDopb.couponUseStatus" 
                            @click="handleWithDraw(scope.row)" 
                            size="mini"
                            type="primary" plain>撤回</el-button>
                    </template>
                </el-table-column> -->
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
    import { queryUserCouponManage, withDrawUserCoupon } from '@/request/coupon.js'
    // import moment from 'moment'

    const now = new Date(new Date().toLocaleDateString())
    const monthAgo = now.getTime() - 3600 * 1000 * 24 * 7
    export default {
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                useStatus: {
                    0: '未使用',
                    1: '已使用',
                    2: '已过期'
                },
                dataList: [],
                now,
                load: false,
                totals: 0,
                searchParam: {
                    orderNo: '',
                    userId: '',
                    couponUseStatus: 9,
                    createTime: monthAgo,
                    couponId: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                startLimit: {
                    disabledDate (time) {
                        return time.getTime() > Date.now() - 8.64e6
                    }
                }
            }
        },
        created () {
            this.getList()
        },
        methods: {
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = '展开';
                    this.dropDownIcon = 'el-icon-arrow-down';
                } else {
                    this.dropDownContent = '收起';
                    this.dropDownIcon = 'el-icon-arrow-up';
                }
                this.drop = !this.drop;
            },
            getList (page) {
                this.load = true
                this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                queryUserCouponManage({ query: this.filterData(this.searchParam) }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.couponUserRespPb
                        this.totals = res.total
                    }
                    this.load = false
                }).catch(err => {
                    this.load = false
                })

            },
            getLanguage (data, type) {
                let res = ''
                if (data && data.length) {
                    let item = data.find(item => item.languageCode === type)

                    res = item ? item.name : ' '
                }
                return res
            },
            handleSizeChange (value) {
                Object.assign(this.searchParam.page, {
                    pageSize: value,
                    pageNum: 1
                })
                this.getList()
            },
            handleWithDraw (item) {
                this.$confirm('确认要收回此券吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    console.log('执行')
                    withDrawUserCoupon({couponCode: item.couponUserDopb.couponCode}).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('撤回优惠券成功')
                            this.getList()
                        }
                    })
                }).catch(() => {
                    this.$message.info('已取消撤回')
                })
            }
        }
    }
</script>
