<template>
    <div class="eidt-dialog">
        <el-dialog :title="title" :visible.sync="toggle" :close-on-click-modal="false" :show-close="false" width="700px">
            <div slot="title">
                {{title}}
            </div>
            <el-form ref="indexEditForm" :model="indexModel" :rules="ruleValidate" label-width="120px">
                <el-form-item prop="targetCategoryId" label="指标大类：">
                    <el-select v-model="indexModel.targetCategoryId" filterable allow-create default-first-option placeholder="请输入" size="medium" :disabled="editType==='edit'" @change="selectChange">
                        <el-option v-for="item in categoryList" :key="item.value" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="indexKey" label="指标键：" >
                    <el-input v-model="indexModel.indexKey" clearable placeholder="请输入指标键" style="width: 320px" :maxlength="120" size="medium"></el-input>
                </el-form-item>
                <el-form-item prop="indexName" label="指标名称：" >
                    <el-input v-model="indexModel.indexName" clearable placeholder="请输入指标名称" style="width: 320px" :maxlength="40" size="medium"></el-input>
                </el-form-item>
                <el-form-item prop="indexDesc" label="业务口径描述：">
                    <el-input v-model="indexModel.indexDesc" clearable placeholder="请输入备注" :maxlength="120" style="width: 320px" size="medium"></el-input>
                </el-form-item>
                <el-form-item prop="" label="是否生效：">
                    <el-switch style="display: block;marginTop:9px" v-model="indexModel.indexStatus" active-color="#13ce66" inactive-color="#ff4949" active-text="生效" inactive-text="失效"></el-switch>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="comfirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { AddTargetData, EditTargetData } from '@/request/dataIndexManage'

    export default {
        data() {
            return {
                ruleValidate: {
                    indexName: [{
                        required: true,
                        trigger: 'blur',
                        message: '指标名称不能为空'
                    }],
                    indexKey: [{
                        required: true,
                        trigger: 'blur',
                        message: '指标键不能为空'
                    }],
                    indexDesc: [{
                        required: true,
                        trigger: 'blur',
                        message: '业务口径描述不能为空'
                    }],
                    // targetCategoryId: [{
                    //     required: true,
                    //     trigger: 'blur',
                    //     message: '指标打类不能为空'
                    // }]
                },
                indexModel: {
                    targetCategoryId: '',
                    targetCategoryName: '',
                    indexKey: '',
                    indexName: '',
                    indexDesc: '',
                    indexStatus: true
                }
            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            editType: {
                type: String,
                default: ''
            },
            editData: Object,
            categoryList: Array,
            tableData: Array
        },
        watch: {
            editData: {
                handler (val) {
                    if (val) {
                        this.indexModel.indexKey = val.indexKey
                        this.indexModel.indexName = val.indexName
                        this.indexModel.indexDesc = val.indexDesc
                        this.indexModel.indexStatus = val.indexStatus
                        this.indexModel.targetCategoryId = val.targetCategoryId
                        this.indexModel.targetCategoryName = val.targetCategoryName
                    }
                },
                deep: true
            }
        },
        computed: {
            toggle: {
                get: function() {
                    return this.dialogVisible;
                },
                set: function() {}
            }
        },
        methods: {
            selectChange (val) {
                if (Number(val)) {
                    this.indexModel.targetCategoryId = val
                    for (const iterator of this.categoryList) {
                        if (val === iterator.id) {
                            this.indexModel.targetCategoryName = iterator.name
                        }
                    }
                }
            },
            getAddTargetData () {
                if (!Number(this.indexModel.targetCategoryId)){
                    this.indexModel.targetCategoryName = this.indexModel.targetCategoryId
                    this.indexModel.targetCategoryId = ''
                }
                for (const iterator of this.tableData) {
                    if (iterator.targetKey === this.indexModel.indexKey) {
                        this.$message.error('指标键不能重复！')
                        return
                    }
                    if (iterator.targetName === this.indexModel.indexName) {
                        this.$message.error('指标名称不能重复！')
                        return
                    }
                }
                let params = {
                    targetKey: this.indexModel.indexKey,
                    targetName: this.indexModel.indexName,
                    targetDescription: this.indexModel.indexDesc,
                    targetStatus: this.indexModel.indexStatus?'1':'2',
                    targetCategoryId: this.indexModel.targetCategoryId,
                    targetCategoryName: this.indexModel.targetCategoryName
                }
                console.log(params)
                AddTargetData(params).then(res => {
                    if (res.ret.errcode === 1){
                        console.log(res)
                        this.$refs.indexEditForm.validate((valid) => {
                            if (valid) {
                                this.$emit('on-confirm', this.indexModel)
                                this.$refs.indexEditForm.resetFields()
                                this.$message.success('添加成功')
                            }
                        })
                    }
                })
            },
            getEditTargetData () {
                if (!Number(this.indexModel.targetCategoryId)){
                    this.indexModel.targetCategoryName = this.indexModel.targetCategoryId
                    this.indexModel.targetCategoryId = ''
                }
                for (const iterator of this.tableData) {
                    if (iterator.targetKey === this.indexModel.indexKey) {
                        this.$message.error('指标键不能重复！')
                        return
                    }
                    if (iterator.targetName === this.indexModel.indexName) {
                        this.$message.error('指标名称不能重复！')
                        return
                    }
                }
                let params = {
                    targetKey: this.indexModel.indexKey,
                    targetName: this.indexModel.indexName,
                    targetDescription: this.indexModel.indexDesc,
                    targetStatus: this.indexModel.indexStatus?'1':'2',
                    targetCategoryId: this.indexModel.targetCategoryId,
                    targetCategoryName: this.indexModel.targetCategoryName,
                    targetId: this.editData.targetId
                }
                EditTargetData(params).then(res => {
                    if (res.ret.errcode === 1){
                        console.log(res)
                        this.$refs.indexEditForm.validate((valid) => {
                            if (valid) {
                                this.$emit('on-confirm', this.indexModel)
                                this.$refs.indexEditForm.resetFields()
                                this.$message.success('编辑成功')
                            }
                        })
                    }
                })
            },
            cancle() {
                this.$emit('on-cancle')
                this.$refs.indexEditForm.resetFields()
            },
            comfirm() {
                if (this.editType === 'add') {
                    this.getAddTargetData()
                }else {
                    this.getEditTargetData()
                }
            }
        }
    }
</script>

<style lang="scss">
    .eidt-dialog {
        .el-dialog__body {
            padding: 30px 40px;
        }
        .el-dialog__header {
            border-bottom: 1px solid #ebeef5;
        }
        .el-dialog__body {
            padding: 50px 40px;
        }
        .el-dialog__footer {
            border-top: 1px solid #ebeef5;
        }
        .el-form--inline .el-form-item {
            margin-right: 0;
        }
        .limit-num-tip {
            color: #000;
        }
        .standard-img {
            width: 110px;
            height: 110px;
            .el-upload--picture-card {
                width: 110px;
                height: 110px;
                line-height: 120px;

            }
            .el-upload-list--picture-card .el-upload-list__item {
                width: 110px;
                height: 110px;
            }
        }
    }
</style>

<style lang="scss" scoped>
    .upload-wapper {
        overflow: hidden;
    }
    .cover-image {
        width: 110px;
        height: 110px;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        padding: 4px;
        &:hover {
            .operate-area {
                opacity: .5;
                transition: opacity .3s;
                border-radius: 6px;
            }
        }
        .operate-area {
            position: absolute;
            opacity: 0;
            background: #000000;
            height: 110px;
            line-height: 110px;
            bottom: 0;
            left: 0px;
            width: 110px;
            box-sizing: border-box;
            color: #fff;
            font-size: 16px;
            text-align: center;
        }
    }
</style>

