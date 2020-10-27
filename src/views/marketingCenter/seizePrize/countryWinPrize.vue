<template>
    <div class="app-container">
        <el-form inline label-width="90px" :model="searchParam">
            <el-form-item label="商品ID：">
                <el-input v-model="searchParam.productId" clearable></el-input>
            </el-form-item>
            <!-- <el-form-item label="商品名称：">
                <el-input v-model="searchParam.productName" clearable></el-input>
            </el-form-item> -->
            <el-form-item label="活动时间：">
                <el-date-picker type="daterange" value-format="timestamp"
                    start-placeholder="开始时间" end-placeholder="结束时间"
                    clearable
                    v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button icon="el-icon-search" @click="getList(1)" size="medium" type="primary">搜索</el-button>
                <el-button icon="el-icon-refresh-left" plain size="medium" @click="resetSearchParam">重置</el-button>
            </el-form-item>
        </el-form>

        <prize-subject-module @select="handleSubjectSelect" :countryCode="countryCode" :currencyUnit="currencyUnit" @refresh="getList(1)"></prize-subject-module>

        <div class="main-content-wrapper">
            <el-table border :data="dataList" v-loading="load" style="width: 100%">
                <!-- <el-table-column fixed label="大奖ID" align="center" prop="subjectId"></el-table-column> -->
                <el-table-column fixed min-width="130px" align="center" label="商品ID" prop="productId"></el-table-column>
                <el-table-column fixed align="center" min-width="230px" label="商品信息">
                    <template slot-scope="scope">
                        <div class="flex flex-item--center">
                            <el-popover placement="top-start" trigger="hover">
                                <img :src="dealShowFileSrc(scope.row.productCover)" class="previewImage">
                                <img v-popover:popover :src="dealShowFileSrc(scope.row.productCover)"
                                     class="thumbnail"
                                     slot="reference">
                            </el-popover>
                            <span style="margin-left: 10px">{{scope.row.productName}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="原价" align="center" width="110px" prop="price"></el-table-column>
                <el-table-column label="大奖价" align="center" width="110px" prop="activePrice"></el-table-column>
                <el-table-column label="所需码数" align="center" width="100px" prop="codeNumber"></el-table-column>
                <el-table-column label="活动时段" align="center" width="320px">
                    <template slot-scope="scope">
                        {{ scope.row.startTime | secondTimeFormat }} ~ {{ scope.row.endTime | secondTimeFormat }}
                    </template>
                </el-table-column>
                <el-table-column label="已开奖期数" align="center" width="110px" prop="period"></el-table-column>
                <el-table-column label="累计拉新数" align="center" width="110px" prop="inviteTotalNewUser"></el-table-column>
                <el-table-column label="新用户占比" width="110px" align="center" prop="inewUserPercent"></el-table-column>
                <el-table-column label="今日拉新数" width="110px" align="center" prop="inviteTodayNewUser"></el-table-column>
                <el-table-column label="排序" align="center" width="110px">
                    <template slot-scope="scope">
                        <el-input-number v-model="scope.row.sort" controls-position="right" :min="1" size="mini" style="width:80px"></el-input-number>
                    </template>
                </el-table-column>
                <el-table-column label="操作" fixed="right" width="180px" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" plain size="mini" @click="handleSaveSort(scope.row)" v-if="hasPermission('BTN_SEIZE_PRIZE_SORT')">保存排序</el-button>
                        <el-button type="text" plain size="mini" @click="handleEdit(scope.row)" v-if="hasPermission('BTN_SEIZE_PRIZE_PRODUCT_EDIT')">编辑</el-button>
                        <el-button type="text" plain size="mini" @click="handleDel(scope.row)" v-if="hasPermission('BTN_SEIZE_PRIZE_DELETE')">删除</el-button>
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

        <edit-goods-dialog v-if="goodsDialogShow" 
            :goodsDialogShow="goodsDialogShow" @close="goodsDialogShow = false" @confirm="handleGoodsEditConfirm" 
            :productSerialId="productSerialId"
            :productId="productId"
            :countryCode="countryCode"
            :productSetParam="productSetParam"
        ></edit-goods-dialog>

        <!-- <create-subject-dialog :subjectDialogShow="subjectDialogShow" @close="subjectDialogShow = false" @confirm="handleCreateConfirm"></create-subject-dialog> -->
    </div>
</template>

<script>
import prizeSubjectModule from './components/prizeSubjectModule'
import editGoodsDialog from './components/editGoodsDialog'
import { listSuperLuckProductWithPage, changeSuperLuckProductSort, deleteSuperLuckProduct, updateSuperLuckProductSkuRule, queryProductCommonSet } from '@/request/prize'
export default {
    props: {
        countryCode: String,
        currencyUnit: String
    },
    data () {
        return {
            searchParam: {
                productId: '',
                productName: '',
                startTime: null,
                endTime: null,
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            },
            timeList: [],
            dataList: [],
            load: false,
            totals: 0,
            subjectDialogShow: false,
            goodsDialogShow: false,
            productSerialId: '',
            productId: '',
            curSubject: {},
            productSetParam: {}
        }
    },
    components: {
        prizeSubjectModule,
        editGoodsDialog
    },
    created () {
        this.getList(1)
    },
    methods: {
        resetSearchParam () {
            this.searchParam = {
                productId: '',
                productName: '',
                startTime: null,
                endTime: null,
                page: {
                    pageNum: 1,
                    pageSize: 10,
                    pagingSwitch: true
                }
            }
        },
        handleSizeChange (value) {
            Object.assign(this.searchParam.page, {
                pageSize: value,
                pageNum: 1
            })
            this.getList()
        },
        getList (pageNum) {
            this.load = true
            this.searchParam.page.pageNum = pageNum || this.searchParam.page.pageNum
            this.timeList = this.timeList || []
            let resParam = {}
            resParam = this.filterData(Object.assign(this.searchParam, {
                startTime: !this.timeList[0] ? null : this.timeList[0],
                endTime: !this.timeList[1] ? null : this.timeList[1],
                countryCode: this.countryCode
            }))
            listSuperLuckProductWithPage(resParam).then(res => {
                if (res.ret.errcode === 1) {
                    this.dataList = res.superLuckProduct
                    this.totals = res.total
                }
                this.load = false
            }).catch(err => {
                this.load = false
            })

        },
        handleDel (item) {
            this.$confirm('此操作将永久删除数据，是否继续', '提示', {
                confirmButtonText: '继续',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteSuperLuckProduct({id: [item.id]}).then(res => {
                    if (res.ret.errcode === 1) {
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
        handleGoodsEditConfirm (data) {
            updateSuperLuckProductSkuRule(data).then(res => {
                if (res.ret.errcode === 1) {
                    this.$message.success('修改商品信息成功')
                    this.goodsDialogShow = false
                    this.getList()
                }
            })
        },
        handleEdit (item) {
            if (!item.startTime || !item.endTime) {
                queryProductCommonSet({countryCode: this.countryCode}).then(res => {
                    if (res.ret.errcode === 1) {
                        Object.assign(this.productSetParam, {
                            startTime: res.startTime,
                            endTime: res.endTime,
                            activePrice: res.activePrice || 1,
                            invitationNew: res.invitationNew,
                            invitationOld: res.invitationOld
                        })
                        this.goodsDialogShow = true
                        this.productSerialId = item.productSerialId
                        this.productId = item.productId
                    }
                })
            } else {
                this.goodsDialogShow = true
                this.productSerialId = item.productSerialId
                this.productId = item.productId
            }
        },
        handleSaveSort (item) {
            changeSuperLuckProductSort({id: item.id + '', sortNo: item.sort}).then(res => {
                if (res.ret.errcode === 1) {
                    this.$message.success('设置排序成功')
                    this.getList()
                }
            })
        },
        handleCreateConfirm (data) {
            
        },
        handleSubjectSelect (item) {
            this.curSubject = item
            this.getPrizeGoodsList()
        },
        getPrizeGoodsList () {
            // 切换专题，获取大奖商品列表
            let params = {}
            
        }
    }
}
</script>