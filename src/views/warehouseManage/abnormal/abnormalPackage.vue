<template>
    <div class="app-container">
        <el-form ref="abnormalFilterForm" inline :model="queryData">
            <el-form-item label="异常编号：" class="filter-item">
                <el-input v-model="queryData.abnormalNo" clearable placeholder="请输入" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="物流单号：" class="filter-item" prop="logiCode">
                <el-input v-model="queryData.logiCode" clearable placeholder="请输入物流单号" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="处理状态：" class="filter-item" prop="abnormalStatus">
                <el-select v-model="queryData.abnormalStatus" clearable size="medium">
                    <el-option v-for="item in abnormalStatusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类目分组：" class="filter-item" prop="groupId">
                <el-select v-model="queryData.groupId" clearable size="medium">
                <el-option
                    v-for="(item,index) in groupNameList"
                    :key="index"
                    :label="item.groupName"
                    :value="item.groupId"
                    ></el-option>
                </el-select>
            </el-form-item>
            <span v-show="drop">
                 <el-form-item label="异常类型：" class="filter-item" prop="abnormalReason">
                <el-select v-model="queryData.abnormalReason" clearable size="medium">
                    <el-option v-for="item in packageAbnormalTypeList" :key="item.type" :label="item.remark" :value="item.type"></el-option>
                </el-select>
            </el-form-item>
