<template>
    <div class="special-list">
        <div class="sort-column" @click="sortColumn">排序</div>
        <el-tabs v-model="activeColumnTabs" type="card" @tab-click="columntabsClick" addable @tab-add="handleTabsEdit">
            <el-tab-pane v-for="(item, index) in columnTabs" :id="item.specialColumnId" :name="item.specialColumnId" :label="item.specialColumnName" :key="index">
                <span slot="label">{{item.specialColumnName}}  <i class="el-icon-edit-outline" v-if="activeColumnTabs === item.specialColumnId" @click="editColumn(item)"></i></span>
                <div class="subject-module-wrapper" v-if="item.contentType!==2">
                    <div class="subject-banner-box" v-if="item.contentType===1">
                        <div class="subject-banner" @click="bannerClick(index)" :class="{active : item.isChoseBanner}">banner</div>
                    </div>
                    <div class="subject-module">
                        <div class="left" v-if="item.contentType===1">专题：</div>
                        <div class="center" :id="'subjectLabel' + item.specialColumnId" v-if="item.contentType===1">
                            <span v-for="(item, i) in item.specialSubject" :key="i" class="subject-item" :class="{active : active === item.specialSubjectId}" @click="selectItem(item,index)">
                                {{item.specialSubjectName}}
                                <i class="el-icon-edit-outline" v-if="item.specialSubjectId != 0 && active === item.specialSubjectId" @click="editSubject(item)"></i>
                            </span>
                        </div>
                        <div class="center" v-if="item.contentType===3">
                            <span v-for="(item, i) in item.topics" :key="i" class="subject-item" :class="{active : active === item.topicId}" @click="selectItem(item,index)">
                                <img :src="item.topicCover"/>
                                <span>{{item.topicName[1].content}}</span>
                                <i class="el-icon-edit-outline" v-if="item.topicId != 0 && active === item.topicId" @click="editSubject(item)"></i>
                            </span>
                        </div>
                        <div class="right" v-if="item.contentType !== 2">
                            <div class="subject-sort" v-if="item.contentType === 1" @click="subjectSort">专题排序</div>
                            <el-button icon="el-icon-plus" type="primary" size="medium" @click="addSubject">{{item.contentType === 1? '添加专题':item.contentType === 3?'添加话题':'' }}</el-button>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <topic-dialog v-if="editDialogVisible" :dialogVisible="editDialogVisible" :editSubjectType="editSubjectType" :contentType="contentType" :subjectObject="subjectObject" :pic="pic" @on-cancle="cancleEdit" @on-confirm="confirmEdit"></topic-dialog>
        <column-dialog v-if="columnDialogVisible" :dialogVisible="columnDialogVisible" :editColumnType="editColumnType" :columnObject="columnObject" @on-cancle="cancleColumn" @on-confirm="confirmColumn"></column-dialog>
        <graphic-table v-if="contentType===1 && active!==''" ref="graphic" :queryData="queryData" :activeColumnTabs="activeColumnTabs" :active="active"></graphic-table>
        <banner-table ref="bannerTable" v-if="active=='' && contentType===1" :specialColumnId="activeColumnTabs" @synChronizeToBanner="synChronizeToBanner"></banner-table>
        <feed-list ref="feedList" v-if="contentType===2" :queryData="queryData" :activeColumnTabs="activeColumnTabs"></feed-list>
        <buyer-show-list ref="buyerShowList" v-if="contentType===3" :contentType="3" :queryData="queryData" :activeColumnTabs="activeColumnTabs" :active="active"></buyer-show-list>
        <sort-column v-if="sortDialog" :dialogVisible="sortDialog" :columnTabs="columnTabs" @on-cancel="sortDialogCancel"></sort-column>
        <sort-subject v-if="sortSubjectDialog" :dialogVisible="sortSubjectDialog" :subjectList="subjectList" @on-cancel="sortSubjectDialogCancel"></sort-subject>
    </div>
