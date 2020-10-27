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
                             :label="item.nameCn"
                             :value="item.shortCode">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item>
              <el-button size="medium"
                         type="primary"
                         icon="el-icon-plus"
                         v-if="hasPermission('BTN_GIRDLE_LIST_ADD')"
                         @click="showEditDialog('add')">新增</el-button>
          </el-form-item>
          <el-form-item>
              <el-button size="medium"
                         type="danger"
                         icon="el-icon-delete"
                         v-if="hasPermission('BTN_GIRDLE_LIST_DELETE')"
                         @click="toDeleteAll()">批量删除</el-button>
          </el-form-item>
      </el-form>
      <bg-set-list  dialogType="4" :countryList="countryList" :countryCode="searchParam.countryCode"></bg-set-list>
      <div class="main-content-wrapper">
          <el-table
              border
              height="100%"
              :data="dataList"
              ref="multipleTable"
              @selection-change="handleSelectionChange">
              <el-table-column fixed="left" type="selection" width="40"></el-table-column>
              <el-table-column prop="title" label="名称" align="center" min-width="100px"></el-table-column>
              <el-table-column prop="girdleId" label="ID" align="center" min-width="100px" ></el-table-column>
              <el-table-column label="腰封图片" align="center" min-width="100px">
                  <template slot-scope="scope">
                      <el-popover placement="top-start" trigger="hover">
                          <img :src="getMultiLangShowInfo(scope.row.imgUrl, 'image')" class="previewImage">
                          <img :src="getMultiLangShowInfo(scope.row.imgUrl, 'image')" class="thumbnail" slot="reference">
                      </el-popover>
                  </template>
              </el-table-column>
              <el-table-column prop="clickNum" label="打开次数" align="center" min-width="100px"></el-table-column>
              <el-table-column label="用户类型" align="center" min-width="120px">
                  <template slot-scope="scope">
                      {{ activeCrowdTypeList[scope.row.activeCrowdType] }}
                  </template>
              </el-table-column>
              <el-table-column label="跳转类型" min-width="100px" header-align="center">
                  <template slot-scope="scope">
                      {{ urlType[scope.row.urlType]}}
                  </template>
              </el-table-column>
              <el-table-column label="跳转链接" min-width="200px">
                  <template slot-scope="scope">
                      {{ scope.row.urlType == 2 ? appPageEnum[scope.row.linkUrl] : scope.row.linkUrl }}
                  </template>
              </el-table-column>
              <el-table-column label="创建时间" align="center" min-width="180px">
                  <template slot-scope="scope">
                      {{scope.row.createTime | formatTime}}
                  </template>
              </el-table-column>
              <el-table-column label="开始时间" align="center" min-width="180px">
                  <template slot-scope="scope">
                      {{scope.row.startTime | formatTime}}
                  </template>
              </el-table-column>
              <el-table-column label="结束时间" align="center" min-width="180px">
                  <template slot-scope="scope">
                      {{scope.row.endTime | formatTime}}
                  </template>
              </el-table-column>
              <el-table-column label="排序"
                               align="center"
                               width="220px">
                  <template slot-scope="scope">
                      <el-input-number
                          v-model="scope.row.sortNo"
                          controls-position="right"
                          :min="0"
                          size="mini"
                          :precision="0"
                      ></el-input-number>
                      <el-button
                          type="primary"
                          plain
                          v-if="hasPermission('BTN_GIRDLE_LIST_SORT')"
                          @click="toSort(scope.row.sortNo, scope.row.girdleId)"
                          size="mini"
                          style="margin-left:5px"
                      >排序</el-button>
                  </template>
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               align="center"
                               min-width="180px">
                  <template slot-scope="scope">
                      <el-button type="text" size="mini"
                                 v-if="hasPermission('BTN_GIRDLE_LIST_EDIT')"
                                 @click="showEditDialog('edit', scope.row)">编辑</el-button>
                      <el-button type="text" size="mini"
                                 v-if="hasPermission('BTN_GIRDLE_LIST_COPY')"
                                 @click="showEditDialog('copy', scope.row)">复制</el-button>
                      <el-button type="text" size="mini"
                                 v-if="hasPermission('BTN_GIRDLE_LIST_DELETE')"
                                 @click="toDelete(scope.row)">删除</el-button>
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
      <edit-dialog 
        :dialogVisible="dialog.show" 
        dialogTitle="腰封编辑" 
        :urlType="urlType" :appPageEnum="appPageEnum" :countryList="countryList" :type="searchParam.type" :propParam="dialog.param" @close="closeEditDialog" @confirm="confirmEditItem"></edit-dialog>
  </div>
</template>
<script>
    import { girdleAdList, batchDeleteGirdle, deleteGirdle, girdleAdSort } from '@/request/promotion.js'
    import editDialog from './girdleOrAdEdit'
    import mixins from '@/js/common/mixins.js'
    import common from '../../common/common'
    import BgSetList from './bgSetList'
    export default {
        props: {
            countryList: Array
        },
        mixins: [common, mixins],
        data () {
            return {
                searchParam: {
                    type: 4, // 4:上腰风,6:中腰风/平台广告位
                    countryCode: 'MY',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                activeCrowdTypeList: {
                    0: '新用户+老用户',
                    1: '新用户',
                    2: '老用户'
                },
                dialog: {
                    show: false,
                    param: {}
                },
                totals: 0,
                dataList: [],
                dialogVisible: false,
                multipleSelection: [],
                dataListId: []
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
                    arr.push(this.multipleSelection[i].girdleId)
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
                girdleAdList(this.filterData(this.searchParam)).then((res) => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.dataList = res.GirdleInfos
                        console.log(this.dataList)
                        this.totals = res.total
                    }
                })
            },
            toSort (sortNo, id) {
                girdleAdSort({
                    'sortNo': sortNo,
                    'GirdleId': id
                }).then(res => {
                    if (res.ret.errcode === 1) {
                        this.getList()
                        this.$message.success('操作成功')
                    }
                })
            },
            toggleSelection (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row)
                })
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
            },
            showEditDialog (type, data) {
                this.dialog.param = {}
                if (type == 'edit') {
                    Object.assign(this.dialog.param, data)
                } else if (type == 'copy') {
                    Object.assign(this.dialog.param, data)
                    this.dialog.param.girdleId = null
                }
                this.dialog.show = true
            },
            closeEditDialog () {
                this.dialog.show = false
            },
            confirmEditItem () {
                this.dialog.show = false
                this.getList()
            },
            toDeleteAll () {
                if (this.dataListId.length === 0) {
                    this.$message('请先勾选您需操作的腰封')
                    return
                }
                this.$confirm('此操作将永久删除所选腰封, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    batchDeleteGirdle({ 'girdleIds': this.dataListId }).then(res => {
                        if (res.ret.errcode === 1) {
                            this.getList()
                            this.$message.success('删除成功')
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            toDelete (row) {
                this.$confirm('此操作将永久删除所选腰封, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteGirdle({ 'girdleId': row.girdleId }).then(res => {
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
            }
        }
    }
</script>
<style lang="scss" scoped>
    header{
        width: 100%;
        height: 48px;
    }
    article{

    }
</style>
