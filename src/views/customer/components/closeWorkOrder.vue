<template>
    <el-dialog title="关闭工单"
               width="700px"
               class="work-order-dialog"
               :visible="showDialog"
               @close="closeDialog()">
        <common-detail :workOrderNo="workOrderNo" :collapseArray="collapseArray"></common-detail>
        <el-collapse v-model="collapseArray">
            <el-collapse-item title="操作" name="4">
                <el-form ref="closeWorkOrder" label-width="80px" :rules="rules" :model="params">
                    <el-form-item label="">
                        <el-radio-group v-model="dealType" @change="clearValidate">
                            <el-radio v-for="(val, key) in typeList"
                                      :key="key"
                                      :label="key">{{ val}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="跟进补充：" v-if="dealType == 0" prop="dealConetent">
                        <el-input v-model="params.dealConetent" type="textarea" placeholder="请输入跟进补充"
                                  :rows="2"></el-input>
                    </el-form-item>
                    <el-form-item label="关闭备注：" v-else>
                        <el-input v-model="params.dealConetent" type="textarea" placeholder="请输入关闭备注"
                                    maxLength="2000"
                                  :rows="2"></el-input>
                    </el-form-item>
                    <el-form-item label="上传附件：">
                        <c-upload v-if="showDialog" :fileList="params.dealPic" @setData="setCoverImg"
                            :limit="30"
                            listType="text"></c-upload>
                    </el-form-item>
                    <el-form-item label="抄送：" v-if="dealType == 1">
                        <el-select v-model="params.ccManagerId"
                                   :remote-method="getAdminUserList"
                                   placeholder="请选择" size="medium" clearable filterable remote>
                            <el-option v-for="(item, index) in adminUserList"
                                       :key="index"
                                       :label="item.realName"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="closeDialog()">取 消</el-button>
            <el-button size="small" type="primary" @click="confirmCloseItem">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import commonDetail from './commonInfo'
    import { CloseWorkOrder, FllowUpWorkOrder } from '@/request/workOrder.js'
    import common from './common'
    import cUpload from '@/components/fileUpload/'

    export default {
        props: {
            showDialog: {
                type: Boolean,
                default: false
            },
            collapseArray: Array,
            workOrderNo: String
        },
        mixins: [common],
        components: {
            commonDetail,
            cUpload
        },
        data () {
            return {
                params: {
                    dealConetent: '',
                    dealPic: '',
                    ccManagerId: ''
                },
                rules: {
                    dealConetent: [{ required: true, message: '不能为空', trigger: 'change' }]
                },
                dealType: '',
                typeList: {
                    0: '跟进补充',
                    1: '关闭工单'
                },
                imgList: [],
                uploadFileUrl: `${process.env.VUE_APP_UPLOAD_API}`,
                uploadFileName: `${process.env.VUE_APP_UPLOAD_NAME}`,
                headers: this.$headers
            }
        },
        watch: {
            workOrderNo (val) {
                if (val) {
                    this.params = {
                        dealConetent: '',
                        dealPic: '',
                        ccManagerId: ''
                    }
                    this.clearValidate()
                }
            }
        },
        methods: {
            clearValidate () {
                this.$refs['closeWorkOrder'] && this.$refs['closeWorkOrder'].clearValidate()
            },
            confirmCloseItem () {
                this.$refs['closeWorkOrder'].validate((valid) => {
                    if (valid) {
                        let fetchUrl = FllowUpWorkOrder
                        if (this.dealType == 1) {
                            fetchUrl = CloseWorkOrder
                        }
                        fetchUrl(this.filterData(Object.assign(this.params, {
                            workOrderNo: this.workOrderNo
                        }))).then((res) => {
                            console.log(res)
                            if (res.ret.errcode === 1) {
                                this.$message.success('设置成功')
                                this.closeDialog()
                            }
                        })
                    }
                })
            },
            setCoverImg (res) {
                this.params.dealPic = res.data
            },
            closeDialog () {
                this.$emit('close')
            }
        }
    }
</script>
<style lang="scss">
 .work-order-dialog{
     .el-collapse{
         border-bottom: 0;
     }
 }
</style>
