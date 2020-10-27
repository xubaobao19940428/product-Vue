<template>
    <div class="category-list-wrapper app-container">
        <div class="operator-container">
            <el-button class="operator-item" size="small" icon="el-icon-plus" type="primary"
                       v-if="hasPermission('ProductCategoryService.CategoryAdd')"
                       @click="addGroup(0,1)" >
                添加一级分类
            </el-button>
        </div>
        <div class="main-content-wrapper">
            <div class="custom-tree-node tree-title">
                <div>类目ID</div>
                <div class="name-box">类目名称</div>
                <div class="cover-img-box">类目图片</div>
                <div class="cover-img-box">Icon</div>
                <div class="sort-btn-box">排序</div>
                <div class="action-btn-box">操作</div>
            </div>
            <div class="tree-box" :style="{height: clientHeight + 'px'}">
            <el-tree
                :data="categoryList"
                node-key="cateId"
                lazy
                :expand-on-click-node="true"
                :load="getSubCategory"
                ref="treeNode"
                :props="{children: 'levelValue'}">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div class="name-box">{{ data.cateId }}</div>
                    <div class="name-box">{{ data.cateName }}</div>
                    <div class="cover-img-box">
                        <img :src="dealShowFileSrc(data.cover)" class="previewImage" >

                    </div>
                    <div class="cover-img-box">
                        <img v-if="data.iconInfo" :src="dealShowFileSrc(data.iconInfo.unselected)" class="previewImage" >
                        <img v-if="data.iconInfo" :src="dealShowFileSrc(data.iconInfo.selected)" class="previewImage mar-l-10" >
                    </div>
                    <div class="sort-btn-box" v-if="hasPermission('ProductCategoryService.CategoryChangSort')">
                        <i class="iconfont" @click.stop="move(data.cateId, 1)">&#xe623;</i>
                        <i class="iconfont mar-l-10" @click.stop="move(data.cateId, 2)">&#xe629;</i>
                    </div>
                    <div class="action-btn-box">
                        <i class="iconfont btn-icon" v-if="hasPermission('ProductCategoryService.CategoryUpdate')"
                           @click.stop="updateCategory(data, node)">&#xe634;</i>
                        <i class="iconfont btn-icon" v-if="hasPermission('ProductCategoryService.CategoryUpdate')"
                           @click.stop="copyCategory(data, node)">&#xe624;</i>
                        <i class="iconfont btn-icon" v-if="hasPermission('ProductCategoryService.CategoryDelete')"
                           @click.stop="delCategory(data.cateId, node)">&#xe6ce;</i>
                        <template v-if="hasPermission('ProductCategoryService.CategoryHiddenOrShow')">
                            <!--显示-->
                            <i v-if="data.status == 2" class="iconfont btn-icon show-icon" @click.stop="hideCategory(data)">&#xe6cf;</i>
                            <!--隐藏-->
                            <i v-else class="iconfont btn-icon show-icon" @click.stop="hideCategory(data)">&#xe627;</i>
                        </template>
                        <template  v-if="node.level == 2 && hasPermission('ProductCategoryService.CategoryUpdate')">
                            <i class="iconfont btn-icon star-icon" v-if="data.isStar" @click.stop="starCategory(data, node)">&#xebea;</i>
                            <i class="iconfont btn-icon" v-else @click.stop="starCategory(data, node)">&#xe63b;</i>
                        </template>
                        <el-button plain size="mini" type="primary"
                                   class="mar-l-10"
                                   v-if="node.level == 1 && hasPermission('ProductCategoryService.CategoryAdd')"
                                   @click.stop="addGroup(data.cateId, 2, node)">
                            添加二级分类
                        </el-button>
                        <el-button plain size="mini" type="primary"
                             v-if="node.level == 1"
                            @click.stop="groupManage(data)">
                            管理分组
                        </el-button>
                    </div>
                </div>
            </el-tree>
            </div>
        </div>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="getList"
                           :current-page="param.page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="param.page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
        <category-edit :propShowDialog="editDialog.show" :level="editDialog.level" :propParam="editDialog.param" :countryCode="countryCode"
                       :title="editDialog.title" @close="editDialog.show = false" @confirm="confirmAddItem"></category-edit>
        <copy-category-dialog :dialogVisible="copyDialogVisible" :dialogTitle="copyDialogTitle" :categoryLevel="nodeLevel" :countryCode="countryCode" :parentNode="currentNode"
            @on-cancle="handleCancleCopy" @on-confirm="handleConfirmCopy"></copy-category-dialog>

      <front-group-manage :dialogVisible="dialogVisible" ref="frontGroupManage" @on-cancel-dialog="cancelDialog" :countryCode="countryCode"></front-group-manage>
    </div>
