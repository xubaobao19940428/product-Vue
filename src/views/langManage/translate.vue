<template>
  <div class="app-container translate-wrapper">
        <el-tabs v-model="activeSystem" @tab-click="handleClick">
            <el-tab-pane v-for="(item, index) in systemList" :key="index" :label="item.label" :name="item.val">
                
            </el-tab-pane>
        </el-tabs>
      <el-form inline label-width="80px">
            <el-form-item label="变量名：">
                <el-input placeholder="请输入" @keyup.enter="getList(1,activeSystem)" size="medium" v-model="searchParam.variableCodeKey"></el-input>
            </el-form-item>
            <el-form-item label="中文：">
                <el-input placeholder="请输入" @keyup.enter="getList(1,activeSystem)"  size="medium" v-model="searchParam.nameCnKey"></el-input>
            </el-form-item>
            <el-form-item label="英文：">
                <el-input placeholder="请输入" @keyup.enter="getList(1,activeSystem)"  size="medium" v-model="searchParam.nameEnKey"></el-input>
            </el-form-item>
          <el-form-item label="翻译项：">
              <el-input placeholder="请输入" @keyup.enter="getList(1,activeSystem)"  size="medium" v-model="searchParam.translationKey"></el-input>
          </el-form-item>
          <el-form-item label="语言：" class="filter-item">
              <el-select v-model="searchParam.languageCode" @change="getList(1,activeSystem)" clearable size="medium">
                  <el-option v-for="(val, key) in languageList" :key="key" :label="val.name" :value="val.code"></el-option>
              </el-select>
          </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="getList(1,activeSystem)" v-preventReClick="1000" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
            </el-form-item>
      </el-form>
      <el-form>
          <el-form-item class="filter-item">
              <el-button icon="el-icon-edit" plain type="primary" size="medium"
                         @click="triggerToModulePage"
                         v-if="hasPermission('BTN_LANG_MANAGE_TO_MODULE_PAGE')" >编辑语言模板</el-button>
              <el-button icon="el-icon-delete" plain type="primary" size="medium"
                         @click="triggerToDelPage"
                         v-if="hasPermission('BTN_LANG_MANAGE_TO_DEL_PAGE')">已删除项</el-button>
              <el-button icon="el-icon-download" plain type="primary" size="medium"
                         @click="exportSelectedTemplate"
                         v-if="hasPermission('BTN_LANG_MANAGE_EXPORT_SELECT')">导出所选</el-button>
              <el-button icon="el-icon-download" plain type="primary" size="medium"
                         @click="exportAllTemplate"
                         v-if="hasPermission('BTN_LANG_MANAGE_EXPORT_ALL')">导出全部</el-button>
          </el-form-item>
      </el-form>
      <div class="content-wrapper main-content-wrapper">
          <div class="content-header">
              <el-tabs v-model="moduleTabActive" type="border-card" @tab-click="switchModuleTab">
                  <el-tab-pane label="总览" name="all"></el-tab-pane>
                  <el-tab-pane v-for="(item, key) in moduleList"
                               :key="key"
                               :label="item.moduleName"
                               :name="String(key)"></el-tab-pane>
              </el-tabs>
          </div>
          <div class="content">
              <template v-if="moduleTabActive != 'all'">
                  <el-tabs v-model="pageTabActive" type="card" @tab-click="switchPageTab">
                      <el-tab-pane v-for="(pageItem, pageI) in moduleList[parseInt(moduleTabActive)].pageInfo"
                                   :key="pageI"
                                   :label="pageItem.pageName"
                                   :name="String(pageI)"></el-tab-pane>
                  </el-tabs>
                  <el-form inline v-if="moduleList[parseInt(moduleTabActive)].pageInfo.length > 0">
                      <el-form-item class="filter-item">
                          <el-button  plain size="mini" type="primary"
                                      v-if="hasPermission('I18nModulePageService.PageVariableAdd')"
                                      @click="translateModuleAction('add')">新增翻译项</el-button>
                      </el-form-item>
                  </el-form>
              </template>
              <div class="table-wrapper">
                  <el-table ref="multipleTable"
                            :data="pageTranslateList"
                            height="100%"
                            border
                            @selection-change="handleSelectionChange">
                      <el-table-column fixed="left" type="selection" width="40"></el-table-column>
                      <el-table-column type="index" label="序号" width="50"></el-table-column>
                      <template v-if="moduleTabActive == 'all'">
                          <el-table-column prop="moduleName" label="模板名" min-width="120px" align="center"></el-table-column>
                          <el-table-column prop="pageName" label="页面名" min-width="120px" align="center"></el-table-column>
                      </template>
                      <el-table-column prop="variableCode" label="变量名" min-width="120px"></el-table-column>
                      <el-table-column label="字符限制" align="center" prop="variableLength"></el-table-column>
                      <el-table-column label="中文" :show-overflow-tooltip="true" prop="nameCn"></el-table-column>
                      <el-table-column label="英文" min-width="200">
                          <template slot-scope="scope">
                              <div @click="translateModuleAction('edit', scope.row, scope.$index, 'English')"
                                   class="translate-box pointer">
                                  <el-tooltip class="item" effect="dark" :content="scope.row.nameEn" placement="top-start">
                                      <span>{{ scope.row.nameEn }}</span>
                                  </el-tooltip>
                                  <i class="el-icon-edit" v-if="hasPermission('BTN_LANG_MANAGE_EDIT_TRANSLATE_ITEM')"></i>
                              </div>
                          </template>
                      </el-table-column>
                      <el-table-column min-width="200" :label="getSelectLangInfo().name"
                                       v-if="getSelectLangInfo().name && getSelectLangInfo().code != 'cn' && getSelectLangInfo().code != 'en'">
                          <template slot-scope="scope">
                              <div @click="translateItemAction('edit', scope.row, scope.$index)"
                                   class="translate-box pointer">
                                  <el-tooltip class="item" effect="dark" placement="top-start"
                                              v-show="scope.row.translation"
                                              :content="scope.row.translation">
                                      <span>{{ scope.row.translation }}</span>
                                  </el-tooltip>
                                  <i class="el-icon-edit"
                                     v-if="hasPermission('BTN_LANG_MANAGE_EDIT_TRANSLATE_ITEM')"></i>
                                  <i class="el-icon-delete mar-l-10"
                                     @click.stop="translateModuleAction('delete', scope.row, scope.$index)"
                                     v-if="hasPermission('I18nTranslationService.DisableTranslation') && scope.row.translation"></i>
                              </div>
                          </template>
                      </el-table-column>
                      <el-table-column width="160" label="添加时间" align="center">
                          <template slot-scope="scope">
                              {{ scope.row.createTime | formatTime }}
                          </template>
                      </el-table-column>
                      <el-table-column width="160" label="修改时间" align="center">
                          <template slot-scope="scope">
                              {{ scope.row.updateTime | formatTime }}
                          </template>
                      </el-table-column>
                      <el-table-column fixed="right" label="操作" align="center" width="100px">
                          <template slot-scope="scope">
                              <div class="table-action-btn-box">
                                  <el-button plain
                                             type="primary"
                                             v-if="hasPermission('I18nModulePageService.PageVariableUpdate')"
                                             @click="translateModuleAction('edit', scope.row, scope.$index)"
                                             size="mini">编辑
                                  </el-button>
                              </div>
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
          </div>
      </div>
    <!--添加修改翻译模板-->
      <page-variable-edit :propShowAlert="translateModuleAlert.show"
                          @close="closeTranslateModuleAlert"
                          :source="translateModuleAlert.source"
                          :title="translateModuleAlert.title"
                          :propParam="translateModuleAlert.param"
                          :platform="activeSystem"></page-variable-edit>
    <!--添加修改翻译项-->
      <translate-item :propShowAlert="translateItemAlert.show"
                      @close="closeTranslateAlert"
                      :title="translateItemAlert.title"
                      :propParam="translateItemAlert.param"
                      :platform="activeSystem"></translate-item>
  </div>
