<template>
    <el-dialog
        :title="title"
        :visible="dialogVisible"
        @close="handleClose"
        width="600px">
        <div style="height: 100%; width: 100%">
            <el-form :rules="rules"
                     ref="addDialog"
                     :model="param"
                     label-position="right"
                     label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="国家：" prop="countryCode">
                    <el-select v-model="param.countryCode" filterable clearable>
                        <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称：" prop="name">
                    <table class="table table-bordered table-info">
                        <tbody>
                        <tr v-for="(item, index) in param.name" :key="index">
                            <th><span class="required" v-if="item.languageCode === 'cn' || item.languageCode === 'en'">*</span> {{ getLangName(item.languageCode) }}： </th>
                            <td>
                                <el-form-item ref="multiLangForm" :required="item.languageCode === 'cn' || item.languageCode === 'en' ? true : false"  :prop="`name[${index}].name`">
                                    <el-input v-model="item.name" clearable size="medium" placeholder="请输入"></el-input>
                                </el-form-item>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </el-form-item>
                <el-form-item label="跳转类型：" prop="type">
                    <el-radio-group v-model="param.type">
                        <el-radio v-for="(val, key) in typeList"
                                  :key="key"
                                  :label="val.key">{{ val.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳转链接：" prop="url">
                    <el-input v-model="param.url" size="medium" placeholder="请输入跳转链接"></el-input>
                </el-form-item>
                <el-form-item label="弹屏状态："
                              prop="bombStatus">
                    <el-radio-group v-model="param.bombStatus">
                        <el-radio v-for="(val, key) in bombStatusList"
                                  :key="key"
                                  :label="val.key">{{ val.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="中文图片：" prop="cover">
                    <div class="form-tips mar-t-10">大小2M以下；支持jpg、jpeg、png；只能上传一张图片。</div>
                    <multi-lang-file-upload v-if="dialogVisible" :propFileList="param.cover" @setData="setCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleClose">取 消</el-button>
                <el-button size="small" :loading="loading" type="primary" @click="confirmAddItem()">确 定</el-button>
            </span>
    </el-dialog>
</template>
<script>
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import { addBombScreen, updateBombScreen } from '@/request/promotion.js'
    export default {
        props: {
            dialogVisible: Boolean,
            title: String,
            propParam: Object,
            langList: Array,
            typeList: Array,
            bombStatusList: Array,
            countryList: Array
        },
        data () {
            return {
                param: {
                    id: null,
                    countryCode: '',
                    name: [],
                    cover: [],
                    status: 1,
                    type: 1,
                    url: '',
                    bombStatus: 0
                },
                loading: false,
                rules: {
                    name: [{ required: true, message: '不能为空', trigger: 'change' }],
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }],
                    cover: [{ required: true, message: '不能为空', trigger: 'change' }],
                    type: [{ required: true, message: '不能为空', trigger: 'change' }],
                    bombStatus: [{ required: true, message: '不能为空', trigger: 'change' }],
                    url: [{ required: true, message: '不能为空', trigger: 'change' }]
                }
            }
        },
        watch: {
            propParam: {
                handler (val) {
                    Object.assign(this.param, val)
                    this.init()
                },
                deep: true
            },
            dialogVisible (val) {
                if (val) {
                    Object.assign(this.param, this.propParam)
                    this.init()
                }
            }
        },
        components: {
            multiLangFileUpload
        },
        methods: {
            init () {
                for (let i = 0; i < this.langList.length; i++) {
                    let lang = this.langList[i].code
                    let name = this.param.name.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!name) {
                        this.param.name.push({
                            languageCode: lang,
                            name: ''
                        })
                    }
                }
            },
            reset () {
                this.param = {
                    id: null,
                    countryCode: '',
                    name: [],
                    cover: [],
                    status: 1,
                    type: 1,
                    url: '',
                    bombStatus: 0
                }
                this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
                for (let i = 0; i < this.$refs['multiLangForm'].length; i++) {
                    this.$refs['multiLangForm'][i].clearValidate()
                }
            },
            getLangName (code) {
                let item = this.langList.find((val) => {
                    return val.code == code
                })
                return item ? item.desc : ''
            },
            handleClose () {
                this.reset()
                this.$emit('close')
            },
            setCover (data) {
                this.param.cover = data
            },
            confirmAddItem () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        let canSubmit = true
                        for (let i = 0; i < this.$refs['multiLangForm'].length; i++) {
                            this.$refs['multiLangForm'][i].validate((isValid) => {
                                if (!isValid) {
                                    canSubmit = false
                                }
                            })
                        }
                        if (canSubmit) {
                            let fetchUrl = addBombScreen
                            if (this.param.id) {
                                fetchUrl = updateBombScreen
                            }
                            this.loading = true
                            fetchUrl({ bombScreenInfo: this.filterData(this.param) }).then((res) => {
                                this.loading = false
                                if (res.ret.errcode === 1) {
                                    this.$message.success('成功')
                                    this.reset()
                                    this.$emit('confirm')
                                }
                            }).catch(() => {
                                this.loading = false
                            })
                        }
                    }
                })
            }
        }
    }
</script>
