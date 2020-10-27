<template>
    <el-dialog
        title="物流时效配置"
        :visible.sync="toggle"
        width="60%"
        :before-close="cancle"
        class="logistics-dialog">
        <div>
            <el-form :model="queryData" :rules="rules" ref="logisticsForm" class="logistics-form">
                <el-form-item label="时效类型" prop="agingType">
                    <el-select v-model="queryData.agingType" placeholder="请选择活动区域" size="small" :disabled="editType === 'edit'" @change="agingTypeChange">
                        <el-option label="货代时效" value="SHIPPING_AGENT"></el-option>
                        <el-option label="宅配时效" value="SHIPPING_HOME"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="适用国家" prop="countryCode">
                    <el-select v-model="queryData.countryCode" placeholder="请选择活动区域" size="small" :disabled="editType === 'edit'" @change="countryChange">
                        <el-option v-for="(item, index) in countryList" :key="index" :label="item.nameCn" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>  
            <!-- {{queryData}} -->
            <delivery-time v-if="queryData.agingType==='SHIPPING_HOME'" :agingType="queryData.agingType" :countryCode="queryData.countryCode"></delivery-time>
            <forwarding-aging-table v-if="queryData.agingType==='SHIPPING_AGENT'" :countryCode="queryData.countryCode"></forwarding-aging-table>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancle">取 消</el-button>
            <el-button type="primary" @click="confirm">保 存</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import deliveryTime from './deliveryTime'
    import forwardingAgingTable from './forwardingAgingTable'
    import { mapState } from 'vuex'

    export default {
        data () {
            return {
                // queryData: {
                //     agingType: '',
                //     countryCode: ''
                // },
                rules: {
                    agingType: [{ required: true, message: '请至少选择一个', trigger: 'change' }],
                    countryCode: [{ required: true, message: '请至少选择一个', trigger: 'change' }]
                }
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            editType: String,
        },
        components: {
            deliveryTime,
            forwardingAgingTable
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {
                }
            },
            countryList () {
                return this.$store.state.dict.countryList
            },
            ...mapState({
                queryData: state => state.agingConfiguration.queryData,
                homeCountryAgingInfo: state => state.agingConfiguration.homeCountryAgingInfo,
                homeAreaInfo: state => state.agingConfiguration.homeAreaInfo,
                freightCountryAgingInfo: state => state.agingConfiguration.freightCountryAgingInfo,
                freightAreaInfo: state => state.agingConfiguration.freightAreaInfo,
            })
        },
        methods: {
            agingTypeChange (val) {
                console.log(val)
                this.$store.dispatch('updateAgingType', {
                    agingType: val
                })
            },
            countryChange (val) {
                console.log(val)
                this.$store.dispatch('updateCountryCode', {
                    countryCode: val
                })
            },
            cancle () {
                this.$emit('on-cancle')
            },
            confirm () {
                this.$emit('on-confirm')
            }
        }
    }
</script>
<style lang="scss">
    .logistics-dialog{
        .el-select{
            margin-left: 15px;
        }
    }
</style>
<style lang="scss" scoped>
    .logistics-dialog{

    }
</style>