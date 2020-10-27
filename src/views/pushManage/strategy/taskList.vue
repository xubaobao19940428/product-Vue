<template>
    <div class="app-container">
        <div class="title">
            任务列表
            <span>用户召回策略组</span>
        </div>
        <div class="filter-container">
            <el-form inline :model="queryData">
                <el-form-item label="任务名称：" class="filter-item">
                    <el-input
                        v-model="queryData.strategyName"
                        placeholder="请输入"
                        size="medium"
                        style="width: 200px"
                    ></el-input>
                </el-form-item>
                <el-form-item label="任务类型：" class="filter-item">
                    <el-select
                        v-model="queryData.taskType"
                        placeholder="请选择"
                        size="medium"
                        style="width: 200px"
                    >
                        <el-option
                            v-for="item in taskTypeOption"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务状态：" class="filter-item">
                    <el-select
                        v-model="queryData.status"
                        placeholder="请选择"
                        size="medium"
                        style="width: 200px"
                    >
                        <el-option
                            v-for="item in taskStatusOption"
                            :key="item.value"
                            :label="item.name"
                            :value="item.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="任务国家：" class="filter-item">
                    <el-select
                        v-model="queryData.taskCountry"
                        placeholder="请选择"
                        size="medium"
                        style="width: 200px"
                    >
                        <el-option
                            v-for="item in taskCountryOption"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户组：" class="filter-item">
                    <el-select
                        v-model="queryData.userGroupId"
                        placeholder="请输入关键词"
                        size="medium"
                        filterable
                        remote
                        reserve-keyword
                        :remote-method="getGetUserGroupInfo"
                        style="width: 200px"
                    >
                        <el-option
                            v-for="item in userGroupIdOption"
                            :key="item.userGroupId"
                            :label="item.userGroupName"
                            :value="item.userGroupId"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">查询</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-dropdown trigger="click">
                        <el-button type="primary" size="medium">
                            <i class="iconfont">&#xe721;</i> 新增任务
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="routeTaskDetail('timing')">定时型任务</el-dropdown-item>
                            <el-dropdown-item @click.native="routeTaskDetail('period')">周期型任务</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
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
                <el-table-column
                    label="序号"
                    type="index"
                    :index="index => index + 1"
                    width="80"
                    align="center"
                    fixed="left"
                ></el-table-column>
                <el-table-column label="类型" width="80" align="center">
                    <template
                        slot-scope="scope"
                    >{{scope.row.taskType == "1" ? "定时" : scope.row.taskType == "2" ?"周期" : "触发"}}</template>
                </el-table-column>
                <el-table-column label="任务国家" width="80" align="center" prop="taskCountry"></el-table-column>
                <el-table-column label="任务名称" width="180" align="center" prop="taskName"></el-table-column>
                <el-table-column label="用户组" width="200" align="center" prop="userGroupName"></el-table-column>
                <el-table-column label="状态" width="100" align="center">
                    <template slot-scope="scope">
                        <div>
                            <span
                                class="point"
                                :style="setHtmlByStatus(scope.row.status).colorStyle"
                            >●</span>
                            {{setHtmlByStatus(scope.row.status).statusText}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="180" align="center">
                    <template slot-scope="scope">{{scope.row.createTime | formatTime}}</template>
                </el-table-column>
                <el-table-column label="节点时间" width="270" align="center">
                    <template slot-scope="scope">
                        <div>
                            <span>{{setHtmlByStatus(scope.row.status).panelText}}：</span>
                            {{scope.row.time | formatTime}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="计划发送数" width="120" align="center" prop="planSendCount"></el-table-column>
                <el-table-column label="实际发送数" width="120" align="center" prop="actSendCount"></el-table-column>
                <el-table-column label="PUSH打开数" width="120" align="center" prop="pushOpenNum"></el-table-column>
                <el-table-column label="PUSH打开率" width="120" align="center" prop="pushOpenRate"></el-table-column>
                <el-table-column label="短信触达数" width="120" align="center" prop="smsReachNum"></el-table-column>
                <el-table-column label="短信打开数" width="120" align="center" prop="smsOpenNum"></el-table-column>
                <el-table-column label="短信打开率" width="120" align="center" prop="smsOpenRate"></el-table-column>
                <el-table-column label="邮件触达数" width="120" align="center" prop="emailReachNum"></el-table-column>
                <el-table-column label="邮件触达率" width="120" align="center" prop="emailReachRate"></el-table-column>
                <el-table-column label="邮件已读数" width="120" align="center" prop="emailReadNum"></el-table-column>
                <el-table-column label="邮件已读率" width="120" align="center" prop="emailReadRate"></el-table-column>
                <el-table-column label="邮件跳转数" width="120" align="center" prop="emailClickNum"></el-table-column>
                <el-table-column label="邮件跳转率" width="120" align="center" prop="emailClickRate"></el-table-column>
                <el-table-column label="操作" width="200" align="center" fixed="right">
                    <template slot-scope="scope">
                        <el-button
                            v-if="scope.row.status != 3"
                            type="text"
                            @click="openTask(scope.row.taskCode)"
                        >{{scope.row.status == 5 ? "开启" : "关闭"}}</el-button>
                        <el-button
                            v-if="scope.row.status != 3 && scope.row.status != 5"
                            type="text"
                            @click="routeTaskDetail(scope.row.validCron ? 'period' : 'timing', scope.row.taskCode, 'edit')"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            @click="routeTaskDetail(scope.row.validCron ? 'period' : 'timing', scope.row.taskCode, 'copy')"
                        >复制</el-button>
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
import { queryTaskList, triggerTask } from "@/request/strategy";
import { GetUserGroupInfo } from "@/request/pushtask";
export default {
    name: "strategyTaskList",
    data() {
        return {
            strategyCode: "",
            queryData: {
                strategyName: "", //任务名称
                taskType: null, //任务类型
                status: null, //任务状态  1:未开始 2:进行中 3:已结束 4:待处理 5:已关闭
                taskCountry: null, //任务国家
                userGroupId: null, //用户组
                pageNum: 1,
                pageSize: 10
            }, //查询表格数据表单
            tableData: [], //表格数据
            taskTypeOption: [
                { id: 1, name: "定时" },
                { id: 2, name: "周期" }
            ], //任务类型枚举
            taskStatusOption: [
                { value: 1, name: "未开始" },
                { value: 2, name: "进行中" },
                { value: 3, name: "已结束" },
                { value: 4, name: "待处理" },
                { value: 5, name: "已关闭" }
            ], //任务状态枚举
            taskCountryOption: [
                { id: "MY", name: "马来西亚" },
                { id: "SG", name: "新加坡" },
                { id: "TH", name: "泰国" },
                { id: "ID", name: "印度尼西亚" }
            ], //任务国家枚举
            userGroupIdOption: [], //用户组枚举
            searchLoading: false,
            total: 0 //表格总条数
        };
    },
    mounted() {
        this.strategyCode = this.$route.query.strategyCode;
        this.queryTableData();
        this.getGetUserGroupInfo();
    },
    methods: {
        //查询表格数据
        queryTableData() {
            queryTaskList({
                ...this.queryData,
                strategyCode: this.strategyCode
            })
                .then(res => {
                    this.tableData = res.data.results;
                    this.total = res.data.totalCount;
                })
                .catch(err => {});
        },
        //开启任务
        openTask(strategyTaskCode) {
            triggerTask(strategyTaskCode)
                .then(res => {
                    this.$message.success("操作成功");
                    this.queryTableData();
                })
                .catch(err => {});
        },
        /**
         * 跳转任务详情
         * @param {String} t1 任务类型 timing:定时任务 period:周期型任务
         * @param {String} taskCode 任务code，编辑必备，空则为新增
         * @param {String} t2 编辑类型，copy:复制，edit:编辑
         */
        routeTaskDetail(t1, taskCode, t2) {
            this.$router.push({
                name: "strategyTaskDetail",
                query: {
                    strategyCode: this.strategyCode,
                    taskCode: taskCode,
                    type: t1,
                    edit: t2
                }
            });
        },
        //获得所有用户组信息
        getGetUserGroupInfo(query) {
            GetUserGroupInfo({
                userGroupName: query
            }).then(res => {
                if (res.ret.errcode === 1) {
                    this.userGroupIdOption = res.userGroupInfo;
                    this.searchLoading = false;
                }
            });
        },
        //搜索
        search() {
            this.queryTableData();
        },
        //重置
        resetSearch() {
            this.queryData.strategyName = "";
            this.queryData.status = null;
            this.queryData.taskType = null;
            this.queryData.taskCountry = null;
            this.queryData.userGroupId = null;
            this.userGroupIdOption = [];
        },
        //翻页
        handleCurrentChange(page) {
            this.queryData.pageNum = page;
            this.queryTableData();
        },
        //修改单页显示数据条数
        handleSizeChange(pageSize) {
            this.queryData.pageSize = pageSize;
            this.queryTableData();
        },
        //根据状态设置页面显示
        setHtmlByStatus(status) {
            let colorStyle = "";
            let panelText = "";
            let statusText = "";
            switch (status) {
                case 1:
                    colorStyle = "color: #00A854;"; //未开始
                    panelText = "开始时间";
                    statusText = "未开始";
                    break;
                case 2:
                    colorStyle = "color: #0E77D1;"; //进行中
                    panelText = "最近执行时间";
                    statusText = "进行中";
                    break;
                case 3:
                    colorStyle = "color: #FFBF00;"; //已结束
                    panelText = "结束时间";
                    statusText = "已结束";
                    break;
                case 4:
                    colorStyle = "color: #F04134;"; //待处理
                    panelText = "最早异常时间";
                    statusText = "待处理";
                    break;
                case 5:
                    colorStyle = "color: #BFBFBF;"; //已关闭
                    panelText = "关闭时间";
                    statusText = "已关闭";
                    break;
                default:
                    break;
            }
            return {
                colorStyle,
                panelText,
                statusText
            };
        }
    }
};
</script>
<style lang="scss" scoped>
.title {
    margin: 10px 0 20px 0;
    font-size: 20px;
    font-weight: 600;
    span {
        font-size: 14px;
        opacity: 0.5;
        margin-left: 10px;
    }
}
</style>