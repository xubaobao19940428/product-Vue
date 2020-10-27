<template>
    <div class="app-container">
        <div class="main-content-tab-box">
            <el-form inline>
                <el-form-item prop="eventName" label="事件名称：" class="filter-item">
                    <el-input v-model="eventName" clearable placeholder="请输入" size="medium" style="width: 200px" @keyup.enter.native="search"></el-input>
                </el-form-item>
                <el-form-item label="时间：">
                    <el-date-picker type="daterange" value-format="timestamp"
                                    @change="getList(1)"
                                    start-placeholder="开始时间" end-placeholder="结束时间"
                                    :picker-options="pickerOptions"
                                    v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="filter-item" style="margin-left: 20px;">
                    <el-button icon="el-icon-search" type="primary" @click="search" size="medium">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">重置</el-button>
                    <!-- <el-button icon="el-icon-refresh-left" @click="resetSearch" size="medium">批量导出数据</el-button> -->
                </el-form-item>
            </el-form>
        </div>
        <div class="main-content-wrapper">
            <el-tree
                :data="dataList"
                node-key="index"
                lazy
                style="height: 100%"
                :expand-on-click-node="true"
                :load="getSubData"
                ref="treeNode"
                :props="{children: 'children'}">
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <template v-if="node.level == 1" >
                        <div class="name-box">事件key： {{ data.pointEventKey }}</div>
                        <div>次数：{{ data.num }}</div>
                        <div>参数：{{ data.paramNum }}</div>
                    </template>
                    <template v-if="node.level == 2" >
                        <div class="name-box">参数名： {{ data.paramName }}</div>
                        <div>次数：{{ data.num }}</div>
                    </template>
                    <template v-if="node.level == 3" >
                        <div class="name-box">参数值： {{ data.paramValue }}</div>
                        <div>次数：{{ data.num }}</div>
                    </template>
                </div>
            </el-tree>
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
    import { getBuryingPointInfo, getBuryingPointParamInfo, getBuryingPointParamValueInfo } from '@/request/datacenter'
    export default {
        data () {
            return {
                timeList: [],
                dataList: [],
                totals: 0,
                param: {
                    page: {
                        pageNum: 1,
                        pageSize: 20,
                        pagingSwitch: true
                    }
                },
                eventName: '',
                pickerOptions: {
                    disabledDate(time) {
                        return moment(time).format('YYYY-MM-DD') > moment(new Date()).add(-1, 'days').format('YYYY-MM-DD') 
                    }
                }
            }
        },
        computed: {
            nowEnd () {
                return moment(moment(new Date()).add(-1, 'days').format('YYYY-MM-DD')).valueOf() 
            },
            lastWeek () {
                return this.$store.state.globalNum.lastWeek
            }
        },
        created () {
            this.timeList = [this.lastWeek, this.nowEnd]
            console.log(this.timeList)
            this.getList()
        },
        methods: {
            handleSizeChange (value) {
                this.param.page.pageSize = value
                this.getList(1)
            },
            search () {
                this.getList(1)
            },
            resetSearch () {
                this.eventName = ''
                this.timeList = [this.lastWeek, this.nowEnd]
            },
            getList (page) {
                this.param.page.pageNum = page || this.param.page.pageNum
                this.timeList = this.timeList ? this.timeList : []
                getBuryingPointInfo(this.filterData(Object.assign(this.param, {
                    beginDate: !this.timeList[0] ? null : this.timeList[0].toString(),
                    endDate: !this.timeList[1] ? null : this.timeList[1].toString(),
                    pointEventKey: this.eventName
                }))).then((res) => {
                    if (res.ret.errcode === 1) {
                        for (let i = 0; i < res.pointInfos.length; i++) {
                            Object.assign(res.pointInfos[i], {
                                children: [],
                                type: 1,
                                index: i
                            })
                        }
                        this.dataList = res.pointInfos
                        this.totals = res.total
                    }
                })
            },
            getSubData (tree, resolve) {
                if (tree.level == 0) {
                    return
                }
                console.log(tree.level)
                this.timeList = this.timeList ? this.timeList : []
                if (tree.level == 1) {
                    getBuryingPointParamInfo(this.filterData({
                        pointEventKey: tree.data.pointEventKey,
                        beginDate: !this.timeList[0] ? null : this.timeList[0].toString(),
                        endDate: !this.timeList[1] ? null : this.timeList[1].toString()
                    })).then((res) => {
                        if (res.ret.errcode === 1) {
                            for (let i = 0; i < res.pointParamInfos.length; i++) {
                                Object.assign(res.pointParamInfos[i], {
                                    pointEventKey: tree.data.pointEventKey,
                                    index: tree.data.index + '_' + i
                                })
                            }
                            resolve(res.pointParamInfos)
                        }
                    })
                } else if (tree.level == 2) {
                    getBuryingPointParamValueInfo(this.filterData({
                        pointEventKey: tree.data.pointEventKey,
                        paramName: tree.data.paramName,
                        beginDate: !this.timeList[0] ? null : this.timeList[0].toString(),
                        endDate: !this.timeList[1] ? null : this.timeList[1].toString()
                    })).then((res) => {
                        if (res.ret.errcode === 1) {
                            for (let i = 0; i < res.pointParamValueInfos.length; i++) {
                                Object.assign(res.pointParamValueInfos[i], {
                                    leaf: true,
                                    index: tree.data.index + '_' + i,
                                    children: []
                                })
                            }
                            resolve(res.pointParamValueInfos)
                        }
                    })
                } else {
                    resolve([])
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    .flex1 {
        flex: 1;
    }
    .custom-tree-node {
        display: flex;
        width: 100%;
        align-items: center;
        border-bottom: 1px solid #eee;
        box-sizing: border-box;
        padding: 10px 0;
        >div{
            flex: 1;
        }
    }
</style>
