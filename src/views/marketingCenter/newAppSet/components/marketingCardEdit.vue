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
                    <el-select v-model="param.countryCode" :disabled="param.boxcardId ? true : false" filterable clearable>
                        <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="名称：" prop="name">
                    <el-input v-model="param.name" size="medium" placeholder="请输入内容"></el-input>
                </el-form-item>
                <el-form-item label="曝光人群：" prop="activeCrowdType">
                    <el-radio-group v-model="param.activeCrowdType">
                        <el-radio v-for="item in activeCrowdTypeList"
                            :key="item.key"
                            :label="item.key"
                        >{{ item.name }}</el-radio>
                    </el-radio-group>
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
                <el-form-item label="首页广告图"
                              prop="image">
                    <div class="form-tips mar-t-10">建议尺寸：335*170像素以上，大小2M以下；支持jpg、jpeg、png；只能上传一张图片。</div>
                    <multi-lang-file-upload v-if="dialogVisible" :propFileList="param.image" @setData="setCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
                <el-form-item label="列表banner图"
                              prop="bannerImage">
                    <div class="form-tips mar-t-10">建议尺寸：335*170像素以上，大小2M以下；支持jpg、jpeg、png；只能上传一张图片。</div>
                    <multi-lang-file-upload v-if="dialogVisible" :propFileList="param.bannerImage" @setData="setBannerCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
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
    import { SaveBoxcard } from '@/request/promotion.js'
    export default {
        props: {
            dialogVisible: Boolean,
            dialogTitle: String,
            countryList: Array,
            propParam: Object,
            urlType: [Object, Array],
            appPageEnum: [Object, Array],
            cardType: [String, Number]
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
                param: {
                    boxcardId: null,
                    countryCode: '',
                    type: 1,
                    urlType: 1,
                    url: '',
                    startTime: '',
                    endTime: '',
                    name: '',
                    bannerImage: [],
                    image: [],
                    activeCrowdType: 0
                },
                titleLang: 'cn',
                loading: false,
                adDialogRules: {
                    name: [{ required: true, message: '不能为空', trigger: 'change' }],
                    image: [{ required: true, message: '不能为空', trigger: 'change' }],
                    bannerImage: [{ required: true, message: '不能为空', trigger: 'change' }],
                    countryCode: [{ required: true, message: '不能为空', trigger: 'change' }],
                    url: [{ required: true, message: '不能为空', trigger: 'change' }],
                    urlType: [{ required: true, message: '不能为空', trigger: 'change' }]
                },
                activeCrowdTypeList: [{
                    key: 0,
                    name: '所有用户'
                }, {
                    key: 1,
                    name: '仅新用户'
                }, {
                    key: 2,
                    name: '仅老用户'
                }],
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
                    boxcardId: null,
                    type: 1,
                    countryCode: '',
                    urlType: 1,
                    url: '',
                    startTime: '',
                    endTime: '',
                    name: '',
                    bannerImage: [],
                    activeCrowdType: 0,
                    image: []
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
            setBannerCover (data) {
                this.param.bannerImage = data
            },
            conformAddItem () {
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.param.cardType = this.cardType
                        SaveBoxcard({ boxcardInfo: this.filterData(this.param) }).then((res) => {
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
