<template>
    <div class="app-container">
        <el-form inline label-width="90px">
            <el-form-item label="用户id：" class="filter-item">
                <el-input placeholder="请输入用户id" size="medium" clearable v-model="queryData.userId"  @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item label="问题类型：" class="filter-item">
                <el-select v-model="queryData.type" size="medium" clearable>
                    <el-option v-for="(item, index) in type" :key="index" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <span v-show="drop">
                <el-form-item label="开始时间：" class="filter-item">
                    <el-date-picker value-format="timestamp" size="medium" clearable v-model="timeList" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
            </span>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                    {{dropDownContent}}
                    <i :class="dropDownIcon"></i>
                </el-link>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-table border height="100%" :data="feedbackList" v-loading="loading">
                <el-table-column prop="userId" label="用户ID" align="center" min-width="60px">
                </el-table-column>
                <el-table-column label="问题类型" align="center" min-width="60px">
                    <template slot-scope="scope">
                          {{ findName(scope.row.type) }}
                    </template>
                </el-table-column>
                <el-table-column label="问题描述" align="center" min-width="250px">
                    <template slot-scope="scope">
                        {{ scope.row.questionDesc }}
                    </template>
                </el-table-column>
                <el-table-column label="联系电话/Email" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.connectMode }}
                    </template>
                </el-table-column>
                <el-table-column label="提交时间" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | secondTimeFormat }}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <list-pagination
            :total="total"
            :page="queryData.page.pageNum"
            :pageSize="queryData.page.pageSize"
            :handleSizeChange="handleSizeChange"
            :handleCurrentChange="handleCurrentChange">
        </list-pagination>
  </div>
</template>

<script>
    import listPagination from '@/components/ListPagination'
    import { listQuestionByPage } from '@/request/user'

    export default {
        name: 'feedback',
        components: {
            listPagination
        },

        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                queryData: {
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    },
                    userId: '',
                    type: '',
                    startTime: '',
                    endTime: ''
                },
                total: 0,
                feedbackList: [],
                timeList: [],
                type: [{
                           id: 1,
                           name: '功能异常'
                       },
                       {
                           id: 2,
                           name: '商品问题'
                       },
                       {
                           id: 3,
                           name: '订单问题'
                       },
                       {
                           id: 4,
                           name: '返利积分问题'
                       },
                       {
                           id: 5,
                           name: '产品建议'
                       },
                       {
                           id: 6,
                           name: '其他'
                       }
                ]
            }
        },
        computed: {
            nowEnd () {
                return this.$store.state.globalNum.nowEnd
            },
            lastMonth () {
                return this.$store.state.globalNum.lastMonth
            }
        },
        created () {
            this.timeList = [this.lastMonth, this.nowEnd]
            this.getFeedbackList()
        },
        methods: {
            dropDown () {
                if (this.drop) {
                    this.dropDownContent = '展开'
                    this.dropDownIcon = 'el-icon-arrow-down'
                } else {
                    this.dropDownContent = '收起'
                    this.dropDownIcon = 'el-icon-arrow-up'
                }
                this.drop = !this.drop
            },
            findName (type) {
                let item = this.type.find((val) => {
                    return val.id == type
                })
                return item ? item.name : ''
            },
            resetSearch () {
                this.queryData = {
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    },
                    userId: '',
                    type: '',
                    startTime: '',
                    endTime: ''
                }
                this.timeList = [this.lastMonth, this.nowEnd]
                this.getFeedbackList()
            },
            search () {
                this.queryData.page.pageNum = 1
                this.getFeedbackList()
            },
            getFeedbackList () {
                this.loading = true
                let params = this.queryData
                this.timeList = this.timeList ? this.timeList : []
                params.startTime = !this.timeList[0] ? null : (this.timeList[0]).toString()
                params.endTime = !this.timeList[1] ? null : (this.timeList[1]).toString()
                listQuestionByPage(this.filterData(params)).then((response) => {
                    this.loading = false
                    let res = response
                    this.feedbackList = res.userQuestionDo
                    this.total = res.total
                }).catch((err) => {
                    this.loading = false
                    console.error(err)
                })
            },
            handleSizeChange (value) {
                this.queryData.page.pageSize = value
                this.getFeedbackList()
            },
            handleCurrentChange (value) {
                this.queryData.page.pageNum = value
                this.getFeedbackList()
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>
