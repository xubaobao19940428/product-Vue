<template>
    <div class="graphic-table">
        <span class="sync-other-country" @click="articleSynchronize"><i class="el-icon-refresh"></i>同步选中的内容</span>
        <el-button icon="el-icon-plus" type="primary" size="medium" @click="addPruduct" class="graphic-article">添加内容</el-button>
        <el-button type="danger" size="medium" @click="batchDelete" class="graphic-article">批量删除</el-button>
        <el-button type="info" size="medium" @click="batchdrawal" class="graphic-article">批量撤回</el-button>
        <el-button type="primary" size="medium" @click="batchSend" class="graphic-article">批量发送</el-button>
        <el-table :data="tableData" ref="subjectTable" style="width: 100%;height:100%" v-loading="loading" @selection-change="handleSelectionChange" @sort-change="sortMethod">
            <el-table-column type="selection" :show-overflow-tooltip="true" width="55"></el-table-column>
            <!-- <el-table-column type="index" width="50" fixed="left" label="序号"></el-table-column> -->
            <el-table-column align="center" prop="id" label="买家秀id" width="200">
                <template slot-scope="scope">
                    <div>{{scope.row.articleCode}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="productIds" label="商品id" width="200">
                <template slot-scope="scope">
                    <div>{{scope.row.productIds.length>0?scope.row.productIds.join(','):'-'}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="content" label="列表首图" width="150">
                <template slot-scope="scope">
                    <div class="table-img">
                        <img :src="dealShowFileSrc(scope.row.coverPic[0])"/>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="left" prop="content" label="列表标题" width="120">
                <template slot-scope="scope">
                    <div>{{scope.row.articleTitle}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="sendUserName" label="标签" width="150">
                <template slot-scope="scope">
                    <div v-for="(item,index) in scope.row.contentTag" :key="index" class="tag-box">
                        {{item.tagName}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="120">
                <template slot-scope="scope">
                    <div>{{scope.row.articleStatus===1?"待发送":scope.row.articleStatus===2?"已发送":"已撤回"}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="收藏数（+ 假数）" width="160" sortable="'custom'">
                <template slot-scope="scope">
                    <div>{{scope.row.collectNum}} + {{scope.row.collectBaseNumber}}  </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="阅读数（+ 假数）" width="160" sortable="'custom'">
                <template slot-scope="scope">
                    <div>{{scope.row.actualBrowseNumber}} + {{scope.row.browserBaseNumber}}  </div>
                </template>
            </el-table-column>
            <el-table-column align="center" label="创建时间" width="160" sortable="'custom'">
                <template slot-scope="scope">
                    <div>{{scope.row.createTime | formatTime}}</div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="id" label="链接" width="300">
                <template slot-scope="scope">
                    <div>{{urlObject.location.hostname && urlObject.location.hostname==='boss-test.fingo.shop'?'http://boss-test.fingo.shop/fingo-mobile/buyerShow?articleCode='+scope.row.articleCode:'http://page.fingo.shop/buyerShow?articleCode='+scope.row.articleCode}}</div>
                </template>
            </el-table-column>
            <!-- <el-table-column align="center" prop="id" label="关联话题" width="150">
                <template slot-scope="scope">
                    <div>{{scope.row.articleTopicName}}</div>
                </template>
            </el-table-column> -->
            <!-- <el-table-column align="center" label="用户分级" width="250">
                <template slot-scope="scope">
                    <span>等级：</span>
                    <div v-for="(item,index) in scope.row.userLevel" :key="index" style="display:inline-block">
                        <span v-if="item===1">游客</span><span v-if="item==2 && scope.row.userLevel[0]!==2">+</span>
                        <span v-if="item===2">SH</span><span v-if="item==3 && scope.row.userLevel[0]!==3">+</span>
                        <span v-if="item===3">PS</span><span v-if="item==4 && scope.row.userLevel[0]!==4">+</span>
                        <span v-if="item===4">AM</span><span v-if="item==5 && scope.row.userLevel[0]!==5">+</span>
                        <span v-if="item===5">AT</span>
                    </div>
                </template>
            </el-table-column> -->
            <!-- <el-table-column align="center" prop="sort" label="排序" width="220">
                <template slot-scope="scope">
                    <el-input-number v-model="scope.row.orderIndex" controls-position="right" :precision="0" size="small" @change="artcialsortChange(scope.row.articleCode,$event)" :min="0"></el-input-number>
                    <el-button type="primary" plain size="small" class="sort-btn" @click="changeArticleSort(scope.row.articleCode,$event)">排序</el-button>
                </template>
            </el-table-column> -->
            <el-table-column align="center" prop="operate" label="操作" width="200">
                <template slot-scope="scope">
                    <el-button :disabled="scope.row.articleStatus===2" @click="editClick(scope.row)" type="text" size="small">编辑</el-button><span class="vertical-bar">|</span>
                    <el-button :disabled="scope.row.articleStatus===2" @click="deleteClick(scope.row.articleCode)" type="text" size="small">删除</el-button><span class="vertical-bar">|</span>
                    <el-button v-show="scope.row.articleStatus===1 || scope.row.articleStatus===3" @click="sendClick(scope.row.articleCode)" type="text" size="small">立即发送</el-button>
                    <el-button v-show="scope.row.articleStatus===2" @click="revokeClick(scope.row.articleCode)" type="text" size="small" style="marginLeft:0px;color:#909399">撤销发送</el-button>
                    <el-button @click="showTagDialog(scope.row)" type="text" size="small">标签配置</el-button>
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
        <confirm-dialog v-if="confirmVisible" :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText" @on-cancle="cancleConfirm" @on-confirm="submitOperate"></confirm-dialog>
        <synchronize-dialog v-if="synchronizeVisible" :dialogVisible="synchronizeVisible" :contentType="3" :synchronizeArticle="synchronizeArticle" :isChoseBanner="false" @on-cancle="handleCancleSynchronize" @on-confirm="handleComfirmSynchronize"></synchronize-dialog>
        <select-tag-dialog v-if="tagDialog.show" :propShowDialog="tagDialog.show" :articleCode="tagDialog.articleCode" @close="tagDialog.show = false" @confirm="updateTag" :propContentTag="tagDialog.tagList"></select-tag-dialog>
    </div>
</template>
<script>
    import { deleteArticle, sendArticle, revokeArticle,
             sortArticle, SearchArticleListBySort } from '@/request/manage'
    import { mapState } from 'vuex'
    import ConfirmDialog from '@/components/ConfirmDialog'
    import SynchronizeDialog from '../components/SynchronizeDialog'
    import selectTagDialog from '../components/selectTagDialog'

    export default {
        data () {
            return {
                tableData: [],
                loading: true,
                urlObject: {},
                isTodo: 0,
                confirmVisible: false,
                synchronizeVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                articleCode: [],
                synchronizeArticle: [], // 同步文章
                tagDialog: {
                    show: false,
                    articleCode: '',
                    tagList: []
                },
                articlePrompt: {
                    1: '文章删除成功！',
                    2: '文章发送成功！',
                    3: '文章撤回成功！',
                    4: '文章批量删除成功！',
                    5: '文章批量发送成功！',
                    6: '文章批量撤回成功！'
                },
                sortPrompt: {
                    "收藏数（+ 假数）": 'collectIndex',
                    "阅读数（+ 假数）": 'browIndex',
                    "创建时间": ''
                },
                articleSortType: 'orderIndex',
                sortType: ''
            }
        },
        props: {
            queryData: Object,
            active: String,
            activeColumnTabs: String,
            contentType: [String, Number]
        },
        components: {
            ConfirmDialog,
            SynchronizeDialog,
            selectTagDialog
        },
        mounted () {
            this.getAllArticle()
            this.urlObject = window
        },
        computed: {
            ...mapState({
                initData: state => state.contentManage.initData
            })
        },
        methods: {
            showTagDialog (item) {
                console.log(item)
                this.tagDialog.tagList = item.contentTag ? item.contentTag : []
                this.tagDialog.articleCode = item.articleCode
                this.tagDialog.show = true
            },
            updateTag () {
                this.tagDialog.show = false
                this.getAllArticle()
            },
            // 同步文章选择
            handleSelectionChange (val) {
                console.log(val)
                let synchronize = []
                for (const i in val) {
                    synchronize.push(val[i].articleCode)
                }
                this.synchronizeArticle = synchronize
                console.log(this.synchronizeArticle)
            },
            sortMethod (val) {
                console.log(val)
                if (val.order === "descending") {
                    this.sortType = 'desc'
                } else {
                    this.sortType = 'asc'
                }
                for (const key in this.sortPrompt) {
                    if (key === val.column.label) {
                        console.log(key)
                        this.articleSortType = this.sortPrompt[key]
                    }
                }
                this.getSortArticle()
            },
            // 点击同步按钮
            articleSynchronize () {
                if (this.synchronizeArticle.length === 0) {
                    this.$message.error('请选择同步内容！')
                    return
                }
                this.synchronizeVisible = true
            },
            handleSizeChange (val) {
                this.queryData.page.pageSize = val
                this.getAllArticle()
            },
            handleCurrentChange (val) {
                this.queryData.page.pageNum = val || this.queryData.page.pageNum
                this.getAllArticle()
            },
            handleCancleSynchronize () {
                this.synchronizeVisible = false
            },
            handleComfirmSynchronize () {
                this.synchronizeVisible = false
                this.$message({
                    message: `同步成功！`,
                    type: 'success'
                })
            },
            // table数据
            getAllArticle (val) {
                this.loading = true
                let params = {
                    country: this.initData.countryCode,
                    specialColumnId: val ? val : this.activeColumnTabs,
                    specialSubjectId: '',
                    articleTopicId: this.active,
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
            // index排序table数据
            getSortArticle () {
                // this.loading=true
                let params = {
                    country: this.initData.countryCode,
                    specialColumnId: this.activeColumnTabs,
                    specialSubjectId: '',
                    articleTopicId: this.active,
                    language: '',
                    articleTitle: this.queryData.value,
                    articleStatus: this.queryData.sendStatus,
                    startTime: this.queryData.timeList ? this.queryData.timeList[0].toString() : null,
                    endTime: this.queryData.timeList ? this.queryData.timeList[1].toString() : null,
                    pageInfo: this.queryData.page,
                    tags: this.queryData.selectTag,
                    articleSortType: this.articleSortType,
                    sortType: this.sortType
                }
                SearchArticleListBySort(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        // this.loading=false
                        this.tableData = res.articleViewList
                        this.total = res.total
                    }
                })
            },
            // 文章排序改变sort值
            artcialsortChange (code, value) {
                console.log(code, value)
                let params = {
                    articleCode: code,
                    orderIndex: value
                }
                sortArticle(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.getAllArticle()
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            // 根据sort排序
            changeArticleSort (code, value) {
                this.getSortArticle()
            },
            // 复制链接
            onCopy () {
                this.$message({
                    message: `复制成功！`,
                    type: 'success'
                })
            },
            onError () {
                this.$message.error(`复制失败！`)
            },
            // 编辑文章
            editClick (row) {
                this.$router.push({
                    name: 'contentEdit',
                    query: this.filterData({
                        articleCode: row.articleCode,
                        countryCode: this.initData.countryCode,
                        contentType: this.contentType,
                        specialColumnId: this.activeColumnTabs, // 专栏
                        topicId: row.articleTopicId // 专题
                    })
                })
                let storage = window.localStorage
                storage.countryCode=this.initData.countryCode
                storage.specialColumnId=this.activeColumnTabs
                storage.specialSubjectId=''
                storage.contentType=3
            },
            // 添加文章
            addPruduct () {
                this.$router.push({
                    name: 'contentEdit',
                    query: this.filterData({
                        countryCode: this.initData.countryCode,
                        contentType: this.contentType,
                        specialColumnId: this.activeColumnTabs, // 专栏
                        topicId: this.active // 专题
                    })
                })
                let storage = window.localStorage
                storage.countryCode=this.initData.countryCode
                storage.specialColumnId=this.activeColumnTabs
                storage.specialSubjectId=''
                storage.contentType='3'
            },
            cancleConfirm () {
                this.confirmVisible = false
            },
            submitOperate () {
                let params = {
                    articleCode: this.articleCode
                }
                let batch = {
                    articleCode: this.synchronizeArticle
                }
                console.log(params)
                console.log(batch)
                console.log(this.isTodo)
                let map = new Map()
                map.set(1,deleteArticle)
                map.set(2,sendArticle)
                map.set(3,revokeArticle)
                map.set(4,deleteArticle)
                map.set(5,sendArticle)
                map.set(6,revokeArticle)
                map.get(this.isTodo)(this.isTodo == 1 || this.isTodo == 2 || this.isTodo == 3?params:batch).then(res => {
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
            articleMethod () {

            },
            // 删除文章
            deleteClick (code) {
                this.confirmDialogTitle = '删除此内容'
                this.confirmDialogText = '删除后将无法恢复,确认删除？'
                this.confirmVisible = true
                this.isTodo = 1
                this.articleCode.splice(0)
                this.articleCode.push(code)
            },
            // 发送
            sendClick (code, command) {
                console.log(code)
                this.confirmDialogTitle = '发送此内容'
                this.confirmDialogText = '内容将立即同步到前端,确认发送？'
                this.confirmVisible = true
                this.isTodo = 2
                this.articleCode.splice(0)
                this.articleCode.push(code)
            },
            // 撤销发送
            revokeClick (code) {
                console.log(code)
                this.confirmDialogTitle = '撤回此内容'
                this.confirmDialogText = '内容将立即同步到前端,确认撤回？'
                this.confirmVisible = true
                this.isTodo = 3
                this.articleCode.splice(0)
                this.articleCode.push(code)
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
            }
        }
    }
</script>
<style lang="scss" scoped>
    .graphic-table{
        .table-img{
            display: flex;
            align-items: center;
            justify-content: center;
            img{
                width: 80px;
            }
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
        .decribe{
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
            margin: 3px 0;
            height: 50px;
        }
        .tag-box{
            // width: 50px;
            height: 25px;
            line-height: 25px;
            margin: 5px 10px 5px 0;
            padding: 0px 5px;
            border: 1px solid #fbc4c4;
            border-radius: 3px;
            background-color: #fef0f0;
            color: #f56c6c;
            float: left;
            text-align: center;
        }
        .copy-link{
            width: 900px;
            text-align: left;
            position: absolute;
            top: 0px;
            left: 71px;
            cursor: pointer;
            z-index: 1;
        }
        .vertical-bar{
            color: #b0b0b0;
        }
        .copy-link-content,.send-push{
            color: #409EFF;
        }
        .send-push{
            font-size: 12px;
            font-weight: 450;
            cursor: pointer;
        }
        .sort-btn{
            margin-left: 5px;
        }
        .graphic-articl{
            margin-bottom: 10px;
        }
        .sync-other-country{
            color: #409EFF;
            z-index: 1;
            color: #409EFF;
            position: absolute;
            right: 20px;
            top: 55px;
            width: 110px;
            font-size: 12px;
            cursor: pointer;
        }
    }
</style>
