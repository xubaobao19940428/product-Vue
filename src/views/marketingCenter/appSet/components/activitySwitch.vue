<template>
  <div class="app-container">
      <el-form inline>
          <el-form-item label="国家：">
              <el-select v-model="searchParam.countryCode"
                         @change="getList()"
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
                         v-if="hasPermission('BTN_SWITCH_LIST_ADD')"
                         @click="showEditDialog('add')">新增</el-button>
          </el-form-item>
<!--          <el-form-item>-->
<!--              <el-button size="medium"-->
<!--                         type="danger"-->
<!--                         icon="el-icon-delete"-->
<!--                         v-if="hasPermission('BTN_GIRDLE_LIST_DELETE')"-->
<!--                         @click="toDeleteAll()">批量删除</el-button>-->
<!--          </el-form-item>-->
      </el-form>
      <div class="main-content-wrapper">
          <el-table
              border
              height="100%"
              :data="dataList"
              ref="multipleTable"
          >
<!--              @selection-change="handleSelectionChange"-->
<!--              <el-table-column fixed="left" type="selection" width="40"></el-table-column>-->
<!--              <el-table-column prop="name" label="名称" align="center" min-width="160px"></el-table-column>-->
              <el-table-column label="名称" min-width="180px" align="center" prop="name">
                  <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" :content="scope.row.name" placement="top">
                            <span
                                style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 2;-webkit-box-orient: vertical">
                                {{ scope.row.name || '-' }}
                            </span>
                      </el-tooltip>
                  </template>
              </el-table-column>
              <el-table-column label="浮窗图标" align="center" min-width="100px" >
                  <template slot-scope="scope">
                      <el-popover placement="top-start" trigger="hover">
                          <img :src="getMultiLangShowInfo(scope.row.cover, 'image')" class="previewImage">
                          <img :src="getMultiLangShowInfo(scope.row.cover, 'image')" class="thumbnail" slot="reference">
                      </el-popover>
                  </template>
              </el-table-column>
              <el-table-column label="浮窗链接" min-width="180px" align="center" prop="url">
                  <template slot-scope="scope">
                      <el-tooltip class="item" effect="dark" :content="scope.row.url" placement="top">
                            <span
                                style="display: -webkit-box; overflow: hidden; white-space: normal !important; text-overflow: ellipsis; word-wrap: break-word; -webkit-line-clamp: 2;-webkit-box-orient: vertical">
                                {{ scope.row.url || '-' }}
                            </span>
                      </el-tooltip>
                  </template>
              </el-table-column>
<!--              <el-table-column prop="url" label="浮窗链接" align="center" min-width="200px"></el-table-column>-->
              <el-table-column label="创建时间" align="center" min-width="160px">
                  <template slot-scope="scope">
                      {{scope.row.createTime | formatTime}}
                  </template>
              </el-table-column>
              <el-table-column label="开始时间" align="center" min-width="160px">
                  <template slot-scope="scope">
                     <span v-if="scope.row.startTime < 2147483644000">{{scope.row.startTime | formatTime}}</span>
                     <span v-else>{{ '-' }}</span>
                  </template>
              </el-table-column>
              <el-table-column label="结束时间" align="center" min-width="160px">
                  <template slot-scope="scope">
                      <span v-if="scope.row.endTime < 2147483645000">{{scope.row.endTime | formatTime}}</span>
                      <span v-else>{{ '-' }}</span>
                  </template>
              </el-table-column>
              <el-table-column fixed="right"
                               label="操作"
                               align="center"
                               width="180px">
                  <template slot-scope="scope">
                      <el-switch
                          style="margin-right: 10px"
                          v-model="scope.row.switchStatus"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          :active-value="1"
                          :inactive-value="2"
                          @change="changeSwitchstate(scope.row)">
                      </el-switch>
                      <el-button plain type="primary" size="mini"
                                 v-if="hasPermission('BTN_SWITCH_LIST_EDIT') && scope.row.switchStatus == 2"
                                 @click="showEditDialog('edit', scope.row)">编辑</el-button>
                      <el-button plain type="primary" size="mini"
                                 v-if="hasPermission('BTN_SWITCH_LIST_SHOW') && scope.row.switchStatus == 1"
                                 @click="showEditDialog('show', scope.row)">查看</el-button>
                  </template>
              </el-table-column>
          </el-table>
      </div>
      <div class="pagination-box">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="handleCurrentChange"
                         :current-page="searchParam.page.pageNum"
                         :page-sizes="[5, 10, 20, 50]"
                         :page-size="searchParam.page.pageSize"
                         layout="total, sizes, prev, pager, next, jumper"
                         :total="totals">
          </el-pagination>
      </div>
      <switch-edit :dialogVisible="dialog.show" :countryList="countryList" :propParam="dialog.param" :disableding="disableding" @close="closeEditDialog" @confirm="confirmEditItem"></switch-edit>
  </div>
