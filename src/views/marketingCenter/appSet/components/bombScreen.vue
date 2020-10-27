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
                         v-if="hasPermission('BTN_BOMB_SCREEN_ADD')"
                         @click="showEditDialog('add')">新增</el-button>
          </el-form-item>
      </el-form>
      <div class="main-content-wrapper">
          <el-table
              :data="dataList"
              height="100%"
              border
              style="width: 100%">
              <el-table-column prop="id" label="id"></el-table-column>
              <el-table-column label="国家" min-width="100px" header-align="center">
                  <template slot-scope="scope">
                      {{ scope.row.countryCode | countryFilter }}
                  </template>
              </el-table-column>
              <el-table-column label="名称">
                  <template slot-scope="scope">{{ getMultiLangShowInfo(scope.row.name) }}</template>
              </el-table-column>
              <el-table-column
                  label="图片"
                  align="center"
                  min-width="100px">
                  <template slot-scope="scope">
                      <el-popover placement="top-start" trigger="hover">
                          <img :src="getMultiLangShowInfo(scope.row.cover, 'image')" class="previewImage">
                          <img :src="getMultiLangShowInfo(scope.row.cover, 'image')" class="thumbnail" slot="reference">
                      </el-popover>
                  </template>
              </el-table-column>
              <el-table-column label="跳转类型" align="center" width="200px">
                  <template slot-scope="scope">{{ getNameByKey('typeList', scope.row.type) }}</template>
              </el-table-column>
              <el-table-column prop="url" min-width="150px" label="跳转链接">
              </el-table-column>
              <el-table-column label="弹屏状态" align="center" width="200px">
                  <template slot-scope="scope">{{ getNameByKey('bombStatusList', scope.row.bombStatus) }}</template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" align="center" width="240">
                  <template slot-scope="scope">
                      <el-button plain type="primary" size="mini"
                                 v-if="hasPermission('BTN_BOMB_SCREEN_EDIT')"
                                 @click="showEditDialog('edit', scope.row)" >编辑</el-button>
                      <el-button plain type="danger" size="mini"
                                 v-if="hasPermission('BTN_BOMB_SCREEN_DELETE')"
                                 @click="toDeleteScreen(scope.row)">删除</el-button>
                      <template  v-if="hasPermission('BTN_BOMB_SCREEN_HIDDEN')">
                          <el-button plain type="primary"
                                     size="mini"
                                     @click="toSwitchStatus(scope.row)"
                                     v-if="scope.row.status == 0">显示</el-button>
                          <el-button plain type="warning"
                                     size="mini"
                                     @click="toSwitchStatus(scope.row)"
                                     v-else>隐藏</el-button>
                      </template>
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
      <edit-dialog :dialogVisible="dialog.show" :countryList="countryList" :langList="langList"
                   :propParam="dialog.param" :title="dialog.title" :typeList="typeList"
                   :bombStatusList="bombStatusList" @close="closeDialog" @confirm="confirmAddItem"></edit-dialog>
  </div>
</template>
<script>
    import {
        getBombScreen,
        deleteBombScreen,
        changeBombScreenStatus
    } from '@/request/promotion'
    import common from '@/js/common/mixins.js'
    import editDialog from './bombScreenEdit'

    export default {
        props: {
            countryList: Array,
            langList: Array
        },
        data () {
            return {
                searchParam: {
                    type: 1,
                    countryCode: 'MY',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                dataList: [],
                totals: 0,
                dialog: {
                    show: false,
                    title: '',
                    param: {}
                },
                statusList: [{
                    key: 0,
                    name: '失效'
                }, {
                    key: 1,
                    name: '有效'
                }],
                typeList: [{
                    key: 1,
                    name: 'H5'
                }, {
                    key: 2,
                    name: 'APP'
                }],
                bombStatusList: [{
                    key: 0,
                    name: '首次弹'
                }, {
                    key: 1,
                    name: '每次弹'
                }],
                screenDialog: {
                    show: false,
                    title: '',
                    param: {
                        id: '',
                        nameCn: '',
                        nameEn: '',
                        coverCn: '',
                        coverEn: '',
                        status: 1,
                        type: 1,
                        url: '',
                        bombStatus: 0
                    },
                    rules: {
                        nameCn: [{ required: true, message: '中文名不能为空', trigger: 'change' }],
                        nameEn: [{ required: true, message: '英文名不能为空', trigger: 'change' }],
                        coverCn: [{ required: true, message: '中文图片不能为空', trigger: 'change' }],
                        coverEn: [{ required: true, message: '英文图片不能为空', trigger: 'change' }],
                        type: [{ required: true, message: '跳转类型不能为空', trigger: 'change' }],
                        bombStatus: [{ required: true, message: '弹屏状态不能为空', trigger: 'change' }],
                        url: [{ required: true, message: '跳转链接不能为空', trigger: 'change' }]
                    }
                },
                uploadFileUrl: `${process.env.VUE_APP_UPLOAD_API}`,
                uploadFileName: `${process.env.VUE_APP_UPLOAD_NAME}`,
                coverCnList: [],
                coverEnList: [],
                headers: this.$headers
            }
        },
        mixins: [common],
        components: {
            editDialog
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
                getBombScreen(this.filterData(this.searchParam)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.bombScreenInfo
                        this.totals = res.total
                    }
                })
            },
            getNameByKey (data, key) {
                let item = this[data].find((val) => {
                    return val.key == key
                })
                return item ? item.name : ''
            },
            showEditDialog (type, data) {
                this.dialog.param = {}
                this.dialog.title = '新增弹窗广告'
                if (type == 'edit') {
                    Object.assign(this.dialog.param, data)
                    this.dialog.title = '编辑弹窗广告'
                }
                this.dialog.show = true
            },
            closeDialog () {
                this.dialog.show = false
            },
            confirmAddItem () {
                this.dialog.show = false
                this.getList()
            },
            // 删除
            toDeleteScreen (data) {
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteBombScreen({
                        id: data.id
                    }).then(res => {
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
            // 显示隐藏
            toSwitchStatus (item) {
                changeBombScreenStatus({
                    id: item.id,
                    status: item.status == 0 ? 1 : 0
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.getList()
                    }
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
