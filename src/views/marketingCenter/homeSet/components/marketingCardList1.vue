<template>
  <div class="app-container">
      <el-form inline>
          <el-form-item label="国家：">
              <el-select v-model="searchParam.countryCode"
                         @change="getList(1)"
                         filterable
                         clearable>
                  <el-option v-for="item in countryList"
                             :key="item.shortCode"
                             :label="item.nameLocal"
                             :value="item.shortCode">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <el-button size="medium"
                         type="primary"
                         icon="el-icon-plus"
                         v-if="hasPermission('BTN_MARKET_CARD_ADD')"
                         @click="showEditDialog('add')">新增</el-button>
              <el-button size="medium"
                         type="danger"
                         icon="el-icon-delete"
                         v-if="hasPermission('BTN_MARKET_CARD_DELETE')"
                         @click="toDeleteAll()">批量删除</el-button>
          </el-form-item>
      </el-form>
      <bg-set-list  dialogType="5" :countryList="countryList" :countryCode="searchParam.countryCode"></bg-set-list>
      <div class="main-content-wrapper">
          <el-table border height="100%" :data="dataList" ref="multipleTable" @selection-change="handleSelectionChange">
              <el-table-column fixed="left" type="selection" width="40"></el-table-column>
              <el-table-column prop="boxcardId" label="ID" align="center" min-width="100px" ></el-table-column>
              <el-table-column label="国家" min-width="100px" header-align="center">
                  <template slot-scope="scope">
                      {{ scope.row.countryCode | countryFilter }}
                  </template>
              </el-table-column>
              <el-table-column prop="name" label="名称" align="center" min-width="200px"></el-table-column>
              <el-table-column label="首页图片"
                               align="center"
                               min-width="200px">
                  <template slot-scope="scope">
                      <el-popover placement="top-start" trigger="hover">
                          <img :src="getMultiLangShowInfo(scope.row.image, 'image')" class="previewImage">
                          <img :src="getMultiLangShowInfo(scope.row.image, 'image')" class="thumbnail" slot="reference">
                      </el-popover>
                  </template>
              </el-table-column>
              <el-table-column label="列表banner"
                               align="center"
                               min-width="200px">
                  <template slot-scope="scope">
                      <el-popover placement="top-start" trigger="hover">
                          <img :src="getMultiLangShowInfo(scope.row.bannerImage, 'image')" class="previewImage">
                          <img :src="getMultiLangShowInfo(scope.row.bannerImage, 'image')" class="thumbnail" slot="reference">
                      </el-popover>
                  </template>
              </el-table-column>
              <el-table-column prop="clickNum" label="打开次数" align="center" min-width="100px"></el-table-column>
              <el-table-column label="跳转类型" min-width="100px" header-align="center">
                  <template slot-scope="scope">
                      {{ urlType[scope.row.urlType]}}
                  </template>
              </el-table-column>
              <el-table-column label="跳转链接" min-width="200px">
                  <template slot-scope="scope">
                      {{ scope.row.urlType == 2 ? appPageEnum[scope.row.url] : scope.row.url }}
                  </template>
              </el-table-column>
              <!--<el-table-column label="创建时间" align="center" min-width="180px">-->
                  <!--<template slot-scope="scope">-->
                      <!--{{scope.row.createTime | formatTime}}-->
                  <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column label="开始时间" align="center" min-width="180px">-->
                  <!--<template slot-scope="scope">-->
                      <!--{{scope.row.startTime | formatTime}}-->
                  <!--</template>-->
              <!--</el-table-column>-->
              <!--<el-table-column label="结束时间" align="center" min-width="180px">-->
                  <!--<template slot-scope="scope">-->
                      <!--{{scope.row.endTime | formatTime}}-->
                  <!--</template>-->
              <!--</el-table-column>-->
              <el-table-column label="排序"
                               align="center"
                               width="220px">
                  <template slot-scope="scope">
                      <el-input-number
                          v-model="scope.row.sort"
                          controls-position="right"
                          :min="0"
                          size="mini"
                          :precision="0"
                      ></el-input-number>
                      <el-button
                          type="primary"
                          plain
                          v-if="hasPermission('BTN_MARKET_CARD_SORT')"
                          @click="toSort(scope.row.sort, scope.row.boxcardId)"
                          size="mini"
                          style="margin-left:5px"
                      >排序</el-button>
                  </template>
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               align="center"
                               width="200px">
                  <template slot-scope="scope">
                      <el-button type="text" size="mini"
                                 v-if="hasPermission('BTN_MARKET_CARD_EDIT')"
                                 @click="showEditDialog('edit', scope.row)">编辑</el-button>
                      <el-button size="mini" type="text"
                                 v-if="hasPermission('BTN_MARKET_CARD_COPY')"
                                 @click="showEditDialog('copy', scope.row)">复制</el-button>
                      <el-button size="mini" type="text"
                                 v-if="hasPermission('BTN_MARKET_CARD_PRODUCT')"
                                 @click="toLinkGdOperatione(scope.row)">商品管理</el-button>
                      <el-button type="text" size="mini"
                                 v-if="hasPermission('BTN_MARKET_CARD_DELETE')"
                                 @click="toDelete([scope.row.boxcardId])">删除</el-button>
                  </template>
              </el-table-column>
          </el-table>
      </div>
      <div class="pagination-box">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="getList"
                         :current-page="searchParam.page.pageNum"
                         :page-sizes="[5, 10, 20, 50]"
                         :page-size="searchParam.page.pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="totals">
          </el-pagination>
      </div>
      <edit-dialog :dialogVisible="dialog.show" dialogTitle="编辑营销Card" :cardType="searchParam.cardType" :urlType="urlType" :appPageEnum="appPageEnum"  :countryList="countryList" :propParam="dialog.param" @close="closeEditDialog" @confirm="confirmEditItem"></edit-dialog>
  </div>
