<template>
    <el-dialog title="工单详情页"
               width="700px"
               :visible="showDialog"
               @close="closeDialog()">
        <common-detail :workOrderNo="workOrderNo" :collapseArray="collapseArray"></common-detail>
        <el-collapse v-model="collapseArray">
            <el-collapse-item title="操作" name="4">
                <el-form label-width="80px"
                         ref="dealWorkOrder"
                         :model="params"
                         :rules="rules">
                    <el-form-item label="问题解决：" prop="dealType">
                        <el-radio-group v-model="params.dealType">
                            <el-radio v-for="(val, key) in typeList"
                                      :key="key"
                                      :label="key">{{ val}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <template v-if="params.dealType == 4">
                        <el-form-item label="转派工单：" prop="turnSendType">
                            <el-radio-group v-model="params.turnSendType">
                                <el-radio v-for="(val, key) in turnSendType"
                                          :key="key"
                                          :label="key">{{ val}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="params.turnSendType == 0" label="处理人：" prop="dealManagerId">
                            <el-select v-model="params.dealManagerId"
                                       :remote-method="getAdminUserList"
                                       placeholder="请选择" size="medium" clearable filterable remote>
                                <el-option v-for="(item, index) in adminUserList"
                                           :key="index"
                                           :label="item.realName"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </template>
                    <el-form-item label="处理说明：">
                        <el-input v-model="params.dealConetent" type="textarea" placeholder="请输入2000字符以内"
                                    maxLength="2000"
                                  :rows="2"></el-input>
                    </el-form-item>
                    <el-form-item label="上传图片：">
                        <c-upload v-if="showDialog" :fileList="params.dealPic"
                            :limit="30"
                            listType="text"
                            @setData="setCoverImg"></c-upload>
                    </el-form-item>
                    <template v-if="params.dealType != 4">
                        <el-form-item label="工单评价：">
                            <el-checkbox-group v-model="params.dealEvaluation">
                                <el-checkbox v-for="(val, key) in evaluationMap"
                                             :key="key"
                                             :label="key">{{ val }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </template>
                    <el-form-item label="抄送：">
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
            <el-button size="small" type="primary" @click="confirmDealOrder()">确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import commonDetail from './commonInfo'
    import {
        DealWorkOrder
    } from '@/request/workOrder.js'
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
        data () {
            return {
                params: {
                    dealType: '4',
                    dealEvaluation: [],
                    dealManagerId: '',
                    dealPic: '',
                    dealConetent: '',
                    ccManagerId: '',
                    turnSendType: '0'
                },
                rules: {
                    dealType: [{ required: true, message: '不能为空', trigger: 'change' }],
                    turnSendType: [{ required: true, message: '不能为空', trigger: 'change' }],
                    dealManagerId: [{ required: true, message: '不能为空', trigger: 'change' }]
                },
                evaluationMap: {
                    1: '标签有误',
                    2: '无需处理',
                    3: '非本人处理',
                    4: '其他'
                },
                typeList: {
                    4: '转派',
                    5: '退单',
                    6: '已解决'
                },
                turnSendType: {
                    0: '按人转派',
                    1: '按标签转派'
                },
                imgList: [],
                uploadFileUrl: `${process.env.VUE_APP_UPLOAD_API}`,
                uploadFileName: `${process.env.VUE_APP_UPLOAD_NAME}`,
                headers: this.$headers
            }
        },
        components: {
            commonDetail,
            cUpload
        },
        watch: {
            workOrderNo (val) {
                if (val) {
                    this.params = {
                        dealType: '4',
                        dealEvaluation: [],
                        dealManagerId: '',
                        dealPic: '',
                        dealConetent: '',
                        ccManagerId: '',
                        turnSendType: '0'
                    }
                }
            }
        },
        methods: {
            setCoverImg (res) {
                this.params.dealPic = res.data
            },
            confirmDealOrder () {
                this.$refs['dealWorkOrder'].validate((valid) => {
                    if (valid) {
                        DealWorkOrder(this.filterData(Object.assign(this.params, {
                            workOrderNo: this.workOrderNo
                        }))).then((res) => {
                            if (res.ret.errcode === 1) {
                                this.$message.success('处理成功')
                                this.closeDialog()
                            }
                        })
                    }
                })
            },
            closeDialog () {
                this.$emit('close')
            }
        }
    }
</script>