</template>
<script>
    import { FindAllSpecialColumn, AddSpecialSubject, EditSpecialSubject, SortSpecialColumn,
             SortSpecialSubject, AddSpecialColumn, EditSpecialColumn, AddTopic, EditTopic } from '@/request/manage'
    import { mapState } from 'vuex'
    import Sortable from 'sortablejs'
    import TopicDialog from '../components/TopicDialog'
    import columnDialog from '../listComponents/columnDialog'
    import graphicTable from './graphicTable'
    import BannerTable from '../components/BannerTable'
    import feedList from './feedList'
    import buyerShowList from './buyerShowList'
    import sortColumn from './sortColumn'
    import sortSubject from './sortSubject'

    export default {
        data () {
            return {
                activeColumnTabs: '',
                active: '', // 选中的专题
                subjectList: [],
                columnTabs: [],
                editSubjectType: 'add', // 专题操作类型
                editColumnType: 'add', // 专栏操作类型
                distinguish: 'column',
                columnTemp: {},
                columnObject: {},
                subjectTemp: {},
                subjectObject: {},
                editDialogVisible: false,
                columnDialogVisible: false,
                sortDialog: false,
                sortSubjectDialog: false,
                contentType: 0,
                pic: ''
            }
        },
        props: {
            queryData: Object
        },
        components: {
            TopicDialog,
            columnDialog,
            graphicTable,
            BannerTable,
            feedList,
            buyerShowList,
            sortColumn,
            sortSubject
        },
        mounted () {
            this.getAllSubjects()
        },
        computed: {
            ...mapState({
                initData: state => state.contentManage.initData
            }),
            languageList () {
                // 多语言
                let languageList = JSON.parse(this.getStore('languageList'))
                return languageList
            }
        },
        methods: {
            // 获取专栏、专题
            getAllSubjects (val) {
                console.log(this.initData.countryCode)
                let storage = window.localStorage
                let params = {
                    country: this.initData.countryCode
                }
                // this.subjectList = []
                FindAllSpecialColumn(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.columnTabs = [].concat(res.specialColumn)
                        console.log(this.columnTabs)
                        for (const iterator of this.columnTabs) {
                            if (storage.specialColumnId) {
                                Object.assign(iterator, { isChoseBanner: false })
                            }else if (iterator.contentType === 1 && this.active === '') {
                                Object.assign(iterator, { isChoseBanner: true })
                            }
                            if (iterator.specialColumnId === this.activeColumnTabs) {
                                this.subjectList = [].concat(iterator.specialSubject)
                            }
                        }
                        if(this.columnTabs[0].contentType === 1){
                            this.subjectList = this.columnTabs[0].specialSubject
                            console.log(this.subjectList)
                        }
                        // if (val === 1) {
                        //     console.log('=====>')
                        //     this.activeColumnTabs = res.specialColumn[0].specialColumnId
                        //     this.contentType = res.specialColumn[0].contentType
                        //     this.active = ''
                        //     console.log(this.$refs)
                        //     console.log(this.activeColumnTabs)
                        //     switch (this.contentType) {
                        //         case 1: this.$refs.bannerTable && this.$refs.bannerTable.getBannerData(this.activeColumnTabs); break
                        //         case 2: this.$refs.feedList && this.$refs.feedList.getAllArticle(this.activeColumnTabs); break
                        //         case 3: this.$refs.buyerShowList && this.$refs.buyerShowList.getAllArticle(this.activeColumnTabs); break
                        //     }
                        //     this.$emit('contentType', this.contentType)
                        // }
                        if (val === 1) {
                            this.activeColumnTabs = res.specialColumn[0].specialColumnId
                            this.contentType = res.specialColumn[0].contentType
                            this.active = ''
                        } else if (!storage.specialColumnId){
                            this.activeColumnTabs = res.specialColumn[0].specialColumnId
                            this.contentType = res.specialColumn[0].contentType
                            this.active = ''
                        }else {
                            this.activeColumnTabs = storage.specialColumnId
                            this.active = storage.specialSubjectId
                            this.contentType = Number(storage.contentType)
                        }
                        switch (this.contentType) {
                            case 1: this.$refs.bannerTable && this.$refs.bannerTable.getBannerData(this.activeColumnTabs); break
                            case 2: this.$refs.feedList && this.$refs.feedList.getAllArticle(this.activeColumnTabs); break
                            case 3: this.$refs.buyerShowList && this.$refs.buyerShowList.getAllArticle(this.activeColumnTabs); break
                        }
                        this.$emit('contentType', this.contentType)
                    }
                })
            },
            columntabsClick (tab) {
                this.activeColumnTabs = tab.name
                this.active = ''
                for (const i in this.columnTabs) {
                    if (this.columnTabs[i].specialColumnId === this.activeColumnTabs) {
                        this.contentType = this.columnTabs[i].contentType
                        this.subjectList = this.columnTabs[i].specialSubject
                        if (this.contentType === 3) {
                            this.$nextTick(() => {
                                this.$refs.buyerShowList.getAllArticle()
                            })
                        } else if (this.contentType === 2) {
                            this.$nextTick(() => {
                                this.$refs.feedList.getAllArticle()
                            })
                        } else if (this.contentType === 1) {
                            this.$nextTick(() => {
                                this.$refs.bannerTable.getBannerData()
                            })
                        }
                    }
                }
                this.$emit('contentType', this.contentType)
            },
            subjectSort () {
                console.log(this.subjectList)
                this.sortSubjectDialog = true
            },
            sortSubjectDialogCancel () {
                this.sortSubjectDialog = false
                this.getAllSubjects()
            },
            sortColumn () {
                this.sortDialog = true
            },
            sortDialogCancel () {
                this.sortDialog = false
                this.getAllSubjects()
            },
            SortSpecialColumn (id, index) {
                let params = {
                    specialColumnId: id,
                    orderIndex: index
                }
                SortSpecialColumn(params).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('专栏位置更新成功！')
                    }
                })
            },
            handleTabsEdit () {
                this.editColumnType = 'add'
                this.columnDialogVisible = true
            },
            editColumn (item) {
                this.editColumnType = 'edit'
                let column = {}
                let subarr = []
                for (let item of item.specialColumnContent) {
                    column[item.language]=item.content
                }
                console.log(column)
                this.columnObject = column
                this.columnObject.cn = item.specialColumnName
                let newarr = []
                console.log(this.columnObject)
                this.columnTemp.specialColumnId = item.specialColumnId
                this.columnDialogVisible = true
            },
            cancleColumn () {
                this.columnDialogVisible = false
            },
            confirmColumn (columnInfo, type) {
                let columnObj = []
                Object.keys(columnInfo).forEach(function (key) {
                    if (columnInfo[key] !== undefined) {
                        columnObj.push({ language: key, content: columnInfo[key] })
                    }
                })
                console.log(columnObj)
                
                console.log(this.editColumnType)
                if (this.editColumnType == 'add') {
                    let params = {
                        specialColumnName: columnInfo.cn,
                        specialColumnContent: columnObj,
                        contentType: type,
                        country: this.initData.countryCode,
                        specialColumnBanner: []
                    }
                    this.insertColumnRequset(params)
                } else {
                    let params = {
                        specialColumnName: columnInfo.cn,
                        langContent: columnObj,
                        contentType: type,
                        country: this.initData.countryCode,
                        specialColumnBanner: []
                    }
                    params.specialColumnId = this.columnTemp.specialColumnId
                    this.updateColumnRequset(params)
                }
            },
            insertColumnRequset (params) {
                AddSpecialColumn(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('专栏添加成功')
                        this.columnDialogVisible = false
                        this.getAllSubjects()
                    }
                }).catch(err => {
                    this.$message.error('专栏添加失败')
                })
            },
            updateColumnRequset (params) {
                EditSpecialColumn(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        this.$message.success('专栏更改成功')
                        this.columnDialogVisible = false
                        this.getAllSubjects()
                    }
                }).catch(err => {
                    this.$message.error('专栏更改失败')
                })
            },
            bannerClick (index) {
                this.active = ''
                this.columnTabs[index].isChoseBanner = true
            },
            selectItem (item, index) {
                if (this.contentType === 1) {
                    this.active = item.specialSubjectId
                    this.$nextTick(() => {
                        this.$refs.graphic.getAllArticle()
                    })
                } else {
                    this.active = item.topicId
                    localStorage.topicName = JSON.stringify(item.topicName)
                    this.$nextTick(() => {
                        this.$refs.buyerShowList.getAllArticle()
                    })
                }
                this.columnTabs[index].isChoseBanner = false
            },
            addSubject () {
                this.editSubjectType = 'add'
                this.editDialogVisible = true
            },
            editSubject (item) {
                console.log(item)
                this.editSubjectType = 'edit'
                this.subjectTemp = item
                let subject = {}
                let subarr = []
                if (this.contentType === 1) {
                    for (let val of item.specialSubjectContent) {
                        subject[val.language]=val.content
                    }
                    this.subjectObject.cn = item.specialSubjectName
                } else {
                    this.pic = item.topicCover
                    for (let item of item.topicName) {
                        console.log(item)
                        subject[item.language] = item.content
                    }
                }
                this.subjectObject = subject
                console.log(this.subjectObject)
                this.editDialogVisible = true
            },
            // 专题排序
            sortSubject (id, index) {
                console.log(id, index)
                let params = {
                    specialSubjectId: id,
                    orderIndex: index
                }
                SortSpecialSubject(params).then(res => {
                    this.$message.success('专题位置更新成功')
                })
            },
            cancleEdit () {
                this.editDialogVisible = false
            },
            confirmEdit (subjectInfo, pic) {
                console.log(pic)
                let subjectObj = []
                console.log(subjectInfo)
                Object.keys(subjectInfo).forEach(function (key) {
                    if (subjectInfo[key] !== undefined) {
                        subjectObj.push({ language: key, content: subjectInfo[key] })
                    }
                })
                console.log(subjectObj)
                this.editDialogVisible = false
                if (this.contentType === 1) {
                    let params = {
                        specialColumnId: this.activeColumnTabs, // 专栏Id
                        specialSubjectName: subjectInfo.cn,
                        specialSubjectContent: subjectObj
                    }
                    if (this.editSubjectType === 'add') {
                        this.insertSubjectRequset(params)
                    } else {
                        params.specialSubjectId = this.subjectTemp.specialSubjectId
                        this.updateSubjectRequset(params)
                    }
                } else {
                    if (this.editSubjectType === 'add') {
                        let params = {
                            specialColumnId: this.activeColumnTabs, // 专栏Id
                            topicCover: pic,
                            topicName: subjectObj
                        }
                        this.insertSubjectRequset(params)
                    } else {
                        if (this.contentType == 1) {
                            let params = {
                                specialColumnId: this.activeColumnTabs, // 专栏Id
                                topicCover: pic,
                                topicName: subjectObj
                            }
                            params.specialSubjectId = this.subjectTemp.specialSubjectId
                            this.updateSubjectRequset(params)
                        } else {
                            let params = {
                                topicId: this.active, // 专栏Id
                                topicCover: pic,
                                topicName: subjectObj
                            }
                            this.updateSubjectRequset(params)
                        }
                    }
                }
            },
            insertSubjectRequset (params) {
                if (this.contentType === 1) {
                    AddSpecialSubject(this.filterData(params)).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('专题添加成功')
                            this.getAllSubjects()
                        }
                    }).catch(err => {
                        this.$message.error('专题添加失败')
                    })
                } else {
                    AddTopic(this.filterData(params)).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('话题添加成功')
                            this.getAllSubjects()
                        }
                    })
                }
            },
            updateSubjectRequset (params) {
                if (this.contentType === 1) {
                    EditSpecialSubject(this.filterData(params)).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('专题更改成功')
                            this.getAllSubjects()
                        }
                    }).catch(err => {
                        this.$message.error('专题更改失败')
                    })
                } else {
                    EditTopic(this.filterData(params)).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$message.success('话题更改成功')
                            this.getAllSubjects()
                        }
                    })
                }
            }
        }
    }
