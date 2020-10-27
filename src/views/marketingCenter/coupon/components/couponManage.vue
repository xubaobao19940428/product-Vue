<template>
    <div class="app-container">
        <el-form inline label-width="90px" :model="searchParam">
          <el-form-item label="优惠券ID："
                        class="filter-item">
            <el-input placeholder="请输入优惠券ID"
                      size="medium"
                      clearable
                      v-model="searchParam.couponId"></el-input>
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
          <el-form-item label="优惠券名称："
                        class="filter-item">
            <el-input placeholder="请输入优惠券名称"
                      size="medium"
                      clearable
                      v-model="searchParam.name"></el-input>
          </el-form-item>
          <el-form-item label="公开领取：">
              <el-select v-model="searchParam.allowPublicityOrAll" size="medium">
                  <el-option v-for="item in allowPublicList" :key="item.key" :value="item.key" :label="item.name"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="转赠设置：">
              <el-select v-model="searchParam.giftGivingPermitted" size="medium">
                  <el-option v-for="item in giftGivingList" :key="item.key" :value="item.key" :label="item.name"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item class="filter-item" style="margin-left: 20px;">
            <el-button type="primary"
                       @click="getList(1)"
                       icon="el-icon-search"
                       size="medium">查询</el-button>
            <el-button
                @click="resetSearchCoupon"
                icon="el-icon-refresh-left"
                size="medium">重置
            </el-button>
          </el-form-item>
        </el-form>
        <div class="operator-container">
          <el-button icon="el-icon-plus" type="primary"
                     v-if="hasPermission('BTN_COUPON_ADD')"
                     @click="showAddCoupon('add')" class="operator-item"
                     size="medium">新增
          </el-button>
          <el-button type="primary"
                    icon="el-icon-download"
                     v-if="hasPermission('BTN_COUPON_SEND')"
                     @click="showSendCoupon()"
                     class="operator-item"
                     size="medium">发券
          </el-button>
        </div>
        <div class="main-content-wrapper">
            <el-table :data="dataList"
                    border
                    v-loading="load"
                    height="100%"
                    style="width: 100%;">
                <el-table-column prop="couponId"
                                fixed="left"
                                align="center"
                                label="优惠券ID">
                </el-table-column>
                <el-table-column
                                min-width='120'
                                align="center"
                                label="优惠券名称">
                                <template slot-scope="scope">
                                    {{ getLanguage(scope.row.name, 'cn') }}
                                </template>
                </el-table-column>
                <el-table-column label="适用国家" align="center">
                    <template slot-scope="scope">
                        {{ getCountryName(scope.row.countryCode) }}
                    </template>
                </el-table-column>
                <el-table-column label="优惠券类型" align="center" width="120px">
                    <template slot-scope="scope">
                    {{ getCouponTypeName(scope.row.couponType) }}
                    </template>
                </el-table-column>
                <el-table-column label="优惠内容" min-width="180" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.couponType == 1">
                            {{`${currencyUnitObj[scope.row.countryCode]}${scope.row.amount}`}}
                            （满{{ `${currencyUnitObj[scope.row.countryCode] || ' '}${JSON.parse(scope.row.rule).fullAmt || 0}`}}）
                        </span>
                        <span v-else-if="scope.row.couponType == 2">
                            优惠{{ scope.row.discount }}%
                        </span>
                        <span v-else-if="scope.row.couponType == 3 || scope.row.couponType == 5">
                            {{ `${currencyUnitObj[scope.row.countryCode]}${scope.row.amount}` }}
                        </span>
                        <span v-else-if="scope.row.couponType == 4">免邮</span>
                    </template>
                </el-table-column>
                <el-table-column min-width='280' label="优惠券有效期" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.effectiveDays === -1">
                            {{ scope.row.startTime | formatTime }} - {{ scope.row.endTime | formatTime }}
                        </span>
                        <span v-else>
                            {{ `发放之日起${scope.row.effectiveDays}天`}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="发行余量" prop="quantity" align="center">
                </el-table-column>
                <el-table-column label="每日发行上限" prop="dailyLimit" align="center" width="120px"></el-table-column>
                <el-table-column label="每人限领" prop="personLimit" align="center"></el-table-column>
                <el-table-column label="公开设置" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.allowPublicity == 1 ? '公开' : '不公开' }}
                    </template>
                </el-table-column>
                <el-table-column label="转赠设置" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.giftGivingPermitted ? '允许' : '禁止' }}
                    </template>
                </el-table-column>
                <el-table-column label="更新人" prop="operationName" align="center"></el-table-column>
                <el-table-column label="更新时间" align="center" width="180px">
                    <template slot-scope="scope">{{ scope.row.updateTime | formatTime }}</template>
                </el-table-column>
                <el-table-column fixed="right"
                                label="操作"
                                align="center"
                                width="210px">
                    <template slot-scope="scope">
                        <el-button plain v-if="hasPermission('BTN_COUPON_COPY')"
                            type="primary"
                            size="mini"
                            @click="showAddCoupon('edit', scope.row.couponId)"
                        >编辑</el-button>
                        <el-button plain type="primary" size="mini"
                                   v-if="hasPermission('BTN_COUPON_DETAIL')"
                                   @click="handleDetail(scope.row)">详情
                        </el-button>
                        <el-button plain v-if="hasPermission('BTN_COUPON_COPY')"
                            type="primary"
                            size="mini"
                            @click="showAddCoupon('add', scope.row.couponId)"
                        >复制</el-button>
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
        <send-coupon-dialog :dialogVisible="dialog.show" @close="handleCloseSend" @confirm="handleConfirmSend"></send-coupon-dialog>
    </div>
