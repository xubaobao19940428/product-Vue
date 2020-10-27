<template>
    <div class="version-manage">
        <!-- <el-tabs v-model="activeCountry" type="card" @tab-click="handleClick">
            <el-tab-pane
                :key="item.name"
                v-for="(item, index) in countryList"
                :label="item.nameCn"
                :name="item.shortCode"
            >
            </el-tab-pane>
        </el-tabs> -->
        <!-- <el-card class="box-card card">
            <div class="title">当前版本</div>
            <el-table :data="currentTableData" border style="width: 100%">
                <el-table-column label="客户端类型" align="center" width="120" prop="appName">
                    <template slot-scope="scope">
                    {{ scope.row.clientType === 1 ? '安卓' : 'IOS' }}
                    </template>
                </el-table-column>
                <el-table-column label="版本号" align="center" width="150" prop="versionCode"></el-table-column>
                <el-table-column label="版本id" align="center" width="150" prop="versionId"></el-table-column>
                <el-table-column label="更新描述（英文）" align="center" width="150"></el-table-column>
                <el-table-column label="更新类型" align="center" width="120">
                    <template slot-scope="scope">
                    {{ scope.row.updateType === 1 ? '非强制更新' : '强制更新' }}
                    </template>
                </el-table-column>
                <el-table-column label="安装包" align="center" width="120"></el-table-column>
                <el-table-column label="创建时间" align="center" width="150">
                    <template slot-scope="scope">
                    {{ scope.row.createTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" align="center" width="150">
                    <template slot-scope="scope">
                    {{ scope.row.updateTime | formatTime }}
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-card class="box-card card">
            <div class="title">最低版本</div>
            <el-table :data="lowerTableData" border style="width: 100%">
                <el-table-column label="客户端类型" align="center" width="120" prop="appName">
                    <template slot-scope="scope">
                    {{ scope.row.clientType === 1 ? '安卓' : 'IOS' }}
                    </template>
                </el-table-column>
                <el-table-column label="版本号" align="center" width="150" prop="versionCode"></el-table-column>
                <el-table-column label="版本id" align="center" width="150" prop="versionId"></el-table-column>
                <el-table-column label="更新描述（英文）" align="center" width="150"></el-table-column>
                <el-table-column label="更新类型" align="center" width="120">
                    <template slot-scope="scope">
                    {{ scope.row.updateType === 1 ? '非强制更新' : '强制更新' }}
                    </template>
                </el-table-column>
                <el-table-column label="安装包" align="center" width="120"></el-table-column>
                <el-table-column label="创建时间" align="center" width="150">
                    <template slot-scope="scope">
                    {{ scope.row.createTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="更新时间" align="center" width="150">
                    <template slot-scope="scope">
                    {{ scope.row.updateTime | formatTime }}
                    </template>
                </el-table-column>
            </el-table>
        </el-card> -->
        <el-card class="box-card card">
            <div class="version-title">
                <div class="title">版本记录</div>
                <el-button type="primary" class="add-btn" @click="addVersion">+ 添加版本</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column label="序号" align="center" type="index" width="50"></el-table-column>
                <el-table-column label="客户端类型" align="center" width="100" prop="appName">
                    <template slot-scope="scope">
                        {{ scope.row.clientType === 1 ? '安卓' : 'IOS' }}
                    </template>
                </el-table-column>
                <el-table-column label="版本号" align="center" width="120" prop="versionCode"></el-table-column>
                <!-- <el-table-column label="版本id" align="center" width="120" prop="versionId"></el-table-column> -->
                <el-table-column label="更新描述（中文）" align="center" width="150">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="showContent(scope.row.contentLang,'cn')" placement="top">
                            <div class="content-desc">{{ showContent(scope.row.contentLang,'cn') }}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="更新描述（英文）" align="center" width="150">
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="dark" :content="showContent(scope.row.contentLang,'en')" placement="top">
                            <div class="content-desc">{{ showContent(scope.row.contentLang,'en') }}</div>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column label="更新类型" align="center" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.updateType === 1 ? '非强制更新' : '强制更新' }}
                    </template>
                </el-table-column>
                <el-table-column label="更新国家" align="center" width="120">
                    <template slot-scope="scope">
                        {{ scope.row.country }}
                    </template>
                </el-table-column>
                <el-table-column label="安卓安装包" align="center" width="150">
                    <template slot-scope="scope">
                        {{ scope.row.appUrl === '' ? '-': scope.row.appUrl }}
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.createTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="发布时间" align="center" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="发布状态" align="center" width="180">
                    <template slot-scope="scope">
                        {{ scope.row.status === 0 ? '已发布' : scope.row.status === 1 ? '未发布' : '已撤销' }}
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status === 1 || scope.row.status === 2" type="primary" size="small" @click="revokeClick(scope.row,0)">发布</el-button>
                        <el-button v-if="scope.row.status === 1 || scope.row.status === 2" @click="versionEdit(scope.row.id)" size="small">编辑</el-button>
                        <el-button v-if="scope.row.status === 0" type="danger" size="small" @click="revokeClick(scope.row,2)">撤销</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-wrapper">
                <el-pagination
                    @size-change="handleSizeChanges"
                    @current-change="handleCurrentChanges"
                    :current-page="page.pageNum"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total">
                </el-pagination>
            </div>
        </el-card>
        <version-edit v-if="versionDialog" :dialogVisible="versionDialog" :countryList="countryList" :editType="editType" :versionDetailModel="versionDetail" @closeDialog="closeDialog" @confirmDialog="confirmDialog"></version-edit>
    </div>
</template>
<script>
    import { SearchCurrentAppVersionInfo, SearchLowestAppVersionInfo, SearchAppVersionInfoWithPage, PublishAppVersionOrNot, GetAppVersionDetail } from '@/request/pushtask'
    import versionEdit from './components/versionEdit'
    export default {
        data () {
            return {
                activeCountry: 'MY',
                lowerTableData: [],
                currentTableData: [],
                tableData: [],
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                versionDialog: false,
                versionDetail: {},
                editType: 'add'
            }
        },
        components: {
            versionEdit
        },
        mounted () {
            this.getSearchLowestAppVersionInfo()
            this.getSearchCurrentAppVersionInfo()
            this.getSearchAppVersionInfoWithPage()
        },
        computed: {
            countryList () {
                let countryList = [].concat(this.$store.state.dict.countryList)
                let item1 = countryList.find((val) => {
                    return val.shortCode == 'ID'
                })
                if (!item1) {
                    countryList.push({
                        nameCn: '印度尼西亚',
                        nameLocal: '印度尼西亚',
                        shortCode: 'ID'
                    })
                }
                return countryList
            }
        },
        methods: {
            handleClick (val) {
                console.log(val)
                this.activeCountry = val.name
                this.getSearchLowestAppVersionInfo()
                this.getSearchCurrentAppVersionInfo()
                this.getSearchAppVersionInfoWithPage()
            },
            showContent (val,code) {
                let item = val.find( lang => {
                    return lang.language === code
                })
                return item.content
            },
            handleSizeChanges (val) {
                this.page.pageSize = val
                this.getSearchAppVersionInfoWithPage()
            },
            handleCurrentChanges (val) {
                this.page.pageNum = val
                this.getSearchAppVersionInfoWithPage()
            },
            getSearchLowestAppVersionInfo () {
                SearchLowestAppVersionInfo({country: this.activeCountry}).then(res=> {
                    if (res.ret.errcode === 1) {
                        this.lowerTableData = res.lowestVersionInfo
                    }
                })
            },
            getSearchCurrentAppVersionInfo () {
                SearchCurrentAppVersionInfo({country: this.activeCountry}).then(res=> {
                    if (res.ret.errcode === 1) {
                        this.currentTableData = res.currentVersionInfo
                    }
                })
            },
            getSearchAppVersionInfoWithPage () {
                let params = {
                    // country: this.activeCountry,
                    page: this.page
                }
                SearchAppVersionInfoWithPage(params).then(res=> {
                    if (res.ret.errcode === 1) {
                        this.tableData = res.allVersionInfo
                        this.total = res.total
                    }
                })
            },
            revokeClick (val,num) {
                let params = {
                    id: val.id,
                    status: num
                }
                PublishAppVersionOrNot(params).then(res => {
                    if (res.ret.errcode === 1) {
                        if (num === 0) {
                            this.$message.success('发布成功!')
                            this.getSearchAppVersionInfoWithPage()
                        } else {
                            this.$message.success('撤销成功!')
                            this.getSearchAppVersionInfoWithPage()
                        }
                    }
                })
            },
            addVersion () {
                this.editType = 'add'
                this.versionDialog = true
            },
            versionEdit (id) {
                this.editType = 'edit'
                GetAppVersionDetail({id}).then(res => {
                    if (res.ret.errcode === 1) {
                        this.versionDetail = Object.assign(this.versionDetail,res.currentVersionInfo,{country:res.currentVersionInfo.country.split(',')})
                        console.log(this.versionDetail)
                        this.versionDialog = true
                    }
                })
            },
            closeDialog () {
                this.versionDetail = Object.assign(this.versionDetail,{
                    clientType: '',
                    updateType: 1,
                    versionCode: '',
                    appUrl: '',
                    country: ['MY','TH','ID',"SG"],
                    cn: '',
                    en: '',
                    th: '',
                    ms: '',
                    id: '',
                    contentLang:[ { language: "cn", content: "" }, { language: "en", content: "" }, { language: "ms", content: "" }, { language: "th", content: "" }, { language: "id", content: "" }]
                })
                this.versionDialog = false
            },
            confirmDialog () {
                this.versionDialog = false
                this.versionDetail = Object.assign(this.versionDetail,{
                    clientType: '',
                    updateType: 1,
                    versionCode: '',
                    appUrl: '',
                    country: ['MY','TH','ID',"SG"],
                    cn: '',
                    en: '',
                    th: '',
                    ms: '',
                    id: '',
                    contentLang:[ { language: "cn", content: "" }, { language: "en", content: "" }, { language: "ms", content: "" }, { language: "th", content: "" }, { language: "id", content: "" }]
                })
                this.getSearchAppVersionInfoWithPage()
            }
        },
    }
</script>
<style lang="scss" scoped>
    .version-manage{
        overflow: scroll;
        .title{
            margin-bottom: 10px;
            font-size: 16px;
            font-weight: 600;
        }
        .version-title{
            display: flex;
            justify-content: space-between;
            .add-btn{
                margin-bottom: 10px;
            }
        }
        .card{
            margin-bottom: 20px;
        }
        .content-desc{
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }
    }
</style>