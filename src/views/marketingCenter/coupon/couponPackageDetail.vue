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

        <div v-if="Object.keys(couponDetail).length > 0" class="detail-wrapper">
            <!-- 以特定形式优惠券详情内容展示 -->
            <el-form class="mar-t-20 "
                    label-width="120px"
                    label-position="right"
                    label-suffix="："
                    inline>
                <el-form-item label="优惠券包ID">
                    <span>{{ couponPackageId }}</span>
                </el-form-item>
                <el-form-item></el-form-item>
                <el-form-item label="优惠券ID">
                    <span>{{ couponDetail.couponPackageDopb.couponId }}</span>
                </el-form-item>
                <el-form-item label="数量">
                    <span>{{ couponDetail.couponPackageDopb.couponCount }}</span>
                </el-form-item>
                <el-form-item label="中文名称">
                    <span>{{ getLanguage(couponDetail.couponPackageDopb.name, 'cn') }}</span>
                </el-form-item>
                <el-form-item label="英文名称">
                    <span>{{ getLanguage(couponDetail.couponPackageDopb.name, 'en') }}</span>
                </el-form-item>
                <el-form-item label="链接" style="width: 80%">
                    <span>{{ couponUrl + 'couponPackageId=' + couponDetail.secretId }}</span>
                </el-form-item>
                <el-form-item label="点击次数">
                    <span>{{ couponDetail.clickCount }}</span>
                </el-form-item>
                <el-form-item label="口令">
                    <span>{{ couponDetail.password }}</span>
                </el-form-item>
            </el-form>

            <el-table :data="couponDetail.couponQueryResultPb"
                border
                style="width: 100%">
                <el-table-column prop="couponId"
                                label="优惠券ID">
                </el-table-column>
                <el-table-column
                                min-width='120'
                                label="中文名称">
                    <template slot-scope="scope">
                        {{ getLanguage(scope.row.name, 'cn') }}
                    </template>
                </el-table-column>
                <el-table-column
                                min-width='120'
                                label="英文名称">
                    <template slot-scope="scope">
                        {{ getLanguage(scope.row.name, 'en') }}
                    </template>
                </el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        {{ getCouponTypeName(scope.row.couponType) }}
                    </template>
                </el-table-column>
                <el-table-column min-width="140"
                                label="链接">
                    <template slot-scope="scope">
                        {{ couponUrl + 'couponId=' + scope.row.secretId }}
                    </template>
                </el-table-column>
                <el-table-column prop="amount"
                                label="使用范围">
                    <template slot-scope="scope">
                        {{ couponScope[scope.row.couponScope] }}
                    </template>
                </el-table-column>
                <el-table-column min-width='280'
                                :show-overflow-tooltip='true'
                                align="center"
                                label="优惠券有效期">
                    <template slot-scope="scope">
                        <span v-if="scope.row.effectiveDays === -1">
                            {{ scope.row.startTime | formatTime }} - {{ scope.row.endTime | formatTime }}
                        </span>
                        <span v-else>
                            {{ `发放之日起${scope.row.effectiveDays}天`}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column min-width='140'
                                :show-overflow-tooltip='true'
                                label="创建时间">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column min-width='140'
                                :show-overflow-tooltip='true'
                                label="截止时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.effectiveDays === -1">
                          {{ scope.row.endTime | formatTime }}
                        </span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column prop="status"
                                label="状态">
                    <template slot-scope="scope">
                        {{ statusList[scope.row.status] }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right"
                                label="操作"
                                align="center"
                                width="100px">
                    <template slot-scope="scope">
                        <el-button plain type="primary" size="mini"
                                @click="clickToDetail(scope.row, 'coupon')">详情
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
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
    import { queryCouponPackageDetails, addCouponPassword, queryCouponType } from '@/request/coupon.js'
    import QRCode from 'qrcode'

    export default {
        data () {
            return {
                statusList: {
                    1: '有效',
                    0: '失效'
                },
                couponPackageId: '',
                password: '',
                qrCodeShow: false,
                couponType: [],
                couponScope: { // 优惠券范围
                    1: '指定商品',
                    2: '指定品类',
                    3: '全品券'
                },
                qrCodeImg: '',
                couponDetail: {},
                couponUrl: `${process.env.VUE_APP_COUPON_URL}`
            }
        },

        created () {
            this.couponPackageId = this.$route.query.couponPackageId
            this.getCouponDetails()
            this.getCouponType()
        },

        methods: {
            getLanguage (data, type) {
                let res = ''
                if (data && data.length) {
                    let item = data.find(item => item.languageCode === type)

                    res = item ? item.name : ' '
                }
                return res
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
            // 返回
            goBack () {
                this.$router.go(-1)
            },
            handleAddCouponPassword () {
                if (!this.password) {
                    return this.$message.warning('口令不能为空')
                }
                addCouponPassword({ couponSharePb: {
                    couponPackageId: this.couponPackageId,
                    password: this.password
                } }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('添加成功')
                        this.getCouponDetails()
                    }
                })
            },
            clickToDetail (data) {
                this.$router.push({
                    name: 'mcouponDetail',
                    query: {
                        couponId: data.couponId
                    }
                })
            },
            getCouponDetails () {
                queryCouponPackageDetails({
                    couponPackageId: this.couponPackageId,
                    type: 2
                }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.couponDetail = res.couponPackageQueryResultPb || {}
                    }
                })
            }
        }
    }
</script>
<style lang="scss">
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
        // border: 1px solid #99a9bf;
        .el-form--inline .el-form-item{
        width: 40%;
        }
    }
</style>
