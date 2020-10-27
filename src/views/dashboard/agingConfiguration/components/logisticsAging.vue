<template>
    <div class="logistics-aging">
        <div class="logistics-add">
            <el-button type="primary" @click="addLogistics">新增</el-button>
        </div>
            <el-table
                :data="tableData"
                border
                style="width: 100%;height:100%">
                <el-table-column prop="agingType" label="时效配置" width="200">
                    <template slot-scope="scope">
                        <div>{{scope.row.agingType==="SHIPPING_HOME"?"宅配时效":"货代时效"}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="countryCode" label="国家" width="200">
                    <template slot-scope="scope">
                        <div>{{showCountry(scope.row.countryCode)}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="时效时长" width="200">
                    <template slot-scope="scope">
                        <div>{{scope.row.minDay}}-{{scope.row.maxDay}}天</div>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200">
                    <template slot-scope="scope">
                        <div>{{scope.row.createTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="updateTime" label="修改时间" width="200">
                    <template slot-scope="scope">
                        <div>{{scope.row.updateTime}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <div @click="modify(scope.row)" class="modify-btn">修改</div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page-wrapper">
                <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="page.pageNum"
                    :page-sizes="[10, 20, 30, 50]"
                    :page-size="page.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="totals">
                </el-pagination>
            </div>
            <logistics-dialog :dialogVisible="dialogVisible" :editType="editType" @on-cancle="onCancel" @on-confirm="onConfirm"></logistics-dialog>
    </div>
</template>
<script>
    import { QueryLogiAgingPage, LogiAgingAdd, LogiAgingUpdate, QueryLogiUpdateInfo } from '@/request/prescription'
    import logisticsDialog from './logisticsDialog'
    import { mapState } from 'vuex'
 
    export default {
        data () {
            return {
                tableData: [],
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                totals: 0,
                dialogVisible: false,
                countryAgingInfo: [],
                areaInfo: [],
                agingType: '',
                countryCode: '',
                editType: 'add'
            }
        },
        components: {
            logisticsDialog
        },
        mounted () {
            this.getQueryLogiAgingPage()
        },
        computed: {
            countryList () {
                return this.$store.state.dict.countryList
            },
            ...mapState({
                queryData: state => state.agingConfiguration.queryData,
                homeCountryAgingInfo: state => state.agingConfiguration.homeCountryAgingInfo,
                homeAreaInfo: state => state.agingConfiguration.homeAreaInfo,
                freightCountryAgingInfo: state => state.agingConfiguration.freightCountryAgingInfo,
                freightAreaInfo: state => state.agingConfiguration.freightAreaInfo,
                editAddressIndex: state => state.agingConfiguration.editAddressIndex
            })
        },
        methods: {
            // 分页
            handleSizeChange (val) {
                this.page.pageSize = val
                this.getQueryLogiAgingPage()
            },
            handleCurrentChange (val) {
                this.page.pageNum = val
                this.getQueryLogiAgingPage()
            },
            showCountry (code) {
                for (const val of this.countryList) {
                    if (val.shortCode === code) {
                        return val.nameCn
                    }
                }
            },
            // 获取物流实效列表数据
            getQueryLogiAgingPage () {
                let params = {
                    page: this.page
                }
                QueryLogiAgingPage(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.tableData = res.agingList
                        this.totals = res.total
                    }
                })
            },
            addLogistics () {
                this.editType = 'add'
                this.dialogVisible = true
            },
            modify (val) {
                console.log(val)
                this.editType = 'edit'
                this.$store.dispatch('updateQueryData', {
                    agingType: val.agingType,
                    countryCode: val.countryCode
                })
                this.getQueryLogiUpdateInfo(val.agingType, val.countryCode)
                this.dialogVisible = true
            },
            getQueryLogiUpdateInfo (agingType, countryCode) {
                let params = {
                    agingType,
                    countryCode
                }
                QueryLogiUpdateInfo(this.filterData(params)).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        if (this.queryData.agingType === 'SHIPPING_HOME') {
                            this.$store.dispatch('updateHome', {
                                homeCountry: res.countryAgingInfo,
                                homeArea: res.areaInfo
                            })
                        } else {
                            this.$store.dispatch('updateFreight', {
                                freightCountry: res.countryAgingInfo,
                                freightArea: res.areaInfo
                            })
                        } 
                    }
                })
            },
            onCancel () {
                this.$store.dispatch('updateAddressIndex', {
                    editIndex: -1
                })
                this.$store.dispatch('updateInitData', {
                    agingType: '',
                    countryCode: ''
                })
                this.dialogVisible = false
            },
            // 修改
            getLogiAgingUpdate () {
                let homeParams = {
                    agingType: this.queryData.agingType, 
                    countryCode: this.queryData.countryCode,
                    countryAgingInfo: this.homeCountryAgingInfo,
                    areaInfo: this.homeAreaInfo
                }
                let freightParams = {
                    agingType: this.queryData.agingType, 
                    countryCode: this.queryData.countryCode,
                    countryAgingInfo: this.freightCountryAgingInfo,
                    areaInfo: this.freightAreaInfo
                }
                LogiAgingUpdate(this.queryData.agingType === 'SHIPPING_HOME' ? homeParams : freightParams).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.$store.dispatch('updateInitData', {
                            agingType: '',
                            countryCode: ''
                        })
                        this.$message.success('修改成功')
                        this.getQueryLogiAgingPage()
                    }
                })
            },
            //新增
            getLogiAgingAdd () {
                let homeParams = {
                    agingType: this.queryData.agingType, 
                    countryCode: this.queryData.countryCode,
                    countryAgingInfo: this.homeCountryAgingInfo,
                    areaInfo: this.homeAreaInfo
                }
                let freightParams = {
                    agingType: this.queryData.agingType, 
                    countryCode: this.queryData.countryCode,
                    countryAgingInfo: this.freightCountryAgingInfo,
                    areaInfo: this.freightAreaInfo
                }
                LogiAgingAdd(this.queryData.agingType === 'SHIPPING_HOME' ? homeParams : freightParams).then(res => {
                    this.$message.success('新增成功')
                    this.$store.dispatch('updateInitData', {
                        agingType: '',
                        countryCode: ''
                    })
                    this.getQueryLogiAgingPage()
                })
            },
            onConfirm () {
                this.$store.dispatch('updateAddressIndex', {
                    editIndex: -1
                })
                if (this.editType === 'add') {
                    console.log('==>')
                    if(this.tableData.length !== 0) {
                        for (const iterator of this.tableData) {
                            console.log(iterator)
                            if (iterator.agingType === this.queryData.agingType && iterator.countryCode === this.queryData.countryCode) {
                                this.$message.error('该国家物流时效已存在，不能重复添加')
                                return
                            } 
                        }    
                        if (this.queryData.agingType === "SHIPPING_HOME") {
                            for (const iterator of this.homeCountryAgingInfo) {
                                if (Number(iterator.minDay) <= 0 || Number(iterator.maxDay) <= 0) {
                                    this.$message.error('时效范围无效')
                                    return
                                } else {
                                    if (Number(iterator.minDay) > Number(iterator.maxDay)) {
                                        this.$message.error('全国时效范围无效')
                                        return
                                    } else {
                                        for (const val of this.homeAreaInfo) {
                                            console.log(val)
                                            if (Number(val.agingInfo[0].minDay) <= 0 || Number(val.agingInfo[0].maxDay) <= 0) {
                                                this.$message.error('时效范围无效')
                                                return
                                            } else if (Number(val.agingInfo[0].minDay) > Number(val.agingInfo[0].maxDay)) {
                                                this.$message.error('地区时效范围无效')
                                                return
                                            }
                                        }
                                    }
                                }
                            }
                            this.getLogiAgingAdd()
                            this.dialogVisible = false   
                        } else if (this.queryData.agingType === "SHIPPING_AGENT") {
                            for (const iterator of this.freightCountryAgingInfo) {
                                if (Number(iterator.minDay) <= 0 || Number(iterator.maxDay) <= 0) {
                                    this.$message.error('时效范围无效')
                                    return
                                } else {
                                    if (Number(iterator.minDay) > Number(iterator.maxDay)) {
                                        this.$message.error('全国时效范围无效')
                                        return
                                    } else {
                                        for (const iterator of this.freightAreaInfo) {
                                            for (const val of iterator.agingInfo) {
                                                if (Number(val.minDay) <= 0 || Number(val.maxDay) <= 0) {
                                                    this.$message.error('时效范围无效')
                                                    return
                                                } else if (Number(val.minDay) > Number(val.maxDay)) {
                                                    this.$message.error('地区时效范围无效')
                                                    return
                                                } 
                                            }
                                        }
                                    }
                                }
                            }
                            this.getLogiAgingAdd()
                            this.dialogVisible = false  
                        }       
                    } else {
                        if (this.queryData.agingType === "SHIPPING_HOME") {
                            for (const iterator of this.homeCountryAgingInfo) {
                                if (Number(iterator.minDay) <= 0 || Number(iterator.maxDay) <= 0) {
                                    this.$message.error('时效范围无效')
                                    return
                                } else {
                                    if (Number(iterator.minDay) > Number(iterator.maxDay)) {
                                        this.$message.error('全国时效范围无效')
                                        return
                                    } else {
                                        for (const val of this.homeAreaInfo) {
                                            console.log(val)
                                            if (Number(val.agingInfo[0].minDay) <= 0 || Number(val.agingInfo[0].maxDay) <= 0) {
                                                this.$message.error('时效范围无效')
                                                return
                                            } else if (Number(val.agingInfo[0].minDay) > Number(val.agingInfo[0].maxDay)) {
                                                this.$message.error('地区时效范围无效')
                                                return
                                            }
                                        }
                                    }
                                }
                            }
                            this.getLogiAgingAdd()
                            this.dialogVisible = false   
                        } else if (this.queryData.agingType === "SHIPPING_AGENT") {
                            for (const iterator of this.freightCountryAgingInfo) {
                                if (Number(iterator.minDay) <= 0 || Number(iterator.maxDay) <= 0) {
                                    this.$message.error('时效范围无效')
                                    return
                                } else {
                                    if (Number(iterator.minDay) > Number(iterator.maxDay)) {
                                        this.$message.error('全国时效范围无效')
                                        return
                                    } else {
                                        for (const iterator of this.freightAreaInfo) {
                                            for (const val of iterator.agingInfo) {
                                                if (Number(val.minDay) <= 0 || Number(val.maxDay) <= 0) {
                                                    this.$message.error('时效范围无效')
                                                    return
                                                } else if (Number(val.minDay) > Number(val.maxDay)) {
                                                    this.$message.error('地区时效范围无效')
                                                    return
                                                } 
                                            }
                                        }
                                    }
                                }
                            }
                            this.getLogiAgingAdd()
                            this.dialogVisible = false  
                        }
                        // this.getLogiAgingAdd()
                        // this.dialogVisible = false 
                    }
                } else if (this.editType === 'edit') {
                    if (this.queryData.agingType === "SHIPPING_HOME") {
                        for (const iterator of this.homeCountryAgingInfo) {
                            if (Number(iterator.minDay) <=0 || Number(iterator.maxDay) <= 0) {
                                this.$message.error('时效范围无效')
                                return
                            } else {
                                if (iterator.minDay > iterator.maxDay) {
                                    this.$message.error('全国时效范围无效')
                                    return
                                } else {
                                    console.log('==>')
                                    for (const iterator of this.homeAreaInfo) {
                                        console.log(iterator)
                                        if (Number(iterator.agingInfo[0].minDay) <= 0 || Number(iterator.agingInfo[0].maxDay) <= 0) {
                                            this.$message.error('时效范围无效')
                                            return
                                        } else if (iterator.agingInfo[0].minDay > iterator.agingInfo[0].maxDay) {
                                            this.$message.error('地区时效范围无效')
                                            return
                                        }
                                    }
                                }
                            }
                        }
                        this.getLogiAgingUpdate()
                        this.dialogVisible = false  
                        
                    } else if (this.queryData.agingType === "SHIPPING_AGENT") {
                        for (const iterator of this.freightCountryAgingInfo) {
                            if (Number(iterator.minDay) <=0 || Number(iterator.maxDay) <= 0) {
                                this.$message.error('时效范围无效')
                                return
                            } else {
                                if (iterator.minDay > iterator.maxDay) {
                                    this.$message.error('全国时效范围无效')
                                    return
                                } else {
                                    for (const iterator of this.freightAreaInfo) {
                                        for (const val of iterator.agingInfo) {
                                            if (Number(val.minDay) <= 0 || Number(val.maxDay) <= 0) {
                                                this.$message.error('时效范围无效')
                                                return
                                            } else if (val.minDay > val.maxDay) {
                                                this.$message.error('地区时效范围无效')
                                                return
                                            } 
                                        }
                                    }
                                }
                            }
                        }
                        this.getLogiAgingUpdate()
                        this.dialogVisible = false 
                    }
                }
                
            }
        }
    }
</script>
<style lang="scss">
    .logistics-aging{
        .el-table td, .el-table th.is-leaf{
            text-align: center;
        }
        .el-table--enable-row-transition .el-table__body td{
            text-align: center;
        }
    }
</style>
<style lang="scss" scoped>
    .logistics-aging{
        .logistics-add{
            margin-bottom:10px;
        }
        .modify-btn{
            color: #409EFF;
            cursor: pointer;
        }
    }
</style>