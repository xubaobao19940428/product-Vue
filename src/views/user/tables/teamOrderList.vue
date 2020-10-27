<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form inline ref="teamOrderFilterForm" label-width="90px" :model="filterData">
                <el-form-item label="订单编号：" class="filter-item" prop="orderId">
                    <el-input type="number" placeholder="订单编号" size="medium" v-model="filterData.orderId" maxlength=12 @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="返佣状态：" class="filter-item" prop="commissionStatus">
                    <el-select size="medium" v-model="filterData.commissionStatus" placeholder="请选择">
                        <el-option v-for="item in commissionStatusList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订单状态：" class="filter-item" prop="status">
                    <el-select size="medium" v-model="filterData.status" placeholder="请选择">
                        <el-option v-for="item in statusList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <span v-show="drop">
                    <el-form-item label="归属用户id：" class="filter-item" prop="userId">
                        <el-input type="number" placeholder="请输入归属用户id" size="medium" v-model="filterData.userId" maxlength=12 @keyup.enter.native="search"></el-input>
                    </el-form-item>
                    <el-form-item label="等级：" class="filter-item" prop="memberLevel">
                        <el-select size="medium" v-model="filterData.memberLevel" placeholder="请选择">
                            <el-option v-for="item in memberLevelList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="关系：" class="filter-item" prop="relationship">
                        <el-select size="medium" v-model="filterData.relationship" placeholder="请选择">
                            <el-option v-for="item in relationshipList" :key="item.label" :label="item.label" :value="item.value"></el-option>
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
            <el-table border :data="dataList" max-height="600" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                <el-table-column prop="id" label="用户id" align="center" min-width="80px"></el-table-column>
                <el-table-column prop="nickName" label="昵称" align="center" min-width="120px"></el-table-column>
                <el-table-column prop="mobile" label="手机号" align="center" min-width="150px"></el-table-column>
                <el-table-column label="等级" align="center" min-width="120px">
                    <template slot-scope="scope"> {{ userLevel[scope.row.vipLevel] }}</template>
                </el-table-column>
                <el-table-column prop="createTime" label="绑定时间" align="center" min-width="180px"></el-table-column>
                <el-table-column prop="relationship" label="关系" align="center" min-width="180px"></el-table-column>
                <el-table-column prop="commissionAmount" label="贡献收益" align="center" min-width="180px"></el-table-column>
                <el-table-column prop="countInvitePeople" label="团队人数" align="center" min-width="120px"></el-table-column>
                <el-table-column prop="commissionAmount" label="总返利" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <!-- <span @click="toOrderList(scope.row.id)">{{scope.row.commissionAmount | divideFilter}}</span> -->
                        <span>{{scope.row.commissionAmount | divideFilter}}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="120px" v-if="hasPermission('BTN_USER_MEG_OPERATION_SEE_DETAIL')">
                    <template slot-scope="scope">
                        <el-button plain type="primary" @click="operation(scope.row.id)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="filterData.pageNum"
                :page-size="filterData.pageSize"
                :page-sizes="[5, 10, 20, 50]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                class="pagination">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'teamOrderList',
        data() {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                userId: '',
                dataList: [],
                totalCount: 0,
                filterData: {
                    pageNum: 1,
                    pageSize: 10,
                    nickName: '',
                    mobile: '',
                    relationship: '',
                },
                commissionStatusList: [
                    {
                        value: 0,
                        label: '未返佣'
                    },
                    {
                        value: 1,
                        label: '已返佣'
                    }
                ],
                statusList: [
                    {
                        value: null,
                        label: '全部'
                    },
                    {
                        value: 1,
                        label: '未付款'
                    },
                    {
                        value: 2,
                        label: '未发货'
                    },
                    {
                        value: 3,
                        label: '已发货'
                    },
                    {
                        value: 4,
                        label: '订单完成'
                    },
                    {
                        value: 4,
                        label: '售后'
                    }
                ],
                relationshipList: [
                    {
                        value: 0,
                        label: '直属'
                    },
                    {
                        value: 1,
                        label: '间属'
                    }
                ],
                memberLevelList: [
                    {
                        value: null,
                        label: '全部'
                    },
                    {
                        value: 2,
                        label: 'SH'
                    },
                    {
                        value: 3,
                        label: 'PS'
                    },
                    {
                        value: 4,
                        label: 'AM'
                    },
                    {
                        value: 5,
                        label: 'AT'
                    }
                ],
                inputValue: ''
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
            search() {},
            reset() {
                this.$refs.teamOrderFilterForm.resetFields()
            },
            handleSizeChange () {},
            handleCurrentChange() {},
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
