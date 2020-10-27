<template>
    <div class="app-container">
        <div class="operator-container">
            <el-button icon="el-icon-plus" type="primary"
                       @click="priceTemplateAction('add')"
                       v-if="hasPermission('BTN_PRICE_TEMPLATE_ADD')"
                       class="operator-item" size="small">新 增
            </el-button>
        </div>
        <div class="main-content-wrapper">
            <el-table border
                      height="100%"
                      :data="dataList">
                <el-table-column label="模板ID" prop="templateId" align="center" min-width="120px"></el-table-column>
                <el-table-column label="模板名称" prop="templateNameCn" align="center" min-width="100px"></el-table-column>
                <el-table-column label="适用国家" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="适用类目" header-align="center" min-width="180px">
                    <template slot-scope="scope">
                        <span v-for="(item, i) in scope.row.category" :key="i">{{ item.name }}，</span>
                    </template>
                </el-table-column>
                <el-table-column label="原价毛利率%" align="center" min-width="150px">
                    <template slot-scope="scope">
                        {{ scope.row.grossInterestRate }}
                    </template>
                </el-table-column>
                <el-table-column label="VIP毛利率%" align="center" min-width="100px">
                    <template slot-scope="scope">
                        {{ scope.row.vipGrossInterestRate }}
                    </template>
                </el-table-column>
                <el-table-column label="活动毛利率%" align="center" min-width="150px">
                    <template slot-scope="scope">
                        {{ scope.row.activeGrossInterestRate }}
                    </template>
                </el-table-column>
                <el-table-column label="更新人" prop="operationName" min-width="100px" header-align="center"></el-table-column>
                <el-table-column label="更新时间" min-width="180px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="220px">
                    <template slot-scope="scope">
                        <el-button v-if="hasPermission('BTN_PRICE_TEMPLATE_EDIT')" @click="priceTemplateAction('edit', scope.row)"  plain type="primary" size="mini">编辑</el-button>
                        <el-button v-if="hasPermission('BTN_PRICE_TEMPLATE_EDIT')" @click="priceTemplateAction('copy', scope.row)" plain type="primary" size="mini">复制</el-button>
                        <el-button plain size="mini"
                                   v-if="hasPermission('BTN_PRICE_TEMPLATE_UPDATE_STATUS')"
                                   :type="scope.row.status == 1 ? 'success' : 'info'"
                                   @click.stop="hideOrShowTemplate(scope.row)">
                            {{ scope.row.status == 2 ? '显示' : '隐藏' }}
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-box">
            <el-pagination @size-change="handleSizeChange"
                           @current-change="getList"
                           :current-page="page.pageNum"
                           :page-sizes="[5, 10, 20, 50]"
                           :page-size="page.pageSize"
                           layout="total, sizes, prev, pager, next, jumper"
                           :total="totals">
            </el-pagination>
        </div>
        <edit-dialog :propShowDialog="editDialog.show" :propParam="editDialog.param" @close="closeEditDialog"></edit-dialog>
    </div>
</template>
<script>
    import { listAllProductPriceTemplate, changePriceTemplateEffectStatus } from '@/request/product'
    import editDialog from './components/editDialog'
    export default {
        data () {
            return {
                dataList: [],
                totals: 0,
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                },
                editDialog: {
                    show: false,
                    param: {}
                }
            }
        },
        components: {
            editDialog
        },
        created () {
            this.getList()
        },
        methods: {
            handleSizeChange (value) {
                this.page.pageSize = value
                this.getList()
            },
            getList (page) {
                this.page.pageNum = page || this.page.pageNum
                listAllProductPriceTemplate({
                    page: this.page
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.data
                        this.totals = res.total
                    }
                })
            },
            priceTemplateAction (type, data) {
                this.editDialog.param = {}
                if (type == 'edit') {
                    this.editDialog.param = JSON.parse(JSON.stringify(data))
                } else if (type == 'copy') {
                    this.editDialog.param = JSON.parse(JSON.stringify(data))
                    this.editDialog.param.templateId = null
                }
                this.editDialog.show = true
            },
            closeEditDialog () {
                this.editDialog.show = false
                this.getList()
            },
            // 显示隐藏
            hideOrShowTemplate (data) {
                changePriceTemplateEffectStatus({
                    templateId: data.templateId,
                    effectStatus: data.status == 2 ? 1 : 2
                }).then((res) => {
                    if (res.ret.errcode === 1) {
                        data.status = data.status == 2 ? 1 : 2
                    }
                })
            }
        }
    }
</script>
