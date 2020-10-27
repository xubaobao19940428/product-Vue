<template>
  <div class="app-container">
    <div class="operator-container">
      <el-button icon="el-icon-plus" type="primary"
                 @click="clickToAddVersion"
                 v-if="hasPermission('BTN_VERSION_MANAGE_ADD')"
                 class="operator-item"  size="small">添加版本</el-button>
    </div>
    <table-list :data="versionList">
      <template slot="columns">
        <el-table-column type="index"
                         label="序号"
                         width="50">
        </el-table-column>
        <el-table-column label="客户端类型"
                         prop="clientType"
                         align="center"
                         min-width="100px">
        </el-table-column>
        <el-table-column label="应用名"
                         align="center"
                         prop="appName"
                         min-width="100px">
        </el-table-column>
        <el-table-column label="版本ID"
                         align="center"
                         prop="versionId"
                         min-width="100px">
        </el-table-column>
        <el-table-column label="版本号"
                         align="center"
                         prop="versionCode"
                         min-width="100px">
        </el-table-column>
        <el-table-column label="更新描述（中文）"
                         align="center"
                         prop="updeteDesc"
                         min-width="200px">
        </el-table-column>
        <el-table-column label="更新描述（英文）"
                         align="center"
                         prop="updeteDescEn"
                         min-width="200px">
        </el-table-column>
        <el-table-column label="是否强更"
                         align="center"
                         min-width="100px">
          <template slot-scope="scope">
            {{ updateType[scope.row.updateType] }}
          </template>
        </el-table-column>
        <el-table-column label="更新时间"
                         align="center"
                         prop="updateDate"
                         min-width="160px">
        </el-table-column>
        <el-table-column label="创建时间"
                         align="center"
                         prop="createDate"
                         min-width="160px">
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right"
                         align="center"
                         min-width="200px">
          <template slot-scope="scope">
            <el-button
                plain
                v-if="scope.row.versionStatus != 'released' && hasPermission('BTN_VERSION_MANAGE_RELEASE')"
                type="primary"
                @click="operation(scope.row.id)"
            >发布</el-button>
            <el-button
                plain
                v-if="hasPermission('BTN_VERSION_MANAGE_EDIT')"
                type="primary"
                @click="editVersion(scope.row)"
            >编辑</el-button>
          </template>
        </el-table-column>
      </template>
    </table-list>
    <el-pagination
        @current-change="getVersionList"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next, jumper"
        :total="total"
        class="pagination"
    ></el-pagination>

    <!-- 版本信息编辑 -->
    <el-dialog title="版本信息编辑"
               :visible.sync="versionVisible"
               width="550px"
               @close="versionVisible = false">
      <el-form label-position="right"
               label-width="140px"
               :rules="versionRules"
               :model="versionDetail"
               ref="versionForm">
        <el-form-item label="应用名：" prop="appName">
          <el-input v-model="versionDetail.appName"
                    placeholder="请输入应用名"
                    :maxlength="20"
                    size="medium" style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="版本号：" prop="versionCode">
          <el-input v-model="versionDetail.versionCode"
                    placeholder="请输入版本号"
                    :maxlength="10" size="medium"
                    style="width:300px"></el-input>
        </el-form-item>
        <el-form-item label="版本ID：" prop="versionId">
          <el-input-number v-model="versionDetail.versionId"
                           :min="0"
                           :max="9999999"
                           size="medium"
                           :precision="0"
                           style="width:200px"></el-input-number>
        </el-form-item>
        <el-form-item label="客户端类型：">
          <el-select v-model="versionDetail.clientType"
                     placeholder="请选择">
            <el-option
                v-for="(val, key) in clientType"
                :key="key"
                :label="val"
                :value="key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="更新描述（中文）">
          <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="versionDetail.updeteDesc">
          </el-input>
        </el-form-item>
        <el-form-item label="更新描述（英文）：">
          <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="versionDetail.updeteDescEn">
          </el-input>
        </el-form-item>
        <el-form-item label="是否强制更新：">
          <el-radio-group v-model="versionDetail.updateType">
            <el-radio v-for="(val, key) in updateType"
                      :key="key"
                      :label="key">{{val}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="versionVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="insertVersion" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import list from '@/mixins/List'
import table from '@/components/Table'

export default {
    name: 'versionManage',
    components: {
        'table-list': table
    },
    mixins: [list],
    extends: {},
    props: {},
    data () {
        return {
            versionList: [],
            updateType: {
                Optional: '否',
                Mandatory: '是'
            },
            clientType: {
                ANDROID: '安卓',
                IOS: 'IOS'
            },
            editFlag: false,
            pageNum: 0,
            pageSize: 10,
            total: 0,
            versionVisible: false,
            versionDetail: {
                clientType: 'ANDROID',
                appName: '',
                id: null,
                versionCode: '',
                versionId: '',
                updateType: 'Optional',
                updeteDescEn: '',
                updeteDesc: ''
            },
            versionRules: {
                appName: {
                    required: true,
                    trigger: 'change',
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error('不能为空'))
                        } else if (value.length > 20) {
                            callback(new Error('应用名最多20个字'))
                        } else {
                            callback()
                        }
                    }
                },
                versionCode: {
                    required: true,
                    trigger: 'change',
                    validator: (rule, value, callback) => {
                        if (!value) {
                            callback(new Error('不能为空'))
                        } else if (value.length > 10) {
                            callback(new Error('应用名最多10个字符'))
                        } else {
                            callback()
                        }
                    }
                },
                versionId: {
                    required: true,
                    trigger: 'change',
                    validator: (rule, value, callback) => {
                        if (value === '' || value === undefined) {
                            callback(new Error('版本ID不能为空'))
                        } else {
                            callback()
                        }
                    }
                }
            }
        }
    },
    created () {
        this.getVersionList()
    },
    methods: {
        clickToAddVersion () {
            this.versionDetail = {
                clientType: 'ANDROID',
                appName: '',
                versionCode: '',
                versionId: '',
                updateType: 'Optional',
                updeteDescEn: '',
                updeteDesc: '',
                id: null
            }
            this.editFlag = false
            this.versionVisible = true
        },
        editVersion (item) {
            this.versionDetail.clientType = item.clientType
            this.versionDetail.id = item.id
            this.versionDetail.appName = item.appName
            this.versionDetail.versionId = item.versionId
            this.versionDetail.versionCode = item.versionCode
            this.versionDetail.updateType = item.updateType
            this.versionDetail.updeteDescEn = item.updeteDescEn
            this.versionDetail.updeteDesc = item.updeteDesc
            this.editFlag = true
            this.versionVisible = true
        },
        getVersionList (val) {
            if (val) {
                this.pageNum = val
            }
        },
        insertVersion () {
            this.$refs['versionForm'].validate(async (valid) => {
                if (valid) {
                    this.getVersionList()
                    this.versionVisible = false
                    this.$message({
                        type: 'success',
                        message: '版本编辑成功'
                    })
                } else {
                    return false
                }
            })
        },
        operation (id) {}
    }
}
</script>
<style lang="scss" scoped>
</style>
