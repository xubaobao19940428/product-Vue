<template>
    <el-dialog
        title="新增商品"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose"
        class="add-product-dialog">
        <el-form :rules="rules" :model="queryData"  label-width="90px">
            <el-form-item label="活动名称：">
                {{ title }}
            </el-form-item>
            <el-form-item label="活动站点：">
                {{ showCountry(country) }}
            </el-form-item>
            <el-form-item label="提报商品：" prop="serialId">
                <el-table :data="tableData">
                    <el-table-column label="商品ID" align="center">
                        <template slot-scope="scope">
                            <el-input type="textarea" placeholder="最多300个SPUID，用英文逗号,隔开" v-model="queryData.serialId"></el-input> 
                        </template>
                    </el-table-column>
                    <el-table-column label="分组" align="center">
                        <template slot-scope="scope">
                            <el-select v-model="queryData.groupLabelId" clearable placeholder="请选择" size="medium">
                                <el-option v-for="(item, index) in activityLabel"
                                            :key="index"
                                            :label="getMultiLangShowInfo(item.name)"
                                            :value="item.id"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="confirm">开始提报</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { InsertNoSignedProduct } from '@/request/activityReport'
    import { listActiveGroup } from '@/request/marketing.js'
    import common from '@/js/common/mixins'

    export default {
        props: {
            dialogVisible: Boolean,
            title: String,
            country: String,
            activeId: String
        },
        data () {
            return{
                queryData: {
                    serialId: '',
                    groupLabelId: ''
                },
                rules: {
                    serialId: [{ required: true, message: '请输入SPUID', trigger: 'change' }]
                },
                tableData: [{value:1}],
                activityLabel: []
            }
        },
        mixins: [common],
        mounted() {
            this.getActivityLabel()
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
            },
        },
        methods: {
            getActivityLabel () {
                listActiveGroup(this.filterData({
                    activeId: this.activeId
                })).then((res) => {
                    if (res.ret.errcode === 1) {
                        this.activityLabel = res.groupInfo
                    }
                })
            },
            showCountry (code) {
                let item = this.countryList.find(val => {
                    return val.shortCode === code
                })
                return item.nameCn
            },
            handleClose () {
                this.$emit('on-cancel')
            },
            confirm () {
                if (this.queryData.serialId === '') {
                    this.$message.error('请输入SPUID!')
                    return
                }
                let list = this.queryData.serialId.split(',')
                let toList = list.filter(function (s) {
                    return s && s.trim();
                })
                console.log(toList)
                if (toList.length > 300) {
                    this.$message.error('最多300个SPUID!')
                    return
                }
                let arr = []
                for (const iterator of toList) {
                    if (isNaN(Number(iterator))){
                        arr.push(iterator)
                    }
                }
                if (arr.length > 0) {
                    let errSpuId = arr.join(',')
                    this.$message.error(`${errSpuId} 是不符合规范的SPUID！`)
                    return
                }
                let item = this.activityLabel.find( val => {
                    return val.id =  this.queryData.groupLabelId
                })
                let params = {
                    activeId: this.activeId,
                    productId: toList,
                    countryCode: this.country,
                    groupLabelId: this.queryData.groupLabelId === ''?'':this.queryData.groupLabelId.toString(),
                    groupLabel: this.queryData.groupLabelId===''?[]:item.name,
                }
                InsertNoSignedProduct(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        if (res.invalidSpu.length === 0 && res.packageSpu.length===0) {
                            this.notify()
                        }else if(res.invalidSpu.length !== 0 && res.packageSpu.length!==0){
                            this.notify(res.invalidSpu,res.packageSpu)
                        }else if(res.invalidSpu.length !== 0){
                            this.notify(res.invalidSpu)
                        }else if(res.packageSpu.length !== 0){
                            this.notify(res.packageSpu)
                        }
                    }
                })
            },
            notify (invalidSpu, packageSpu) {
                if (invalidSpu && packageSpu) {
                    this.$notify.error({
                        title: '提示',
                        dangerouslyUseHTMLString: true,
                        message: `<div>无效商品：</div><div style="width:250px;word-wrap:break-word">${invalidSpu}</div>
                        <div>礼包商品：</div><div style="width:250px;word-wrap:break-word">${packageSpu}</div>`,
                        duration: 0
                    });
                } else if (invalidSpu) {
                    this.$notify.error({
                        title: '提示',
                        dangerouslyUseHTMLString: true,
                        message: `<div>无效商品：</div><div style="width:250px;word-wrap:break-word">${invalidSpu}</div>`,
                        duration: 0
                    });
                } else if (packageSpu) {
                    this.$notify.error({
                        title: '提示',
                        dangerouslyUseHTMLString: true,
                        message: `礼包商品：${packageSpu}`,
                        message: `<div>礼包商品：</div><div style="width:250px;word-wrap:break-word">${packageSpu}</div>`,
                        duration: 0
                    });
                }
                this.$emit('on-confirm')
            }
        }
    }
</script>
<style lang="scss">
    .add-product-dialog{
        .el-textarea__inner{
            width: 300px;
            min-height: 60px !important;
        }
        .el-table td, .el-table th.is-leaf{
            background-color: #F5F7FA;
        }
    }
    /deep/ .no-data{
        width: 300px;
        white-space:pre-wrap;
    }
</style>
<style lang="scss" scoped>
    .add-product-dialog{
        
    }
    
</style>