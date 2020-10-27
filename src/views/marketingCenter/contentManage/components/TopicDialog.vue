<template>
    <div class="subject-edit-dialog">
        <el-dialog :title="editSubjectType==='add'?'添加专题':'编辑专题'" :visible.sync="toggle" width="700px" @close="cancle" :close-on-click-modal="false" :modal-append-to-body="false">
            <div class="cover-pic" v-if="contentType === 3">
                <div class="cover-title">封面图片：</div>
                <c-upload :fileList="pic" @setData="shareImg" :limit="1" accept="image/jpeg,image/jpg,image/png,image/gif"></c-upload>
            </div>
            <table class="table table-bordered table-info">
                <tbody>
                    <tr v-for="(item, index) in languageList" :key="index">
                        <th><span class="required" v-if="item.code === 'cn' || item.code === 'en'">*</span> {{item.desc}}{{item.code}} </th>
                        <td>
                            <el-input v-model="subject[item.code]" clearable size="medium" placeholder="请输入内容"></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import cUpload from '@/components/fileUpload/'
    import multiLangFileUpload from '@/components/multiLangFileUpload/'

    export default {
        // 新增属性值
        name: 'TopicDialog',
        data() {
            return {
                pics:this.pic
            }
        },
        props: {
            editSubjectType: {
                type: String,
                default: 'add'
            },
            dialogVisible: {
                type: Boolean,
                default: false
            },
            subjectObject: {
                type: Object,
                default: () => { return {} }
            },
            contentType: String,
            pic: String
        },
        components: {
            cUpload
        },
        computed: {
            toggle: {
                get: function () {
                    return this.dialogVisible;
                },
                set: function () {}
            },
            languageList () {
                // 多语言
                let languageList = JSON.parse(this.getStore('languageList'))
                return languageList
            },
            subject () {
                return this.subjectObject
            },
        },
        watch:{
            pic: {
                handler (newValue) {
                    console.log(newValue)
                    this.pics = newValue
                }
            }
        },
        methods: {
            reset () {
                _.forEach(this.languageList, item => {
                    this.$set(this.subject, item.code, '')
                })
            },
            cancle () {
                this.$emit('on-cancle')
                this.reset()
            },
            shareImg(res){
                this.pics = this.dealShowFileSrc(res.data)
                console.log(this.pics)
            },
            confirm () {
                if (this.subject.cn === '') {
                    this.$message.error('专题中文不能为空！')
                    return
                }
                if (this.subject.en === '') {
                    this.$message.error('专题名英文不能为空！')
                    return
                }
                console.log(this.subject)
                console.log(this.pics)
                this.$emit('on-confirm', _.cloneDeep(this.subject),this.pics)
                
            }
        }
    }
</script>
<style lang="scss">
    .subject-edit-dialog {
        .cover-pic{
            display: flex;
            .cover-title{
                width: 80px;
            }
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
        .table {
            width: 100%;
            border: 1px solid #DCDFE6;
            border-radius: 4px;
            th {
                background: #f2f2f2;
                width: 120px;
                border: 1px solid #DCDFE6;
            }
            tr td {
                border: 1px solid #DCDFE6;
            }
            td {
                padding: 2px 10px;
            }
            .limit {
                width: 120px;
                text-align: center;
            }
            .required {
                font-size: 16px;
                color: red;
                vertical-align: middle;
            }
        }
    }
</style>