</template>
<script>
    import { ListBoxcard, BatchDeleteBoxcard, BoxcardSortChange } from '@/request/promotion.js'
    import editDialog from './marketingCardEdit'
    import mixins from '@/js/common/mixins.js'
    import common from '../../common/common'
    import BgSetList from './bgSetList'
    export default {
        props: {
            countryList: Array
        },
        mixins: [mixins, common],
        data () {
            return {
                searchParam: {
                    countryCode: 'MY',
                    cardType: 5, // 类型(5->营销card(跟随上腰封),7->广告card(跟随中腰封))
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                dataList: [],
                multipleSelection: [],
                dataListId: [],
                totals: 0,
                dialog: {
                    show: false,
                    param: {}
                }
            }
        },
        components: {
            editDialog,
            BgSetList
        },
        watch: {
            multipleSelection: function () {
                let arr = []
                for (let i in this.multipleSelection) {
                    arr.push(this.multipleSelection[i].boxcardId)
                }
                this.dataListId = arr
            }
        },
        created () {
            this.getList()
        },
        methods: {
            handleSizeChange (value) {
                this.searchParam.page.pageSize = value
                this.getList(1)
            },
            getList (page) {
                this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                ListBoxcard(this.filterData(this.searchParam)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.list
                        this.totals = res.total
                    }
                })
            },
            showEditDialog (type, data) {
                this.dialog.show = true
                this.dialog.param = {}
                if (type == 'edit') {
                    Object.assign(this.dialog.param, JSON.parse(JSON.stringify(data)))
                } else if (type == 'copy') {
                    Object.assign(this.dialog.param, JSON.parse(JSON.stringify(data)))
                    this.dialog.param.boxcardId = null
                }
            },
            toggleSelection (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row)
                })
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
            },
            closeEditDialog () {
                this.dialog.show = false
            },
            confirmEditItem () {
                this.dialog.show = false
                this.getList()
            },
            toSort (sort, id) {
                BoxcardSortChange({
                    'sortNo': sort,
                    'boxcardId': id
                }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.getList()
                        this.$message.success('操作成功')
                    }
                })
            },
            toDeleteAll () {
                if (this.dataListId.length === 0) {
                    this.$message('请先勾选您需操作的选项')
                    return
                }
                this.toDelete(this.dataListId)
            },
            toDelete (ids) {
                this.$confirm('此操作将永久删除所选项, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    BatchDeleteBoxcard({ 'boxcardId': ids }).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('删除成功')
                            this.getList()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            toLinkGdOperatione (row) {
                this.$router.push({
                    path: 'categoryAdProduct',
                    query: {
                        boxcardId: row.boxcardId,
                        countryCode: row.countryCode
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .editGoodsGounp {
      width: 100%;
      height: auto;
      padding: 20px 0;

    }
</style>
