<template>
    <div class="app-container back-category">
        <!-- <div class="filter-container search"> -->
            <!-- <el-input v-model="keywords" placeholder="请输入关键词" style="width: 500px; margin-right: 20px;">
            <el-button type="primary" @click="search"> 快速搜索 </el-button> -->
        <!-- </div> -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="后台类目" name="1"></el-tab-pane>
            <el-tab-pane label="类目分组" name="2"></el-tab-pane>
            <el-tab-pane label="类目权限" name="3"></el-tab-pane>
        </el-tabs>
        <div class="main-content-wrapper category" v-if="activeName==1">
            <el-row :gutter="10">
                <el-col :span="8">
                    <category-card :level="1" :categoryList="categoryListLevelOne" @on-create="createCategory"
                        @on-select="handleItemSelect" @on-edit="handleItemEdit" @on-delete="handleItemDelete"
                        @on-end-sort="handleItemSort">
                    </category-card>
                </el-col>
                <el-col :span="8">
                    <category-card :level="2" :parentInfo="levelOne" :categoryList="categoryListLevelTwo"
                        @on-select="handleItemSelect" @on-create="createCategory" @on-edit="handleItemEdit"
                        @on-delete="handleItemDelete" @on-end-sort="handleItemSort">
                    </category-card>
                </el-col>
                <el-col :span="8">
                    <category-card :level="3" :parentInfo="levelTwo" :categoryList="categoryListLevelThree"
                        @on-select="handleItemSelect" @on-create="createCategory" @on-edit="handleItemEdit"
                        @on-delete="handleItemDelete" @on-end-sort="handleItemSort">
                    </category-card>
                </el-col>
            </el-row>
        </div>
        <div class="add_category" v-if="activeName==2">
            <!--新增-->
            <addCategory ref="addCategorys"></addCategory>
        </div>
        <div class="auth_category" v-if="activeName==3">
            <!--类目权限-->
            <authCategory ref="authCategory"></authCategory>
        </div>
        <back-category-edit ref="categoryEdit" :editType="editType" :level="categoryLevel" :parentInfo="parentInfo"
            :categoryData="categoryData" :dialogVisible="categoryEditVisible" @on-confirm="confirmEdit" @on-cancle="cancleEdit">
        </back-category-edit>
        <confirm-dialog :dialogVisible="confirmVisible" :title="confirmDialogTitle" :text="confirmDialogText"
            @on-cancle="cancleConfirm" @on-confirm="submitDel">
        </confirm-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import draggable from 'vuedraggable'
    import BackCategoryEdit from './components/BackCategoryEdit'
    import addCategory from './components/addCategory'
    import authCategory from './components/authCategory'
    import ConfirmDialog from '@/components/ConfirmDialog'
    import CategoryCard from './components/CategoryCard'
    import {
        categoryListGet,
        categoryAdd,
        categoryDelete,
        categoryUpdate,
        categoryChangeToSort
    } from '@/request/product'

    export default {
        // 后台类目
        name: 'BackCategory',
        provide () {
            return {
                page: this.pageName
            }
        },
        props: {
            pageName: {
                type: String,
                default: 'category'
            }
        },
        data() {
            return {
                keywords: '',
                categoryLink: [],
                categoryLinkStr: '',
                enabled: true,
                categoryListLevelOne: [],
                categoryListLevelTwo: [],
                categoryListLevelThree: [],
                dragging: false,
                active: '中文类目名#1569651168682',
                categoryEditVisible: false,
                confirmVisible: false,
                confirmDialogTitle: '',
                confirmDialogText: '',
                editType: 'add',
                categoryLevel: 1,
                parentInfo: {},
                categoryItem: {},
                levelOne: {},
                levelTwo: {},
                categoryData: {
                    name: '',
                    nameList: {
                        'cn': '',
                        'en':'',
                        'ms': '',
                        'th': '',
                        'id': ''
                    },
                    desc: '',
                    cover: '',
                    level: '1',
                    pid: 0,
                    categoryDesc: ''
                },
                activeName:"1"
            }

        },
        components: {
            draggable,
            BackCategoryEdit,
            ConfirmDialog,
            CategoryCard,
            addCategory,
            authCategory
        },
        mounted() {
            this.getCategoryList()
        },
        computed: {
            // selectedCategory: function () {
            //     return this.categoryLink
            // }
        },
        watch: {
            categoryLink: function(newValue, oldValue) {
                this.$emit('on-category-link-change', newValue)
                this.categoryLinkStr = []
                _.forEach(newValue, (item, index) => {
                    if (item.cateName) {
                        if (index === newValue.length - 1) {
                            this.categoryLinkStr += item.cateName
                        } else {
                            this.categoryLinkStr += item.cateName + ' >> '
                        }
                    }

                })
            }
        },
        methods: {
            handleClick(tabs){
                this.$emit('onChangeType',this.activeName)
                if(tabs.name==2){
                    this.$nextTick(()=>{
                        this.$refs.addCategorys.getBuyerList()

                    })
                }


            },
            checkMove: function(e) {
                console.log("index: " + e.draggedContext.futureIndex);
            },
            onEnd(data) {
                console.log(data)
            },
            selectCategory(item) {
                this.active = item.cateName;
                this.getCategoryList(item.cateId)
            },
            addBackCategory(parentInfo) {
                this.categoryData.nameList =  {
                        'cn': '',
                        'en': '',
                        'ms': '',
                        'th': '',
                        'id': ''
                },
                this.editType = "add"
                // this.categoryLevel = level
                this.parentInfo = parentInfo
                this.categoryEditVisible = true
                if (parentInfo.level > 1) {
                    this.$nextTick(() => {
                        if (parentInfo.level === 2) {
                            this.$refs.categoryEdit.getCategoryList(0, 1)
                        } else if (parentInfo.level === 3) {
                            if (this.categoryLink[0].cateId) {
                                let pid = this.categoryLink[0].cateId
                                this.$refs.categoryEdit.getCategoryList(pid, 2)
                            }
                        }
                    })
                }
            },
            delBackCategory(item) {
                this.categoryItem = item
                this.confirmDialogTitle = '确定要删除该类目吗？'
                this.confirmDialogText = ''
                this.confirmVisible = true
            },
            cancleEdit() {
                this.categoryEditVisible = false;
            },
            confirmEdit(result) {
                if (this.editType === 'add') {
                    this.addCategory(result);
                } else if (this.editType === 'edit') {
                    this.editCategory(result)
                }
            },
            cancleConfirm() {
                this.confirmVisible = false;
            },
            submitDel() {
                this.confirmVisible = false
                this.deleteCategory(this.categoryItem.cateId)
            },
            search() {
                this.getCategoryList()
            },
            /**
             * 获取类目列表
             */
            getCategoryList(pid = 0, level = 1) {
                let params = {
                    cateType: 2, //类目类型 1 前台类目 2 后台类目
                    page: {
                        pageNum: 1,
                        pageSize: 1000
                    }
                }
                params.pid = pid
                categoryListGet(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        let categoryUnitList = []
                        _.forEach(res.categoryUnit, (item) => {
                            item.cateName = item.cateNameValue[0].name
                            categoryUnitList.push(item)
                        })
                        if (level === 1) {
                            this.categoryListLevelOne = categoryUnitList
                        }
                        if (level === 2) {
                            this.categoryListLevelTwo = categoryUnitList
                        }
                        if (level === 3) {
                            this.categoryListLevelThree = categoryUnitList
                        }
                    }
                }).catch((err) => {
                    console.error(err)
                })
            },
            addCategory(params) {
                categoryAdd(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('类目添加成功')
                        // 临时改为不刷新
                        // this.getCategoryList()
                        this.categoryEditVisible = false
                    }
                })
            },
            editCategory(params) {
                console.log(params)
                categoryUpdate(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('类目修改成功')
                        this.getCategoryList()
                        this.categoryEditVisible = false
                    }
                })
            },
            deleteCategory(cateId) {
                let params = {
                    cateId: cateId
                }
                categoryDelete(params).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('删除成功')
                        // this.getCategoryList()
                    }
                })
            },
            createCategory(parentInfo) {
                if (parentInfo.pid != undefined) {
                    this.addBackCategory(parentInfo)
                } else {
                    this.$message.warning('请先选择父类目')
                }
            },
            handleItemSelect(item) {
                // 重置数组
                this.categoryLink.splice(item.level - 1, 4 - item.level)
                let linkItem = {
                    cateId: item.cateId,
                    cateName: item.cateName
                }
                this.categoryLink[item.level - 1] = linkItem
                // 获取子类目
                let pid = item.cateId
                let level = item.level + 1
                this.getCategoryList(pid, level)
                let parentCate = {
                    pid: pid,
                    cateName: item.cateName
                }
                if (item.level === 1) {
                    this.levelOne = parentCate
                    this.levelTwo = {}
                    this.categoryListLevelThree = []
                } else if (item.level === 2) {
                    this.levelTwo = parentCate
                }

                this.categoryData.pid = pid
            },
            handleItemEdit(item) {
                console.log('item', item)
                this.parentInfo = item.parentInfo
                this.editType = 'edit'
                this.categoryEditVisible = true
                this.categoryData.name = item.cateName
                this.categoryData.nameList =  {
                        'cn': '',
                        'en': '',
                        'ms': '',
                        'th': '',
                        'id': ''
                },
                _.forEach(item.cateNameValue, cateName => {
                    this.categoryData.nameList[cateName.languageCode] = cateName.name
                })
                this.categoryData.cateId = item.cateId
                this.categoryData.level = item.level
                this.categoryData.desc = item.desc
                this.categoryData.cover = item.cover
                this.categoryData.paramAttrId = item.paramAttrId
                this.categoryData.standardAttrId = item.standardAttrId
                if (item.parentInfo.level > 1) {
                    this.$nextTick(() => {
                        if (item.parentInfo.level === 2) {
                            this.$refs.categoryEdit.getCategoryList(0, 1)
                        } else if (item.parentInfo.level === 3) {
                            if (this.categoryLink[0].cateId) {
                                let pid = this.categoryLink[0].cateId
                                this.$refs.categoryEdit.getCategoryList(pid, 2)
                            }
                        }
                    })
                }
                this.$refs.categoryEdit.getBatchProductAttr()
            },
            handleItemDelete(item) {
                let level = item.level
                let pid = 0
                if (level === 2) {
                    pid = this.levelOne.pid
                }
                if (level === 3) {
                    pid = this.levelTwo.pid
                }
                this.deleteCategory(item.cateId)
                this.getCategoryList(pid, level)
            },
            handleItemSort(params) {
                categoryChangeToSort(params).then((response) => {
                    let res = response
                    if (res.ret.errcode === 1) {
                        // this.getCategoryList()
                    } else {
                        this.$message.warning('类目排序失败，刷新页面后重试')
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
    .back-category {
        .el-card__header {
            text-align: center;
            padding: 12px 20px;
        }
        .el-card__body {
            padding: 0;
        }
    }
</style>

<style lang="scss" scoped>
    .back-category {
        .search {
            margin: 0 auto;
            padding: 30px 0;
        }
        .category {
            width: 1100px;
            margin: 0 auto;
            .box-card {
                height: 510px;
                .category-list {
                    height: 410px;
                    padding: 20px;
                    .list-group-item {
                        height: 36px;
                        line-height: 36px;
                        cursor: pointer;
                    }
                    .active {
                        background-color: #c6e5ff;
                        color: #3a97ff;
                    }
                    .category-name {
                        padding: 0 10px;
                        display: inline-block;
                        width: 82%;
                    }
                    .category-name:hover {
                        color: #3a97ff;
                    }
                    .operate {
                        display: inline-block;
                    }
                }
            }
        }
        .add-category {
            text-align: center;
            border-top: 1px solid #EBEEF5;
            .el-button {
                padding: 16px;
            }
        }
    }
</style>


