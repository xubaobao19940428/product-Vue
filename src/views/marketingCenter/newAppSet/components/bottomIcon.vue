<template>
    <div class="app-container">
        <el-form inline>
            <el-form-item label="国家：">
                <el-select v-model="searchParam.countryCode" @change="getIconConfigList()" filterable>
                    <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :value="item.shortCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button size="medium" type="primary" v-if="hasPermission('BTN_BOTTOM_ICON_ADD')" icon="el-icon-plus" @click="showEditDialog('add')">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="medium" type="danger" icon="el-icon-delete" v-if="hasPermission('BTN_BOTTOM_ICON_DELETE')" @click="batchDelete()">批量删除</el-button>
            </el-form-item>
            <el-form-item style="float: right;">
                <el-button type="text" @click="showSyncDialog" v-if="hasPermission('BTN_BOTTOM_ICON_SYNC')"><i class="el-icon-refresh"></i>同步所选到其他国家</el-button>
            </el-form-item>
        </el-form>
        <p class="icon-tips"><i class="el-icon-warning"></i>如果所有图标的展示时间失效，则使用默认的底部图标</p>
        <div class="main-content-wrapper">
            <el-table border height="100%" :data="dataList" ref="multipleTable" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column fixed="left" type="selection" width="40"></el-table-column>
                <el-table-column prop="name" label="名称" align="center" min-width="160px" ></el-table-column>
                <el-table-column prop="" label="首页" align="center" min-width="120px" >
                    <template slot-scope="scope">
                        <img :src="dealShowFileSrc(scope.row.appIconValue[0].unselected)" class="icon-img">
                        <img :src="dealShowFileSrc(scope.row.appIconValue[0].selected)" class="icon-img">
                    </template>
                </el-table-column>
                <el-table-column label="学院" min-width="120px" align="center">
                    <template slot-scope="scope">
                        <img :src="dealShowFileSrc(scope.row.appIconValue[1].unselected)" class="icon-img">
                        <img :src="dealShowFileSrc(scope.row.appIconValue[1].selected)" class="icon-img">
                    </template>
                </el-table-column>
                <el-table-column label="PS店铺" min-width="120px" align="center">
                    <template slot-scope="scope">
                        <img :src="dealShowFileSrc(scope.row.appIconValue[2].unselected)" class="icon-img">
                        <img :src="dealShowFileSrc(scope.row.appIconValue[2].selected)" class="icon-img">
                    </template>
                </el-table-column>
                <el-table-column label="购物车" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <img :src="dealShowFileSrc(scope.row.appIconValue[3].unselected)" class="icon-img">
                        <img :src="dealShowFileSrc(scope.row.appIconValue[3].selected)" class="icon-img">
                    </template>
                </el-table-column>
                <el-table-column label="我的" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <img :src="dealShowFileSrc(scope.row.appIconValue[4].unselected)" class="icon-img">
                        <img :src="dealShowFileSrc(scope.row.appIconValue[4].selected)" class="icon-img">
                    </template>
                </el-table-column>
                <el-table-column label="修改时间(北京)" align="center" width="170px">
                    <template slot-scope="scope">
                        {{scope.row.updateTime | secondTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column :label="'开始时间('+ countryName +')'" align="center" width="170px">
                    <template slot-scope="scope">
                        {{scope.row.startTime | secondTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column :label="'结束时间('+ countryName + ')'" align="center" width="170px">
                    <template slot-scope="scope">
                        {{scope.row.endTime | secondTimeFormat}}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="120px">
                    <template slot-scope="scope">
                        <el-button v-if="hasPermission('BTN_BOTTOM_ICON_EDIT')" type="text" size="mini" @click="showEditDialog('edit', scope.row)">编辑</el-button>
                        <el-button v-if="hasPermission('BTN_BOTTOM_ICON_COPY')" type="text" size="mini" @click="showEditDialog('copy', scope.row)">复制</el-button>
                        <el-button v-if="hasPermission('BTN_BOTTOM_ICON_DELETE')" type="text" size="mini"  @click="deleteIconConfig(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="getIconConfigList"
                           :current-page="searchParam.page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="searchParam.page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
        <sync-icon-config-dialog :dialogVisible="syncDialogVisible" :countryCode="searchParam.countryCode" @on-cancle="handleCancleSync" @on-confirm="handleConfirmSync"></sync-icon-config-dialog>
        <bottom-icon-edit-dialog :dialogVisible="editDialogVisible" :iconModel="iconModel" :countryName="countryName" @on-cancle="handleCancleEdit" @on-confirm="handleConfirmEdit"></bottom-icon-edit-dialog>
    </div>
</template>
<script>
    import SyncIconConfigDialog from './SyncIconConfigDialog.vue'
    import BottomIconEditDialog from './BottomIconEditDialog.vue'
    import { listAppIcon, insertAppIcon, updateAppIcon, deleteAppIcon, batchCopyAppIcon } from '@/request/promotion.js'
    import common from '../../common/common'
    import mixins from '@/js/common/mixins.js'
    import _ from 'lodash'
    export default {
        props: {
            countryList: Array
        },
        mixins: [common, mixins],
        data () {
            return {
                loading: false,
                countryName: '',
                syncDialogVisible: false,
                editDialogVisible: false,
                dataList: [],
                dialogVisible: false,
                multipleSelection: [],
                dataListId: [],
                searchParam: {
                    countryCode: 'MY',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                totals: 0,
                editType: 'add',
                iconModel: {
                    countryCode: '',
                    name: '',
                    startTime: null,
                    endTime: null,
                    indexItemObj: {
                        appIconType: 1,
                        unselected: '',
                        selected: ''
                    },
                    academyItemObj: {
                        appIconType: 2,
                        unselected: '',
                        selected: ''
                    },
                    affiliateItemObj: {
                        appIconType: 3,
                        unselected: '',
                        selected: ''
                    },
                    cartItemObj: {
                        appIconType: 4,
                        unselected: '',
                        selected: ''
                    },
                    myItemObj: {
                        appIconType: 5,
                        unselected: '',
                        selected: ''
                    }
                }
            }
        },
        components: {
            SyncIconConfigDialog,
            BottomIconEditDialog
        },
        watch: {
            multipleSelection: function () {
                let arr = []
                for (let i in this.multipleSelection) {
                    arr.push(this.multipleSelection[i].id)
                }
                this.dataListId = arr
                console.log(this.dataListId)
            }
        },
        mounted () {
            this.getIconConfigList()
        },
        methods: {
            getIconConfigList() {
                this.loading = true
                _.forEach(this.countryList, item => {
                    if (item.shortCode === this.searchParam.countryCode) {
                        if (item.shortCode === 'ID') {
                            this.countryName = '印尼'
                        } else {
                            this.countryName = item.nameCn
                        }
                    }
                })
                let params = this.searchParam
                listAppIcon(this.filterData(params)).then(res => {
                    this.loading = false
                    if (res.ret.errcode === 1) {
                        this.dataList = res.appIconInfo
                        this.totals = res.total
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            handleCancleSync() {
                this.syncDialogVisible = false
            },
            handleConfirmSync(syncData)  {
                this.syncDialogVisible = false
                let params = {
                    id: this.dataListId,
                    countryCode: syncData
                }
                batchCopyAppIcon(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('同步成功')
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            handleSizeChange (value) {
                this.searchParam.page.pageSize = value
                this.getIconConfigList()
            },
            toggleSelection (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row)
                })
            },
            handleSelectionChange (val) {
                this.multipleSelection = val
            },
            deleteIconConfig (id) {
                let params = {
                    id: [id]
                }
                this.$confirm('此操作将永久删除所选, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteAppIcon(this.filterData(params)).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('删除成功')
                            this.getIconConfigList()
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            showEditDialog (type, data) {
                this.iconModel.countryCode = this.searchParam.countryCode
                this.editType = type
                if (type === 'edit') {
                    this.iconModel.id = data.id
                }
                if (type === 'edit' || type === 'copy') {
                    this.iconModel.countryCode = data.countryCode
                    this.iconModel.name = data.name
                    this.iconModel.startTime = data.startTime
                    this.iconModel.endTime = data.endTime
                    this.iconModel.indexItemObj = data.appIconValue[0]
                    this.iconModel.academyItemObj = data.appIconValue[1]
                    this.iconModel.affiliateItemObj = data.appIconValue[2]
                    this.iconModel.cartItemObj = data.appIconValue[3]
                    this.iconModel.myItemObj = data.appIconValue[4]
                } else {
                    this.iconModel.name = ''
                    this.iconModel.startTime = null
                    this.iconModel.endTime = null
                    this.iconModel.indexItemObj = {
                        appIconType: 1,
                        unselected: '',
                        selected: ''
                    }
                    this.iconModel.academyItemObj = {
                        appIconType: 2,
                        unselected: '',
                        selected: ''
                    }
                    this.iconModel.affiliateItemObj = {
                        appIconType: 3,
                        unselected: '',
                        selected: ''
                    }
                    this.iconModel.cartItemObj = {
                        appIconType: 4,
                        unselected: '',
                        selected: ''
                    }
                    this.iconModel.myItemObj = {
                        appIconType: 5,
                        unselected: '',
                        selected: ''
                    }
                }
                this.editDialogVisible = true
            },
            handleCancleEdit () {
                this.editDialogVisible = false
                this.getIconConfigList()
            },
            handleConfirmEdit (iconData) {
                console.log(iconData)
                this.editDialogVisible = false
                iconData.appIconValue = [iconData.indexItemObj, iconData.academyItemObj, iconData.affiliateItemObj, iconData.cartItemObj, iconData.myItemObj]
                let params = {
                    appIconInfo: iconData
                }
                if (this.editType === 'edit') {
                    updateAppIcon(this.filterData(params)).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('编辑成功！')
                            this.getIconConfigList()
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                } else {
                    insertAppIcon(this.filterData(params)).then(res => {
                        if (res.ret.errcode === 1) {
                            if (this.editType === 'add') {
                                this.$message.success('新增成功！')
                            } else {
                                this.$message.success('复制成功！')
                            }

                            this.getIconConfigList()
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }

            },
            showSyncDialog () {
                if (this.dataListId.length === 0) {
                    this.$message.warning('请选择需同步的图标配置')
                    return
                }
                this.syncDialogVisible = true
            },
            batchDelete() {
                if (this.dataListId.length === 0) {
                    this.$message.warning('请选择需要删除的图标配置')
                    return
                }
                let params = {
                    id: this.dataListId
                }
                this.$confirm('此操作将永久删除所选, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteAppIcon(this.filterData(params)).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('删除成功')
                            this.getIconConfigList()
                        }
                    }).catch(err => {
                        console.log(err)
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

<style lang="scss" scoped>
    .icon-tips {
        color:#F56C6C;
        height: 20px;
        line-height: 20px;
        margin-bottom: 10px;
    }
    .icon-img {
        width: 40px;
        display: inline-block;
    }
</style>

