<template>
    <el-dialog
        title="背景设置"
        :visible="dialogBgVisible"
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
                <el-form-item v-if="dialogType == 3" label="背景图" prop="image">
                    <div class="form-tips mar-t-10">建议尺寸：335*170像素以上，大小2M以下；支持jpg、jpeg、png；只能上传一张图片。</div>
                    <multi-lang-file-upload v-if="dialogBgVisible" :propFileList="param.backgroundCover" @setData="setCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
                <el-form-item label="文案色值" prop="backgroundColor">
                    <el-color-picker v-model="param.backgroundColor" size="small"></el-color-picker>
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
    import { updateBackGroundInfo } from '@/request/promotion.js'
    export default {
        props: {
            dialogBgVisible: Boolean,
            countryList: Array,
            propParam: Object,
            dialogType: [String, Number]
        },
        components: {
            multiLangFileUpload
        },
        computed: {
            languageList () {
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
                    backgroundCover: [],
                    startTime: '',
                    endTime: '',
                    type: '',
                    backgroundColor: ''
                },
                loading: false,
                adDialogRules: {
                    startTime: [{ required: true, message: '初始时间不能为空', trigger: 'change' }],
                    backgroundColor: [{ required: true, message: '初始时间不能为空', trigger: 'change' }],
                    endTime: [
                        { required: true, message: '结束时间不能为空', trigger: 'change' },
                        {
                            required: true,
                            message: '结束时间不能小于开始时间',
                            trigger: 'change',
                            validator: (rule, value, callback) => {
                                const startTime = new Date(this.param.startTime)
                                const stopTime = new Date(this.param.endTime)
                                if (startTime >= stopTime) {
                                    callback(new Error('结束时间不能小于开始时间'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ]
                }
            }
        },
        watch: {
            propParam: {
                handler (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(val)))
                },
                deep: true
            },
            dialogBgVisible (val) {
                if (val) {
                    Object.assign(this.param, JSON.parse(JSON.stringify(this.propParam)))
                }
            }
        },
        methods: {
            reset () {
                this.param = {
                    backgroundCover: [],
                    startTime: '',
                    endTime: '',
                    type: '',
                    backgroundColor: ''
                }
                this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
            },
            handleClose () {
                this.reset()
                this.$emit('close')
            },
            setCover (data) {
                this.param.backgroundCover = data
            },
            conformAddItem () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.param.type = this.dialogType
                        updateBackGroundInfo({ backGroundInfo: this.filterData(this.param) }).then((res) => {
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
