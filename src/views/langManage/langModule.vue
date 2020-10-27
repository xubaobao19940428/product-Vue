<template>
  <div class="app-container">
      <el-form inline>
          <el-form-item>
              <el-button plain @click="goBack" size="medium">返回</el-button>
          </el-form-item>
          <el-form-item class="filter-item">
              <el-button icon="el-icon-plus" plain type="primary" size="medium" v-if="hasPermission('I18nModulePageService.ModuleAdd')"
                         @click="moduleAction('add')">添加模块</el-button>
          </el-form-item>
          <el-form-item class="mar-l-50" label="导入设置：">
              <div class="flex align-center">
                  <el-radio-group v-model="uploadParam.isUpdateAll" class="mar-r-20">
                      <el-radio v-for="(item, i) in selectList" :key="i" :label="item.key">{{ item.name }}</el-radio>
                  </el-radio-group>
                  <el-upload
                      class="avatar-uploader"
                      v-if="hasPermission('I18nTranslationService.ImportVariableTranslationTemplate')"
                      :action="uploadFileUrl"
                      :data="uploadParam"
                      :headers="headers"
                      :name="uploadFileName"
                      :show-file-list="false"
                      :on-error="uploadError"
                      :before-upload="uploadBefore"
                      :on-success="importModule">
                      <el-button icon="el-icon-upload"
                                 :loading="loading"
                                 plain
                                 size="medium">导入模板和翻译项</el-button>
                  </el-upload>
              </div>
          </el-form-item>
      </el-form>
      <el-table :data="moduleList"
                height="100%"
                border>
          <el-table-column type="expand">
              <template slot-scope="scope">
                  <div class="detail-table-wrapper">
                      <el-table :data="scope.row.pageInfo" border>
                          <el-table-column prop="pageName" label="页面名称"></el-table-column>
                          <el-table-column label="翻译项" prop="variableItemSum" align="center"></el-table-column>
                          <el-table-column label="添加时间" min-width="180px">
                              <template slot-scope="scope">
                                  {{ scope.row.createTime | formatTime }}
                              </template>
                          </el-table-column>
                          <el-table-column label="操作" min-width="100px" align="center">
                              <template slot-scope="scope">
                                  <el-button  plain size="mini" v-if="hasPermission('I18nModulePageService.ModulePageUpdate')" type="success"
                                              @click="pageAction('edit', scope.row, scope.$index)">编辑页面</el-button>
                              </template>
                          </el-table-column>
                      </el-table>
                  </div>
              </template>
          </el-table-column>
          <el-table-column prop="moduleName" min-width="120px" label="模板名称"></el-table-column>
          <el-table-column label="页面数" prop="pageSum" align="center"></el-table-column>
          <el-table-column label="翻译项" prop="variableItemSum" align="center"></el-table-column>
          <el-table-column label="添加时间" min-width="180px">
              <template slot-scope="scope">
                  {{ scope.row.createTime | formatTime }}
              </template>
          </el-table-column>
          <el-table-column label="更新时间" min-width="180px">
              <template slot-scope="scope">
                  {{ scope.row.updateTime | formatTime }}
              </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" min-width="200px" align="center">
              <template slot-scope="scope">
                  <el-button plain type="primary" size="small" v-if="hasPermission('I18nModulePageService.ModulePageAdd')"
                             @click="pageAction('add', scope.row, scope.$index)">添加页面</el-button>
                  <el-button plain size="small" type="success" v-if="hasPermission('I18nModulePageService.ModuleUpdate')"
                             @click="moduleAction('edit', scope.row, scope.$index)">编辑模块</el-button>
              </template>
          </el-table-column>

      </el-table>
        <!--添加编辑模块-->
      <module-edit :propShowAlert="moduleAlert.show"
                        @close="closeModuleAlert"
                        :title="moduleAlert.title"
                        :propParam="moduleAlert.param"
                        :platform="this.$route.query.platform"></module-edit>
        <!--添加编辑页面-->
      <page-module-edit :propShowAlert="pageModuleAlert.show"
                        @close="closePageModuleAlert"
                        :title="pageModuleAlert.title"
                        :propParam="pageModuleAlert.param"></page-module-edit>
  </div>
