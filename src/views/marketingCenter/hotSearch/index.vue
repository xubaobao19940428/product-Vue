<template>
    <div class="app-container">
        <div class="filter-container">
            <div class="operator-container">
                <el-form inline>
                    <el-form-item label="关键词："
                                  class="filter-item">
                        <el-input placeholder="请输入"
                                  size="medium"
                                  v-model="searchParam.keyword"></el-input>
                    </el-form-item>
                    <el-form-item class="filter-item" style="margin-left: 20px;">
                        <el-button icon="el-icon-search"
                                   type="primary"
                                   @click="getList(1)"
                                   size="medium">搜索
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-button icon="el-icon-plus"
                           type="primary"
                           v-if="hasPermission('BTN_HOT_SEARCH_ADD_KEYWORDS')"
                           @click="showDialog('add')"
                           size="medium">新增</el-button>
            </div>
            <article>
                <el-table border
                          :data="dataList">
                    <el-table-column type="index"
                                     label="序号"
                                     align="center"
                                     width="50">
                    </el-table-column>
                    <el-table-column label="热搜词"
                                     min-width="150px">
                        <template slot-scope="scope">
                            <ul>
                                <li v-for="(item, i) in scope.row.hotWord"
                                    :key="i">{{ getLanguageName(item) + ': ' + item.name }}</li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column label="适用国家"
                                     min-width="100">
                        <template slot-scope="scope">
                            <ul>
                                <li v-for="(item, i) in scope.row.countryCode"
                                    :key="i">{{ getCountryName(item) }}</li>
                            </ul>
                        </template>
                    </el-table-column>
                    <el-table-column label="跳转类型"
                                     min-width="100">
                        <template slot-scope="scope">{{ urlTypeEnum[scope.row.urlType] }}</template>
                    </el-table-column>
                    <el-table-column label="跳转链接"
                                     :show-overflow-tooltip="true"
                                     min-width="100">
                        <template slot-scope="scope">{{ scope.row.urlType == 2  ? appPageEnum[scope.row.url] : scope.row.url }}</template>
                    </el-table-column>
                    <el-table-column label="热搜词图标" min-width="100">
                        <template slot-scope="scope">
                            <el-popover placement="top-start" trigger="hover">
                                <img :src="getMultiLangShowInfo(scope.row.icon, 'image')" class="previewImage">
                                <img :src="getMultiLangShowInfo(scope.row.icon, 'image')" class="thumbnail" slot="reference">
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="当前排序"
                                     align="center"
                                     min-width="200">
                        <template slot-scope="scope">
                            <el-input-number v-model="scope.row.sort"
                                             controls-position="right"
                                             :min="0"
                                             size="small"
                                             :precision="0"></el-input-number>
                            <el-button v-if="hasPermission('BTN_HOT_SEARCH_SORT_KEYWORDS')"
                                       class="mar-l-10"
                                       size="small"
                                       @click="sortKeywords(scope.row)">排序</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right"
                                     label="操作"
                                     min-width="140px"
                                     align="center">
                        <template slot-scope="scope">
                            <el-button plain type="primary" size="mini"
                                       v-if="hasPermission('BTN_HOT_SEARCH_EDIT_KEYWORDS')"
                                       @click="showDialog('edit', scope.row)">编辑</el-button>
                            <el-button plain size="mini"
                                       v-if="hasPermission('BTN_HOT_SEARCH_HIDDEN_KEYWORDS')"
                                       @click="deleteKeywords(scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
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
            </article>
            <!--添加修改热搜词-->
            <edit-dialog :title="editDialog.title" :propShowDialog="editDialog.show"
                         :urlTypeEnum="urlTypeEnum"
                         :langList="langList" :countryList="countryList"
                         :propParam="editDialog.param" @close="editDialog.show = false" @confirm="confirmUpdate"></edit-dialog>
        </div>
    </div>
</template>
<script>
    import { getList, deleteHotWord, resortHotWord } from '@/request/promotion.js'
    import editDialog from './components/hotWordDialog'
    import common from '../common/common'
    import mixins from '@/js/common/mixins.js'

    export default {
        data () {
            return {
                searchParam: {
                    keyword: '',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                dataList: [],
                totals: 0,
                urlTypeEnum: {
                    1: 'H5',
                    2: '应用内',
                    3: '普通搜索'
                },
                editDialog: {
                    title: '新增热搜词',
                    show: false,
                    param: {
                        countryCode: [],
                        url: '',
                        hotWord: []
                    }
                }
            }
        },
        mixins: [common, mixins],
        components: {
            editDialog
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            langList () {
                return this.$store.state.dict.languageList
            }
        },
        created () {
            this.getList()
        },
        methods: {
            getCountryName (data) {
                let item = this.countryList.find((val) => {
                    return val.shortCode == data
                })
                return item ? item.nameLocal : ''
            },
            getLanguageName (data) {
                let item = this.langList.find((val) => {
                    return val.code == data.languageCode
                })
                return item ? item.desc : ''
            },
            handleSizeChange (value) {
                this.searchParam.page.pageSize = value
                this.getList(1)
            },
            getList (page) {
                this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                getList(this.filterData(this.searchParam)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.hotWord
                        this.totals = res.total
                    }
                })
            },
            initLangData () {
                for (let i = 0; i < this.langList.length; i++) {
                    let lang = this.langList[i].code
                    let productCorner = this.editDialog.param.hotWord.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!productCorner) {
                        this.editDialog.param.hotWord.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                }
            },
            // 显示编辑弹窗
            showDialog (type, data) {
                this.editDialog.param = {
                    countryCode: [],
                    url: '',
                    hotWord: []
                }
                switch (type) {
                    case 'add':
                        this.editDialog.title = '新增热搜词'
                        this.initLangData()
                        break
                    case 'edit':
                        this.editDialog.title = '热搜词编辑'
                        Object.assign(this.editDialog.param, JSON.parse(JSON.stringify(data)))
                        this.initLangData()
                        break
                }
                this.editDialog.show = true
            },
            confirmUpdate () {
                this.getList()
                this.editDialog.show = false
            },
            // 删除
            deleteKeywords (data) {
                deleteHotWord({
                    hotWordId: data.hotWordId
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('删除成功')
                        this.getList()
                    }
                })
            },
            // 排序
            sortKeywords (data) {
                resortHotWord({
                    hotWordId: data.hotWordId,
                    sort: data.sort
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('排序成功')
                        this.getList()
                    }
                })
            }
        }
    }

</script>
