<template>
    <div class="app-container">
        <div class="filter-container">
            <el-form ref="indexFilterForm" inline label-width="90px" :model="queryData">
                <el-form-item label="指标名称：" class="filter-item" prop="name">
                    <el-input v-model="queryData.name" placeholder="请输入指标名" size="medium" clearable></el-input>
                </el-form-item>
                <el-form-item label="指标键：" class="filter-item" prop="status">
                    <el-input v-model="queryData.key" placeholder="请输入指标名" size="medium" clearable></el-input>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="operator-container">
                <el-button icon="el-icon-plus" type="primary" @click="addIndex" class="operator-item" style="marginRight:10px" size="small">新建指标</el-button>
                <!-- <el-button icon="el-icon-upload2" type="primary" @click="exportIndex" class="operator-item" size="small">批量导入指标</el-button> -->
                <el-upload action="" multiple :http-request="uploadFile" :show-file-list="false" class="upload-wrapper">
                    <el-button icon="el-icon-upload2" type="primary" class="operator-item" size="small" plain>
                        批量导入指标
                    </el-button>
                </el-upload>
            </div>
        </div>
        <div class="main-content-wrapper">
            <el-table height="100%" :data="tableData" border style="width: 100%" v-loading="loading">
                <el-table-column prop="targetCategoryName" label="指标大类" align="center" width="180">
                    <template slot-scope="scope">
                        <div>{{scope.row.targetCategoryName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="targetName" label="指标名称" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.targetName}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="targetKey" label="指标键" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.targetKey}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="targetDescription" label="业务口径描述" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.targetDescription}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="状态" align="center" width="180">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.targetStatus === '1'" size="mini">有效</el-tag>
                        <el-tag v-if="scope.row.targetStatus === '2'" size="mini" type="info">失效</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center">
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime | formatTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="240">
                     <template slot-scope="scope">
                        <!-- <template>
                              <el-button plain type="primary" size="mini" @click="enableIndex(scope.row)" v-if="scope.row.status == 2">启用</el-button>
                              <el-button plain type="warning" size="mini" @click="disableIndex(scope.row)" v-else>失效</el-button>
                        </template> -->
                      <el-button plain type="primary" size="mini" @click="editIndex(scope.row)">编辑</el-button>
                      <el-button plain type="danger" size="mini" @click="deleteIndex(scope.row)">删除</el-button>
                  </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount"
                class="pagination">
            </el-pagination>
        </div>
        <index-edit-dialog :dialogVisible="editDialogVisible" :title="editDailogTitle" :categoryList="categoryList" :editType="editType" :editData="editData" :tableData="tableData"
            @on-cancle="handleCancleEdit" @on-confirm="handleConfirmEdit">
        </index-edit-dialog>
    </div>
</template>

<script>
    import IndexEditDialog from './components/IndexEditDialog'
    import { GetTargetPageByParam, DeleteTargetData, AddTargetDataByExcel } from '@/request/dataIndexManage'
    import { uploadFileRequest } from '@/request/file'

    export default {
        name: 'brandManage',
        data() {
            return {
                loading: false,
                queryData: {
                    name: '',
                    key: '',
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                brandName: '',
                tableData: [],
                totalCount: 0,
                statusList: [{
                        name: '有效',
                        value: 1
                    },
                    {
                        name: '失效',
                        value: 2
                    }
                ],
                status: '',
                editDialogVisible: false,
                editDailogTitle: '',
                editType: 'add',
                categoryList: [],
                editData:{
                    targetCategoryId: '',
                    targetCategoryName: '',
                    indexKey: '',
                    indexName: '',
                    indexDesc: '',
                    indexStatus: true,
                    targetId: ''
                }
            }
        },
        components: {
            IndexEditDialog
        },
        mounted() {
            this.getIndexList()
        },
        methods: {
            search() {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.getIndexList()
            },
            resetSearch() {
                this.queryData.page.pageNum = 1
                this.queryData.page.pageSize = 20
                this.queryData.name = ''
                this.queryData.key = ''
                this.getIndexList()
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getIndexList()
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val
                this.getIndexList()
            },
            /**
             * 获取商品类型
             */
            getIndexList() {
                let params = {
                    targetName: this.queryData.name,
                    targetKey: this.queryData.key,
                    page: this.queryData.page
                }
                GetTargetPageByParam(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        let list = []
                        for (const iterator of res.targetPageViewList) {
                            list.push({
                                id: iterator.targetCategoryId,
                                name: iterator.targetCategoryName
                            })
                        }
                        this.categoryList = _.uniqWith(list, _.isEqual)
                        console.log(this.categoryList)
                        this.tableData = res.targetPageViewList
                        this.totalCount = Number(res.total)
                    }
                })
            },
            addIndex() {
                this.editType = "add"
                this.editDialogVisible = true
                this.editDailogTitle = '新增指标'
            },
            editIndex(rowData) {
                console.log(rowData)
                this.editData.targetCategoryId = rowData.targetCategoryId
                this.editData.targetCategoryName = rowData.targetCategoryName
                this.editData.indexKey = rowData.targetKey
                this.editData.indexName = rowData.targetName
                this.editData.indexDesc = rowData.targetDescription
                this.editData.indexStatus = rowData.targetStatus === '1'?true:false
                this.editData.targetId = rowData.targetId
                console.log(this.editData)
                this.editType = "edit"
                this.editDialogVisible = true
                this.editDailogTitle = '编辑指标'
            },
            deleteIndex(rowData) {
                this.$confirm('是否删除此指标', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.toDeleteTargetData(rowData.targetId)
                }).catch(() => {
                })
            },
            enableIndex(rowData) {
                this.$confirm('是否启用此指标', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.changeIndexStatus(rowData.indexId, 1)
                }).catch(() => {
                })
            },
            disableIndex(rowData) {
                this.$confirm('是否禁用此指标', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.changeIndexStatus(rowData.indexId, 2)
                }).catch(() => {
                })
            },
            handleCancleEdit() {
                this.editDialogVisible = false
                this.getIndexList()
            },
            handleConfirmEdit() {
                this.editDialogVisible = false
                this.getIndexList()
            },
            // 删除
            toDeleteTargetData(indexId) {
                let params = {
                    targetId: indexId
                }
                DeleteTargetData(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.$message.success('删除成功！')
                        this.getIndexList()
                    }
                })
            },
            changeIndexStatus(indexId, status) {
            },
            // 导入
            exportIndex (url) {
                let params = {
                    targetDataList: url
                }
                AddTargetDataByExcel(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.$message.success('导入成功！')
                        this.getIndexList()
                    }
                })
            },
            uploadFile(file) {
                console.log(file)
                this.fileName = file.file.name
                this.uploadLoading = true
                let params = new FormData();
                let fileInfo = {
                    fileName: file.file.name,
                    type: 'other'
                }
                params.append('file',file.file);
                params.append('param', JSON.stringify(fileInfo));
                let url = '/file/rest/uploadservices/uploadfile'
                uploadFileRequest(url, params).then(res => {
                    this.uploadLoading = false
                    if (res.status === '600') {
                        this.fileUrl = res.original_link
                        console.log(this.fileUrl)
                        this.exportIndex(res.original_link)
                        this.percentage = 100
                    } else {
                        this.$message.error('上传文件失败')
                    }
                }).catch((err) => {
                    console.log(err)
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .operator-container{
        display: flex;
        justify-content: flex-start;
    }
</style>

