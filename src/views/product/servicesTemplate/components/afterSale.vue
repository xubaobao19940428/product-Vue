<template>
    <div class="flex1 app-container">
        <div>
            <el-button icon="el-icon-plus" v-if="hasPermission('BTN_AFTER_SALE_ADD')" plain type="primary" @click="addAfterSale('add')" size="small">新 增</el-button>
        </div>
        <div class="main-content-wrapper">
            <ul class="after-sale-wrapper">
                <li v-for="(item, i) in dataList" :key="i">
                    <div class="item-l">
                        <div>
                            <span>{{ item.afterSaleId }}</span>
                            <div class="img-box"> <img :src="dealShowFileSrc(getMultiLangShowInfo(item.detailPicture))"></div>
                        </div>
                        <div>
                            <div class='range-type'>
                                <el-tooltip placement="top">
                                    <div slot="content">
                                        <b>{{ getMultiLangShowInfo(item.label) }}</b>
                                    </div>
                                    <b>{{ getMultiLangShowInfo(item.label) }}</b>
                                </el-tooltip>
                                <el-tooltip placement="top">
                                    <div slot="content">
                                        <i>
                                            {{ rangeTypeEum[item.rangeType] }}
                                            <template v-if="item.rangeType == 1">
                                                <em v-for="(cate, cateI) in item.afterSaleCate" :key="i + '-' + cateI">{{ cate.cateName }}</em>
                                            </template>
                                            <template v-if="item.rangeType == 2">
                                                <em v-for="(typeVal, typeI) in item.productType" :key="i + '-' + typeI">{{ productType[typeVal] }}</em>
                                            </template>
                                        </i>
                                    </div>
                                    <i>
                                        {{ rangeTypeEum[item.rangeType] }}
                                        <template v-if="item.rangeType == 1">
                                            <em v-for="(cate, cateI) in item.afterSaleCate" :key="i + '-' + cateI">{{ cate.cateName }}</em>
                                        </template>
                                        <template v-if="item.rangeType == 2">
                                            <em v-for="(typeVal, typeI) in item.productType" :key="i + '-' + typeI">{{ productType[typeVal] }}</em>
                                        </template>
                                    </i>
                                </el-tooltip>
                            </div>
                            <el-tooltip placement="top" :content="getMultiLangShowInfo(item.document)">
                                <div class="desc">{{ getMultiLangShowInfo(item.document) }}</div>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="item-r">
                        <div>
                            <b>{{ showType[item.showType] }}</b>
                            <em>{{ item.operatorName }}更新于{{ item.updateTime | formatTime }}</em>
                        </div>
                        <div class="item-btn-wrapper">
                            <button v-if="hasPermission('BTN_AFTER_SALE_EDIT')" @click="addAfterSale('edit', item)">修改策略</button>
                            <button v-if="hasPermission('BTN_AFTER_SALE_UPDATE_STATUS')" @click="updateStatus(item)">{{ item.status == 2 ? '启用' : '停用' }}策略</button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
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
        <c-edit :propShowDialog="editDialog.show" :rangeTypeEum="rangeTypeEum" :showType="showType"
                :propParam="editDialog.param" :productType="productType"
                @confirm="updateList" @close="editDialog.show = false"></c-edit>
    </div>
</template>
<script>
    import { listAfterSale, stopAfterSale, startAfterSale } from '@/request/pledge'
    import cEdit from './afterSaleEdit'
    import common from '@/js/common/mixins.js'
    export default {
        props: {
            showType: Object
        },
        data () {
            return {
                param: {
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                dataList: [],
                productType: {
                    0: '实物商品',
                    1: '小礼包',
                    2: '大礼包',
                    9: '虚拟商品'
                },
                rangeTypeEum: {
                    1: '按照后台类目',
                    2: '按商品类型'
                },
                totals: 0,
                editDialog: {
                    show: false,
                    param: {}
                }
            }
        },
        created () {
            console.log('售后政策')
            this.getList()
        },
        components: {
            cEdit
        },
        mixins: [common],
        methods: {
            addAfterSale (type, data) {
                this.editDialog.param = {}
                if (type == 'edit') {
                    Object.assign(this.editDialog.param, data)
                }
                this.editDialog.show = true
            },
            updateStatus (data) {
                let fetchUrl = stopAfterSale
                if (data.status == 2) {
                    fetchUrl = startAfterSale
                }
                fetchUrl({
                    afterSaleId: data.afterSaleId
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        data.status = data.status == 1 ? 2 : 1
                    }
                })
            },
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList()
            },
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                listAfterSale(this.filterData(this.param)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.afterSalePledge
                        this.totals = res.total
                    }
                })
            },
            updateList () {
                this.editDialog.show = false
                this.getList()
            }
        }
    }
</script>
<style lang="scss" scoped>
  .after-sale-wrapper {
      width: 100%;
      height: 100%;
      overflow: auto;
      margin-top: 10px;
      li{
          border: 1px solid #DCDFE6;
          margin-bottom: 10px;
          display: flex;
          justify-content: space-between;
          .item-l, .item-r{
              display: flex;
              >div:nth-child(1) {
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  span{
                      color: #999;
                      text-align: center;
                  }
                  .img-box{
                      width: 109px;
                      height: 109px;
                      border: 1px solid #DCDFE6;
                      display: flex;
                      justify-content: center;
                      align-items: flex-end;
                      img{
                          max-width: 100%;
                          max-height: 100%;
                          display: flex;
                      }
                  }
              }
          }
          .item-l {
              flex: 1;
              overflow: hidden;
              margin-right: 10px;
              box-sizing: border-box;
              padding-top: 10px;
              >div:nth-child(2) {
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  margin-left: 10px;
                  flex: 1;
                  overflow: hidden;
                  .range-type{
                      width: 100%;
                      display: flex;
                      align-items: center;
                      overflow: hidden;
                      b{
                          font-size: 30px;
                          flex: 1;
                          color: #444;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                      }
                      i{
                          flex: 1;
                          font-style: normal;
                          color: #666;
                          overflow: hidden;
                          text-overflow: ellipsis;
                          white-space: nowrap;
                          em{
                              font-weight: normal;
                              margin-right: 5px;
                          }
                      }
                  }
                  .desc{
                      width: 100%;
                      color: #666;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      margin-top: 20px;
                  }
              }
          }
          .item-r{
              >div:nth-child(1) {
                  box-sizing: border-box;
                  padding: 10px;
                  b{
                      color: rgba(217, 0, 27, 0.647058823529412);
                      font-weight: normal;
                      font-size: 14px;
                      text-align: right;
                  }
                  em{
                      color: #999;
                      font-size: 12px;
                  }
              }
              .item-btn-wrapper{
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  button{
                      background: 0;
                      border: 0;
                      color: #1890FF;
                      font-size: 14px;
                      line-height: 30px;
                      cursor: pointer;
                  }
              }
          }
      }
  }
</style>
