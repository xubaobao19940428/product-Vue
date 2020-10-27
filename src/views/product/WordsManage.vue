<template>
    <div class="app-container">
        <el-tabs v-model="activeTab" type="card" @tab-click="handleTabClick">
            <el-tab-pane label="同义词" name="synonym"></el-tab-pane>
            <el-tab-pane label="敏感词" name="sensitive"></el-tab-pane>
        </el-tabs>
        <div class="words-filter-container">
            <el-form ref="synonymFilterForm" inline label-width="100px" :model="queryData" v-if="activeTab === 'synonym'">
                <el-form-item label="目标词：" class="filter-item" prop="leftWordStr">
                    <el-input placeholder="多个请用英文逗号,隔开" size="medium" clearable v-model="queryData.leftWordStr" @keyup.enter.native="search" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="同义词：" class="filter-item" prop="rightWordStr">
                    <el-input placeholder="多个请用英文逗号,隔开" size="medium" clearable v-model="queryData.rightWordStr" @keyup.enter.native="search" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="语种：" class="filter-item" prop="languageCode">
                    <el-select v-model="queryData.languageCode" filterable clearable size="medium" placeholder="请选择">
                        <el-option v-for="(item, index) in languageList" :key="index" :label="item.desc" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">查询</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
            <el-form ref="sensitiveFilterForm" inline label-width="100px" :model="sensitiveQueryData" v-if="activeTab === 'sensitive'">
                <el-form-item label="敏感词：" class="filter-item" prop="wordStr">
                    <el-input placeholder="多个请用英文逗号,隔开" size="medium" clearable v-model="sensitiveQueryData.wordStr" @keyup.enter.native="search" style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item label="语种：" class="filter-item" prop="languageCode">
                    <el-select v-model="sensitiveQueryData.languageCode" filterable clearable size="medium" placeholder="请选择">
                        <el-option v-for="(item, index) in languageList" :key="index" :label="item.desc" :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="敏感对象：" class="filter-item" prop="senseType">
                    <el-select v-model="sensitiveQueryData.senseType" filterable clearable size="medium" placeholder="请选择">
                        <el-option v-for="(item, index) in senseTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium" @keyup.enter.native="search">查询</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                </el-form-item>
            </el-form>
            <div class="operation">
                <el-button v-if="activeTab === 'synonym' && hasPermission('BTN_SYNONYM_WORD_ADD')"
                    icon="el-icon-plus" type="primary" size="medium" @click="addSynonym()">
                    新增
                </el-button>
                <el-button v-if="activeTab === 'sensitive' && hasPermission('BTN_SENSITIVE_WORD_ADD')"
                    icon="el-icon-plus" type="primary" size="medium" @click="addSensitive()">
                    新增
                </el-button>
            </div>
        </div>
        <div class="main-content-wrapper">
            <el-table v-if="activeTab === 'synonym'" border height="100%" :data="synonymTableList" v-loading="loading">
                <el-table-column key="1" prop="id" label="词条ID" align="center" min-width="100px" fixed="left"></el-table-column>
                <el-table-column key="2" prop="languageCode" label="语种" align="center" width="170px">
                </el-table-column>
                <el-table-column key="3" prop="leftWord" label="目标词" align="center" min-width="170px">
                </el-table-column>
                <el-table-column key="10" prop="rightWord" label="同义词" align="center" min-width="170px">
                </el-table-column>
                <el-table-column key="5" prop="flag" label="匹配类型" align="center" width="150px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.flag === 0">双向</span>
                        <span v-if="scope.row.flag === 1">单向</span>
                    </template>
                </el-table-column>
                <el-table-column key="7" prop="createTime" label="创建时间" align="center" width="170px">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | secondTimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column key="8" prop="updateTime" label="更新时间" align="center" width="170px">
                    <template slot-scope="scope">
                        <span>{{scope.row.updateTime | secondTimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column key="9" fixed="right" label="操作" align="center" min-width="130px">
                    <template slot-scope="scope">
                        <el-button
                            v-if="hasPermission('BTN_SYNONYM_WORD_EDIT')"
                            type="text" size="mini"
                            @click="modifySynonym(scope.row)">编辑</el-button>
                        <el-button
                            v-if="hasPermission('BTN_SYNONYM_WORD_DEL')"
                            type="text" size="mini"
                            @click="delSynonym(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-table v-if="activeTab === 'sensitive'" border height="100%" :data="sensitiveTableList" v-loading="loading">
                <el-table-column key="1" prop="id" label="词条ID" align="center" min-width="100px" fixed="left"></el-table-column>
                <el-table-column key="2" prop="languageCode" label="语种" align="center" min-width="170px">
                </el-table-column>
                <el-table-column key="3" prop="word" label="敏感词" align="center" min-width="170px">
                </el-table-column>
                <el-table-column key="4" prop="senseType" label="屏蔽对象" align="center" min-width="170px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.senseType === 1">标题</span>
                        <span v-if="scope.row.senseType === 2">属性</span>
                    </template>
                </el-table-column>
                <el-table-column key="6" prop="createTime" label="创建时间" align="center" width="170px">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | secondTimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column key="5" prop="updateTime" label="更新时间" align="center" width="170px">
                    <template slot-scope="scope">
                        <span>{{scope.row.updateTime | secondTimeFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column key="7" fixed="right" label="操作" align="center" min-width="130px">
                    <template slot-scope="scope">
                        <el-button
                            v-if="hasPermission('BTN_SENSITIVE_WORD_EDIT')"
                            type="text"
                            size="mini"
                            @click="modifySensitive(scope.row)">编辑</el-button>
                        <el-button
                            type="text"
                            size="mini"
                            v-if="hasPermission('BTN_SENSITIVE_WORD_DEL')"
                            @click="delSensitive(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination
                v-if="activeTab === 'synonym'"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="queryData.page.pageNum"
                :page-size="queryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                class="pagination">
            </el-pagination>
            <el-pagination
                v-if="activeTab === 'sensitive'"
                @current-change="handleSensitiveCurrentChange"
                @size-change="handleValueSizeChange"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="sensitiveQueryData.page.pageNum"
                :page-size="sensitiveQueryData.page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="sensitiveTotal"
                class="pagination">
            </el-pagination>
        </div>
        <synonym-edit-dialog :dialogVisible="synonymDialogVisible" :synonymModel="synonymModel" :editType="editType"  @on-cancle="cancleSynonymEdit" @on-confirm="confirmSubmit"></synonym-edit-dialog>
        <sensitive-edit-dialog :dialogVisible="sensitiveDialogVisible" :sensitiveModel="sensitiveModel" :editType="editType"  @on-cancle="cancleSensitiveEdit" @on-confirm="confirmSubmitSensitive"></sensitive-edit-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import SynonymEditDialog from './components/SynonymEditDialog'
    import SensitiveEditDialog from './components/SensitiveEditDialog'
    import { synonymWordsList, synonymWordsAddOrEdit, synonymWordsDelete, sensitiveWordsList,
        sensitiveWordsAddOrEdit, sensitiveWordsDelete} from '@/request/product'

    export default {
        // 词库管理
        name: 'ProductAttribute',
        data() {
            return {
                activeTab: 'synonym', //synonym 同义词；sensitive 敏感词
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                loading: false,
                editType: 'add', // 属性编辑弹框类型：add 新增 | edit 编辑
                total: 0,
                sensitiveTotal: 0,
                attrId: '',
                queryData: {
                    leftWordStr: '',
                    leftWord: [],
                    rightWordStr: '',
                    rightWord: [],
                    languageCode: '',
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                sensitiveQueryData: {
                    wordStr: '',
                    word: [],
                    languageCode: '',
                    page: {
                        pageNum: 1,
                        pageSize: 20
                    }
                },
                senseTypeList: [{
                    value: 1,
                    label: '标题'
                }, {
                    value: 2,
                    label: '属性'
                }],
                synonymTableList: [],
                sensitiveTableList: [],
                attrValueList: [],
                synonymDialogVisible: false,
                sensitiveDialogVisible: false,
                uploadVisible: false,
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                synonymModel: {
                    id: null,
                    languageCode: 'cn',
                    leftWord: '',
                    rightWord: '',
                    flag: 1, // 0 双向同义词 1 单向同义词
                    type: 1 /// 1 add 2 edit
                },
                sensitiveModel: {
                    id: '',
                    languageCode: 'cn',
                    word: '',
                    senseType: 1,
                    type: 1
                },
            }
        },
        components: {
            SynonymEditDialog,
            SensitiveEditDialog,
        },
        computed: {
            languageList() {
                return this.$store.state.dict.languageList
            },
            filterLanguageList () {
                let list = []
                _.forEach(this.languageList, language => {
                    if (language.code != 'cn' && language.code != 'en') {
                        list.push(language)
                    }
                })
                return list
            }
        },
        mounted() {
            this.getSynonymWordsList();
        },
        methods: {
            handleTabClick(tab, event) {
                if (tab.name === 'synonym') {
                    this.getSynonymWordsList()
                } else {
                    this.getSensitiveWordsList()
                }
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
            /**
             * 条件搜索
            */
            search() {
                if (this.activeTab === 'synonym') {
                    this.queryData.page.pageNum = 1
                    this.getSynonymWordsList()
                } else {
                    this.sensitiveQueryData.page.pageNum = 1
                    this.getSensitiveWordsList()
                }
            },
            resetSearch() {
                if (this.activeTab === 'synonym') {
                    this.queryData.page.pageNum = 1
                    this.queryData.page.pageSize = 20
                    this.$refs.synonymFilterForm.resetFields()
                    this.getSynonymWordsList()
                } else {
                    this.sensitiveQueryData.page.pageNum = 1
                    this.sensitiveQueryData.page.pageSize = 20
                    this.$refs.sensitiveFilterForm.resetFields()
                    this.getSensitiveWordsList()
                }
            },
            handleCurrentChange(val) {
                this.queryData.page.pageNum = val ? val : this.queryData.page.pageNum
                this.getSynonymWordsList()
            },
            handleSizeChange(val) {
                this.queryData.page.pageSize = val
                this.getSynonymWordsList()
            },
            handleSensitiveCurrentChange(val) {
                this.sensitiveQueryData.page.pageNum = val ? val : this.sensitiveQueryData.page.pageNum
                this.getSensitiveWordsList()
            },
            handleValueSizeChange(val) {
                this.sensitiveQueryData.page.pageSize = val
                this.getSensitiveWordsList()
            },
            /**
             * 获取同义词列表
            */
            getSynonymWordsList() {
                this.loading = true
                let params = this.queryData
                if (this.queryData.leftWordStr != '') {
                    params.leftWord = this.queryData.leftWordStr.split(',')
                } else {
                    params.leftWord = []
                }
                if (this.queryData.rightWordStr != '') {
                    params.rightWord = this.queryData.rightWordStr.split(',')
                } else {
                    params.rightWord = []
                }
                synonymWordsList(this.filterData(params)).then((response) => {
                    this.loading = false
                    if (response.ret.errcode === 1) {
                        this.synonymTableList = response.synonymWordsPb
                        this.total = response.total
                    }
                }).catch((err) => {
                    this.loading = false
                    console.error(err)
                })
            },
            /**
             * 删除同义词
            */
            delSynonymWords() {
                let params = {
                    id: this.attrId
                }
                synonymWordsDelete(params).then((res) => {
                    if (res.ret.errcode === 1) {
                       this.$message.success('操作成功！')
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            /**
             * 新增同义词
            */
            addSynonym() {
                this.synonymDialogVisible = true
                this.synonymModel = {
                    id: null,
                    languageCode: 'cn',
                    leftWord: '',
                    rightWord: '',
                    flag: 1, // 0 双向同义词 1 单向同义词
                    type: 1 /// 1 add
                }
            },
            modifySynonym(row) {
                this.synonymModel.id = row.id
                this.synonymModel.languageCode = row.languageCode
                this.synonymModel.leftWord = row.leftWord
                this.synonymModel.rightWord = row.rightWord
                this.synonymModel.flag = row.flag
                this.synonymModel.type = 2
                this.synonymDialogVisible = true
            },
            cancleSynonymEdit() {
                this.synonymDialogVisible = false
            },
            confirmSubmit(data) {
                synonymWordsAddOrEdit(this.filterData(data)).then((response) => {
                    if (response.ret.errcode === 1) {
                        this.$message.success('操作成功！')
                        this.getSynonymWordsList()
                        this.synonymDialogVisible = false
                        this.resetSynonymModel()
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            delSynonym(row) {
                this.$confirm('是否删除同义词', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.delSynonymRequest(row.id)
                }).catch(() => {
                })
            },
            delSynonymRequest(id) {
                let params = {
                    id: id
                }
                synonymWordsDelete(this.filterData(params)).then((response) => {
                    if (response.ret.errcode === 1) {
                        this.$message.success('同义词删除成功！')
                        this.getSynonymWordsList()
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            resetSynonymModel() {
                 this.synonymModel = {
                        id: null,
                        languageCode: 'cn',
                        leftWord: '',
                        rightWord: '',
                        flag: 1, // 0 双向同义词 1 单向同义词
                        type: 1 /// 1 add
                    }
            },
            /**
             * 新增敏感词
            */
            addSensitive() {
                this.sensitiveDialogVisible = true
                this.sensitiveModel = {
                    id: '',
                    languageCode: 'cn',
                    word: '',
                    senseType: 1,
                    type: 1
                }
            },
            /**
             * 获取敏感词列表
            */
            getSensitiveWordsList() {
                this.loading = true
                let params = this.sensitiveQueryData
                if (this.sensitiveQueryData.wordStr != '') {
                    params.word = this.sensitiveQueryData.wordStr.split(',')
                } else {
                    params.word = []
                }
                sensitiveWordsList(this.filterData(params)).then((res) => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.sensitiveTotal = res.total
                        this.sensitiveTableList = res.sensitiveWordsPb
                    }
                }).catch((err) => {
                    this.loading = false
                    console.error(err)
                })
            },
            modifySensitive(row) {
                this.sensitiveModel.id = row.id
                this.sensitiveModel.languageCode = row.languageCode
                this.sensitiveModel.word = row.word
                this.sensitiveModel.senseType = row.senseType
                this.sensitiveModel.type = 2
                this.sensitiveDialogVisible = true
            },
            cancleSensitiveEdit() {
                this.sensitiveDialogVisible = false
            },
            confirmSubmitSensitive(data) {
                sensitiveWordsAddOrEdit(this.filterData(data)).then((response) => {
                    if (response.ret.errcode === 1) {
                        this.$message.success('操作成功！')
                        this.sensitiveDialogVisible = false
                        this.getSensitiveWordsList()
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            delSensitive(row) {
                this.$confirm('是否删除敏感词', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async() => {
                    await this.delSensitiveRequest(row.id)
                }).catch(() => {
                })
            },
            delSensitiveRequest(id) {
                let params = {
                    id: id
                }
                sensitiveWordsDelete(this.filterData(params)).then((response) => {
                    if (response.ret.errcode === 1) {
                        this.$message.success('敏感词删除成功！')
                        this.getSensitiveWordsList()
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
        }
    }
</script>

<style lang="scss">
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>

<style lang="scss" scoped>
    .operation {
        margin-bottom: 10px;
    }

</style>

