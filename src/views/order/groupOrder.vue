<template>
  <div class="app-container order-list-wrapper">
      <div class="filter-container">
          <el-form inline label-width="100px">
              <el-form-item label="拼团单号：" class="filter-item">
                  <el-input placeholder="请输入拼团单号" size="medium" v-model="param.groupId"></el-input>
              </el-form-item>
              <el-form-item label="订单号：" class="filter-item">
                  <el-input placeholder="请输入订单号" size="medium" v-model="param.orderId"></el-input>
              </el-form-item>
              <el-form-item label="拼团用户ID：" class="filter-item">
                  <el-input placeholder="请输入拼团用户ID" size="medium" v-model="param.userId"></el-input>
              </el-form-item>
              <el-form-item label="拼团状态：" class="filter-item">
                  <el-select v-model="groupStatusParam" clearable size="medium">
                      <el-option v-for="(item, index) in groupStatus" :key="index" :label="item.name" :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="拼团类型：" class="filter-item">
                  <el-select v-model="groupTypeParam" clearable size="medium">
                      <el-option v-for="(item, index) in groupType" :key="index" :label="item.name" :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item class="filter-item">
                  <el-button icon="el-icon-search" type="primary" @click="getList(1)" size="medium">搜索
                  </el-button>
                  <el-button icon="el-icon-refresh-left" type="primary" @click="resetSearch" size="medium">重置
                  </el-button>
              </el-form-item>
          </el-form>
      </div>
      <el-table :data="orderList" height="100%" ref="multipleTable" row-key="orderNo" current-row-key="orderNo"
                :span-method="arraySpanMethod" border>
          <el-table-column fixed="left" prop="groupId" label="拼团号" align="center" width="180px"></el-table-column>
          <el-table-column fixed="left" prop="orderId" label="订单号" align="center" width="180px"></el-table-column>
          <el-table-column label="拼团商品信息" align="center" min-width="300px">
              <template slot-scope="scope">
                  <div class="flex flex-item--center order-item">
                      <div class="flex">
                          <el-popover placement="top-start" trigger="hover">
                              <img :src="dealShowFileSrc(scope.row.productItem.skuCover)" class="previewImage">
                              <img :src="dealShowFileSrc(scope.row.productItem.skuCover)" class="thumbnail" slot="reference">
                          </el-popover>
                      </div>
                      <div class="block-right flex1">
                          <div>id：{{scope.row.productItem.productId}}</div>
                          <div @click="clickToProList(scope.row.productItem.productId)">{{scope.row.productItem.name}}</div>
                      </div>
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="values" label="商品规格" align="center" width="200px">
              <template slot-scope="scope">
                  <div>{{scope.row.productItem.attr}}</div>
                  <div>skuCode：{{scope.row.productItem.skuCode}}</div>
              </template>
          </el-table-column>
          <el-table-column label="拼团创建时间" align="center" min-width="180px">
              <template slot-scope="scope">
                  <span>{{scope.row.createTime | secondTimeFormat}}</span>
              </template>
          </el-table-column>
          <el-table-column label="拼团成功时间" align="center" min-width="180px">
              <template slot-scope="scope">
                  <span>{{scope.row.successTime | secondTimeFormat}}</span>
              </template>
          </el-table-column>
          <el-table-column label="拼团买家ID" align="center" width="100px">
              <template slot-scope="scope">
                  <div @click="clickToMemberInfo(scope.row.userId)"
                       class="pointer">
                      <div>{{ scope.row.userId }}</div>
                  </div>
              </template>
          </el-table-column>
          <el-table-column label="买家手机号" align="center" min-width="120px">
              <template slot-scope="scope">
                  <div @click="clickToMemberInfo(scope.row.userId)" class="pointer">
                      {{ scope.row.memberPhone || scope.row.userId }}
                  </div>
              </template>
          </el-table-column>
          <el-table-column label="收货人信息" min-width="180px">
              <template slot-scope="scope">
                  <div>姓名：{{ scope.row.ship.receiverName }}</div>
                  <div>手机号：{{ scope.row.ship.receiverPhone }}</div>
                  <div>地址：{{ scope.row.ship.receiverAddress }}</div>
                  <div v-if="scope.row.ship.expressNo.length > 0">物流单号：{{ scope.row.ship.expressNo.join('，') }}</div>
              </template>
          </el-table-column>
          <el-table-column prop="joinTime" label="参团时间" align="center" min-width="180px">
              <template slot-scope="scope">
                  <span>{{scope.row.jionTime | secondTimeFormat}}</span>
              </template>
          </el-table-column>
          <el-table-column label="是否支付" align="center" min-width="100px">
              <template slot-scope="scope">
                  <div v-if="scope.row.payStatus == 1">已支付</div>
                  <div v-if="scope.row.payStatus == 0">未支付</div>
              </template>
          </el-table-column>
          <el-table-column prop="priceGroup" label="拼团商品价格" align="center" width="110px">
              <template slot-scope="scope">
                  {{ getCurrencyUnit(scope.row.countryCode, 'currencyUnit') + scope.row.productItem.prive }}
              </template>
          </el-table-column>
          <el-table-column label="折扣" align="center" width="90px">
              <template slot-scope="scope">
                  {{ scope.row.productItem.discountRate }}
              </template>
          </el-table-column>
          <el-table-column prop="priceSave" label="优惠金额" align="center" min-width="90px">
              <template slot-scope="scope">
                  {{ getCurrencyUnit(scope.row.countryCode, 'currencyUnit') + scope.row.productItem.totalDiscount }}
              </template>
          </el-table-column>
          <el-table-column prop="priceSave" label="运费" align="center" min-width="90px">
              <template slot-scope="scope">
                  {{ getCurrencyUnit(scope.row.countryCode, 'currencyUnit') + scope.row.productItem.freigh }}
              </template>
          </el-table-column>
          <el-table-column label="状态" align="center" min-width="100px">
              <template slot-scope="scope">
                  <div>{{ scope.row.groupStatus | groupStatusFilter}}</div>
              </template>
          </el-table-column>
          <el-table-column label="订单状态"
                           align="center"
                           width="100px">
              <template slot-scope="scope">
                  <div>{{ scope.row.orderStatus | statusFilter }}</div>
              </template>
          </el-table-column>
          <el-table-column prop="returnPoint" label="退积分" align="center" min-width="80px">
              <template slot-scope="scope">
                  <div>{{scope.row.productItem.returnPoint || 0 }}</div>
              </template>
          </el-table-column>
      </el-table>
      <div class="pagination-box">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="getList"
                         :current-page="param.page.pageNum"
                         :page-sizes="[5, 10, 20, 50]"
                         :page-size="param.page.pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="totals">
          </el-pagination>
      </div>
  </div>