</template>

<script>
    import {
        categoryDelete,
        categoryChangSort,
        categoryHiddenOrShow,
        categoryListGet,
        CategoryStar,
        copyFrontCategory
    } from '@/request/product'
    import common from '@/js/common/mixins.js'
    import productCommon from '../../common/common'
    import categoryEdit from './editDialog'
    import CopyCategoryDialog from './CopyCategoryDialog'
    import frontGroupManage from './frontGroupManage'
    export default {
        props: {
            countryCode: {
                type: String,
                default: 'MY'
            }
        },
        data () {
            return {
                categoryList: [],
                totals: 0,
                param: {
                    cateType: 1, // 1 前台类目 2 后台类目
                    level: 1,
                    pid: 0,
                    countryCode:'',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                },
                editDialog: {
                    show: false,
                    param: {},
                    level: 1,
                    title: ''
                },
                dialogVisible:false,
                currentNode: null,
                copyDialogVisible: false,
                copyDialogTitle: '',
                nodeLevel: null,
                clientHeight: 400,
                queryData:{

                }
            }
        },
        mixins: [common, productCommon],
        components: {
            categoryEdit,
            CopyCategoryDialog,
            frontGroupManage
        },
        watch:{
            countryCode:{
                handler(newVal,oldVal){
                    if(newVal){
                        this.param.countryCode = newVal
                        this.getList()
                    }
                }
            },
            deep:true
        },
        created () {
            this.getList()
        },
        mounted () {
            this.onResize()
            window.addEventListener('resize', _.throttle(this.onResize, 100));
        },
        methods: {
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList()
            },
            // 获取分类
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                this.fetchCategory({
                    ...this.param,
                    resolve: (data, res) => {
                        this.categoryList = data
                        this.totals = res.total
                    }
                })
            },
            // 获取下一级分类
            getSubCategory (data, resolve) {
                if (data.level == 0) {
                    return
                }
                this.fetchCategory({
                    pid: data.key,
                    level: data.level + 1,
                    cateType: this.param.cateType,
                    countryCode: this.countryCode,
                    resolve
                })
            },
            // 分类排序
            move (id, direction) {
                // 1上移，2下移
                categoryChangSort({
                    cateId: id,
                    sortDirection: direction
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.getList()
                    }
                })
            },
            // 删除分类
            delCategory (categoryId, node) {
                this.$confirm('将永久删除此分类，确定删除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    categoryDelete({
                        cateId: categoryId
                    }).then((res) => {
                        if (res.ret.errcode === 1) {
                            this.$refs['treeNode'].remove(node)
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            // 星标
            starCategory (data, node) {
                let msg = '确定将该类目设为星标推荐?'
                if (data.isStar) {
                    msg = '确定取消该类目的星标推荐？'
                }
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    CategoryStar({
                        id: data.cateId,
                        isStar: data.isStar ? 0 : 1
                    }).then((res) => {
                        if (res.ret.errcode === 1) {
                            data.isStar = !data.isStar
                        }
                    })
                }).catch(() => {})
            },
            // 隐藏分类
            hideCategory (item) {
                let data = item
                categoryHiddenOrShow({
                    cateId: item.cateId,
                    status: item.status == 1 ? 2 : 1
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        data.status = data.status == 1 ? 2 : 1
                    }
                })
            },
            // 添加分类
            addGroup (fid, level, node) {
                console.log(this.countryCode)
                if (node) {
                    this.currentNode = node
                }
                if (level === 1) {
                    this.editDialog.title = '添加一级分类'
                } else if (level === 2) {
                    this.editDialog.title = '添加二级分类'
                }
                this.editDialog.param = {
                    pid: fid,
                    level: level
                }
                this.editDialog.show = true
                this.editDialog.level = level
            },
            // 修改分类
            updateCategory (data, node) {
                this.currentNode = node
                if (node.level === 1) {
                    this.editDialog.title = '编辑一级分类'
                } else if (node.level === 2) {
                    this.editDialog.title = '编辑二级分类'
                }
                console.log(data)
                Object.assign(this.editDialog.param, data)
                this.editDialog.param['level'] = node.level
                this.editDialog.level = node.level
                this.editDialog.show = true
            },
            copyCategory (data, node) {
                this.currentNode = node
                if (node.level === 1) {
                    this.copyDialogTitle = '复制一级类目'
                } else if (node.level === 2) {
                    this.copyDialogTitle = '复制二级类目'
                }
                this.copyDialogVisible = true
                this.nodeLevel = node.level
                // this.getSubCategory(data)
            },
            confirmAddItem (data) {
                if (this.currentNode && data) {
                    if (this.editDialog.param.cateId) {
                        let curI = this.currentNode.parent.childNodes.findIndex((val) => {
                            return val.data.cateId == this.editDialog.param.cateId
                        })
                        if (curI != -1) {
                            Object.assign(this.currentNode.parent.childNodes[curI].data, data)
                            this.$refs['treeNode'].updateKeyChildren(this.currentNode.parent.id, this.currentNode.parent.childNodes)
                        }
                    } else {
                        this.$refs['treeNode'].append(data, this.currentNode)
                    }
                } else {
                    this.getList()
                }
                this.editDialog.show = false
            },
            handleCancleCopy() {
                this.copyDialogVisible = false
            },
            handleConfirmCopy(copyData) {
                let params = {
                    copyUnit: copyData
                }
                copyFrontCategory(this.filterData(params)).then((res)=> {
                    this.copyDialogVisible = false
                    if (res.ret.errcode === 1) {
                        this.$message.success('前台类目复制成功！')
                    } else {
                        this.$message.error(res.ret.msg)
                    }
                })
            },
            onResize() {
                this.clientHeight = document.body.clientHeight - 250
            },
            groupManage(data){
                console.log(data)
                    this.queryData={
                        pid:data.cateId,
                        countryCode:data.countryCode,
                        pName:data.cateName
                    }
                this.dialogVisible = true
                this.$refs['frontGroupManage'].getSecondCategory(this.queryData)
            },
            cancelDialog(){
                this.dialogVisible = false
            }
        }
    }