</script>
<style lang="scss">
    .special-list{
        .el-tabs__new-tab{
            margin-right: 10px;
            border: 1px solid #409EFF;
            background: #409EFF;
        }
        .el-tabs__new-tab:hover {
            color: #d3dce6;
        }
    }
</style>
<style lang="scss" scoped>
    .special-list{
        position: relative;
        .sort-column{
            position: absolute;
            top: -12px;
            right: 7px;
            font-size: 12px;
            color:#409EFF;
            cursor: pointer;
        }
        .subject-module-wrapper {
            display: flex;
            flex-direction: row;
            padding-bottom: 10px;
            .subject-module {
                display: flex;
                width: 100%;
                height: 80px;
                align-items: center;
                border-bottom: 1px dashed #ccc;
                margin-bottom: 10px;
                .left {
                    width: 50px;
                }
                .right {
                    width: 150px;
                    text-align: center;
                    .subject-sort{
                        margin-bottom: 8px;
                        color: #409EFF;
                        font-size: 12px;
                        cursor: pointer;
                    }
                }
                .center {
                    flex: 1;
                    white-space: nowrap;
                    width: 900px;
                    overflow-x: scroll;
                    span {
                        margin: 6px 8px;
                        padding: 6px 10px;
                        text-align: center;
                        line-height: initial;
                        cursor: pointer;
                        border-radius: 4px;
                    }
                    img{
                        width: 20px;
                        height: 20px;
                    }
                    .subject-item {
                        display: -webkit-inline-box;
                        border: 1px solid #909399;
                        color: #909399;
                        cursor: pointer;
                    }

                }
            }
        }
        .active {
            background-color: #3a97ff;
            border: 1px solid #3a97ff !important;
            color: #fff !important;
            border-radius: 4px;
        }
        .subject-banner-box{
            display: flex;
            align-items: center;
            height: 80px;
            width: 100px;
            border-bottom: 1px dashed #DCDFE6;
            .subject-banner{
                width: 80px;
                height: 34px;
                line-height: 34px;
                border: 1px solid #909399;
                border-radius: 4px;
                color: #909399;
                text-align: center;
                cursor: pointer;
            }
        }
        .sync-other-country{
            position: absolute;
            right: 33px;
            width: 110px;
            color: #409EFF;
            z-index: 1;
            color: #409EFF;
            font-size: 12px;
            cursor: pointer;
        }
    }
</style>
