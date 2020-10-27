<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="inventoryFlowFilterForm" inline label-width="150px" :model="queryData">
                <el-form-item label="主要语言State：">
                    <el-input v-model="queryData.state" clearable placeholder="请输入主要语言State" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                 <el-form-item label="辅助语言State：">
                    <el-input v-model="queryData.stateEn" clearable placeholder="请输入辅助语言State" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                <span v-show="drop">
                      <el-form-item prop="skuCode" label="主要语言City：">
                    <el-input v-model="queryData.city" clearable placeholder="请输入主要语言City" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                 <el-form-item label="辅助语言City：">
                    <el-input v-model="queryData.cityEn" clearable placeholder="请输入辅助语言City" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                 <el-form-item label="地区（Area）：" >
                    <el-input v-model="queryData.area" clearable placeholder="请输入地区（Area）" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                 <el-form-item label="邮编（PostCode）：" >
                    <el-input v-model="queryData.postcode" clearable placeholder="请输入邮编（PostCode）" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                 <el-form-item label="上级邮编：">
                    <el-input v-model="queryData.superiorPostcode" clearable placeholder="请输入上级邮编" size="medium" @keyup.enter.native="search()"></el-input>
                </el-form-item>
                </span>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <el-button icon="el-icon-plus" type="primary" @click="addressEdit('add')" size="medium" v-if=" hasPermission('BTN_ADDRESS_ADD_PLATFORM') ">新增邮编</el-button>
                    <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                        {{dropDownContent}}
                        <i :class="dropDownIcon"></i>
                    </el-link>
                </el-form-item>
            </el-form>
            <el-tabs v-model="queryData.countryCode"
                     @tab-click="search()"
                     style="margin-left: 20px">
                <el-tab-pane label="全部" name="all"></el-tab-pane>
                <el-tab-pane v-for="item in countryList"
                             :key="item.code"
                             :label="item.nameLocal"
                             :name="item.shortCode"
                ></el-tab-pane>
            </el-tabs>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="dataList" border v-loading="loading" height="100%" style="width: 100%">
                <el-table-column label="国家名称" fixed="left" align="center" min-width="130px">
                <template slot-scope="scope">
                    {{ scope.row.countryCode | countryFilter }}
                </template>
            </el-table-column>
                <el-table-column label="国家代码" prop="countryCode" align="center" min-width="180px">
                </el-table-column>
                <el-table-column label="主要语言State" prop="state" align="center" min-width="180px">
                </el-table-column>
                <el-table-column label="辅助语言State" prop="stateEn" align="center" min-width="180px">
                </el-table-column>
                <el-table-column label="主要语言City" prop="city" align="center" min-width="180px">
                </el-table-column>
                <el-table-column label="辅助语言City" prop="cityEn" align="center" min-width="180px">
                </el-table-column>
                <el-table-column label="地区（Area）" prop="area" align="center" min-width="180px">
                </el-table-column>
                <el-table-column label="邮编（PostCode）" prop="postcode" align="center" min-width="180px">
                </el-table-column>
                <el-table-column label="上级邮编" prop="superiorPostcode" align="center" min-width="180px">
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="100px" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if=" hasPermission('BTN_ADDRESS_EDIT_PLATFORM') " type="text" size="mini" @click="addressEdit('edit',scope.row)">修改</el-button>
                        <el-button v-if=" hasPermission('BTN_ADDRESS_DELETE_PLATFORM') " type="text" size="mini" @click="addressDelete(scope.row)">删除</el-button>
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
        <switch-edit  :dialogVisible="dialog.show" :countryList="countryList" :propParam="dialog.param"  :disableding="disableding" @close="closeEditDialog" @confirm="confirmEditItem"></switch-edit>
    </div>
</template>
<script>
    import switchEdit from './platformAddressEdit'
    import common from '@/js/common/mixins.js'
    import { getAddress, deleteAddress } from '@/request/logi'
    export default {
        props: {
            countryList: Array
        },
        components: {
            switchEdit
        },
        mixins: [common],
        data () {
            return {
                disableding: true,
                dialog: {
                    show: false,
                    param: {}
                },
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                queryData: {
                    state: '',
                    stateEn: '',
                    city: '',
                    cityEn: '',
                    area: '',
                    postcode: '',
                    superiorPostcode: '',
                    countryCode: 'all',
                    page: {
                        pageNum: 1,
                        pageSize: 20,
                        pagingSwitch: true
                    }
                },
                loading: false,
                total: 0,
                warehouseList: [],
                inventoryRecordTypeList: [],
                dataList: []
            }
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
        },
        mounted () {
            this.getInventoryRecordPageList()
        },
        methods: {
            dropDown () {
                console.log(this.countryList)
                if (this.drop) {
                    this.dropDownContent = '展开'
                    this.dropDownIcon = 'el-icon-arrow-down'
                } else {
                    this.dropDownContent = '收起'
                    this.dropDownIcon = 'el-icon-arrow-up'
                }
                this.drop = !this.drop
            },
            /**
             * 修改地址
             */
            addressEdit (type, data) {
                this.dialog.param = {}
                if (type == 'edit') {
                    this.disableding = true
                    Object.assign(this.dialog.param, data)
                    Object.assign(this.dialog.param, {
                        title: '修改邮编',
                        type: 'edit'
                    })
                } else if (type == 'add') {
                    this.disableding = false
                    Object.assign(this.dialog.param, data)
                    Object.assign(this.dialog.param, {
                        title: '邮编新增',
                        type: 'add'
                    })
                }
                this.dialog.show = true
            },
            /**
             * 删除地址
             */
            addressDelete (data) {
                this.$confirm('确认删除此邮编？删除后，此邮编不再用于下单，但不影响已经生成的订单。', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteAddress({ 'id': data.id }).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('删除成功')
                            this.getInventoryRecordPageList()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            /**
             * 获取邮编列表
             */
            getInventoryRecordPageList () {
                this.loading = true
                let param = {}
                param = JSON.parse(JSON.stringify(this.queryData))
                if (param.countryCode == 'all') {
                    param.countryCode = ''
                }
                getAddress(this.filterData(param)).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.dataList = res.addressInfo
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
                this.getInventoryRecordPageList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val
                this.getInventoryRecordPageList()
            },
            search () {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.getInventoryRecordPageList()
            },
            resetSearch () {
                Object.assign(this.queryData, {
                    state: '',
                    stateEn: '',
                    city: '',
                    cityEn: '',
                    area: '',
                    postcode: '',
                    superiorPostcode: ''
                })
                this.getInventoryRecordPageList()
            },
            closeEditDialog () {
                this.dialog.show = false
            },
            confirmEditItem () {
                this.dialog.show = false
                this.getInventoryRecordPageList()
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
