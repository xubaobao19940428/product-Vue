<template>
    <div class="delivert-time-table">
        <!-- {{homeCountryAgingInfo}} -->
        <el-table
            :data="homeCountryAgingInfo"
            border
            style="width: 100%">
            <el-table-column prop="date" label="地区">
                <template slot-scope="scope">
                    <div class="table-cell-title">全国</div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="时效" width="400">
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
        <!-- {{homeAreaInfo}} -->
        <!-- {{'==>'}}{{homeAreaInfo[0].agingInfo}} -->
        <el-table
            :data="homeAreaInfo"
            border
            :show-header="false"
            style="width: 100%">
            <el-table-column label="">
                <template slot-scope="scope">
                    <div class="table-cell-area-title">
                        <div class="table-cell-title area-city">{{showCountry(scope.row.stateInfo)}}</div>
                        <div class="edit-btn" @click="editClick(scope.row.stateInfo,scope.$index)">编辑</div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="" width="400">
                <template slot-scope="scope">
                    <div v-if="scope.row.agingInfo">
                        <el-input v-model="scope.row.agingInfo[0].minDay" placeholder="" size='mini'></el-input>
                        -
                        <el-input v-model="scope.row.agingInfo[0].maxDay" placeholder="" size='mini'></el-input> 天
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="" width="100">
                <template slot-scope="scope">
                    <div @click="deleteDelivert(scope.$index)" class="delivert-time-table-delete">删除</div>
                </template>
            </el-table-column>
        </el-table>
        <div class="delivert-time-table-add" @click="addClick">新增制定地区及时效</div>
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
                addressDisableList: [],
                addressList: [],
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
                homeCountryAgingInfo: state => state.agingConfiguration.homeCountryAgingInfo,
                homeAreaInfo: state => state.agingConfiguration.homeAreaInfo,
                editAddressIndex: state => state.agingConfiguration.editAddressIndex
            })
        },
        methods: {
            // 编辑时其他列已有的地址不能重复选择
            addressEditChosen (i) {
                let address = this.homeAreaInfo[i].stateInfo
                console.log(address)
                for (const iterator of address) {
                    console.log(iterator)
                    this.propStateList.push(iterator.state)     
                }
                let addressDisable = this.homeAreaInfo.concat()
                addressDisable.splice(i, 1)
                console.log(addressDisable)
                if (addressDisable.length !== 0) {
                    let stateList = []
                    for (const iterator of addressDisable) {
                        stateList.push(iterator.stateInfo)
                        // for (let index = 0; index < iterator.stateInfo.length; index++) {
                        //     console.log(index,'==>',iterator.stateInfo[index].state)
                        //     this.addressDisableList.push(iterator.stateInfo[index].state)
                        // }    
                    }
                    for (let index = 0; index < stateList.length; index++) {
                        for (const iterator of stateList[index]) {
                            // console.log('==>',iterator.state)
                            this.addressDisableList.push(iterator.state)
                        }
                    } 
                }
                console.log(this.addressDisableList)
            },
            // 添加时所有列已有的地址不能重复选择
            addressAddChosen () {
                for (const iterator of this.homeAreaInfo) {
                    for (let index = 0; index < iterator.stateInfo.length; index++) {
                        // console.log(iterator.stateInfo[index].state)
                        this.addressDisableList.push(iterator.stateInfo[index].state)
                    }    
                }
            },
            showCountry (val) {
                console.log(this.homeAreaInfo)
                let area = ''
                console.log(val)
                for (const iterator of val) {
                    area = area + iterator.state + ','
                }
                return area
            },
            getAddress () {
                getCountryDivision({
                    countryCode: this.queryData.countryCode
                }).then((res) => {
                    this.addressList = res.area
                })
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
                console.log(i)
                // for (let i = 0; i < this.homeAreaInfo[0].stateInfo.length; i++) {
                //     if (val.state === this.homeAreaInfo[0].stateInfo[i].state) {
                //         console.log(this.homeAreaInfo[0].stateInfo[i].state)
                this.$store.dispatch('deleteStateInfo', {
                    deleteIndex: i
                })
                //     }
                // }
                console.log(this.homeAreaInfo)
            },
            // 点击编辑
            editClick (val, index) {
                this.operateType = 'edit'
                this.$store.dispatch('updateAddressIndex',{
                    editIndex: index
                })
                this.getAddress()
                this.addressEditChosen(index)
                console.log(this.homeAreaInfo)
                this.propShowDialog = true
            },
            // 点击添加
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
                console.log(this.homeAreaInfo)
                console.log(val)
                console.log(this.editAddressIndex)
                console.log(this.propStateList)
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
                    console.log(this.homeAreaInfo)
                    this.$store.dispatch('pushStateInfo', {
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
                    this.$store.dispatch('addStateInfo', {
                        statePushInfo                       
                    }) 
                }
                this.propStateList.splice(0)
                this.addressDisableList.splice(0)
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
    .delivert-time-table{
        .el-input--mini{
            width: 100px;
        }
    }
</style>
<style lang="scss" scoped>
    .delivert-time-table{
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
        .delivert-time-table-delete{
            color: #409EFF;
            cursor: pointer;
        }
        .delivert-time-table-add{
            width: 100%;
            margin: 20px 0;
            text-align: center;
            color: #409EFF;
            cursor: pointer;
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