<template>
    <div class="sensitive-edit-dialog">
        <el-dialog :title="dialogTitle" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false">
            <el-form ref="iconEditForm" :rules="ruleValidate" :model="iconModel" label-width="150px">
                <el-form-item label="国家：" prop="countryCode">
                    {{iconModel.countryCode | countryFilter}}
                </el-form-item>
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="iconModel.name" placeholder="请输入名称" size="medium" clearable  style="width: 220px;"></el-input>
                </el-form-item>
                <el-form-item :label="'开始时间('+ countryName +')：'" prop="startTime">
                    <el-date-picker v-model="iconModel.startTime" type="datetime" placeholder="选择开始时间" value-format="timestamp"></el-date-picker>
                </el-form-item>
                <el-form-item :label="'结束时间('+ countryName +')：'" prop="endTime">
                    <el-date-picker v-model="iconModel.endTime" type="datetime" placeholder="选择结束时间" value-format="timestamp"></el-date-picker>
                </el-form-item>
                <el-tabs v-model="activeTabName" @tab-click="handleTabClick">
                    <el-tab-pane label="首页" name="index">
                        <icon-upload-item :item="iconModel.indexItemObj"></icon-upload-item>
                    </el-tab-pane>
                    <el-tab-pane label="学院" name="academy">
                        <icon-upload-item :item="iconModel.academyItemObj"></icon-upload-item>
                    </el-tab-pane>
                    <el-tab-pane label="PS店铺" name="affiliate">
                        <icon-upload-item :item="iconModel.affiliateItemObj"></icon-upload-item>
                    </el-tab-pane>
                    <el-tab-pane label="购物车" name="cart">
                        <icon-upload-item :item="iconModel.cartItemObj"></icon-upload-item>
                    </el-tab-pane>
                    <el-tab-pane label="我的" name="my">
                        <icon-upload-item :item="iconModel.myItemObj"></icon-upload-item>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" :loading="loading" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import IconUploadItem from './IconUploadItem.vue'

    export default {
        //
        name: 'buttomIconEdit',
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            },
            iconModel: {
                type: Object,
                default: () => {}
            },
            countryName: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                dialogTitle: '首页底部图标',
                ruleValidate: {
                    name: [{
                        required: true,
                        trigger: 'blur',
                        message: '不能为空'
                    }],
                    startTime: [{
                        required: true,
                        trigger: 'change',
                        message: '不能为空'
                    }, {
                        trigger: 'change',
                        validator: (rule, value, callback) => {
                            if (value >= this.iconModel.endTime) {
                                callback(new Error('开始时间不能大于结束时间'))
                            } else {
                                callback()
                            }
                        }
                    }],
                    endTime: [{
                        required: true,
                        trigger: 'change',
                        message: '不能为空'
                    }, {
                        trigger: 'change',
                        validator: (rule, value, callback) => {
                            if (value <= this.iconModel.startTime) {
                                callback(new Error('开始时间不能小于结束时间'))
                            } else {
                                callback()
                            }
                        }
                    }]
                },
                activeTabName: 'index',
                itemObj: {
                    unselected: '',
                    selected: ''
                },
                loading: false
            }
        },
        components: {
            IconUploadItem
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
            cancle() {
                this.$emit('on-cancle')
                this.activeTabName = 'index'
            },
            confirm() {
                this.loading = true
                this.$refs.iconEditForm.validate((valid) => {
                    this.loading = false
                    if (valid) {
                        if (this.iconModel.indexItemObj.selected === '' || this.iconModel.indexItemObj.unselected === '') {
                            this.$message.warning('【首页】图标不能为空')
                            return
                        }
                        if (this.iconModel.academyItemObj.selected === '' || this.iconModel.academyItemObj.unselected === '') {
                            this.$message.warning('【学院】图标不能为空')
                            return
                        }
                        if (this.iconModel.affiliateItemObj.selected === '' || this.iconModel.affiliateItemObj.unselected === '') {
                            this.$message.warning('【PS店铺】图标不能为空')
                            return
                        }
                        if (this.iconModel.cartItemObj.selected === '' || this.iconModel.cartItemObj.unselected === '') {
                            this.$message.warning('【购物车】图标不能为空')
                            return
                        }
                        if (this.iconModel.myItemObj.selected === '' || this.iconModel.myItemObj.unselected === '') {
                            this.$message.warning('【我的】图标不能为空')
                            return
                        }
                        this.$emit('on-confirm', this.iconModel)
                        this.activeTabName = 'index'
                    }
                })
            },
            handleTabClick() {}
        }
    }
</script>

<style lang="scss">
    .sensitive-edit-dialog {
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
    }
</style>