</template>
<script>
    import { disableTranslation, exportVariableTranslationTemplate, exportSelectedVariableTranslationTemplate } from '@/request/i18n.js'
    import common from './common'
    import pageVariableEdit from './components/pageVariableEdit'
    import translateItem from './components/translateItem'

    export default {
        data () {
            return {
                activeSystem:'APP',
                systemList:[{
                    val: 'APP',
                    label: 'APP'
                },{
                    val: 'SCS',
                    label: '商家系统'
                },{
                    val: 'WMS',
                    label: 'WMS'
                }],
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                moduleTabActive: 'all',
                pageTabActive: '0',
                multipleSelection: [],
                translateModuleAlert: {
                    title: '新增翻译模板',
                    show: false,
                    source: '',
                    param: {}
                },
                translateItemAlert: {
                    title: '翻译',
                    show: false,
                    param: {}
                }
            }
        },
        mixins: [common],
        components: {
            pageVariableEdit,
            translateItem
        },
        created () {
            this.getModuleList()
            this.getList()
        },
        methods: {
            handleClick (val) {
                this.activeSystem = val.name
                // console.log(this.searchParam.page.pageNum)
                this.getList(this.searchParam.page.pageNum,this.activeSystem)
                this.getModuleList(this.activeSystem)
            },
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = '展开';
                    this.dropDownIcon = 'el-icon-arrow-down';
                } else {
                    this.dropDownContent = '收起';
                    this.dropDownIcon = 'el-icon-arrow-up';
                }
                this.drop = !this.drop;
            },
            // 导出所选
            exportSelectedTemplate () {
                exportSelectedVariableTranslationTemplate({
                    variableTranslation: this.multipleSelection
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        let a = document.createElement('a')
                        a.href = this.dealShowFileSrc(res.fileUrl)
                        a.click()
                    }
                })
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
            },
            // 导出所有
            exportAllTemplate () {
                if (!this.searchParam.languageCode) {
                    return this.$message.warning('请选择语言')
                }
                exportVariableTranslationTemplate({
                    languageCode: this.searchParam.languageCode,
                    platform: this.activeSystem
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        let a = document.createElement('a')
                        a.href = this.dealShowFileSrc(res.fileUrl)
                        a.click()
                    }
                })
            },
            triggerToModulePage () {
                this.$router.push({
                    name: 'langModule',
                    query: {
                        platform: this.activeSystem
                    }
                })
            },
            triggerToDelPage () {
                this.$router.push({
                    name: 'deletedItemList',
                    query: {
                        platform: this.activeSystem
                    }
                })
            },
            resetSearch () {
                Object.assign(this.searchParam, {
                    languageCode: '',
                    variableCodeKey: '',
                    nameCnKey: '',
                    nameEnKey: '',
                    translationKey: '',
                    pageId: '0',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                })
            },
            // 翻译项模板操作
            translateModuleAction (type, item, itemI, source) {
                switch (type) {
                    case 'add':
                        this.translateModuleAlert.title = '新增翻译模块'
                        let pageItem = this.moduleList[this.moduleTabActive].pageInfo[this.pageTabActive]
                        Object.assign(this.translateModuleAlert.param, {
                            variableId: '',
                            pageId: pageItem.pageId,
                            variableCode: '',
                            nameCn: '',
                            nameEn: '',
                            translate: '',
                            languageCode: this.searchParam.languageCode,
                            variableLength: 500
                        })
                        this.translateModuleAlert.show = true
                        break
                    case 'edit':
                        this.translateModuleAlert.title = '编辑翻译模块'
                        Object.assign(this.translateModuleAlert.param, {
                            variableId: item.variableId,
                            pageId: item.pageId,
                            variableCode: item.variableCode,
                            nameCn: item.nameCn,
                            nameEn: item.nameEn,
                            translate: item.translate,
                            languageCode: this.searchParam.languageCode,
                            variableLength: item.variableLength
                        })
                        this.translateModuleAlert.source = source
                        this.translateModuleAlert.show = true
                        break
                    case 'delete':
                        this.$confirm('确认删除?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(async () => {
                            disableTranslation({
                                variableRefId: item.variableRefId,
                                platform:this.activeSystem
                            }).then((res) => {
                                if (res.ret.errcode === 1) {
                                    this.$message.success('删除成功')
                                    this.getList()
                                }
                            })
                        })
                        break
                }
            },
            closeTranslateModuleAlert () {
                this.translateModuleAlert.show = false
                this.getList()
            },
            // 翻译项操作
            translateItemAction (type, item, i) {
                if (this.hasPermission('BTN_LANG_MANAGE_EDIT_TRANSLATE_ITEM')) {
                    Object.assign(this.translateItemAlert.param, {
                        nameCn: item.nameCn,
                        nameEn: item.nameEn,
                        variableId: item.variableId,
                        translation: item.translate,
                        languageCode: this.searchParam.languageCode,
                        variableRefId: '',
                        variableLength: item.variableLength
                    })
                    this.translateItemAlert.show = true
                }
            },
            closeTranslateAlert () {
                this.translateItemAlert.show = false
                this.getList()
            },
            // module tab切换
            switchModuleTab () {
                this.searchParam.pageId = null
                this.page = 1
                this.total = 0
                this.pageTranslateList = []
                this.pageTabActive = '0'
                if (this.moduleTabActive == 'all') {
                    this.searchParam.pageId = '0'
                } else {
                    let pageItem = this.moduleList[this.moduleTabActive].pageInfo[this.pageTabActive]
                    if (pageItem) {
                        this.searchParam.pageId = pageItem.pageId
                    }
                }
                if (this.searchParam.pageId || this.searchParam.pageId == 0) {
                    this.getList()
                }
            },
            // page tab 切换
            switchPageTab () {
                this.searchParam.pageId = null
                this.page = 1
                this.total = 0
                this.pageTranslateList = []
                let pageItem = this.moduleList[this.moduleTabActive].pageInfo[this.pageTabActive]
                if (pageItem) {
                    this.searchParam.pageId = pageItem.pageId
                }
                if (this.searchParam.pageId || this.searchParam.pageId == 0) {
                    this.getList()
                }
            }
        }
    }

</script>
<style lang="scss">
  .translate-wrapper{
    .content-wrapper{
      border: 1px solid #dcdfe6;
      box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      .content-header{
        .el-tabs--border-card{
          border: 0;
          box-shadow: none;
        }
        .el-tabs__content{
          display: none;
        }
        .el-tabs--border-card>.el-tabs__header{
          border: 0;
        }
      }
      .content{
          box-sizing: border-box;
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          .table-wrapper{
              flex: 1;
              overflow: hidden;
          }
      }
    }
  }
</style>
