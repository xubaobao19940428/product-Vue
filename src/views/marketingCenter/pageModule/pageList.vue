<template>
    <div class="page-list-container app-container">
        <el-form inline label-width="90px" :model="searchParam">
            <el-form-item label="国家：">
                <el-select v-model="searchParam.countryCode"
                            filterable
                            size="medium"
                            clearable>
                    <el-option v-for="item in countryList"
                                :key="item.shortCode"
                                :label="item.nameLocal"
                                :value="item.shortCode">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="页面标题：">
                <el-input v-model="searchParam.title" size="medium" clearable/>
            </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button 
                    type="primary" 
                    icon="el-icon-search" 
                    @click="getList(1)"
                    size="medium"
                >查询</el-button>
            </el-form-item>
        </el-form>
        <div class="operator-container">
            <el-button type="primary" size="medium" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </div>
        <div class="main-content-wrapper">
            <el-table 
                :data="dataList" 
                v-loading="load" 
                style="width: 100%;" 
                height="100%"
            >
                <el-table-column label="页面ID" prop="pageId" align="center" fixed></el-table-column>
                <el-table-column label="页面标题" align="center">
                    <template slot-scope="scope">
                        {{ getNameCn(scope.row) }}
                    </template>
                </el-table-column>
                <el-table-column label="国家" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="页面链接" min-width="240">
                    <template slot-scope="scope">
                        {{ getLink(scope.row.serialId) }}
                    </template>
                </el-table-column>
                <el-table-column label="失效时间" min-width="120" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.invalidTime | secondTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <div :class="['circle', scope.row.status === 1 ? 'circle-active' : '']"></div>
                        {{ pageStatus[scope.row.status] }}
                    </template>
                </el-table-column>
                <el-table-column label="更新人" prop="operator"></el-table-column>
                <el-table-column label="更新时间" min-width="120" align="center">
                    <template slot-scope="scope">{{ scope.row.updateTime | secondTimeFormat }}</template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="80" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="medium" plain @click="handleOpt(scope.row)">操作</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="pagination-box">
            <el-pagination
                @current-change="getList"
                @size-change="handleSizeChange"
                :current-page="searchParam.page.pageNum"
                :page-size="searchParam.page.pageSize"
                layout="sizes, total, prev, pager, next, jumper"
                :page-sizes="[5, 10, 15, 20]"
                :total="totals">
            </el-pagination>
        </div>

        <history-table v-if="dialog.show" :dialog="dialog" @cancel="handelCancel" @rush="getList"></history-table>
    </div>
</template>

<script>
import { listPage } from '@/request/marketing'
import historyTable from './components/historyTable'

export default {
    components: {
        historyTable
    },
    data () {
        return {
            searchParam: {
                countryCode: '',
                title: '',
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            },
            load: false,
            totals: 0,
            dataList: [],
            dialog: {
                show: false,
                serialId: '',
                countryCode: ''
            },
            pageStatus: {
                1: '生效中',
                2: '未生效',
                3: '已失效'
            }
        }
    },
    computed: {
        countryList () {
            return this.$store.state.dict.countryList
        }
    },
    created () {
        this.getList(1)
    },  
    methods: {
        handleSizeChange (value) {
            Object.assign(this.searchParam.page, {
                pageSize: value,
                pageNum: 1
            })
            this.getList()
        },
        getLink (serialId) {
            let url = process.env.VUE_APP_BASIC_URL + 'activityPreview?serialId=' + serialId

            return url
        },
        getList (page) {
            this.load = true
            this.searchParam.page.pageNum = page || this.searchParam.page.pageNum
            listPage(this.filterData(this.searchParam)).then(res => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.marketingPageInfoList
                    this.totals = res.total
                }
                this.load = false
            }).catch(err => {
                this.load = false
                console.log(err)
            })
        },
        handleAdd () {
            this.$router.push({
                name: 'pageEdit'
            })
        },
        handleOpt (row) {
            Object.assign(this.dialog, {
                show: true,
                serialId: row.serialId,
                countryCode: row.countryCode
            })
        },
        handelCancel () {
            Object.assign(this.dialog, {
                show: false,
                serialId: '',
                countryCode: ''
            })
        },
        getNameCn (row) {
            let res = ''
            if (row.title && row.title.length) {
                res = row.title.find(item => item.languageCode === 'cn')
            }

            return res ? res.name : ''
        }
    }
}
</script>
<style lang="scss">
.page-list-container {
    .circle {
        height: 6px;
        width: 6px;
        border-radius: 50%;
        background-color: #aaa;
        display: inline-block;
    }
    .circle-active {
        background-color: #67c23a;
    }
}
</style>