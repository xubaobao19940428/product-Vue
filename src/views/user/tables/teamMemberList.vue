<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form inline ref="teamMemberFilterForm" :model="queryData" label-width="90px">
                <el-form-item label="用户id：" class="filter-item" prop="memberId">
                    <el-input placeholder="请输入用户id" size="medium" clearable v-model="queryData.memberId" maxlength=12 @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="昵称：" class="filter-item" prop="nickname">
                    <el-input placeholder="请输入昵称" size="medium" clearable v-model="queryData.nickname" @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" class="filter-item" prop="mobile">
                    <el-input placeholder="请输入手机号" size="medium" clearable v-model="queryData.mobile" maxlength=12 @keyup.enter.native="search"></el-input>
                </el-form-item>
                <span v-show="drop">
                    <el-form-item label="关系：" class="filter-item" prop="relation">
                        <el-select size="medium" v-model="queryData.relation" placeholder="请选择">
                            <el-option v-for="item in relationshipList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="等级：" class="filter-item" prop="memberLevel">
                        <el-select size="medium" v-model="queryData.memberLevel" placeholder="请选择">
                            <el-option v-for="(item, key) in userLevel" :key="key" :label="item" :value="key"></el-option>
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
            <el-table border :data="dataList"  v-loading="loading" max-height="600" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                <el-table-column prop="userId" label="用户id" align="center" min-width="150px">
                     <template slot-scope="scope"> <el-link type="primary" :underline="false" @click="jumpToDetail(scope.row.userId)">{{ scope.row.userId }}</el-link></template>
                </el-table-column>
                <el-table-column prop="nickname" label="昵称" align="center" min-width="120px"></el-table-column>
                <el-table-column prop="mobile" label="手机号" align="center" min-width="150px"></el-table-column>
                <el-table-column label="等级" align="center" min-width="120px">
                    <template slot-scope="scope"> {{ userLevel[scope.row.memberLevel] }}</template>
                </el-table-column>
                <el-table-column prop="recentUpgradeTime" label="绑定时间" align="center" min-width="180px">
                    <template slot-scope="scope"> {{ scope.row.bindingTime | secondTimeFormat }}</template>
                </el-table-column>
                <el-table-column prop="relation" label="关系" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.relation === 1" size="mini">直属</el-tag>
                        <el-tag type="danger" v-if="scope.row.relation === 2" size="mini">间属</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="commissionAmount" label="贡献收益" align="center" min-width="120px">
                    <template slot-scope="scope">
                        {{scope.row.commissionAmount || '-'}}
                    </template>
                </el-table-column>
                <el-table-column prop="teamMemberCount" label="团队人数" align="center" min-width="120px">
                    <template slot-scope="scope">
                        {{scope.row.teamMemberCount.teamTotalNum}}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="120px" v-if="hasPermission('BTN_USER_MEG_OPERATION_SEE_DETAIL')">
                    <template slot-scope="scope">
                        <el-button type="text" @click="operation(scope.row.id)">详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                :page-sizes="[5, 10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                class="pagination">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { listTeamMemberByPage } from '@/request/user'
    export default {
        name: 'teamMemberList',
        data() {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                userId: '',
                dataList: [],
                totalCount: 0,
                queryData: {
                    page: {
                        pageNum: 1,
                        pageSize: 20,
                    },
                    memberId: '',
                    nickname: '',
                    mobile: '',
                    relation: 1,
                    memberLevel: ''
                },
                relationshipList: [
                    {
                        value: 1,
                        label: '直属'
                    },
                    {
                        value: 2,
                        label: '间属'
                    }
                ],
                inputValue: '',
                userLevel: {
                    2: 'SP',
                    3: 'PS',
                    4: 'AM',
                    5: 'AT'
                }
            }
        },
        computed: {
        },
        created() {
            if (this.$route.query.userId) {
                this.userId = this.$route.query.userId
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
                this.getTeamMemberList()
            },
            reset() {
                this.$refs.teamMemberFilterForm.resetFields()
                this.getTeamMemberList()
            },
            handleCurrentChange() {},
            operation() {},
            getTeamMemberList() {
                this.loading = true
                let params = this.queryData
                params.userId = this.userId
                listTeamMemberByPage(this.filterData(params)).then((response) => {
                    this.loading = false
                    if (response.ret.errcode === 1) {
                        this.totalCount = response.total
                        this.dataList = response.lowerUserPb
                    }
                    console.log(response)
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getTeamMemberList()
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val
                this.queryData.page.pageNum = 1
                this.getTeamMemberList()
            },
            jumpToDetail(userId) {
                this.$router.push({
                    name: 'memberInfo',
                    query: {
                        userId: userId
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .pagination {
        margin: 20px;
        float: right;
    }
</style>
