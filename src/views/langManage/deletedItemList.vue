<template>
  <div class="app-container">
    <el-form inline>
      <el-form-item>
          <el-button plain @click="goBack" size="medium">返回</el-button>
      </el-form-item>
        <el-form-item label="" class="filter-item">
        <el-select v-model="param.languageCode"
                   @change="getTranslateList()"
                   clearable
                   size="medium">
            <el-option v-for="(val, key) in languageList"
                       :key="key"
                       :label="val.name"
                       :value="val.code"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
      <el-table :data="pageTranslateList" border>
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="variableCode" label="变量名" min-width="120px"></el-table-column>
          <el-table-column label="字符限制" align="center" prop="variableLength"></el-table-column>
          <el-table-column label="中文" :show-overflow-tooltip="true" prop="nameCn"></el-table-column>
          <el-table-column prop="nameEn" :show-overflow-tooltip="true" label="英文"></el-table-column>
          <el-table-column min-width="200" :show-overflow-tooltip="true" prop="translate"
                           :label="getSelectLangInfo().name"
                           v-if="getSelectLangInfo().name && getSelectLangInfo().code != 'cn' && getSelectLangInfo().code != 'en'"></el-table-column>
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
          <el-table-column fixed="right" label="操作" align="center"
                           min-width="100px">
                <template slot-scope="scope">
                  <div class="table-action-btn-box">
                      <el-button plain type="warning" size="mini"
                                 v-if="hasPermission('I18nTranslationService.ReEnableTranslation')"
                                 @click="reEnableItem(scope.row)">恢复
                    </el-button>
                  </div>
                </template>
            </el-table-column>
      </el-table>
      <div class="pagination-box">
          <el-pagination @size-change="handleSizeChange"
                         @current-change="getTranslateList"
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
    import {
        getDisabledTranslationList,
        reEnableTranslation
    } from '@/request/i18n.js'
    import common from './common'

    export default {
        data () {
            return {
                param: {
                    languageCode: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                totals: 0
            }
        },
        mixins: [common],
        created () {
            this.getTranslateList()
        },
        methods: {
            goBack () {
                this.$router.push({
                    name: 'translate'
                })
            },
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getTranslateList()
            },
            getTranslateList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                console.log(this.param)
                getDisabledTranslationList(this.param).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.pageTranslateList = res.variableTranslation
                        this.totals = res.total
                    }
                })
            },
            reEnableItem (data) {
                reEnableTranslation({
                    variableRefId: data.variableRefId,
                    platform: this.$route.query.platform
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('恢复成功')
                        this.getTranslateList()
                    }
                })
            }
        }
    }

</script>
