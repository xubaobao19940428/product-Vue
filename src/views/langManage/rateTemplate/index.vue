<template>
    <div class="app-container">
        <el-table :data="currentTemplates"
                  border
                  style="width: 100%; flex: none">
            <el-table-column v-for="(item, i) in countryRateList"
                             :key="i"
                             :label="item.nameCn">
                <template slot-scope="scope">
                    <span>{{ getCurrentRate(scope.row, item) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="最近修改时间"
                             prop="updateTime"
                             min-width="180px">
            </el-table-column>
            <el-table-column fixed="right"
                             label="操作"
                             align="center"
                             min-width="100px">
                <template slot-scope="scope">
                    <div class="order-btn-box">
                        <el-button plain type="primary" size="mini"
                                   v-if="hasPermission('BTN_RATE_TEMPLATE_EDIT')"
                                   @click="showAddDialog('edit', scope.row)">编辑
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>
        <el-divider content-position="left">汇率变更记录</el-divider>
        <el-table :data="templateList"
                  border
                  height="100%"
                  style="width: 100%">
            <el-table-column type="index"
                             width="50">
            </el-table-column>
            <el-table-column v-for="(item, i) in countryRateList"
                             min-width="100px"
                             :key="i"
                             align="center"
                             :label="item.nameCn">
                <template slot-scope="scope">
                    <span>{{ getCurrentRate(scope.row, item) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="变更时间"
                             align="center"
                             min-width="180px">
                <template slot-scope="scope">
                    {{ scope.row.updateTime | formatTime }}
                </template>
            </el-table-column>
            <el-table-column label="审核状态" align="center">
                <template slot-scope="scope">
                    <span>{{ scope.row.reviewState == 0 ? '待审核' : (scope.row.reviewState == 1 ? '不通过' : '通过') }}</span>
                </template>
            </el-table-column>
            <el-table-column fixed="right"
                             label="操作"
                             align="center"
                             min-width="100px">
                <template slot-scope="scope">
                    <div class="table-action-btn-box"
                         v-if="scope.row.reviewState == 0">
                        <el-button plain type="primary" size="mini"
                                   v-if="hasPermission('BTN_RATE_TEMPLATE_REVIEW_PASS')"
                                   @click="reviewRate('2', scope.row)">通过
                        </el-button>
                        <el-button plain type="primary" size="mini"
                                   v-if="hasPermission('BTN_RATE_TEMPLATE_NO_PASS')"
                                   @click="reviewRate('1', scope.row)">不通过
                        </el-button>
                    </div>
                    <el-button plain
                               disabled
                               type="info"
                               size="mini"
                               v-else>已审核
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="getList"
                           :current-page="page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
        <!--新增-->
        <el-dialog :title="addDialog.title"
                   :visible.sync="addDialog.show"
                   width="500px"
                   @close="addDialog.show = false">
            <el-form label-position="right"
                     label-width="120px"
                     :model="addDialog.param"
                     ref="addDialog">
                <el-form-item>
                    <span>美元 1.00</span>
                </el-form-item>
                <el-form-item v-for="(item, i) in addDialog.param.exchangeRate"
                              :key="i"
                              :label="item.nameCn + '：'"
                              class="filter-item">
                    <el-input placeholder="请输入"
                              v-model="item.rate"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <div slot="footer" class="dialog-footer">
                    <el-button @click="addDialog.show = false" size="small">取 消</el-button>
                    <el-button type="primary" @click="confirmUpdate" size="small">保 存</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {
        exchangeGetRateSaveHistory,
        ExchangeGetReadyConfigTemplate,
        exchangeGetRecentRateTemplate,
        exchangeReview,
        exchangeSaveRate
    } from '@/request/product.js'

    export default {
        data () {
            return {
                currentTemplates: [],
                templateList: [],
                countryRateList: [],
                addDialog: {
                    title: '编辑汇率模板',
                    show: false,
                    param: {
                        exchangeRate: []
                    }
                },
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                },
                totals: 0
            }
        },
        created () {
            this.getCurrentTemplate()
            this.getCountryRateList()
            this.getList()
        },
        methods: {
            getCurrentTemplate () {
                exchangeGetRecentRateTemplate({}).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.currentTemplates = [res]
                    }
                })
            },
            getCountryRateList () {
                ExchangeGetReadyConfigTemplate({}).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.countryRateList = res.exchangeRate
                    }
                })
            },
            getCurrentRate (list, item) {
                let data = list.exchangeRate.find((val) => {
                    return val.currencyCode == item.currencyCode
                })
                return data ? data.rate : ''
            },
            showAddDialog (type, data) {
                this.addDialog.param.exchangeRate = JSON.parse(JSON.stringify(data.exchangeRate))
                this.addDialog.show = true
            },
            confirmUpdate () {
                exchangeSaveRate(this.addDialog.param).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('保存成功')
                        this.getList()
                        this.addDialog.show = false
                    }
                })
            },
            confirmReview (reviewCode, data) {
                exchangeReview({
                    exchangeRateSaveId: data.exchangeRateSaveId,
                    reviewCode: reviewCode
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('成功')
                        this.getList()
                        this.getCurrentTemplate()
                    }
                })
            },
            reviewRate (reviewCode, data) {
                if (reviewCode == 2) {
                    this.$confirm('通过审核后，汇率修改将立即生效', '通过确认', {
                        confirmButtonText: '通过',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(async () => {
                        this.confirmReview(reviewCode, data)
                    }).catch(() => {})
                } else {
                    this.confirmReview(reviewCode, data)
                }
            },
            handleSizeChange (value) {
                this.page.pageSize = value
                this.getList()
            },
            // 获取分类
            getList (page) {
                this.page.pageNum = page || this.page.pageNum
                exchangeGetRateSaveHistory({ page: this.page }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.templateList = res.rateHistory
                        this.totals = res.total
                    }
                })
            }
        }
    }

</script>
