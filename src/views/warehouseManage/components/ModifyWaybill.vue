<template>
    <el-dialog
        title="修改运单号"
        :visible.sync="toggle"
        width="900px"
        :before-close="cancle"
        class="modify-way">
        <el-tabs v-model="modify" @tab-click="handleTabs">
            <el-tab-pane
                :key="index"
                v-for="(item, index) in modifyList"
                :label="'包裹'+ (index+1)"
                :name="(index).toString()"
            >
                <div class="package-box">
                    <img :src="dealShowFileSrc(item.skuInfo[0].productCover)" class="package-img"/>
                    <div class="package-shadow"></div>
                    <div class="package-num">X{{item.skuInfo[0].count}}</div>
                </div>
                <div class="modify">
                    <div class="modify-title">物流公司：</div>
                    <el-select v-model="countryCode" size="medium" clearable disabled class="country-select">
                        <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                    <el-select v-model="item.logiCompany" size="medium" clearable>
                        <el-option v-for="(item, index) in logiCompany" :key="index" :label="item.companyName" :value="item.logiCompany"></el-option>
                    </el-select>
                </div>
                <div class="way-bill">
                    <div class="way-title">运单号：</div>
                    <el-input v-model="item.logiCode" clearable></el-input>
                </div>
            </el-tab-pane>
        </el-tabs>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancle">取 消</el-button>
            <el-button type="primary" @click="confirm">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { ModifyLogi, GetLogiCompanyList } from '@/request/directMail'
    import { dealShowFileSrc } from '@/js/common/globalMethod'

    export default {
        data() {
            return {
                modify:'0',
                logiCompany: [],
                oldLogiCode: [],
                oldLogiCompany: []
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            modifyList: Array,
            countryCode: String,
            modifyJitNo: String
        },
        created () {
            for (const iterator of this.modifyList) {
                console.log(iterator)
                this.oldLogiCode.push(iterator.logiCode)
                this.oldLogiCompany.push(iterator.logiCompany)
            }
        },
        mounted () {
            this.getLogiCompanyList()
        },
        watch: {
            modifyList: {
                handler(newVal, oldVal) {
                    console.log(newVal, oldVal)
                },
                deep: true
            }
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {}
            },
            countryList () {
                return this.$store.state.dict.countryList
            }
        },
        methods: {
            cancle () {
                this.$emit('on-cancle')
            },
            getLogiCompanyList () {
                let params = {
                    page: {
                        pageNum: 1,
                        pageSize: 100
                    },
                    type: 2,
                    countryCode: this.countryCode,
                    logiCompany: '',
                    companyName: '',
                    cooperateStatus: 1
                }
                GetLogiCompanyList(params).then(res => {
                    if(res.ret.errcode === 1){
                        console.log(res)
                        this.logiCompany = res.logiCompany
                    }
                })
            },
            getModifyLogiCode () {
                let num = Number(this.modify)
                console.log(num)
                let params = {
                    jitNo:this.modifyJitNo,
                    oldLogiCode: this.oldLogiCode[num],
                    logiCode: this.modifyList[num].logiCode,
                    oldLogiCompany: this.oldLogiCompany[num],
                    logiCompany: this.modifyList[num].logiCompany,
                    languageCode: 'cn',
                    reqType: 1
                }
                console.log(params)
                ModifyLogi(this.filterData(params)).then(res => {
                    if(res.ret.errcode === 1){
                        console.log(res)
                        this.$emit('on-confirm')
                    }
                })
            },
            confirm () {
                this.getModifyLogiCode()
            },
            handleTabs (val) {
                this.modify = val.name
            },
        },
    }
</script>
<style lang="scss">
    .modify-way{
        .el-input__inner{
            width: 300px
        }
    }
</style>
<style lang="scss" scoped>
    .modify-way{
        .package-box{
            position: relative;
            .package-img{
                width: 100px;
                height: 100px;
            }
            .package-shadow{
                position: absolute;
                width: 100px;
                height: 30px;
                bottom: 0px;
                background: black;
                opacity: 0.3;
            }
            .package-num{
                position: absolute;
                bottom: 5px;
                width: 100px;
                text-align: center;
                z-index: 3;
                color: #fff;
            }
        }
        .modify{
            display: flex;
            justify-content: flex-start;
            padding: 10px 0;
        }
        .modify-title{
            line-height: 36px;
        }
        .country-select{
            margin: 0 5px;
        }
        .way-bill{
            display: flex;
            justify-content: flex-start;
        }
        .way-title{
            width: 82px;
            height: 36px;
            line-height: 36px;
        }
    }
</style>