<template>
    <el-dialog :title="param.title"
               :visible="dialogVisible"
               width="800px"
               @close="handleClose">
        <div style="height: 100%; width: 100%">
            <el-form
                :rules="adDialogRules"
                ref="addDialog"
                :model="param"
                label-position="right"
                label-width="130px"
                class="demo-ruleForm">
                <el-form-item label="国家：" prop="countryCode" >
                    <el-select v-model="param.countryCode" filterable clearable :disabled="disableding">
                        <el-option v-for="item in countryList" :key="item.shortCode" :label="item.nameLocal" :value="item.shortCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item  label="浮窗名称：" prop="name">
                    <el-input v-model="param.name"
                              size="medium"
                              placeholder="请输入内容"
                              maxlength="20"
                              :disabled="disableding"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接：" prop="url">
                    <el-input v-model="param.url" size="medium" placeholder="请输入内容" :disabled="disableding"></el-input>
                </el-form-item>
                <el-form-item label="浮窗图标：" prop="cover">
                    <multi-lang-file-upload v-if="dialogVisible" :propFileList="param.cover" @setData="setCover" accept="image/jpeg,image/jpg,image/png,image/gif"></multi-lang-file-upload>
                </el-form-item>
                <el-form-item label="开关方式：" prop="timeType" >
                    <template>
                        <el-radio-group v-model="param.timeType" @change="cleanTime()" :disabled="disableding">
                            <el-radio :label="0">手动</el-radio>
                            <el-radio :label="1">定时</el-radio>
                        </el-radio-group>
                    </template>
                </el-form-item>
                <el-form-item :label="adDialogTitles.startTime" prop="startTime" v-if="param.timeType === 1">
                    <el-date-picker
                        :disabled="disableding"
                        size="medium"
                        v-model="param.startTime"
                        type="datetime"
                        placeholder="请输入开始时间"
                        :picker-options="pickerOptions"
                        value-format="timestamp"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item :label="adDialogTitles.endTime" prop="endTime" v-if="param.timeType === 1">
                    <el-date-picker
                        :disabled="disableding"
                        size="medium"
                        v-model="param.endTime"
                        type="datetime"
                        :picker-options="pickerOptions"
                        placeholder="请输入结束时间"
                        value-format="timestamp"
                    ></el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="small" @click="handleClose" >取 消</el-button>
          <el-button size="small" :loading="loading" type="primary" @click="conformAddItem()" v-if="param.type == 'show'" disabled>确 定</el-button>
          <el-button size="small" :loading="loading" type="primary" @click="conformAddItem()" v-else>确 定</el-button>
        </span>
    </el-dialog>
</template>
<script>
    import multiLangFileUpload from '@/components/multiLangFileUpload/'
    import { AddActiveFloating, UpdateActiveFloating } from '@/request/marketing.js'
    export default {
        props: {
            dialogVisible: Boolean,
            countryList: Array,
            propParam: Object,
            disableding: Boolean
        },
        data () {
            return {

                param: {
                    countryCode: '',
                    name: '',
                    url: '',
                    cover: [],
                    startTime: '',
                    endTime: '',
                    timeType: 0 // （0:手动；1:定时）
                },
                loading: false,
                adDialogRules: {
                    countryCode: [{ required: true, message: '标题不能为空', trigger: 'change' }],
                    url: [{ required: true, message: 'URL不能为空', trigger: 'change' }],
                    name: [{ required: true, message: '标题不能为空', trigger: 'change' }],
                    timeType: [{ required: true, message: '定时选项不能为空', trigger: 'change' }],
                    cover: [{ required: true, message: '图片不能为空', trigger: 'change' }],
                    startTime: [
                        { required: true, message: '开始时间不能为空', trigger: 'change' },
                        {
                            trigger: 'change',
                            validator: (rule, value, callback) => {
                                if (value >= this.param.endTime) {
                                    callback(new Error('开始时间不能大于结束时间'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ],
                    endTime: [
                        { required: true, message: '结束时间不能为空', trigger: 'change' },
                        {
                            trigger: 'change',
                            validator: (rule, value, callback) => {
                                if (value <= this.param.startTime) {
                                    callback(new Error('结束时间不能小于开始时间'))
                                } else {
                                    callback()
                                }
                            }
                        }
                    ]
                },
                pickerOptions: {
                    disabledDate (time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                adDialogTitles: {
                    title: '浮窗名称：',
                    url: '跳转链接：',
                    cover: '图片：',
                    startTime: '开始时间：',
                    endTime: '结束时间：'
                }
            }
        },
        watch: {
            propParam: {
                handler (val) {
                    Object.assign(this.param, val)
                },
                deep: true
            }
        },
        created () {
        },
        components: {
            multiLangFileUpload
        },
        methods: {
            cleanTime () {
                this.param.startTime = new Date().getTime()
                this.param.endTime = new Date().getTime()
            },
            reset () {
                this.param = {
                    type: '',
                    countryCode: '',
                    title: '',
                    name: '',
                    timeType: '',
                    cover: [],
                    startTime: '',
                    url: '',
                    endTime: ''
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
                if (this.param.type == 'add') {
                    this.$refs['addDialog'].validate((valid) => {
                        if (valid) {
                            if (this.param.timeType == 0) {
                                this.param.startTime = 2147483645000
                                this.param.endTime = 2147483646000
                            }
                            this.loading = true
                            AddActiveFloating({ activeFloatingInfo: this.filterData(Object.assign(this.param, {
                                switchStatus: 2
                            })) }).then((res) => {
                                this.loading = false
                                if (res.ret.errcode === 1) {
                                    this.$message.success('成功')
                                    this.reset()
                                    this.$emit('confirm')
                                } else {
                                    this.$message.error('添加失败')
                                }
                            }).catch(() => {
                                this.loading = false
                            })
                        }
                    })
                } else if (this.param.type == 'edit') {
                    this.$refs['addDialog'].validate((valid) => {
                        if (valid) {
                            if (this.param.timeType == 0) {
                                this.param.startTime = 2147483645000
                                this.param.endTime = 2147483646000
                            }
                            this.loading = true
                            UpdateActiveFloating({ activeFloatingInfo: this.filterData(this.param) }).then((res) => {
                                this.loading = false
                                if (res.ret.errcode === 1) {
                                    this.$message.success('成功')
                                    this.reset()
                                    this.$emit('confirm')
                                }
                            }).catch((err) => {
                                console.log(err)
                                this.loading = false
                            })
                        }
                    })
                }
            }
        }
    }
</script>
