<template>
    <div class="content-manage">
        <el-form ref="contentFilterForm" inline label-width="90px" :model="queryData">
            <el-form-item label="标题：" class="filter-item" prop="value">
                <el-input
                v-model="queryData.value"
                style="width: 200px; margin-right: 20px;"
                size="medium"
                placeholder="请输入"
                clearable
                ></el-input>
            </el-form-item>
            <el-form-item label="标签：" class="filter-item" prop="selectTag" >
                <label slot="label">
                    <el-tooltip class="item" effect="dark" content="可输入多个标签同时搜索" placement="top">
                        <span>标签 <i class="el-icon-warning-outline"></i> ：</span>
                    </el-tooltip>
                </label>
                <el-select v-model="queryData.selectTag" size="medium" multiple filterable clearable reserve-keyword remote  :remote-method="SearchTag" @change="tagChose" style="width: 200px;">
                <el-option
                    v-for="(item, index) in selectTagList"
                    :key="index"
                    :label="item.tagName"
                    :value="item.id"
                ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发送状态：" class="filter-item" prop="sendStatus">
                <el-select v-model="queryData.sendStatus" size="medium" style="width: 110px;" @change="sendStatusChose">
                <el-option
                    v-for="(item, index) in sendStatusList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择日期：" class="filter-item" prop="timeList">
                    <el-date-picker v-model="queryData.timeList"
                        size="medium"
                        type="daterange"
                        value-format="timestamp"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
            <el-form-item class="filter-item" style="margin-left: 20px;">
                <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
            </el-form-item>
        </el-form>
        <el-tabs v-model="activeCountryName" @tab-click="countrytabsClick" style="margin:0 5px 5px 0" class="content-manage-tab">
            <el-tab-pane v-for="(item, index) in countryList" :label="item.nameLocal" :name="item.shortCode" :key="index">
            </el-tab-pane>
        </el-tabs>
        <special-list ref="specialList" :queryData="queryData" @contentType="sendType"></special-list>
    </div>
</template>
<script>
    import { FindAllSearchTag } from '@/request/manage'
    import specialList from './listComponents/specialList'

    export default {
        data () {
            return {
                queryData: {
                    value: '',
                    selectTag: [],
                    sendStatus: null,
                    timeList: '',
                    page: {
                        pageSize: 10,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                },
                selectTagList:[],
                sendStatusList: [{
                    label: '待发送',
                    value: 1
                }, {
                    label: '已发送',
                    value: 2
                }, {
                    label: '已撤回',
                    value: 3
                }],
                activeCountryName: 'MY',
                contentType: ''
            }
        },
        components: {
            specialList
        },
        created () {
            this.countryList = JSON.parse(this.getStore('countryList'))
            this.languageList = JSON.parse(this.getStore('languageList'))
            console.log('====>',this.$route.query)
            if (this.$route.query.countryCode) {
                this.activeCountryName = this.$route.query.countryCode
            }
        },
        mounted() {
            let storage = window.localStorage
            if (storage.countryCode) {
                this.activeCountryName = storage.countryCode
            }
            this.SearchTag()
        },
        methods: {
            // 标签
            SearchTag (tag) {
                let params = {
                    tagName: tag?tag:'',
                    tagId: []
                }
                FindAllSearchTag(params).then(res => {
                    console.log(res)
                    this.selectTagList = res.tags
                })
            },
            countrytabsClick (tab) {
                this.activeCountryName = tab.name
                this.$store.dispatch('updateCountry', {
                    countryName: tab.label,
                    countryCode: tab.name
                })
                let storage = window.localStorage
                storage.countryCode=tab.name
                this.$refs.specialList.getAllSubjects(1)
            },
            sendType (val) {
                this.contentType = val
            },
            search () {
                console.log('===>',this.contentType,this.$refs.specialList.$refs.graphic)
                switch(this.contentType){
                    case 1:this.$refs.specialList.$refs.graphic && this.$refs.specialList.$refs.graphic.getAllArticle();break;
                    case 2:this.$refs.specialList.$refs.feedList && this.$refs.specialList.$refs.feedList.getAllArticle();break;
                    case 3:this.$refs.specialList.$refs.buyerShowList && this.$refs.specialList.$refs.buyerShowList.getAllArticle();break;
                }
            },
            resetSearch () {
                Object.assign(this.queryData,{
                    value: '',
                    selectTag: [],
                    sendStatus: null,
                    timeList: '',
                    page: {
                        pageSize: 10,
                        pageNum: 1,
                        pagingSwitch: true
                    }
                })
                this.search()
            }
        }
    }
</script>
<style lang="scss">
    .content-manage{
        overflow: scroll;
        .content-manage-tab{
            .el-table_1_column_1{
                text-align: center;
            }
            .el-radio{
                margin-bottom: 10px;
            }
        }
    }
</style>
<style lang="scss" scoped>

</style>