<!--                 <el-form-item label="仓库编号：" class="filter-item">-->
<!--                     <el-input v-model="queryData.warehouseNo" clearable placeholder="请输入" size="medium"></el-input>-->
<!--                 </el-form-item>-->
                <el-form-item label="记录时间：" class="filter-item" prop="timeList">
                    <el-date-picker
                        value-format="yyyy-MM-dd HH:mm:ss"
                        v-model="queryData.timeList"
                        type="daterange"
                        size="medium"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
            </span>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="getAbnormalLogiList(1)" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                <el-button   v-if="hasPermission('BTN_WAREHOUSE_EXPORT_ABNORMAL_PACKAGE')" :loading="exportLoading" icon="el-icon-download" type="primary" size="medium" @click="exportAbnormal">
                    导出异常
                </el-button>
                <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                    {{dropDownContent}}
                    <i :class="dropDownIcon"></i>
                </el-link>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-table :data="packageDataList" border height="100%">
                <el-table-column prop="abnormalNo" align="center" fixed="left" min-width="200px" label="异常编号">
                </el-table-column>
                <el-table-column prop="logiCode" label="物流单号" align="center" min-width="200px">
                </el-table-column>
                <el-table-column label="异常类型" prop="abnormalReason" align="center" min-width="150px">
                </el-table-column>
                <el-table-column label="现场照片" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <div class="list-img-box" v-for="(url, i) in formatImg(scope.row.imgs)"
                             @click="previewImg(formatImg(scope.row.imgs), 0)" v-if="i == 0"
                             :key="i">
                            <img :src="dealShowFileSrc(url)"/>
                            <span>{{ formatImg(scope.row.imgs).length }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="采购处理状态" align="center" min-width="150px">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.abnormalStatus  === 1"  size="mini"  close-transition>
                            处理中
                        </el-tag>
                        <el-tag v-if="scope.row.abnormalStatus === 2" type="danger" size="mini" close-transition>
                            待处理
                        </el-tag>
                        <el-tag v-if="scope.row.abnormalStatus === 8" type="warning" size="mini" close-transition>
                            已完结
                        </el-tag>
                    </template>
                </el-table-column>
                 <el-table-column prop="userName" align="center" label="类目分组" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.purGroupName}}
                    </template>
                </el-table-column>
                <el-table-column prop="userName" align="center" label="创建人" width="140px">
                    <template slot-scope="scope">
                        {{scope.row.userName || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="dealUserName" align="center" min-width="150px" label="处理人">
                    <template slot-scope="scope">
                        {{ scope.row.dealUserName || '-' }}
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" min-width="180" align="center" label="记录时间">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | secondTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="140px">
                    <template slot-scope="scope">
                        <div class="order-btn-box">
                            <el-button v-if="hasPermission('BTN_WAREHOUSE_TRANS_PACKAGE') &&  (scope.row.abnormalStatus == 1 )"
                                       type="text" size="mini" v-preventReClick="500"
                                       @click="showDealDialog(scope.row, 'edit')">添加备注
                            </el-button>
                            <el-button v-if="(scope.row.abnormalStatus == 1 ) && hasPermission('BTN_ABNORMAL_ORDER_OVER_PACKAGE')"
                                       type="text" size="mini" v-preventReClick="500"
                                       @click="confirmOverAbnormal(scope.row)">确认完结
                            </el-button>
                            <el-button v-if="hasPermission('BTN_ABNORMAL_ORDER_PACKAGE') &&  scope.row.abnormalStatus != 2"
                                       type="text" size="mini" v-preventReClick="500"
                                       @click="showDealDialog(scope.row, 'detail')">查看详情
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @size-change="handleSizeChanges"
                @current-change="getAbnormalLogiList"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                :page-sizes="[10, 20, 30, 50]"
                layout="total, sizes, prev, pager, next"
                :total="totals">
            </el-pagination>
        </div>
        <image-preview v-show="image.show" :close="closePreview" :index="image.index" :list="image.list"></image-preview>
        <deal-package-dialog :propShowDialog="dialog.show" :dealType="dialog.type" :propParam="dialog.param" @close="dialog.show = false" @confirm="confirmDealPackage"></deal-package-dialog>
    </div>
</template>

<script>
    import { abnormalLogiPage, signAbnormalType, AbnormalProcess, OverAbnormal, ExportAbnormalLogi, ExportAbnormalSku } from '@/request/warehouse'
    import imagePreview from '@/components/imagePreview'
    import dealPackageDialog from './components/dealPackageDialog'
    import { PurCateGroupSelect } from "@/request/purchase";
    export default {
        data () {
            return {
                exportLoading: false,
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                activeName: 'abnormalPackage',
                abnormalStatusList: [
                    {
                        value: 1,
                        label: '处理中'
                    }, {
                        value: 2,
                        label: '待处理'
                    }, {
                        value: 8,
                        label: '已完结'
                    }
                ],
                packageAbnormalTypeList: [],
                queryData: {
                    logiCode: '',
                    skuCode: '',
                    abnormalReason: '',
                    abnormalStatus: '',
                    startTime: '',
                    endTime: '',
                    timeList: [],
                    warehouseNo: '',
                    abnormalNo: '',
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    },
                    groupId:''
                },
                totals: 0,
                packageDataList: [],
                image: {
                    show: false,
                    index: 0,
                    list: []
                },
                dialog: {
                    show: false,
                    type: 'edit',
                    param: {
                        logiCode: '',
                        abnormalNo: '',
                        abnormalReason: '',
                        content: '',
                        process: []
                    }
                },
                groupNameList: []
            }
        },
        components: {
            imagePreview,
            dealPackageDialog
        },
        computed: {
            nowEndDate () {
                return this.$store.state.globalNum.nowEndDate
            },
            lastMonthDate () {
                return this.$store.state.globalNum.lastMonthDate
            }
        },
        created () {
            this.queryData.timeList = [this.lastMonthDate, this.nowEndDate]
            this.getAbnormalLogiList()
            this.getPackageAbnormalTypeList()
            this.getPurCateGroupSelect()
        },
        methods: {
            //获取全部分组信息
                getPurCateGroupSelect() {
                PurCateGroupSelect({}).then(res => {
                    if (res.ret.errcode == 1) {
                    this.groupNameList = res.groupList;
                    }
                     this.groupNameList.unshift({
                        groupName:'无对应类目',
                        groupId:"0",
                    })
                });
                },
            // 导出异常
            exportAbnormal () {
                this.exportLoading = true
                let params = this.queryData
                params.startTime = params.timeList ? params.timeList[0] : null
                params.endTime = params.timeList ? params.timeList[1] : null
                ExportAbnormalLogi(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.exportLoading = false
                        let fileUrl = res.fileUrl
                        window.open(this.dealShowFileSrc(fileUrl))
                    } else {
                        this.exportLoading = false
                        this.$message.error(res.message)
                    }
                }).catch(err => {
                    this.exportLoading = false
                    console.log(err)
                })
            },
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
            handleSizeChanges (val) {
                this.queryData.page.pageSize = val
                this.getAbnormalLogiList()
            },
            resetSearch () {
                this.queryData = {
                    logiCode: '',
                    skuCode: '',
                    abnormalReason: '',
                    abnormalStatus: '',
                    startTime: '',
                    endTime: '',
                    timeList: [],
                    warehouseNo: '',
                    abnormalNo: '',
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                }
            },
            formatImg (imgStr) {
                if (imgStr) {
                    return imgStr.split(',')
                }
                return []
            },
            closePreview () {
                this.image.index = 0
                this.image.show = false
            },
            previewImg (imgs, i) {
                this.image.list = imgs
                this.image.index = i
                this.image.show = true
            },
            // 异常类型
            getPackageAbnormalTypeList () {
                signAbnormalType().then((res) => {
                    if (res.ret.errcode === 1) {
                        this.packageAbnormalTypeList = res.type
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 异常包裹
            getAbnormalLogiList (page) {
                this.queryData.page.pageNum = page ? page : this.queryData.page.pageNum
                let params = this.queryData
                params.startTime = params.timeList ? params.timeList[0] : null
                params.endTime = params.timeList ? params.timeList[1] : null
                abnormalLogiPage(this.filterData(params)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.totals = res.total
                        this.packageDataList = res.list
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
            showDealDialog (data, type) {
                this.dialog.param.logiCode = data.logiCode
                this.dialog.param.abnormalNo = data.abnormalNo
                this.dialog.param.abnormalReason = data.abnormalReason
                AbnormalProcess({
                    abnormalNo: data.abnormalNo
                }).then((res) => {
                    if (res.ret.errcode == 1) {
                        this.dialog.param.process = res.process
                    }
                })
                this.dialog.type = type
                this.dialog.show = true
            },
            confirmDealPackage () {
                this.getAbnormalLogiList()
                this.dialog.show = false
            },
            // 确认完结
            confirmOverAbnormal (data) {
                this.$confirm('请与采购确认异常已被处理，确认完结后，无法再发起补单', '确认对此异常单据完结么？', {
                    confirmButtonText: '完结',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    OverAbnormal({
                        abnormalNo: data.abnormalNo,
                        type: 2 // 1.采购 2.仓库
                    }).then((res) => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('成功')
                            this.getAbnormalLogiList()
                        }
                    })
                }).catch(() => {})
            }
        }
    }
</script>

<style lang="scss">
</style>
