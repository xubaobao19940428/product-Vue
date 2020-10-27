<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form inline label-width="90px">
                <el-form-item label="用户ID：" class="filter-item">
                    <el-input type="number" placeholder="请输入用户id" size="medium" clearable v-model="queryData.userId" maxlength=12 @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="昵称：" class="filter-item">
                    <el-input placeholder="请输入昵称" size="medium" clearable v-model="queryData.nickName" @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="注册时间：" class="filter-item">
                    <el-date-picker value-format="timestamp" v-model="timeList"
                                    type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"
                                    :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="邀请码：" class="filter-item">
                    <el-input placeholder="请输入邀请码" size="medium" clearable v-model="queryData.inviteCode" maxlength=6 @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" class="filter-item">
                    <el-input type="number" placeholder="请输入手机号" clearable size="medium" v-model="queryData.mobile" maxlength=12 @keyup.enter.native="search"></el-input>
                </el-form-item>
                <span v-show="drop">
                    <el-form-item label="等级：" class="filter-item">
                        <el-select size="medium" clearable v-model="queryData.memberLevel" placeholder="请选择">
                            <el-option v-for="item in memberLevelList" :key="item.label" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item>
                     <el-form-item label="用户国家：">
                    <el-select v-model="queryData.countryCode" clearable placeholder="请选择" size="medium">
                        <el-option v-for="(item, index) in countryList"
                                   :key="index"
                                   :label="item.nameEn + '/' + item.nameCn "
                                   :value="item.shortCode"></el-option>
                        <el-option label="印尼" value="ID"></el-option>
                    </el-select>
                </el-form-item>
                    <el-form-item label="上级id：" class="filter-item">
                        <el-input placeholder="请输入上级id" size="medium" clearable v-model="queryData.parentId" maxlength=12 @keyup.enter.native="search"></el-input>
                    </el-form-item>
                </span>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search"  type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link>
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-table border height="100%" :data="dataList" v-loading="loading">
                <el-table-column fixed prop="userId" label="用户ID" align="center" min-width="90px"></el-table-column>
                <el-table-column fixed prop="nickName" label="昵称" align="center" min-width="120px"></el-table-column>
                <el-table-column prop="mobile" label="手机号" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <span>{{scope.row.mobile || '-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="inviteCode" label="邀请码" align="center" min-width="100px"></el-table-column>
                <el-table-column label="用户等级" align="center" width="80px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.memberLevel === 2"  size="mini"  close-transition>
                            {{memberLevel[scope.row.memberLevel]}}
                        </el-tag>
                        <el-tag v-if="scope.row.memberLevel === 3" type="success" size="mini" close-transition>
                            {{memberLevel[scope.row.memberLevel]}}
                        </el-tag>
                        <el-tag v-if="scope.row.memberLevel === 4" type="warning" size="mini" close-transition>
                            {{memberLevel[scope.row.memberLevel]}}
                        </el-tag>
                        <el-tag v-if="scope.row.memberLevel === 5" type="danger" size="mini" close-transition>
                            {{memberLevel[scope.row.memberLevel]}}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="countryCode" label="国家" align="center" min-width="150px">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <!-- <el-table-column prop="countInvitePeople" label="团队人数" align="center" min-width="100px"></el-table-column> -->
<!--                <el-table-column prop="commissionAmount" label="总返利" align="center" min-width="120px">-->
<!--                    <template slot-scope="scope">-->
<!--                        <span>{{scope.row.commissionAmount | divideFilter}}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column prop="createTime" label="注册时间" align="center" min-width="170px">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | secondTimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="邀请时间" align="center" min-width="170px">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | secondTimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="memberTime" label="成为会员时间" align="center" min-width="170px">
                    <template slot-scope="scope">
                        <span>{{scope.row.memberTime | secondTimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="inviteTime" label="绑定时间" align="center" min-width="170px">
                    <template slot-scope="scope">
                        <span>{{scope.row.inviteTime | secondTimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="parentId" label="上级id" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <span>{{scope.row.parentId || '-'}}</span>
                    </template>
                </el-table-column>
<!--                <el-table-column prop="parentNickName" label="上级昵称" align="center" min-width="120px">-->
<!--                    <template slot-scope="scope">-->
<!--                        <span>{{scope.row.parentNickName || '-'}}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
<!--                <el-table-column prop="parentMobile" label="上级手机号" align="center" min-width="150px">-->
<!--                    <template slot-scope="scope">-->
<!--                        <span>{{scope.row.parentMobile || '-'}}</span>-->
<!--                    </template>-->
<!--                </el-table-column>-->
                <el-table-column fixed="right" label="操作" align="center" min-width="90px" v-if="hasPermission('BTN_USER_MEG_OPERATION_SEE_DETAIL')">
                    <template slot-scope="scope">
                        <router-link target="_blank" :to="{ name:'memberInfo',query:{ userId: scope.row.userId }}">
                            <el-button type="text" size="mini">详情</el-button>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[20, 50, 100]"
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
    import { listUserByPage } from '@/request/user'
    import { mapState } from 'vuex'
    export default {
        name: 'memberManager',
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                dataList: [],
                adminGrade: '',
                total: 0,
                queryData: {
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    },
                    nickName: '',
                    memberLevel: '',
                    mobile: '',
                    userId: '',
                    inviteCode: '',
                    parentId: '',
                    parentNickName: '',
                    parentMobile: '',
                    countryCode: ''
                },
                totals: 0,
                inputValue: '',
                timeList: []
            }
        },
        computed: {
            ...mapState({
                memberLevel: state => state.dict.memberLevel,
                memberLevelList: state => state.dict.memberLevelList,
            }),
            nowEndDate () {
                return this.$store.state.globalNum.nowEnd
            },
            countryList () {
                return this.$store.state.dict.countryList
            },
            nowEnd () {
                return this.$store.state.globalNum.nowEnd
            },
            lastWeek () {
                return this.$store.state.globalNum.lastWeek
            }
        },
        created() {
            this.timeList = [this.lastWeek, this.nowEnd]
            this.queryData.userId = this.$route.query.userId ? this.$route.query.userId : ''
            this.getUserList()
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
            showInput(index) {
                this.dataList[index].editFlg = true
                this.inputValue = JSON.parse(JSON.stringify(this.dataList[index].operatingContent))
                this.$nextTick(() => {
                    this.$refs.saveTagInput.$refs.input.focus()
                })
            },
            getUserList() {
                this.loading = true
                let params = this.filterData(this.queryData)
                this.timeList = this.timeList ? this.timeList : []
                params.startTime =  !this.timeList[0] ? null : this.timeList[0]+'',
                params.endTime = !this.timeList[1] ? null : this.timeList[1]+''
                listUserByPage(this.filterData(params)).then((response) => {
                    let data = response
                    this.dataList = data.userManagePb
                    this.total = data.total
                    this.loading = false
                }).catch((err) => {
                    this.loading = false
                    console.error(err)
                })
            },
            search() {
                this.queryData.page.pageNum = 1
                this.getUserList()
            },
            resetSearch() {
                this.queryData = {
                    page : {
                        pageNum: 1,
                        pageSize: 20,
                    },
                    userId: '',
                    nickName: '',
                    mobile: '',
                    inviteCode: '',
                    memberLevel: '',
                    parentId: '',
                    parentNickName: '',
                    parentMobile: '',
                    countryCode: ''
                }
                this.timeList = []
                this.getUserList()
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getUserList()
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val
                this.getUserList()
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
