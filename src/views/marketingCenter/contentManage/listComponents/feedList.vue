<template>
    <div class="feed-list">
        <el-button icon="el-icon-plus" type="primary" size="medium" @click="addContent" style="margin-bottom: 10px;">添加文章</el-button>
        <el-button type="danger" size="medium" @click="batchDelete" class="graphic-article">批量删除</el-button>
        <el-button type="info" size="medium" @click="batchdrawal" class="graphic-article">批量撤回</el-button>
        <el-button type="primary" size="medium" @click="batchSend" class="graphic-article">批量发送</el-button>
        <el-table :data="tableData" border fit highlight-current-row style="width: 100%;height:100%" v-loading="loading" @selection-change="handleSelectionChange">
            <el-table-column type="selection" :show-overflow-tooltip="true" width="55" align="center"></el-table-column>
            <el-table-column align="center" prop="articleTitle" label="标题" width="150" >
                <template slot-scope="scope">
                    <span class="decribe">{{scope.row.articleTitle}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="articleDescribe" label="文章内容" width="150" >
                <template slot-scope="scope">
                    <span class="decribe">{{scope.row.articleDescribe}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="productId" label="商品ID" width="120" >
                <template slot-scope="scope">
                    {{scope.row.productIds[0]}}
                </template>
            </el-table-column>
            <el-table-column label="图片" align="center" min-width="100px">
                <template slot-scope="scope">
                    <div class="list-img-box" v-for="(url, i) in scope.row.coverPic"
                            @click="previewImg(scope.row.coverPic, 0)"
                            v-if="i == 0"
                            :key="i">
                        <img class="contnent-img" :src="dealShowFileSrc(url)"/>
                        <span>{{scope.row.coverPic.length}}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="视频" align="center" min-width="100px">
                <template slot-scope="scope">
                    <div v-if="scope.row.videoUrl">
                        <img class="contnent-img" @click="previewVideo(dealShowFileSrc(scope.row.videoUrl))" :src="dealShowFileSrc(scope.row.videoCover)" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="shareTitle" label="分享标题" width="150" >
                <template slot-scope="scope">
                    <span class="decribe">{{scope.row.shareTitle}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="shareDescribe" label="分享副标题" width="150" >
                <template slot-scope="scope">
                    <span class="decribe">{{scope.row.shareDescribe}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="sharePic" label="分享图片" width="150" >
                <template slot-scope="scope">
                    <div>
                        <img class="contnent-img" :src="dealShowFileSrc(scope.row.sharePic)" />
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="actualShareNumber" label="实际分享次数(基数)" width="120" >
                <template slot-scope="scope">
                    {{scope.row.actualShareNumber}}(+{{scope.row.shareBaseNumber}})
                </template>
            </el-table-column>
            <el-table-column align="center" prop="actualBrowseNumber" label="实际阅读次数(基数)" width="120" >
                <template slot-scope="scope">
                    {{scope.row.actualBrowseNumber}}(+{{scope.row.browserBaseNumber}})
                </template>
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间" width="160">
                <template slot-scope="scope">
                    {{scope.row.createTime | secondTimeFormat}}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="ic" label="发送时间" width="160">
                <template slot-scope="scope">
                    {{scope.row.sendTime | secondTimeFormat}}
                </template>
            </el-table-column>
            <el-table-column align="center" fixed="right" prop="operate" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="editContent(scope.row.articleCode)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteClick(scope.row.articleCode)" type="text" size="small">删除</el-button>
                    <el-button @click="copyContent(scope.row)" type="text" size="small">复制</el-button>
                    <el-dropdown v-show="scope.row.articleStatus === 1 || scope.row.articleStatus === 3" type="text" trigger="click" @command="handleCommand" style="margin-left: 10px;">
                        <span class="el-dropdown-link send-push">
                            发送<i class="el-icon-arrow-down"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="sendNow" @click.native="sendOption(scope.row.articleCode)">立即发送</el-dropdown-item>
                            <!-- <el-dropdown-item command="sendTimer" @click.native="sendOption(scope.row)">定时发送</el-dropdown-item> -->
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button v-show="scope.row.articleStatus === 2" @click="revokeClick(scope.row.articleCode)" type="text" size="small" style="marginLeft:10px;color:#909399">撤销发送</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="pagination-box">
            <el-pagination
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
        </div>
        <el-dialog
            v-if="showSelectLang"
            title="选择语言"
            :visible="showSelectLang"
            width="460px"
            :close-on-click-modal="false"
            :show-close="false"
        >
            <el-form :model="form" label-width="128px" ref="countryForm" :rules="rules">
                <el-form-item label="语言：" prop="lang">
                    <el-select v-model="form.lang"
                               filterable
                               multiple
                               size="medium">
                        <el-option v-for="item in languageList"
                                   :key="item.code"
                                   :label="item.desc"
                                   :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="medium" @click="cancelLangDialog">取消</el-button>
                <el-button type="primary" size="medium" @click="selectDefaultLang">确定</el-button>
            </span>
        </el-dialog>
        <content-edit-dialog
            :dialogVisible="contentEditVisible" :languageList="languageFeedList" :editType="contentEditType" :columnId="activeColumnTabs" :contentDetail="contentDetail"
            @on-cancle="handleCancleEditContent" @on-confirm="handleComfirmEditContent">
        </content-edit-dialog>
        <image-preview v-show="image.show" :close="closePreview" :index="image.index" :fileType="image.fileType" :list="image.list"></image-preview>
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText" @on-cancle="cancleConfirm" @on-confirm="submitOperate"></confirm-dialog>
    </div>
</template>
<script>
    import { FindAllSearchTag, FindAllSpecialColumn, AddSpecialSubject, EditSpecialSubject,
            SortSpecialSubject, searchArticleList, deleteArticle, sendArticle, revokeArticle,
            sortArticle, ViewArticleDetail, AddSpecialColumn, EditSpecialColumn,
            SearchArticleListBySort, AddArticle, EditArticle, copyArticleByArticleCode, CopyBannerToOther } from '@/request/manage'
    import { mapState } from 'vuex'
    import ImagePreview from '@/components/imagePreview'
    import ContentEditDialog from '../components/ContentEditDialog'
    import ConfirmDialog from '@/components/ConfirmDialog'

    export default {
        data () {
            return{
                tableData:[],
                loading:true,
                image: {
                    show: false,
                    index: 0,
                    list: [],
                    fileType: ''
                },
                contentEditVisible: false,
                contentEditType: 'add',
                contentDetail: {},
                articleCode: '',
                articleCodeList: [],
                confirmDialogTitle: '',
                confirmDialogText: '',
                confirmVisible: false,
                isTodo: 0, // 判断删除还是发送
                rules: {
                    lang: [{ required: true, message: '请选择' }]
                },
                showSelectLang: false,
                form: {
                    lang: []
                },
                languageFeedList: [],
                articlePrompt: {
                    1: '文章删除成功！',
                    2: '文章发送成功！',
                    3: '文章撤回成功！',
                    4: '文章批量删除成功！',
                    5: '文章批量发送成功！',
                    6: '文章批量撤回成功！'
                }
            }
        },
        props: {
            queryData:Object,
            activeColumnTabs:String
        },
        components:{
            ImagePreview,
            ContentEditDialog,
            ConfirmDialog
        },
        mounted() {
            this.getAllArticle()
        },
        computed: {
            ...mapState({
                initData: state => state.contentManage.initData
            }),
            languageList: {
                get: function() {
                    let languageList = JSON.parse(this.getStore('languageList'))
                    return languageList
                },
                set: function() {}
            },
        },
        methods: {
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getAllArticle()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val || this.queryData.page.pageNum
                this.getAllArticle()
            },
            handleSelectionChange (val) {
                console.log(val)
                let synchronize = []
                for (const i in val) {
                    synchronize.push(val[i].articleCode)
                }
                this.articleCodeList = synchronize
                console.log(this.articleCodeList)
            },
            // table数据
            getAllArticle (val) {
                this.loading = true
                let params = {
                    country: this.initData.countryCode,
                    specialColumnId: val ? val : this.activeColumnTabs,
                    specialSubjectId: '',
                    language: 'cn',
                    articleTitle: this.queryData.value,
                    articleStatus: this.queryData.sendStatus,
                    startTime: this.queryData.timeList ? this.queryData.timeList[0].toString() : null,
                    endTime: this.queryData.timeList ? this.queryData.timeList[1].toString() : null,
                    pageInfo: this.queryData.page,
                    tags: this.queryData.selectTag,
                    articleSortType: ''
                }
                console.log(params)
                SearchArticleListBySort(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.loading = false
                        this.tableData = res.articleViewList
                        this.total = res.total
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            editContent (articleCode) {
                console.log(this.form.lang)
                this.contentEditType = 'edit'
                this.articleCode = articleCode
                let params = {
                    articleCode: articleCode
                }
                ViewArticleDetail(params).then(res => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        for (const iterator of res.articleLangInfo) {
                            this.form.lang.push(iterator.language)
                        }
                        this.contentDetail = res
                        // this.contentEditVisible = true
                        this.showSelectLang = true
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            addContent () {
                this.contentEditType = 'add'
                // this.contentEditVisible = true
                this.showSelectLang = true
            },
            cancelLangDialog () {
                this.showSelectLang = false
                this.form.lang.splice(0)
                this.languageFeedList.splice(0)
            },
            selectDefaultLang () {
                console.log(this.form.lang)
                if (this.form.lang.length === 0) {
                    this.$message.error('请选择语言！')
                    return
                }
                for (const iterator of this.form.lang) {
                    this.languageFeedList.push(this.languageList.find((val)=>{
                        return val.code === iterator
                    }))
                }
                console.log(this.languageFeedList)
                this.showSelectLang = false
                this.contentEditVisible = true
            },
            cancleConfirm () {
                this.confirmVisible = false
            },
            sendOption (code) {
                this.articleCodeList.splice(0)
                this.articleCodeList.push(code)
            },
            submitOperate () {
                let params = {
                    articleCode: this.articleCodeList
                }
                console.log(params)
                console.log(this.isTodo)
                let map = new Map()
                map.set(1,deleteArticle)
                map.set(2,sendArticle)
                map.set(3,revokeArticle)
                map.set(4,deleteArticle)
                map.set(5,sendArticle)
                map.set(6,revokeArticle)
                map.get(this.isTodo)(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success(`${this.articlePrompt[this.isTodo]}${res.ret.msg}`)
                        this.getAllArticle()
                    } else if (res.ret.errcode === 25144) {
                        this.$message.error('banner存在不能删除文章')
                    }else if (res.ret.errcode === 25145) {
                        this.$message.error('banner存在不能撤回文章')
                    }
                }).catch(err => {
                    console.log(err)
                })
                this.confirmVisible = false
            },
            handleCancleEditContent () {
                this.form.lang.splice(0)
                this.languageFeedList.splice(0)
                this.contentEditVisible = false
                console.log(this.form.lang)
            },
            handleComfirmEditContent (data) {
                console.log(data)
                this.form.lang.splice(0)
                this.languageFeedList.splice(0)
                if (this.contentEditType === 'add') {
                    this.addArticleRequest(data)
                } else {
                    this.editArticleRequest(data)
                }
            },
            editArticleRequest (params) {
                params.articleCode = this.articleCode
                params.browseBaseNumber = params.browserBaseNumber
                EditArticle(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.contentEditVisible = false
                        this.$message.success('内容编辑成功！')
                        this.getAllArticle()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            addArticleRequest (params) {
                params.browseBaseNumber = params.browserBaseNumber
                AddArticle(this.filterData(params)).then(res => {
                    console.log(res)
                    if (res.ret.errcode === 1) {
                        this.contentEditVisible = false
                        this.$message.success('内容添加成功！')
                        this.getAllArticle()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 删除文章
            deleteClick (code) {
                this.confirmDialogTitle = '删除此内容'
                this.confirmDialogText = '删除后将无法恢复,确认删除？'
                this.confirmVisible = true
                this.isTodo = 1
                this.articleCodeList.splice(0)
                this.articleCodeList.push(code)
            },
            // 撤销发送
            revokeClick (code) {
                console.log(code)
                this.confirmDialogTitle = '撤回此内容'
                this.confirmDialogText = '内容将立即同步到前端,确认撤回？'
                this.confirmVisible = true
                this.isTodo = 3
                this.articleCodeList.splice(0)
                this.articleCodeList.push(code)
            },
            // 批量删除
            batchDelete () {
                this.confirmDialogTitle = '删除此内容（批量删除）'
                this.confirmDialogText = '删除后将无法恢复,确认删除？'
                this.confirmVisible = true
                this.isTodo = 4
            },
            // 批量撤回
            batchdrawal () {
                this.confirmDialogTitle = '发送此内容（批量撤回）'
                this.confirmDialogText = '内容将立即同步到前端,确认撤回？'
                this.confirmVisible = true
                this.isTodo = 6
            },
            // 批量发送
            batchSend () {
                this.confirmDialogTitle = '撤回此内容（批量发送）'
                this.confirmDialogText = '内容将立即同步到前端,确认发送？'
                this.confirmVisible = true
                this.isTodo = 5
            },
            copyContent (rowData) {
                this.$confirm('复制当前文章, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = {
                        country: this.initData.countryCode,
                        specialColumnId: this.activeColumnTabs,
                        articleCode: rowData.articleCode
                    }
                    copyArticleByArticleCode(params).then(res => {
                        console.log(res)
                        if (res.ret.errcode === 1) {
                            this.$message.success('文章复制成功')
                            this.getAllArticle()
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }).catch(() => {
                })
            },
            handleCommand (command) {
                if (command === 'sendNow') {
                    this.confirmVisible = true
                    this.confirmDialogTitle = '内容将立即同步到前端,确认发送？'
                    this.confirmDialogText = '是否确认发送'
                    this.confirmType = 'sendNow'
                    this.isTodo = 2
                } else if (command === 'sendTimer') {
                    this.pushTimeEditVisible = true
                }
            },
            closePreview () {
                this.image.index = 0
                this.image.show = false
            },
            previewImg (imgList, i) {
                this.image.list = imgList
                this.image.index = i
                this.image.fileType = 'image'
                this.image.show = true
            },
            // 预览视频
            previewVideo (url) {
                this.image.list = [url]
                this.image.fileType = 'video'
                this.image.show = true
            }
        }
    }
</script>
<style lang="scss" scoped>
    .feed-list{
        .list-img-box{
            width: 100%;
            height: 100px;
        }
        .decribe{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            margin: 3px 0;
            height: 50px;
        }
        .contnent-img{
            width: 100%;
            height: 100px;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                max-width: 100%;
                height: 100px;
            }
        }
        .send-push{
            color: #409EFF;
        }
        .send-push{
            font-size: 12px;
            font-weight: 450;
            cursor: pointer;
        }
    }
</style>