</template>
<script>
    import {
        importVariableTranslationTemplate
    } from '@/request/i18n'
    import common from './common'
    import moduleEdit from './components/moduleEdit'
    import pageModuleEdit from './components/pageModuleEdit'

    export default {
        data () {
            return {
                uploadFileUrl: `${process.env.VUE_APP_FILE_URL}/file/rest/uploadservices/uploadfile`,
                uploadFileName: 'file',
                headers: this.$headers,
                uploadParam: {
                    isUpdateAll: false
                },
                selectList: [{
                    key: true,
                    name: '更新所有'
                }, {
                    key: false,
                    name: '仅更新翻译项'
                }],
                loading: false,
                moduleAlert: {
                    title: '新增模块',
                    show: false,
                    param: {}
                },
                pageModuleAlert: {
                    title: '新增页面',
                    show: false,
                    param: {}
                }
            }
        },
        components: {
            moduleEdit,
            pageModuleEdit
        },
        mixins: [common],
        created () {
            this.getModuleList(this.$route.query.platform)
        },
        methods: {
            uploadBefore (file) {
                this.loading = true
                Object.assign(this.uploadParam, {
                    param: JSON.stringify({
                        type: 'other',
                        fileName: file.name
                    })
                })
            },
            goBack () {
                this.$router.push({
                    name: 'translate'
                })
            },
            importModule (res) {
                if (res.status == '600') {
                    importVariableTranslationTemplate({
                        fileDownloadUrl: res.original_link,
                        isUpdateAll: this.uploadParam.isUpdateAll,
                        platform: this.$route.query.platform
                    }).then((res) => {
                        this.loading = false
                        if (res.ret.errcode === 1) {
                            this.$message.success('导入成功')
                        }
                    }).catch(() => {
                        this.loading = false
                    })
                } else {
                    this.$message.warning(res.message)
                    this.loading = false
                }
            },
            uploadError (err) {
                this.$message.warning(err.message)
                this.loading = false
            },
            // 模块操作
            moduleAction (type, data, dataI) {
                switch (type) {
                    case 'add':
                        this.moduleAlert.title = '新增模块'
                        Object.assign(this.moduleAlert.param, {
                            moduleName: '',
                            moduleId: ''
                        })
                        break
                    case 'edit':
                        this.moduleAlert.title = '编辑模块'
                        Object.assign(this.moduleAlert.param, {
                            moduleName: data.moduleName,
                            moduleId: data.moduleId
                        })
                        break
                }
                this.moduleAlert.show = true
            },
            closeModuleAlert () {
                this.moduleAlert.show = false
                this.getModuleList(this.$route.query.platform)
            },
            // 页面操作
            pageAction (type, pageItem, pageI) {
                switch (type) {
                    case 'add':
                        this.pageModuleAlert.title = '新增页面'
                        Object.assign(this.pageModuleAlert.param, {
                            pageName: '',
                            moduleId: pageItem.moduleId,
                            pageId: ''
                        })
                        break
                    case 'edit':
                        this.pageModuleAlert.title = '编辑页面'
                        Object.assign(this.pageModuleAlert.param, {
                            pageName: pageItem.pageName,
                            pageId: pageItem.pageId,
                            moduleId: pageItem.moduleId
                        })
                        break
                }
                this.pageModuleAlert.show = true
            },
            closePageModuleAlert () {
                this.pageModuleAlert.show = false
                this.getModuleList(this.$route.query.platform)
            }
        }
    }
</script>
<style lang="scss" scoped>
  .detail-table-wrapper{
    box-sizing: border-box;
    padding: 20px;
  }
  .avatar-uploader{
    width: 200px;
    height: 40px;
  }
</style>