</script>
<style lang="scss">
    @keyframes treeTableShow {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .category-list-wrapper .el-tree-node__content {
        height: auto;
    }

    @-webkit-keyframes treeTableShow {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    .category-list-wrapper .param-wrapper .el-icon-close{
        position: absolute;
        top: 7px;
        right: 5px;
    }
    .el-cascader-menus{
        z-index: 999999999999!important;
    }
    .el-tree{
        width: 100%;
        height: 100%;
        overflow: auto;
    }
</style>
<style lang="scss" rel="stylesheet/scss" scoped>
    $color-blue: #2196f3;
    $space-width: 18px;
    .flex1 {
        flex: 1;
    }
    .btn-icon{
        font-size: 20px;
        margin: 0 10px;
        &:hover{
            color: $color-blue;
        }
    }
    .show-icon{
        font-size: 28px;
    }
    .star-icon{
        color: #e71f19;
    }
    .tree-box {
        // max-height: 600px;
        overflow: auto;
    }
    .custom-tree-node {
        display: flex;
        width: 100%;
        align-items: center;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
        padding: 10px 0;
        >div{
            flex: 1;
            text-align: center;
        }
    }
    .tree-title {
        padding-left: 24px;
        background: #F5F7FA;
        color: #606266;
        font-weight: 500;
    }
    .attr-item-box {
        display: flex;
        flex-wrap: wrap;
        line-height: 24px;
        align-items: center;
        margin-top: 10px;
    }
    .cover-img-box {
        img {
            display: inline-block;
            height: 80px;
            width: 80px;
        }
    }
    .action-btn-box {
       flex-grow: 2 !important;
        display: flex;
        align-items: center;
    }
    .avatar-uploader /deep/ .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .tag-item{
        width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        position: relative;
    }
    .param-wrapper{
        display: flex;
        .attr-wrapper{
            display: flex;
            flex-direction: column;
            flex: 1;
        }
    }
</style>
