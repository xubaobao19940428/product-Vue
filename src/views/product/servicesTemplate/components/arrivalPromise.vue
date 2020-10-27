<template>
    <div class="flex1 app-container">
        <div class="mar-b-10">
            <el-button icon="el-icon-plus" v-if="hasPermission('BTN_ARRIVAL_PROMISE_ADD')" plain type="primary" @click="addArrivalPromise('add')" size="small">新 增</el-button>
        </div>
        <div class="main-content-wrapper">
            <el-table border
                      height="100%"
                      :data="dataList">
                <el-table-column label="模板ID" prop="arrivalId" align="center" min-width="180px"></el-table-column>
                <el-table-column label="国家" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="标签" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ getMultiLangShowInfo(scope.row.label) }}
                    </template>
                </el-table-column>
                <el-table-column label="文案" :show-overflow-tooltip="true" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ getMultiLangShowInfo(scope.row.document) }}
                    </template>
                </el-table-column>
                <el-table-column label="外显方式" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ showType[scope.row.showType] }}
                    </template>
                </el-table-column>
                <el-table-column label="更新人" prop="operatorName" min-width="100px" header-align="center"></el-table-column>
                <el-table-column label="更新时间" min-width="180px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="180px">
                    <template slot-scope="scope">
                        <el-button v-if="hasPermission('BTN_ARRIVAL_PROMISE_EDIT')" @click="addArrivalPromise('edit', scope.row)"  plain type="primary" size="mini">编辑</el-button>
                        <el-button v-if="hasPermission('BTN_ARRIVAL_PROMISE_UPDATE_STATUS')"  @click="updateStatus(scope.row)"  plain type="primary" size="mini">
                            {{ scope.row.status == 2 ? '启用' : '停用' }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
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
        <c-edit :propShowDialog="editDialog.show" :showType="showType" :propParam="editDialog.param"
                @confirm="updateList" @close="editDialog.show = false"></c-edit>
    </div>
</template>
<script>
    import { listArrival, startArrival, stopArrival } from '@/request/pledge'
    import cEdit from './arrivalPromiseEdit'
    import common from '@/js/common/mixins.js'
    export default {
        data () {
            return {
                param: {
                    page: {
                        pageNum: 1,
                        pageSize: 20,
                        pagingSwitch: true
                    }
                },
                dataList: [],
                totals: 0,
                editDialog: {
                    show: false,
                    param: {}
                }
            }
        },
        props: {
            showType: Object
        },
        mixins: [common],
        created () {
            console.log('到货承诺')
            this.getList()
        },
        components: {
            cEdit
        },
        methods: {
            addArrivalPromise (type, data) {
                this.editDialog.param = {}
                if (type == 'edit') {
                    Object.assign(this.editDialog.param, data)
                }
                this.editDialog.show = true
            },
            updateList () {
                this.editDialog.show = false
                this.getList()
            },
            updateStatus (data) {
                let fetchUrl = stopArrival
                if (data.status == 2) {
                    fetchUrl = startArrival
                }
                fetchUrl({
                    arrivalId: data.arrivalId
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        data.status = data.status == 1 ? 2 : 1
                    }
                })
            },
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList()
            },
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                this.param.type = 1
                listArrival(this.filterData(this.param)).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.arrivalPledge
                        this.totals = res.total
                    }
                })
            }
        }
    }
</script>
