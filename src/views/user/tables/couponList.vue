<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form inline ref="couponFilterForm" label-width="90px" :model="queryData">
                <el-form-item label="优惠券ID：" class="filter-item" prop="couponId">
                    <el-input placeholder="请输入优惠券id" size="medium" 
                        clearable
                        style="width: 240px"
                        v-model="queryData.couponId" @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="优惠券名称：" class="filter-item" prop="couponName">
                    <el-input placeholder="请输入中文名称" size="medium" 
                        clearable
                        v-model="queryData.couponName" 
                        style="width: 240px"
                        @keyup.enter.native="search"></el-input>
                </el-form-item>
                <span v-show="drop">
                    <el-form-item label="类型：" class="filter-item" prop="couponType">
                        <el-select size="medium" v-model="queryData.couponType" placeholder="请选择">
                            <el-option value="" label="全部"></el-option>
                            <el-option v-for="item in typeList" :key="item.id" :label="item.desc" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="使用状态：">
                        <el-select v-model="queryData.couponUseStatus"
                                    size="medium">
                            <!-- 与后端约定全部的时候传9值 -->
                            <el-option :value="9" label="全部"></el-option>
                            <el-option v-for="(val, key) in useStatus"
                                        :key="key"
                                        :label="val"
                                        :value="parseInt(key)">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </span>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="reset" size="medium">重置</el-button>
                    <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-list">
            <el-table border :data="dataList" v-loading="loading" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                <el-table-column prop="couponUserDopb.couponId" label="优惠券ID" align="center" min-width="80px"></el-table-column>
                <el-table-column label="中文名称" align="center" min-width="120px">
                    <template slot-scope="scope">
                        {{ getLanguage(scope.row.name, 'cn') }}
                    </template>
                </el-table-column>
                <el-table-column label="类型" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ getCouponTypeName(scope.row.type) }}
                    </template>
                </el-table-column>
                <el-table-column label="使用范围" align="center" min-width="120px">
                    <template slot-scope="scope">
                        {{ couponScope[scope.row.couponUserDopb.couponScope] }}
                    </template>
                </el-table-column>
                <el-table-column label="适用国家" align="center">
                    <template slot-scope="scope">
                        {{ getCountryName(scope.row.couponUserDopb.countryCode) }}
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
                <el-table-column prop="couponUserDopb.receivingChannel"
                    align="center"
                    label="领取方式">
                </el-table-column>
                <el-table-column label="使用日期" align="center" min-width="180px">
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
            </el-table>
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="queryData.page.pageNum"
                :page-sizes="[5, 10, 20, 50]"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                class="pagination">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { queryUserCouponManage, queryCouponType } from '@/request/coupon'
import { mapState } from 'vuex'
    export default {
        name: 'couponList',
        data() {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                dataList: [],
                totalCount: 0,
                queryData: {
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    },
                    couponId: '',
                    couponName: '',
                    couponType: '',
                    couponUseStatus: 9,
                    userId: ''
                },
                typeList: [],
                useStatus: {
                    0: '未使用',
                    1: '已使用',
                    2: '已过期'
                },
                couponScope: { // 优惠券范围
                    1: '指定商品',
                    2: '指定品类',
                    3: '全品券'
                },
            }
        },
        created() {
            if (this.$route.query.userId) {
                this.queryData.userId = this.$route.query.userId
            }
            this.getCouponType()
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
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
            search() {
                this.queryData.page.pageNum = 1
                this.getUserCouponList()
            },
            getCountryName (data) {
                let item = this.countryList.find(item => item.shortCode === data)

                return item ? item.nameLocal : ' '
            },
            getCouponType() {
                queryCouponType({}).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res.couponTypeResult)
                        this.typeList = res.couponTypeResult
                    }
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
            getCouponTypeName (type) {
                let item = this.typeList.find((val) => {
                    return type == val.id
                })

                return item ? item.desc : ''
            },
            reset() {
                this.$refs.couponFilterForm.resetFields()
            },
            handleCurrentChange(value) {
                this.queryData.page.pageNum = value
                this.getUserCouponList()
            },
            handleSizeChange(value) {
                this.queryData.page.pageSize = value
                this.queryData.page.pageNum = 1
                this.getUserCouponList()
            },
            getUserCouponList() {
                this.loading = true
                queryUserCouponManage({ query: this.filterData(Object.assign(this.queryData)) }).then((response) => {
                    if (response.ret.errcode === 1) {
                        this.dataList = response.couponUserRespPb
                        this.totalCount = response.total
                    }
                    this.loading = false
                    console.log(response)
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            operation() {}
        }
    }
</script>

<style lang="scss" scoped>
    .pagination {
        margin: 20px;
        float: right;
    }
</style>
