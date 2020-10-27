<template>
    <el-dialog
        title="提示"
        :visible="dialogVisible"
        width="800px"
        @close="handleClose">
        <div style="height: 100%; width: 100%">
            <el-form :rules="adDialogRules"
                     ref="addDialog"
                     :model="param"
                     label-position="right"
                     label-width="160px"
                     class="demo-ruleForm">
                <el-form-item label="国家：" prop="countryCode">
                    <el-select v-model="param.countryCode" :disabled="param.bannerId ? true : false" filterable clearable>
                        <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item hide-required-asterisk="false"
                              :label="adDialogTitles.name"
                              prop="name">
                    <el-input v-model="param.name"
                              size="medium"
                              placeholder="请输入内容"
                              maxlength="80"></el-input>
                </el-form-item>
                <el-form-item :label="adDialogTitles.url"
                              prop="url">
                    <el-input v-model="param.url"
                              size="medium"
                              placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item :label="adDialogTitles.background"
                              prop="background">
                    <el-color-picker v-model="param.background" size="small"></el-color-picker>
                </el-form-item>
                <el-form-item :label="adDialogTitles.image"
                              prop="image">
                    <div class="form-tips mar-t-10">建议尺寸：335*170像素以上，大小2M以下；支持jpg、jpeg、png；只能上传一张图片。</div>
                    <multi-lang-file-upload v-if="dialogVisible" :propFileList="param.image" @setData="setCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
                <el-form-item :label="adDialogTitles.startTime"
                              prop="startTime">
                    <el-date-picker size="medium"
                                    v-model="param.startTime"
                                    type="datetime"
                                    value-format="timestamp"
                                    placeholder="请输入开始时间"
                                    :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
                <el-form-item :label="adDialogTitles.endTime"
                              prop="endTime">
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
    import validator from 'validator'
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import { fetchSaveData } from '@/request/promotion.js'
    export default {
        props: {
            dialogVisible: Boolean,
            countryList: Array,
            propParam: Object,
            bannerType: [String, Number] // 1：banner 2：闪屏广告
        },
        components: {
            multiLangFileUpload
        },
        data () {
            return {
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                adDialogTitles: {
                    name: '广告标题：',
                    url: '广告 URL 地址：',
                    image: '广告图：',
                    startTime: '广告开始时间：',
                    endTime: '广告结束时间：',
                    background: '顶栏色值：'
                },
                param: {
                    bannerId: null,
                    name: '',
                    countryCode: '',
                    url: '',
                    background: '#409EFF', // 顶栏色值
                    image: [],
                    bannerType: '',
                    startTime: '',
                    endTime: ''
                },
                loading: false,
                adDialogRules: {
                    name: [{ required: true, message: '标题不能为空', trigger: 'change' }],
                    background: [{ required: true, message: '请输入HEX色值', trigger: 'change' }],
                    countryCode: [{ required: true, message: '标题不能为空', trigger: 'change' }],
                    url: [{
                        required: false,
                        message: '广告 Url 格式不正确',
                        trigger: 'change',
                        validator: (rule, value, callback) => {
                            if (this.param.url && this.param.url.length > 0 && !validator.isURL(this.param.url, { require_protocol: true })) {
                                callback(new Error())
                            } else {
                                callback()
                            }
                        }
                    }],
                    image: [{ required: true, message: '不能为空', trigger: 'change' }],
                    startTime: [{ required: true, message: '初始时间不能为空', trigger: 'change' }],
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
                    Object.assign(this.param, val)
                },
                deep: true
            },
            dialogVisible (val) {
                if (val) {
                    Object.assign(this.param, this.propParam)
                }
            }
        },
        methods: {
            reset () {
                this.param = {
                    bannerId: null,
                    name: '',
                    countryCode: '',
                    url: '',
                    image: [],
                    startTime: '',
                    endTime: '',
                    bannerType: ''
                }
                this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
            },
            handleClose () {
                this.reset()
                this.$emit('close')
            },
            setCover (data) {
                this.param.image = data
            },
            conformAddItem () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        this.param.bannerType = this.bannerType
                        this.loading = true
                        fetchSaveData({ bannerInfo: this.filterData(this.param) }).then((res) => {
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
