<template>
    <el-dialog
        :title="dialogTitle"
        :visible="dialogVisible"
        width="800px"
        @close="handleClose">
        <div style="height: 100%; width: 100%">
            <el-form :rules="adDialogRules"
                     ref="addDialog"
                     :model="param"
                     label-suffix="："
                     label-position="right"
                     label-width="160px"
                     class="demo-ruleForm">
                <el-form-item label="国家" prop="countryCode">
                    <el-select v-model="param.countryCode" :disabled="param.id ? true : false" filterable clearable>
                        <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转类型：" prop="urlType">
                    <el-radio-group v-model="param.urlType" @change="param.url = ''">
                        <el-radio v-for="(val, key) in urlType" :key="key" :label="parseInt(key)">{{ val }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳转链接：" prop="url">
                    <el-select v-if="param.urlType == 2" v-model="param.url" filterable>
                        <el-option v-for="(val, key) in appPageEnum" :key="key" :label="val" :value="key"></el-option>
                    </el-select>
                    <el-input v-else v-model="param.url" size="medium" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item :label="adDialogTitles.image"
                              prop="image">
                    <div class="form-tips mar-t-10">建议尺寸：335*170像素以上，大小2M以下；支持jpg、jpeg、png；只能上传一张图片。</div>
                    <multi-lang-file-upload v-if="dialogVisible" :propFileList="param.cover" @setData="setCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
                <el-form-item label="开始时间" prop="startTime">
                    <el-date-picker size="medium"
                                    v-model="param.startTime"
                                    type="datetime"
                                    value-format="timestamp"
                                    placeholder="请输入开始时间"
                                    :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker size="medium"
                                    v-model="param.endTime"
                                    type="datetime"
                                    :picker-options="pickerOptions"
                                    placeholder="请输入结束时间"
                                    value-format="timestamp">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="标题：" prop="title">
                    <div class="flex form-content">
                        <el-select v-model="titleLang" placeholder="请选择">
                            <el-option v-for="(item, i) in langList" :key="i" :label="item.desc" :value="item.code"></el-option>
                        </el-select>
                        <el-form-item v-for="(item, i) in param.title" :key="i"
                                      :rules="{ required: item.languageCode == 'cn' || item.languageCode == 'en' ? true : false, message: '中英文必填', trigger: 'blur' }"
                                      ref="hotWordForm"
                                      :prop="`title[${i}].name`"
                                      v-show="titleLang == item.languageCode" class="flex1 mar-l-10">
                            <el-input v-model="item.name" show-word-limit maxlength="500" type="text" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="handleClose">取 消</el-button>
                <el-button size="small" :loading="loading" type="primary" @click="conformAddItem()">确 定</el-button>
            </span>
    </el-dialog>
</template>
<script>
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import { insertFunctionArea, updateFunctionArea } from '@/request/promotion.js'
    export default {
        props: {
            dialogVisible: Boolean,
            dialogTitle: String,
            countryList: Array,
            propParam: Object,
            urlType: [Object, Array],
            appPageEnum: [Object, Array],
            adDialogTitles: Object
        },
        components: {
            multiLangFileUpload
        },
        computed: {
            langList () {
                return this.$store.state.dict.languageList
            }
        },
        data () {
            return {
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                param: {
                    id: null,
                    countryCode: '',
                    urlType: 1,
                    url: '',
                    startTime: '',
                    endTime: '',
                    title: [],
                    cover: []
                },
                titleLang: 'cn',
                loading: false,
                adDialogRules: {
                    name: [{ required: true, message: '不能为空', trigger: 'change' }],
                    title: [{ required: true, message: '不能为空', trigger: 'change' }],
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }],
                    urlType: [{ required: true, message: '不能为空', trigger: 'change' }],
                    url: [{ required: true, message: '不能为空', trigger: 'change' }]
                }
            }
        },
        watch: {
            propParam: {
                handler (val) {
                    if (val) {
                        Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                        this.initLangData()
                    }
                },
                deep: true
            },
            dialogVisible (val) {
                if (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                    this.initLangData()
                }
            }
        },
        methods: {
            initLangData () {
                for (let i = 0; i < this.langList.length; i++) {
                    let lang = this.langList[i].code
                    let item = this.param.title.find((val) => {
                        return val.languageCode == lang
                    })
                    if (!item) {
                        this.param.title.push({
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
                    urlType: 1,
                    url: '',
                    startTime: '',
                    endTime: '',
                    title: [],
                    cover: []
                }
                this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
            },
            handleClose () {
                this.reset()
                this.$emit('close')
            },
            setCover (data) {
                this.param.cover = data
            },
            conformAddItem () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        let fetchUrl = insertFunctionArea
                        if (this.param.id) {
                            fetchUrl = updateFunctionArea
                        }
                        fetchUrl({ functionAreaInfo: this.filterData(this.param) }).then((res) => {
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
                })
            }
        }
    }
</script>
