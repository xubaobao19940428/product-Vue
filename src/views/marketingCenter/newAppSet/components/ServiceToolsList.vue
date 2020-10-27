<template>
    <div class="app-container">
        <el-form inline>
            <el-form-item label="国家：">
                <el-select v-model="searchParam.moduleId"
                           @change="getList(1)"
                           filterable>
                    <el-option v-for="item in moduleList"
                               :key="item.id"
                               :label="item.countryName"
                               :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="right">
                <el-button size="medium"
                           type="primary"
                           v-if="hasPermission('BTN_FUNCTION_AREA_ADD')"
                           icon="el-icon-plus"
                           @click="showEditDialog('add')">新增</el-button>
            </el-form-item>
        </el-form>
        <div class="main-content-wrapper">
            <el-table border
                height="100%"
                :data="dataList"
            >
                <el-table-column label="名称" align="center" min-width="100px" fixed="left">
                    <template slot-scope="scope">
                        <span>{{ getMultiShow(scope.row.name) }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="图标" align="center" min-width="100px" fixed="left">
                    <template slot-scope="scope">
                        <el-popover placement="top-start" trigger="hover">
                            <img :src="getMultiShow(scope.row.icon, 'image')" class="previewImage">
                            <img :src="getMultiShow(scope.row.icon, 'image')" class="thumbnail" slot="reference">
                        </el-popover>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="ID" align="center" min-width="100px" ></el-table-column>
                <el-table-column label="国家" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="跳转类型" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ openType[scope.row.openType]}}
                    </template>
                </el-table-column>
                <el-table-column label="跳转链接" min-width="200px">
                    <template slot-scope="scope">
                        {{ scope.row.openType == 2 ? appPageEnum[scope.row.url] : scope.row.url }}
                    </template>
                </el-table-column>
                <el-table-column label="状态" min-width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.status == 1 ? '启用中' : '已停用' }}
                    </template>
                </el-table-column>
                <el-table-column label="排序" align="center" width="220px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sort"
                                         controls-position="right"
                                         :min="0" size="mini"
                                         :precision="0"></el-input-number>
                        <el-button type="primary" plain
                                   @click="toSort(scope.row.sort, scope.row.id)"
                                   size="mini"
                                   v-if="hasPermission('BTN_FUNCTION_AREA_SORT')"
                                   style="margin-left:5px">排序</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="修改人" align="center" prop="operation"></el-table-column>
                <el-table-column label="修改时间" align="center" min-width="180px">
                     <template slot-scope="scope">
                         {{scope.row.updated | formatTime}}
                     </template>
                 </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" width="140px">
                    <template slot-scope="scope">
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_FUNCTION_AREA_EDIT')"
                                   @click="showEditDialog('edit', scope.row)">编辑</el-button>
                        <el-button size="mini"
                                   type="text"
                                   v-if="hasPermission('BTN_FUNCTION_AREA_COPY')"
                                   @click="showEditDialog('copy', scope.row)">复制</el-button>
                        <el-button type="text"
                                   size="mini"
                                   v-if="hasPermission('BTN_FUNCTION_AREA_DELETE')"
                                   @click="toDelete(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <service-tools-edit
            v-if="dialog.show"
            :dialogVisible="dialog.show"
            :dialogTitle="dialog.title"
            :propParam="dialog.param"
            :openType="openType"
            :curType="dialog.type"
            :appPageEnum="appPageEnum"
            :moduleList="moduleList"
            @close="dialog.show = false"
            @confirm="handleConfirm"
        ></service-tools-edit>
    </div>
</template>

<script>
import ServiceToolsEdit from './ServiceToolsEdit'
import { queryList, delData, queryModuleList, setSort } from '@/api/appSet.js'
export default {
    data () {
        return {
            dataList: [],
            searchParam: {
                moduleId: 1,
                sortField: 'sort',
                sortType: 'ASC',
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                },
            },
            load: false,
            appPageEnum: {
                'MY_COUPON': '优惠券列表页',
                'CUSTOMER_SERVICE': '客服页',
                'MY_COLLECTION': '我的收藏',
                'SWITCH_COUNTRY': '切换购物站点',
                'SWITCH_LANG': '切换app语言',
                'CHECK_UPDATE': '检查更新',
                'SHIPPING_ADDRESS': '收货地址',
                'SHAKE': '摇一摇'
            },
            openType: {
                1: 'H5',
                2: '应用内'
            },
            moduleList: [],
            dialog: {
                show: false,
                title: '',
                type: 'add',
                param: {
                    moduleId: 1,
                    openType: 1, // 1 H5内 2 原生
                    url: '',
                    name: {},
                    icon: [],
                    status: 1
                }
            }
        }
    },
    components: {
        ServiceToolsEdit
    },
    mounted () {
        this.getModuleList()
        this.getList()
    },
    methods: {
        getModuleList () {
            queryModuleList({
                pageId: 1,
                notCountryCode: true,
                groupCode: 'TOOL_SERVER'
            }).then(res => {
                if (res.ret.errCode === 0) {
                    this.moduleList = res.data
                }
            })
        },
        getList (pageNum) {
            this.searchParam.page.pageNum = pageNum ? pageNum : 1
            queryList(this.filterData(this.searchParam)).then((res) => {
                if (res.ret.errCode === 0) {
                    this.dataList = res.data
                }
            })
        },
        toDelete (ids) {
            this.$confirm('此操作将永久删除该项, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delData({ 'id': ids }).then(res => {
                    if (res.ret.errCode === 0) {
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
        },
        handleConfirm () {
            this.dialog.show = false
            this.getList()
        },
        getMultiShow (data, type) {
            if (!data) return ''
            let temp = JSON.parse(data)

            switch (type) {
                case 'image':
                    return temp['cn'] ? this.dealShowFileSrc(temp['cn']) : ''
                default:
                    return temp['cn'] || ''
            }
        },
        toSort (sort, id) {
            setSort({
                'sort': sort,
                'id': id
            }).then(res => {
                if (res.ret.errCode === 0) {
                    this.getList()
                    this.$message.success('操作成功')
                }
            })
        },
        showEditDialog (type, data) {
            this.dialog.type = type
            this.dialog.title = '新增'
            if (type != 'add') {
                this.dialog.title = '编辑'
                let temp = JSON.parse(JSON.stringify(data))
                let icon = []
                let resIcon = JSON.parse(temp.icon)
                Object.keys(resIcon).forEach(key => {
                    icon.push({
                        languageCode: key,
                        name: resIcon[key] || ''
                    })
                })
                temp.icon = icon
                if (type == 'copy') {
                    this.dialog.title = '复制'
                    temp.moduleId = ''
                    temp.id = ''
                }
                this.dialog.param = {
                    moduleId: temp.moduleId,
                    name: temp.name,
                    icon: temp.icon,
                    openType: temp.openType,
                    sort: temp.sort,
                    status: temp.status,
                    url: temp.url,
                    id: temp.id
                }
            }
            this.dialog.show = true
        },
    }
}
</script>
