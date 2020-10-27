<template>
    <div class="app-container">
        <div class="main-content-tab-box">
            <div class="tab-l">
                <el-tabs v-model="activeName" @tab-click="getList(1)">
                    <el-tab-pane v-for="(item, i) in tabList" :key="i" :label="item.name" :name="item.key"></el-tab-pane>
                </el-tabs>
                <!-- <el-button :class="['search-btn', 'mar-l-10', showSearchParam ? 'active' : '']" icon="el-icon-search" size="small"
                           @click="showSearchParam = !showSearchParam">搜索</el-button> -->
            </div>
            <div class="tab-r">
                <el-button v-if="hasPermission('BTN_PROMOTION_TOOLS_ADD')" @click="editDialogAction('add')" icon="el-icon-plus" type="primary" size="small" >新建</el-button>
            </div>
        </div>
        <el-collapse-transition>
            <!-- <div v-if="showSearchParam"> -->
                <el-form inline label-width="90px">
                    <el-form-item label="促销名称：">
                        <el-input placeholder="请输入" size="medium" v-model="param.promotionName"></el-input>
                    </el-form-item>
                    <el-form-item label="国家：">
                        <el-select v-model="param.countryCode" clearable placeholder="请选择" size="medium">
                            <el-option v-for="(item, index) in countryList"
                                       :key="index"
                                       :label="item.nameEn + '/' + item.nameCn "
                                       :value="item.shortCode"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商品ID：">
                        <el-input placeholder="请输入" size="medium" v-model="param.productId"></el-input>
                    </el-form-item>
                    <span v-show="drop">
                        <el-form-item label="促销标签：">
                            <el-input placeholder="请输入" size="medium" v-model="param.promotionLabel"></el-input>
                        </el-form-item>
                        <el-form-item label="促销类型：">
                            <el-select v-model="param.promotionType" clearable placeholder="请选择" size="medium">
                                <el-option v-for="(item, index) in promotionType"
                                        :key="index"
                                        :label="item"
                                        :value="index"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="促销ID：">
                            <el-input placeholder="请输入" size="medium" v-model="param.promotionId"></el-input>
                        </el-form-item>
                        <el-form-item label="活动时间：">
                            <el-date-picker type="daterange" value-format="timestamp"
                                            start-placeholder="开始时间" end-placeholder="结束时间"
                                            v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                    </span>
                    <el-form-item class="filter-item" style="margin-left: 20px;">
                        <el-button type="primary" size="medium"
                                icon="el-icon-search"
                                @click="getList(1)">搜索
                        </el-button>
                        <el-button size="medium"
                                icon="el-icon-refresh-left"
                                @click="resetSearch">重置
                        </el-button>
                        <el-link style="margin-left: 20px;" type="primary" :underline="false" @click="dropDown">
                            {{dropDownContent}}
                            <i :class="dropDownIcon"></i>
                        </el-link>
                    </el-form-item>
                </el-form>
            <!-- </div> -->
        </el-collapse-transition>
        <div class="main-content-wrapper">
            <el-table border
                      height="100%"
                      :data="dataList">
                <el-table-column label="促销ID" prop="promotionId" align="center" min-width="120px"></el-table-column>
                <el-table-column label="促销名称" prop="promotionName" min-width="100px" header-align="center"></el-table-column>
                <el-table-column label="促销标签" prop="promotionLabel" min-width="100px" header-align="center"></el-table-column>
                <el-table-column label="促销类型" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ promotionType[scope.row.promotionType] }}
                    </template>
                </el-table-column>
                <el-table-column label="国家" min-width="100px" header-align="center">
                    <template slot-scope="scope">
                        {{ scope.row.countryCode | countryFilter }}
                    </template>
                </el-table-column>
                <el-table-column label="开始时间" min-width="180px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.startTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="结束时间" min-width="180px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.endTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column label="更新人" prop="operationName" min-width="100px" header-align="center"></el-table-column>
                <el-table-column label="更新时间" min-width="180px" align="center">
                    <template slot-scope="scope">
                        {{ scope.row.updateTime | formatTime }}
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" align="center" min-width="130px">
                    <template slot-scope="scope">
                        <div class="table-action-btn-box">
                            <!--<el-button plain type="primary" size="mini">查看商品</el-button>-->
                            <el-button v-if="hasPermission('BTN_PROMOTION_TOOLS_COPY')" @click="editDialogAction('copy', scope.row)" plain type="primary" size="mini">复制</el-button>
                            <el-button v-if="hasPermission('BTN_PROMOTION_TOOLS_EDIT')" @click="editDialogAction('edit', scope.row)"  plain type="primary" size="mini">编辑</el-button>
                        </div>
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
    </div>
</template>
<script>
    import { listPromotion } from '@/request/marketing.js'
    import common from '../common/common'
    export default {
        data () {
            return {
                drop: false,
                dropDownContent: '展开',
                dropDownIcon: 'el-icon-arrow-down',
                param: {
                    promotionName: '',
                    countryCode: '',
                    productId: '',
                    promotionLabel: '',
                    promotionType: '',
                    promotionId: '',
                    promotionStatusType: '0',
                    page: {
                        pageNum: 1,
                        pageSize: 20,
                        pagingSwitch: true
                    }
                },
                showSearchParam: false,
                activeName: '0',
                totals: 0,
                tabList: [{
                    key: '0',
                    name: '全部活动'
                }, {
                    key: '1',
                    name: '即将开始'
                }, {
                    key: '2',
                    name: '进行中'
                }, {
                    key: '3',
                    name: '已结束'
                }],
                dataList: [],
                timeList: []
            }
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        created () {
            this.param.promotionId = this.$route.query.promotionId ? this.$route.query.promotionId : ''
            this.getList()
        },
        mixins: [common],
        methods: {
            dropDown() {
                if (this.drop) {
                    this.dropDownContent = '展开';
                    this.dropDownIcon = 'el-icon-arrow-down';
                } else {
                    this.dropDownContent = '收起';
                    this.dropDownIcon = 'el-icon-arrow-up';
                }
                this.drop = !this.drop;
            },
            resetSearch () {
                this.param = {
                    promotionName: '',
                    countryCode: '',
                    productId: '',
                    promotionLabel: '',
                    promotionType: '',
                    promotionId: '',
                    promotionStatusType: '0',
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
                this.timeList = []
            },
            editDialogAction (type, data) {
                switch (type) {
                    case 'add':
                        this.$router.push({
                            name: 'promotionEdit',
                            type: '1'
                        })
                        break
                    case 'edit':
                        this.$router.push({
                            name: 'promotionEdit',
                            query: {
                                promotionId: data.promotionId,
                                type: '2'
                            }
                        })
                        break
                    case 'copy':
                        this.$router.push({
                            name: 'promotionEdit',
                            query: {
                                promotionId: data.promotionId,
                                type: '3'
                            }
                        })
                }
            },
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList(1)
            },
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                this.param.promotionStatusType = this.activeName
                this.timeList = this.timeList ? this.timeList : []
                listPromotion(this.filterData(Object.assign(this.param, {
                    startTime: !this.timeList[0] ? null : this.timeList[0],
                    endTime: !this.timeList[1] ? null : this.timeList[1]
                }))).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.dataList = res.promotionListInfo
                        this.totals = res.total
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped></style>
