<template>
    <el-dialog title="采购单详情" :visible.sync="editDialog.Original.show" height="100%" @close="editDialog.Original.show = false"  :close-on-click-modal="false">
          <el-form>
              <el-row>
                  <el-col :span="10">
                      <el-form-item label="采购单号：">
                          <div>{{this.editDialog.param.purchaseOrderNo}}</div>
                      </el-form-item>
                  </el-col>
                  <el-col :span="10">
                      <el-form-item label="SkuCode：" style="margin-left: 30px">
                          <div>{{this.editDialog.param.skuCode}}</div>
                      </el-form-item>
                  </el-col>
              </el-row>
          </el-form>
          <div>
              <el-table :data="orderDetail"  :loading="loading">
                  <el-table-column label="用户订单号" min-width="200px" align="center">
                      <template slot-scope="scope">
                          <div>{{ scope.row.orderNo}}</div>
                      </template>
                  </el-table-column>
                  <el-table-column label="SKU商品数量" min-width="240px" align="center">
                      <template slot-scope="scope">
                          <div>{{ scope.row.count || '-'}}</div>
                      </template>
                  </el-table-column>
              </el-table>
          </div>
          <div class="pagination-box">
              <el-pagination
                  @current-change="handleCurrentChange"
                  @size-change="handleSizeChange"
                  :current-page="page.pageNum"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="page.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="total">
              </el-pagination>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button icon="el-icon-download" type="primary" size="small" @click="exportOrder">导出数据</el-button>
              <el-button type="primary" @click="closeall" size="small">关 闭</el-button>
          </div>

    </el-dialog>
</template>

<script>
    import _ from 'lodash'
    import { PurchaseSkuOrderPage, PurchaseSkuOrderExport } from '@/request/purchase'
    import common from '@/views/purchaseManage/common/common'
    export default {
        name: 'originalOrderDetails',
        props: {
            editDialog: {
                type: Object,
                default: function () {}
            }
        },
        mixins: [common],
        data () {
            return {
                exportLoading: false,
                loading: false,
                orderDetail: [],
                page: {
                    pageSize: 10,
                    pageNum: 1
                },
                total: 0
            }
        },
        created () {},
        components: {},
        methods: {
            closeall () {
                this.editDialog.Original.show = false
            },
            // 分页
            handleSizeChange (val) {
                this.page.pageSize = val
                this.getOrderDetail()
            },
            handleCurrentChange (val) {
                this.page.pageNum = val
                this.getOrderDetail()
            },
            /**
             * 获取原订单详情
             */
            getOrderDetail () {
                this.loading = true
                let params = {
                    page: this.page,
                    purchaseOrderNo: this.editDialog.param.purchaseOrderNo,
                    skuCode: this.editDialog.param.skuCode
                }
                PurchaseSkuOrderPage(params).then((res) => {
                    this.loading = false
                    this.orderDetail = []
                    if (res.ret.errcode === 1) {
                        this.total = res.total
                        this.orderDetail = res.order
                        console.log(this.orderDetail)
                    } else {
                        this.$message.error(res.message)
                    }
                }).catch((err) => {
                    this.loading = false
                    console.log(err)
                })
            },
            /**
             * 导出发货单
             */
            exportOrder () {
                this.exportLoading = true
                let params = {
                    purchaseOrderNo: this.editDialog.param.purchaseOrderNo,
                    skuCode: this.editDialog.param.skuCode
                }
                PurchaseSkuOrderExport(this.filterData(params)).then(res => {
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
            }
        }
    }
</script>

<style lang="scss" scoped>
    .item-card {
        margin-bottom: 20px;
    }
</style>
