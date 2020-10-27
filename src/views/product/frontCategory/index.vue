<template>
    <div class="category-list-wrapper app-container">
        <div class="operator-container">
            <el-button icon="el-icon-plus" type="primary"
                       v-if="hasPermission('ProductCategoryService.CategoryAdd')"
                       @click="addGroup(0,1)" class="operator-item" size="small">添加一级分类
            </el-button>
        </div>
        <div class="main-content-wrapper">
            <el-tree
                :data="categoryList"
                node-key="cateId"
                lazy
                :expand-on-click-node="true"
                :load="getSubCategory"
                ref="treeNode"
                :props="{children: 'levelValue'}">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <div class="name-box">{{ data.cateName }}</div>
                    <div>{{ data.cateId }}</div>
                    <div class="cover-img-box">
                        <el-popover placement="top-start" trigger="hover" v-if="data.cover">
                            <img :src="dealShowFileSrc(data.cover)" class="previewImage">
                            <img v-popover:popover :src="dealShowFileSrc(data.cover)" class="thumbnail" slot="reference">
                        </el-popover>
                    </div>
                    <div class="sort-btn-box"
                         v-if="hasPermission('ProductCategoryService.CategoryChangSort')"
                    >
                    
                        <el-button plain size="mini" @click.stop="move(data.cateId, 1)" type="success">上移</el-button>
                        <el-button plain size="mini" @click.stop="move(data.cateId, 2)" type="success">下移</el-button>
                    </div>
                    <div class="action-btn-box">
                        <el-button
                            v-if="node.level == 1 && hasPermission('ProductCategoryService.CategoryAdd')"
                            plain
                            size="mini"
                            @click.stop="addGroup(data.cateId, 2, node)"
                            type="primary"
                        >添加二级分类
                        </el-button>
                        <el-button
                            plain
                            size="mini"
                            type="primary"
                            v-if="hasPermission('ProductCategoryService.CategoryUpdate')"
                            @click.stop="updateCategory(data, node)"
                        >编辑
                        </el-button>
                        <el-button plain size="mini" type="danger"
                                   v-if="hasPermission('ProductCategoryService.CategoryDelete')"
                                   @click.stop="delCategory(data.cateId, node)">删除</el-button>
                        <el-button plain size="mini" :type="data.status == 1 ? 'success' : 'info'"
                                   v-if="hasPermission('ProductCategoryService.CategoryHiddenOrShow')"
                                   @click.stop="hideCategory(data)">
                            {{ data.status == 2 ? '显示' : '隐藏' }}
                        </el-button>
                    </div>
                </div>
            </el-tree>
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
        <category-edit :propShowDialog="editDialog.show" :level="editDialog.level" :propParam="editDialog.param"
                       :title="editDialog.title" @close="editDialog.show = false" @confirm="confirmAddItem"></category-edit>
    </div>
</template>

<script>
    import {
        categoryDelete,
        categoryChangSort,
        categoryHiddenOrShow
    } from '@/request/product'
    import common from '@/js/common/mixins.js'
    import productCommon from '../common/common'
    import categoryEdit from './components/editDialog'
    export default {
        data () {
            return {
                categoryList: [],
                totals: 0,
                param: {
                    cateType: 1, // 1 前台类目 2 后台类目
                    level: 1,
                    pid: 0,
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
                currentNode: null
            }
        },
        mixins: [common, productCommon],
        components: {
            categoryEdit
        },
        created () {
            this.getList()
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
    .el-dialog__footer{
        padding-bottom: 60px;
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

    .custom-tree-node {
        display: flex;
        width: 100%;
        align-items: center;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
        padding: 10px 0;
        >div{
            flex: 1;
        }
    }

    .attr-item-box {
        display: flex;
        flex-wrap: wrap;
        line-height: 24px;
        align-items: center;
        margin-top: 10px;
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
