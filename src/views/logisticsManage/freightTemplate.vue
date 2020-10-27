<template>
  <div class="app-container">
      <el-form inline>
          <el-form-item label="国家：">
              <el-select v-model="param.countryCode"
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
          <el-form-item class="filter-item" style="margin-left: 20px;">
              <el-button size="medium" type="primary"
                         v-if="hasPermission('BTN_FREIGHT_TEMPLATE_ADD')"
                         icon="el-icon-circle-plus"
                         @click="clickAddTemplate()">新增</el-button>
          </el-form-item>
          <el-form-item>
              <el-button size="medium" type="danger"
                         icon="el-icon-delete"
                         v-if="hasPermission('BTN_FREIGHT_TEMPLATE_BATCH_DELETE')"
                         @click="clickMultipleDelete">批量删除</el-button>
          </el-form-item>
      </el-form>
      <div class="main-content-wrapper">
          <el-table :data="currentTemplates"
                    ref="multipleTable"
                    @selection-change="handleSelectionChange"
                    border>
              <el-table-column type="expand">
                  <template slot-scope="scope">
                      <el-form
                          label-position="right"
                          inline
                          class="table-expand"
                      >
                          <el-form-item label="标题："
                                        style="width:100%">
                              <span>{{scope.row.templateName}}</span>
                          </el-form-item>
                          <el-form-item label="运送方式：">
                              <span>快递</span>
                          </el-form-item>
                          <el-form-item label="计价方式：">
                              <span>{{ scope.row.templateType == 1 ? '按重计费' : '按件计费' }}</span>
                          </el-form-item>
                          <el-form-item label="首(单位)：">
                              <span>{{scope.row.firstAmount}}</span>
                          </el-form-item>
                          <el-form-item label="运费(元)：">
                              <span>{{scope.row.firstPrice | divideFilter}}</span>
                          </el-form-item>
                          <el-form-item label="续(单位)：">
                              <span>{{scope.row.continueAmount}}</span>
                          </el-form-item>
                          <el-form-item label="续费(元)：">
                              <span>{{scope.row.continuePrice | divideFilter}}</span>
                          </el-form-item>
                      </el-form>
                  </template>
              </el-table-column>
              <el-table-column type="selection"
                               width="55"></el-table-column>
              <el-table-column label="标题"
                               min-width="50%"
                               align="center">
                  <template slot-scope="scope">
                      <span>{{scope.row.templateName}}</span>
                  </template>
              </el-table-column>
              <el-table-column label="操作"
                               min-width="30%"
                               align="center">
                  <template slot-scope="scope">
                      <el-button plain type="primary"
                                 size="mini"
                                 v-if="hasPermission('BTN_FREIGHT_TEMPLATE_EDIT')"
                                 @click="clickEditTemplate(scope.$index, scope.row)">编辑</el-button>
                      <el-button plain size="mini"
                                 type="danger"
                                 v-if="hasPermission('BTN_FREIGHT_TEMPLATE_DELETE')"
                                 @click="clickDeleteTemplate(scope.$index, scope.row)">删除</el-button>
                  </template>
              </el-table-column>
          </el-table>
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
  </div>
</template>

<script>
    import { freightTemplateListPage } from '@/request/freight.js'
    export default {
        data () {
            return {
                multipleSelection: [],
                dataListId: [],
                currentTemplates: [],
                totals: 0,
                param: {
                    countryCode: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
            }
        },
        watch: {
            multipleSelection: function () {
                let arr = []
                for (let i in this.multipleSelection) {
                    arr.push(this.multipleSelection[i].templateId)
                }
                this.dataListId = arr
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        created () {
            this.getList()
        },
        methods: {
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList()
            },
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                freightTemplateListPage(this.filterData(this.param)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.currentTemplates = res.freightTemplateUnit
                        this.totals = res.total
                    }
                })
            },
            clickAddTemplate () {
                this.$router.push({
                    name: 'freightEdit'
                })
            },
            clickEditTemplate (index, row) {
                this.$router.push({
                    name: 'freightEdit',
                    query: {
                        freightId: row.templateId
                    }
                })
            },
            clickDeleteTemplate (index, row) {
                this.$confirm('此操作将永久删除改模版, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {})
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            },
            // 批量删除
            clickMultipleDelete () {
                if (this.dataListId.length === 0) {
                    this.$message('请先勾选您需操作的商品')
                    return
                }
                let str = ''
                for (let item of this.dataListId) {
                    str += item + '|'
                }
                str = str.substr(0, str.length - 1)
                this.$confirm('此操作将永久删除所选模版, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {}).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
            }
        }
    }
</script>

<style>
.prependLabel {
  text-align: center;
  width: 80px;
  display: inline-block;
}
.appendLabel {
  text-align: center;
  width: 60px;
  display: inline-block;
}
.table-expand {
  font-size: 0;
}
.table-expand label {
  width: 90px;
  color: #99a9bf;
}
.table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
