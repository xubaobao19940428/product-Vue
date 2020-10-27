<template>
    <div class="forward-aging-table">
        <!-- {{freightCountryAgingInfo}} -->
        <el-table
            v-if="freightCountryAgingInfo"
            :data="freightCountryAgingInfo"
            border
            :span-method="objectSpanMethod"
            style="width: 100%">
            <el-table-column prop="date" label="地区" width="300">
                <template slot-scope="scope">
                    <div class="table-cell-title">全国</div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="货物属性" width="100">
                <template slot-scope="scope">
                    <div>
                        {{scope.row.nature === 'SENSITIVE' ? '敏感货' : '普货'}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="时效">
                <template slot-scope="scope">
                    <div>
                        <el-input v-model="scope.row.minDay" placeholder="" size='mini'></el-input>
                        -
                        <el-input v-model="scope.row.maxDay" placeholder="" size='mini'></el-input> 天
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="操作"  width="100">
                <template slot-scope="scope">
                    <div></div>
                </template>
            </el-table-column>
        </el-table>
        <!-- {{'==>'}}{{freightAreaInfo}} -->
        <el-table
            v-if="freightAreaInfo"
            :data="freightAreaInfo"
            border
            :show-header="false"
            style="width: 100%"
            class="freightAreaInfo-table">
            <el-table-column label="" width="300">
                <template slot-scope="scope">
                    <div class="table-cell-area-title">
                        <div class="area-city">{{showCountry(scope.row.stateInfo)}}</div>
                        <div class="edit-btn" @click="editClick(scope.$index)">编辑</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="" width="100">
                <template slot-scope="scope">
                    <div>
                        <div v-if="scope.row.agingInfo">
                            <div v-for="(item, index) in scope.row.agingInfo" :key="index" :class="'nature' + index">
                                {{item.nature === 'SENSITIVE' ? '敏感货' : '普货'}}
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="">
                <template slot-scope="scope">
                    <div v-if="scope.row.agingInfo">
                        <div v-for="(item, index) in scope.row.agingInfo" :key="index" :class="'input' + index">
                            <el-input v-model="scope.row.agingInfo[index].minDay" placeholder="" size='mini'></el-input>
                            -
                            <el-input v-model="scope.row.agingInfo[index].maxDay" placeholder="" size='mini'></el-input> 天
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="" width="100">
                <template slot-scope="scope">
                    <div @click="deleteDelivert(scope.$index)" class="forward-aging-table-delete">删除</div>
                </template>
            </el-table-column>
        </el-table>
        <div class="forward-aging-table-add" @click="addClick">新增制定地区及时效</div>
        <select-address v-if="propShowDialog" :aging="'aging'" :operateType="operateType" :addressDisableList="addressDisableList" :propShowDialog="propShowDialog" :countryCode="queryData.countryCode" :propStateList="propStateList" @close="cancelAddress" @confirm="confirmSelectAddress"></select-address>
    </div>    
</template>
<script>
    import selectAddress from '@/components/addressSelect/backAddress'
    import { getCountryDivision } from '@/request/i18n'
    import { mapState } from 'vuex'

    export default {
        data () {
            return {
                propShowDialog: false,
                propStateList: [],
                addressList: [],
                addressDisableList: [],
                operateType: 'add'
            }
        },
        components: {
            selectAddress
        },
        props: {
            countryCode: String,
            agingType: String
        },
        computed: {
            ...mapState({
                queryData: state => state.agingConfiguration.queryData,
                freightCountryAgingInfo: state => state.agingConfiguration.freightCountryAgingInfo,
                freightAreaInfo: state => state.agingConfiguration.freightAreaInfo,
                editAddressIndex: state => state.agingConfiguration.editAddressIndex
            })
        },
        methods: {
            objectSpanMethod ({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0 || columnIndex === 3) {
                    if (rowIndex % 2 === 0) {
                        return {
                            rowspan: 2,
                            colspan: 1
                        }
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        }
                    }
                }
            },
            getAddress () {
                getCountryDivision({
                    countryCode: this.queryData.countryCode
                }).then((res) => {
                    this.addressList = res.area
                })
            },
            // 编辑时其他列已有的地址不能重复选择
            addressEditChosen (i) {
                let address = this.freightAreaInfo[i].stateInfo
                console.log(address)
                for (const iterator of address) {
                    console.log(iterator)
                    this.propStateList.push(iterator.state)     
                }
                let addressDisable = this.freightAreaInfo.concat()
                addressDisable.splice(i, 1)
                if (addressDisable.length !== 0) {
                    let stateList = []
                    for (const iterator of addressDisable) {
                        stateList.push(iterator.stateInfo)   
                    }
                    for (let index = 0; index < stateList.length; index++) {
                        for (const iterator of stateList[index]) {
                            console.log('==>',iterator.state)
                            this.addressDisableList.push(iterator.state)
                        }
                    }
                }
            },
            // 添加时所有列已有的地址不能重复选择
            addressAddChosen () {
                if (this.freightAreaInfo.length !== 0) {
                    for (const iterator of this.freightAreaInfo) {
                        for (let index = 0; index < iterator.stateInfo.length; index++) {
                            console.log(iterator.stateInfo[index].state)
                            this.addressDisableList.push(iterator.stateInfo[index].state)
                        }    
                    }
                }
            },
            showCountry (val) {
                let area = ''
                // console.log(val)
                for (const iterator of val) {
                    area = area + iterator.state + ','
                }
                return area
            },
            // 删除
            deleteDelivert (i) {
                this.$store.dispatch('deleteForwardStateInfo', {
                    deleteIndex: i
                })
                console.log(this.freightAreaInfo)
            },
            // 点编辑
            editClick (index) {
                this.operateType = 'edit'
                this.$store.dispatch('updateAddressIndex', {
                    editIndex: index
                })
                this.getAddress()
                this.addressEditChosen(index)
                this.propShowDialog = true
            },
            // 新增
            addClick () {
                this.operateType = 'add'
                this.addressAddChosen()
                this.getAddress()
                this.propShowDialog = true
            },
            cancelAddress () {
                this.propShowDialog = false
                this.propStateList.splice(0)
                this.addressDisableList.splice(0)
            },
            confirmSelectAddress (val) {
                this.propShowDialog = false
                console.log(val)
                if (this.operateType === 'edit') {
                    // let arrdiff = this.getArrDifference(val, this.propStateList)
                    // console.log(arrdiff)
                    let statePushInfo = []
                    for (const iterator of this.addressList) {
                        console.log(iterator)
                        for (let i = 0; i < iterator.stateName.length; i++) {
                            for (const value of val) {
                                if (value === iterator.stateName[i]) {
                                    console.log(iterator)
                                    statePushInfo.push({area: iterator.areaName, state: value, stateEn: value})
                                }
                            }
                        }
                    }
                    console.log(statePushInfo)
                    console.log(this.freightAreaInfo)
                    this.$store.dispatch('pushForwardStateInfo', {
                        statePushInfo                       
                    })
                } else {
                    // let arrdiff = this.getArrDifference(val, this.propStateList)
                    // console.log(arrdiff)
                    let statePushInfo = []
                    for (const iterator of this.addressList) {
                        for (let i = 0; i < iterator.stateName.length; i++) {
                            for (const value of val) {
                                if (value === iterator.stateName[i]) {
                                    console.log(iterator)
                                    statePushInfo.push({area: iterator.areaName, state: value, stateEn: value})
                                }
                            }
                        }
                    }
                    console.log(statePushInfo)
                    this.$store.dispatch('addForwardStateInfo', {
                        statePushInfo                       
                    }) 
                }
                this.addressDisableList.splice(0)
                this.propStateList.splice(0)
            },
            getArrDifference (arr1, arr2) {
                return arr1.concat(arr2).filter((v, i, arr) => {
                    return arr.indexOf(v) === arr.lastIndexOf(v)
                })
            }
        }    
    }
</script>
<style lang="scss">
    .forward-aging-table{
        .el-input--mini{
            width: 100px;
        }
        .freightAreaInfo-table{
            .cell{
                padding-left:0px !important;
                padding-right:0px !important;
            }
        }
    }
</style>
<style lang="scss" scoped>
    .forward-aging-table{
        .table-cell-area-title{
            display: flex;
            justify-content:center;
            .edit-btn{
                width: 100px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #409EFF;
                cursor: pointer;
            }
        }
        .forward-aging-table-delete{
            color: #409EFF;
            cursor: pointer;
        }
        .forward-aging-table-add{
            width: 100%;
            margin: 20px 0;
            text-align: center;
            color: #409EFF;
            cursor: pointer;
        }
        .nature0,.input0{
            padding-bottom: 10px;
            border-bottom: 1px solid #EBEEF5;
        }
        .nature1,.input1{
            padding-top: 10px;
        }
        .area-city{
            max-width: 200px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
            overflow: hidden;
        }
    }
</style>