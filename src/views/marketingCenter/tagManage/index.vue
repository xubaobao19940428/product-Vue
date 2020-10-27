<template>
    <div class="tag-manage">
        <el-form ref="contentFilterForm" inline label-width="90px" :model="queryData">
            <el-form-item label="标签中文：" class="filter-item" prop="value" >
                <el-input v-model="queryData.value" style="width: 200px; margin-right: 20px;" size="medium" placeholder="请输入" clearable></el-input>
            </el-form-item>
            <el-form-item label="创建日期：" class="filter-item" prop="timeList">
                    <el-date-picker v-model="queryData.timeList"
                        size="medium"
                        type="daterange"
                        value-format="timestamp"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="addTag" class="add-tag">+ 添加标签</el-button>
        <el-table :data="tableData" border style="width: 100%;height:100%" v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" align="center" :show-overflow-tooltip="true" width="55"></el-table-column>
            <el-table-column align="center" label="标签名称-中文" width="200">
                <template slot-scope="scope">
                    <div>{{languageTag('cn',scope.row.tagName)}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="标签名称-英文" width="200">
                <template slot-scope="scope">
                    <div>{{languageTag('en',scope.row.tagName)}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="标签名称-马来文" width="200">
                <template slot-scope="scope">
                    <div>{{languageTag('ms',scope.row.tagName)}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="标签名称-泰文" width="200">
                <template slot-scope="scope">
                    <div>{{languageTag('th',scope.row.tagName)}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="标签名称-印尼" width="200">
                <template slot-scope="scope">
                    <div>{{languageTag('id',scope.row.tagName)}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" width="200">
                <template slot-scope="scope">
                    <div>{{scope.row.createTime | formatTime}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="editTag(scope.row)" type="text" size="small">编辑</el-button><span class="vertical-bar">|</span>
                    <el-button @click="deleteClick(scope.row.tagId)" type="text" size="small" class="delete-tag">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
        </div>
        <tag-dialog :dialogVisible="dialogVisible" :editType="editType" :tagObject="tagObject" @on-cancle="cancleEdit" @on-confirm="confirmEdit"></tag-dialog>
    </div>
</template>
<script>
    import { SearchTagList, DelTag, SaveTag } from '@/request/manage'
    import tagDialog from './compoents/tagDialog'

    export default {
        data () {
            return {
                queryData: {
                    value: '',
                    timeList: [],
                    page: {
                        pageSize: 10,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                },
                total: 0,
                tableData: [],
                loading: true,
                tagObject: {
                    cn: '',
                    en: '',
                    ms: '',
                    th: '',
                    id: ''
                },
                editType: 'add',
                dialogVisible: false,
                tagId: '',
                createTime: ''
            }
        },
        components: {
            tagDialog
        },
        mounted() {
            this.getSearchTagList()
        },
        methods: {
            getSearchTagList () {
                this.loading = true
                console.log(this.queryData.timeList)
                let params = {
                    selectParam: this.queryData.value,
                    startTime: this.queryData.timeList[0] ? this.queryData.timeList[0].toString() : null,
                    endTime: this.queryData.timeList[1] ? this.queryData.timeList[1].toString() : null,
                    pageInfo: this.queryData.page
                }
                SearchTagList(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.loading = false
                        this.tableData = res.articleTags
                        this.total = res.total
                    }
                })
            },
            languageTag (lang,tagList) {
                for (const iterator of tagList) {
                    if (lang === iterator.language) {
                        return iterator.content
                    }
                }
            },
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getSearchTagList()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val || this.queryData.page.pageNum
                this.getSearchTagList()
            },
            search () {
                this.getSearchTagList()
            },
            resetSearch () {
                this.queryData.value = '',
                this.queryData.timeList = []
                this.getSearchTagList()
            },
            deleteClick (id) {
                let params = {
                    tagId: id
                }
                DelTag(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.$message.success('删除成功！')
                    }
                })
            },
            addTag () {
                this.editType = 'add'
                this.dialogVisible = true
            },
            editTag (val) {
                this.editType = 'edit'
                this.tagId = val.tagId
                this.createTime = val.createTime
                let list = val.tagName
                for (const iterator of list) {
                    for (const key in this.tagObject) {
                        if (key === iterator.language) {
                            this.tagObject[key] = iterator.content
                        }
                    }
                }
                console.log(this.tagObject)
                this.dialogVisible = true
            },
            cancleEdit () {
                this.dialogVisible = false
            },
            confirmEdit (subjectInfo) {
                let subjectObj = []
                Object.keys(subjectInfo).forEach(function (key) {
                    if (subjectInfo[key] !== undefined) {
                        subjectObj.push({ language: key, content: subjectInfo[key] })
                    }
                })
                console.log(subjectObj)
                this.dialogVisible = false
                let params = {
                    articleTag: {
                        tagId: this.tagId,
                        createTime: this.createTime,
                        tagName: subjectObj
                    }
                }
                SaveTag(params).then(res => {
                    if(res.ret.errcode === 1) {
                        console.log(res)
                        this.tagId = ''
                        this.createTime = ''
                        if (this.edit === 'add') {
                            this.$message.success('添加标签成功！')
                        } else {
                            this.$message.success('编辑标签成功！')
                        }
                        this.getSearchTagList()
                    }
                })
                
            },
        } 
    }
</script>
<style lang="scss" scoped>
    .tag-manage{
        .add-tag{
            margin-bottom: 10px;
        }
        .vertical-bar{
            color: #b0b0b0;
        }
        .delete-tag{
            color: red;
        }
    }
</style>