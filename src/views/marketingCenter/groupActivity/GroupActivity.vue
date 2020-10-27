<template>
    <div class="app-container">
        <div class="filter-container">
            <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
                <el-tab-pane v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :name="item.shortCode">
                    <el-form ref="groupFilterForm" inline label-width="90px" :model="queryData">
                        <el-form-item label="商品名称：" class="filter-item" prop="productName">
                            <el-input placeholder="请输入商品名称或ID" size="medium" clearable v-model="queryData.productName" @keyup.enter.native="search"></el-input>
                        </el-form-item>
                        <span v-show="drop">
                            <el-form-item label="拼团ID：" class="filter-item" prop="serialId">
                                <el-input placeholder="请输入拼团ID" size="medium" clearable v-model="queryData.serialId" @keyup.enter.native="search"></el-input>
                            </el-form-item>
                            <el-form-item label="成团人数：" class="filter-item" prop="groupNum">
                                <el-input placeholder="成团人数" clearable size="medium" v-model="queryData.groupNum" @keyup.enter.native="search"></el-input>
                            </el-form-item>
                            <el-form-item label="创建时间：" class="filter-item" prop="createTimeList">
                                <el-date-picker v-model="queryData.createTimeList"
                                    size="medium"
                                    type="daterange"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :default-time="['00:00:00', '23:59:59']">
                                </el-date-picker>
                            </el-form-item>
                        </span>
                        <el-form-item label="拼团时间：" class="filter-item" prop="timeList">
                            <el-date-picker v-model="queryData.timeList"
                                 size="medium"
                                type="daterange"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>

                        </el-form-item>
                        <el-form-item class="filter-item" style="margin-left: 40px;">
                            <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                            <el-button icon="el-icon-refresh-left" type="primary" @click="resetSearch" size="medium">重置</el-button>
                            <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                                {{dropDownContent}}
                                <i :class="dropDownIcon"></i>
                            </el-link>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- <p>拼团活动：<el-switch v-model="groupActivityStatus" @change="updateGroupStatus"></el-switch></p> -->
        <subject-module ref="subjectModule" :countryCode="countryCode"
                        @on-select="handleSelectSubject" @on-refresh="handleRefresh" @on-edit="handleSubjectEdit" @on-remove="handleSubjectRemove"
                        @del-select="handleDeleteSelect"
                        >
        </subject-module>
        <div class="main-content-wrapper">
            <el-table border :data="tableData" 
                v-loading="loading" height="100%"
                @selection-change="handleSelectionChange"
            >
                <el-table-column fixed="left" type="selection" width="40"></el-table-column>
                <!-- <el-table-column prop="serialId" label="拼团ID" fixed align="center" min-width="130px"></el-table-column> -->
                <el-table-column prop="productId" label="商品ID" fixed align="center" min-width="130px"></el-table-column>
                <el-table-column prop="name" label="商品信息" fixed align="center" min-width="230px">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center">
                            <el-popover placement="top-start" trigger="hover">
                                <img :src="dealShowFileSrc(scope.row.images)" class="previewImage">
                                <img v-popover:popover :src="dealShowFileSrc(scope.row.images)"
                                     class="thumbnail"
                                     slot="reference">
                            </el-popover>
                            <span style="margin-left: 10px">{{scope.row.name}}</span>
                        </div>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="商品信息" align="center" min-width="260px">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center">
                            <el-popover
                                placement="top-start"
                                trigger="hover">
                                <img :src="dealShowFileSrc(scope.row.productCover)" class="previewImage">
                                <img :src="dealShowFileSrc(scope.row.productCover)" class="thumbnail" slot="reference">
                            </el-popover>
                            <el-tooltip class="item" effect="dark" :content="scope.row.productName" placement="top">
                                <span class="block-right"
                                      style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 3;-webkit-box-orient: vertical">
                                    {{scope.row.productName}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column> -->
                <el-table-column prop="vipPrice" label="VIP价格" align="center" width="110px"></el-table-column>
                <el-table-column prop="activityPrice" label="活动价" align="center" width="110px"></el-table-column>
                <el-table-column prop="groupNum" label="成团人数" align="center" width="100px"></el-table-column>
                <!-- <el-table-column prop="leaderDiscount" label="团长折扣" align="center" width="100px"></el-table-column> -->
                <!-- <el-table-column prop="specialDiscountStr" label="特殊折扣" align="center" width="100px"></el-table-column> -->
                <!-- <el-table-column prop="followDiscount" label="其他人折扣" align="center" width="120px"></el-table-column> -->
                <!-- <el-table-column prop="" label="用户分级" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <p>发团：<span v-if="scope.row.createGroupGrade">
                                    <span v-if="scope.row.createGroupGrade.type === 3">
                                        全量用户
                                    </span>
                                    <span v-if="scope.row.createGroupGrade.type === 1 || scope.row.createGroupGrade.type === 2">
                                        {{scope.row.createGroupGrade.gdesc}}
                                    </span>
                                </span>
                        </p>
                        <p>参团：<span v-if="scope.row.joinGroupGrade">
                                    <span v-if="scope.row.joinGroupGrade.type === 3">
                                        全量用户
                                    </span>
                                    <span v-if="scope.row.joinGroupGrade.type === 1 || scope.row.joinGroupGrade.type === 2">
                                        {{scope.row.joinGroupGrade.gdesc}}
                                    </span>
                                </span>
                        </p>
                    </template>
                </el-table-column> -->
                <el-table-column prop="" :label="'活动时间段('+ activeCountry + ')'" align="center" width="160px">
                    <template slot-scope="scope">
                        <p>{{scope.row.startTime | secondTimeFormat}}</p>
                        <p> ~ </p>
                        <p>{{scope.row.endTime | secondTimeFormat}}</p>
                    </template>
                </el-table-column>
                <el-table-column prop="validTimeOut" label="拼团有效时长(小时)" align="center" width="150px"></el-table-column>
                <el-table-column prop="payTimeOut" label="支付时间(小时)" align="center" width="120px"></el-table-column>
                <!-- <el-table-column prop="createTime" label="创建时间(北京)" align="center" width="200px">
                    <template slot-scope="scope">
                        {{scope.row.createTime | secondTimeFormat}}
                    </template>
                </el-table-column> -->
                <el-table-column v-if="!isTodayRecomend" prop="sort" label="排序" align="center" width="110px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sort" controls-position="right" :min="1" size="mini" style="width:80px"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="200px">
                     <template slot-scope="scope">
                        <el-button v-if="!isTodayRecomend" type="text" size="small" @click="saveGroupSort(scope.row)">
                            保存排序
                        </el-button>
                        <el-button type="text" size="small" @click="recommendGroup(scope.row)">
                            <span v-if="scope.row.recommend === '0'">推荐</span>
                            <span v-if="scope.row.recommend === '1'">取消推荐</span>
                        </el-button>
                        <el-button type="text" size="small" @click="editGroup(scope.row)">
                            编辑
                        </el-button>
                        <el-button v-if="!isTodayRecomend" type="text" size="small" @click="showDelGroupProduct(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
        </div>
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText"
            @on-cancle="cancleConfirm" @on-confirm="submitDel">
        </confirm-dialog>

        <group-activity-edit ref="groupActivityEdit" 
            :countryCode="countryCode"
            :dialogVisible="editVisible" :serialId="tempRow.serialId" @on-cancle="handleCancleEdit"  @on-confirm="handleConfrimEdit"></group-activity-edit>

    </div>
</template>

<script>
    import _ from 'lodash'
    import { productAttrGet } from '@/request/product'
    import { findPageList, saveSort, recommend , batchDelete, insertSubject, updateSubject, checkGroupStatus, updateGroupStatus } from '@/request/marketing'
    import SubjectModule from './components/SubjectModule'
    import ConfirmDialog from '@/components/ConfirmDialog'
    import GroupActivityEdit from './GroupActivityEdit'
    export default {
        // 拼团活动
        name: 'GroupActivity',
        data() {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                countryList: [],
                activeName: 'MY',
                countryCode: 'MY',
                activeCountry: '马来西亚',
                queryData: {
                    countryCode: '',
                    subjectSerilId: '',
                    serialId: '',
                    productName: '',
                    groupNum: '',
                    createStartTime: '',
                    createEndTime: '',
                    startTime: '',
                    endTime: '',
                    createTimeList: [],
                    timeList: [],
                    page: {
                        pageSize: 10,
                        pageNum: 1
                    }
                },
                total:0,
                loading: false,
                multipleSelection: [],
                tableData: [],
                productSelectVisible: false,
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                editVisible: false,
                tempRow: {},
                selectedSubject: {},
                isTodayRecomend: true,
                groupActivityStatus: true
            }
        },
        components: {
            SubjectModule,
            ConfirmDialog,
            GroupActivityEdit
        },
        created() {
            this.countryList = JSON.parse(this.getStore('countryList'))
        },
        mounted() {
            this.checkGroupStatus()
            this.$refs.subjectModule.getAllSubjects()
            this.getGroupList()
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
            handleTabClick(tab, event) {
                this.activeCountry = tab.label
                this.countryCode = tab.name
                this.multipleSelection = []
                setTimeout(() => {
                    this.checkGroupStatus()
                    this.$refs.subjectModule.getAllSubjects()
                    this.getGroupList()
                }, 100)
            },
            search() {
                this.getGroupList()
            },
            resetSearch() {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                _.forEach(this.countryList, (item, index) => {
                    this.$refs.groupFilterForm[index].resetFields()
                })
                this.getGroupList()
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val
                this.getGroupList()
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getGroupList()
            },
            showDelGroupProduct(row) {
                this.tempRow = row
                this.confirmDialogTitle = '确定删除该拼团商品?'
                this.confirmDialogText = '删除后将无法恢复?'
                this.confirmVisible = true
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
            },
            handleDeleteSelect () {
                if (!this.multipleSelection.length) {
                    this.$message('请先勾选您需操作的选项')
                    return
                }
                this.$confirm('确定删除选中的拼团商品？删除后将无法恢复', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        itemSerialId: this.multipleSelection.map(item => item.serialId)
                    }
                    batchDelete(params).then(res => {
                        if (res.ret.errcode === 1) {
                            this.confirmVisible = false
                            this.$message.success('删除成功！')
                            this.getGroupList()
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                })
            },
            cancleConfirm() {
                this.confirmVisible = false
            },
            submitDel() {
                let params = {
                    itemSerialId: [this.tempRow.serialId]
                }
                batchDelete(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.confirmVisible = false
                        this.$message.success('删除成功！')
                        this.getGroupList()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            handleSelectSubject(item) {
                this.selectedSubject = item
                if (item.serialId === '1') {
                    this.isTodayRecomend = true
                } else {
                    this.isTodayRecomend = false
                }
                this.multipleSelection = []
                this.getGroupList()
            },
            handleSubjectEdit(subjectInfo) {
                console.log(subjectInfo)
            },
            handleSubjectRemove(subjectInfo) {

            },
            getGroupList() {
                let params = {}
                let serialId = ''
                if (this.selectedSubject.serialId != '1') {
                    serialId = this.selectedSubject.serialId
                }
                params = this.queryData
                params.countryCode = this.countryCode,
                params.subjectSerialId = serialId

                params.startTime = params.timeList ? params.timeList[0] : null
                params.endTime =  params.timeList ? params.timeList[1] : null
                params.createStartTime = params.createTimeList ? params.createTimeList[0] : null
                params.createEndTime =  params.createTimeList ? params.createTimeList[1] : null

                findPageList(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        _.forEach(res.groupListVo, row => {
                            if (row.specialDiscount) {
                                let specialDiscountStr = []
                                _.forEach(row.specialDiscount, item => {
                                    specialDiscountStr.push(item.discount)

                                })
                                row.specialDiscountStr = specialDiscountStr.join(',')
                            }
                        })
                        this.tableData = res.groupListVo
                        this.total = res.total
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            saveGroupSort(row) {
                let params = {
                    itemSerialId: row.serialId,
                    sort: row.sort
                }
                saveSort(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.getGroupList()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            recommendGroup(row) {
                let params = {
                    itemSerialId: row.serialId
                }
                recommend(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('操作成功')
                        this.getGroupList()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            handleRefresh() {
                this.getGroupList()
            },
            editGroup(row) {
                this.editVisible = true
                this.tempRow = row
            },
            handleCancleEdit() {
                this.editVisible = false
            },
            handleConfrimEdit() {
                this.editVisible = false
                this.getGroupList()
            },
            checkGroupStatus() {
                let params = {
                    countryCode: this.activeName
                }
                checkGroupStatus(params).then(res => {
                    if (res.ret.errcode === 1) {
                        if (res.status === 1) {
                            this.groupActivityStatus = true
                        } else {
                            this.groupActivityStatus = false
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            updateGroupStatus() {
                let params = {
                    countryCode: this.activeName
                }
                updateGroupStatus(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('状态更新成功')
                        this.checkGroupStatus()
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        }
    }
</script>



<style lang="scss" scoped>

</style>

