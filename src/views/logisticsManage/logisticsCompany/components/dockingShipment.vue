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
                    <el-button icon="el-icon-plus" type="primary" @click="addressEdit('add')" size="medium"  v-if="hasPermission('BTN_ADDRESS_ADD_DOCKINGSHIPMENT') ">新增物流公司</el-button>
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
                <el-table-column prop="companyName" min-width="150px" align="center"  label="物流公司"></el-table-column>
                <el-table-column label="国家"  align="center" min-width="130px">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="物流公司代码" prop="logiCompany" align="center"   min-width="180px"></el-table-column>
                <el-table-column label="物流公司国家代码" prop="logiCountryCode" align="center"  min-width="180px"></el-table-column>
                <el-table-column label="官网URL" align="center"  min-width="180px">
                    <template slot-scope="scope">
                        <a target="blank">{{ scope.row.trackingUrl }}</a>
                    </template>
                </el-table-column>
                <!-- <el-table-column label="API配置" prop="config" min-width="180px"></el-table-column> -->
                <el-table-column label="合作状态" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{ cooperateStatus[scope.row.cooperateStatus] }}
                    </template>
                </el-table-column>
                <el-table-column label="配送邮编" prop="nameCn" align="center" min-width="180px">
                    <template slot-scope="scope">
                        <el-button  type="text" size="mini" @click="addressShow(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="优先级" prop="priority" align="center"></el-table-column>
                <el-table-column label="最后修改时间" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" min-width="100px" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="hasPermission('BTN_ADDRESS_EDIT_DOCKINGSHIPMENT') " type="text" size="mini" @click="addressEdit('edit',scope.row)">修改</el-button>
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
        <el-dialog title="配送邮编"
                   :visible.sync="dialog.addressShow"
                   width="500px"
                   style="margin-top: 300px"
                   @close="dialog.addressShow = false">
            <div>{{ postCodeAlert.postcodes }}</div>
            <div slot="footer" class="dialog-footer">
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialog.addressShow = false" size="small">关 闭</el-button>
                    <el-button type="primary" @click="clickToChangePostcode" size="small">修 改</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="配送邮编编辑"
                   :visible.sync="dialog.PostcodeShow"
                   width="500px"
                   style="margin-top: 300px"
                   @close="dialog.PostcodeShow = false">
            <el-form>
                <el-form-item >
                    <el-input v-model="postCodeAlert.postcodes" type="textarea" placeholder="请输入配送邮编" :rows="4"></el-input>
                    <span style="color: red">注意：邮编请用英文逗号,进行分割</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialog.PostcodeShow = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="clickToSavePostcode" size="small">保 存</el-button>
                </div>
            </div>
        </el-dialog>
        <switch-edit :dialogVisible="dialog.show" :countryList="countryList" :propParam="dialog.param"  :disableding="disableding" @close="closeEditDialog" @confirm="confirmEditItem"></switch-edit>
    </div>
</template>
<script>
    import switchEdit from './editDockingShip'
    import { getLogiCompanyList, getLogiCompanyPostcodes, saveLogiCompany } from '@/request/logi'
    import logisticsCompanyList from '@/data/company.js'
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
                logisticsCompanyList: logisticsCompanyList,
                disableding: true,
                dialog: {
                    show: false,
                    addressShow: false,
                    PostcodeShow: false,
                    param: {}
                },
                cooperateStatus: {
                    1: '正常合作',
                    2: '终止合作',
                    9: '黑名单'
                },
                queryData: {
                    companyName: '',
                    countryCode: 'all',
                    type: 1,
                    page: {
                        pageNum: 1,
                        pageSize: 20,
                        pagingSwitch: true
                    }
                },
                postCodeAlert: {
                    postcodes: ''
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
            this.getInventoryRecordPageList()
        },
        methods: {
            /**
             * 修改地址
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
                    Object.assign(this.dialog.param, data)
                    Object.assign(this.dialog.param, {
                        title: '新增物流公司'
                    })
                }
                this.dialog.show = true
            },
            // 显示配送邮编弹窗
            addressShow (data) {
                this.postCodeAlert = {
                    postcodes: ''
                }
                Object.assign(this.postCodeAlert, data)
                this.dialog.addressShow = true
            },
            // 配送邮编编辑显示
            clickToChangePostcode (data) {
                this.dialog.addressShow = false
                this.dialog.PostcodeShow = true
            },
            // 配送邮编修改保存
            clickToSavePostcode (data) {
                saveLogiCompany(this.filterData(this.postCodeAlert)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('保存成功')
                        this.dialog.PostcodeShow = false
                        this.getInventoryRecordPageList()
                    } else {
                        this.$message.error('保存失败')
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            /**
             * 查询对接发货列表
             */
            getInventoryRecordPageList () {
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
                this.queryData.companyName = ''
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
