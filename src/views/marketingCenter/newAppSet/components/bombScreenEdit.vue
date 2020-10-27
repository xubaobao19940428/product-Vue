<template>
    <el-dialog
        :title="title"
        :close-on-click-modal="false"
        :visible="dialogVisible"
        @close="handleClose"
        class="bomb-screen-wrapper"
        width="600px">
        <div style="height: 100%; width: 100%">
            <el-form :rules="rules"
                     ref="addDialog"
                     :model="param"
                     label-position="right"
                     label-width="100px"
                     class="demo-ruleForm">
                <el-form-item label="弹窗名称：" prop="name">
                    <el-input v-model="param.name"></el-input>
                </el-form-item>
                <el-form-item label="选择国家：" prop="countryCode">
                    <el-select v-model="param.countryCode" filterable clearable>
                        <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="弹窗效期：" class="is-required">
                    <div class="tip">按照所选站点的当地时间填写</div>
                    <el-date-picker type="datetimerange" value-format="timestamp"
                        start-placeholder="生效时间" end-placeholder="失效时间"
                        v-model="timeList" :default-time="['00:00:00', '23:59:59']">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="弹出频率："
                              prop="bombStatus">
                    <el-radio-group v-model="param.bombStatus">
                        <el-radio v-for="(val, key) in bombStatusList"
                                  :key="key"
                                  :label="val.key">{{ val.name }}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="弹窗图片：" prop="cover">
                    <div class="form-tips mar-t-10">大小2M以下；支持jpg、jpeg、png；只能上传一张图片。</div>
                    <multi-lang-file-upload v-if="dialogVisible" :propFileList="param.cover" @setData="setCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
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
                    bombStatus: 0,
                    startTime: '',
                    endTime: ''
                },
                timeList: [],
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
                    if (parseInt(val.startTime) && parseInt(val.endTime)) {
                        this.timeList = [val.startTime, val.endTime]
                    }
                    Object.assign(this.param, val)
                },
                deep: true
            },
            dialogVisible (val) {
                if (val) {
                    if (parseInt(val.startTime) && parseInt(val.endTime)) {
                        this.timeList = [val.startTime, val.endTime]
                    }
                    Object.assign(this.param, this.propParam)
                }
            }
        },
        components: {
            multiLangFileUpload
        },
        methods: {
            reset () {
                this.param = {
                    id: null,
                    countryCode: '',
                    name: [],
                    cover: [],
                    status: 1,
                    type: 1,
                    url: '',
                    startTime: '',
                    endTime: '',
                    bombStatus: 0
                }
                this.timeList = []
                this.$refs['addDialog'] && this.$refs['addDialog'].clearValidate()
            },
            handleClose () {
                this.reset()
                this.$emit('close')
            },
            setCover (data) {
                this.param.cover = data
            },
            confirmAddItem () {
                if (!this.timeList || this.timeList.length !== 2) {
                    this.$message.warning('弹窗效期必填')
                    return 
                } else {
                    this.param.startTime = this.timeList[0] + ''
                    this.param.endTime = this.timeList[1] + ''
                }
                this.$refs['addDialog'].validate((valid) => {
                    if (valid) {
                        // for (let i = 0; i < this.$refs['multiLangForm'].length; i++) {
                        //     this.$refs['multiLangForm'][i].validate((isValid) => {
                        //         if (!isValid) {
                        //             canSubmit = false
                        //         }
                        //     })
                        // }
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
                })
            }
        }
    }
</script>

<style lang="scss">
.bomb-screen-wrapper {
    .tip {
        color: #999;
    }
}
</style>
