<template>
    <div class="edit-category-dialog">
        <el-dialog :title="title" :visible.sync="toggle" width="950px" @close="cancle">
            <el-form ref="categoryEditForm"  :model="categoryModel"  :rules="ruleValidate" label-width="120px">
                <el-form-item label="类目名：" prop="name">
                    <el-table border :data="categoryModel.nameTableData" :header-cell-style="{background:'#F5F7FA',color:'#606266'}">
                        <el-table-column min-width="150px" label="*中文cn" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="categoryModel.nameTableData[0].cn" :rules='ruleValidate.attrName'>
                                    <el-input v-model="scope.row.cn" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150px" label="*英文en" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="categoryModel.nameTableData[0].en" :rules='ruleValidate.attrName'>
                                    <el-input v-model="scope.row.en" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150px" label="马来语ms" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="categoryModel.nameTableData[0].ms" :rules='ruleValidate.attrName'>
                                    <el-input v-model="scope.row.ms" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column min-width="150px" label="泰语th" align="center">
                            <template slot-scope="scope">
                                <el-form-item :prop="categoryModel.nameTableData[0].th" :rules='ruleValidate.attrName'>
                                    <el-input v-model="scope.row.th" size="medium" clearable></el-input>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <el-form-item label="类目图：" prop="cover">
                    <el-upload class="avatar-uploader"
                        :multiple="false" :headers="headers" :action="uploadFileUrl" :limit="1"
                        :file-list="imgList" accept="image/jpeg,image/jpg,image/png"
                        :before-upload="onImgBeforeUpload"
                        :on-remove="handleUploadRemove"
                        :on-success="handleUploadSuccess"
                        :name="uploadFileName"
                        list-type="picture-card">
                    <i class="el-icon-plus"></i>
                    <div class="el-upload__tip" slot="tip">尺寸800*800像素以上，大小2M以下，支持jpg/jpeg/png格式。</div>
                </el-upload>
                </el-form-item>
                <el-form-item label="后台类目：" prop="back">
                    <el-tag v-for="tag in tags" :key="tag.name" closable> {{tag.name}}</el-tag>
                    <el-select v-model="categoryModel.category" filterable placeholder="请选择">
                        <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
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

    export default {
        // 前台类目编辑
        name: 'FrontCategoryEdit',
        data() {
            return {
                title: '前台类目编辑',
                categoryModel: {
                   name: '',
                   nameTableData:[
                        {cn: '', en: '', ms: '', th: ''}
                    ],
                },
                ruleValidate: {
                    name: [{
                        required: true,
                        message: '类目名不能为空',
                        trigger: 'blur'
                    }]
                },
                tags: [
                    { name: '标签一' },
                    { name: '标签二'},
                    { name: '标签三' },
                    { name: '标签四' },
                    { name: '标签五' }
                ],
                categoryOptions: [{
                      value: '1',
                      label: '服装'
                    }, {
                      value: '2',
                      label: '箱包'
                    }, {
                      value: '3',
                      label: '电子产品'
                    }
                ],
                uploadFileUrl: '',
                uploadFileName: '',
                headers: this.$headers,
                imgList: [],

            }
        },
        props: {
            dialogVisible: {
                type: Boolean,
                default: false
            }
        },
        components: {
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {
                }
            },
        },
        mounted() {

        },
        methods: {
            cancle() {
                this.$emit('on-cancle')
            },
            comfirm() {},
            onImgBeforeUpload() {},
            handleUploadRemove(file, fileList) {
            },
            handleUploadSuccess(res, file, fileList) {}
        }
    }
</script>

<style lang="scss">
.edit-category-dialog {
    .el-select .el-input {
        width: 400px;
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
    .el-tag {
        margin-right: 10px;
    }
}
</style>
