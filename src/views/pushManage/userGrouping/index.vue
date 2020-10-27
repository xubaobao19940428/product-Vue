<template>
    <div class="user-grouping">
        <div class="title">用户组列表</div>
        <el-form inline :model="queryData">
            <el-form-item prop="userGroupName" label="用户组名称：" class="filter-item">
                <el-input v-model="queryData.userGroupName" placeholder="请输入" size="medium" style="width: 200px"></el-input>
            </el-form-item>
            <el-form-item prop="userGroupType" label="用户组属性：" class="filter-item">
                <el-select v-model="queryData.userGroupType" placeholder="请选择" filterable clearable>
                    <el-option v-for="item in userGroupTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-dropdown >
                    <el-button type="primary">
                        <i class="iconfont">&#xe721;</i>新增用户组<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="btnClick('byGroup')">用户分组</el-dropdown-item>
                        <el-dropdown-item @click.native="btnClick('bySpe')">特定用户组</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableData"
            border
            v-loading="loading"
            style="width: 100%">
            <el-table-column label="序号" type="index" :index="indexMethod" width="100" align="center" fixed="left"></el-table-column>
            <el-table-column label="用户组名称" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.userGroupName}}
                </template>
            </el-table-column>
            <el-table-column label="用户组Id" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.userGroupId}}
                </template>
            </el-table-column>
            <el-table-column label="用户组属性" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.userGroupType === '1' ? '特定' : '分群'}}
                </template>
            </el-table-column>
            <el-table-column label="人数" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.number}}
                </template>
            </el-table-column>
            <!-- <el-table-column label="生效任务引用数" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.onLineTime}}
                </template>
            </el-table-column> -->
            <el-table-column label="编辑者" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.operationName}}
                </template>
            </el-table-column>
            <el-table-column label="编辑时间" width="300" align="center">
                <template slot-scope="scope">
                    {{scope.row.editTime}}
                </template>
            </el-table-column>
            <el-table-column label="操作" width="300" align="center" fixed="right">
                <template slot-scope="scope">
                    <el-button type="text" @click="deleteGroup(scope.row.userGroupId)" class="deleteBtn">删除</el-button>
                    <el-button type="text" @click="editGroup(scope.row)">编辑</el-button>
                    <!-- <el-button type="text" @click="groupIdToExcel(scope.row.userGroupId)">导出</el-button> 
                    <el-button type="text" @click="groupIdTotal(scope.row.userGroupId)">统计</el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <div class="pagenation">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[5, 10, 15, 20]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import { GetUserGroupInfo, DeleteUserGroupInfo, GetUserGroupDetailInfo, GetUserGroupIdToExcel, GetUserGroupIdTotal } from '@/request/pushtask'

    export default {
        data () {
            return {
                queryData: {
                    userGroupName: '',
                    userGroupType: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                total: 0,
                tableData: [],
                userGroupTypeList: [{
                    value: '1',
                    label: '特定'
                },{
                    value: '2',
                    label: '分群'
                }]
            }
        },
        mounted() {
            this.getGetUserGroupInfo()
        },
        methods: {
            getGetUserGroupInfo () {
                let params = {
                    userGroupName: this.queryData.userGroupName,
                    userGroupType: this.queryData.userGroupType,
                    page: this.queryData.page
                }
                GetUserGroupInfo(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.tableData = res.userGroupInfo
                        this.total = Number(res.total)
                    }
                })
            },
            indexMethod (index) {
                return index+1
            },
            search () {
                this.getGetUserGroupInfo()
            },
            resetSearch () {
                this.propertyName = ''
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 10
            },
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getGetUserGroupInfo()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val
                this.getGetUserGroupInfo()
            },
            btnClick (val) {
                console.log(val)
                if (val === 'bySpe') {
                    this.$router.push({
                        name: 'userGroupBySpe',
                        query: {
                            editType: 'add'
                        }
                    })
                } else if (val === 'byGroup') {
                    this.$router.push({
                        name: 'userGroupByGroup',
                        query: {
                            editType: 'add'
                        }
                    })
                }
            },
            deleteGroup (val) {
                let params = {
                    userGroupId: val
                }
                DeleteUserGroupInfo(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.$message.success('删除成功！')
                        this.getGetUserGroupInfo()
                    }
                })
            },
            editGroup (val) {
                console.log(val)
                let params = {
                    userGroupId: val.userGroupId,
                    userGroupType: val.userGroupType
                }
                GetUserGroupDetailInfo(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        if (val.userGroupType === '1') {
                            this.$router.push({
                                name: 'userGroupBySpe',
                                query: {
                                    editType: 'edit',
                                    data: Object.assign(res,{
                                        userGroupName: val.userGroupName
                                    })
                                }
                            })
                        } else {
                            this.$router.push({
                                name: 'userGroupByGroup',
                                query: {
                                    editType: 'edit',
                                    data: Object.assign(res,{
                                        userGroupName: val.userGroupName
                                    })
                                }
                            })
                        }
                    }
                })
            },
            groupIdToExcel (val) {
                let params = {
                    userGroupId: val
                }
                GetUserGroupIdToExcel(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        window.open(this.dealShowFileSrc(res.url))
                    }
                })
            },
            groupIdTotal (val) {
                let params = {
                    userGroupId: val
                }
                GetUserGroupIdTotal(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.getGetUserGroupInfo()
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .user-grouping{
        overflow: scroll;
        .title{
            margin: 10px 0 20px 0;
            font-size: 20px;
            font-weight: 600;
        }
        .iconfont{
            font-size: 14px;
        }
        .pagenation{
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }
        .deleteBtn{
            color: red;
        }
    }
</style>