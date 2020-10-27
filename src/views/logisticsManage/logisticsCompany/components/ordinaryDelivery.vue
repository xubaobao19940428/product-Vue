<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="inventoryFlowFilterForm" inline label-width="100px" :model="queryData">
                <el-form-item label="物流公司名称：">
                    <el-input v-model="queryData.companyName" size="medium" placeholder="请输入" ></el-input>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-button icon="el-icon-plus" type="primary" @click="addressEdit('add')" size="medium"  v-if="hasPermission('BTN_ADDRESS_ADD_ORDINARYDELIVERY') ">新增物流公司</el-button>
                </el-form-item>
            </el-form>
            <el-tabs v-model="queryData.countryCode"
                     @tab-click="search()"
                     style="margin-left: 20px">
                <el-tab-pane label="全部" name="all"></el-tab-pane>
                <el-tab-pane v-for="item in countryList"
                             :key="item.shortCode"
                             :name="item.shortCode"
                             :label="item.nameLocal"
                             :value="item.shortCode"></el-tab-pane>
            </el-tabs>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="dataList" border v-loading="loading" height="100%" style="width: 100%">
                <el-table-column prop="companyName" min-width="150px" align="center"  label="物流公司"> </el-table-column>
                <el-table-column label="国家"  align="center" min-width="130px">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="物流公司代码" prop="logiCompany" align="center"   min-width="180px"></el-table-column>
                <el-table-column label="合作状态" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{ cooperateStatus[scope.row.cooperateStatus] }}
                    </template>
                </el-table-column>
                <el-table-column label="最后修改时间" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="100px" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="hasPermission('BTN_ADDRESS_EDIT_ORDINARYDELIVERY') " type="text" size="mini" @click="addressEdit('edit',scope.row)">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :current-page="queryData.page.pageNum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>
        <switch-edit :dialogVisible="dialog.show" :countryList="countryList" :propParam="dialog.param"  :disableding="disableding" @close="closeEditDialog" @confirm="confirmEditItem"></switch-edit>
    </div>
</template>
<script>
    import switchEdit from './editOrdinaryShip'
    import { getLogiCompanyList } from '@/request/logi'
    export default {
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            langList () {
                return this.$store.state.dict.languageList
            }
        },
        components: {
            switchEdit
        },
        data () {
            return {
                disableding: true,
                cooperateStatus: {
                    1: '正常合作',
                    2: '终止合作',
                    9: '黑名单'
                },
                dialog: {
                    show: false,
                    addressShow: false,
                    PostcodeShow: false,
                    param: {}
                },
                queryData: {
                    companyName: '',
                    countryCode: 'all',
                    type: 2,
                    page: {
                        pageNum: 1,
                        pageSize: 20,
                        pagingSwitch: true
                    }
                },
                distributionPostcode: '',
                loading: false,
                total: 0,
                warehouseList: [],
                inventoryRecordTypeList: [],
                dataList: []
            }
        },
        created () {
        },
        mounted () {
            this.getPageList()
        },
        methods: {
            /**
             * 修改
             */
            addressEdit (type, data) {
                this.dialog.param = {}
                if (type == 'edit') {
                    this.disableding = false
                    Object.assign(this.dialog.param, data)
                    Object.assign(this.dialog.param, {
                        title: '修改物流公司'
                    })
                } else if (type == 'add') {
                    this.disableding = false
                    Object.assign(this.dialog.param, {
                        title: '新增物流公司'
                    })
                }
                this.dialog.show = true
            },
            /**
             * 获取列表
             */
            getPageList () {
                this.loading = true
                let param = {}
                param = JSON.parse(JSON.stringify(this.queryData))
                if (param.countryCode == 'all') {
                    param.countryCode = ''
                }
                getLogiCompanyList(this.filterData(param)).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.dataList = res.logiCompany
                        this.total = res.total
                    }
                }).catch(err => {
                    this.loading = false
                    console.log(err)
                })
            },
            // 分页
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getPageList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val
                this.getPageList()
            },
            search () {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.getPageList()
            },
            resetSearch () {
                this.queryData.companyName = ''
                this.getPageList()
            },
            closeEditDialog () {
                this.dialog.show = false
            },
            confirmEditItem () {
                this.dialog.show = false
                this.getPageList()
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
