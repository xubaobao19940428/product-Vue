<template>
    <div class="subject-edit-dialog">
        <el-dialog :title="editColumnType==='add'?'添加专栏':'编辑专栏'" :visible.sync="toggle" width="920px" @close="cancle" :close-on-click-modal="false" :modal-append-to-body="false">
           <div class="column-dialog">
               <div class="column-type" v-if="editColumnType==='add'">
                   <div class="top">频道类型</div>
                   <el-radio-group v-model="radio" @change="radioChange">
                        <el-radio :label="3">
                            <div class="radio-content">
                                <div class="title">瀑布流</div>
                                <div class="content">以视频/组图为主的信息流类型，适合以图像信息引流的内容形式，带有二级详情页</div>
                            </div>
                        </el-radio>
                        <el-radio :label="2">
                            <div class="radio-content">
                                <div class="title">Feed流</div>
                                <div class="content">图文平铺的信息流类型，适合承载发圈、等素材的内容形式，无二级详情页</div>
                            </div>
                        </el-radio>
                        <el-radio :label="1">
                            <div class="radio-content">
                                <div class="title">图文内容</div>
                                <div class="content">长文章内容类型，可加入文字、视频内容，适合用户教育、资讯报道、体验式长文的内容形式，带有专题、Banner</div>
                            </div>
                        </el-radio>
                    </el-radio-group>
               </div>
               <div class="column-title">
                   <div class="top">频道标题</div>
                   <table class="table table-bordered table-info">
                        <tbody>
                            <tr v-for="(item, index) in languageList" :key="index">
                                <th><span class="required" v-if="item.code === 'cn' || item.code === 'en'">*</span> {{item.desc}}{{item.code}} </th>
                                <td>
                                    <el-input v-model="column[item.code]" clearable size="medium" placeholder="请输入内容"></el-input>
                                </td>
                            </tr>
                        </tbody>
                    </table>
               </div>
           </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancle" size="small">取 消</el-button>
                <el-button type="primary" @click="confirm" size="small">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import multiLangFileUpload from '@/components/multiLangFileUpload/'

    export default {
        // 新增属性值
        name: 'columnDialog',
        data() {
            return {
                radio:1
            }
        },
        props: {
            editColumnType: {
                type: String,
                default: 'add'
            },
            dialogVisible: {
                type: Boolean,
                default: false
            },
            columnObject: {
                type: Object,
                default: () => { return {} }
            },
            contentType: String
        },
        components: {
            multiLangFileUpload
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
                console.log(languageList)
                return languageList
            },
            column () {
                return this.columnObject
            },
        },
        methods: {
            reset () {
                _.forEach(this.languageList, item => {
                    this.$set(this.column, item.code, '')
                })
            },
            cancle () {
                this.$emit('on-cancle')
                this.reset()
            },
            confirm () {
                if (this.column.cn === '') {
                    this.$message.error('专题中文不能为空！')
                    return
                }
                if (this.column.en === '') {
                    this.$message.error('专题名英文不能为空！')
                    return
                }
                console.log(this.column)
                this.$emit('on-confirm', _.cloneDeep(this.column),this.radio)
                
            }
        }
    }
</script>
<style lang="scss">
    .subject-edit-dialog {
        .column-dialog{
            display: flex;
            .column-type,.column-title{
                padding: 10px;
                margin-right: 20px;
                border:1px solid rgb(102,102,102);
                .top{
                    margin-bottom: 10px;
                    padding-bottom: 10px;
                    border-bottom:1px solid rgb(102,102,102);
                    font-size: 20px;
                }
            }
            .column-title{
                width: 100%;
            }
            .el-radio{
                display: flex;
            }
            .radio-content{
                width: 350px;
                margin: 0 0 20px 0;
                .title{
                    margin-bottom: 10px;
                    font-size: 20px;
                    font-weight: 600;
                }
                .content{
                    white-space:normal;
                    word-break:break-all;
                    overflow:hidden;
                    font-weight: 500;
                }
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