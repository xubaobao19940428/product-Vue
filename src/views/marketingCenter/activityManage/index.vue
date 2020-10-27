<template>
    <div class="app-container">
        <div class="main-content-tab-box">
            <div class="tab-l">
                <el-tabs v-model="activeName" @tab-click="getList(1)">
                    <el-tab-pane label="全部" name="0"></el-tab-pane>
                    <el-tab-pane v-for="(item, key) in activeStatusEnum" :key="key" :label="item" :name="key"></el-tab-pane>
                </el-tabs>
            </div>
            <div class="tab-r">
                <el-button v-if="hasPermission('BTN_ACTIVITY_MANAGE_ADD')" @click="editDialogAction('add')" icon="el-icon-plus" type="primary" size="small" >新建</el-button>
            </div>
        </div>
        <el-collapse-transition>
            <el-form inline label-width="90px">
                <el-form-item label="活动ID：">
                    <el-input placeholder="请输入活动ID" size="medium" v-model="param.activeId"></el-input>
                </el-form-item>
                <el-form-item label="活动时间：">
                    <el-date-picker type="daterange" value-format="timestamp"
                                    start-placeholder="开始时间" end-placeholder="结束时间"
                                    v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <span v-show="drop">
                    <el-form-item label="活动名称：">
                        <el-input placeholder="请输入活动名称" size="medium" v-model="param.activeName"></el-input>
                    </el-form-item>
                    <el-form-item label="国家：">
                        <el-select v-model="param.countryCode" clearable placeholder="请选择" size="medium">
                            <el-option v-for="(item, index) in countryList"
                                        :key="index"
                                        :label="item.nameEn + '/' + item.nameCn "
                                        :value="item.shortCode"></el-option>
                        </el-select>
                    </el-form-item>
                </span>
                <el-form-item class="filter-item" style="margin-left: 20px">
                    <el-button type="primary" size="medium"
                                icon="el-icon-search"
                            @click="getList(1)">搜索
                    </el-button>
                    <el-button size="medium"
                                icon="el-icon-refresh-left"
                            @click="resetSearch">重置
                    </el-button>
                    <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link>
                </el-form-item>
            </el-form>
        </el-collapse-transition>
        <div class="main-content-wrapper">
            <el-table border
                      height="100%"
                      :data="dataList">
                <el-table-column label="活动ID" prop="activeId" header-align="center" min-width="180px"></el-table-column>
                <el-table-column label="活动名称" prop="activeName" header-align="center" min-width="180px"></el-table-column>
                <el-table-column label="国家" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="活动类型" min-width="180px" align="center">
                    <template slot-scope="scope">
                        <div>{{ activeTypeEnum[scope.row.activeType] }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" align="center" min-width="180px">
                    <template slot-scope="scope">
                       {{ scope.row.startTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{ scope.row.endTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ activeStatusEnum[scope.row.activeStatus] }}
                    </template>
                </el-table-column>
                <el-table-column label="更新人" prop="operationName" min-width="100px" header-align="center"></el-table-column>
                <el-table-column label="更新时间" min-width="180px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="180px">
                    <template slot-scope="scope">
                        <el-button v-if="hasPermission('BTN_TO_ACTIVITY_PRODUCT')"  @click="triggerToActivityProduct(scope.row)"  type="text" size="mini">商品</el-button>
                        <el-button v-if="hasPermission('BTN_ACTIVITY_LABEL')"       @click="showActivityLabel(scope.row)"  type="text" size="mini">分组</el-button>
                        <el-button v-if="hasPermission('BTN_ACTIVITY_MANAGE_COPY')" @click="editDialogAction('copy', scope.row)"  type="text" size="mini">复制</el-button>
                        <el-button v-if="hasPermission('BTN_ACTIVITY_MANAGE_EDIT')" @click="editDialogAction('edit', scope.row)"   type="text" size="mini">编辑</el-button>
                        <el-button v-if="hasPermission('BTN_ACTIVITY_REPORT')" @click="reportAction(scope.row)"   type="text" size="mini">报名</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="getList"
                           :current-page="param.page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="param.page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
        <activity-edit
            :propShowDialog="editDialogShow"
            :activeCrowdTypeArray="activeCrowdTypeArray"
            :activeTypeArray="activeTypeArray"
            :propParam="editDialogParam" @confirm="confirmAddItem" @close="editDialogShow = false"></activity-edit>
        <activity-label :propShowDialog="labelDialog.show" :propParam="labelDialog.param" @confirm="confirmAddItem" @close="labelDialog.show = false"></activity-label>
        <activity-product-sort :propShowDialog="proSortDialog.show" :propParam="proSortDialog.param" @confirm="proSortDialog.show = false" @close="proSortDialog.show = false"></activity-product-sort>
    </div>
</template>
<script>
    import activityEdit from './components/activityEdit'
    import activityLabel from './components/activityLabelEdit'
    import activityProductSort from './components/activityProductSort'
    import { listActive, listActiveGroup, listActiveAllProduct } from '@/request/marketing.js'
    import common from '../common/common'
    export default {
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                param: {
                    activeId: '',
                    activeName: '',
                    countryCode: '',
                    activeStatus: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                showSearchParam: false,
                activeName: '0',
                totals: 0,
                activeStatusEnum: {
                    1: '预热中',
                    2: '进行中',
                    3: '已结束',
                    4: '未开始'
                },
                dataList: [],
                timeList: [],
                editDialogShow: false,
                editDialogParam: {},
                labelDialog: {
                    show: false,
                    param: {}
                },
                proSortDialog: {
                    show: false,
                    param: {}
                }
            }
        },
        mixins: [common],
        components: {
            activityEdit,
            activityLabel,
            activityProductSort
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        created () {
            this.getList()
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
            triggerToActivityProduct (data) {
                listActiveAllProduct({
                    activeId: data.activeId
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.proSortDialog.param = { productLabel: res.activeProductGroupLabel, activeId: data.activeId }
                        this.proSortDialog.show = true
                    }
                })
            },
            getLabel (data, callBack) {
                listActiveGroup({
                    activeId: data.activeId
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        callBack && callBack(res)
                    }
                })
            },
            showActivityLabel (data) {
                this.getLabel(data, (res) => {
                    this.labelDialog.param = { groupInfo: res.groupInfo, activeId: data.activeId }
                    this.labelDialog.show = true
                })
            },
            resetSearch () {
                this.param = {
                    activeId: '',
                    activeName: '',
                    countryCode: '',
                    activeStatus: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
                this.timeList = []
            },
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList(1)
            },
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                this.timeList = this.timeList ? this.timeList : []
                this.param.activeStatus = this.activeName
                listActive(this.filterData(Object.assign(this.param, {
                    startTime: !this.timeList[0] ? null : this.timeList[0],
                    endTime: !this.timeList[1] ? null : this.timeList[1]
                }))).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.activeInfo
                        this.totals = res.total
                    }
                })
            },
            editDialogAction (type, data) {
                this.editDialogParam = {}
                switch (type) {
                    case 'add':
                        this.editDialogShow = true
                        break
                    case 'edit':
                        this.editDialogParam = JSON.parse(JSON.stringify(data))
                        // console.log(this.editDialogParam)
                        this.editDialogShow = true
                        break
                    case 'copy':
                        this.editDialogParam = JSON.parse(JSON.stringify(data))
                        this.editDialogParam.activeId = null
                        this.getLabel(data, (res) => {
                            Object.assign(this.editDialogParam, {
                                groupInfo: res.groupInfo
                            })
                            this.editDialogShow = true
                        })
                        break
                }
            },
            reportAction (data) {
                console.log(data)
                this.$router.push({
                    name: 'activityReport',
                    query: {
                        title: data.activeName,
                        country: data.countryCode,
                        activeId: data.activeId,
                        preheat: data.preheat
                    }
                })
            },
            confirmAddItem () {
                this.editDialogShow = false
                this.labelDialog.show = false
                this.getList()
            }
        }
    }
</script>
<style lang="scss" scoped></style>
