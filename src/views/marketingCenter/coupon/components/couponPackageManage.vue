<template>
    <div class="app-container">
        <el-form inline label-width="100px">
          <el-form-item label="优惠券包ID："
                        class="filter-item">
            <el-input placeholder="请输入优惠券包ID"
                      size="medium"
                      v-model="searchParam.couponPackageId"></el-input>
          </el-form-item>
          <el-form-item label="名称："
                        class="filter-item">
            <el-input placeholder="请输入优惠券包名称"
                      size="medium"
                      v-model="searchParam.name"></el-input>
          </el-form-item>
            <el-form-item label="适用国家：">
                <el-select v-model="searchParam.countryCode"
                            filterable
                            clearable>
                    <el-option v-for="item in countryList"
                                :key="item.shortCode"
                                :label="item.nameLocal"
                                :value="item.shortCode">
                    </el-option>
                </el-select>
            </el-form-item>
          <el-form-item class="filter-item" style="margin-left: 20px">
            <el-button icon="el-icon-search"
                       type="primary"
                       @click="getList(1)"
                       size="medium">查询</el-button>
            <el-button
                icon="el-icon-refresh-left"
                @click="resetSearchCoupon"
                size="medium">重置
            </el-button>
          </el-form-item>
        </el-form>
        <div class="operator-container">
          <el-button icon="el-icon-plus"
                     type="primary"
                     v-if="hasPermission('BTN_COUPON_PACKAGE_ADD')"
                     @click="showDialog('addCoupondialog')"
                     class="operator-item"
                     size="medium">新增
          </el-button>
          <el-button type="primary"
                    size="medium"
                     @click="showDialog('sendDialog')"
                     class="operator-item"
                     v-if="hasPermission('BTN_COUPON_PACKAGE_SEND')">分发优惠券包
          </el-button>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="dataList"
                    border
                    v-loading="load"
                    height="100%"
                    style="width: 100%">
                <el-table-column prop="couponPackageId"
                                align="center"
                                label="优惠券包ID"/>
                <el-table-column prop="couponId"
                                align="center"
                                label="优惠券ID"/>
                <el-table-column
                                min-width='120'
                                align="center"
                                label="中文名称">
                                <template slot-scope="scope">
                                    {{ getLanguage(scope.row.name, 'cn') }}
                                </template>
                </el-table-column>
                <el-table-column
                                min-width='120'
                                align="center"
                                label="英文名称">
                                <template slot-scope="scope">
                                    {{ getLanguage(scope.row.name, 'en') }}
                                </template>
                </el-table-column>
                <el-table-column label="国家" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column prop="status"
                                label="优惠券"
                                align="center"
                                min-width='120'>
                    <template slot-scope="scope">
                        <div v-for="(item, i) in formatData(scope.row.couponId)" :key="item">
                            ID： {{item}} 数量：{{ formatData(scope.row.couponCount)[i] }}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="中文详情" align="center">
                    <template slot-scope="scope">
                        {{ getLanguage(scope.row.description, 'cn') }}
                    </template>
                </el-table-column>
                <el-table-column label="英文详情" align="center">
                    <template slot-scope="scope">
                        {{ getLanguage(scope.row.description, 'en') }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right"
                                label="操作"
                                align="center"
                                width="100px">
                    <template slot-scope="scope">
                    <el-button plain type="primary"
                                size="mini"
                               v-if="hasPermission('BTN_COUPON_PACKAGE_DETAIL')"
                                @click="handleDetail(scope.row)">详情
                    </el-button>
                    <!-- <el-button plain type="warning" size="mini"
                                @click="handleDelete(scope.row)">删除
                    </el-button> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="getList"
                @size-change="handleSizeChange"
                :current-page="searchParam.page.pageNum"
                :page-size="searchParam.page.pageSize"
                layout="sizes, total, prev, pager, next, jumper"
                :page-sizes="[5, 10, 15, 20]"
                :total="totals">
            </el-pagination>
        </div>
        <gift-coupon-dialog :dialogVisible="addCouponPackageDialog.show" @close="closeAddCouponPackage" @confirm="confirmAddCouponPackage"></gift-coupon-dialog>
        <send-dialog :dialogVisible="sendDialog.show" @close="handleCloseSend"  @confirm="handleConfirmSend" type='couponPackage'></send-dialog>
    </div>
</template>
<script>
    import { listByQueryCouponPackageWithPage } from '@/request/coupon.js'
    import giftCouponDialog from './giftCouponDialog.vue'
    import sendDialog from './sendDialog.vue'
    import { mapState } from 'vuex'

    export default {
        components: {
            giftCouponDialog,
            sendDialog
        },
        data () {
            return {
                totals: 0,
                dataList: [],
                load: false,
                statusList: [{
                    name: '全部',
                    value: ''
                }, {
                    name: '有效',
                    value: 1
                }, {
                    name: '失效',
                    value: 0
                }],
                timeList: [],
                searchParam: {
                    couponPackageId: '',
                    name: '',
                    status: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    },
                    countryCode: ''
                },
                addCouponPackageDialog: {
                    show: false
                },
                sendDialog: {
                    show: false
                }
            }
        },
        created () {
            this.getList()
        },
        computed: {
            ...mapState({
                countryList: state => state.dict.countryList
            }),
        },
        methods: {
            handleSizeChange (value) {
                Object.assign(this.searchParam.page, {
                    pageNum: 1,
                    pageSize: value
                })
                this.getList()
            },
            getList (page) {
                this.load = true
                this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                this.timeList = this.timeList || []
                let resParam = {
                    couponQueryPb: null
                }
                resParam.couponQueryPb = this.filterData(Object.assign(this.searchParam, {
                    startTime: !this.timeList[0] ? null : this.timeList[0],
                    endTime: !this.timeList[1] ? null : this.timeList[1]
                }))
                listByQueryCouponPackageWithPage(resParam).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.couponPackageDopb
                        this.totals = res.total
                    }
                    this.load = false
                }).catch(err => {
                    this.load = false
                })
            },
            formatData (data) {
                return data.split('|')
            },
            getCountryName (data) {
                let item = this.countryList.find(item => item.shortCode === data)

                return item ? item.nameLocal : ' '
            },
            getLanguage (data, type) {
                let res = ''
                if (data && data.length) {

                    let item = data.find(item => item.languageCode === type)
                    res = item ? item.name : ' '
                }

                return res
            },
            resetSearchCoupon () {
                this.searchParam = {
                    couponPackageId: '',
                    countryCode: '',
                    name: '',
                    status: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
                this.timeList = []
            },
            handleDetail (data) {
                // 优惠券礼包
                this.$router.push({
                    name: 'mcouponPackageDetail',
                    query: {
                        couponPackageId: data.couponPackageId
                    }
                })
            },
            // handleDelete (data) {
            //     this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         // 优惠券包
            //         deleteCouponPackage({
            //             couponPackageId: data.id
            //         }).then((res) => {
            //             if (res.code == 200) {
            //                 this.searchCoupon('giftCoupon')
            //                 this.$message.success('删除成功')
            //             }
            //         })
            //     }).catch(() => {
            //         this.$message({
            //             type: 'info',
            //             message: '已取消删除'
            //         })
            //     })
            // },
            showDialog (type) {
                switch (type) {
                    case 'addCoupondialog': {
                        this.addCouponPackageDialog.show = true
                        break
                    }
                    case 'sendDialog': {
                        this.sendDialog.show = true
                        break
                    }
                }
            },
            handleConfirmSend () {
                this.handleCloseSend()
                this.getList()
            },
            handleCloseSend () {
                this.sendDialog.show = false
            },
            confirmAddCouponPackage () {
                this.closeAddCouponPackage()
                this.getList()
            },
            closeAddCouponPackage () {
                this.addCouponPackageDialog.show = false
            }
        }
    }
</script>
