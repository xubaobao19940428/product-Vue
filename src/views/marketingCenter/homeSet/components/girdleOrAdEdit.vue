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
                    <el-select v-model="param.countryCode"  :disabled="param.girdleId ? true : false" filterable clearable>
                        <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="标题：" prop="title">
                    <el-input v-model="param.title" size="medium" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="用户类型" prop="activeCrowdType" required v-show="type == 4">
                    <el-select v-model="param.activeCrowdType" placeholder="请选择" size="medium">
                        <el-option v-for="item in activeCrowdTypeArray" :key="item.key"
                            :label="item.name"
                            :value="item.key"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="跳转类型：" prop="urlType">
                    <el-radio-group v-model="param.urlType" @change="param.url = ''">
                        <el-radio v-for="(val, key) in urlType" :key="key" :label="parseInt(key)">{{ val }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="跳转链接：" prop="linkUrl">
                    <el-select v-if="param.urlType == 2" v-model="param.linkUrl" filterable>
                        <el-option v-for="(val, key) in appPageEnum" :key="key" :label="val" :value="key"></el-option>
                    </el-select>
                    <el-input v-else v-model="param.linkUrl" size="medium" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="腰封图" prop="imgUrl">
                    <multi-lang-file-upload v-if="dialogVisible" :propFileList="param.imgUrl" @setData="setCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
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
    import { saveGirdle } from '@/request/promotion.js'
    export default {
        props: {
            dialogVisible: Boolean,
            dialogTitle: String,
            countryList: Array,
            propParam: Object,
            urlType: [Object, Array],
            appPageEnum: [Object, Array],
            type: [String, Number] // 利用这个识别是哪里调用 4 - 腰封 6 - 平台广告位
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
                activeCrowdTypeArray: [{
                    key: 0,
                    name: '全部'
                }, {
                    key: 1,
                    name: '新用户'
                }, {
                    key: 2,
                    name: '老用户'
                }],
                checkAll: false,
                param: {
                    girdleId: null,
                    type: '',
                    countryCode: '',
                    title: '',
                    imgUrl: [],
                    urlType: 1,
                    linkUrl: '',
                    startTime: '',
                    endTime: '',
                    activeCrowdType: 0 // 用户类型
                },
                titleLang: 'cn',
                loading: false,
                adDialogRules: {
                    imgUrl: [{ required: true, message: '不能为空', trigger: 'change' }],
                    title: [{ required: true, message: '不能为空', trigger: 'change' }],
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }],
                    urlType: [{ required: true, message: '不能为空', trigger: 'change' }],
                    linkUrl: [{ required: true, message: '不能为空', trigger: 'change' }]
                }
            }
        },
        watch: {
            propParam: {
                handler (val) {
                    if (val) {
                        Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                    }
                },
                deep: true
            },
            dialogVisible (val) {
                if (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                }
            }
        },
        methods: {
            reset () {
                this.param = {
                    girdleId: null,
                    countryCode: '',
                    title: '',
                    type: '',
                    imgUrl: [],
                    urlType: 1,
                    linkUrl: '',
                    startTime: '',
                    activeCrowdType: 0,
                    endTime: ''
                }
                this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
            },
            handleClose () {
                this.reset()
                this.$emit('close')
            },
            setCover (data) {
                this.param.imgUrl = data
            },
            conformAddItem () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        let temp = JSON.parse(JSON.stringify(this.param))
                        temp.type = this.type
                        if (this.type != 4) {
                            delete temp.activeCrowdType
                        }
                        saveGirdle({ girdleInfo: this.filterData(temp) }).then((res) => {
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
