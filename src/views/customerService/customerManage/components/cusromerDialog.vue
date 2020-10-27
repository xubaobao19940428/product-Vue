<template>
    <el-dialog
        :title="editType === 'add' ? '添加客服' : '编辑客服'"
        :visible.sync="toggle"
        width="30%"
        :before-close="cancel"
        class="customer-dialog">
        <!-- {{queryData}} -->
        <el-form label-position="left" label-width="110px" :model="queryData" :rules="rules">
            <el-form-item class="filter-item" label="客服人员：" prop="csName">
                <el-select v-model="queryData.csName" :disabled="editType === 'edit'" filterable clearable remote reserve-keyword :remote-method="getlistSysUserByPage" @change="getlistSysUserByPage" size="medium" placeholder="按名称模糊匹配">
                    <el-option v-for="(item, index) in customerList"
                        :key="index"
                        :label="item.nickName"
                        :value="item.nickName"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客服国家：" class="filter-item" prop="csCountryCode">
                <el-select v-model="queryData.csCountryCode" clearable placeholder="请选择" size="medium">
                    <el-option v-for="(item, index) in countryList"
                                :key="index"
                                :label="item.nameCn "
                                :value="item.shortCode"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="filter-item" label="服务语言技能：" prop="csLanguage">
                <el-select v-model="queryData.csLanguage" multiple size="medium" laceholder="请选择">
                    <el-option v-for="(item, index) in languageList"
                        :key="index"
                        :label="item.desc"
                        :value="item.code"
                    ></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="cancel">取 消</el-button>
            <el-button type="primary" @click="comfirm">保 存</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import { listSysUserByPage } from '@/request/staff'
    import { UpdateCsStaff, AddCsStaff } from '@/request/customerManage'

    export default {
        props: {
            dialogVisible:Boolean,
            editType: String,
            languageList: Array,
            countryList: Array,
            editModule: Object
        },
        data () {
            return {
                queryData: {
                    csName: '',
                    csCountryCode: '',
                    csLanguage: [],
                    page:{
                        pageNum: 1,
                        pageSize: 10
                    }
                },
                customerList: [],
                rules: {
                    csName: [
                        { required: true, message: '请至少选择一个', trigger: 'change' }
                    ],
                    csCountryCode: [
                        { required: true, message: '请至少选择一个', trigger: 'change' }
                    ],
                    csLanguage: [
                        { required: true, message: '请至少选择一个', trigger: 'change' }
                    ],
                },
                csId: null
            }
        },
        mounted () {
            if (this.editType === 'edit') {
                this.queryData.csName = this.editModule.csName
                this.queryData.csCountryCode = this.editModule.csCountryCode.toLocaleUpperCase()
                this.queryData.csLanguage = this.editModule.csLanguage.split('|')
                this.csId = this.editModule.csId
            } else {
                this.getlistSysUserByPage()
            }
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible
                },
                set: function () {}
            }
        },
        methods: {
            getlistSysUserByPage (val) {
                let params = {
                    nickName: val?val:this.queryData.csName,
                    page: {
                        pageNum: 1,
                        pageSize: 10,
                        pagingSwitch: true
                    }
                }
                listSysUserByPage(params).then(res => {
                    if (res.ret.errcode === 1) {
                        console.log(res)
                        this.customerList = res.sysUserPb
                        this.csId = res.sysUserPb[0].id
                    }
                })
            },
            cancel () {
                this.$emit('on-cancel')
            },
            comfirm () {
                if (this.queryData.csName === '' || this.queryData.csCountryCode === '' || this.queryData.csLanguage.length === 0){
                    this.$message.error('请输入必填项！')
                    return
                } 
                // let item = this.customerList.find((val)=>{
                //     return val.nickName === this.queryData.csName
                // })
                // this.getlistSysUserByPage()
                // console.log(this.customerList)
                let params = {
                    csId: this.csId,
                    csName: this.queryData.csName,
                    csCountryCode: this.queryData.csCountryCode,
                    csLanguage: this.queryData.csLanguage.join('|')
                }
                if (this.editType === 'add') {
                    AddCsStaff(params).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$emit('on-confirm')
                        }
                    })
                } else {
                    UpdateCsStaff(params).then(res => {
                        if (res.ret.errcode === 1) {
                            this.$emit('on-confirm')
                        }
                    }) 
                }
            }
        }
    }
</script>
<style lang="scss">

</style>