</template>

<script>
    import { groupOrderList } from '@/request/order'

    export default {
        data () {
            return {
                param: {
                    userId: '',
                    groupId: '',
                    orderId: '',
                    groupStatus: [],
                    groupType: [],
                    page: {
                        pageNum: 1,
                        pageSize: 5,
                        pagingSwitch: true
                    }
                },
                groupStatus: [{
                    name: '待成团',
                    value: 1
                }, {
                    name: '拼团成功 ',
                    value: 2
                }, {
                    name: '拼团失败',
                    value: 3
                }],
                groupType: [{
                    name: '发起拼团',
                    value: 0
                }, {
                    name: '参加拼团 ',
                    value: 1
                }],
                isHalfPrice: [{
                    name: '全部',
                    value: ''
                }, {
                    name: '否',
                    value: 1
                }, {
                    name: '是 ',
                    value: 2
                }],
                groupStatusParam: '',
                groupTypeParam: '',
                orderList: [],
                totals: 0
            }
        },
        created () {
            this.getList()
        },
        methods: {
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList(1)
            },
            resetSearch () {
                this.param = {
                    userId: '',
                    groupId: '',
                    orderId: '',
                    groupStatus: [],
                    groupType: [],
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
                this.groupStatusParam = ''
                this.groupTypeParam = ''
            },
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                this.param.groupType = this.groupTypeParam + '' == '' ? [] : [this.groupTypeParam]
                this.param.groupStatus = this.groupStatusParam + '' == '' ? [] : [this.groupStatusParam]
                groupOrderList(this.filterData(this.param)).then((res) => {
                    if (res.ret.errcode === 1) {
                        let data = []
                        for (let i = 0; i < res.groupItem.length; i++) {
                            for (let j = 0; j < res.groupItem[i].orderItem.length; j++) {
                                let item = JSON.parse(JSON.stringify(res.groupItem[i]))
                                if (j == 0) {
                                    item['rowspan'] = res.groupItem[i].orderItem.length
                                }
                                Object.assign(item, res.groupItem[i].orderItem[j])
                                data.push(item)
                            }
                        }
                        console.log(data)
                        this.orderList = data
                        this.totals = parseInt(res.total)
                    }
                })
            },
            clickToProList (id) {
                this.$router.push({
                    name: 'productList',
                    query: {
                        productId: id
                    }
                })
            },
            // 合并单元格
            arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
                let activeColumn = [0, 4, 5, 15]
                let item = activeColumn.find((val) => {
                    return val == columnIndex
                })
                if (item || columnIndex == 0) {
                    if (row.rowspan) {
                        return {
                            rowspan: row.rowspan,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            }
        }
    }
</script>
<style lang="scss">
  .order-list-wrapper {
    .flex{
      display: -webkit-box;
    }
    .el-tag {
      margin: 0 10px 10px 0;
      height: auto;
      line-height: 16px;
      box-sizing: border-box;
      padding: 5px 10px;
      white-space: normal;
    }

    .order-item {
      border-top: 1px solid #EBEEF5;
    }

    .order-item:nth-child(1) {
      border-top: 0;
    }

    .product-name {
      width: 100%;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }

  .order-btn-box {
    display: flex;
    flex-direction: column;

    .el-button + .el-button {
      margin: 0;
      margin-top: 10px;
    }
  }
</style>
