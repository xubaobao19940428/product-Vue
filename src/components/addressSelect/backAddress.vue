<template>
    <el-dialog title="后台地址选择"
               width="700px"
               :close-on-click-modal="false"
               append-to-body
               :visible="propShowDialog"
               @close="close">
        <div>
            <template v-if="countryCode == 'SG'">
                <el-checkbox v-model="select" class="area-wrapper">Singapore</el-checkbox>
            </template>
            <template v-else>
                <!-- {{propStateList}}
                {{'==>'}}{{addressDisableList}} -->
                <div v-for="(area, areaI) in addressList" :key="areaI" class="flex mar-b-10">
                    <el-checkbox @change="areaSelectChange(area)" :indeterminate="area.isIndeterminate" :disabled="aging==='aging' && isAllDisabled(area.stateName)" v-model="area.selectAll" class="area-wrapper">{{ area.areaName }}</el-checkbox>
                    <div class="flex1">
                        <el-checkbox-group v-model="area.selectList">
                            <el-checkbox v-for="(state, stateI) in area.stateName" @change="stateChange(area)" :label="state" :key="stateI" :disabled="aging==='aging' && isDisabled(state)">{{ state }}</el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>
            </template>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="close">取 消</el-button>
                <el-button size="small" type="primary" @click="confirm()">确 定</el-button>
            </span>
    </el-dialog>
</template>
<script>
    import { getCountryDivision } from '@/request/i18n'
    export default {
        props: {
            propShowDialog: Boolean,
            countryCode: String,
            propStateList: {
                type: Array,
                default: () => { return [] }
            },
            aging: String,
            operateType: String,
            addressDisableList: {
                type: Array,
                default: () => { return [] }
            },
        },
        data () {
            return {
                addressList: [],
                select: false
            }
        },
        watch: {
            countryCode: {
                handler (val) {
                    if (val) {
                        this.getAddress()
                    }
                },
                deep: true
            },
            propShowDialog (val) {
                if (val) {
                    this.init()
                }
            }
        },
        created () {
            this.getAddress()
        },
        methods: {
            isAllDisabled (val) {
                if (this.addressDisableList.length === 0) {
                    return false
                } else {
                    let arr = val.filter(v => {
                        return this.addressDisableList.indexOf(v)!==-1 // 利用filter方法来遍历是否有相同的元素
                    })
                    if (arr.length === val.length) {
                        return true
                    }
                }
            },
            isDisabled (val) {
                if (this.addressDisableList.length === 0) {
                    return false
                } else {
                    if (this.addressDisableList.indexOf(val) !== -1) {
                        return true
                    }
                }
            },
            init () {
                console.log(this.propStateList)
                for (let i = 0; i < this.addressList.length; i++) {
                    this.addressList[i]['selectList'] = []
                    if (this.propStateList.length > 0) {
                        for (let j = 0; j < this.addressList[i].stateName.length; j++) {
                            let item = this.propStateList.find((val) => {
                                return val == this.addressList[i].stateName[j]
                            })
                            if (item) {
                                this.addressList[i].selectList.push(item)
                            }
                        }
                    }
                    this.addressList[i]['selectAll'] = false
                    this.addressList[i]['isIndeterminate'] = false
                    if (this.addressList[i].selectList.length == 0) {
                        this.addressList[i].selectAll = false
                    } else if (this.addressList[i].selectList.length > 0 && this.addressList[i].selectList.length < this.addressList[i].stateName.length) {
                        this.addressList[i].isIndeterminate = true
                    } else if (this.addressList[i].selectList.length == this.addressList[i].stateName.length) {
                        this.addressList[i].selectAll = true
                    }
                }
            },
            getAddress () {
                getCountryDivision({
                    countryCode: this.countryCode
                }).then((res) => {
                    for (let i = 0; i < res.area.length; i++) {
                        res.area[i]['selectList'] = []
                        if (this.propStateList.length > 0) {
                            for (let j = 0; j < res.area[i].stateName.length; j++) {
                                let item = this.propStateList.find((val) => {
                                    return val == res.area[i].stateName[j]
                                })
                                if (item) {
                                    res.area[i].selectList.push(item)
                                }
                            }
                        }
                        res.area[i]['selectAll'] = false
                        res.area[i]['isIndeterminate'] = false
                        if (res.area[i].selectList.length == 0) {
                            res.area[i].selectAll = false
                        } else if (res.area[i].selectList.length > 0 && res.area[i].selectList.length < res.area[i].stateName.length) {
                            res.area[i].isIndeterminate = true
                        } else if (res.area[i].selectList.length == res.area[i].stateName.length) {
                            res.area[i].selectAll = true
                        }
                    }
                    this.addressList = res.area
                })
            },
            areaSelectChange (area) {
                console.log(area)
                area.isIndeterminate = false
                if (area.selectAll) {
                    for (let i = 0; i < area.stateName.length; i++) {
                        let stateI = area.selectList.findIndex((val) => {
                            return val == area.stateName[i]
                        })
                        console.log(stateI)
                        if (stateI == -1) {
                            let disabledStateI = this.addressDisableList.findIndex((item) => {
                                return item === area.stateName[i]
                            })
                            if (disabledStateI == -1) {
                                area.selectList.push(area.stateName[i])
                            }
                        }
                    }
                } else {
                    area.selectList = []
                }
            },
            stateChange (area) {
                if (area.selectList.length == 0) {
                    area.selectAll = false
                } else if (area.selectList.length > 0 && (area.selectList.length < area.stateName.length)) {
                    area.isIndeterminate = true
                } else if (area.selectList.length == area.stateName.length) {
                    area.isIndeterminate = false
                    area.selectAll = true
                }
            },
            close () {
                this.$emit('close')
            },
            confirm () {
                let selectState = []
                if (this.countryCode == 'SG') {
                    if (this.select) {
                        selectState = ['Singapore']
                    }
                } else {
                    for (let i = 0; i < this.addressList.length; i++) {
                        if (this.addressList[i].selectList.length > 0) {
                            selectState = selectState.concat(this.addressList[i].selectList)
                        }
                    }
                }
                console.log(this.addressList)
                this.$emit('confirm', selectState)
            }
        }
    }
</script>
<style lang="scss" scoped>
.area-wrapper{
    min-width: 150px;
}
.el-checkbox{
    margin-bottom: 10px;
}
</style>
