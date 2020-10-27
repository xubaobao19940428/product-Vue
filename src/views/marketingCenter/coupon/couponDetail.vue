<template>
    <div class="app-container">
        <!-- 头部操作区 -->
        <el-form class="mar-t-20 " inline>
            <el-form-item>
                <el-button @click="goBack"
                        type="primary"
                        size="small">返回</el-button>
            </el-form-item>
            <el-form-item>
                <el-button @click="getQrCode"
                        type="primary"
                        size="small">生成二维码</el-button>
            </el-form-item>
            <el-form-item label="优惠口令：">
                <el-input v-model="password"
                            placeholder="输入数字、字母，区分大小写"
                            style="width: 200px"
                            size="medium"></el-input>
                <el-button @click="handleAddCouponPassword"
                            type="primary"
                            class="mar-l-10"
                            size="small">提交</el-button>
            </el-form-item>
        </el-form>

        <!-- 以特定形式优惠券详情内容展示 -->
        <div v-if="Object.keys(couponDetail).length > 0" class="detail-wrapper">
            <el-form class="mar-t-20 "
                    label-width="110px"
                    label-position="right"
                    label-suffix="："
                    inline>
                <el-form-item label="中文名称">
                    <span>{{ getLanguage(couponDetail.name, 'cn') }}</span>
                </el-form-item>
                <el-form-item label="英文名称">
                    <span>{{ getLanguage(couponDetail.name, 'en') }}</span>
                </el-form-item>
                <el-form-item label="优惠券类型">
                    <span>{{ getCouponTypeName(couponDetail.couponType) }}</span>
                </el-form-item>
                <el-form-item label="优惠内容">
                    <span v-if="couponDetail.couponType == 1 || couponDetail.couponType == 5">
                        {{`${curCurrencyUnit}${couponDetail.amount}`}}（满{{ curCurrencyUnit }}{{ JSON.parse(couponDetail.rule).fullAmt || 0}}）
                    </span>
                    <span v-else-if="couponDetail.couponType == 2">
                        优惠{{ couponDetail.discount }}%
                    </span>
                    <span v-else-if="couponDetail.couponType == 4">免邮</span>
                    <span v-else>
                        {{ `${curCurrencyUnit}${couponDetail.amount}` }}
                    </span>
                </el-form-item>
                <el-form-item label="优惠口令">
                    <span>{{ couponDetail.password }}</span>
                </el-form-item>
                <el-form-item label="剩余发行量">
                    <span>{{ couponDetail.quantity }}</span>
                </el-form-item>
                <el-form-item label="优惠券ID">
                    <span>{{ couponDetail.couponId }}</span>
                </el-form-item>
                <el-form-item label="链接点击次数">
                    <span>{{ couponDetail.clickCount }}</span>
                </el-form-item>
                <el-form-item label="优惠券链接" style="width: 80%">
                    <span>{{ couponUrl + 'couponId=' + couponDetail.secretId }}</span>
                </el-form-item>
                <el-form-item label="创建时间">
                    <span>{{ couponDetail.createTime | formatTime }}</span>
                </el-form-item>
                <el-form-item label="优惠券有效期">
                    <span v-if="couponDetail.effectiveDays === -1">
                        {{ couponDetail.startTime | formatTime }} - {{ couponDetail.endTime | formatTime }}
                    </span>
                    <span v-else>
                        {{ `发放之日起${couponDetail.effectiveDays}天`}}
                    </span>
                </el-form-item>
                <el-form-item label="商品范围">
                    <span>{{ couponScope[couponDetail.couponScope] }}</span>
                </el-form-item>
                <el-form-item label="用户范围">
                    <span>{{ getLevelName(couponDetail.memberLevel) }}</span>
                </el-form-item>
            </el-form>

            <!-- 图表展示 -->
            <v-chart v-if="polar1.ready"
                    :autoresize="true"
                    :options="polar1"/>
        </div>

        <!-- 搜索条件区域 -->
        <el-form class="mar-t-20 " inline>
            <el-form-item label="使用状态：">
                <el-select v-model="searchParam.couponUseStatus"
                            size="medium">
                    <el-option :value="9" label="全部"></el-option>
                    <el-option v-for="(val, key) in useStatus"
                            :key="key"
                            :label="val"
                            :value="key">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单编号：">
                <el-input v-model="searchParam.orderNo"
                        size="medium"></el-input>
            </el-form-item>
            <el-form-item label="用户ID：">
                <el-input v-model="searchParam.userId"
                        size="medium"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="getList(1)"
                        type="primary"
                        class="mar-l-10"
                        size="small">搜索</el-button>
            </el-form-item>
        </el-form>

        <!-- 优惠券使用情况表格展示区域 -->
        <el-table
            :data="dataList"
            height="100%"
            border
            v-loading="load"
            style="width: 100%; min-height: 200px">
            <el-table-column prop="couponUserDopb.couponCode"
                            min-width="200px"
                            align="center"
                            label="优惠码">
            </el-table-column>
            <el-table-column prop="couponUserDopb.userId"
                            min-width="100px"
                            align="center"
                            label="领取用户ID">
            </el-table-column>
            <el-table-column prop="couponUserDopb.receivingChannel"
                            align="center"
                            label="领取方式">
            </el-table-column>
            <el-table-column label="优惠券有效期"
                            align="center"
                            min-width="320px">
            <template slot-scope="scope">
                <span>{{ scope.row.couponUserDopb.startTime | formatTime }} - {{ scope.row.couponUserDopb.endTime | formatTime }}</span>
            </template>
            </el-table-column>
            <el-table-column label="使用状态" align="center">
            <template slot-scope="scope">
                <span>{{ useStatus[scope.row.couponUserDopb.couponUseStatus || 0] }}</span>
            </template>
            </el-table-column>
            <el-table-column
                            min-width="180px"
                            align="center"
                            label="使用时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.couponUserDopb.couponUseStatus == 1">
                            {{ scope.row.couponUserDopb.couponUseTime | formatTime }}
                        </span>
                    </template>
            </el-table-column>
            <el-table-column prop="couponUserDopb.orderId"
                            min-width="180px"
                            align="center"
                            label="订单编号">
            </el-table-column>
        </el-table>

        <div class="pagination-box">
            <el-pagination
                @current-change="getList"
                @size-change="handleSizeChange"
                :current-page="searchParam.page.pageNum"
                :page-size="searchParam.page.pageSize"
                layout="sizes, total, prev, pager, next, jumper"
                :page-sizes="[5, 10, 15, 20]"
                :total="totals"
                style="float:right;margin-top:10px;">
            </el-pagination>
        </div>

        <el-dialog
            title="二维码"
            :visible.sync="qrCodeShow"
            width="500px"
            @close="qrCodeShow = false">
            <div class="qr-img-box">
                <img :src="qrCodeImg">
                <el-button type="primary"
                        class="mar-b-10"
                        size="small">
                    <a :href='qrCodeImg' download="qr.png">下载二维码</a>
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import { countCouponDetails, queryCouponDetails, queryUserCouponManage, queryCouponType, addCouponPassword } from '@/request/coupon.js'
    import QRCode from 'qrcode'
    import vChart from 'vue-echarts'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'
    import { mapState } from 'vuex'

    export default {
        components: {
            'v-chart': vChart
        },
        data () {
            return {
                polar1: {
                    ready: false
                },
                load: false,
                useStatus: {
                    0: '未使用',
                    1: '已使用',
                    2: '已过期'
                },
                couponScope: { // 优惠券范围
                    1: '指定商品',
                    2: '指定品类',
                    3: '全品券'
                },
                couponUrl: `${process.env.VUE_APP_COUPON_URL}`,
                totals: 0,
                dataList: [],
                couponDetail: {},
                couponType: [],
                qrCodeImg: '',
                qrCodeShow: false,
                curCurrencyUnit: 'RM',
                password: '',
                searchParam: {
                    couponUseStatus: 9, // 与后端约定，全部的时候传9值
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
            }
        },
        created () {
            this.searchParam.couponId = this.$route.query.couponId
            this.getCouponType()
            this.getCouponDetail()
            this.countCouponDetails()
            this.getList(1)
        },
        computed: {
            ...mapState({
                countryList: state => state.dict.countryList,
                userLevel: state => state.user.userLevel
            })
        },
        methods: {
            handleSizeChange (value) {
                Object.assign(this.searchParam.page, {
                    pageSize: value,
                    pageNum: 1
                })
                this.getList()
            },
            getCouponType() {
                queryCouponType({}).then(res => {
                    if (res.ret.errcode === 1) {
                        this.couponType = res.couponTypeResult
                    }
                })
            },
            setCurCurrencyUnit (val) {
                let res = this.countryList.find(item => item.shortCode === val)

                this.curCurrencyUnit = res ? res.currencyUnit : ' '
            },
            // 获取以特定形式展示的优惠券详情
            getCouponDetail () {
                queryCouponDetails({
                    couponDetailsId: this.searchParam.couponId,
                    type: 2
                }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.couponDetail = res.couponQueryResultPb
                        this.setCurCurrencyUnit(res.couponQueryResultPb.countryCode)
                    }
                })
            },
            getCouponTypeName (type) {
                let item = this.couponType.find((val) => {
                    return type == val.id
                })

                return item ? item.desc : ''
            },
            getLevelName (level) {
                let name = ''
                for (let item of level) {
                    name += this.userLevel[item]
                }
                return name
            },
            // 获取表格数据
            getList (page) {
                this.load = true
                this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                queryUserCouponManage({ query: this.filterData(this.searchParam)}).then(res => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.couponUserRespPb
                        this.totals = res.total
                    }
                    this.load = false
                }).catch(err => {
                    console.error(err)
                    this.load = false
                })
            },
            // 优惠券统计，也就是绘制图表
            countCouponDetails () {
                countCouponDetails({
                    couponDetailsId: this.$route.query.couponId
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        Object.assign(this.polar1, {
                            tooltip: {
                                trigger: 'item',
                                formatter: '{b}: {c} ({d}%)'
                            },
                            legend: {
                                orient: 'vertical',
                                x: 'left',
                                data: ['已领取', '未领取', '已使用', '未使用', '已过期']
                            },
                            series: [
                                {
                                    type: 'pie',
                                    selectedMode: 'single',
                                    radius: [0, '40%'],

                                    label: {
                                        normal: {
                                            position: 'inner',
                                            formatter: '{b}: {c} ({d}%)'
                                        }
                                    },
                                    labelLine: {
                                        normal: {
                                            show: false
                                        }
                                    },
                                    data: [
                                        {
                                            value: res.couponCountResultPb.received || 0,
                                            name: '已领取',
                                            itemStyle: {
                                                normal: {
                                                    color: '#ff0672'
                                                }
                                            }
                                        },
                                        {
                                            value: res.couponCountResultPb.unclaimed || 0,
                                            name: '未领取',
                                            itemStyle: {
                                                normal: {
                                                    color: '#00dca8'
                                                }
                                            }
                                        }
                                    ]
                                },
                                {
                                    type: 'pie',
                                    radius: ['50%', '80%'],
                                    label: {
                                        normal: {
                                            position: 'inner',
                                            formatter: '{b}: {c} ({d}%)'
                                        }
                                    },
                                    data: [
                                        {
                                            value: res.couponCountResultPb.used || 0,
                                            name: '已使用',
                                            itemStyle: {
                                                normal: {
                                                    color: '#8c0dfa'
                                                }
                                            }
                                        },
                                        {
                                            value: res.couponCountResultPb.unUsed || 0,
                                            name: '未使用',
                                            itemStyle: {
                                                normal: {
                                                    color: '#ff4897'
                                                }
                                            }
                                        },
                                        {
                                            value: res.couponCountResultPb.expired || 0,
                                            name: '已过期',
                                            itemStyle: {
                                                normal: {
                                                    color: '#a229ad'
                                                }
                                            }
                                        },
                                        {
                                            value: res.couponCountResultPb.unclaimed || 0,
                                            name: '未领取',
                                            itemStyle: {
                                                normal: {
                                                    color: '#00694b'
                                                }
                                            }
                                        }
                                    ]
                                }
                            ]
                        })
                        this.polar1.ready = true
                    }
                })
            },
            // 生成二维码
            getQrCode () {
                QRCode.toDataURL(this.couponUrl + 'couponId=' + this.couponDetail.secretId)
                    .then(url => {
                        this.qrCodeImg = url
                        this.qrCodeShow = true
                    })
                    .catch(err => {
                        console.error(err)
                    })
            },
            getLanguage (data, type) {
                let res = ''
                if (data && data.length) {
                    let item = data.find(item => item.languageCode === type)

                    res = item ? item.name : ' '
                }
                return res
            },
            // 返回
            goBack () {
                this.$router.go(-1)
            },
            handleAddCouponPassword () {
                if (!this.password) {
                    return this.$message.warning('口令不能为空')
                }
                addCouponPassword({ couponSharePb: {
                    couponId: this.$route.query.couponId,
                    password: this.password
                }}).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('添加成功')
                        this.getCouponDetail()
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
  .qr-img-box{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    img{
      width: 200px;
    }
  }
  .detail-wrapper{
    border: 1px solid #99a9bf;
    padding-left: 16px;
    .el-form--inline .el-form-item{
      width: 40%;
    }
  }
</style>
