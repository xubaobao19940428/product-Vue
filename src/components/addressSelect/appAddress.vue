<template>
    <el-dialog title="用户信息"
               :close-on-click-modal="false"
               width="800px"
               append-to-body
               :visible="propShowDialog"
               @close="close">
        <div>
            <template>
                <div class="flex align-center mar-t-10">
                    <span>姓名：</span>
                    <el-input class="flex1" v-model="param.receiverName" placeholder="请输入姓名"></el-input>
                </div>
                <div class="flex align-center mar-t-10">
                    <span>手机号：</span>
                    <el-input class="flex1" v-model="param.receiverPhone" placeholder="请输入手机号"></el-input>
                </div>
            </template>
            <!--新加坡-->
            <template v-if="countryCode == 'SG'">
                <div class="flex align-center mar-t-10">
                    <span>收货邮编：</span>
                    <el-input class="flex1" v-model="param.postcode" placeholder="请输入邮编"></el-input>
                </div>
                <div class="flex align-center mar-t-10">
                    <span>详细地址：</span>
                    <el-input class="flex1" v-model="param.detail" placeholder="请输入详细地址"></el-input>
                </div>
            </template>
            <template v-else>
                <div class="flex align-center mar-t-10">
                <span class="mar-l-10">省：</span>
                <el-select v-model="param.stateName" @change="getCityData()" placeholder="省">
                    <el-option
                        v-for="item in stateList"
                        :key="item.stateName"
                        :label="item.stateName"
                        :value="item.stateName">
                    </el-option>
                </el-select>
                <span class="mar-l-10" >市：</span>
                <el-select v-model="param.cityName" @change="getPostCode()" placeholder="市">
                    <el-option
                        v-for="item in cityList"
                        :key="item.cityName"
                        :label="item.cityName"
                        :value="item.cityName">
                    </el-option>
                </el-select>
                <span class="mar-l-10" >邮编：</span>
                <el-select v-model="param.postcode" placeholder="邮编">
                    <el-option
                        v-for="item in postcodeList"
                        :key="item"
                        :label="item"
                        :value="item">
                    </el-option>
                </el-select>
                </div>
                <div class="flex align-center mar-t-10">
                    <span>详细地址：</span>
                    <el-input class="flex1" v-model="param.detail" placeholder="请输入详细地址"></el-input>
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
    import { getAppCountryDivision } from '@/request/i18n.js'
    export default {
        props: {
            countryCode: String,
            propShowDialog: Boolean,
            countryList: {
                type: Array,
                default: () => { return [] }
            },
            propParam: {
                type: Object,
                default: () => { return {} }
            }
        },
        data () {
            return {
                stateList: [],
                cityList: [],
                postcodeList: [],
                param: {
                    receiverName: '',
                    receiverPhone: '',
                    cityName: '',
                    cityCode: '',
                    stateName: '',
                    stateCode: '',
                    postcode: '',
                    detail: ''
                }
            }
        },
        created () {
            this.getAddressData({
                resolve: (data) => {
                    this.stateList = data
                }
            })
            for (let key in this.param) {
                if (this.propParam[key]) {
                    this.param[key] = this.propParam[key]
                }
            }
            if (this.propParam['receiverAddress']) {
                this.param.detail = this.propParam['receiverAddress']
            }
            if (this.propParam['cityCode']) {
                this.param.cityCode = this.propParam.cityCode
                this.param.cityName = this.propParam.cityCode
            }
            if (this.propParam['stateCode']) {
                this.param.stateCode = this.propParam.stateCode
                this.param.stateName = this.propParam.stateCode
            }
        },
        methods: {
            getAddressData ({ resolve }) {
                getAppCountryDivision({
                    countryCode: this.countryCode,
                    stateName: this.param.stateName
                }).then((res) => {
                    resolve && resolve(res.stat)
                })
            },
            reset (type) {
                switch (type) {
                    case 'country':
                        this.param.stateName = ''
                        this.param.stateCode = ''
                        this.param.cityCode = ''
                        this.param.cityName = ''
                        this.param.postcode = ''
                        break
                    case 'state':
                        this.param.cityCode = ''
                        this.param.cityName = ''
                        this.param.postcode = ''
                        break
                    case 'city':
                        this.param.postcode = ''
                        break
                }
            },
            getCityData () {
                this.getAddressData({
                    resolve: (stat) => {
                        this.reset('state')
                        console.log(stat)
                        this.cityList = stat[0].city
                        this.postcodeList = []
                    }
                })
            },
            getPostCode () {
                this.reset('city')
                let city = this.cityList.find((val) => {
                    return val.cityName == this.param.cityName
                })
                this.postcodeList = city.postcode
            },
            close () {
                this.$emit('close')
            },
            confirm () {
                let country = this.countryList.find((val) => {
                    return val.shortCode == this.countryCode
                })
                if (this.countryCode == 'SG') {
                    this.param.stateName = country ? country.nameEn : 'Singapore'
                    this.param.stateCode = country ? country.nameEn : 'Singapore'
                    this.param.cityCode = country ? country.nameEn : 'Singapore'
                    this.param.cityName = country ? country.nameEn : 'Singapore'
                } else {
                    let state = this.stateList.find((val) => {
                        return val.stateName == this.param.stateName
                    })
                    this.param.stateCode = state ? state.stateCode : this.param.stateName
                    let city = this.cityList.find((val) => {
                        return val.cityName == this.param.cityName
                    })
                    this.param.cityCode = city ? city.cityCode : this.param.cityName
                }
                let param = this.filterData(this.param)
                console.log(param)
                if (Object.keys(param).length != Object.keys(this.param).length) {
                    return this.$message.warning('请填写完整')
                }
                this.$emit('confirm', param)
                console.log(this.countryList)
            }
        }
    }
</script>