</template>
<script>
    // import { batchDeleteGirdle, deleteGirdle, girdleAdSort } from '@/request/promotion.js'
    import { ListActiveFloating, ChangeActiveFloatingStatus } from '@/request/marketing.js'
    // import editDialog from './girdleEdit'
    import switchEdit from './activitySwitchEdit'
    import common from '@/js/common/mixins.js'
    export default {
        props: {
            countryList: Array
        },
        mixins: [common],
        data () {
            return {
                disableding: true,
                timeType: 0,
                switchStatusShow: false,
                loading: false,
                switch: false,
                searchParam: {
                    countryCode: 'MY',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
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
            // editDialog,
            switchEdit
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
            /**
             * 改变活动开关状态，响应函数
             */
            changeSwitchstate (data) {
                console.log(data)
                this.loading = true
                this.$confirm('是否继续操作此浮窗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    showClose: false
                }).then(() => {
                    let params = {}
                    if (data.switchStatus == 1) {
                        params = {
                            id: data.id,
                            switchStatus: 1
                        }
                    } else {
                        params = {
                            id: data.id,
                            switchStatus: 2
                        }
                    }
                    console.log(params)
                    ChangeActiveFloatingStatus(params).then((res) => {
                        if (res.ret.errcode === 1) {
                            this.getList()
                            this.loading = false
                            this.$message.success('更改状态成功')
                        } else {
                            data.switchStatus = (data.switchStatus == 1) ? 2 : 1
                            this.loading = false
                            if (res.ret.errcode === 6523) {
                                this.$message.error('已存在开启状态的浮窗!')
                            } else if (res.ret.errcode === 6525) {
                                this.$message.error('结束时间早于当前，请修改结束时间后再开启!')
                            }
                        }
                    }).catch(err => {
                        this.loading = false
                        console.log(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消操作此浮窗'
                    })
                    data.switchStatus = (data.switchStatus == 1) ? 2 : 1
                })
            },
            handleSizeChange (value) {
                this.searchParam.page.pageSize = value
                this.getList()
            },
            handleCurrentChange (value) {
                this.searchParam.page.pageNum = value
                this.getList()
            },
            getList () {
                // this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                this.dataList = []
                ListActiveFloating(this.filterData(this.searchParam)).then((res) => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.dataList = res.activeFloatingInfo
                        this.totals = res.total
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
                console.log(data)
                if (type != 'add') {
                    if (data.endTime < 2147483645900) {
                        this.timeType = 1
                    } else {
                        this.timeType = 0
                    }
                }
                this.dialog.param = {}
                if (type == 'edit') {
                    this.disableding = false
                    Object.assign(this.dialog.param, data)
                    Object.assign(this.dialog.param, {
                        title: '浮窗编辑',
                        type: 'edit',
                        timeType: this.timeType
                    })
                    console.log(this.dialog.param)
                } else if (type == 'show') {
                    this.disableding = true
                    Object.assign(this.dialog.param, data)
                    Object.assign(this.dialog.param, {
                        title: '浮窗查看',
                        type: 'show',
                        timeType: this.timeType
                    })
                } else if (type == 'add') {
                    this.disableding = false
                    Object.assign(this.dialog.param, data)
                    Object.assign(this.dialog.param, {
                        title: '浮窗信息新增',
                        type: 'add'
                        // timeType: this.timeType
                    })
                }
                this.dialog.show = true
            },
            closeEditDialog () {
                this.dialog.show = false
            },
            confirmEditItem () {
                this.dialog.show = false
                this.getList()
            }
            // toDeleteAll () {
            //     if (this.dataListId.length === 0) {
            //         this.$message('请先勾选您需操作的腰封')
            //         return
            //     }
            //     this.$confirm('此操作将永久删除所选腰封, 是否继续?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         batchDeleteGirdle({ 'girdleIds': this.dataListId }).then(res => {
            //             if (res.ret.errcode === 1) {
            //                 this.getList()
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
            // toDelete (row) {
            //     this.$confirm('此操作将永久删除所选腰封, 是否继续?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         deleteGirdle({ 'girdleId': row.girdleId }).then(res => {
            //             if (res.ret.errcode === 1) {
            //                 this.$message.success('删除成功')
            //                 this.getList()
            //             }
            //         })
            //     }).catch(() => {
            //         this.$message({
            //             type: 'info',
            //             message: '已取消删除'
            //         })
            //     })
            // }
        }
    }
</script>
<style lang="scss" scoped>
    .item{
        height: 40px;
        width: 180px;
        margin: 0 auto;
    }
    .thumbnail{
        height: 70px;
        width: 70px;
    }
    header{
        width: 100%;
        height: 48px;
    }
    article{

    }
</style>
