<template>
    <div class="app-container">
        <el-form inline>
            <el-form-item label="国家：">
                <el-select v-model="searchParam.countryCode"
                           @change="getList(1)"
                           filterable
                           clearable>
                    <el-option v-for="item in countryList"
                               :key="item.shortCode"
                               :label="item.nameLocal"
                               :value="item.shortCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="medium"
                           type="primary"
                           v-if="hasPermission('BTN_CATEGORY_ADD')"
                           icon="el-icon-plus"
                           @click="showEditDialog('add')">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="medium"
                           type="danger"
                           icon="el-icon-delete"
                           v-if="hasPermission('BTN_CATEGORY_DELETE')"
                           @click="toDeleteAll()">批量删除</el-button>
            </el-form-item>
        </el-form>
        <bg-set-list  dialogType="9" :countryList="countryList" :countryCode="searchParam.countryCode"></bg-set-list>
        <div class="main-content-wrapper">
            <el-table border
                      height="100%"
                      :data="dataList"
                      ref="multipleTable"
                      @selection-change="handleSelectionChange">
                <el-table-column fixed="left" type="selection" width="40"></el-table-column>
                <el-table-column prop="title" label="名称" align="center" min-width="100px" ></el-table-column>
                <el-table-column prop="cateId" label="关联一级类目" align="center" min-width="120px" >
                    <template slot-scope="scope">
                        {{ getcateName(scope.row.cateId) }}
                    </template>
                </el-table-column>
                <el-table-column label="国家" min-width="100px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="首页文案色值" min-width="120px" align="center">
                    <template slot-scope="scope">
                        <div class="flex">
                            <span :style="{ backgroundColor: scope.row.backgroundColor, width: '20px', height: '20px', display: 'flex' }"></span>
                            <span>{{ scope.row.backgroundColor }}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="clickNum" label="打开次数" align="center" min-width="100px"></el-table-column>
                <el-table-column label="跳转类型" min-width="100px" header-align="center" align="center">
                    <template slot-scope="scope">
                        {{ urlType[scope.row.urlType]}}
                    </template>
                </el-table-column>
                <el-table-column label="跳转链接" min-width="200px">
                    <template slot-scope="scope">
                        {{ scope.row.urlType == 2 ? appPageEnum[scope.row.url] : scope.row.url }}
                    </template>
                </el-table-column>
                <el-table-column label="图片" align="center" min-width="100px">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="hover">
                            <img :src="getMultiLangShowInfo(scope.row.cover, 'image')" class="previewImage">
                            <img :src="getMultiLangShowInfo(scope.row.cover, 'image')" class="thumbnail" slot="reference">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{scope.row.createTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{scope.row.startTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" align="center" min-width="180px">
                    <template slot-scope="scope">
                        {{scope.row.endTime | formatTime}}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_CATEGORY_EDIT')"
                                   @click="showEditDialog('edit', scope.row)">编辑</el-button>
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_CATEGORY_COPY')"
                                   @click="showEditDialog('copy', scope.row)">复制</el-button>
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_CATEGORY_DELETE')"
                                   @click="toDelete([scope.row.id])">删除</el-button>
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
        <edit-dialog :dialogVisible="dialog.show" :categoryListLevelOne="categoryListLevelOne" dialogTitle="编辑Banner" :urlType="urlType" :appPageEnum="appPageEnum" :countryList="countryList" :type="searchParam.type" :propParam="dialog.param" @close="closeEditDialog" @confirm="confirmEditItem"></edit-dialog>
    </div>
</template>
<script>
    import { deleteCategoryBanner, listCategoryBanner } from '@/request/promotion.js'
    import common from '../../common/common'
    import mixins from '@/js/common/mixins.js'
    import BgSetList from './bgSetList'
    import editDialog from './categoryOperationEdit'
    import { categoryListGet } from '@/request/product'
    import _ from 'lodash'
    export default {
        props: {
            countryList: Array
        },
        mixins: [common, mixins],
        data () {
            return {
                dataList: [],
                categoryListLevelOne: [],
                dialogVisible: false,
                multipleSelection: [],
                dataListId: [],
                bannerList: '',
                searchParam: {
                    bannerType: 1,
                    countryCode: 'MY',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                totals: 0,
                dialog: {
                    show: false,
                    param: {}
                }
            }
        },
        components: {
            editDialog,
            BgSetList
        },
        watch: {
            multipleSelection: function () {
                let arr = []
                for (let i in this.multipleSelection) {
                    arr.push(this.multipleSelection[i].id)
                }
                this.dataListId = arr
            }
        },
        mounted () {
            this.getList()
            this.getCategoryList()
        },
        methods: {
            // 获取一级类目
            getcateName (item) {
                let data = this.categoryListLevelOne.find((val) => {
                    return val.cateId == item
                })
                return data ? data.cateName : item
            },
            /**
             * 获取类目列表
             */
            getCategoryList () {
                let params = {
                    cateType: 1, // 类目类型 1 前台类目 2 后台类目
                    page: {
                        pageNum: 1,
                        pageSize: 1000
                    }
                }
                categoryListGet(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        let categoryUnitList = []
                        _.forEach(res.categoryUnit, (item) => {
                            item.cateName = item.cateNameValue[0].name
                            categoryUnitList.push(item)
                        })
                        this.categoryListLevelOne = categoryUnitList
                        console.log(this.categoryListLevelOne)
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            handleSizeChange (value) {
                this.searchParam.page.pageSize = value
                this.getList(1)
            },
            getList (page) {
                this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
                listCategoryBanner(this.filterData(this.searchParam)).then((res) => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.dataList = res.categoryBanner
                        this.totals = res.total
                    }
                })
            },
            showEditDialog (type, data) {
                this.dialog.param = {}
                if (type == 'edit') {
                    Object.assign(this.dialog.param, JSON.parse(JSON.stringify(data)))
                } else if (type == 'copy') {
                    Object.assign(this.dialog.param, JSON.parse(JSON.stringify(data)))
                    this.dialog.param.id = null
                }
                this.dialog.show = true
            },
            closeEditDialog () {
                this.dialog.show = false
            },
            confirmEditItem () {
                this.dialog.show = false
                this.getList()
            },
            toDeleteAll () {
                if (this.dataListId.length === 0) {
                    this.$message('请先勾选您需操作的选项')
                    return
                }
                this.toDelete(this.dataListId)
            },
            toggleSelection (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row)
                })
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
            },
            toDelete (ids) {
                this.$confirm('此操作将永久删除所选, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteCategoryBanner({ 'id': ids }).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('删除成功')
                            this.getList()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }
        }
    }
</script>