</template>
<script>
    import { listByQueryCouponWithPage, queryCouponType } from '@/request/coupon.js'
    import sendDialog from './sendDialog'
    import sendCouponDialog from './sendCouponDialog'

    export default {
        props: {
            countryList: Array
        },
        data() {
            return {
                giftGivingList: [{
                    key: -1,
                    name: '全部'
                }, {
                    key: 0,
                    name: '禁止'
                }, {
                    key: 1,
                    name: '允许'
                }],
                totals: 0,
                dataList: [],
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
                allowPublicList: [{
                    key: 1, 
                    name: '公开中'
                }, {
                    key: 2,
                    name: '全部'
                }],
                load: false,
                couponType: [], // 优惠券类型
                timeList: [],
                searchParam: {
                    countryCode: '',
                    couponId: '',
                    name: '',
                    status: '',
                    giftGivingPermitted: -1,
                    allowPublicityOrAll: 2, // 默认全部
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                dialog: {
                    show: false,
                    userId: '',
                    param: {
                        couponId: '',
                        couponPackageId: '',
                        memberLevel: '',
                        userId: []
                    }
                }
            }
        },
        computed: {
            currencyUnitObj: function () {
                let obj = {}
                this.countryList.forEach(item => {
                    obj[item.shortCode] = item.currencyUnit
                })

                return obj
            }
        },
        components: {
            sendCouponDialog
        },
        created () {
            this.getList()
            this.getCouponType()
        },
        methods: {
            handleSizeChange (value) {
                Object.assign(this.searchParam.page, {
                    pageSize: value,
                    pageNum: 1
                })
                this.getList()
            },
            getLanguage (data, type) {
                let res = ''
                if (data && data.length) {
                    let item = data.find(item => item.languageCode === type)

                    res = item ? item.name : ' '
                }
                return res
            },
            getCountryName (data) {
                let item = this.countryList.find(item => item.shortCode === data)

                return item ? item.nameLocal : ' '
            },
            getList (page) {
                this.load = true
                this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                this.timeList = this.timeList || []
                let resParam = {}
                resParam.couponQueryPb = this.filterData(Object.assign(this.searchParam, {
                    startTime: !this.timeList[0] ? null : this.timeList[0],
                    endTime: !this.timeList[1] ? null : this.timeList[1]
                }))
                listByQueryCouponWithPage(resParam).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.couponDetailsDopb
                        this.totals = res.total
                    }
                    this.load = false
                }).catch(err => {
                    this.load = false
                })
            },
            handleDetail (data) {
                this.$router.push({
                    name: 'mcouponDetail',
                    query: {
                        couponId: data.couponId
                    }
                })
            },
            getCouponType() {
                queryCouponType({}).then(res => {
                    if (res.ret.errcode === 1) {
                        this.couponType = res.couponTypeResult
                    }
                })
            },
            getCouponTypeName (type) {
                let item = this.couponType.find((val) => {
                    return type == val.id
                })

                return item ? item.desc : ''
            },
            resetSearchCoupon () {
                this.searchParam = {
                    couponId: '',
                    countryCode: '',
                    name: '',
                    status: '',
                    giftGivingPermitted: -1,
                    allowPublicityOrAll: 2,
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
                this.timeList = []
            },
            showAddCoupon (type, data) {
                let query = {}
                if (data) {
                    query = {
                        couponId: data
                    }
                }

                query.type = type
                this.$router.push({
                    name: 'mcouponEdit',
                    query
                })
            },
            showSendCoupon () {
                this.dialog.param.couponId = '';
                this.dialog.param.couponPackageId = ''
                this.dialog.show = true
            },
            handleConfirmSend () {
                this.handleCloseSend()
                this.getList()
            },
            handleCloseSend () {
                this.dialog.show = false
            }
        }
    }
</script>
