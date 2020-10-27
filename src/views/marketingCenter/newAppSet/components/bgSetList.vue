<template>
    <div class="mar-b-10">
        <el-table border
                  :data="dataBgList">
            <el-table-column v-if="dialogType == 3" label="功能区背景图" align="center" min-width="100px" fixed="left">
                <template slot-scope="scope">
                    <el-popover placement="top-start" trigger="hover">
                        <img :src="getMultiLangShowInfo(scope.row.backgroundCover, 'image')" class="previewImage">
                        <img :src="getMultiLangShowInfo(scope.row.backgroundCover, 'image')" class="thumbnail" slot="reference">
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column :label="dialogType == '9' ? '首页类目背景色值': '文案色值'" fixed="left" align="center" min-width="180px">
                <template slot-scope="scope">
                    <div class="flex">
                        <span :style="{ backgroundColor: scope.row.backgroundColor, width: '20px', height: '20px', display: 'flex' }"></span>
                        <span>{{ scope.row.backgroundColor }}</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="修改时间" align="center" min-width="180px">
                <template slot-scope="scope">
                    {{scope.row.updateTime | formatTime}}
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
            <el-table-column fixed="right" label="操作" align="center" width="180px">
                <template slot-scope="scope">
                    <el-button plain type="primary"
                               size="mini"
                               v-if="hasPermission('BTN_BG_SET_LIST_EDIT')"
                               @click="showBgDialog(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <background-setting :dialogBgVisible="dialog.bgShow" :dialogType="dialogType" :countryList="countryList" :propParam="dialog.param"  @confirm="confirmEditItem" @close="dialog.bgShow = false"></background-setting>
    </div>
</template>
<script>
    import { getBackGroundInfo } from '@/request/promotion.js'
    import common from '@/js/common/mixins.js'
    import backgroundSetting from './bgSetDialog'
    export default {
        props: {
            countryList: Array,
            countryCode: String,
            dialogType: [String, Number] // 1banner 2服务文案 3功能区 4腰封 5营销card 6平台广告位 7广告card 8宫格区
        },
        mixins: [common],
        data () {
            return {
                searchParam: {
                    type: '',
                    countryCode: 'MY'
                },
                dataBgList: [],
                dialog: {
                    bgShow: false,
                    param: {}
                }
            }
        },
        watch: {
            countryCode: {
                handler (val) {
                    this.searchParam.countryCode = this.countryCode
                    this.getList()
                },
                deep: true
            }
        },
        components: {
            backgroundSetting
        },
        mounted () {
            this.searchParam.type = this.dialogType
            this.searchParam.countryCode = this.countryCode
            this.getList()
        },
        methods: {
            getList () {
                getBackGroundInfo(this.searchParam).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataBgList = res.backGroundInfo ? [res.backGroundInfo] : []
                    }
                })
            },
            // 背景设置
            showBgDialog (data) {
                this.dialog.param = data
                this.dialog.bgShow = true
            },
            confirmEditItem () {
                this.getList()
                this.dialog.bgShow = false
            }
        }
    }
</script>
<style lang="scss" scoped>
    header{
        width: 100%;
        height: 48px;
    }
    .main{
        height: 200px;
        margin-bottom: 20px;
    }
    article{

    }
</style>
