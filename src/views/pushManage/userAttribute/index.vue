<template>
    <div class="user-attribute">
        <div class="title">用户属性查询</div>
        <el-form inline :model="queryData">
            <el-form-item prop="propertyName" label="属性名称：" class="filter-item">
                <el-input v-model="queryData.propertyName" clearable placeholder="请输入" size="medium" style="width: 200px" @keyup.enter.native="search"></el-input>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableData"
            border
            v-loading="loading"
            style="width: 100%">
            <el-table-column label="序号" type="index" :index="indexMethod" width="100" align="center"></el-table-column>
            <el-table-column label="属性名称" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.propertyName}}
                </template>
            </el-table-column>
            <el-table-column label="属性类型" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.propertyType}}
                </template>
            </el-table-column>
            <el-table-column label="属性值描述" width="250" align="center">
                <template slot-scope="scope">
                    {{scope.row.propertyDesc}}
                </template>
            </el-table-column>
            <el-table-column label="上线时间" width="180" align="center">
                <template slot-scope="scope">
                    {{scope.row.onLineTime}}
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
    import { GetUserPropertyList } from '@/request/pushtask'

    export default {
        data () {
            return {
                queryData: {
                    propertyName: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                total: 0,
                tableData: []
            }
        },
        mounted() {
            this.getUserPropertyList()
        },
        methods: {
            getUserPropertyList () {
                let params = {
                    propertyName: this.queryData.propertyName,
                    page: this.queryData.page
                }
                GetUserPropertyList(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.tableData = res.userPropertyList
                        this.total = Number(res.total)
                    }
                })
            },
            indexMethod (index) {
                return index+1
            },
            search () {
                this.getUserPropertyList()
            },
            resetSearch () {
                this.propertyName = ''
                this.page.pageNum = 1
                this.page.pageSize = 10
            },
            handleSizeChange (val) {
                this.page.pageSize = val
                this.getUserPropertyList()
            },
            handleCurrentChange (val) {
                this.page.pageNum = val
                this.getUserPropertyList()
            },
        }
    }
</script>
<style lang="scss" scoped>
    .user-attribute{
        .title{
            margin: 10px 0 20px 0;
            font-size: 20px;
            font-weight: 600;
        }
        .pagenation{
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;
        }
    }
</style>