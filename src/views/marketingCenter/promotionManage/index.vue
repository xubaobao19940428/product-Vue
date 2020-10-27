<template>
    <div class="app-container">
        <div class="main-content-tab-box">
            <div class="tab-l">
                <el-tabs v-model="activeIndex" @tab-click="changeTab()">
                    <el-tab-pane
                        v-for="(item, i) in tabList"
                        :key="i"
                        :label="item.name"
                        :name="item.key"
                    ></el-tab-pane>
                </el-tabs>
            </div>
            <div class="tab-r">
                <el-button icon="el-icon-plus" type="primary" size="small" @click="routePage()">新建</el-button>
            </div>
        </div>
        <div class="filter-container">
            <el-form inline :model="queryData">
                <el-form-item label-width="90px" label="APP标签：" class="filter-item">
                    <el-input
                        v-model="queryData.label"
                        placeholder="请输入"
                        size="medium"
                        style="width: 200px"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label-width="90px" label="国家：" class="filter-item">
                    <el-select
                        v-model="queryData.countryCode"
                        clearable
                        placeholder="请选择"
                        size="medium"
                    >
                        <el-option
                            v-for="(item, index) in countryList"
                            :key="index"
                            :label="item.nameEn + '/' + item.nameCn "
                            :value="item.shortCode"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label-width="90px" label="正品SPUID：" class="filter-item">
                    <el-input
                        v-model="queryData.spuId"
                        placeholder="请输入"
                        size="medium"
                        style="width: 200px"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label-width="90px" label="赠品SKUID：" class="filter-item">
                    <el-input
                        v-model="queryData.skuId"
                        placeholder="请输入"
                        size="medium"
                        style="width: 200px"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">查询</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-table
                :data="tableData"
                v-loading="loading"
                border
                height="100%"
                style="width: 100%;"
            >
                <el-table-column label="ID" prop="id" min-width="80" align="center" fixed="left"></el-table-column>
                <el-table-column label="内部名称" min-width="180px" prop="name" align="center"></el-table-column>
                <el-table-column label="APP标签" min-width="180px" align="center">
                    <template
                        slot-scope="scope"
                    >{{ scope.row.label ? JSON.parse(scope.row.label)['cn'] : '' }}</template>
                </el-table-column>
                <el-table-column label="国家" min-width="100px" align="center">
                    <template slot-scope="scope">{{ scope.row.countryCode | countryFilter }}</template>
                </el-table-column>
                <el-table-column label="开始时间" min-width="180px" align="center">
                    <template slot-scope="scope">{{ scope.row.startTime | formatTime }}</template>
                </el-table-column>
                <el-table-column label="结束时间" min-width="180px" align="center">
                    <template slot-scope="scope">{{ scope.row.endTime | formatTime }}</template>
                </el-table-column>
                <el-table-column label="更新人" min-width="180px" prop="operation" align="center"></el-table-column>
                <el-table-column label="状态" min-width="100px" align="center">
                    <template slot-scope="scope">{{ scope.row.status == 1 ? '生效' : '失效' }}</template>
                </el-table-column>
                <el-table-column label="更新时间" min-width="180px" align="center">
                    <template slot-scope="scope">{{ scope.row.updated | formatTime }}</template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <div>
                            <el-button @click="routePage(scope.row.id, scope.row)" type="text">编辑</el-button>
                            <el-button
                                v-if="scope.row.status == 1"
                                @click="changeStatus(scope.row.id, 2)"
                                type="text"
                            >一键失效</el-button>
                            <el-button
                                v-if="scope.row.status == 2"
                                @click="changeStatus(scope.row.id, 1)"
                                type="text"
                            >设为生效</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="queryData.pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="queryData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination"
            ></el-pagination>
        </div>
    </div>
</template>
<script>
import { mapState } from "vuex";
import { getGiveQuery, editGiveStatus } from "@/request/marketing.js";
export default {
    data() {
        return {
            // 表单查询数据
            queryData: {
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true,
                },
                label: "",
                countryCode: "",
                spuId: "",
                skuId: "",
                status: ""
            },
            // 当前选中索引
            activeIndex: "0",
            // tab项
            tabList: [
                {
                    key: "0",
                    name: "全部",
                },
                {
                    key: "1",
                    name: "进行中",
                },
                {
                    key: "2",
                    name: "已失效",
                },
            ],
            //表格数据源
            tableData: [],
            // 表格loading
            loading: false,
            total: 0, //表格总条数
        };
    },
    computed: {
        ...mapState({
            countryList: (state) => state.dict.countryList,
        }),
    },
    created() {
        this.queryTableData();
    },
    methods: {
        queryTableData() {
            getGiveQuery(this.filterData(this.queryData)).then((res) => {
                if (res.ret.errcode === 1) {
                    this.tableData = res.giveQuery;
                    this.total = res.total;
                }
            });
        },
        //搜索
        search() {
            this.queryTableData();
        },
        //重置
        resetSearch() {
            this.queryData = {
                pageNum: 1,
                pageSize: 10,
                pagingSwitch: true,
                label: "",
                countryCode: "",
                spuId: "",
                skuId: "",
            };
        },
        //翻页
        handleCurrentChange(page) {
            this.queryData.page.pageNum = page;
            this.queryTableData();
        },
        //修改单页显示数据条数
        handleSizeChange(pageSize) {
            this.queryData.page.pageSize = pageSize;
            this.queryTableData();
        },
        // 页面跳转
        routePage(id, row) {
            localStorage.setItem('DETAIL_SHORT_TIME', JSON.stringify(row));
            this.$router.push({
                name: "promotionManageEdit",
                query: {
                    id,
                },
            });
        },
        // 修改tab
        changeTab() {
            this.queryData.page.pageNum = 1;
            this.queryData.status = this.activeIndex == "0" ? "" : this.activeIndex;
            this.queryTableData();
        },
        // 修改活动状态
        changeStatus(id, status) {
            this.$confirm(
                status == 1
                    ? "请确保赠品数量充足"
                    : "失效期间买赠活动对用户不可见，可再次生效",
                `确定要将其${status == 1 ? "设为生效" : "一键失效"}吗？`,
                {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                }
            )
                .then(() => {
                    const params = {
                        id,
                        status,
                        operation: this.$store.state.user.username,
                    }
                    editGiveStatus(params).then((res) => {
                        if (res.ret.errcode === 1) {
                            // 更新列表
                            this.resetSearch();
                            this.search();

                            this.$message({
                                type: "success",
                                message: "设置成功!",
                            });
                        }
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消设置",
                    });
                });
        },
    },
};
</script>
<style lang="scss" scoped></style>